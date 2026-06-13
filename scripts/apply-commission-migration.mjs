import { readFileSync } from "fs"
import postgres from "postgres"

// Use the non-pooling direct connection for DDL.
const directUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL

if (!directUrl) {
  console.error("Missing POSTGRES_URL_NON_POOLING / POSTGRES_URL")
  process.exit(1)
}

const sql = readFileSync("supabase/migrations/002_commission_engine.sql", "utf8")
const db = postgres(directUrl, { ssl: "require", max: 1 })

try {
  await db.unsafe(sql)
  const tables = await db`
    select table_name from information_schema.tables
    where table_schema = 'public'
      and table_name in ('commission_config', 'commission_ledger')
    order by table_name
  `
  const cfg = await db`select service_fee_rate, window_months, tiers from public.commission_config where id = 1`
  console.log("[v0] Commission migration applied. New tables:", tables.map((t) => t.table_name).join(", "))
  console.log("[v0] Config row:", JSON.stringify(cfg[0]))
} catch (err) {
  console.error("[v0] Migration failed:", err.message)
  process.exit(1)
} finally {
  await db.end()
}
