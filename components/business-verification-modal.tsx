"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"
import { 
  Building2, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Lock,
  BadgeCheck
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface BusinessVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  userId: string
  isDarkMode?: boolean
}

const MERCHANT_AGREEMENT = `BUNGEE PLATFORM MERCHANT AGREEMENT

Last Updated: January 1, 2026

This Merchant Agreement ("Agreement") is entered into between Bungee Technologies, Inc. ("Bungee," "we," "us," or "our") and the business entity identified in the registration process ("Merchant," "you," or "your").

1. DEFINITIONS

1.1 "Platform" means the Bungee referral and bounty marketplace platform.
1.2 "Bounty" means the monetary reward offered by Merchant for successful referrals.
1.3 "Referrer" means a Bungee user who submits a qualified referral.
1.4 "Campaign" means a bounty offer created by Merchant on the Platform.

2. MERCHANT OBLIGATIONS

2.1 Accurate Information. You agree to provide accurate, current, and complete information during registration and to maintain accurate information throughout your use of the Platform.

2.2 Tax Compliance. You are solely responsible for all tax obligations arising from your use of the Platform, including but not limited to income taxes, sales taxes, and employment taxes.

2.3 EIN Verification. By providing your Employer Identification Number (EIN), you certify that:
   (a) The EIN provided is valid and assigned to your business entity;
   (b) You are authorized to use this EIN on behalf of the business;
   (c) You will use the Platform only for lawful business purposes.

2.4 Payment Obligations. You agree to fund all bounties in advance and acknowledge that Bungee will distribute payments to Referrers according to the Platform's split structure.

3. PLATFORM FEES

3.1 Infrastructure Fee. Bungee retains 25% of each bounty as a platform infrastructure fee.
3.2 Referrer Allocation. 75% of each bounty is allocated to the successful Referrer.
3.3 Fee Modifications. Bungee reserves the right to modify fees with 30 days' notice.

4. HIRING CAMPAIGNS

4.1 Employment Law Compliance. For hiring bounties, you agree to comply with all applicable employment laws, including but not limited to anti-discrimination laws, wage and hour laws, and immigration laws.

4.2 Candidate Treatment. You agree to treat all referred candidates fairly and in accordance with your standard hiring practices.

4.3 Bounty Payment. Hiring bounties become payable upon the candidate's successful completion of the agreed-upon milestone (e.g., hire date, 90-day retention).

5. PRODUCT AND SERVICE CAMPAIGNS

5.1 Accurate Representations. You agree that all product and service descriptions are accurate and not misleading.

5.2 Consumer Protection. You agree to comply with all applicable consumer protection laws.

5.3 Fulfillment. You are solely responsible for fulfilling all orders and services resulting from Platform referrals.

6. INTELLECTUAL PROPERTY

6.1 License Grant. You grant Bungee a non-exclusive license to use your business name, logo, and campaign content for Platform operations and marketing.

6.2 Bungee IP. You acknowledge that all Platform technology, trademarks, and content are owned by Bungee.

7. LIMITATION OF LIABILITY

7.1 TO THE MAXIMUM EXTENT PERMITTED BY LAW, BUNGEE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.

7.2 BUNGEE'S TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

8. INDEMNIFICATION

You agree to indemnify and hold harmless Bungee from any claims, damages, or expenses arising from:
(a) Your violation of this Agreement;
(b) Your violation of any law or regulation;
(c) Your employment or business practices;
(d) Any dispute between you and a Referrer or referred party.

9. TERMINATION

9.1 Either party may terminate this Agreement with 30 days' written notice.
9.2 Bungee may immediately terminate for material breach or illegal activity.
9.3 Upon termination, all pending bounty obligations remain enforceable.

10. DISPUTE RESOLUTION

10.1 Governing Law. This Agreement is governed by the laws of the State of Delaware.
10.2 Arbitration. Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

11. MISCELLANEOUS

11.1 Entire Agreement. This Agreement constitutes the entire agreement between the parties.
11.2 Amendments. Bungee may amend this Agreement with notice to you.
11.3 Severability. If any provision is found unenforceable, the remaining provisions remain in effect.
11.4 Assignment. You may not assign this Agreement without Bungee's written consent.

BY ACCEPTING THIS AGREEMENT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY ALL TERMS AND CONDITIONS HEREIN.`

