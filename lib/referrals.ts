export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Optional tracking tag that marks how the referred account should be classified.
// `bungee` tags the new signup as a Bungee referrer so the 18-month residual
// splits calculate against the correct side of the network.
export type ReferralTrackTag = "bungee" | "business"

export function buildInviteLink(referralCode: string, as?: ReferralTrackTag) {
  const base = `${getAppUrl()}/invite/${referralCode}`
  return as ? `${base}?as=${as}` : base
}

export function buildSignUpLink(referralCode: string, as?: ReferralTrackTag) {
  const params = new URLSearchParams({ ref: referralCode })
  if (as) params.set("as", as)
  return `${getAppUrl()}/auth/sign-up?${params.toString()}`
}

export interface ReferrerInfo {
  id: string
  first_name: string | null
  last_name: string | null
  user_type: string | null
  referral_code: string
}

export function getReferrerDisplayName(referrer: ReferrerInfo) {
  const name = [referrer.first_name, referrer.last_name].filter(Boolean).join(' ')
  return name || 'A Bungee member'
}

export interface ReferredUserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  user_type: string | null
  business_name: string | null
  phone_verified: boolean | null
}

export interface UserReferral {
  id: string
  referral_code: string
  channel: string
  created_at: string
  referred_user: ReferredUserProfile | null
}

export interface ReferralStats {
  totalReferrals: number
  businessReferrals: number
  bungeeReferrals: number
  verifiedReferrals: number
  successRate: number
  bungeeScore: number
  level: number
  xp: number
  xpToNext: number
  totalEarned: number
}

export function getProfileDisplayName(profile: {
  first_name?: string | null
  last_name?: string | null
  business_name?: string | null
  user_type?: string | null
}) {
  if (profile.user_type === 'business' && profile.business_name) {
    return profile.business_name
  }
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
  return name || 'New member'
}

export function computeReferralStats(referrals: UserReferral[]): ReferralStats {
  const totalReferrals = referrals.length
  const businessReferrals = referrals.filter((r) => r.referred_user?.user_type === 'business').length
  const bungeeReferrals = referrals.filter((r) => r.referred_user?.user_type === 'bungee').length
  const verifiedReferrals = referrals.filter((r) => r.referred_user?.phone_verified).length
  const successRate = totalReferrals > 0 ? Math.round((verifiedReferrals / totalReferrals) * 100) : 0
  const totalXp = totalReferrals * 100

  return {
    totalReferrals,
    businessReferrals,
    bungeeReferrals,
    verifiedReferrals,
    successRate,
    bungeeScore: totalXp,
    level: Math.floor(totalXp / 500) + 1,
    xp: totalXp % 500,
    xpToNext: 500,
    totalEarned: 0,
  }
}

export function formatReferralDate(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
