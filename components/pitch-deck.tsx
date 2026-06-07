"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Shield,
  Briefcase,
  ShoppingBag,
  Wrench,
  Building2,
  Scale,
  AlertTriangle,
  Award,
  UserCheck,
  Eye,
  Landmark,
  Presentation,
  Megaphone,
  Star,
  Layers,
  ShieldCheck,
  Clock,
  Check,
  X,
  Bell,
  ArrowRightLeft,
  Globe,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from "lucide-react"

const slides = [
  { id: 1, title: "The New Standard" },
  { id: 2, title: "Core Problems" },
  { id: 3, title: "Problem & Solution" },
  { id: 4, title: "What is a BUNGEE?" },
  { id: 5, title: "Earn Like Never Before" },
  { id: 6, title: "How It Works" },
  { id: 7, title: "Hiring Revolution" },
  { id: 8, title: "Talent Pools" },
  { id: 9, title: "Products & Services" },
  { id: 10, title: "The Rollout" },
  { id: 11, title: "Unit Economics" },
  { id: 12, title: "The Team" },
  { id: 13, title: "The Disruption" },
]

// National Scale Timeline Component
function NationalScaleTimeline() {
  const [activeTab, setActiveTab] = useState('m36')

  const milestones: Record<string, {
    label: string
    title: string
    accounts: string
    overhead: string
    gross: string
    net: string
    referrals: string
    commerce: string
    recruitment: string
    sponsorships: string
  }> = {
    m6: { 
      label: 'Month 6', 
      title: 'Regional Expansion', 
      accounts: '500', 
      overhead: '$25,000', 
      gross: '$166,035', 
      net: '+$141,035',
      referrals: '$46,875', 
      commerce: '$83,330', 
      recruitment: '$33,330', 
      sponsorships: '$2,500' 
    },
    m12: { 
      label: 'Month 12', 
      title: 'Southeast Density', 
      accounts: '2,500', 
      overhead: '$50,000', 
      gross: '$830,225', 
      net: '+$780,225',
      referrals: '$234,375', 
      commerce: '$416,650', 
      recruitment: '$166,650', 
      sponsorships: '$12,550' 
    },
    m18: { 
      label: 'Month 18', 
      title: 'East Coast Dominance', 
      accounts: '7,500', 
      overhead: '$100,000', 
      gross: '$2,478,025', 
      net: '+$2,378,025',
      referrals: '$703,125', 
      commerce: '$1,249,950', 
      recruitment: '$499,950', 
      sponsorships: '$25,000' 
    },
    m24: { 
      label: 'Month 24', 
      title: 'Top 50 Metro Network', 
      accounts: '12,500', 
      overhead: '$150,000', 
      gross: '$4,132,125', 
      net: '+$3,982,125',
      referrals: '$1,171,875', 
      commerce: '$2,083,250', 
      recruitment: '$833,250', 
      sponsorships: '$43,750' 
    },
    m30: { 
      label: 'Month 30', 
      title: 'National Saturation', 
      accounts: '18,500', 
      overhead: '$200,000', 
      gross: '$6,107,045', 
      net: '+$5,907,045',
      referrals: '$1,734,375', 
      commerce: '$3,083,210', 
      recruitment: '$1,233,210', 
      sponsorships: '$56,250' 
    },
    m36: { 
      label: 'Month 36', 
      title: 'Full National Maturity', 
      accounts: '25,000', 
      overhead: '$250,000', 
      gross: '$9,426,750', 
      net: '+$9,176,750',
      referrals: '$2,343,750', 
      commerce: '$4,166,500', 
      recruitment: '$1,666,500', 
      sponsorships: '$1,250,000' 
    }
  }

  const current = milestones[activeTab]

  return (
    <div className="space-y-4">
      {/* Timeline Controls */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(milestones).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`p-3 rounded-xl border text-center transition-all ${
              activeTab === key
                ? 'bg-[#FF8C00] border-[#FF8C00] text-white font-bold shadow-lg'
                : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-80">{value.label}</div>
            <div className="text-sm font-mono mt-0.5">{value.accounts} Biz</div>
          </button>
        ))}
      </div>

      {/* Main Focus Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Stream Breakdowns (7 Columns) */}
        <div className="lg:col-span-7 bg-gray-100 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="flex items-center gap-2 text-[#FF8C00]">
            <Layers size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wide">
              {current.title} Revenue Mix
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs text-gray-700 font-medium">Self-Referral Hiring</span>
              <span className="text-sm font-bold font-mono text-gray-800">{current.referrals} / mo</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs text-gray-700 font-medium">Products and Services</span>
              <span className="text-sm font-bold font-mono text-gray-800">{current.commerce} / mo</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs text-gray-700 font-medium">Pro-Bungee Hire (Professional Recruiters)</span>
              <span className="text-sm font-bold font-mono text-[#FF8C00]">{current.recruitment} / mo</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-xs text-gray-700 font-medium">Localized Ad Pools & Sponsorships</span>
              <span className="text-sm font-bold font-mono text-[#FF8C00]">{current.sponsorships} / mo</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-300 flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1"><Building2 size={14} /> Allocated Scale Overhead:</span>
            <span className="font-bold font-mono text-red-500">({current.overhead}) / mo</span>
          </div>
        </div>

        {/* Dynamic Big Board (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-500" />
              Projected Monthly Gross
            </div>
            <div className="text-3xl font-black font-mono tracking-tight text-gray-900 mb-4">
              {current.gross}
            </div>
          </div>
          
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <TrendingUp size={14} /> Monthly Target Cash Flow
            </div>
            <div className="text-4xl font-black font-mono tracking-tight text-emerald-600">
              {current.net}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
              <ChevronRight size={10} /> Scaled baseline velocity fully cleared
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Investor Exclusions - Prominent Bubbles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#FF8C00]">
          <AlertTriangle size={18} />
          <h3 className="font-bold text-sm uppercase tracking-wide">Pro-Forma Baseline Exclusions (Not Included Above)</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-[#FF8C00] mb-1">
              <Landmark size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Government Grants</div>
            <div className="text-[10px] text-gray-400 mt-0.5">& Funding Initiatives</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-[#FF8C00] mb-1">
              <Building2 size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Corporate Sponsorships</div>
            <div className="text-[10px] text-gray-400 mt-0.5">National Level Partners</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-[#FF8C00] mb-1">
              <Zap size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Bungees Blast</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Premium Subscriptions</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-[#FF8C00] mb-1">
              <Globe size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Canada & Mexico</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Territory Expansions</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-[#FF8C00] mb-1">
              <Star size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Feature Upgrades</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Dashboard Monetization</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enterprise Scale Timeline Component
function EnterpriseScaleTimeline() {
  const [activeTab, setActiveTab] = useState('m36')

  const milestones: Record<string, {
    label: string
    title: string
    accounts: string
    bungees: string
    overhead: string
    gross: string
    net: string
    referrals: string
    commerce: string
    recruitment: string
    sponsorships: string
    narrative: string
  }> = {
    m6: { 
      label: 'Month 6', 
      title: 'Baseline Model (Launch Density)', 
      accounts: '200',
      bungees: '10,000',
      overhead: '$18,000', 
      gross: '$79,582', 
      net: '+$61,582',
      referrals: '$18,750', 
      commerce: '$33,332', 
      recruitment: '$13,332', 
      sponsorships: '$14,168',
      narrative: 'Initial launch density established in North & Central Florida backyard footprint via local business networks.'
    },
    m12: { 
      label: 'Month 12', 
      title: 'Baseline Model (Regional Expansion)', 
      accounts: '1,000',
      bungees: '50,000',
      overhead: '$40,000', 
      gross: '$397,910', 
      net: '+$357,910',
      referrals: '$93,750', 
      commerce: '$166,660', 
      recruitment: '$66,660', 
      sponsorships: '$70,840',
      narrative: 'Linear regional replication across major southeastern metros, proving out independent merchant adoption.'
    },
    m18: { 
      label: 'Month 18', 
      title: 'Target Growth Model (Viral Network Kicks In)', 
      accounts: '5,000',
      bungees: '250,000',
      overhead: '$100,000', 
      gross: '$1,989,550', 
      net: '+$1,889,550',
      referrals: '$468,750', 
      commerce: '$833,300', 
      recruitment: '$333,300', 
      sponsorships: '$354,200',
      narrative: 'The self-spreading mechanism activates. Active Bungees organically pull their preferred local vendors onto the platform.'
    },
    m24: { 
      label: 'Month 24', 
      title: 'Target Growth Model (National Metros)', 
      accounts: '20,000',
      bungees: '1,000,000',
      overhead: '$250,000', 
      gross: '$7,958,200', 
      net: '+$7,708,200',
      referrals: '$1,875,000', 
      commerce: '$3,333,200', 
      recruitment: '$1,333,200', 
      sponsorships: '$1,416,800',
      narrative: 'Viral consumer-led acquisition compounding across Top 50 US metropolitan regions, forcing organic B2B density.'
    },
    m30: { 
      label: 'Month 30', 
      title: 'Velocity/Enterprise Model (Chain Integration)', 
      accounts: '60,000',
      bungees: '3,000,000',
      overhead: '$500,000', 
      gross: '$23,874,600', 
      net: '+$23,374,600',
      referrals: '$5,625,000', 
      commerce: '$9,999,600', 
      recruitment: '$3,999,600', 
      sponsorships: '$4,250,400',
      narrative: 'Activation of multi-location enterprise chain accounts driven by national programmatic partnerships.'
    },
    m36: { 
      label: 'Month 36', 
      title: 'Velocity/Enterprise Model (Exponential Maturity)', 
      accounts: '125,000',
      bungees: '6,250,000',
      overhead: '$1,000,000', 
      gross: '$49,738,750', 
      net: '+$48,738,750',
      referrals: '$11,718,750', 
      commerce: '$20,832,500', 
      recruitment: '$8,332,500', 
      sponsorships: '$8,855,000',
      narrative: 'Full macro scale maturity. Represents just 0.37% of the US SMB market, unlocked via the user-led viral loop and enterprise alliances.'
    }
  }

  const current = milestones[activeTab]

  return (
    <div className="space-y-4">
      {/* Timeline Controls */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(milestones).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              {/* Show justification bubble only above Month 36 */}
              {key === 'm36' && (
                <div className="mb-1.5 p-2 bg-emerald-500 rounded-lg text-center">
                  <div className="text-[9px] text-white font-medium leading-tight">
                    ONLY 8,333 businesses in 15 major cities
                  </div>
                </div>
              )}
              <button
                onClick={() => setActiveTab(key)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  activeTab === key
                    ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-lg'
                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">{value.label}</div>
                <div className="text-sm font-mono mt-0.5">{value.accounts} Biz</div>
              </button>
              {/* Bungees count below each button */}
              <div className="mt-1.5 p-1.5 rounded-lg text-center bg-[#FF8C00] text-white">
                <div className="text-[9px] font-bold">{value.bungees} Bungees</div>
                <div className="text-[7px] opacity-80">(businesses-only network)</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Focus Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Stream Breakdowns (7 Columns) */}
        <div className="lg:col-span-7 bg-gray-100 p-4 rounded-xl border border-gray-200 space-y-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Layers size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wide">
                {current.title}
              </h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed italic border-l-2 border-gray-300 pl-2 mt-2">
              {current.narrative}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {/* Self-Referral Hiring */}
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <div>
                <span className="text-xs text-gray-800 font-medium block">Self-Referral Hiring</span>
                <span className="text-[10px] text-gray-500">Avg 3 hires/yr per account @ $1,500 flat fee (75/25 split)</span>
              </div>
              <span className="text-sm font-bold font-mono text-gray-800">{current.referrals} / mo</span>
            </div>

            {/* Products & Services */}
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <div>
                <span className="text-xs text-gray-800 font-medium block">Products & Services</span>
                <span className="text-[10px] text-gray-500">Automated transaction splits across commercial vendor ecosystems</span>
              </div>
              <span className="text-sm font-bold font-mono text-gray-800">{current.commerce} / mo</span>
            </div>

            {/* Pro-Bungee Hire (Professional Recruiters) */}
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <div>
                <span className="text-xs text-gray-800 font-medium block">Pro-Bungee Hire (Professional Recruiters)</span>
                <span className="text-[10px] text-gray-500">4 out of 10 scale-up enterprise searches @ 2% Corporate Net Fee</span>
              </div>
              <span className="text-sm font-bold font-mono text-sky-600">{current.recruitment} / mo</span>
            </div>

            {/* Sponsorships */}
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <div>
                <span className="text-xs text-gray-800 font-medium block">Localized Ad Pools & Sponsorships</span>
                <span className="text-[10px] text-gray-500">Regional brand ad network density scaled to active markets</span>
              </div>
              <span className="text-sm font-bold font-mono text-[#FF8C00]">{current.sponsorships} / mo</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-300 flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1"><Building2 size={14} /> Scaled National Corporate Overhead:</span>
            <span className="font-bold font-mono text-red-500">({current.overhead}) / mo</span>
          </div>
        </div>

        {/* Dynamic Big Board (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-500" />
              Projected Monthly Top-Line Gross
            </div>
            <div className="text-3xl font-black font-mono tracking-tight text-gray-900 mb-4">
              {current.gross}
            </div>
          </div>
          
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <TrendingUp size={14} /> Net Pre-Tax Monthly Cash Flow
            </div>
            <div className="text-4xl font-black font-mono tracking-tight text-emerald-600">
              {current.net}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
              <ChevronRight size={10} /> Exponential infrastructure leverage cleared
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Investor Exclusions - Prominent Bubbles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#FF8C00]">
          <Award size={18} />
          <h3 className="font-bold text-sm uppercase tracking-wide">Pro-Forma Baseline Exclusions (Not Included Above)</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-emerald-400 mb-1">
              <Landmark size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Government Grants</div>
            <div className="text-[10px] text-gray-400 mt-0.5">& Institutional Funding</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-emerald-400 mb-1">
              <Building2 size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Master Corporate</div>
            <div className="text-[10px] text-gray-400 mt-0.5">National Brand Partners</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-emerald-400 mb-1">
              <Zap size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Bungees Blast</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Premium Subscriptions</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-emerald-400 mb-1">
              <Globe size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">Canada & Mexico</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Territory Expansions</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <div className="text-emerald-400 mb-1">
              <Star size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold text-white">SaaS-Tier Upgrades</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Corporate Dashboard Fees</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PitchDeckProps {
  onViewChange?: (view: "business" | "referral" | "pitch" | "corporate") => void
  currentView?: "business" | "referral" | "pitch" | "corporate"
}

export function PitchDeck({ onViewChange, currentView = "pitch" }: PitchDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Scroll to top when slide changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E8ECF0]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-[#E8ECF0] px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Navigation Tabs - Horizontal */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewChange?.("pitch")}
              className={`text-sm font-bold px-4 py-2 rounded-lg transition-all border-2 ${currentView === "pitch" ? "text-white bg-[#FF8C00] border-[#FF8C00] shadow-md" : "text-gray-600 bg-white border-gray-300 hover:border-[#FF8C00] hover:text-[#FF8C00]"}`}
            >
              Pitch Deck
            </button>
            <button
              onClick={() => onViewChange?.("business")}
              className={`text-sm font-bold px-4 py-2 rounded-lg transition-all border-2 ${currentView === "business" ? "text-white bg-[#FF8C00] border-[#FF8C00] shadow-md" : "text-gray-600 bg-white border-gray-300 hover:border-[#FF8C00] hover:text-[#FF8C00]"}`}
            >
              Businesses
            </button>
            <button
              onClick={() => onViewChange?.("referral")}
              className={`text-sm font-bold px-4 py-2 rounded-lg transition-all border-2 ${currentView === "referral" ? "text-white bg-[#FF8C00] border-[#FF8C00] shadow-md" : "text-gray-600 bg-white border-gray-300 hover:border-[#FF8C00] hover:text-[#FF8C00]"}`}
            >
              Referrals
            </button>
            <button
              onClick={() => onViewChange?.("corporate")}
              className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg transition-all border-2 ${currentView === "corporate" ? "text-white bg-[#FF8C00] border-[#FF8C00] shadow-md" : "text-gray-600 bg-white border-gray-300 hover:border-[#FF8C00] hover:text-[#FF8C00]"}`}
            >
              <img src="/images/bungee-logo.png" alt="Bungee Dashboard" className="size-6 object-contain" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`size-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-[#FF8C00] w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Slide Content */}
      <div className="flex-1 p-4 lg:p-8 overflow-auto bg-[#E8ECF0]">
        <div className="max-w-6xl mx-auto">
          {/* Slide 1: BUNGEE - The New Standard */}
          {currentSlide === 0 && (
            <div className="relative min-h-[75vh] animate-in fade-in duration-500 overflow-hidden bg-white">
              {/* Main Content */}
              <div className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] px-4">
                
                {/* Logo */}
                <div className="mb-8">
                  <Image
                    src="/images/bungee-logo-full.png"
                    alt="BUNGEE - Oh! I Know Someone"
                    width={350}
                    height={350}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
                
                {/* Main Headline */}
                <h1 className="text-5xl lg:text-7xl font-black text-center mb-6 tracking-tight">
                  <span className="text-gray-900">The </span>
                  <span className="text-[#FF8C00]">Referral</span>
                  <br />
                  <span className="text-[#FF8C00]">Operating System</span>
                </h1>

                {/* Tagline */}
                <p className="text-xl lg:text-2xl text-gray-600 text-center mb-6 font-medium">
                  Automating the Word-of-Mouth Economy
                </p>
                
                {/* Patent Pending - Blinking with shield */}
                <div className="flex items-center gap-2 text-blue-400 text-sm tracking-widest uppercase animate-pulse">
                  <Shield className="size-4 fill-blue-400/20" />
                  <span className="font-bold">Patent Pending</span>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Business Core Problems */}
          {currentSlide === 1 && (
            <div className="animate-in fade-in duration-500">
              {/* Full-screen image with text overlay */}
              <div className="relative w-full h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <Image
                  src="/images/worried-business-owner.jpg"
                  alt="Worried business owner in empty store"
                  fill
                  className="object-cover"
                />
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                
                {/* Text Content - Bottom positioned */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <div className="max-w-4xl">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                      Every single business owner wakes up every day with the same two problems.
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                        <span className="text-3xl md:text-4xl font-black text-[#FF8C00]">1</span>
                        <span className="text-lg md:text-xl font-bold text-white">{'"Where are my next customers coming from?"'}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
                        <span className="text-3xl md:text-4xl font-black text-[#FF8C00]">2</span>
                        <span className="text-lg md:text-xl font-bold text-white">{'"Who is going to do the work?"'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3: Problem & Solution */}
          {currentSlide === 2 && (
            <div className="animate-in fade-in duration-500">
              {/* Split Screen - Images on top, content on bottom */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[75vh]">
                
                {/* LEFT SIDE - THE FRAGMENTED OLD WAY */}
                <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl">
                  {/* Image Area - Takes up most of the space */}
                  <div className="relative h-[45vh] lg:h-[50vh]">
                    <Image
                      src="/images/fragmented-platforms.jpg"
                      alt="Fragmented business platforms"
                      fill
                      className="object-cover"
                    />
                    {/* Small badge in corner */}
                    <div className="absolute top-4 left-4">
                      <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-lg">
                        <X className="size-4" strokeWidth={3} />
                        <span className="font-bold uppercase tracking-wide text-xs">The Old Way</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Area - Compact at bottom */}
                  <div className="bg-red-800 p-4 flex-1">
                    <h2 className="text-xl lg:text-2xl font-black text-white mb-3">
                      10 Different Platforms. <span className="text-red-300">Zero Results.</span>
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">Job Boards</span>
                      <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">Paid Ads</span>
                      <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">Sales Tools</span>
                      <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">Recruiters</span>
                      <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">Social Media</span>
                      <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">Cold Outreach</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-red-200">
                        <X className="size-4 text-red-400" />
                        <span>Pay upfront just to be SEEN</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-200">
                        <X className="size-4 text-red-400" />
                        <span>No trust. No accountability.</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-200">
                        <X className="size-4 text-red-400" />
                        <span>10 logins, 10 bills, 10 headaches</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE - THE BUNGEES WAY */}
                <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl">
                  {/* Image Area - Takes up most of the space */}
                  <div className="relative h-[45vh] lg:h-[50vh]">
                    <Image
                      src="/images/bungee-unified.jpg"
                      alt="Bungees unified platform - people connecting"
                      fill
                      className="object-cover"
                    />
                    {/* Small badge in corner */}
                    <div className="absolute top-4 left-4">
                      <div className="inline-flex items-center gap-2 bg-[#FF8C00] text-white px-3 py-1.5 rounded-full shadow-lg">
                        <Check className="size-4" strokeWidth={3} />
                        <span className="font-bold uppercase tracking-wide text-xs">BUNGEES</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Area - Compact at bottom */}
                  <div className="bg-[#FF8C00] p-4 flex-1">
                    <h2 className="text-xl lg:text-2xl font-black text-white mb-3">
                      ONE Platform. <span className="text-orange-200">Powered by People.</span>
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold">HIRING</span>
                      <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold">PRODUCTS</span>
                      <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold">SERVICES</span>
                      <span className="bg-white text-[#FF8C00] text-xs px-3 py-1 rounded-full font-bold">ALL-IN-ONE</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-white">
                        <Check className="size-4" />
                        <span>100% Contingent - Pay ONLY for results</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Check className="size-4" />
                        <span>Word-of-mouth + AI = Trusted referrals</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Check className="size-4" />
                        <span>Your BUNGEES handle everything</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 5: What is a BUNGEE? */}
          {currentSlide === 4 && (
            <div className="relative min-h-[75vh] animate-in fade-in duration-500 overflow-hidden bg-gray-950">
              {/* Single Orange Squiggle */}
              <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                <path d="M-100,300 Q200,50 400,300 T900,300" stroke="#FF8C00" strokeWidth="200" fill="none" />
              </svg>
              
              {/* Subtle Logo Watermark - Center */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <img src="/images/bungee-logo.jpg" alt="" className="w-[600px] h-auto object-contain" />
              </div>
              
              {/* Main Content */}
              <div className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] px-8">
                
                {/* The Big Question */}
                <h1 className="text-6xl lg:text-9xl font-black text-white mb-12 text-center tracking-tight">
                  What is a <span className="text-[#FF8C00]">BUNGEE</span>?
                </h1>
                
                {/* The Answer */}
                <p className="text-3xl lg:text-5xl font-black text-[#FF8C00] text-center">
                  Anyone who makes a referral.
                </p>
              </div>
            </div>
          )}

          {/* Slide 6: Earn Like Never Before - BUNGEE Revenue Streams */}
          {currentSlide === 5 && (
            <div className="relative min-h-[75vh] animate-in fade-in duration-500 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 size-64 rounded-full bg-green-500 blur-[100px]" />
                <div className="absolute bottom-20 right-20 size-64 rounded-full bg-[#FF8C00] blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-blue-500 blur-[120px]" />
              </div>
              
              {/* Subtle Logo Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
                <img src="/images/bungee-logo.jpg" alt="" className="w-[500px] h-auto object-contain" />
              </div>
              
              {/* Main Content */}
              <div className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] px-4 lg:px-8 py-8">
                
                {/* Header */}
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30 text-sm px-4 py-1">THE OPPORTUNITY</Badge>
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-3 text-center tracking-tight">
                  Earn Like <span className="text-green-400">Never Before</span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-400 mb-8 text-center max-w-3xl">
                  Just like <span className="text-[#FF8C00] font-bold">Uber</span> gave everyone with a car a job, <span className="text-[#FF8C00] font-bold">BUNGEE</span> gives everyone with a phone the ability to earn.
                </p>
                
                {/* Revenue Streams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full max-w-5xl mb-8">
                  
                  {/* Hiring Referrals */}
                  <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/30 hover:border-blue-400/60 transition-all hover:scale-[1.02]">
                    <div className="size-14 rounded-xl bg-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Briefcase className="size-7 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Hiring Referrals</h3>
                    <p className="text-gray-400 text-sm mb-4">Refer candidates to job openings. Earn when they get hired.</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-5 text-green-400" />
                      <span className="text-2xl font-black text-green-400">$50 - $500</span>
                      <span className="text-gray-500 text-sm">per hire</span>
                    </div>
                  </div>
                  
                  {/* Product Sales */}
                  <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/30 hover:border-green-400/60 transition-all hover:scale-[1.02]">
                    <div className="size-14 rounded-xl bg-green-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="size-7 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Product Sales</h3>
                    <p className="text-gray-400 text-sm mb-4">Share products with your network. Earn on every sale you drive.</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-5 text-green-400" />
                      <span className="text-2xl font-black text-green-400">5% - 20%</span>
                      <span className="text-gray-500 text-sm">commission</span>
                    </div>
                  </div>
                  
                  {/* Service Referrals */}
                  <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-500/30 hover:border-purple-400/60 transition-all hover:scale-[1.02]">
                    <div className="size-14 rounded-xl bg-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Wrench className="size-7 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Service Referrals</h3>
                    <p className="text-gray-400 text-sm mb-4">Connect people with local services. Earn when deals close.</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-5 text-green-400" />
                      <span className="text-2xl font-black text-green-400">$25 - $200</span>
                      <span className="text-gray-500 text-sm">per referral</span>
                    </div>
                  </div>
                </div>
                
                {/* The Message */}
                <div className="w-full max-w-4xl p-6 rounded-2xl bg-gradient-to-r from-[#FF8C00]/20 via-yellow-500/20 to-green-500/20 border border-[#FF8C00]/30">
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-2xl lg:text-3xl font-black text-white mb-2">Your Phone = Your Paycheck</h3>
                      <p className="text-gray-300">
                        Need rent money? <span className="text-green-400 font-semibold">Refer someone.</span> Need gas money? <span className="text-green-400 font-semibold">Share a product.</span> Want a second income? <span className="text-green-400 font-semibold">Build your network.</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-xl bg-black/30 border border-green-500/30">
                      <p className="text-sm text-gray-400 mb-1">Average Monthly Earnings</p>
                      <p className="text-4xl font-black text-green-400">$500 - $2,000+</p>
                      <p className="text-xs text-gray-500">for active BUNGEEs</p>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Tagline */}
                <p className="mt-8 text-xl lg:text-2xl font-bold text-center">
                  <span className="text-gray-400">No inventory. No overhead. Just </span>
                  <span className="text-[#FF8C00]">connections</span>
                  <span className="text-gray-400"> that </span>
                  <span className="text-green-400">pay</span>
                  <span className="text-gray-400">.</span>
                </p>
              </div>
            </div>
          )}

          {/* Slide 4: How It Works - The Connection */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center mb-6">
                <Badge className="mb-4 bg-[#FF8C00]/20 text-[#FF8C00] border-[#FF8C00]/30">HOW IT WORKS</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Three Simple Steps. <span className="text-[#FF8C00]">Everybody Wins.</span>
                </h1>
              </div>

              {/* Three Step Cards with Images */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Step 1: Business Posts Bounty */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <div className="relative h-[45vh]">
                    <Image
                      src="/images/business-posting-bounty.jpg"
                      alt="Business posting a bounty"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-black text-[#FF8C00]">1</span>
                      <h3 className="text-xl font-bold text-white">Businesses Post the Bounty</h3>
                    </div>
                    <p className="text-sm text-gray-300">Hiring needs, products, services - all with rewards attached.</p>
                  </div>
                </div>

                {/* Step 2: Bungees Refer */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <div className="relative h-[45vh]">
                    <Image
                      src="/images/bungees-spreading-word.jpg"
                      alt="Bungees referring connections"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-black text-[#FF8C00]">2</span>
                      <h3 className="text-xl font-bold text-white">BUNGEEs Refer</h3>
                    </div>
                    <p className="text-sm text-gray-300">Your network spreads the word to their networks.</p>
                  </div>
                </div>

                {/* Step 3: Everybody Wins */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <div className="relative h-[45vh]">
                    <Image
                      src="/images/everybody-wins.jpg"
                      alt="Everybody wins"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-black text-[#FF8C00]">3</span>
                      <h3 className="text-xl font-bold text-white">Everybody Wins</h3>
                    </div>
                    <p className="text-sm text-gray-300">Business gets customers. Bungees get paid. Simple.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Slide 7: Hiring - THE FUTURE OF RECRUITING */}
          {currentSlide === 6 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center mb-6">
                <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">HIRING</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="text-[#FF8C00]">Recruiting</span> Options
                </h1>
                <p className="text-xl text-gray-600">All Roads Lead to BUNGEE</p>
              </div>

              {/* Hiring - Enhanced for Market Dominance - Full Width */}
              <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-900 to-gray-900 overflow-hidden hover:border-blue-400 transition-all relative">
                {/* Market Dominance Banner - BIGGER */}
                <div className="bg-gradient-to-r from-[#FF8C00] to-orange-600 py-4 px-4">
                  <p className="text-xl md:text-2xl font-black text-white text-center tracking-wide">THE FUTURE OF RECRUITING</p>
                  <p className="text-2xl md:text-3xl font-black text-white text-center">ALL ROADS LEAD TO <span className="text-black">BUNGEE</span></p>
                </div>
                <CardContent className="py-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Briefcase className="size-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Hiring</h3>
                        <p className="text-sm text-blue-300">Word of Mouth + Pro Recruiters</p>
                      </div>
                      <Badge className="bg-[#FF8C00] text-white border-0 text-sm ml-4">GLOBAL LEADER</Badge>
                    </div>
                  </div>
                  
                  {/* Two-Tier System - Side by Side */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Standard Referral Hiring */}
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-white">Standard Referral Hiring</span>
                        <span className="text-sm text-gray-400">Network Power</span>
                      </div>
                      <div className="flex justify-center">
                        {/* Blast Network - Megaphone emphasis */}
                        <div className="p-6 rounded bg-gradient-to-br from-[#FF8C00]/30 to-orange-900/30 border border-[#FF8C00]/50 text-center relative overflow-hidden max-w-xs w-full">
                          <div className="absolute -right-2 -top-2 opacity-20">
                            <Megaphone className="size-16 text-[#FF8C00] rotate-[-20deg]" />
                          </div>
                          <div className="relative z-10">
                            <div className="size-16 mx-auto mb-3 rounded-full bg-[#FF8C00] flex items-center justify-center shadow-lg shadow-[#FF8C00]/50">
                              <Megaphone className="size-8 text-white" />
                            </div>
                            <p className="text-lg font-bold text-[#FF8C00]">Blast Network</p>
                            <p className="text-sm text-gray-400">Sound the alarm!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* BUNGEE Pool & Hire Heroes */}
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900/50 to-green-900/50 border-2 border-blue-500 relative">
                      <div className="absolute -top-3 right-4 bg-blue-500 px-3 py-1 rounded text-xs font-black text-white">TALENT POOLS</div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-blue-300">Ready-to-Work Talent</span>
                        <span className="text-sm text-blue-400">Pre-Qualified Candidates</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {/* BUNGEE Pool */}
                        <div className="p-4 rounded bg-gradient-to-br from-blue-800/50 to-blue-900/50 border border-blue-500/50 text-center relative overflow-hidden">
                          <div className="absolute -right-1 -bottom-1 opacity-20">
                            <Users className="size-14 text-blue-400" />
                          </div>
                          <div className="relative z-10">
                            <div className="flex justify-center -space-x-2 mb-2">
                              <div className="size-9 rounded-full bg-blue-500 border-2 border-blue-900 flex items-center justify-center">
                                <span className="text-xs text-white font-bold">B</span>
                              </div>
                              <div className="size-9 rounded-full bg-blue-600 border-2 border-blue-900 flex items-center justify-center">
                                <span className="text-xs text-white font-bold">B</span>
                              </div>
                              <div className="size-9 rounded-full bg-blue-700 border-2 border-blue-900 flex items-center justify-center">
                                <span className="text-xs text-white font-bold">B</span>
                              </div>
                            </div>
                            <p className="text-base font-bold text-blue-300">BUNGEE Pool</p>
                            <p className="text-xs text-blue-400">Ready to work!</p>
                          </div>
                        </div>
                        {/* Hire Heroes - Military badge look */}
                        <div className="p-4 rounded bg-gradient-to-br from-green-800/50 to-green-900/50 border border-green-500/50 text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9InN0YXJzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IiM0YWRlODAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3N0YXJzKSIvPjwvc3ZnPg==')] opacity-50"></div>
                          <div className="relative z-10">
                            <div className="size-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-green-700 border-2 border-green-400 flex items-center justify-center shadow-lg shadow-green-500/50">
                              <Shield className="size-7 text-white" />
                            </div>
                            <p className="text-base font-bold text-green-300">Hire Heroes</p>
                            <p className="text-xs text-green-400">Veterans First</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dominance Statement */}
                  <div className="text-center p-3 rounded-lg bg-[#FF8C00]/20 border border-[#FF8C00]/50 mb-6">
                    <p className="text-lg font-bold text-[#FF8C00]">Destined to become the world&apos;s largest recruiting platform</p>
                  </div>
                  
                  {/* Premium Recruiter Package */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-gray-900/50 border border-purple-500/30">
                    <p className="text-sm font-bold text-purple-400 uppercase tracking-wide mb-3 text-center">Premium Package</p>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-800/30 to-black border-2 border-purple-500 relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-[#FF8C00] px-3 py-1 rounded text-xs font-black text-white">BUSINESS UPGRADE</div>
                      <div className="text-center mb-4">
                        <p className="text-2xl font-black text-white">100s of <span className="text-purple-400">Professional Recruiters</span></p>
                        <p className="text-sm text-gray-400">At Your Service 24/7</p>
                      </div>
                      
                      {/* Recruiter Grid Visual */}
                      <div className="flex justify-center mb-4">
                        <div className="grid grid-cols-9 gap-2">
                          {[...Array(27)].map((_, i) => (
                            <div key={i} className="size-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 border border-purple-400 flex items-center justify-center shadow-sm">
                              <UserCheck className="size-3.5 text-white" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Benefits */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 rounded bg-purple-900/50 border border-purple-500/30 text-center">
                          <Target className="size-6 mx-auto text-purple-400 mb-2" />
                          <p className="text-sm text-purple-300 font-semibold">Targeted Search</p>
                        </div>
                        <div className="p-3 rounded bg-purple-900/50 border border-purple-500/30 text-center">
                          <Zap className="size-6 mx-auto text-[#FF8C00] mb-2" />
                          <p className="text-sm text-orange-300 font-semibold">Fast Placement</p>
                        </div>
                        <div className="p-3 rounded bg-purple-900/50 border border-purple-500/30 text-center">
                          <Award className="size-6 mx-auto text-green-400 mb-2" />
                          <p className="text-sm text-green-300 font-semibold">Quality Hires</p>
                        </div>
                      </div>
                      
                      {/* CTA */}
                      <div className="text-center p-3 rounded bg-gradient-to-r from-purple-600 to-[#FF8C00] shadow-lg">
                        <p className="text-lg font-black text-white">UNLOCK PRO RECRUITING POWER</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Slide 9: Products & Services - Post & Activate */}
          {currentSlide === 8 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center mb-6">
                <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">THE BUNGEE WAY</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="text-[#FF8C00]">Products</span> and <span className="text-[#FF8C00]">Services</span>
                </h1>
                <p className="text-xl text-gray-600">Post & ACTIVATE - No More Waiting</p>
                
                {/* Powerful Tagline */}
                <div className="mt-6 p-4 bg-gradient-to-r from-[#FF8C00] via-orange-500 to-[#FF8C00] rounded-xl shadow-2xl shadow-[#FF8C00]/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]"></div>
                  <div className="relative z-10">
                    <p className="text-2xl lg:text-3xl font-black text-white mb-2 drop-shadow-lg">
                      Expand Your Sales Force By <span className="text-black">THOUSANDS</span> Overnight.
                    </p>
                    <p className="text-lg lg:text-xl font-bold text-white/90">
                      <span className="line-through text-white/60">Stop posting and waiting.</span>{" "}
                      <span className="text-black font-black">Start posting and ACTIVATING.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Products & Services - Full Width */}
              <Card className="border-2 border-green-500 bg-gradient-to-br from-green-900 to-gray-900 overflow-hidden hover:border-green-400 transition-all">
                <CardContent className="py-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="size-14 rounded-lg bg-green-600 flex items-center justify-center">
                        <ShoppingBag className="size-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Products & Services</h3>
                      <Badge className="bg-green-500 text-white border-0 text-sm ml-4">GAME CHANGER</Badge>
                    </div>
                  </div>
                  
                  {/* Old Way vs BUNGEE Way Comparison */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Old School - Post & Wait */}
                    <div className="p-6 rounded-lg bg-red-900/30 border border-red-500/50 relative">
                      <div className="absolute top-2 right-2">
                        <X className="size-6 text-red-500" />
                      </div>
                      <p className="text-sm font-bold text-red-400 uppercase tracking-wide mb-4">Old School</p>
                      <div className="text-center py-6">
                        <div className="size-16 mx-auto mb-4 rounded-full bg-red-900/50 border border-red-500/50 flex items-center justify-center">
                          <Clock className="size-8 text-red-400" />
                        </div>
                        <p className="text-2xl font-bold text-red-300">Post & Wait</p>
                        <p className="text-sm text-red-400 mt-2">Hope someone sees it...</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-red-400 text-sm">
                        <span>Slow</span>
                        <span>•</span>
                        <span>Passive</span>
                        <span>•</span>
                        <span>Uncertain</span>
                      </div>
                    </div>
                    
                    {/* BUNGEE Way - Post & Activate */}
                    <div className="p-6 rounded-lg bg-gradient-to-br from-green-800/50 to-[#FF8C00]/20 border-2 border-green-500 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Check className="size-6 text-green-400" />
                      </div>
                      <div className="absolute -right-8 -bottom-8 opacity-20">
                        <Zap className="size-32 text-[#FF8C00]" />
                      </div>
                      <p className="text-sm font-bold text-[#FF8C00] uppercase tracking-wide mb-4">BUNGEE Way</p>
                      <div className="text-center py-6 relative z-10">
                        <div className="size-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-[#FF8C00] border-2 border-green-400 flex items-center justify-center shadow-lg shadow-green-500/50 animate-pulse">
                          <Zap className="size-8 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-green-300">Post & <span className="text-[#FF8C00]">ACTIVATE</span></p>
                        <p className="text-sm text-green-400 mt-2">BUNGEEs GO TO WORK!</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-400 text-sm relative z-10">
                        <span>Instant</span>
                        <span>•</span>
                        <span>Active</span>
                        <span>•</span>
                        <span>Guaranteed</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Activation Alert */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#FF8C00]/30 to-green-800/30 border border-[#FF8C00]/50 relative overflow-hidden mb-6">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <div className="size-12 rounded-full bg-[#FF8C00] flex items-center justify-center animate-ping opacity-30"></div>
                      <Bell className="size-7 text-[#FF8C00] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="ml-16">
                      <p className="text-lg font-bold text-white">Post = <span className="text-[#FF8C00]">Instant Alert</span> to ALL BUNGEEs</p>
                      <p className="text-sm text-gray-300">Your army mobilizes immediately. No waiting. No hoping.</p>
                    </div>
                  </div>
                  
                  {/* Results Section - Sales & Growth */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-900/50 to-gray-900/50 border border-green-500/30">
                    <p className="text-sm font-bold text-green-400 uppercase tracking-wide mb-4 text-center">The Results</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {/* Sales */}
                      <div className="p-4 rounded-lg bg-green-800/30 border border-green-500/30 text-center">
                        <DollarSign className="size-8 mx-auto text-green-400 mb-2" />
                        <p className="text-2xl font-black text-green-400">$$$</p>
                        <p className="text-sm text-green-300">Sales Made</p>
                      </div>
                      {/* Transactions */}
                      <div className="p-4 rounded-lg bg-blue-800/30 border border-blue-500/30 text-center">
                        <ArrowRightLeft className="size-8 mx-auto text-blue-400 mb-2" />
                        <p className="text-2xl font-black text-blue-400">24/7</p>
                        <p className="text-sm text-blue-300">Transactions</p>
                      </div>
                      {/* Profit */}
                      <div className="p-4 rounded-lg bg-[#FF8C00]/20 border border-[#FF8C00]/30 text-center">
                        <TrendingUp className="size-8 mx-auto text-[#FF8C00] mb-2" />
                        <p className="text-2xl font-black text-[#FF8C00]">UP</p>
                        <p className="text-sm text-orange-300">Profit Soaring</p>
                      </div>
                    </div>
                    
                    {/* Growth Graph Visual */}
                    <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                      <p className="text-sm text-gray-400 text-center mb-3">Monthly Sales Growth</p>
                      <div className="flex items-end justify-between gap-3 px-2" style={{height: '120px'}}>
                        {/* Bar chart going up - each bar with fixed height */}
                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                          <div className="w-full bg-gradient-to-t from-green-700 to-green-500 rounded-t min-h-[18px]" style={{height: '18px'}}></div>
                          <p className="text-xs text-gray-400 mt-2 font-semibold">Jan</p>
                          <p className="text-xs text-green-400">$2K</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                          <div className="w-full bg-gradient-to-t from-green-700 to-green-500 rounded-t" style={{height: '33px'}}></div>
                          <p className="text-xs text-gray-400 mt-2 font-semibold">Feb</p>
                          <p className="text-xs text-green-400">$5K</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                          <div className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t" style={{height: '48px'}}></div>
                          <p className="text-xs text-gray-400 mt-2 font-semibold">Mar</p>
                          <p className="text-xs text-green-400">$12K</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                          <div className="w-full bg-gradient-to-t from-green-500 to-[#FF8C00] rounded-t" style={{height: '68px'}}></div>
                          <p className="text-xs text-gray-400 mt-2 font-semibold">Apr</p>
                          <p className="text-xs text-[#FF8C00]">$28K</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                          <div className="w-full bg-gradient-to-t from-[#FF8C00] to-orange-400 rounded-t" style={{height: '87px'}}></div>
                          <p className="text-xs text-gray-400 mt-2 font-semibold">May</p>
                          <p className="text-xs text-[#FF8C00]">$52K</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                          <div className="w-full bg-gradient-to-t from-[#FF8C00] to-yellow-400 rounded-t shadow-lg shadow-[#FF8C00]/50" style={{height: '108px'}}></div>
                          <p className="text-xs text-gray-400 mt-2 font-semibold">Jun</p>
                          <p className="text-xs text-yellow-400 font-bold">$95K</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded bg-[#FF8C00]/20 border border-[#FF8C00]/30">
                        <TrendingUp className="size-6 text-[#FF8C00]" />
                        <p className="text-lg font-bold text-white">Sales <span className="text-[#FF8C00]">SKYROCKETING</span> with BUNGEE!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Slide 8: Talent Pools - Combined Hire Heroes & BUNGEE Pool */}
          {currentSlide === 7 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center mb-4">
                <Badge className="mb-4 bg-[#FF8C00]/20 text-[#FF8C00] border-[#FF8C00]/30">MAXIMIZE YOUR REACH</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Two <span className="text-[#FF8C00]">Always-Replenished</span> Talent Pools
                </h1>
                <p className="text-xl text-gray-600">Trusted referrals from past blasts. Never run out of quality candidates.</p>
              </div>

              {/* Two Pool Options */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* HIRE HEROES - Veterans Pool */}
                <Card className="border-2 border-green-500 bg-black overflow-hidden relative">
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500 text-white border-0">ALWAYS REPLENISHED</Badge>
                  </div>
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="size-16 rounded-full bg-green-600 flex items-center justify-center">
                        <Shield className="size-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">HIRE HEROES</h3>
                        <p className="text-green-400">Veteran Talent Pool</p>
                      </div>
                    </div>
                    
                    {/* Bottleneck Explanation */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                      <p className="text-white text-sm font-semibold mb-2">Why It&apos;s Always Full:</p>
                      <p className="text-gray-300 text-sm">Government agencies (VA, Workforce Development) do great work training veterans - but they <span className="text-red-400 font-bold">can&apos;t get them hired</span>. That bottleneck feeds directly into <span className="text-[#FF8C00] font-bold">BUNGEE</span>.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="size-4 text-green-400" />
                        <p className="text-gray-300 text-sm"><span className="text-[#FF8C00] font-bold">5K-30K</span> veteran resumes ready now</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="size-4 text-green-400" />
                        <p className="text-gray-300 text-sm"><span className="text-blue-400 font-bold">100K+</span> via sister agency partnerships</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="size-4 text-green-400" />
                        <p className="text-gray-300 text-sm">Pre-trained, disciplined, ready to work</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-600/20 to-green-500/10 border border-green-500/30">
                      <p className="text-green-400 font-bold text-center">Constant flow from government bottleneck</p>
                    </div>
                  </CardContent>
                </Card>

                {/* BUNGEE POOL - Past Blast Medalists */}
                <Card className="border-2 border-[#FF8C00] bg-black overflow-hidden relative">
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[#FF8C00] text-white border-0">ALWAYS REPLENISHED</Badge>
                  </div>
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="size-16 rounded-full bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center">
                        <Award className="size-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">BUNGEE POOL</h3>
                        <p className="text-[#FF8C00]">Past Blast Medalists</p>
                      </div>
                    </div>
                    
                    {/* Overflow Explanation */}
                    <div className="bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-lg p-4 mb-4">
                      <p className="text-white text-sm font-semibold mb-2">Why It&apos;s Always Full:</p>
                      <p className="text-gray-300 text-sm">Every business blast produces multiple qualified candidates. The <span className="text-yellow-400 font-bold">silver</span> and <span className="text-amber-500 font-bold">gold</span> medalists who didn&apos;t get Job A are perfect for Job B.</p>
                    </div>

                    {/* Medal Tiers Mini */}
                    <div className="flex justify-center gap-3 mb-4">
                      <div className="text-center">
                        <div className="size-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">1</div>
                        <p className="text-xs text-yellow-400">Gold</p>
                      </div>
                      <div className="text-center">
                        <div className="size-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm mx-auto mb-1">2</div>
                        <p className="text-xs text-gray-300">Silver</p>
                      </div>
                      <div className="text-center">
                        <div className="size-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">3</div>
                        <p className="text-xs text-amber-400">Bronze</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="size-4 text-[#FF8C00]" />
                        <p className="text-gray-300 text-sm">Pre-vetted, interview-ready candidates</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="size-4 text-[#FF8C00]" />
                        <p className="text-gray-300 text-sm">Trusted referrals from past successful blasts</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="size-4 text-[#FF8C00]" />
                        <p className="text-gray-300 text-sm">Instant placement - no new search needed</p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[#FF8C00]/20 to-orange-500/10 border border-[#FF8C00]/30">
                      <p className="text-[#FF8C00] font-bold text-center">Overflow from every business blast</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Benefits Bar */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-2 border-gray-200 bg-white">
                  <CardContent className="py-4 text-center">
                    <Zap className="size-6 mx-auto text-[#FF8C00] mb-2" />
                    <h4 className="font-bold text-gray-900 text-sm">Instant Access</h4>
                    <p className="text-xs text-gray-600">No waiting for new candidates</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-gray-200 bg-white">
                  <CardContent className="py-4 text-center">
                    <TrendingUp className="size-6 mx-auto text-green-500 mb-2" />
                    <h4 className="font-bold text-gray-900 text-sm">Always Growing</h4>
                    <p className="text-xs text-gray-600">Every blast adds more talent</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-gray-200 bg-white">
                  <CardContent className="py-4 text-center">
                    <Star className="size-6 mx-auto text-yellow-500 mb-2" />
                    <h4 className="font-bold text-gray-900 text-sm">Pre-Qualified</h4>
                    <p className="text-xs text-gray-600">Trusted referrals only</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom CTA */}
              <Card className="border-2 border-[#FF8C00] bg-gradient-to-r from-[#FF8C00] to-orange-600 text-white">
                <CardContent className="py-5 text-center">
                  <p className="text-xl font-bold">Two pools that <span className="underline">never run dry</span>. Always-replenished talent at your fingertips.</p>
                  <div className="mt-4 flex flex-col items-center">
                    <span className="text-3xl font-black text-white animate-pulse">PLUS</span>
                    <p className="text-white/90 text-sm mt-2">Not including your current blasts and posts</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Slide 10: The Rollout */}
          {currentSlide === 9 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">EXPANSION STRATEGY</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  National <span className="text-[#FF8C00]">Rollout</span>
                </h1>
                <p className="text-xl text-gray-600">3-Year Path to Coast-to-Coast Coverage</p>
              </div>

              {/* Rollout Map - 4 Phases */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Phase 1 */}
                <Card className="border-2 border-green-500 overflow-hidden relative">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/phase1-florida.jpg"
                      alt="Phase 1"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/60 to-green-900/30" />
                  </div>
                  <CardContent className="pt-8 pb-8 relative z-10">
                    <Badge className="mb-3 bg-green-500 text-white border-0">PHASE 1</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">Northern Florida & Atlanta</h3>
                    <p className="text-white/90 text-sm">Launch markets establishing the <span className="text-[#FF8C00]">BUNGEE</span> footprint in the Southeast</p>
                  </CardContent>
                </Card>

                {/* Phase 2 */}
                <Card className="border-2 border-blue-500 overflow-hidden relative">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/phase2-southeast.jpg"
                      alt="Phase 2"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/60 to-blue-900/30" />
                  </div>
                  <CardContent className="pt-8 pb-8 relative z-10">
                    <Badge className="mb-3 bg-blue-500 text-white border-0">PHASE 2</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">Charlotte & Nashville</h3>
                    <p className="text-white/90 text-sm">Expanding the Southeast corridor with high-growth markets</p>
                  </CardContent>
                </Card>

                {/* Phase 3 */}
                <Card className="border-2 border-[#FF8C00] overflow-hidden relative">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/phase3-texas.jpg"
                      alt="Phase 3"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-900/60 to-orange-900/30" />
                  </div>
                  <CardContent className="pt-8 pb-8 relative z-10">
                    <Badge className="mb-3 bg-[#FF8C00] text-white border-0">PHASE 3</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">Texas, Midwest & East Coast</h3>
                    <p className="text-white/90 text-sm">3 campaigns launch simultaneously attacking <span className="text-[#FF8C00]">Texas</span>, <span className="text-[#FF8C00]">Midwest</span>, and <span className="text-[#FF8C00]">East Coast</span> markets</p>
                  </CardContent>
                </Card>

                {/* Phase 4 */}
                <Card className="border-2 border-purple-500 overflow-hidden relative">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/phase4-national.jpg"
                      alt="Phase 4"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/60 to-purple-900/30" />
                  </div>
                  <CardContent className="pt-8 pb-8 relative z-10">
                    <Badge className="mb-3 bg-purple-500 text-white border-0">PHASE 4</Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">West Coast Campaign</h3>
                    <p className="text-white/90 text-sm">Launching <span className="text-[#FF8C00]">West Coast</span> to complete full <span className="text-[#FF8C00]">US coverage</span> coast to coast</p>
                  </CardContent>
                </Card>
              </div>


            </div>
          )}

          {/* Slide 12: The Team */}
          {currentSlide === 11 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-[#FF8C00]/20 text-[#FF8C00] border-[#FF8C00]/30">LEADERSHIP</Badge>
                
                {/* THE CORD - Bold at top, aligned with "The" */}
                <div className="mb-2">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl lg:text-6xl font-black text-gray-800 tracking-tight">THE</span>
                    <span className="relative inline-block">
                      {/* CORD made of woven cords - using SVG text with rope pattern */}
                      <svg className="h-14 lg:h-16 w-auto" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          {/* Rope/cord pattern */}
                          <pattern id="ropePattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M0,4 Q2,0 4,4 T8,4" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
                            <path d="M0,4 Q2,8 4,4 T8,4" stroke="#D2691E" strokeWidth="1" fill="none"/>
                          </pattern>
                          {/* Gradient for depth */}
                          <linearGradient id="cordGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFB347"/>
                            <stop offset="30%" stopColor="#FF8C00"/>
                            <stop offset="70%" stopColor="#CC7000"/>
                            <stop offset="100%" stopColor="#8B4513"/>
                          </linearGradient>
                          {/* Braided rope texture */}
                          <pattern id="braidPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                            <path d="M0,6 C3,2 6,2 6,6 C6,10 9,10 12,6" stroke="#FF8C00" strokeWidth="2" fill="none" opacity="0.8"/>
                            <path d="M0,6 C3,10 6,10 6,6 C6,2 9,2 12,6" stroke="#D2691E" strokeWidth="1.5" fill="none" opacity="0.6"/>
                            <path d="M2,3 L10,9" stroke="#FFB347" strokeWidth="0.5" opacity="0.4"/>
                            <path d="M2,9 L10,3" stroke="#8B4513" strokeWidth="0.5" opacity="0.3"/>
                          </pattern>
                          {/* Text clip path */}
                          <clipPath id="cordText">
                            <text x="0" y="48" fontFamily="system-ui, sans-serif" fontSize="56" fontWeight="900" letterSpacing="-2">CORD</text>
                          </clipPath>
                        </defs>
                        {/* Background shadow */}
                        <text x="3" y="51" fontFamily="system-ui, sans-serif" fontSize="56" fontWeight="900" letterSpacing="-2" fill="rgba(0,0,0,0.2)">CORD</text>
                        {/* Main gradient fill */}
                        <text x="0" y="48" fontFamily="system-ui, sans-serif" fontSize="56" fontWeight="900" letterSpacing="-2" fill="url(#cordGradient)">CORD</text>
                        {/* Braid pattern overlay */}
                        <rect x="0" y="0" width="200" height="60" fill="url(#braidPattern)" clipPath="url(#cordText)" opacity="0.7"/>
                        {/* Highlight strokes for woven effect */}
                        <text x="0" y="48" fontFamily="system-ui, sans-serif" fontSize="56" fontWeight="900" letterSpacing="-2" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3">CORD</text>
                      </svg>
                    </span>
                  </div>
                </div>
                
                {/* The BUNGEE Team - Below */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  The <span className="text-[#FF8C00]">BUNGEE</span> Team
                </h1>
                
                <p className="text-lg text-gray-500 italic mt-4">&quot;One string breaks easy, <span className="text-[#FF8C00] font-semibold not-italic">woven together we are unbreakable.</span>&quot;</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 relative">
                {/* THE CORD - Vertical connector line (subtle) */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF8C00]/10 via-[#FF8C00]/30 to-[#FF8C00]/10 -translate-x-1/2 z-0"></div>
                
                {/* Jim Vaccarino */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/82493ab2-7db8-4174-a56d-8930e8e2cd83.jpeg"
                        alt="James Vaccarino"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">James Vaccarino</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Strategic Architect & Managing Partner</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE HUMAN CAPITAL FOUNDATION&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">25 years recruiting expertise. Trusted PE partner for M&A deal flow and high-value acquisitions.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Stephanie */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a3e5446b-5e4e-4af1-b208-c7fc157ac145.jpeg"
                        alt="Stephanie"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">Stephanie</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Strategic COO & Government Relations</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE INTEGRATOR&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">EOS expert. Weaves vision into scalable execution with regulatory harmony.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Maika */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-757DM5AaeQgCOiYpVHqCPieHaiupEX.png"
                        alt="Maika"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">Maika</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Trade Show Veteran & Multi-Industry Expert</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE CONNECTOR&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">Decades of trade show expertise. Translates <span className="text-[#FF8C00]">BUNGEE</span> strengths into partner fit.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mick, the Shot Caller */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d56b3dea-d70b-4c7f-bdb9-1751ef5de3bd.jpeg"
                        alt="Mick, the Shot Caller"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">Mick, the Shot Caller</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Strategic Business Alliance Partner</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE ALLIANCE ARCHITECT&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">Forges national chain partnerships. Transforms <span className="text-[#FF8C00]">BUNGEE</span> into commercial powerhouse.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Alec Vaccarino */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aa95da5c-2d63-4c97-a49f-7c72edd9a526.jpeg"
                        alt="Alec Vaccarino"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">Alec</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Data Strategist & Business Solutions Lead</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE EYE IN THE SKY&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">Oversees corporate dashboard. Provides visibility and actionable data.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Heather Richmond */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/34e3dc6f-a673-477f-905b-3f6ec4e217e5.jpeg"
                        alt="Heather Richmond"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">Heather Richmond</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Global Marketing Manager</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE LEAD THREAD&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">Orchestrates global vision. Bridges local insights with worldwide reach.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Future CFO */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bungee%20guy%20n0%20words-HRPdtFpyhcGTYVYaSzbU05psCQQvjb.jpeg"
                        alt="Future CFO"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">[Future CFO]</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Chief Financial Officer & Fiscal Architect</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE FINANCIAL ANCHOR&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">Institutional-grade financial oversight. Capital strategy for global scaling.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Michele Van Patten Frank */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/55831654-a93d-4499-886a-d3d62b940174.jpeg"
                        alt="Michele Van Patten Frank"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">Michele Van Patten Frank</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Patent Attorney & Chair, Venable LLP</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE IP GUARDIAN&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">Former USPTO examiner. Protects <span className="text-[#FF8C00]">BUNGEE</span>&apos;s IP Flywheel.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Jeremy */}
                <Card className="border border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gray-100 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pwvfWPtnRwABLkP9McXj6xW7e8LXlP.png"
                        alt="Jeremy"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-[#FF8C00]">
                      <h3 className="text-sm font-bold text-[#FF8C00]">Jeremy</h3>
                      <p className="text-[#FF8C00] font-semibold text-xs mt-0.5">Pro-Recruiting Director & Talent Commander</p>
                      <p className="text-[11px] text-[#FF8C00] font-bold uppercase tracking-wide">&quot;THE TALENT COMMANDER&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">20+ years elite recruiting. Leads the <span className="text-[#FF8C00]">BUNGEE</span> Pro Recruiter army.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Development Team - Jacksonville, FL */}
                <Card className="border-2 border-blue-500 hover:shadow-lg transition-all overflow-hidden bg-gradient-to-br from-white to-blue-50">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-28 h-full relative bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bungee%20guy%20n0%20words-HRPdtFpyhcGTYVYaSzbU05psCQQvjb.jpeg"
                        alt="Development Team"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 border-l-4 border-blue-500 relative overflow-hidden">
                      <div className="absolute top-1 right-1">
                        <Badge className="bg-blue-600 text-white border-0 text-[7px]">JACKSONVILLE, FL</Badge>
                      </div>
                      <h3 className="text-sm font-bold text-blue-600">Development Team</h3>
                      <p className="text-blue-600 font-semibold text-xs mt-0.5">Award-Winning Tech | Built for Scale</p>
                      <p className="text-[11px] text-blue-700 font-bold uppercase tracking-wide">&quot;THE TECH TITANS&quot;</p>
                      <p className="text-[10px] text-gray-700 mt-2 leading-snug">Latest & greatest technology. #1 developers powering <span className="text-[#FF8C00]">BUNGEE</span>&apos;s infinite scalability.</p>
                      <div className="flex gap-1 mt-1">
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-[7px]">Award-Winning</Badge>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-[7px]">#1 Rated</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          )}

          {/* Slide 11: Unit Economics & Scale Matrix */}
          {currentSlide === 10 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-300 pb-4">
                <div>
                  <Badge className="mb-2 bg-[#FF8C00]/20 text-[#FF8C00] border-[#FF8C00]/30 text-xs">
                    HIGH-VELOCITY LAUNCH FRAMEWORK
                  </Badge>
                  <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900">
                    Bungees Regional Unit Economics & Scale Engine
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    North & Central Florida Footprint: Jacksonville - Ponte Vedra - Nocatee - St. Augustine - Palm Coast - Daytona
                  </p>
                </div>
                <div className="text-right bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Launch Matrix Density</div>
                  <div className="text-lg font-mono font-bold text-emerald-600">200 Businesses</div>
                  <div className="mt-1 pt-1 border-t border-gray-300">
                    <div className="text-[10px] text-gray-500">2.5% of 2,000 contacts = 50 Bungees/biz</div>
                    <div className="text-sm font-mono font-bold text-[#FF8C00]">10,000 Bungees</div>
                    <div className="text-[8px] text-gray-400">(businesses-only network)</div>
                  </div>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left Side: Regional Revenue Streams (7 Columns) */}
                <div className="lg:col-span-7 space-y-3">
                  <Card className="border border-gray-200 bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-[#FF8C00] mb-3">
                        <Layers size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wide">Backyard Revenue Breakdown (Month 1 Baseline)</h3>
                      </div>
                      
                      <div className="space-y-2">
                        {/* Standard Hiring Through Referrals */}
                        <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded border border-gray-200">
                          <div>
                            <div className="text-xs font-semibold text-gray-800">Standard Hiring Through Referrals</div>
                            <div className="text-[10px] text-gray-500">3 hires/yr avg per biz | $750 flat fee per hire (75/25 Split)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold font-mono text-gray-800">$9,375 / mo</div>
                            <div className="text-[9px] text-gray-500">Net $46.88/mo to Corp per biz</div>
                          </div>
                        </div>

                        {/* Products and Services Referrals */}
                        <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded border border-gray-200">
                          <div>
                            <div className="text-xs font-semibold text-gray-800">Products and Services Referrals</div>
                            <div className="text-[10px] text-gray-500">4 referrals/mo per biz | $100 avg per referral (75/25 Split)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold font-mono text-gray-800">$20,000 / mo</div>
                            <div className="text-[9px] text-gray-500">Net $100/mo to Corp per biz</div>
                          </div>
                        </div>

                        {/* Pro-Bungee Hire (Professional Recruiters) */}
                        <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded border border-gray-200">
                          <div>
                            <div className="text-xs font-semibold text-gray-800">Pro-Bungee Hire (Professional Recruiters)</div>
                            <div className="text-[10px] text-gray-500">4 out of 10 scale-up searches | $100k avg base salary (2% Bungees Corp Net Fee)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold font-mono text-[#FF8C00]">$13,332 / mo</div>
                            <div className="text-[9px] text-gray-500">Avg $66.66/mo net corporate value</div>
                          </div>
                        </div>

                        {/* Local Launch Sponsorships */}
                        <div className="flex justify-between items-center p-2.5 bg-[#FF8C00]/5 rounded border border-[#FF8C00]/30 border-l-[#FF8C00] border-l-2">
                          <div>
                            <div className="text-xs font-semibold text-[#FF8C00] flex items-center gap-1">
                              <Award size={12} /> Launch Advertising & Sponsorships
                            </div>
                            <div className="text-[10px] text-gray-500">Targeting 22 premium brand/vendor multi-city placements @ $2,500 per 2-month cycle</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold font-mono text-[#FF8C00]">$27,500 / mo</div>
                            <div className="text-[9px] text-gray-500">$55,000 per 2-month cycle</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Operational Expenses */}
                  <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-semibold text-gray-700">Bootstrapped Monthly Fixed Overhead (First 3 Months)</div>
                      <div className="text-[10px] text-gray-500">Core Team Payroll ($14k) + Cloud Tech Stack ($2k) + Field Ops Stipends ($2k)</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-red-500 font-mono">($18,000) / mo</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Projections & Scale Multiples (5 Columns) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                  
                  {/* Net Profit Core Summary */}
                  <Card className="border border-gray-200 bg-white flex-1">
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <DollarSign size={14} className="text-emerald-500" />
                        Total Launch Gross Profit Revenue
                      </div>
                      <div className="text-3xl font-black font-mono tracking-tight text-gray-900 mb-3">$70,207 / mo</div>
                      
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                          Net Profit Revenue
                        </div>
                        <div className="text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-emerald-600">
                          +$52,207 / mo
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium mt-1">
                          Months 1-3: $18,000/mo Bootstrap Overhead
                        </div>
                      </div>

                      {/* Year 1 Projection */}
                      <div className="mt-3 bg-sky-50 p-3 rounded-lg border border-sky-200">
                        <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
                          Year 1 Projection (Gradual Overhead Scale)
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
                          <div className="bg-white p-2 rounded border border-sky-100">
                            <div className="text-gray-500">Months 1-3 (Bootstrap)</div>
                            <div className="font-bold text-gray-800">$18,000/mo fixed overhead</div>
                            <div className="text-sky-600 font-semibold">Net: $156,621</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-sky-100">
                            <div className="text-gray-500">Months 4-12 (Scaling)</div>
                            <div className="font-bold text-gray-800">Overhead scales to 21%</div>
                            <div className="text-[9px] text-gray-500">As gross revenue grows with new businesses</div>
                          </div>
                        </div>
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <div className="text-[10px] text-sky-700">
                            <span className="font-bold">Months 1-3:</span> Lean $18K overhead (25.6%) while validating model
                          </div>
                          <div className="text-[10px] text-sky-700 mt-1">
                            <span className="font-bold">Months 4-12:</span> As business count grows, overhead scales to 21% of gross
                          </div>
                        </div>
                      </div>

                      {/* 25K Scale Projection */}
                      <div className="mt-4 bg-gradient-to-br from-[#FF8C00]/10 to-orange-100 p-4 rounded-xl border-2 border-[#FF8C00]/40">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-[#FF8C00] rounded-lg">
                            <TrendingUp size={14} className="text-white" />
                          </div>
                          <div className="text-xs font-bold text-[#FF8C00] uppercase tracking-wider">
                            25K National Scale Projection
                          </div>
                        </div>
                        
                        <div className="flex items-baseline gap-3 mb-1">
                          <div className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-gray-900">
                            $8,775,875 / mo
                          </div>
                          <div className="text-sm font-bold text-[#FF8C00]">
                            1.25M Bungees
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-600 mb-3">
                          Gross Profit Revenue • 50 bungees per business @ 2.5% conversion
                        </div>

                        <div className="bg-white/60 p-2.5 rounded-lg border border-[#FF8C00]/20">
                          <div className="text-[10px] font-bold text-gray-700 mb-1">How Realistic Is 25K Businesses?</div>
                          <div className="text-xs text-gray-600 leading-relaxed">
                            <span className="font-bold text-[#FF8C00]">25,000 businesses</span> = only <span className="font-bold">1,667 businesses</span> across <span className="font-bold">15 major US cities</span>. 
                            That&apos;s less than 0.08% of the 33M+ US small businesses.
                          </div>
                        </div>

                        {/* Net Profit Revenue for 25K Scale */}
                        <div className="mt-3 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                            Net Profit Revenue
                          </div>
                          <div className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-emerald-600">
                            +$6,932,941 / mo
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium mt-1">
                            21% of Gross Profit Revenue for Overhead
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>
              </div>

              {/* Multi-Account Scalability Section */}
              <Card className="border-2 border-[#FF8C00] bg-gradient-to-r from-gray-900 to-gray-800">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-700 pb-3 mb-3 gap-2">
                    <div className="flex items-center gap-2 text-[#FF8C00]">
                      <TrendingUp size={16} />
                      <h3 className="font-bold text-sm uppercase tracking-wide">Investor Linear Scale Engine</h3>
                    </div>
                    <span className="text-[10px] text-gray-400 italic">
                      Calculated cleanly via organic account multiples (Excludes localized ad pools to show raw scalability).
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-gray-950 p-3 rounded-lg border border-gray-700 hover:border-[#FF8C00]/50 transition-all">
                      <div className="text-xs text-gray-400 font-medium">500 Accounts (Expanded Footprint)</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">$172,910 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+$154,910 Monthly Net Profit</div>
                    </div>

                    <div className="bg-gray-950 p-3 rounded-lg border border-gray-700 hover:border-[#FF8C00]/50 transition-all">
                      <div className="text-xs text-gray-400 font-medium">2,500 Accounts (Regional Maturity)</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">$864,550 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+$846,550 Monthly Net Profit</div>
                    </div>

                    <div className="bg-gray-950 p-3 rounded-lg border border-gray-700 hover:border-[#FF8C00]/50 transition-all">
                      <div className="text-xs text-gray-400 font-medium">10,000 Accounts (Multi-State Scale)</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">$3,458,200 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+$3,440,200 Monthly Net Profit</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Bootstrapped + Investment Opportunity Callout */}
              <div className="p-4 bg-gradient-to-r from-[#FF8C00]/10 via-orange-500/5 to-emerald-500/10 rounded-xl border border-[#FF8C00]/30">
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 rounded-lg bg-[#FF8C00]/20 flex items-center justify-center">
                        <Zap className="size-4 text-[#FF8C00]" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Currently Bootstrapped. Ready to Scale.</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      This model is running lean and profitable today. <span className="font-semibold text-[#FF8C00]">Investment accelerates everything:</span> more boots on the ground, trade show presence, expanded sponsorship packages, and targeted advertising campaigns to onboard Bungees users faster.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                    <span className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium">More Sales Reps</span>
                    <span className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium">Trade Shows</span>
                    <span className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium">Sponsorships</span>
                    <span className="px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium">Ad Campaigns</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 13: The Disruption */}
          {currentSlide === 12 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="text-center">
                <Badge className="mb-2 bg-[#FF8C00]/20 text-[#FF8C00] border-[#FF8C00]/30">THE DISRUPTION</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  What <span className="text-[#FF8C00]">BUNGEE</span> Disrupts
                </h1>
              </div>

              {/* Section 1: What We Disrupt */}
              <div className="bg-gray-900 rounded-xl p-5">
                <h3 className="text-base font-bold text-white mb-3 text-center">The Old Way: <span className="text-red-400">Pay to Play, Hope for Results</span></h3>
                
                {/* Competitor Bubbles */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <div className="px-3 py-1.5 bg-[#0A66C2] rounded-lg shadow"><span className="text-xs font-bold text-white">LinkedIn</span></div>
                  <div className="px-3 py-1.5 bg-[#2164f3] rounded-lg shadow"><span className="text-xs font-bold text-white">Indeed</span></div>
                  <div className="px-3 py-1.5 bg-[#5ba829] rounded-lg shadow"><span className="text-xs font-bold text-white">ZipRecruiter</span></div>
                  <div className="px-3 py-1.5 bg-[#FF6153] rounded-lg shadow"><span className="text-xs font-bold text-white">Angi</span></div>
                  <div className="px-3 py-1.5 bg-[#009fd9] rounded-lg shadow"><span className="text-xs font-bold text-white">Thumbtack</span></div>
                  <div className="px-3 py-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] rounded-lg shadow"><span className="text-xs font-bold text-white">Google Ads</span></div>
                  <div className="px-3 py-1.5 bg-[#1877F2] rounded-lg shadow"><span className="text-xs font-bold text-white">Facebook</span></div>
                  <div className="px-3 py-1.5 bg-[#d32323] rounded-lg shadow"><span className="text-xs font-bold text-white">Yelp</span></div>
                  <div className="px-3 py-1.5 bg-[#f68b1e] rounded-lg shadow"><span className="text-xs font-bold text-white">HomeAdvisor</span></div>
                  <div className="px-3 py-1.5 bg-gray-600 rounded-lg shadow"><span className="text-xs font-bold text-white">Recruiting Firms</span></div>
                </div>

                {/* Why They Fail */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-1.5 rounded-full bg-red-500"></div>
                      <span className="text-[11px] font-bold text-white">Pay-to-Play</span>
                    </div>
                    <p className="text-[9px] text-gray-400">You pay whether you get results or not.</p>
                  </div>
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-1.5 rounded-full bg-red-500"></div>
                      <span className="text-[11px] font-bold text-white">Cold Databases</span>
                    </div>
                    <p className="text-[9px] text-gray-400">Algorithms match you with strangers.</p>
                  </div>
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-1.5 rounded-full bg-red-500"></div>
                      <span className="text-[11px] font-bold text-white">High Cost, Low ROI</span>
                    </div>
                    <p className="text-[9px] text-gray-400">20-30% fees with no guarantee.</p>
                  </div>
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-1.5 rounded-full bg-red-500"></div>
                      <span className="text-[11px] font-bold text-white">Misaligned Incentives</span>
                    </div>
                    <p className="text-[9px] text-gray-400">They profit from your spend, not success.</p>
                  </div>
                </div>
              </div>

              {/* Section 2: The BUNGEE Way */}
              <div className="bg-gray-900 rounded-xl p-5">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap className="size-5 text-[#FF8C00]" />
                  <h3 className="text-base font-bold text-white">The <span className="text-[#FF8C00]">BUNGEE</span> Way: <span className="text-emerald-400">Pay for Success Only</span></h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                  <div className="bg-gradient-to-br from-[#FF8C00]/20 to-gray-800 p-2.5 rounded-lg border border-[#FF8C00]/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-5 rounded-full bg-[#FF8C00] flex items-center justify-center">
                        <DollarSign className="size-2.5 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-white">Success-Based</span>
                    </div>
                    <p className="text-[9px] text-gray-300">$0 upfront. Pay only when you win.</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#FF8C00]/20 to-gray-800 p-2.5 rounded-lg border border-[#FF8C00]/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-5 rounded-full bg-[#FF8C00] flex items-center justify-center">
                        <Users className="size-2.5 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-white">Human + AI</span>
                    </div>
                    <p className="text-[9px] text-gray-300">Real relationships, AI-enhanced.</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#FF8C00]/20 to-gray-800 p-2.5 rounded-lg border border-[#FF8C00]/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-5 rounded-full bg-[#FF8C00] flex items-center justify-center">
                        <Building2 className="size-2.5 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-white">All-in-One</span>
                    </div>
                    <p className="text-[9px] text-gray-300">Hiring, services, products in one place.</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#FF8C00]/20 to-gray-800 p-2.5 rounded-lg border border-[#FF8C00]/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-5 rounded-full bg-[#FF8C00] flex items-center justify-center">
                        <TrendingUp className="size-2.5 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-white">Everyone Wins</span>
                    </div>
                    <p className="text-[9px] text-gray-300">Aligned incentives for all parties.</p>
                  </div>
                </div>

                {/* Comparison Boxes */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      <span className="px-1.5 py-0.5 bg-gray-600 rounded text-[8px] font-bold text-white">Recruiting Firms</span>
                    </div>
                    <p className="text-[9px] text-gray-300"><span className="text-red-400">They:</span> 20-30% upfront. <span className="text-emerald-400">Us:</span> Flat fee after hire.</p>
                  </div>
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      <span className="px-1.5 py-0.5 bg-[#0A66C2] rounded text-[8px] font-bold text-white">LinkedIn</span>
                      <span className="px-1.5 py-0.5 bg-[#2164f3] rounded text-[8px] font-bold text-white">Indeed</span>
                    </div>
                    <p className="text-[9px] text-gray-300"><span className="text-red-400">They:</span> Post & pray. <span className="text-emerald-400">Us:</span> Pre-vetted referrals.</p>
                  </div>
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      <span className="px-1.5 py-0.5 bg-[#FF6153] rounded text-[8px] font-bold text-white">Angi</span>
                      <span className="px-1.5 py-0.5 bg-[#009fd9] rounded text-[8px] font-bold text-white">Thumbtack</span>
                    </div>
                    <p className="text-[9px] text-gray-300"><span className="text-red-400">They:</span> Cold leads. <span className="text-emerald-400">Us:</span> Warm referrals.</p>
                  </div>
                  <div className="bg-gray-800 p-2.5 rounded-lg border border-gray-700">
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#4285F4] to-[#EA4335] rounded text-[8px] font-bold text-white">Google</span>
                      <span className="px-1.5 py-0.5 bg-[#1877F2] rounded text-[8px] font-bold text-white">Facebook</span>
                    </div>
                    <p className="text-[9px] text-gray-300"><span className="text-red-400">They:</span> Pay per click. <span className="text-emerald-400">Us:</span> Pay per close.</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Why BUNGEE is Sticky */}
              <div className="bg-gray-900 rounded-xl p-5">
                <h3 className="text-center text-base font-bold text-white mb-1">Why <span className="text-[#FF8C00]">BUNGEE</span> is <span className="text-emerald-400">Sticky</span></h3>
                <p className="text-center text-[10px] text-gray-400 mb-3">Once they&apos;re in, they don&apos;t leave.</p>
                
                <div className="grid lg:grid-cols-3 gap-3">
                  {/* For BUNGEEs */}
                  <div className="bg-gradient-to-br from-emerald-900/50 to-gray-800 p-4 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <DollarSign className="size-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">For BUNGEEs</h4>
                        <p className="text-[10px] text-emerald-400">Residual Income</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Earn ongoing commissions from every referral</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Income grows the longer they stay</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Leaving = abandoning their income stream</p>
                      </li>
                    </ul>
                  </div>

                  {/* For Businesses */}
                  <div className="bg-gradient-to-br from-[#FF8C00]/30 to-gray-800 p-4 rounded-xl border border-[#FF8C00]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 rounded-full bg-[#FF8C00] flex items-center justify-center">
                        <Users className="size-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">For Businesses</h4>
                        <p className="text-[10px] text-[#FF8C00]">Trusted Network</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-[#FF8C00] mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Build deep relationships with their BUNGEEs</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-[#FF8C00] mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Already receiving quality referrals</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-[#FF8C00] mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Why start over somewhere else?</p>
                      </li>
                    </ul>
                  </div>

                  {/* Network Effect */}
                  <div className="bg-gradient-to-br from-blue-900/50 to-gray-800 p-4 rounded-xl border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <TrendingUp className="size-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Network Effect</h4>
                        <p className="text-[10px] text-blue-400">Growing Value</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">More users = more valuable platform</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Connections compound over time</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                        <p className="text-[10px] text-gray-300">Leaving = losing the entire network</p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 bg-[#FF8C00] rounded-lg p-3 text-center">
                  <p className="text-white text-sm font-bold">They&apos;re earning. They&apos;re connected. They&apos;re growing. Why would they ever leave?</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <footer className="border-t border-gray-300 bg-[#E8ECF0] px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            onClick={prevSlide} 
            disabled={currentSlide === 0} 
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Slide {currentSlide + 1} of {slides.length}
            </p>
          </div>
          <Button 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1} 
            className="gap-2 bg-[#FF8C00] hover:bg-[#E67E00] text-white"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
