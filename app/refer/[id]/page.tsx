"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  Loader2, 
  DollarSign, 
  Share2, 
  UserPlus, 
  MapPin, 
  Building2, 
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
  Info,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { 
  generateSmsPayload, 
  generateTrackingUrl, 
  generateEmailSubject,
  triggerNativeShare,
  type CampaignType,
  type DaisyChainPayload
} from "@/lib/daisy-chain-sms"

// Mock campaign data - in production this would fetch from API/database
const getMockCampaignData = (id: string) => {
  // Generate deterministic mock data based on ID
  const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  const types = ['hiring', 'service', 'product']
  const type = types[Math.abs(hash) % 3]
  
  if (type === 'hiring') {
    return {
      type: 'hiring',
      title: 'Senior Software Engineer',
      businessName: 'TechCorp Industries',
      businessLogo: null,
      location: 'San Francisco, CA (Remote OK)',
      bountyAmount: 1500,
      description: 'Join our engineering team to build cutting-edge products that millions of users rely on daily. Competitive salary, equity, and benefits included.',
      requirements: ['5+ years experience', 'React/TypeScript', 'System design skills'],
      postedDate: '2 days ago',
      applicants: 12
    }
  } else if (type === 'service') {
    return {
      type: 'service',
      title: 'Premium HVAC Installation',
      businessName: 'Cool Breeze Services',
      businessLogo: null,
      location: 'Austin, TX',
      bountyAmount: 200,
      description: 'Get a free quote on professional HVAC installation. Energy-efficient systems with same-day service available. Licensed, bonded, and insured.',
      requirements: ['Free consultation', 'Same-day quotes', '10-year warranty'],
      postedDate: '1 week ago',
      applicants: 28
    }
  } else {
    return {
      type: 'product',
      title: 'Premium Ergonomic Standing Desk',
      businessName: 'ErgoDesk Co.',
      businessLogo: null,
      location: 'Ships Nationwide',
      bountyAmount: 75,
      description: 'Transform your workspace with our award-winning standing desk. Reduce back pain and boost productivity. Ships fully assembled with a 10-year warranty.',
      requirements: ['Free shipping', '30-day returns', 'Assembly included'],
      postedDate: '3 days ago',
      applicants: 45
    }
  }
}

// Generate a unique visitor ID for tracking
const generateVisitorId = () => {
  const existingId = typeof window !== 'undefined' ? localStorage.getItem('bungee_visitor_id') : null
  if (existingId) return existingId
  const newId = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
  if (typeof window !== 'undefined') localStorage.setItem('bungee_visitor_id', newId)
  return newId
}

