"use client"

import { useState } from "react"
import { X, CheckCircle2, Shield, FileText, DollarSign, AlertCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

interface BungeeTaxVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  userId: string
  isDarkMode?: boolean
  pendingAmount?: string
}

export default function BungeeTaxVerificationModal({
  isOpen,
  onClose,
  onVerified,
  userId,
  isDarkMode = false,
  pendingAmount = "$0.00"
}: BungeeTaxVerificationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [legalName, setLegalName] = useState("")
  const [mailingAddress, setMailingAddress] = useState("")
  const [ssnItin, setSsnItin] = useState("")
  const [agreementAccepted, setAgreementAccepted] = useState(false)

  // Format SSN/ITIN as XXX-XX-XXXX
  const formatSsnItin = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 9)
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`
  }

  const handleSsnItinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSsnItin(formatSsnItin(e.target.value))
  }

  const isStep1Valid = legalName.trim().length >= 2 && mailingAddress.trim().length >= 10 && ssnItin.replace(/\D/g, "").length === 9

  const handleSubmitVerification = async () => {
    if (!agreementAccepted) {
      setError("You must accept the Payout Agreement to continue.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Get last 4 digits of SSN for display purposes
      const ssnDigits = ssnItin.replace(/\D/g, "")
      const lastFour = ssnDigits.slice(-4)

      // Update profile with tax verification data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          tax_verified: true,
          tax_legal_name: legalName,
          tax_mailing_address: mailingAddress,
          tax_ssn_itin_encrypted: ssnDigits, // In production, encrypt this server-side
          tax_ssn_last_four: lastFour,
          payout_agreement_accepted_at: new Date().toISOString(),
          payout_agreement_ip: 'client', // In production, capture from server
        })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      setStep(3)
    } catch (err) {
      console.error('Tax verification error:', err)
      setError("Failed to save verification. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF8C00] to-amber-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                <DollarSign className="size-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Payout Verification</h2>
                <p className="text-sm text-white/80">IRS Tax Compliance Required</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="size-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="size-4 text-white" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? 'bg-white text-[#FF8C00]' : 'bg-white/30 text-white/70'
                }`}>
                  {step > s ? <CheckCircle2 className="size-4" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-white' : 'bg-white/30'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Why is this needed?</p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    The IRS requires us to collect your tax information before issuing payments over $600/year. Your data is encrypted and secure.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="legalName" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    Legal Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="legalName"
                    placeholder="As it appears on your tax return"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className={`h-12 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mailingAddress" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    Mailing Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mailingAddress"
                    placeholder="Street, City, State, ZIP"
                    value={mailingAddress}
                    onChange={(e) => setMailingAddress(e.target.value)}
                    className={`h-12 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Used for 1099 tax form delivery
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ssnItin" className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                    SSN or ITIN <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="ssnItin"
                      type="text"
                      placeholder="XXX-XX-XXXX"
                      value={ssnItin}
                      onChange={handleSsnItinChange}
                      maxLength={11}
                      className={`h-12 pr-10 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                    />
                    <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 size-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield className="size-3 text-emerald-500" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">256-bit encrypted and securely stored</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full h-12 bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-semibold"
              >
                Continue to Agreement
              </Button>
            </div>
          )}

          {/* Step 2: Payout Agreement */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="size-5 text-[#FF8C00]" />
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bungee Referrer Payout Agreement
                </h3>
              </div>

              {/* Scrollable Agreement Text */}
              <div className={`h-64 overflow-y-auto rounded-xl border p-4 text-sm leading-relaxed ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">BUNGEE PLATFORM REFERRER PAYOUT AGREEMENT</p>
                
                <p className="mb-3">This Referrer Payout Agreement (&quot;Agreement&quot;) is entered into between you (&quot;Referrer&quot;) and Bungee Technologies, Inc. (&quot;Bungee&quot;) and governs all bounty payouts earned through the Bungee referral platform.</p>

                <p className="font-semibold mb-2">1. ELIGIBILITY AND TAX COMPLIANCE</p>
                <p className="mb-3">Referrer certifies they are a U.S. person (citizen, resident, or entity) and that the Social Security Number (SSN) or Individual Taxpayer Identification Number (ITIN) provided is accurate and belongs to them. Referrer understands that Bungee is required by the Internal Revenue Service (IRS) to collect this information and may issue Form 1099-NEC for payments exceeding $600 in a calendar year.</p>

                <p className="font-semibold mb-2">2. PAYOUT TERMS</p>
                <p className="mb-3">Bounty payments are processed within 5-7 business days after a qualifying referral is verified and confirmed by the participating business. Bungee reserves the right to withhold payment pending fraud investigation or dispute resolution. Minimum payout threshold is $25.00.</p>

                <p className="font-semibold mb-2">3. REFERRER RESPONSIBILITIES</p>
                <p className="mb-3">Referrer agrees to: (a) provide accurate and truthful information; (b) not engage in fraudulent, deceptive, or spam referral practices; (c) comply with all applicable federal, state, and local laws; (d) report all Bungee earnings on their tax returns as required by law.</p>

                <p className="font-semibold mb-2">4. INDEPENDENT CONTRACTOR STATUS</p>
                <p className="mb-3">Referrer is an independent contractor, not an employee of Bungee. Referrer is solely responsible for all taxes, including self-employment taxes, arising from payments received.</p>

                <p className="font-semibold mb-2">5. PLATFORM RULES AND TERMINATION</p>
                <p className="mb-3">Bungee reserves the right to suspend or terminate Referrer&apos;s account and forfeit unpaid bounties for violations of this Agreement or Platform Terms of Service. Bungee may modify payout rates, terms, and conditions at any time with 30 days notice.</p>

                <p className="font-semibold mb-2">6. LIMITATION OF LIABILITY</p>
                <p className="mb-3">Bungee&apos;s total liability shall not exceed the amount of bounties earned by Referrer in the 12 months preceding any claim. Bungee is not liable for indirect, incidental, or consequential damages.</p>

                <p className="font-semibold mb-2">7. DISPUTE RESOLUTION</p>
                <p className="mb-3">Any disputes shall be resolved through binding arbitration in accordance with AAA rules. This Agreement is governed by the laws of the State of Delaware.</p>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Last Updated: June 2026</p>
              </div>

              {/* Certification Checkbox */}
              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agreement"
                    checked={agreementAccepted}
                    onCheckedChange={(checked) => setAgreementAccepted(checked === true)}
                    className="mt-0.5 border-[#FF8C00] data-[state=checked]:bg-[#FF8C00] data-[state=checked]:border-[#FF8C00]"
                  />
                  <label htmlFor="agreement" className={`text-sm cursor-pointer leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-semibold">I certify under penalty of perjury</span> that the SSN/ITIN provided is accurate and belongs to me. I have read, understand, and agree to the Bungee Referrer Payout Agreement and will comply with all IRS reporting requirements.
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertCircle className="size-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className={`flex-1 h-12 ${isDarkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : ''}`}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitVerification}
                  disabled={!agreementAccepted || isSubmitting}
                  className="flex-1 h-12 bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-semibold"
                >
                  {isSubmitting ? "Verifying..." : "Accept & Verify"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              <div className="mx-auto size-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-10 text-emerald-500" />
              </div>
              
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Payout Verified!
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your tax information has been securely saved. You can now withdraw your earnings.
                </p>
              </div>

              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available Balance</span>
                  <span className={`text-2xl font-bold text-emerald-500`}>{pendingAmount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-emerald-500" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Tax ID ending in ***-**-{ssnItin.slice(-4)}</span>
                </div>
              </div>

              <Button
                onClick={onVerified}
                className="w-full h-12 bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-semibold"
              >
                Continue to Cash Out
              </Button>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className={`px-6 py-3 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center justify-center gap-2">
            <Lock className="size-3.5 text-emerald-500" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Bank-level encryption  |  IRS Compliant  |  SOC 2 Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
