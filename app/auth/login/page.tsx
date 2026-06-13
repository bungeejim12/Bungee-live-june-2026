"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient, isSupabaseClientConfigured } from "@/lib/supabase/client"
import { SupabaseConfigBanner } from "@/components/supabase-config-banner"
import Link from "next/link"
import Image from "next/image"
import { Building2, Users, Loader2, Phone, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isDemo = searchParams.get('demo') === 'true'
  const urlMessage = searchParams.get('message')
  
  const [mode, setMode] = useState<'select' | 'login' | 'otp'>('login')
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [error, setError] = useState<string | null>(urlMessage ? decodeURIComponent(urlMessage) : null)
  const [message, setMessage] = useState<string | null>(null)
  
  // OTP verification state - EMPTY by default, no placeholders
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""])
  const [canResend, setCanResend] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  // PRODUCTION CLEANUP: Clear stale auth tokens on page load
  useEffect(() => {
    const clearStaleAuthState = async () => {
      if (typeof window !== 'undefined') {
        // Clear any lingering mock/demo session data
        localStorage.removeItem('bungee_sandbox_session')
        localStorage.removeItem('bungee_staging_user')
        localStorage.removeItem('bungee_mock_session')
        localStorage.removeItem('bungee_demo_mode')
        localStorage.removeItem('bungee_demo_type')
        localStorage.removeItem('bungee_demo_active')
        localStorage.removeItem('bungee_demo_user')
        
        // Clear any sb-* items from localStorage (Supabase tokens)
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth-token'))) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        sessionStorage.clear()
      }
      
      if (isSupabaseClientConfigured()) {
        try {
          const supabase = createClient()
          await supabase.auth.signOut({ scope: 'local' })
        } catch {
          // Ignore errors during cleanup
        }
      }
    }
    
    clearStaleAuthState()
  }, [])

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendCountdown === 0 && mode === 'otp') {
      setCanResend(true)
    }
  }, [resendCountdown, mode])

  // Format phone number for display
  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  // Format phone for Supabase (E.164 format)
  const formatPhoneE164 = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length === 10) return `+1${digits}`
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
    return `+${digits}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhoneNumber(input)
  }

  // PRODUCTION: Send real SMS OTP code via Supabase Auth
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    setIsSendingOtp(true)

    try {
      const supabase = createClient()
      const formattedPhone = formatPhoneE164(phoneNumber)

      // PRODUCTION: Trigger real SMS OTP send via Supabase
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (otpError) {
        const errorMsg = otpError.message.toLowerCase()
        
        if (errorMsg.includes('rate') || errorMsg.includes('limit')) {
          setError("Too many attempts. Please wait a few minutes before trying again.")
        } else if (errorMsg.includes('phone') && (errorMsg.includes('disabled') || errorMsg.includes('not enabled'))) {
          setError("Phone authentication is being configured. Please try again shortly or contact support.")
        } else if (errorMsg.includes('invalid') || errorMsg.includes('format')) {
          setError("Invalid phone number format. Please check and try again.")
        } else {
          setError(otpError.message)
        }
        setIsSendingOtp(false)
        return
      }

      // Success: Move to OTP entry screen
      setMode('otp')
      setOtpCode(["", "", "", "", "", ""]) // Ensure fields are empty
      setCanResend(false)
      setResendCountdown(60) // 60 second cooldown before resend
      setMessage(`A 6-digit verification code has been sent to ${formatPhoneDisplay(phoneNumber)}`)
      
      // Auto-focus first OTP input
      setTimeout(() => {
        document.getElementById('login-otp-0')?.focus()
      }, 100)

    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Handle traditional password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      setIsLoading(false)
      return
    }

    const timeout = setTimeout(() => {
      setIsLoading(false)
      setError("Login is taking too long. Please check your connection and try again.")
    }, 15000)

    try {
      const supabase = createClient()
      const formattedPhone = formatPhoneE164(phoneNumber)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password,
      })

      clearTimeout(timeout)

      if (signInError) {
        if (signInError.message.includes('rate') || signInError.message.includes('limit')) {
          setError("Too many login attempts. Please wait a few minutes before trying again.")
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError("Invalid phone number or password. Please check your credentials and try again.")
        } else {
          setError(signInError.message)
        }
        setIsLoading(false)
        return
      }

      if (data?.user) {
        localStorage.removeItem('bungee_demo_mode')
        localStorage.removeItem('bungee_demo_active')
        localStorage.removeItem('bungee_demo_type')
        localStorage.removeItem('bungee_demo_user')
        localStorage.removeItem('bungee_sandbox_session')

        // Get user profile to determine redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single()

        const userType = profile?.user_type || data.user.user_metadata?.user_type || 'bungee'
        const redirectPath = userType === 'business' 
          ? '/dashboard/business?authenticated=true' 
          : '/dashboard/bungee?authenticated=true'
        
        router.push(redirectPath)
      }
    } catch {
      clearTimeout(timeout)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // OTP input handlers - NO pre-filled values
  const handleOtpChange = (index: number, value: string) => {
    // Handle paste of full code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const newOtp = ["", "", "", "", "", ""]
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit
      })
      setOtpCode(newOtp)
      const nextIndex = Math.min(digits.length, 5)
      document.getElementById(`login-otp-${nextIndex}`)?.focus()
      return
    }
    
    // Only allow digits
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otpCode]
    newOtp[index] = value
    setOtpCode(newOtp)
    
    // Auto-advance to next input
    if (value && index < 5) {
      document.getElementById(`login-otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`login-otp-${index - 1}`)?.focus()
    }
  }

  // PRODUCTION: Verify real OTP code via Supabase Auth
  const handleVerifyOtp = async () => {
    const code = otpCode.join('')
    
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsVerifyingOtp(true)
    setError(null)

    try {
      const supabase = createClient()
      const formattedPhone = formatPhoneE164(phoneNumber)

      // PRODUCTION: Verify the real SMS OTP code
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: code,
        type: 'sms',
      })

      if (verifyError) {
        // Clear code on error
        setOtpCode(["", "", "", "", "", ""])
        
        const errorMsg = verifyError.message.toLowerCase()
        if (errorMsg.includes('invalid') || errorMsg.includes('expired') || errorMsg.includes('otp')) {
          setError("Invalid or expired code. Please check your SMS or tap 'Resend Code' below.")
        } else if (errorMsg.includes('rate') || errorMsg.includes('limit')) {
          setError("Too many attempts. Please wait a few minutes before trying again.")
        } else {
          setError(verifyError.message)
        }
        
        // Refocus first input
        setTimeout(() => document.getElementById('login-otp-0')?.focus(), 100)
        setIsVerifyingOtp(false)
        return
      }

      if (data?.user) {
        // PRODUCTION: Confirm session is established
        const { data: sessionData } = await supabase.auth.getSession()
        
        if (sessionData?.session) {
          localStorage.removeItem('bungee_demo_mode')
          localStorage.removeItem('bungee_demo_active')
          localStorage.removeItem('bungee_demo_type')
          localStorage.removeItem('bungee_demo_user')
          localStorage.removeItem('bungee_sandbox_session')

          // Get user profile to determine redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', data.user.id)
            .single()

          const userType = profile?.user_type || data.user.user_metadata?.user_type || 'bungee'
          const redirectPath = userType === 'business' 
            ? '/dashboard/business?authenticated=true' 
            : '/dashboard/bungee?authenticated=true'
          
          // Hard redirect to ensure fresh page load with session
          window.location.href = redirectPath
        } else {
          setError("Session could not be established. Please try again.")
          setIsVerifyingOtp(false)
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setIsVerifyingOtp(false)
    }
  }

  // Resend OTP code
  const handleResendOtp = async () => {
    if (!canResend) return
    
    setCanResend(false)
    setError(null)
    setMessage(null)

    try {
      const supabase = createClient()
      const formattedPhone = formatPhoneE164(phoneNumber)

      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (otpError) {
        setError(otpError.message)
        setCanResend(true)
        return
      }

      setOtpCode(["", "", "", "", "", ""])
      setResendCountdown(60)
      setMessage("A new verification code has been sent to your phone.")
      setTimeout(() => document.getElementById('login-otp-0')?.focus(), 100)

    } catch {
      setError("Failed to resend code. Please try again.")
      setCanResend(true)
    }
  }

  // Demo mode handlers
  const handleDemoAccess = (type: 'business' | 'bungee') => {
    localStorage.setItem('bungee_demo_mode', 'true')
    localStorage.setItem('bungee_demo_type', type)
    localStorage.setItem('bungee_demo_active', 'true')
    localStorage.setItem('bungee_demo_user', JSON.stringify({
      id: `demo-${type}-user`,
      phone: '+15551234567',
      first_name: 'Demo',
      last_name: type === 'business' ? 'Business' : 'Bungee',
      business_name: type === 'business' ? 'Demo Company' : null,
      user_type: type,
      business_verified: type === 'business',
      tax_verified: type === 'bungee'
    }))
    const redirectUrl = type === 'business' ? '/dashboard/business?demo=true' : '/dashboard/bungee?demo=true'
    window.location.href = redirectUrl
  }

  // OTP Verification Screen - PRODUCTION (no hardcoded values)
  if (mode === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="p-4 md:p-6 flex justify-between items-center bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { 
                setMode('login')
                setOtpCode(["", "", "", "", "", ""])
                setError(null)
                setMessage(null)
              }} 
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/bungee-logo.png" alt="Bungee" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-xl text-[#0f172a]">BUNGEE</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Premium Card Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header Section */}
              <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-[#FF8C00]/5 to-transparent border-b border-gray-100">
                <div className="mx-auto w-16 h-16 bg-[#FF8C00]/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Shield className="h-8 w-8 text-[#FF8C00]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0f172a]">Verify Your Phone</h1>
                <p className="text-gray-600 mt-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-semibold text-[#0f172a] mt-1">
                  {formatPhoneDisplay(phoneNumber)}
                </p>
              </div>

              {/* Form Section */}
              <div className="p-6 sm:p-8">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {message && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-sm text-emerald-700">{message}</p>
                  </div>
                )}

                {/* OTP Input Boxes - EMPTY by default */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`login-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      placeholder=""
                      className="w-11 sm:w-12 h-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl text-[#0f172a] bg-white focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 transition-all placeholder:text-gray-300"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.join('').length !== 6 || isVerifyingOtp}
                  className="w-full h-12 bg-[#FF8C00] hover:bg-[#E67E00] active:bg-[#D97706] text-white font-semibold text-base rounded-xl shadow-lg shadow-[#FF8C00]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Verify & Sign In
                    </>
                  )}
                </Button>

                {/* Resend Code */}
                <div className="mt-6 text-center">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#FF8C00] hover:text-[#E67E00] font-medium text-sm transition-colors"
                    >
                      Resend Code
                    </button>
                  ) : resendCountdown > 0 ? (
                    <p className="text-gray-500 text-sm">
                      Resend code in <span className="font-semibold text-[#0f172a]">{resendCountdown}s</span>
                    </p>
                  ) : null}
                </div>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setOtpCode(["", "", "", "", "", ""])
                    setError(null)
                    setMessage(null)
                  }}
                  className="w-full mt-4 text-gray-600 hover:text-[#0f172a] text-sm font-medium transition-colors"
                >
                  Use a different phone number
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Demo mode selection UI
  if (mode === 'select' || isDemo) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="p-4 md:p-6 flex justify-between items-center bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => setMode('login')} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/bungee-logo.png" alt="Bungee" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-xl text-[#0f172a]">BUNGEE</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-[#0f172a] text-center mb-2">Demo Access</h1>
            <p className="text-gray-600 text-center mb-6">Choose your experience</p>

            <div className="space-y-4">
              {/* BUSINESS — blue identity, "I'm hiring / I own a business" */}
              <button
                type="button"
                onClick={() => handleDemoAccess('business')}
                className="group w-full overflow-hidden rounded-2xl border-2 border-blue-200 bg-white text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="relative h-28 w-full overflow-hidden">
                  <Image src="/images/choose-business.png" alt="Business owner" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-blue-900/10" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    <Building2 className="h-3.5 w-3.5" />
                    For Businesses
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div>
                    <h3 className="text-lg font-bold text-blue-700">Business Dashboard</h3>
                    <p className="text-sm text-gray-600">I own a business &amp; want to hire or sell</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </div>
              </button>

              {/* Divider to separate the two clearly */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* BUNGEE — orange identity, "I'm a worker / referrer" */}
              <button
                type="button"
                onClick={() => handleDemoAccess('bungee')}
                className="group w-full overflow-hidden rounded-2xl border-2 border-orange-200 bg-white text-left shadow-sm transition-all hover:border-[#FF8C00] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00]"
              >
                <div className="relative h-28 w-full overflow-hidden">
                  <Image src="/images/choose-bungee.png" alt="Bungee worker" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 to-orange-900/10" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#FF8C00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    <Users className="h-3.5 w-3.5" />
                    For Bungees
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#E67E00]">Bungee Dashboard</h3>
                    <p className="text-sm text-gray-600">I&apos;m a worker who refers &amp; earns</p>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto text-orange-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#FF8C00]" />
                </div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={() => setMode('login')}
                className="text-[#FF8C00] hover:text-[#E67E00] font-medium transition-colors"
              >
                Sign in with your account
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Standard login UI with OTP option
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 md:p-6 flex justify-between items-center bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/bungee-logo.png" alt="Bungee" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl text-[#0f172a]">BUNGEE</span>
          </Link>
        </div>
        <Link href="/auth/sign-up">
          <Button variant="ghost" className="text-gray-700 hover:text-[#0f172a] font-medium">
            Sign Up
          </Button>
        </Link>
      </header>

      <SupabaseConfigBanner />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Premium Card Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 text-center border-b border-gray-100">
              <h1 className="text-2xl font-bold text-[#0f172a]">Welcome Back</h1>
              <p className="text-gray-600 mt-1">Sign in to your Bungee account</p>
            </div>

            {/* Form Section */}
            <div className="p-6 sm:p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* SMS OTP Sign In Option */}
              <form onSubmit={handleSendOtp} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="phone-otp" className="text-[#0f172a] font-medium">Mobile Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone-otp"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formatPhoneDisplay(phoneNumber)}
                      onChange={handlePhoneChange}
                      required
                      className="pl-10 h-12 text-[#0f172a] text-base bg-white border-gray-300 placeholder:text-gray-400 focus:border-[#FF8C00] focus:ring-[#FF8C00] rounded-xl"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSendingOtp || phoneNumber.length !== 10}
                  className="w-full h-12 bg-[#FF8C00] hover:bg-[#E67E00] active:bg-[#D97706] text-white font-semibold text-base rounded-xl shadow-lg shadow-[#FF8C00]/20 disabled:opacity-50 transition-all"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Phone className="h-5 w-5 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or sign in with password</span>
                </div>
              </div>

              {/* Password Login Option */}
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#0f172a] font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 h-12 text-[#0f172a] text-base bg-white border-gray-300 placeholder:text-gray-400 focus:border-[#FF8C00] focus:ring-[#FF8C00] rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  disabled={isLoading || !password}
                  className="w-full h-12 border-gray-300 text-[#0f172a] hover:bg-gray-50 font-semibold text-base rounded-xl disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In with Password
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="text-[#FF8C00] hover:text-[#E67E00] font-medium">
                    Create one
                  </Link>
                </p>
              </div>

              {/* Demo Access */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <button
                  type="button"
                  onClick={() => setMode('select')}
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF8C00]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
