import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
