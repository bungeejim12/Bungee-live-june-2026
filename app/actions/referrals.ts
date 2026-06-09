"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { getDirectDb } from "@/lib/supabase/db"
import { createClient } from "@/lib/supabase/server"
import type { ReferrerInfo } from "@/lib/referrals"

async function lookupReferrerByCode(code: string): Promise<ReferrerInfo | null> {
  const normalized = code.trim().toUpperCase()

  const admin = createAdminClient()
  if (admin) {
    const { data, error } = await admin.rpc('get_referrer_by_code', { code: normalized })
    if (!error && data?.length) return data[0] as ReferrerInfo

    const { data: profile } = await admin
      .from('profiles')
      .select('id, first_name, last_name, user_type, referral_code')
      .eq('referral_code', normalized)
      .maybeSingle()

    if (profile) return profile as ReferrerInfo
  }

  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, user_type, referral_code')
      .eq('referral_code', normalized)
      .maybeSingle()

    if (profile) return profile as ReferrerInfo
  } catch {
    // publishable key may be missing in server context
  }

  const db = getDirectDb()
  if (db) {
    const rows = await db<ReferrerInfo[]>`
      select id, first_name, last_name, user_type, referral_code
      from public.profiles
      where referral_code = ${normalized}
      limit 1
    `
    if (rows[0]) return rows[0]
  }

  return null
}

export async function getReferrerByCode(code: string): Promise<ReferrerInfo | null> {
  if (!code?.trim()) return null
  return lookupReferrerByCode(code)
}

function generateReferralCode() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
}

export async function completeSignupProfile({
  userId,
  phone,
  firstName,
  lastName,
  businessName,
  userType,
  referralCode,
}: {
  userId: string
  phone: string
  firstName: string
  lastName: string
  businessName: string | null
  userType: 'bungee' | 'business'
  referralCode?: string | null
}) {
  let referredBy: string | null = null
  let referrerId: string | null = null

  if (referralCode?.trim()) {
    const referrer = await lookupReferrerByCode(referralCode)
    if (referrer && referrer.id !== userId) {
      referredBy = referrer.id
      referrerId = referrer.id
    }
  }

  const admin = createAdminClient()
  if (admin) {
    const { data: existing } = await admin
      .from('profiles')
      .select('referral_code')
      .eq('id', userId)
      .maybeSingle()

    const profilePayload: Record<string, unknown> = {
      id: userId,
      phone,
      first_name: firstName,
      last_name: lastName,
      business_name: businessName,
      user_type: userType,
      phone_verified: true,
      updated_at: new Date().toISOString(),
    }

    if (referredBy) profilePayload.referred_by = referredBy

    if (!existing?.referral_code) {
      const { data: codeData } = await admin.rpc('generate_referral_code')
      profilePayload.referral_code = codeData || generateReferralCode()
    }

    const { error: profileError } = await admin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    if (referrerId) {
      const { data: profile } = await admin
        .from('profiles')
        .select('referral_code')
        .eq('id', userId)
        .single()

      await admin.from('referrals').upsert(
        {
          referrer_id: referrerId,
          referred_user_id: userId,
          referral_code: referralCode?.trim().toUpperCase() || profile?.referral_code,
          channel: 'link',
        },
        { onConflict: 'referred_user_id' },
      )
    }

    return { success: true }
  }

  const db = getDirectDb()
  if (!db) {
    return { success: false, error: 'Database not configured' }
  }

  const existing = await db<{ referral_code: string | null }[]>`
    select referral_code from public.profiles where id = ${userId} limit 1
  `

  const newCode = existing[0]?.referral_code || generateReferralCode()

  await db`
    insert into public.profiles (
      id, phone, first_name, last_name, business_name, user_type,
      phone_verified, referred_by, referral_code, updated_at
    ) values (
      ${userId}::uuid, ${phone}, ${firstName}, ${lastName}, ${businessName}, ${userType},
      true, ${referredBy}::uuid, ${newCode}, now()
    )
    on conflict (id) do update set
      phone = excluded.phone,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      business_name = excluded.business_name,
      user_type = excluded.user_type,
      phone_verified = true,
      referred_by = coalesce(excluded.referred_by, public.profiles.referred_by),
      referral_code = coalesce(public.profiles.referral_code, excluded.referral_code),
      updated_at = now()
  `

  if (referrerId) {
    await db`
      insert into public.referrals (referrer_id, referred_user_id, referral_code, channel)
      values (
        ${referrerId}::uuid,
        ${userId}::uuid,
        ${referralCode?.trim().toUpperCase() || newCode},
        'link'
      )
      on conflict (referred_user_id) do nothing
    `
  }

  return { success: true }
}
