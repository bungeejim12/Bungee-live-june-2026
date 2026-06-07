'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense, useState } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')
  const [isClearing, setIsClearing] = useState(false)

  const handleTryAgain = async () => {
    setIsClearing(true)
    
    try {
      // Clear Supabase auth state completely
      const supabase = createClient()
      await supabase.auth.signOut({ scope: 'local' })
      
      // Call the API to clear all auth cookies server-side
      await fetch('/api/auth/clear', { method: 'POST' })
      
      // COMPLETE STATE WIPE - Clear ALL local storage and session storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear ALL cookies (not just auth ones)
      const allCookies = document.cookie.split(';')
      for (const cookie of allCookies) {
        const cookieName = cookie.split('=')[0].trim()
        // Clear cookie for all possible paths and domains
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`
      }
      
      console.log('[Auth Error] Complete state wipe executed - localStorage, sessionStorage, and all cookies cleared')
      
      // Small delay to ensure everything is cleared
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Force hard navigation to login with cache-busting param
      window.location.href = `/auth/login?cleared=${Date.now()}`
    } catch (err) {
      console.error('Error clearing auth state:', err)
      // Force navigate even if there was an error
      window.location.href = '/auth/login'
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="border-red-200 bg-white shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 size-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="size-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {error ? (
                <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
                  {decodeURIComponent(error)}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  An unexpected error occurred during authentication.
                </p>
              )}
              
              <p className="text-sm text-gray-500">
                This could happen if the verification link expired or was already used. Please try again.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleTryAgain}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <>
                      <RefreshCw className="mr-2 size-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 size-4" />
                      Try Again
                    </>
                  )}
                </Button>
                <Link href="/" className="flex-1">
                  <Button className="w-full bg-[#FF8C00] hover:bg-[#E67E00]">
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="border-gray-200 bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
