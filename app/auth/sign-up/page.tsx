"use client"

import { useState, useEffect, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, ArrowLeft, ArrowRight, Check, Loader2, Phone, Eye, EyeOff, Shield, UserPlus } from "lucide-react"
import { completeSignupProfile, getReferrerByCode } from "@/app/actions/referrals"
import { getReferrerDisplayName, type ReferrerInfo } from "@/lib/referrals"
import { SupabaseConfigBanner } from "@/components/supabase-config-banner"
import { isSupabaseClientConfigured } from "@/lib/supabase/client"

type UserType = "bungee" | "business"
type Step = "type" | "details" | "verify-sms"

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCodeParam = searchParams.get("ref")
  const [step, setStep] = useState<Step>("type")
  const [userType, setUserType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Form data - Phone-based registration (pristine production fields)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // SMS OTP verification state
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""])
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  
  // Session sync state
  const [sessionAcquired, setSessionAcquired] = useState(false)
  const [sessionConfirmed, setSessionConfirmed] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)
  
  // Development/configuration notice state
  const [showConfigNotice, setShowConfigNotice] = useState(false)

  // Referral invite state
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referrer, setReferrer] = useState<ReferrerInfo | null>(null)
  const [isLoadingReferrer, setIsLoadingReferrer] = useState(false)

  // PRODUCTION CLEANUP: Clear all stale auth tokens and sandbox data on page load
  useEffect(() => {
    const clearStaleAuthState = async () => {
      const storedRef =
        referralCodeParam ||
        (typeof window !== "undefined" ? sessionStorage.getItem("bungee_referral_code") : null)

      if (storedRef) {
        setReferralCode(storedRef)
      }

      // Clear any lingering sandbox/staging session data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bungee_sandbox_session')
        localStorage.removeItem('bungee_staging_user')
        localStorage.removeItem('bungee_mock_session')
        localStorage.removeItem('bungee_demo_mode')
        localStorage.removeItem('bungee_demo_active')
        localStorage.removeItem('bungee_demo_type')
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
  }, [referralCodeParam])

  useEffect(() => {
    if (!referralCode) return

    const loadReferrer = async () => {
      setIsLoadingReferrer(true)
      const referrerData = await getReferrerByCode(referralCode)
      if (referrerData) {
        setReferrer(referrerData)
        if (referrerData.user_type === "business") {
          setUserType("business")
        }
      }
      setIsLoadingReferrer(false)
    }

    loadReferrer()
  }, [referralCode])

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

  const handleTypeSelect = (type: UserType) => {
    setUserType(type)
    setStep("details")
    setError(null)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting || isLoading) return
    
    setError(null)
    setIsSubmitting(true)
    setIsLoading(true)

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name")
      setIsLoading(false)
      setIsSubmitting(false)
      return
    }

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      setIsLoading(false)
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      setIsSubmitting(false)
      return
    }

    if (userType === "business" && !businessName.trim()) {
      setError("Please enter your business name")
      setIsLoading(false)
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = createClient()
      const formattedPhone = formatPhoneE164(phoneNumber)
      
      // PRODUCTION: Direct Supabase phone registration (no sandbox bypass)
      const { data, error: signUpError } = await supabase.auth.signUp({
        phone: formattedPhone,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            business_name: userType === "business" ? businessName : null,
            user_type: userType,
          },
        },
      })

      if (signUpError) {
        const errorMsg = signUpError.message.toLowerCase()
        
        // Handle "already registered" error with clear messaging
        if (errorMsg.includes('already registered') || errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
          setError("This phone number is already registered. Please sign in or use a different number.")
          setShowConfigNotice(false)
        } else if (errorMsg.includes('phone signups are disabled') || 
            errorMsg.includes('phone registration') ||
            errorMsg.includes('currently being configured') ||
            errorMsg.includes('support') ||
            errorMsg.includes('not enabled') ||
            errorMsg.includes('sms provider')) {
          setShowConfigNotice(true)
          setError(null)
        } else if (errorMsg.includes('rate') || errorMsg.includes('limit')) {
          setError("Too many attempts. Please wait a few minutes before trying again.")
          setShowConfigNotice(false)
        } else {
          setError(signUpError.message)
          setShowConfigNotice(false)
        }
        setIsLoading(false)
        setIsSubmitting(false)
        return
      }

      if (data?.user) {
        // Move to SMS verification step
        setStep("verify-sms")
        setMessage(`We've sent a 6-digit verification code to ${formatPhoneDisplay(phoneNumber)}. Enter it below.`)
        setIsLoading(false)
        setIsSubmitting(false)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
      setIsSubmitting(false)
    }
  }

  // Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const newOtp = [...otpCode]
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })
      setOtpCode(newOtp)
      const nextIndex = Math.min(index + digits.length, 5)
      const nextInput = document.getElementById(`otp-${nextIndex}`)
      nextInput?.focus()
      return
    }
    
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otpCode]
    newOtp[index] = value
    setOtpCode(newOtp)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  // Verify SMS OTP code - PRODUCTION: Direct Supabase verification
  const handleVerifyOtp = async () => {
    const code = otpCode.join('')
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsVerifyingOtp(true)
    setError(null)

    try {
      const supabase = createClient()
      const formattedPhone = formatPhoneE164(phoneNumber)
      
      // Verify OTP with Supabase Auth
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: code,
        type: 'sms',
      })

      if (verifyError) {
        setOtpCode(["", "", "", "", "", ""])
        
        const errorMsg = verifyError.message.toLowerCase()
        if (errorMsg.includes('invalid') || errorMsg.includes('expired') || errorMsg.includes('otp')) {
          setError("Invalid or expired code. Please check your SMS or tap 'Resend Code' below.")
        } else if (errorMsg.includes('rate') || errorMsg.includes('limit')) {
          setError("Too many attempts. Please wait a few minutes before trying again.")
        } else {
          setError(verifyError.message)
        }
        setIsVerifyingOtp(false)
        
        setTimeout(() => {
          const firstInput = document.getElementById('otp-0')
          firstInput?.focus()
        }, 100)
        return
      }

      if (data.user) {
        await completeSignupProfile({
          userId: data.user.id,
          phone: formatPhoneE164(phoneNumber),
          firstName,
          lastName,
          businessName: userType === 'business' ? businessName : null,
          userType: userType!,
          referralCode,
        })

        localStorage.removeItem('bungee_demo_mode')
        localStorage.removeItem('bungee_demo_active')
        localStorage.removeItem('bungee_demo_type')
        localStorage.removeItem('bungee_demo_user')
        sessionStorage.removeItem('bungee_referral_code')

        // Show session sync interstitial
        const targetPath = userType === 'business' 
          ? '/dashboard/business?authenticated=true' 
          : '/dashboard/bungee?authenticated=true'
        setRedirectPath(targetPath)
        setSessionAcquired(true)
        setIsVerifyingOtp(false)
        
        // Poll for confirmed session before auto-redirecting
        let attempts = 0
        const maxAttempts = 10
        const checkSession = async () => {
          attempts++
          const { data: sessionData } = await supabase.auth.getSession()
          if (sessionData?.session) {
            setSessionConfirmed(true)
            await new Promise(resolve => setTimeout(resolve, 500))
            router.push(targetPath)
          } else if (attempts < maxAttempts) {
            setTimeout(checkSession, 300)
          } else {
            setSessionConfirmed(true)
          }
        }
        
        setTimeout(checkSession, 200)
      }
    } catch {
      setError('Failed to verify code. Please try again.')
      setIsVerifyingOtp(false)
    }
  }

  const handleResendCode = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const formattedPhone = formatPhoneE164(phoneNumber)
      
      const { error } = await supabase.auth.resend({
        type: 'sms',
        phone: formattedPhone,
      })

      if (error) {
        if (error.message.includes('rate') || error.message.includes('limit')) {
          setError("Code resend limit reached. Please wait a few minutes.")
        } else {
          setError(error.message)
        }
      } else {
        setMessage(`New verification code sent to ${formatPhoneDisplay(phoneNumber)}.`)
        setOtpCode(["", "", "", "", "", ""])
      }
    } catch {
      setError("Failed to resend code. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/bungee-logo.png" alt="Bungee" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl text-slate-900">BUNGEE</span>
          </Link>
        </div>
        <Link href="/auth/login">
          <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
            Sign In
          </Button>
        </Link>
      </header>

      <SupabaseConfigBanner />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-md border-0 bg-white rounded-lg">

          {referrer && (
            <div className="mx-6 mt-6 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-[#FF8C00] flex-shrink-0" />
              <p className="text-sm text-orange-900">
                Invited by <span className="font-semibold">{getReferrerDisplayName(referrer)}</span>
              </p>
            </div>
          )}

          {isLoadingReferrer && referralCode && !referrer && (
            <div className="mx-6 mt-6 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 text-center">
              Verifying invite...
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 pt-6 pb-2">
            {["type", "details", "verify-sms"].map((s, i) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  ["type", "details", "verify-sms"].indexOf(step) >= i
                    ? "w-8 bg-[#FF8C00]"
                    : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Select User Type */}
          {step === "type" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900">Join Bungee</CardTitle>
                <CardDescription className="text-slate-600">
                  Select your account type to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* BUSINESS — blue identity */}
                <button
                  onClick={() => handleTypeSelect("business")}
                  className="group overflow-hidden rounded-2xl border-2 border-blue-200 bg-white text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
                      <h3 className="text-lg font-bold text-blue-700">Business Account</h3>
                      <p className="text-sm text-slate-600">Post jobs &amp; hire Bungee workers</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
                  </div>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-medium text-slate-400">or</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* BUNGEE — orange identity */}
                <button
                  onClick={() => handleTypeSelect("bungee")}
                  className="group overflow-hidden rounded-2xl border-2 border-orange-200 bg-white text-left shadow-sm transition-all hover:border-[#FF8C00] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00]"
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
                      <h3 className="text-lg font-bold text-[#E67E00]">Bungee Worker</h3>
                      <p className="text-sm text-slate-600">Refer, earn &amp; find flexible work</p>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto text-orange-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#FF8C00]" />
                  </div>
                </button>
              </CardContent>
            </>
          )}

          {/* Step 2: Registration Details */}
          {step === "details" && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {userType === "business" ? "Create Business Account" : "Create Bungee Account"}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="!text-slate-900 bg-white border-slate-300 placeholder:text-slate-400 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                        style={{ color: '#0f172a' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Smith"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="!text-slate-900 bg-white border-slate-300 placeholder:text-slate-400 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                        style={{ color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  {/* Business Name (conditional) */}
                  {userType === "business" && (
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-slate-700 font-medium">Business Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        placeholder="Acme Corporation"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        className="!text-slate-900 bg-white border-slate-300 placeholder:text-slate-400 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                        style={{ color: '#0f172a' }}
                      />
                    </div>
                  )}

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">Mobile Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formatPhoneDisplay(phoneNumber)}
                        onChange={handlePhoneChange}
                        required
                        className="pl-10 !text-slate-900 bg-white border-slate-300 placeholder:text-slate-400 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                        style={{ color: '#0f172a' }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">We&apos;ll send a verification code to this number</p>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Create Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10 !text-slate-900 bg-white border-slate-300 placeholder:text-slate-400 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                        style={{ color: '#0f172a' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pr-10 !text-slate-900 bg-white border-slate-300 placeholder:text-slate-400 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                        style={{ color: '#0f172a' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
                  )}

                  {/* Phone Configuration Notice */}
                  {showConfigNotice && (
                    <div className="p-4 rounded-lg border border-amber-300 bg-amber-50">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center">
                          <span className="text-amber-700 text-sm font-bold">!</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-slate-800">Phone Verification Setup Required</p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Phone authentication is being configured. Please ensure your phone number is valid and try again in a few moments. If the issue persists, contact support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-3 rounded-lg shadow-md"
                    disabled={isLoading || isSubmitting}
                  >
                    {isLoading || isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Continue <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-slate-600 hover:text-slate-900"
                    onClick={() => {
                      setStep("type")
                      setError(null)
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* Step 3: SMS OTP Verification */}
          {step === "verify-sms" && !sessionAcquired && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8 text-[#FF8C00]" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Enter Verification Code</CardTitle>
                <CardDescription className="text-slate-600">
                  We sent a 6-digit code to <strong className="text-slate-900">{formatPhoneDisplay(phoneNumber)}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* OTP Input */}
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg bg-white focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/20 transition-all"
                      style={{ color: '#0f172a' }}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {message && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    {message}
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
                )}

                <Button
                  className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-3 rounded-lg shadow-md"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otpCode.join('').length !== 6}
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-amber-900 mb-1">Didn&apos;t receive the code?</p>
                      <p className="text-amber-700">Check your SMS messages. The code expires in 10 minutes.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                    onClick={handleResendCode}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Resend Code
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-slate-600 hover:text-slate-900"
                    onClick={() => {
                      setStep("details")
                      setError(null)
                      setMessage(null)
                      setOtpCode(["", "", "", "", "", ""])
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Edit Details
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Session Acquired Interstitial */}
          {sessionAcquired && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Account Verified!</CardTitle>
                <CardDescription className="text-slate-600">
                  Syncing your workspace...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  {!sessionConfirmed ? (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Loader2 className="h-5 w-5 animate-spin text-[#FF8C00]" />
                      <span>Establishing secure session...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-emerald-600">
                      <Check className="h-5 w-5" />
                      <span>Session ready!</span>
                    </div>
                  )}
                  
                  <Button
                    className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-3 rounded-lg shadow-md"
                    onClick={() => {
                      if (redirectPath) {
                        router.push(redirectPath)
                      }
                    }}
                    disabled={!sessionConfirmed}
                  >
                    {sessionConfirmed ? (
                      <>
                        Enter Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Preparing Dashboard...
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    If you&apos;re not redirected automatically, click the button above.
                  </p>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#FF8C00] hover:underline font-medium">
          Sign in
        </Link>
      </footer>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF8C00]" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  )
}
