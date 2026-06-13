import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { clawbackTransaction } from "@/lib/commission-engine"

// Stripe sends raw bytes; we must read the body as text for signature checks.
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // No secret configured yet (sandbox): parse without verification but warn.
      console.warn("[v0] STRIPE_WEBHOOK_SECRET not set — processing webhook without signature verification")
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    console.error("[v0] webhook signature verification failed:", err instanceof Error ? err.message : err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // A refund or dispute means we must claw back the referral commission.
  if (
    event.type === "charge.refunded" ||
    event.type === "refund.created" ||
    event.type === "charge.dispute.created"
  ) {
    const object = event.data.object as { metadata?: Record<string, string>; transfer_group?: string; payment_intent?: string }
    const transactionId =
      object.metadata?.transaction_id || object.transfer_group || (typeof object.payment_intent === "string" ? object.payment_intent : undefined)

    if (transactionId) {
      try {
        const result = await clawbackTransaction(transactionId)
        console.log(`[v0] clawback for ${transactionId}: reversed ${result.reversed} entr(ies), $${result.totalReversed}`)
      } catch (err) {
        console.error("[v0] webhook clawback failed:", err)
        return NextResponse.json({ error: "Clawback failed" }, { status: 500 })
      }
    } else {
      console.warn("[v0] refund webhook missing transaction_id metadata; nothing to claw back")
    }
  }

  return NextResponse.json({ received: true })
}
