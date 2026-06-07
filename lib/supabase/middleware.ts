import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Public routes that should bypass all auth/middleware checks
const PUBLIC_ROUTES = [
  '/refer',
  '/offer',
  '/r/',
  '/o/',
  '/job',
  '/bounty',
  '/campaign',
  '/api/scrape-company',
  '/auth',
]

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  // EARLY EXIT: Allow all public routes without any auth checks
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    return response
  }

  // EARLY EXIT: Allow all dashboard routes without any auth checks
  // Demo mode, staging mode, and real auth are all handled client-side
  if (pathname.startsWith('/dashboard')) {
    return response
  }

  // EARLY EXIT: If Supabase env vars are not configured, skip auth checks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  let supabaseResponse = response

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            )
          },
        },
      },
    )

    // Refresh the session for non-dashboard routes
    await supabase.auth.getUser()
  } catch {
    // If Supabase auth fails, still allow the request through
    return response
  }

  return supabaseResponse
}
