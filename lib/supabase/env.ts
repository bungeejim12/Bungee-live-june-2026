function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim().length > 0)?.trim()
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
}

/** Browser + SSR client key (publishable or legacy anon). */
export function getSupabasePublishableKey() {
  return firstDefined(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ) ?? ''
}

/** Server-only elevated key (secret or legacy service_role). */
export function getSupabaseSecretKey() {
  return firstDefined(
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ) ?? ''
}

export function assertSupabaseClientEnv() {
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()
  if (!url || !key) {
    throw new Error(
      'Missing Supabase client env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).',
    )
  }
  return { url, key }
}

export function assertSupabaseServerEnv() {
  const url = getSupabaseUrl()
  const key = getSupabaseSecretKey()
  if (!url || !key) {
    return null
  }
  return { url, key }
}
