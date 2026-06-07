"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Building2, 
  X, 
  Briefcase, 
  ShoppingBag, 
  Shield, 
  CheckCircle2, 
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Loader2,
  Trash2,
  Plus,
  Zap,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { addToWaitlist, getWaitlistEntries, getWaitlistCount, deleteWaitlistEntry, type WaitlistEntry } from "./actions/waitlist"
import { sendWaitlistConfirmationEmail } from "./actions/email"
import { QRCodeSVG } from "qrcode.react"

export default function Home() {
  // View states
  const [currentView, setCurrentView] = useState<"main" | "waitlist" | "adminVault">("main")
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistSpot, setWaitlistSpot] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEntries, setIsLoadingEntries] = useState(false)
  
  // Admin state
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [adminError, setAdminError] = useState("")
  const [copiedEmails, setCopiedEmails] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [adminFormData, setAdminFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    zipCode: "",
    accountType: "business" as "bungee" | "business" | "both"
  })
  
  // Waitlist entries from database
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  
  // Unified form data
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    zipCode: "",
    website: "",
    accountType: "" as "bungee" | "business" | "both" | "",
    // For Bungees - what do you want to refer? (multi-select)
    referralInterests: [] as string[],
    // For Businesses - pain points (multi-select)
    painPoints: [] as string[]
  })
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState<{ zipCode?: string }>({})
  const [referralLinkCopied, setReferralLinkCopied] = useState(false)
  
  // Toggle function for multi-select
  const toggleSelection = (field: "referralInterests" | "painPoints", value: string) => {
    console.log("[v0] toggleSelection called:", field, value)
    setFormData(prev => {
      const currentValues = prev[field]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      console.log("[v0] New values for", field, ":", newValues)
      return { ...prev, [field]: newValues }
    })
  }

  // Fetch waitlist entries when admin vault is opened
  const fetchWaitlistEntries = async () => {
    setIsLoadingEntries(true)
    const result = await getWaitlistEntries()
    if (result.success) {
      setWaitlistEntries(result.data as WaitlistEntry[])
    }
    setIsLoadingEntries(false)
  }

  const handleWaitlistSubmit = async () => {
    // Validate ZIP code first
    const zipRegex = /^\d{5}$/
    if (!formData.zipCode || !zipRegex.test(formData.zipCode)) {
      setFormErrors({ zipCode: "Please enter a valid 5-digit ZIP code" })
      return
    }
    setFormErrors({})
    
    if (formData.fullName && formData.email && formData.accountType) {
      // Validate based on account type
      const isBungee = formData.accountType === "bungee" || formData.accountType === "both"
      const isBusiness = formData.accountType === "business" || formData.accountType === "both"
      
      if (isBungee && formData.referralInterests.length === 0) return
      if (isBusiness && (formData.painPoints.length === 0 || !formData.companyName)) return

      setIsSubmitting(true)

      const interestMap: Record<string, string> = {
        jobs: "Refer People for Jobs",
        products: "Refer Products",
        services: "Refer Services"
      }
      const painPointMap: Record<string, string> = {
        customers: "Looking for customers",
        products: "Sell my products",
        services: "Sell my services"
      }

      // Join multiple selections with comma
      const referralInterestText = formData.referralInterests.map(i => interestMap[i] || i).join(", ")
      const painPointText = formData.painPoints.map(p => painPointMap[p] || p).join(", ")

      const newEntry = {
        full_name: formData.fullName,
        company_name: formData.companyName || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        zip_code: formData.zipCode || undefined,
        website: formData.website || undefined,
        account_type: formData.accountType,
        referral_interest: isBungee && referralInterestText ? referralInterestText : undefined,
        pain_point: isBusiness && painPointText ? painPointText : undefined,
      }

      console.log("[v0] Submitting waitlist entry:", newEntry)
      const result = await addToWaitlist(newEntry)
      console.log("[v0] Waitlist submit result:", result)
      
      if (result.success) {
        // Get current count for spot number
        const count = await getWaitlistCount()
        // Convert to paired numbering: 1,1,2,2,3,3,4,4... (each number repeats twice)
        const pairedSpot = Math.ceil(count / 2)
        setWaitlistSpot(pairedSpot)
        
        // Generate referral link
        const referralLink = `https://justbungee.com/join?ref=${formData.fullName.toLowerCase().replace(/\s+/g, '-')}-${pairedSpot}`
        
        // Send confirmation email (async, don't block UI)
        sendWaitlistConfirmationEmail({
          to: formData.email,
          fullName: formData.fullName,
          waitlistSpot: pairedSpot,
          accountType: formData.accountType as "bungee" | "business" | "both",
          referralLink
        }).then(emailResult => {
          if (emailResult.success) {
            console.log("[v0] Confirmation email sent successfully")
          } else {
            console.log("[v0] Email not sent:", emailResult.error)
          }
        })
        
        setWaitlistSubmitted(true)
      } else {
        console.error("[v0] Failed to add to waitlist:", result.error)
        // Still show success UI even if DB fails - fallback behavior
        const fallbackCount = Math.floor(Math.random() * 100) + 1
        setWaitlistSpot(Math.ceil(fallbackCount / 2))
        setWaitlistSubmitted(true)
      }
      
      setIsSubmitting(false)
    }
  }

  const handleAdminLogin = async () => {
    if (adminPassword === "bungee26") {
      setCurrentView("adminVault")
      setAdminError("")
      // Fetch entries when entering admin vault
      await fetchWaitlistEntries()
    } else {
      setAdminError("Invalid password")
    }
  }

  const copyAllEmails = () => {
    const emails = waitlistEntries.map(e => e.email).join(", ")
    navigator.clipboard.writeText(emails)
    setCopiedEmails(true)
    setTimeout(() => setCopiedEmails(false), 2000)
  }

  const handleDeleteEntry = async (id: string) => {
    if (!id) return
    setDeletingId(id)
    try {
      const result = await deleteWaitlistEntry(id)
      if (result.success) {
        setWaitlistEntries(prev => prev.filter(e => e.id !== id))
      }
    } catch (err) {
      console.error("[v0] Delete error:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAdminAddEntry = async () => {
    if (!adminFormData.fullName || !adminFormData.email) return
    setIsAddingEntry(true)
    try {
      const result = await addToWaitlist({
        full_name: adminFormData.fullName,
        company_name: adminFormData.companyName || undefined,
        email: adminFormData.email,
        phone: adminFormData.phone || undefined,
        zip_code: adminFormData.zipCode || undefined,
        account_type: adminFormData.accountType,
        referral_interest: undefined,
        pain_point: undefined
      })
      if (result.success) {
        // Refresh the list
        await fetchWaitlistEntries()
        // Reset form
        setAdminFormData({ fullName: "", companyName: "", email: "", phone: "", zipCode: "", accountType: "business" })
        setShowAddForm(false)
      }
    } catch (err) {
      console.error("[v0] Admin add error:", err)
    } finally {
      setIsAddingEntry(false)
    }
  }

  const resetAndGoBack = () => {
    setCurrentView("main")
    setWaitlistSubmitted(false)
    setFormData({ fullName: "", companyName: "", email: "", phone: "", zipCode: "", website: "", accountType: "", referralInterests: [], painPoints: [] })
    setFormErrors({})
    setAdminPassword("")
    setAdminError("")
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ===== MAIN VIEW ===== */}
      {currentView === "main" && (
        <section className="relative min-h-screen flex flex-col">
          {/* Centered Logo Hero */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 pt-12 md:pt-8">
            <Image
              src="/images/bungee-logo-full.png"
              alt="Bungee - I Gotta a Guy"
              width={400}
              height={240}
              className="w-[280px] md:w-[380px] lg:w-[450px] h-auto"
              priority
            />
            
            {/* Main CTA Section */}
            <div className="mt-10 w-full max-w-md mx-auto px-4">
              {/* Join Waitlist - Primary CTA */}
              <div className="text-center mb-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Get Started</p>
                <button 
                  onClick={() => setCurrentView("waitlist")}
                  className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-base px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Join the Waitlist
                </button>
              </div>

              {/* Secondary Links */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <Link 
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-1.5 text-[#FF8C00] hover:text-[#E67E00] font-medium text-sm transition-colors"
                >
                  <span>Sign Up Now</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <span className="text-gray-300">|</span>
                <Link 
                  href="/auth/login?demo=true"
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
                >
                  <span>View Demo</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* Corporate Admin Access - Pre-Launch Only */}
              <div className="text-center mt-4">
                <Link href="/dashboard/corporate">
                  <button className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1.5 mx-auto">
                    <Lock className="size-3" />
                    Bungee Corporate Dashboard
                  </button>
                </Link>
              </div>

              {/* Admin Access */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Founders Only</p>
                  <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Admin Password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                        className="pr-10 text-sm text-gray-900 placeholder:text-gray-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <Button
                      onClick={handleAdminLogin}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      <Lock className="size-4" />
                    </Button>
                  </div>
                  {adminError && <p className="text-red-500 text-xs mt-2">{adminError}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== UNIFIED WAITLIST VIEW ===== */}
      {currentView === "waitlist" && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <button 
              onClick={resetAndGoBack}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <X className="size-5 text-gray-500" />
            </button>

            {!waitlistSubmitted ? (
              <>
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Secure Your Spot on Bungee</h2>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-sm mx-auto">The premier local network putting an army of promoters to work for businesses while creating uncapped revenue streams for users.</p>
                </div>

                {/* Video Player Section */}
                <div className="px-6 pb-4">
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white text-lg font-semibold">Coming Soon</p>
                      <p className="text-gray-400 text-sm mt-1">Video preview launching shortly</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">Watch: How Bungee deploys thousands of promoters for your business.</p>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                  {/* Account Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-900">I want to join as...</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, accountType: "bungee" })}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          formData.accountType === "bungee"
                            ? "border-[#FF8C00] bg-[#FF8C00]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`size-12 rounded-xl flex items-center justify-center ${formData.accountType === "bungee" ? "bg-[#FF8C00]/10" : "bg-gray-100"}`}>
                          <Users className={`size-6 ${formData.accountType === "bungee" ? "text-[#FF8C00]" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-semibold ${formData.accountType === "bungee" ? "text-gray-900" : "text-gray-700"}`}>
                            A Referrer
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">Earn an uncapped revenue stream of cash rewards by recommending trusted local pros and jobs.</p>
                        </div>
                        {formData.accountType === "bungee" && (
                          <CheckCircle2 className="size-5 text-[#FF8C00]" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, accountType: "business" })}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          formData.accountType === "business"
                            ? "border-[#FF8C00] bg-[#FF8C00]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`size-12 rounded-xl flex items-center justify-center ${formData.accountType === "business" ? "bg-[#FF8C00]/10" : "bg-gray-100"}`}>
                          <Building2 className={`size-6 ${formData.accountType === "business" ? "text-[#FF8C00]" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-semibold ${formData.accountType === "business" ? "text-gray-900" : "text-gray-700"}`}>
                            A Business
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">Get hundreds of thousands of local people promoting your company and driving risk-free customer acquisition.</p>
                        </div>
                        {formData.accountType === "business" && (
                          <CheckCircle2 className="size-5 text-[#FF8C00]" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, accountType: "both" })}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          formData.accountType === "both"
                            ? "border-[#FF8C00] bg-[#FF8C00]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`size-12 rounded-xl flex items-center justify-center ${formData.accountType === "both" ? "bg-[#FF8C00]/10" : "bg-gray-100"}`}>
                          <Sparkles className={`size-6 ${formData.accountType === "both" ? "text-[#FF8C00]" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm font-semibold ${formData.accountType === "both" ? "text-gray-900" : "text-gray-700"}`}>
                            Founding Member (Both)
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">Manage your company profile while earning residual reward cash on the side.</p>
                        </div>
                        {formData.accountType === "both" && (
                          <CheckCircle2 className="size-5 text-[#FF8C00]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Exclusive Waitlist Benefits Section */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Exclusive Waitlist Benefits:</h3>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3">
                        <span className="text-base">🚀</span>
                        <p className="text-xs text-gray-600"><span className="font-medium text-gray-800">Category Exclusivity:</span> Lock in your local business sector before the launch network fills up.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-base">💰</span>
                        <p className="text-xs text-gray-600"><span className="font-medium text-gray-800">Top-Tier Rewards:</span> Get priority access to the highest-paying local campaigns.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-base">⭐</span>
                        <p className="text-xs text-gray-600"><span className="font-medium text-gray-800">Founding Status:</span> Lifetime platform benefits and zero hidden fees for our initial launch wave.</p>
                      </div>
                    </div>
                  </div>

                  {formData.accountType && (
                    <>
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                        <Input
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="border border-gray-200 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] text-gray-900 placeholder:text-gray-400 bg-white py-3"
                        />
                      </div>

                      {/* Company Name - Show for Business or Both */}
                      {(formData.accountType === "business" || formData.accountType === "both") && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Company Name *</Label>
                          <Input
                            placeholder="Your company name"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="border border-gray-200 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] text-gray-900 placeholder:text-gray-400 bg-white py-3"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Email *</Label>
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="border border-gray-200 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] text-gray-900 placeholder:text-gray-400 bg-white py-3"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Phone (optional)</Label>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="border border-gray-200 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] text-gray-900 placeholder:text-gray-400 bg-white py-3"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">ZIP Code *</Label>
                          <Input
                            type="text"
                            placeholder="e.g., 32084"
                            value={formData.zipCode}
                            onChange={(e) => {
                              setFormData({ ...formData, zipCode: e.target.value })
                              if (formErrors.zipCode) setFormErrors({})
                            }}
                            maxLength={5}
                            className={`border focus:ring-1 text-gray-900 placeholder:text-gray-400 bg-white py-3 ${
                              formErrors.zipCode 
                                ? "border-red-400 focus:border-red-500 focus:ring-red-500" 
                                : "border-gray-200 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                            }`}
                          />
                          {formErrors.zipCode && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.zipCode}</p>
                          )}
                        </div>
                      </div>
                      {(formData.accountType === "business" || formData.accountType === "both") && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Website (optional)</Label>
                          <Input
                            placeholder="www.company.com"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="border border-gray-200 focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] text-gray-900 placeholder:text-gray-400 bg-white py-3"
                          />
                        </div>
                      )}

                      {/* Bungee - What do you want to refer? (Multi-select) */}
                      {(formData.accountType === "bungee" || formData.accountType === "both") && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            What do you want to refer? * <span className="text-gray-400 font-normal">(select all that apply)</span>
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "jobs", label: "Jobs", icon: Briefcase },
                              { id: "products", label: "Products", icon: ShoppingBag },
                              { id: "services", label: "Services", icon: Shield },
                            ].map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleSelection("referralInterests", option.id)}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                                  formData.referralInterests.includes(option.id)
                                    ? "border-[#FF8C00] bg-[#FF8C00]/5"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                <option.icon className={`size-4 ${formData.referralInterests.includes(option.id) ? "text-[#FF8C00]" : "text-gray-400"}`} />
                                <span className={`text-sm font-medium ${formData.referralInterests.includes(option.id) ? "text-gray-900" : "text-gray-500"}`}>
                                  {option.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Business - Pain Points (Multi-select) */}
                      {(formData.accountType === "business" || formData.accountType === "both") && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            What do you need? * <span className="text-gray-400 font-normal">(select all that apply)</span>
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "hiring", label: "Hire Talent", icon: Briefcase },
                              { id: "products", label: "Sell Products", icon: ShoppingBag },
                              { id: "services", label: "Promote Services", icon: Shield },
                              { id: "all", label: "All Features", icon: Sparkles },
                            ].map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleSelection("painPoints", option.id)}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                                  formData.painPoints.includes(option.id)
                                    ? "border-[#FF8C00] bg-[#FF8C00]/5"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                <option.icon className={`size-4 ${formData.painPoints.includes(option.id) ? "text-[#FF8C00]" : "text-gray-400"}`} />
                                <span className={`text-sm font-medium ${formData.painPoints.includes(option.id) ? "text-gray-900" : "text-gray-500"}`}>
                                  {option.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleWaitlistSubmit}
                        disabled={
                          isSubmitting ||
                          !formData.fullName || 
                          !formData.email || 
                          !formData.accountType ||
                          ((formData.accountType === "bungee" || formData.accountType === "both") && formData.referralInterests.length === 0) ||
                          ((formData.accountType === "business" || formData.accountType === "both") && (formData.painPoints.length === 0 || !formData.companyName))
                        }
                        className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white py-6 text-base font-semibold disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-5 animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Waitlist Application"
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="p-10 text-center space-y-8">
                
                {/* BUSINESS SUCCESS SCREEN */}
                {formData.accountType === "business" ? (
                  <>
                    {/* Hero Celebration Header - Business */}
                    <div className="space-y-4">
                      <div className="size-20 mx-auto rounded-full bg-gradient-to-br from-[#FF8C00]/20 to-[#FF8C00]/10 flex items-center justify-center shadow-lg shadow-[#FF8C00]/20">
                        <Building2 className="size-10 text-[#FF8C00]" />
                      </div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight">Your business is locked in!</h2>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Launch Tier Priority:</span>
                        <span className="text-xl font-black text-[#FF8C00]">Secured</span>
                      </div>
                    </div>
                    
                    {/* Business Value Message */}
                    <div className="max-w-lg mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left">
                      <p className="text-base text-gray-700 leading-relaxed">
                        Thank you for joining the Bungee network. We are actively building your hyper-local cluster. At launch, an army of <strong className="text-gray-900">hundreds of thousands of local community promoters</strong> will be deployed to drive <strong className="text-[#FF8C00]">risk-free customer acquisition</strong>, premium service leads, and emergency hiring talent straight to your business.
                      </p>
                      <p className="text-base text-gray-700 leading-relaxed mt-4">
                        Keep an eye on your inbox for our <strong className="text-gray-900">merchant onboarding dashboard access link</strong> coming soon.
                      </p>
                    </div>
                    
                    {/* Business CTA */}
                    <div className="pt-2">
                      <Link href="/dashboard/business">
                        <Button 
                          className="w-full max-w-lg py-6 text-lg font-bold rounded-2xl transition-all shadow-lg bg-[#FF8C00] hover:bg-[#E67E00] text-white shadow-[#FF8C00]/30"
                        >
                          Explore Merchant Launch Perks
                        </Button>
                      </Link>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex flex-col gap-4 pt-4">
                      <button onClick={resetAndGoBack} className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                        Back to Home
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* REFERRER SUCCESS SCREEN (includes "both" type) */}
                    {/* Hero Celebration Header */}
                    <div className="space-y-4">
                      <div className="size-20 mx-auto rounded-full bg-gradient-to-br from-[#FF8C00]/20 to-[#FF8C00]/10 flex items-center justify-center shadow-lg shadow-[#FF8C00]/20">
                        <CheckCircle2 className="size-10 text-[#FF8C00]" />
                      </div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight">You&apos;re locked in!</h2>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Your Spot:</span>
                        <span className="text-xl font-black text-[#FF8C00]">#{waitlistSpot}</span>
                      </div>
                    </div>
                    
                    {/* Value Hook - Massive Typography */}
                    <div className="py-6">
                      <p className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                        Scan to Invite.<br />
                        <span className="text-[#FF8C00]">Earn for 18 Months.</span>
                      </p>
                    </div>
                    
                    {/* Structured Checklist Items */}
                    <div className="space-y-5 text-left max-w-lg mx-auto bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="size-8 rounded-full bg-[#FF8C00] flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <p className="text-base text-gray-700 pt-1">Have a business or friend <strong className="text-gray-900">scan your QR code</strong> below.</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="size-8 rounded-full bg-[#FF8C00] flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <p className="text-base text-gray-700 pt-1">When they join, they are <strong className="text-gray-900">locked to your profile</strong> in our system.</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="size-8 rounded-full bg-[#FF8C00] flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <p className="text-base text-gray-700 pt-1">You collect a <strong className="text-gray-900">residual income stream</strong> every time they use Bungee for the next 18 months.</p>
                      </div>
                    </div>
                    
                    {/* QR Code - Master Asset Frame */}
                    <div className="flex justify-center py-4">
                      <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-xl shadow-gray-200/50">
                        <QRCodeSVG 
                          value={`https://justbungee.com/join?ref=${formData.fullName.toLowerCase().replace(/\s+/g, '-')}-${waitlistSpot}`}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#0f172a"
                          level="H"
                          includeMargin={false}
                        />
                        <p className="text-xs text-gray-500 mt-4 text-center font-medium">
                          Direct Scan ID: <span className="text-gray-700">[Traces to your secure profile]</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Backup Share Link */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg mx-auto shadow-sm">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Unique Referral Link</p>
                      <p className="text-sm font-mono text-gray-800 break-all bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        https://justbungee.com/join?ref={formData.fullName.toLowerCase().replace(/\s+/g, '-')}-{waitlistSpot}
                      </p>
                    </div>
                    
                    {/* Copy Button - High Visibility */}
                    <div className="pt-2">
                      <Button 
                        onClick={() => {
                          navigator.clipboard.writeText(`https://justbungee.com/join?ref=${formData.fullName.toLowerCase().replace(/\s+/g, '-')}-${waitlistSpot}`)
                          setReferralLinkCopied(true)
                          setTimeout(() => setReferralLinkCopied(false), 3000)
                        }}
                        className={`w-full max-w-lg py-6 text-lg font-bold rounded-2xl transition-all shadow-lg ${
                          referralLinkCopied 
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200" 
                            : "bg-[#FF8C00] hover:bg-[#E67E00] text-white shadow-[#FF8C00]/30"
                        }`}
                      >
                        {referralLinkCopied ? (
                          <>
                            <Check className="size-6 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="size-6 mr-2" />
                            Copy Backup Share Link
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex flex-col gap-4 pt-4">
                      {formData.accountType === "both" && (
                        <Link href="/dashboard/business">
                          <Button 
                            className="w-full max-w-lg mx-auto bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 py-5 text-base font-semibold rounded-xl shadow-sm"
                          >
                            Preview Your Dashboard
                          </Button>
                        </Link>
                      )}
                      <button onClick={resetAndGoBack} className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                        Back to Home
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ADMIN VAULT VIEW ===== */}
      {currentView === "adminVault" && (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#FF8C00]">BUNGEE Admin Vault</h1>
                <p className="text-gray-400 text-sm">Waitlist Management Console</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF8C00] hover:bg-[#E67E00] text-white transition-colors text-sm font-medium"
                >
                  <Plus className="size-4" />
                  Add Entry
                </button>
                <button
                  onClick={copyAllEmails}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-sm"
                >
                  {copiedEmails ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                  {copiedEmails ? "Copied!" : "Copy All Emails"}
                </button>
                <button
                  onClick={resetAndGoBack}
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Total Entries</p>
                <p className="text-3xl font-bold text-white">{waitlistEntries.length}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Referrers</p>
                <p className="text-3xl font-bold text-green-400">{waitlistEntries.filter(e => e.account_type === "bungee").length}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Businesses</p>
                <p className="text-3xl font-bold text-blue-400">{waitlistEntries.filter(e => e.account_type === "business").length}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Both</p>
                <p className="text-3xl font-bold text-purple-400">{waitlistEntries.filter(e => e.account_type === "both").length}</p>
              </div>
            </div>

            {/* Add Entry Form */}
            {showAddForm && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Add New Entry</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                    <X className="size-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div>
                    <Label className="text-gray-400 text-xs mb-1 block">Full Name *</Label>
                    <Input
                      placeholder="John Doe"
                      value={adminFormData.fullName}
                      onChange={(e) => setAdminFormData({ ...adminFormData, fullName: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-1 block">Company Name</Label>
                    <Input
                      placeholder="Acme Inc"
                      value={adminFormData.companyName}
                      onChange={(e) => setAdminFormData({ ...adminFormData, companyName: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-1 block">Email *</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={adminFormData.email}
                      onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-1 block">Phone</Label>
                    <Input
                      placeholder="(555) 123-4567"
                      value={adminFormData.phone}
                      onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-1 block">ZIP Code</Label>
                    <Input
                      placeholder="e.g., 32084"
                      value={adminFormData.zipCode}
                      onChange={(e) => setAdminFormData({ ...adminFormData, zipCode: e.target.value })}
                      maxLength={5}
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-1 block">Type</Label>
                    <select
                      value={adminFormData.accountType}
                      onChange={(e) => setAdminFormData({ ...adminFormData, accountType: e.target.value as "bungee" | "business" | "both" })}
                      className="w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-700 text-white text-sm"
                    >
                      <option value="business">Business</option>
                      <option value="bungee">Referrer</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleAdminAddEntry}
                    disabled={!adminFormData.fullName || !adminFormData.email || isAddingEntry}
                    className="bg-[#FF8C00] hover:bg-[#E67E00] text-white"
                  >
                    {isAddingEntry ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add to Waitlist"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoadingEntries ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-purple-500" />
                <span className="ml-3 text-gray-400">Loading waitlist entries...</span>
              </div>
            ) : waitlistEntries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No waitlist entries yet.</p>
              </div>
            ) : (
              /* Table */
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-900/50 border-b border-gray-700">
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Referral Interest</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pain Point</th>
                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitlistEntries.map((entry, index) => (
                        <tr key={entry.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                          <td className="p-4 text-sm text-gray-500">{index + 1}</td>
                          <td className="p-4 text-sm font-medium text-white">{entry.full_name}</td>
                          <td className="p-4 text-sm text-gray-300">{entry.company_name || "-"}</td>
                          <td className="p-4 text-sm text-gray-300">{entry.email}</td>
                          <td className="p-4 text-sm text-gray-300">{entry.phone || "-"}</td>
                          <td className="p-4">
                            {entry.referral_interest ? (
                              <Badge className={`text-xs ${
                                entry.referral_interest === "All the Above" ? "bg-[#FF8C00] text-white" :
                                entry.referral_interest.includes("Job") ? "bg-fuchsia-500 text-white" :
                                entry.referral_interest.includes("Product") ? "bg-sky-500 text-white" :
                                "bg-green-500 text-white"
                              }`}>
                                {entry.referral_interest}
                              </Badge>
                            ) : <span className="text-gray-500">-</span>}
                          </td>
                          <td className="p-4">
                            {entry.pain_point ? (
                              <Badge className={`text-xs ${
                                entry.pain_point === "All of the above" ? "bg-[#FF8C00] text-white" :
                                entry.pain_point.includes("customer") ? "bg-blue-500 text-white" :
                                entry.pain_point.includes("product") ? "bg-sky-500 text-white" :
                                "bg-purple-500 text-white"
                              }`}>
                                {entry.pain_point}
                              </Badge>
                            ) : <span className="text-gray-500">-</span>}
                          </td>
                          <td className="p-4">
                            <Badge className={`text-xs ${
                              entry.account_type === "business" ? "bg-blue-500 text-white" : 
                              entry.account_type === "bungee" ? "bg-green-500 text-white" :
                              "bg-purple-500 text-white"
                            }`}>
                              {entry.account_type === "bungee" ? "referrer" : entry.account_type}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => entry.id && handleDeleteEntry(entry.id)}
                              disabled={deletingId === entry.id}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors disabled:opacity-50"
                              title="Delete entry"
                            >
                              {deletingId === entry.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
