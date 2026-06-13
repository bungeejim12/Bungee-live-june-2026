import "server-only"

import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe, isStripeConfigured } from "@/lib/stripe"
import { monthsActiveSince, RESIDUAL_TIERS, SERVICE_FEE_RATE, RESIDUAL_WINDOW_MONTHS } from "@/lib/payments"

// ---------------------------------------------------------------------------
// Automated Commission Decay Engine
// ---------------------------------------------------------------------------
// Stripe moves money; THIS module owns the math. For every fee-bearing
// transaction it: (1) finds the referral, (2) computes the tiered residual off
// the 30% service fee based on the referral's tenure, (3) writes an immutable
// ledger row, and (4) moves funds via a Stripe Connect transfer. Refunds are
// reversed via clawbacks. All money math is done in integer CENTS.

const toCents = (dollars: number) => Math.round(dollars * 100)
const toDollars = (cents: number) => Math.round(cents) / 100

export interface CommissionTier {
  label: string
  startMonth: number
  endMonth: number
  rate: number
}

export interface CommissionConfig {
  serviceFeeRate: number
  windowMonths: number
  tiers: CommissionTier[]
}

// Hardcoded defaults mirror lib/payments.ts and act as a safe fallback ONLY if
// the DB config row can't be read. The live money path always prefers the DB.
const DEFAULT_CONFIG: CommissionConfig = {
  serviceFeeRate: SERVICE_FEE_RATE,
  windowMonths: RESIDUAL_WINDOW_MONTHS,
  tiers: RESIDUAL_TIERS.map((t) => ({ ...t })),
}

/** Read the adjustable engine configuration from the DB (with safe fallback). */
export async function getCommissionConfig(): Promise<CommissionConfig> {
  const supabase = createAdminClient()
  if (!supabase) return DEFAULT_CONFIG

  const { data, error } = await supabase
    .from("commission_config")
    .select("service_fee_rate, window_months, tiers")
    .eq("id", 1)
    .single()

  if (error || !data) {
    console.error("[v0] commission config read failed, using defaults:", error?.message)
    return DEFAULT_CONFIG
  }

  return {
    serviceFeeRate: Number(data.service_fee_rate),
    windowMonths: Number(data.window_months),
    tiers: (data.tiers as CommissionTier[]) ?? DEFAULT_CONFIG.tiers,
  }
}

function rateForMonth(month: number, config: CommissionConfig): { rate: number; tier: CommissionTier | null } {
  if (month < 1 || month > config.windowMonths) return { rate: 0, tier: null }
  const tier = config.tiers.find((t) => month >= t.startMonth && month <= t.endMonth) ?? null
  return { rate: tier ? tier.rate : 0, tier }
}

export interface CommissionCalculation {
  grossPayout: number
  serviceFeeCollected: number
  referralMonth: number
  commissionRate: number
  tierLabel: string | null
  commissionApplied: number
  withinWindow: boolean
}

/**
 * Pure calculation: given a gross worker payout and the referral start date,
 * compute the service fee and the tiered residual owed to the referrer.
 * This is always run BEFORE any Stripe call so we transfer an exact amount.
 */
export function calculateCommission(args: {
  grossPayout: number
  referralStartDate: string
  config: CommissionConfig
  now?: number
}): CommissionCalculation {
  const { grossPayout, referralStartDate, config, now = Date.now() } = args

  const grossCents = toCents(grossPayout)
  const serviceFeeCents = Math.round(grossCents * config.serviceFeeRate)
  const month = monthsActiveSince(referralStartDate, now)
  const { rate, tier } = rateForMonth(month, config)
  const commissionCents = Math.round(serviceFeeCents * rate)

  return {
    grossPayout: toDollars(grossCents),
    serviceFeeCollected: toDollars(serviceFeeCents),
    referralMonth: month,
    commissionRate: rate,
    tierLabel: tier?.label ?? null,
    commissionApplied: toDollars(commissionCents),
    withinWindow: rate > 0,
  }
}