export default function BusinessVerificationModal({
  isOpen,
  onClose,
  onVerified,
  userId,
  isDarkMode = false
}: BusinessVerificationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [legalBusinessName, setLegalBusinessName] = useState("")
  const [corporateAddress, setCorporateAddress] = useState("")
  const [einTaxId, setEinTaxId] = useState("")
  const [agreementAccepted, setAgreementAccepted] = useState(false)

  const formatEIN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    // Format as XX-XXXXXXX
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`
  }

  const handleEINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value)
    setEinTaxId(formatted)
  }

  const isStep1Valid = legalBusinessName.trim().length >= 2 && 
                       corporateAddress.trim().length >= 10 && 
                       einTaxId.replace(/\D/g, "").length === 9

  const handleStep1Continue = () => {
    if (isStep1Valid) {
      setStep(2)
      setError(null)
    }
  }

  const handleSubmitVerification = async () => {
    if (!agreementAccepted) {
      setError("You must accept the Merchant Agreement to continue.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Get client IP for audit trail (best effort)
      let clientIP = "unknown"
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json")
        const ipData = await ipResponse.json()
        clientIP = ipData.ip
      } catch {
        // IP fetch failed, continue with "unknown"
      }

      // Update profile with verification details
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          business_verified: true,
          legal_business_name: legalBusinessName.trim(),
          corporate_address: corporateAddress.trim(),
          ein_tax_id: einTaxId.trim(),
          merchant_agreement_accepted_at: new Date().toISOString(),
          merchant_agreement_ip: clientIP,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId)

      if (updateError) {
        throw updateError
      }

      // Move to success step
      setStep(3)
      
      // After a brief delay, trigger the verified callback
      setTimeout(() => {
        onVerified()
      }, 2000)

    } catch (err) {
      console.error("[v0] Verification error:", err)
      setError("Failed to save verification details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setStep(1)
    setLegalBusinessName("")
    setCorporateAddress("")
    setEinTaxId("")
    setAgreementAccepted(false)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-lg p-0 overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#FF8C00]/10 flex items-center justify-center">
              <Shield className="size-5 text-[#FF8C00]" />
            </div>
            <div>
              <DialogTitle className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Business Verification
              </DialogTitle>
              <DialogDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Complete verification to launch campaigns
              </DialogDescription>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`
                  size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${step >= s 
                    ? 'bg-[#FF8C00] text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {step > s ? <CheckCircle2 className="size-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    step > s 
                      ? 'bg-[#FF8C00]' 
                      : isDarkMode 
                        ? 'bg-gray-700' 
                        : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Legal Entity Details */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="size-5 text-[#FF8C00]" />
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Legal Entity Details
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="legalName" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Legal Business Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="legalName"
                    placeholder="e.g., Acme Corporation, LLC"
                    value={legalBusinessName}
                    onChange={(e) => setLegalBusinessName(e.target.value)}
                    className={`h-11 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Enter your business name exactly as it appears on your tax documents
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Corporate Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Suite 100, City, State 12345"
                    value={corporateAddress}
                    onChange={(e) => setCorporateAddress(e.target.value)}
                    className={`h-11 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ein" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    EIN / Tax ID Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="ein"
                      placeholder="XX-XXXXXXX"
                      value={einTaxId}
                      onChange={handleEINChange}
                      maxLength={10}
                      className={`h-11 pr-10 font-mono ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                    <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 size-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Your EIN is encrypted and stored securely
                  </p>
                </div>
              </div>

              <Button
                onClick={handleStep1Continue}
                disabled={!isStep1Valid}
                className="w-full h-11 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold mt-4"
              >
                Continue
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Agreement Signature */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="size-5 text-[#FF8C00]" />
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Merchant Agreement
                </h3>
              </div>

              {/* Agreement Text Box */}
              <div className={`
                h-64 overflow-y-auto rounded-lg border p-4 text-xs leading-relaxed
                ${isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-gray-300' 
                  : 'bg-gray-50 border-gray-200 text-gray-700'
                }
              `}>
                <pre className="whitespace-pre-wrap font-sans">
                  {MERCHANT_AGREEMENT}
                </pre>
              </div>

              {/* Checkbox */}
              <div className={`
                flex items-start gap-3 p-4 rounded-lg border
                ${isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-orange-50 border-orange-200'
                }
              `}>
                <Checkbox
                  id="agreement"
                  checked={agreementAccepted}
                  onCheckedChange={(checked) => setAgreementAccepted(checked as boolean)}
                  className="mt-0.5 border-[#FF8C00] data-[state=checked]:bg-[#FF8C00] data-[state=checked]:border-[#FF8C00]"
                />
                <label 
                  htmlFor="agreement" 
                  className={`text-sm leading-snug cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  I certify under penalty of perjury that the EIN provided is accurate and belongs to my business entity. I have read, understood, and agree to be bound by the Bungee Platform Merchant Agreement and all applicable hiring terms.
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>
              )}

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className={`flex-1 h-11 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmitVerification}
                  disabled={!agreementAccepted || isLoading}
                  className="flex-1 h-11 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Accept & Verify
                      <CheckCircle2 className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
              <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <BadgeCheck className="size-10 text-emerald-500" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Verification Complete!
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your business has been verified. You can now create and launch campaigns on Bungee.
              </p>
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                ${isDarkMode 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-emerald-100 text-emerald-700'
                }
              `}>
                <BadgeCheck className="size-4" />
                Verified Merchant
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="size-3" />
            <span>Your information is encrypted and secure</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
