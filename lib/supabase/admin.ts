import { createClient } from '@supabase/supabase-js'
import { assertSupabaseServerEnv } from '@/lib/supabase/env'

// Admin client for server actions - bypasses RLS using secret/service role key
export function createAdminClient() {
  const env = assertSupabaseServerEnv()

  if (!env) {
    console.error('[v0] Missing Supabase server env vars (SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY)')
    return null
  }

  return createClient(env.url, env.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
