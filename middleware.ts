import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Explicitly allow public referral/offer routes to pass through without any processing
  if (
    pathname.startsWith('/refer') ||
    pathname.startsWith('/offer') ||
    pathname.startsWith('/r/') ||
    pathname.startsWith('/o/') ||
    pathname.startsWith('/job') ||
    pathname.startsWith('/bounty') ||
    pathname.startsWith('/campaign') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/join') ||
    pathname.startsWith('/invite')
  ) {
    return NextResponse.next()
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - Public referral/offer routes (handled inline above for safety)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
