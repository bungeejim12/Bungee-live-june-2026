import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Auth State Clear Endpoint
 * Clears all Supabase auth cookies and signs out the current session.
 * Used for production cleanup and fresh registration testing.
 */
export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient()
    
    // Sign out from Supabase (clears session)
    await supabase.auth.signOut({ scope: 'local' })
    
    // Get all cookies and delete any Supabase-related ones
    const allCookies = cookieStore.getAll()
    const response = NextResponse.json({ 
      success: true, 
      message: 'Auth state cleared. All session tokens and cookies have been removed.',
      cleared: {
        cookies: 0,
        timestamp: new Date().toISOString()
      }
    })
    
    // Delete all Supabase auth cookies (they start with 'sb-')
    let clearedCount = 0
    for (const cookie of allCookies) {
      if (cookie.name.startsWith('sb-') || 
          cookie.name.includes('supabase') || 
          cookie.name.includes('auth') ||
          cookie.name.includes('bungee')) {
        response.cookies.delete(cookie.name)
        clearedCount++
      }
    }
    
    // Update response with actual count
    const body = await response.json()
    body.cleared.cookies = clearedCount
    
    return NextResponse.json(body)
  } catch (error) {
    console.error('Error clearing auth state:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to clear auth state',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function GET() {
  // Also support GET for easy browser testing
  return POST()
}
