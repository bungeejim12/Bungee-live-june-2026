import postgres from 'postgres'

let sql: ReturnType<typeof postgres> | null = null

export function getDirectDb() {
  const url = process.env.SUPABASE_DIRECT_URL?.trim()
  if (!url) return null

  if (!sql) {
    sql = postgres(url, { ssl: 'require', max: 3 })
  }

  return sql
}