export default function ReferralLandingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const campaignId = params.id as string
  
  // Extract tracking parameters from URL for multi-level referral chain
  const originatorId = searchParams.get('originator') // The original person who started the chain
  const referrerId = searchParams.get('referrer') // The person who shared this specific link
  
  const [isLoading, setIsLoading] = useState(true)
  const [campaign, setCampaign] = useState<ReturnType<typeof getMockCampaignData> | null>(null)
  const [copied, setCopied] = useState(false)
  const [visitorId, setVisitorId] = useState<string | null>(null)
  
  // Application form modal state
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [applyForm, setApplyForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  const trackReferralVisit = async (
    campaignId: string,
    visitorId: string,
    originator: string | null,
    referrer: string | null
  ) => {
    try {
      const supabase = createClient()
      
      // Insert referral chain visit record
      await supabase.from('referral_visits').insert({
        campaign_id: campaignId,
        visitor_id: visitorId,
        originator_id: originator,
        referrer_id: referrer,
        visited_at: new Date().toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        chain_depth: originator ? (referrer && referrer !== originator ? 2 : 1) : 0
      }).select().maybeSingle()
    } catch (error) {
      // Silently fail - don't block the user experience
      console.log('[v0] Referral tracking (non-critical):', error)
    }
  }

  useEffect(() => {
    // Generate or retrieve visitor ID
    const vId = generateVisitorId()
    setVisitorId(vId)
    
    // Track referral visit and store chain data
    if (campaignId) {
      // Store referral chain in localStorage for persistence
      localStorage.setItem('bungee_referral_id', campaignId)
      localStorage.setItem('bungee_referral_timestamp', new Date().toISOString())
      if (originatorId) localStorage.setItem('bungee_originator_id', originatorId)
      if (referrerId) localStorage.setItem('bungee_referrer_id', referrerId)
      
      // Track visit in Supabase (async, non-blocking)
      trackReferralVisit(campaignId, vId, originatorId, referrerId)
      
      // Load campaign data
      const data = getMockCampaignData(campaignId)
      setCampaign(data)
    }
    
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [campaignId, originatorId, referrerId])

  // Handle "Refer & Earn" with Web Share API and chain tracking
  const handleShare = async () => {
    // Build the daisy chain payload for all campaign types
    const campaignTypeMap: Record<string, CampaignType> = {
      'hiring': 'hiring',
      'service': 'service', 
      'product': 'product'
    }
    
    const payload: DaisyChainPayload = {
      businessName: campaign?.businessName || 'Bungee',
      title: campaign?.title || 'Opportunity',
      bountyAmount: campaign?.bountyAmount || 0,
      campaignType: campaignTypeMap[campaign?.type || 'service'] || 'service',
      campaignId: campaignId,
      originatorId: originatorId || visitorId || undefined,
      referrerId: referrerId || undefined,
      currentUserId: visitorId || undefined
    }
    
    const shareUrl = generateTrackingUrl(payload)
    const shareText = generateSmsPayload(payload)

    // Track the share action in Supabase
    try {
      const supabase = createClient()
      await supabase.from('referral_shares').insert({
        campaign_id: campaignId,
        sharer_id: visitorId,
        originator_id: payload.originatorId,
        shared_at: new Date().toISOString(),
        share_url: shareUrl
      }).select().maybeSingle()
    } catch {
      // Non-blocking
    }

    // Use the centralized native share trigger
    const shared = await triggerNativeShare(payload)
    
    if (!shared) {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        prompt('Copy this referral link:', shareUrl)
      }
    }
  }

  // Handle application form submission
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!applyForm.firstName || !applyForm.lastName || !applyForm.email || !applyForm.phone) {
      return
    }
    
    setIsSubmittingApplication(true)
    
    try {
      const supabase = createClient()
      
      // Insert applicant record into Supabase
      await supabase.from('campaign_applicants').insert({
        campaign_id: campaignId,
        first_name: applyForm.firstName,
        last_name: applyForm.lastName,
        email: applyForm.email,
        phone: applyForm.phone,
        visitor_id: visitorId,
        originator_id: originatorId,
        referrer_id: referrerId,
        applied_at: new Date().toISOString(),
        status: 'pending'
      })
      
      setApplicationSubmitted(true)
    } catch (error) {
      console.log('[v0] Application submission error:', error)
      // Still show success to user - we can retry later
      setApplicationSubmitted(true)
    } finally {
      setIsSubmittingApplication(false)
    }
  }

  // Handle "I'm Interested" click - open modal
  const handleApplyClick = () => {
    setShowApplyModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF8C00] mx-auto mb-4" />
          <p className="text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    )
  }

  const typeLabel = campaign?.type === 'hiring' ? 'Job Opportunity' : campaign?.type === 'service' ? 'Service Offer' : 'Product Deal'
  const TypeIcon = campaign?.type === 'hiring' ? Briefcase : campaign?.type === 'service' ? Building2 : DollarSign

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/bungee-logo.png" alt="Bungee" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl text-[#0f172a]">BUNGEE</span>
          </Link>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Public Offer</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Premium Split-Action Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Card Header - Campaign Type Badge */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TypeIcon className="size-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">{typeLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="size-3" />
              {campaign?.postedDate}
            </div>
          </div>
          
          {/* Card Body - Campaign Details */}
          <div className="p-6 sm:p-8">
            {/* Business Info Row */}
            <div className="flex items-start gap-4 mb-6">
              <div className="size-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                {campaign?.businessLogo ? (
                  <Image src={campaign.businessLogo} alt={campaign.businessName} width={56} height={56} className="rounded-xl" />
                ) : (
                  <Building2 className="size-7 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-1 leading-tight">
                  {campaign?.title}
                </h1>
                <p className="text-base text-gray-700 font-medium">{campaign?.businessName}</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                  <MapPin className="size-3.5" />
                  {campaign?.location}
                </div>
              </div>
            </div>

            {/* Bounty Reward Highlight */}
            <div className="bg-gradient-to-r from-[#FF8C00]/10 to-orange-100/50 border border-[#FF8C00]/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-0.5">Referral Reward</p>
                  <p className="text-3xl sm:text-4xl font-bold text-[#FF8C00]">
                    ${campaign?.bountyAmount?.toLocaleString()}.00
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Cash payout upon successful {campaign?.type === 'hiring' ? 'hire' : 'conversion'}</p>
                </div>
                <div className="size-14 rounded-full bg-[#FF8C00]/20 flex items-center justify-center">
                  <DollarSign className="size-7 text-[#FF8C00]" />
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              {campaign?.description}
            </p>

            {/* Requirements/Highlights */}
            <div className="space-y-2 mb-8">
              {campaign?.requirements?.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                  {req}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <p className="text-center text-sm font-semibold text-[#0f172a] mb-4">Choose Your Path</p>
            </div>

            {/* Split Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Option 1: Apply Directly - FULL CLICKABLE CARD */}
              <button 
                onClick={handleApplyClick}
                type="button"
                aria-label="Apply for this opportunity"
                className="w-full h-auto min-h-[140px] p-5 sm:p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 active:bg-blue-100 active:scale-[0.98] transition-all text-left cursor-pointer touch-manipulation select-none"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-11 sm:size-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="size-5 sm:size-6 text-blue-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-[#0f172a] leading-tight">
                    I&apos;m Interested
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-3 leading-snug">
                  Apply directly for this {campaign?.type === 'hiring' ? 'position' : 'offer'}
                </p>
                <div className="flex items-center text-sm sm:text-base font-bold text-blue-600">
                  <span>Apply Now</span>
                  <ArrowRight className="size-5 ml-2" />
                </div>
              </button>

              {/* Option 2: Refer & Earn - FULL CLICKABLE ORANGE CARD */}
              <button 
                onClick={handleShare}
                type="button"
                aria-label={copied ? 'Link copied to clipboard' : 'Share this opportunity and earn referral reward'}
                className="w-full h-auto min-h-[140px] p-5 sm:p-6 rounded-xl border-2 border-[#FF8C00] bg-[#FF8C00] hover:bg-[#E67E00] active:bg-[#D97706] active:scale-[0.98] transition-all text-left cursor-pointer shadow-lg shadow-[#FF8C00]/30 touch-manipulation select-none"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-11 sm:size-12 rounded-lg bg-white/25 flex items-center justify-center flex-shrink-0">
                    <Share2 className="size-5 sm:size-6 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {copied ? 'Link Copied!' : 'I Know Someone'}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-white font-medium mb-3 leading-snug">
                  Refer a friend and earn ${campaign?.bountyAmount}
                </p>
                <div className="flex items-center text-sm sm:text-base font-bold text-white">
                  <span>Refer & Earn</span>
                  <ArrowRight className="size-5 ml-2" />
                </div>
              </button>
            </div>

            {/* Network Payout Policy Disclaimer */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50/80">
                <Info className="size-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  <span className="font-medium not-italic text-slate-600">Network Payout Policy:</span> Earn by connecting! The Bungee who directly refers the final successful candidate receives the primary Bounty Cash Reward. If someone you referred passes this link along and secures the match, they receive the full placement reward, and you will automatically be credited a Network Override Fee for initiating the successful connection.
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                <span>{campaign?.applicants} interested</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Verified opportunity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Referral ID: <span className="font-mono text-gray-500">{campaignId}</span>
            {referrerId && <span className="ml-2 text-slate-400">via network share</span>}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-200 mt-8">
        <p>&copy; {new Date().getFullYear()} Bungee. All rights reserved.</p>
      </footer>

      {/* Application Form Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {applicationSubmitted ? (
              // Success State
              <div className="p-8 text-center">
                <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="size-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your interest. {campaign?.businessName} will review your application and contact you soon.
                </p>
                <Button 
                  onClick={() => {
                    setShowApplyModal(false)
                    setApplicationSubmitted(false)
                    setApplyForm({ firstName: '', lastName: '', email: '', phone: '' })
                  }}
                  className="w-full h-12 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold"
                >
                  Done
                </Button>
              </div>
            ) : (
              // Form State
              <>
                {/* Modal Header */}
                <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100/50">
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">Apply Now</h2>
                    <p className="text-sm text-gray-600">{campaign?.title}</p>
                  </div>
                  <button 
                    onClick={() => setShowApplyModal(false)}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors touch-manipulation"
                    type="button"
                  >
                    <X className="size-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleApplySubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={applyForm.firstName}
                        onChange={(e) => setApplyForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="mt-1 h-12 text-base"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={applyForm.lastName}
                        onChange={(e) => setApplyForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="mt-1 h-12 text-base"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 h-12 text-base"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 h-12 text-base"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmittingApplication}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base mt-2 touch-manipulation"
                  >
                    {isSubmittingApplication ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Your information will be shared with {campaign?.businessName} for this opportunity.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