export interface RecordCommissionInput {
  transactionId: string
  grossPayout: number // worker payout (gross), in dollars
  referredId: string // profile id of the account whose activity generated the fee
  now?: number
}

export interface RecordCommissionResult {
  recorded: boolean
  skipped?: boolean
  reason?: string
  ledgerId?: string
  status?: string
  commissionApplied?: number
  stripeTransferId?: string
  calculation?: CommissionCalculation
}

/**
 * Full transaction flow: resolve referral → calculate → write ledger → transfer.
 * Idempotent on (transaction_id, commission entry): a repeat call for an
 * already-recorded transaction is a no-op.
 */
export async function recordCommissionForTransaction(
  input: RecordCommissionInput,
): Promise<RecordCommissionResult> {
  const supabase = createAdminClient()
  if (!supabase) return { recorded: false, reason: "supabase_unconfigured" }

  // Idempotency: don't double-record the same transaction's commission.
  const { data: existing } = await supabase
    .from("commission_ledger")
    .select("id, status, commission_applied")
    .eq("transaction_id", input.transactionId)
    .eq("entry_type", "commission")
    .maybeSingle()

  if (existing) {
    return {
      recorded: false,
      reason: "already_recorded",
      ledgerId: existing.id,
      status: existing.status,
      commissionApplied: Number(existing.commission_applied),
    }
  }

  // Resolve the referral relationship for the account that generated the fee.
  const { data: referral } = await supabase
    .from("referrals")
    .select("id, referrer_id, referral_start_date, status")
    .eq("referred_user_id", input.referredId)
    .maybeSingle()

  if (!referral) {
    // No referrer to pay — nothing to record.
    return { recorded: false, skipped: true, reason: "no_referral" }
  }

  const config = await getCommissionConfig()
  const calc = calculateCommission({
    grossPayout: input.grossPayout,
    referralStartDate: referral.referral_start_date,
    config,
    now: input.now,
  })

  // Decide the entry status before touching Stripe.
  let status: "pending" | "skipped" = "pending"
  let notes: string | null = null
  if (referral.status !== "active") {
    status = "skipped"
    notes = `referral_${referral.status}`
  } else if (!calc.withinWindow) {
    status = "skipped"
    notes = "past_18_month_window"
  }

  const { data: entry, error: insertError } = await supabase
    .from("commission_ledger")
    .insert({
      transaction_id: input.transactionId,
      referral_id: referral.id,
      recipient_id: referral.referrer_id,
      referred_id: input.referredId,
      gross_payout_amount: calc.grossPayout,
      service_fee_collected: calc.serviceFeeCollected,
      commission_rate: calc.commissionRate,
      tier_label: calc.tierLabel,
      referral_month: calc.referralMonth,
      commission_applied: calc.commissionApplied,
      entry_type: "commission",
      status,
      notes,
    })
    .select("id")
    .single()

  if (insertError || !entry) {
    console.error("[v0] ledger insert failed:", insertError?.message)
    return { recorded: false, reason: "ledger_insert_failed" }
  }

  // If skipped or zero, we're done — the ledger row is the record.
  if (status === "skipped" || calc.commissionApplied <= 0) {
    return {
      recorded: true,
      skipped: status === "skipped",
      reason: notes ?? undefined,
      ledgerId: entry.id,
      status,
      commissionApplied: calc.commissionApplied,
      calculation: calc,
    }
  }

  // Move money via Stripe Connect — only if the recipient has a connected
  // account. Otherwise the commission stays 'pending' until they onboard.
  const { data: recipient } = await supabase
    .from("profiles")
    .select("stripe_connect_account_id")
    .eq("id", referral.referrer_id)
    .maybeSingle()

  const destination = recipient?.stripe_connect_account_id

  if (!destination) {
    await supabase
      .from("commission_ledger")
      .update({ notes: "awaiting_connect_account" })
      .eq("id", entry.id)
    return {
      recorded: true,
      ledgerId: entry.id,
      status: "pending",
      commissionApplied: calc.commissionApplied,
      reason: "awaiting_connect_account",
      calculation: calc,
    }
  }

  try {
    const transfer = await stripe.transfers.create({
      amount: toCents(calc.commissionApplied),
      currency: "usd",
      destination,
      transfer_group: input.transactionId,
      metadata: { ledger_id: entry.id, transaction_id: input.transactionId, kind: "referral_residual" },
    })

    await supabase
      .from("commission_ledger")
      .update({ status: "paid", stripe_transfer_id: transfer.id })
      .eq("id", entry.id)

    return {
      recorded: true,
      ledgerId: entry.id,
      status: "paid",
      commissionApplied: calc.commissionApplied,
      stripeTransferId: transfer.id,
      calculation: calc,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "transfer_failed"
    console.error("[v0] Stripe transfer failed:", message)
    await supabase
      .from("commission_ledger")
      .update({ status: "failed", notes: message.slice(0, 480) })
      .eq("id", entry.id)
    return {
      recorded: true,
      ledgerId: entry.id,
      status: "failed",
      commissionApplied: calc.commissionApplied,
      reason: message,
      calculation: calc,
    }
  }
}

export interface ClawbackResult {
  reversed: number
  totalReversed: number
  details: Array<{ ledgerId: string; amount: number; transferReversed: boolean }>
}

/**
 * Clawback: when a transaction is refunded, reverse every commission it
 * generated. Reverses the Stripe transfer (if money already moved) and writes
 * an offsetting negative ledger entry so the paper trail stays intact.
 */
export async function clawbackTransaction(transactionId: string): Promise<ClawbackResult> {
  const supabase = createAdminClient()
  if (!supabase) return { reversed: 0, totalReversed: 0, details: [] }

  const { data: entries } = await supabase
    .from("commission_ledger")
    .select("*")
    .eq("transaction_id", transactionId)
    .eq("entry_type", "commission")
    .in("status", ["paid", "pending"])

  const details: ClawbackResult["details"] = []
  let totalReversedCents = 0

  for (const entry of entries ?? []) {
    const amount = Number(entry.commission_applied)
    const amountCents = toCents(amount)
    let transferReversed = false

    // Reverse the Stripe transfer if funds already moved.
    if (entry.status === "paid" && entry.stripe_transfer_id) {
      try {
        await stripe.transfers.createReversal(entry.stripe_transfer_id, {
          amount: amountCents,
          metadata: { reason: "transaction_refunded", transaction_id: transactionId },
        })
        transferReversed = true
      } catch (err) {
        console.error("[v0] transfer reversal failed:", err instanceof Error ? err.message : err)
      }
    }

    // Offsetting clawback ledger entry (negative amount).
    await supabase.from("commission_ledger").insert({
      transaction_id: transactionId,
      referral_id: entry.referral_id,
      recipient_id: entry.recipient_id,
      referred_id: entry.referred_id,
      gross_payout_amount: entry.gross_payout_amount,
      service_fee_collected: entry.service_fee_collected,
      commission_rate: entry.commission_rate,
      tier_label: entry.tier_label,
      referral_month: entry.referral_month,
      commission_applied: -amount,
      entry_type: "clawback",
      status: "reversed",
      reverses_entry_id: entry.id,
      stripe_transfer_id: entry.stripe_transfer_id,
      notes: transferReversed ? "stripe_transfer_reversed" : "no_transfer_to_reverse",
    })

    // Mark the original entry as reversed.
    await supabase.from("commission_ledger").update({ status: "reversed" }).eq("id", entry.id)

    totalReversedCents += amountCents
    details.push({ ledgerId: entry.id, amount, transferReversed })
  }

  return {
    reversed: details.length,
    totalReversed: toDollars(totalReversedCents),
    details,
  }
}
