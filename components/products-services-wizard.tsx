"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Check,
  Package,
  Wrench,
  DollarSign,
  Percent,
  FileText,
  Sparkles,
  Upload,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Users,
  CheckCircle2,
  Tag,
  Gift,
  PartyPopper,
} from "lucide-react"

type OfferingType = "product" | "service"
type BountyMode = "flat" | "percentage"

interface ProductsServicesWizardProps {
  onClose: () => void
}

const STEPS = [
  { id: 1, title: "Core Information", icon: Tag },
  { id: 2, title: "Detailed Specifications", icon: FileText },
  { id: 3, title: "The Hook & Assets", icon: Sparkles },
  { id: 4, title: "Referral Bounty Setup", icon: DollarSign },
]

const PRICING_MODELS = ["Flat Rate", "Hourly", "Subscription", "Custom Quote"]
const PAYOUT_TRIGGERS = ["Upon Lead Verification", "Upon Contract Signing", "Upon First Payment Received"]

export default function ProductsServicesWizard({ onClose }: ProductsServicesWizardProps) {
  // null = chooser screen; otherwise the 4-step form is active for the chosen type
  const [offeringType, setOfferingType] = useState<OfferingType | null>(null)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  // Step 1: Core Information
  const [name, setName] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [pricingModel, setPricingModel] = useState("")

  // Step 2: Detailed Specifications
  const [summary, setSummary] = useState("")
  const [deepDive, setDeepDive] = useState("")
  const [audienceInput, setAudienceInput] = useState("")
  const [audienceTags, setAudienceTags] = useState<string[]>([])

  // Step 3: The Hook & Assets
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [customerIncentive, setCustomerIncentive] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 4: Referral Bounty Setup
  const [bountyMode, setBountyMode] = useState<BountyMode>("flat")
  const [bountyValue, setBountyValue] = useState("")
  const [payoutTrigger, setPayoutTrigger] = useState("")

  const isProduct = offeringType === "product"
  const accent = "#FF8C00"

  const resetForm = () => {
    setStep(1)
    setName("")
    setBasePrice("")
    setPricingModel("")
    setSummary("")
    setDeepDive("")
    setAudienceInput("")
    setAudienceTags([])
    setMediaUrls([])
    setUploadError("")
    setCustomerIncentive("")
    setBountyMode("flat")
    setBountyValue("")
    setPayoutTrigger("")
    setSubmitted(false)
  }

  const chooseType = (type: OfferingType) => {
    resetForm()
    setOfferingType(type)
  }

  // Top-left back arrow behavior depends on context
  const handleBack = () => {
    if (submitted) {
      onClose()
      return
    }
    if (offeringType === null) {
      onClose()
    } else if (step > 1) {
      setStep((s) => s - 1)
    } else {
      // back from step 1 returns to the chooser
      setOfferingType(null)
    }
  }

  const addTag = () => {
    const value = audienceInput.trim()
    if (value && !audienceTags.includes(value)) {
      setAudienceTags((prev) => [...prev, value])
    }
    setAudienceInput("")
  }

  const removeTag = (tag: string) => setAudienceTags((prev) => prev.filter((t) => t !== tag))

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError("")
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/bounties/upload", { method: "POST", body: formData })
      const result = await res.json()
      if (!res.ok || result.error) {
        setUploadError(result.error || "Upload failed. Please try again.")
        return
      }
      setMediaUrls((prev) => [...prev, result.url])
    } catch (err) {
      console.error("[v0] Media upload error:", err)
      setUploadError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeMedia = (url: string) => setMediaUrls((prev) => prev.filter((u) => u !== url))

  // Per-step validation
  const isStepValid = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0 && pricingModel.length > 0
      case 2:
        return summary.trim().length > 0 && deepDive.trim().length > 0
      case 3:
        return true // assets optional
      case 4:
        return bountyValue.trim().length > 0 && parseFloat(bountyValue) > 0 && payoutTrigger.length > 0
      default:
        return false
    }
  }

  const next = () => {
    if (step < 4) setStep((s) => s + 1)
    else setSubmitted(true)
  }

  // ---------- CHOOSER SCREEN ----------
  if (offeringType === null) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-5" />
            Back
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-balance">
              What would you like to add?
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
              Choose what you want word-of-mouth Cords to refer for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => chooseType("product")}
              className="group flex flex-col items-center text-center gap-4 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#FF8C00] hover:shadow-lg transition-all"
            >
              <div className="size-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="size-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Product</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  A physical or digital item from your catalog
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-[#FF8C00] opacity-0 group-hover:opacity-100 transition-opacity">
                Get started <ChevronRight className="size-4" />
              </span>
            </button>

            <button
              onClick={() => chooseType("service")}
              className="group flex flex-col items-center text-center gap-4 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#FF8C00] hover:shadow-lg transition-all"
            >
              <div className="size-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wrench className="size-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Service</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Work you perform, like installs, consulting, or repairs
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-[#FF8C00] opacity-0 group-hover:opacity-100 transition-opacity">
                Get started <ChevronRight className="size-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- SUCCESS SCREEN ----------
  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
          <div className="size-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
            <PartyPopper className="size-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isProduct ? "Product" : "Service"} Ready to Refer!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            &quot;{name}&quot; has been set up. Cords can now start referring it for a{" "}
            {bountyMode === "flat" ? `$${bountyValue}` : `${bountyValue}%`} bounty.
          </p>
          <div className="flex flex-col gap-2 mt-6">
            <Button
              onClick={() => chooseType(offeringType)}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600"
            >
              Add Another
            </Button>
            <Button onClick={onClose} className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---------- 4-STEP FORM ----------
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
            Back
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {isProduct ? <Package className="size-4 text-blue-600" /> : <Wrench className="size-4 text-emerald-600" />}
            {isProduct ? "Product" : "Service"}
          </div>
        </div>

        {/* PROGRESS TRACKER */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon
            const isActive = step === s.id
            const isComplete = step > s.id
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div
                    className={`size-9 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-[#FF8C00] text-white shadow-md"
                        : isComplete
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }`}
                  >
                    {isComplete ? <Check className="size-4" /> : <StepIcon className="size-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-medium text-center hidden sm:block max-w-[72px] leading-tight ${
                      isActive ? "text-[#FF8C00]" : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 rounded ${step > s.id ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{STEPS[step - 1].title}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Step {step} of 4</p>

          {/* STEP 1: CORE INFORMATION */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Offering type toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Offering Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { type: "product" as OfferingType, icon: Package, label: "Product" },
                    { type: "service" as OfferingType, icon: Wrench, label: "Service" },
                  ]).map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOfferingType(type)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        offeringType === type
                          ? "border-[#FF8C00] bg-[#FF8C00]/5"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`size-4 ${offeringType === type ? "text-[#FF8C00]" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${offeringType === type ? "text-[#FF8C00]" : "text-gray-600 dark:text-gray-300"}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isProduct ? "Product Name" : "Service Name"}
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isProduct ? "e.g., Enterprise SaaS License" : "e.g., Premium HVAC Installation"}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-9 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pricing Model</Label>
                  <Select value={pricingModel} onValueChange={setPricingModel}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILED SPECIFICATIONS */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Elevator Pitch</Label>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief 2-sentence elevator pitch for Cords to use..."
                  className="min-h-[80px] resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deep Dive Details</Label>
                <Textarea
                  value={deepDive}
                  onChange={(e) => setDeepDive(e.target.value)}
                  placeholder="Provide exhaustive technical specs, scope of work, service inclusions, warranties, and exact service boundaries / delivery timelines."
                  className="min-h-[140px] resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Audience</Label>
                <div className="flex gap-2">
                  <Input
                    value={audienceInput}
                    onChange={(e) => setAudienceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Who is the ideal buyer? (e.g., Homeowners, B2B)"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="shrink-0 border-gray-300 dark:border-gray-600">
                    Add
                  </Button>
                </div>
                {audienceTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {audienceTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FF8C00]/10 text-[#E67E00]"
                      >
                        <Users className="size-3" />
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                          <X className="size-3 hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: THE HOOK & ASSETS */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Product Images, Service Flyers, or Case Studies
                  <span className="text-gray-400 font-normal"> (optional)</span>
                </Label>

                {mediaUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {mediaUrls.map((url) => (
                      <div key={url} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url || "/placeholder.svg"} alt="Uploaded asset" className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeMedia(url)}
                          className="absolute top-1 right-1 size-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                          aria-label="Remove asset"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 hover:border-[#FF8C00]/50 transition-colors disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-6 text-[#FF8C00] animate-spin" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <div className="size-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                        <Upload className="size-5 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload</span>
                      <span className="text-xs text-gray-400">Images up to 5MB each</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                {uploadError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {uploadError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Gift className="size-4 text-[#FF8C00]" />
                  Customer Incentive
                </Label>
                <Input
                  value={customerIncentive}
                  onChange={(e) => setCustomerIncentive(e.target.value)}
                  placeholder="Special perk for the referred customer (e.g., 10% off first month)"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          )}

          {/* STEP 4: REFERRAL BOUNTY SETUP */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Bounty Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { mode: "flat" as BountyMode, icon: DollarSign, label: "Flat Amount" },
                    { mode: "percentage" as BountyMode, icon: Percent, label: "Percentage" },
                  ]).map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setBountyMode(mode)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        bountyMode === mode
                          ? "border-[#FF8C00] bg-[#FF8C00]/5"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`size-4 ${bountyMode === mode ? "text-[#FF8C00]" : "text-gray-400"}`} />
                      <span className={`text-sm font-semibold ${bountyMode === mode ? "text-[#FF8C00]" : "text-gray-600 dark:text-gray-300"}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bounty Paid to the Cord
                </Label>
                <div className="relative">
                  {bountyMode === "flat" ? (
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Percent className="absolute right-4 top-1/2 -translate-y-1/2 size-6 text-gray-700 dark:text-gray-300" />
                  )}
                  <Input
                    type="number"
                    value={bountyValue}
                    onChange={(e) => setBountyValue(e.target.value)}
                    placeholder={bountyMode === "flat" ? "100" : "10"}
                    className={`h-16 text-3xl font-bold rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                      bountyMode === "flat" ? "pl-12" : "pr-12"
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Paid to the referring Cord upon a successful close.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payout Trigger</Label>
                <Select value={payoutTrigger} onValueChange={setPayoutTrigger}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="When is the bounty earned?" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYOUT_TRIGGERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* FOOTER NAV */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-300"
            >
              <ChevronLeft className="size-4 mr-1" />
              {step === 1 ? "Back" : "Previous"}
            </Button>
            <Button
              type="button"
              onClick={next}
              disabled={!isStepValid()}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold px-6 disabled:opacity-50"
            >
              {step === 4 ? (
                <>
                  <CheckCircle2 className="size-4 mr-1.5" />
                  Launch
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="size-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
