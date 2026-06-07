"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Fallback page for /refer without an ID - redirects to home
export default function ReferIndexPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to home after a brief moment
    const timer = setTimeout(() => {
      router.push('/')
    }, 1500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF8C00] mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to Bungee...</p>
        <p className="text-sm text-gray-400 mt-2">No referral ID provided</p>
      </div>
    </div>
  )
}
