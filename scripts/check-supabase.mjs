import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const url = env.NEXT_PUBLIC_SUPABASE_URL
const secret = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY
const publishable =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL:', url ? 'ok' : 'missing')
console.log('Publishable:', publishable ? 'ok' : 'missing')
console.log('Secret:', secret ? 'ok' : 'missing')

if (!url || !secret) process.exit(1)

for (const table of ['profiles', 'referrals', 'referral_visits']) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: secret, Authorization: `Bearer ${secret}` },
  })
  console.log(`${table}:`, res.status, (await res.text()).slice(0, 120))
}
