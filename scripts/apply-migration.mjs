import { readFileSync } from 'fs'
import postgres from 'postgres'

function loadEnv() {
  return Object.fromEntries(
    readFileSync('.env.local', 'utf8')
      .split('\n')
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        let value = l.slice(i + 1).trim()
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1)
        }
        return [l.slice(0, i).trim(), value]
      }),
  )
}

const env = loadEnv()
const directUrl = env.SUPABASE_DIRECT_URL

if (!directUrl) {
  console.error('Missing SUPABASE_DIRECT_URL in .env.local')
  process.exit(1)
}

const sql = readFileSync('supabase/migrations/001_auth_referrals.sql', 'utf8')
const db = postgres(directUrl, { ssl: 'require', max: 1 })

try {
  await db.unsafe(sql)
  const tables = await db`
    select table_name from information_schema.tables
    where table_schema = 'public'
      and table_name in ('profiles', 'referrals', 'referral_visits', 'referral_shares', 'campaign_applicants')
    order by table_name
  `
  console.log('Migration applied. Tables:', tables.map((t) => t.table_name).join(', '))
} catch (err) {
  console.error('Migration failed:', err.message)
  process.exit(1)
} finally {
  await db.end()
}
