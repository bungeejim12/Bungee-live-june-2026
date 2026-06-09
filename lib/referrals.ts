export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export function buildInviteLink(referralCode: string) {
  return `${getAppUrl()}/invite/${referralCode}`
}

export function buildSignUpLink(referralCode: string) {
  return `${getAppUrl()}/auth/sign-up?ref=${encodeURIComponent(referralCode)}`
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
