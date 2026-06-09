import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

export function isSupabaseClientConfigured() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey())
}

export function createClient() {
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) to .env.local and restart the dev server.',
    )
  }

  return createBrowserClient(
    url,
    key,
    {
      // Use cookies for PKCE code verifier storage instead of localStorage
      // This ensures the code verifier persists across the email verification redirect
      cookieOptions: {
        // Allow cookies to be sent with cross-site requests (needed for email verification links)
        sameSite: 'lax',
        // Secure in production, not in development
        secure: process.env.NODE_ENV === 'production',
        // Set a reasonable max age for the auth cookies
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    },
  )
}
