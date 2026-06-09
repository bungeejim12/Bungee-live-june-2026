"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function JoinContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get("ref")

  useEffect(() => {
    if (ref) {
      sessionStorage.setItem("bungee_referral_code", ref)
      router.replace(`/auth/sign-up?ref=${encodeURIComponent(ref)}`)
      return
    }

    router.replace("/auth/sign-up")
  }, [ref, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF8C00] mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to sign up...</p>
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF8C00]" />
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  )
}
