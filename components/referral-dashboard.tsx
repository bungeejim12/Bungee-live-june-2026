"use client"

import { useState, useEffect, useCallback, startTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BungeeCordIcon, CORD_COLORS } from "@/components/bungee-cord-icon"
import {
  Wallet,
  Users,
  Zap,
  TrendingUp,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Trophy,
  Target,
  Gift,
  Share2,
  Award,
  UserPlus,
  Presentation,
  Building2,
  Medal,
  MapPin,
  Navigation,
  ArrowLeft,
  Search,
  Eye,
  Copy,
  Check,
  Mail,
  MessageSquare,
  MessageSquareDot,
  ShoppingBag,
  UserCheck,
  ArrowUpRight,
  Circle,
  X,
  Link as LinkIcon,
  Lock,
  Shield,
  Flame,
  Crown,
  Sparkles,
  Star,
  Home,
  Sun,
  Moon,
  Settings,
  Send,
  Activity,
  ChevronDown,
  ChevronUp,
  Wrench,
  Package,
  Coins,
  User,
  Bitcoin,
  Banknote,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Camera,
  ImageIcon,
  CheckCircle2,
  Clock,
  Timer,
  Store,
} from "lucide-react"
import { BungeeRankSystem, RankBadge, BUNGEE_RANKS } from "@/components/bungee-rank-system"
import { BusinessLocatorMap } from "@/components/business-locator-map"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SponsorCarousel } from "@/components/sponsor-carousel"
import BungeeTaxVerificationModal from "@/components/bungee-tax-verification-modal"
import { AskBungeeChat } from "@/components/ask-bungee-chat"
import { getMyReferrals } from "@/app/actions/referrals"
import {
  buildInviteLink,
  computeReferralStats,
  formatReferralDate,
  getProfileDisplayName,
  type ReferralStats,
  type UserReferral,
} from "@/lib/referrals"

// Achievements & Badges System — grouped by category.
// Each badge is either unlocked, or shows progress toward its target.
const BADGE_CATEGORIES = [
  {
    category: "Speed & Momentum",
    badges: [
      {
        id: "speed-demon",
        title: "Speed Demon",
        description: "Submitted 3 successful referrals in a single weekend.",
        icon: Zap,
        unlocked: true,
        progress: null as { current: number; target: number } | null,
      },
      {
        id: "first-strike",
        title: "First Strike",
        description: "Made a referral within 48 hours of joining Bungee.",
        icon: Timer,
        unlocked: true,
        progress: null as { current: number; target: number } | null,
      },
      {
        id: "on-fire",
        title: "On Fire",
        description: "Submitted a referral 3 weeks in a row.",
        icon: Flame,
        unlocked: false,
        progress: { current: 2, target: 3 } as { current: number; target: number } | null,
      },
    ],
  },
  {
    category: "Network Builder",
    badges: [
      {
        id: "icebreaker",
        title: "Icebreaker",
        description: "Brought in your very first business to the platform.",
        icon: Store,
        unlocked: true,
        progress: null as { current: number; target: number } | null,
      },
      {
        id: "market-maker",
        title: "Market Maker",
        description: "Brought in a batch of 10 businesses.",
        icon: Building2,
        unlocked: false,
        progress: { current: 7, target: 10 } as { current: number; target: number } | null,
      },
      {
        id: "talent-scout",
        title: "Talent Scout",
        description: "Referred 5 new cords who registered on the app.",
        icon: Users,
        unlocked: false,
        progress: { current: 3, target: 5 } as { current: number; target: number } | null,
      },
    ],
  },
  {
    category: "Placement & Payday",
    badges: [
      {
        id: "matchmaker",
        title: "Matchmaker",
        description: "Your referred candidate got hired by a business.",
        icon: Briefcase,
        unlocked: true,
        progress: null as { current: number; target: number } | null,
      },
      {
        id: "lightning-rod",
        title: "Lightning Rod",
        description: "Received your first instant payout via the Lightning Network.",
        icon: Bitcoin,
        unlocked: false,
        progress: null as { current: number; target: number } | null,
      },
    ],
  },
]

interface UserProfile {
  id: string
  email: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  business_name: string | null
  user_type: string | null
  is_demo: boolean
  tax_verified?: boolean
  referral_code?: string | null
}

interface ReferralDashboardProps {
  onViewChange?: (view: "business" | "referral" | "pitch" | "corporate") => void
  currentView?: "business" | "referral" | "pitch" | "corporate"
  user?: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
  }
  isDemo?: boolean
  userProfile?: UserProfile | null
}

export default function ReferralDashboard({ onViewChange, currentView = "referral", user, isDemo = true, userProfile = null }: ReferralDashboardProps = {}) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeCategory, setActiveCategoryRaw] = useState<"jobs" | "services" | "igotguy" | null>(null)
  const [mainView, setMainViewRaw] = useState<"ops" | "referrals" | "earn" | "rewards" | "rank" | null>(null)

  // Wrap heavy view-switch updates in startTransition so the browser can paint
  // tap/click feedback immediately instead of blocking on a large re-render (fixes INP).
  const setMainView = useCallback((view: "ops" | "referrals" | "earn" | "rewards" | "rank" | null) => {
    startTransition(() => setMainViewRaw(view))
  }, [])
  const setActiveCategory = useCallback((category: "jobs" | "services" | "igotguy" | null) => {
    startTransition(() => setActiveCategoryRaw(category))
  }, [])

  const [showBusinessLocator, setShowBusinessLocator] = useState(false)
  const [showReferModal, setShowReferModal] = useState<"business" | "bungee" | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(() => {
    // Load saved avatar from localStorage on initial render
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bungee_avatar') || null
    }
    return null
  })
  const [tempAvatar, setTempAvatar] = useState<string | null>(null) // Temp avatar before saving
  const [avatarSaved, setAvatarSaved] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showAllRankings, setShowAllRankings] = useState(false)
  const [activeTab, setActiveTab] = useState("opportunities")
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [commandCenterOpen, setCommandCenterOpen] = useState(false)
  const [commandCenterTab, setCommandCenterTab] = useState<"referrals" | "hiring" | "products" | "services">("referrals")
  const [shareModalItem, setShareModalItem] = useState<{type: 'job' | 'service' | 'product', item: any} | null>(null)
  const [detailsModalItem, setDetailsModalItem] = useState<{type: 'job' | 'service' | 'product', item: any} | null>(null)
  const [copiedShareLink, setCopiedShareLink] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [showTaxVerification, setShowTaxVerification] = useState(false)
  const [isTaxVerified, setIsTaxVerified] = useState(isDemo ? true : (userProfile?.tax_verified ?? false))
  const [referralList, setReferralList] = useState<UserReferral[]>([])
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false)

  const demoStats: ReferralStats = {
    totalReferrals: 5,
    businessReferrals: 2,
    bungeeReferrals: 3,
    verifiedReferrals: 4,
    successRate: 80,
    bungeeScore: 500,
    level: 2,
    xp: 0,
    xpToNext: 500,
    totalEarned: 0,
  }

  useEffect(() => {
    if (isDemo || !userProfile?.id) return

    let cancelled = false

    const loadReferrals = async () => {
      setIsLoadingReferrals(true)
      const referrals = await getMyReferrals()
      if (!cancelled) {
        setReferralList(referrals)
        setIsLoadingReferrals(false)
      }
    }

    loadReferrals()

    return () => {
      cancelled = true
    }
  }, [isDemo, userProfile?.id])

  const userStats = isDemo ? demoStats : computeReferralStats(referralList)

  const userName =
    user?.firstName ||
    userProfile?.first_name ||
    (isDemo ? "Demo User" : "New User")

  const referralCode =
    userProfile?.referral_code ||
    (user?.id && !isDemo ? user.id.slice(0, 8).toUpperCase() : null)

  const referralCodes = {
    business: referralCode || "XXXXXXXX",
    bungee: referralCode || "XXXXXXXX",
  }

  const inviteLink = referralCode ? buildInviteLink(referralCode) : ""
  const referralLinks = {
    business: inviteLink || "https://justbungee.com/auth/sign-up",
    bungee: inviteLink || "https://justbungee.com/auth/sign-up",
  }
  const userCode = referralCode || "XXXXXXXX"
  const commandCenterTabs = [
    { id: "referrals" as const, label: "Referrals", icon: Users, color: "text-[#FF8C00]", bgColor: "bg-[#FF8C00]", count: isDemo ? 5 : userStats.totalReferrals },
    { id: "hiring" as const, label: "Hiring", icon: Briefcase, color: "text-fuchsia-500", bgColor: "bg-fuchsia-500", count: isDemo ? 3 : 0 },
    { id: "products" as const, label: "Products", icon: ShoppingBag, color: "text-blue-500", bgColor: "bg-blue-500", count: isDemo ? 2 : 0 },
    { id: "services" as const, label: "Services", icon: Shield, color: "text-emerald-500", bgColor: "bg-emerald-500", count: isDemo ? 4 : 0 },
  ]
  const modalReferralCount =
    showReferModal === "business" ? userStats.businessReferrals : userStats.bungeeReferrals

  // Dark mode toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleCopyCode = () => {
    if (showReferModal) {
      navigator.clipboard.writeText(referralCodes[showReferModal])
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleCopyLink = () => {
    if (showReferModal) {
      navigator.clipboard.writeText(referralLinks[showReferModal])
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const handleShareEmail = () => {
    if (showReferModal) {
      const subject = showReferModal === "business" 
        ? "Join BUNGEE - The Ultimate Business Referral Platform" 
        : "Join Me on BUNGEE - Earn Money Referring!"
      const body = showReferModal === "business"
        ? `Hey!\n\nI wanted to introduce you to BUNGEE - a platform that connects businesses with top talent and services through trusted referrals.\n\nUse my referral code: ${referralCodes[showReferModal]}\n\nOr sign up directly here: ${referralLinks[showReferModal]}\n\nLet me know if you have any questions!\n\n- ${userName}`
        : `Hey!\n\nI've been using BUNGEE to earn extra income by referring businesses and people to opportunities. It's been great!\n\nJoin using my referral code: ${referralCodes[showReferModal]}\n\nOr sign up here: ${referralLinks[showReferModal]}\n\nWe both get bonuses when you sign up!\n\n- ${userName}`
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }
  }

  const handleShareSMS = () => {
    if (showReferModal) {
      const message = showReferModal === "business"
        ? `Check out BUNGEE for your business! Use my code ${referralCodes[showReferModal]} to get started: ${referralLinks[showReferModal]}`
        : `Hey! Join me on BUNGEE and start earning! Use my code ${referralCodes[showReferModal]}: ${referralLinks[showReferModal]}`
      window.open(`sms:?body=${encodeURIComponent(message)}`)
    }
  }

  // Wallet balance will grow as user earns - starts at $0 for new users
  // Real balance would come from database

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`hidden lg:flex w-80 flex-col border-r ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} flex-shrink-0`}>
        {/* Logo Area */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-black flex items-center justify-center shadow-lg border border-[#FF8C00]/50">
              <BungeeCordIcon color={CORD_COLORS.orange} size={18} />
            </div>
            <div>
              <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>BUNGEE DASHBOARD</h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Referral Portal</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Navigation */}
          <p className={`text-xs font-semibold uppercase tracking-wider px-3 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Navigation</p>
          <div className="flex flex-col gap-1 mb-6">
            <button
              className={`flex items-center gap-3 text-sm font-semibold text-left px-4 py-3 rounded-xl transition-all text-white bg-gradient-to-r from-[#FF8C00] to-orange-500 shadow-lg shadow-orange-500/25`}
            >
              <Users className="size-5" />
              My Referrals
            </button>
            <Link
              href="/"
              className={`flex items-center gap-3 text-sm font-semibold text-left px-4 py-3 rounded-xl transition-all ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home className="size-5" />
              Back to Home
            </Link>
          </div>

        {/* Avatar Section */}
        <div className="mb-6">
          <p className={`text-xs uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your <span className="text-[#FF8C00]">BUNGEE</span> Avatar</p>
          <div className="relative group">
            <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br from-[#FF8C00]/20 ${isDarkMode ? 'to-gray-700' : 'to-gray-200'} border-2 border-[#FF8C00]/30 flex items-center justify-center overflow-hidden shadow-lg`}>
              {/* Default avatar placeholder - users can customize later */}
              <div className="size-24 rounded-full bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center border-3 border-white shadow-lg">
              <span className="text-white font-bold text-sm">Lv.{userStats.level}</span>
            </div>
            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
                <BungeeCordIcon color={CORD_COLORS.green} size={12} />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>New Bungee - <span className="text-emerald-500">Green Cord</span></p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3 border-[#FF8C00] text-[#FF8C00] hover:bg-[#FF8C00]/20 hover:border-[#FF8C00]"
              onClick={() => setShowAvatarModal(true)}
            >
              Customize Avatar
            </Button>
          </div>
        </div>

        {/* Level Progress - Clickable to see all rankings */}
        <button 
          onClick={() => setShowAllRankings(true)}
          className="w-full mb-6 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-[#FF8C00]/50 transition-colors text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <RankBadge level={userStats.level} />
            <span className="text-sm text-[#FF8C00] font-semibold">{userStats.xp} / {userStats.xpToNext} XP</span>
          </div>
          <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-2 bg-gray-600" />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{userStats.xpToNext - userStats.xp} XP to next rank <span className="text-[#FF8C00]">- Tap to view all cords</span></p>
        </button>

        {/* Quick Stats */}
        <div className="space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">Your Stats</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</span>
              <span className="font-semibold text-gray-900 dark:text-white">{userStats.totalReferrals}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
              <span className="font-semibold text-[#FF8C00]">{userStats.successRate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400"><span className="text-[#FF8C00]">BUNGEE</span> Score</span>
              <span className="font-semibold text-gray-900 dark:text-white">{userStats.bungeeScore}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Earned</span>
              <span className="font-semibold text-emerald-400">${userStats.totalEarned.toLocaleString()}</span>
            </div>
          </div>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Content */}
        <div className={`flex-1 p-3 sm:p-4 lg:p-8 pb-24 sm:pb-4 lg:pb-8 overflow-x-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {/* Profile Section with Refer Buttons */}
          <div className={`mb-3 p-3 sm:p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            {/* Row 1: User Info, Inbox, Sent, Wallet, Settings */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* User Profile - Left with Cord Icon - Clickable to open avatar */}
              <button 
                onClick={() => setShowAvatarModal(true)}
                className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} border`}>
                  {uploadedAvatar ? (
                    <img src={uploadedAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level {userStats.level}</p>
                  </div>
                  {/* Current Chord Badge */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
                    <BungeeCordIcon color={CORD_COLORS.green} size={14} />
                    <span className="text-xs font-semibold text-emerald-600">Green Cord</span>
                  </div>
                </div>
              </button>

              {/* Action Buttons - Center */}
              <div className="flex items-center gap-2 flex-1 justify-center">
{/* Inbox Button */}
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <button className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500 text-gray-200' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'}`}>
  <Mail className="size-4 text-gray-500" />
  <span className="text-xs sm:text-sm font-medium">Inbox</span>
  {isDemo && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">3</span>}
  </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className={`w-72 sm:w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} align="start">
  <DropdownMenuLabel className={`flex items-center justify-between ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
  <span className="flex items-center gap-2">
  <Mail className="size-4 text-[#FF8C00]" />
  Inbox
                      </span>
                      <div className="flex items-center gap-1">
                        <Badge className="bg-blue-500 text-white border-0 text-[10px]">{isDemo ? '3 in' : '0 in'}</Badge>
                        <Badge className="bg-emerald-500 text-white border-0 text-[10px]">0 sent</Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} />
                    
                    {/* Inbox Section */}
                    <div className={`px-2 py-1 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wide ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Inbox</p>
                    </div>
                    <DropdownMenuGroup className="max-h-40 overflow-y-auto">
                      {isDemo ? (
                        <>
                          {/* Service Lead */}
                          <DropdownMenuItem className={`flex items-start gap-3 p-3 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}`}>
                            <div className="size-8 rounded-full bg-emerald-700/20 flex items-center justify-center shrink-0">
                              <Briefcase className="size-4 text-emerald-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>New Service Lead Waiting</p>
                              <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Robert Vance requested an engineering audit.</p>
                              <p className="text-[9px] text-[#FF8C00] mt-0.5">5m ago</p>
                            </div>
                            <Circle className="size-2 fill-blue-500 text-blue-500 shrink-0 mt-1" />
                          </DropdownMenuItem>
                          {/* Hiring Action */}
                          <DropdownMenuItem className={`flex items-start gap-3 p-3 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}`}>
                            <div className="size-8 rounded-full bg-[#FF8C00]/20 flex items-center justify-center shrink-0">
                              <UserCheck className="size-4 text-[#FF8C00]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Hiring Action Required</p>
                              <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>John Doe passed Round 1! Review profile.</p>
                              <p className="text-[9px] text-[#FF8C00] mt-0.5">2h ago</p>
                            </div>
                            <Circle className="size-2 fill-blue-500 text-blue-500 shrink-0 mt-1" />
                          </DropdownMenuItem>
                          {/* Product Inquiry */}
                          <DropdownMenuItem className={`flex items-start gap-3 p-3 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}`}>
                            <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                              <ShoppingBag className="size-4 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bulk Product Inquiry</p>
                              <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pam Beesly requested wholesale pricing.</p>
                              <p className="text-[9px] text-[#FF8C00] mt-0.5">1d ago</p>
                            </div>
                            <Circle className="size-2 fill-blue-500 text-blue-500 shrink-0 mt-1" />
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <div className={`p-4 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <p className="text-xs">No messages yet</p>
                        </div>
                      )}
                    </DropdownMenuGroup>
                    
                    {/* Sent Section */}
                    <div className={`px-2 py-1 mt-1 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wide ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Sent</p>
                    </div>
                    <div className={`p-4 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <p className="text-xs">No sent messages yet</p>
                    </div>
                    
                    <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} />
                    <DropdownMenuItem className={`flex items-center justify-center gap-2 p-2 cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100 focus:bg-gray-100'}`}>
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#FF8C00]' : 'text-[#FF8C00]'}`}>View All Messages</span>
                      <ArrowUpRight className="size-3 text-[#FF8C00]" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Wallet Button */}
                <button 
                  onClick={() => setWalletOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500 text-gray-200' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'}`}
                >
                  <Wallet className="size-4 text-gray-500" />
                  <span className="text-xs sm:text-sm font-medium">Wallet</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>$0</span>
                </button>
              </div>
              
              {/* Dark Mode Toggle - Right */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="size-4 text-yellow-500" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="size-4 text-gray-500" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">Dark</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ===== BUNGEE ACTIVITY CENTER BAR ===== */}
          <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Activity Center Header - Tap to Open Full Screen */}
            <button 
              onClick={() => setCommandCenterOpen(true)}
              className={`w-full flex items-center justify-between p-3 transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bungee Activity Center</h3>
                  <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>View all activity across your network</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Live</span>
                </div>
                <ChevronRight className={`size-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </button>
          </div>

          {/* ===== ACTIVITY CENTER FULL-SCREEN OVERLAY ===== */}
          {commandCenterOpen && (
            <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {/* Full-Screen Header */}
              <div className={`sticky top-0 z-10 px-4 py-3 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setCommandCenterOpen(false)}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <ChevronLeft className="size-5" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Live</span>
                  </div>
                </div>
                <div className="mt-3">
                  <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activity Center</h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Track all activity across your Bungee network</p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className={`sticky top-[106px] z-10 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex">
                  {commandCenterTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCommandCenterTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all ${
                        commandCenterTab === tab.id
                          ? `${tab.color} border-b-2 ${tab.id === 'referrals' ? 'border-[#FF8C00]' : tab.id === 'hiring' ? 'border-fuchsia-500' : tab.id === 'products' ? 'border-blue-500' : 'border-emerald-500'}`
                          : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="size-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white ${tab.bgColor}`}>{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Feed - Full Height Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {commandCenterTab === "referrals" && (
                  isLoadingReferrals ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading referrals...</p>
                    </div>
                  ) : referralList.length > 0 || isDemo ? (
                    <div className="space-y-3">
                      {(isDemo
                        ? [
                            { id: 'demo-1', name: 'Sarah Chen', type: 'bungee' as const, channel: 'link', when: '2h ago' },
                            { id: 'demo-2', name: 'Metro Plumbing Co.', type: 'business' as const, channel: 'sms', when: '1d ago' },
                          ]
                        : referralList.map((referral) => ({
                            id: referral.id,
                            name: getProfileDisplayName(referral.referred_user || {}),
                            type: (referral.referred_user?.user_type === 'business' ? 'business' : 'bungee') as 'business' | 'bungee',
                            channel: referral.channel,
                            when: formatReferralDate(referral.created_at),
                          }))
                      ).map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'business' ? 'bg-[#FF8C00]/20' : 'bg-emerald-500/20'}`}>
                            {item.type === 'business' ? (
                              <Building2 className="size-5 text-[#FF8C00]" />
                            ) : (
                              <UserPlus className="size-5 text-emerald-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Joined via {item.channel} · {item.type === 'business' ? 'Business' : 'Bungee member'}
                            </p>
                            <p className="text-[10px] text-[#FF8C00] mt-0.5">{item.when}</p>
                          </div>
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="size-16 rounded-full bg-[#FF8C00]/10 dark:bg-[#FF8C00]/20 flex items-center justify-center mb-4">
                        <Users className="size-8 text-[#FF8C00]" />
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Referral Activity Yet</h3>
                      <p className={`text-sm mb-4 max-w-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Your referral activity will appear here. Share your invite link to get started!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => setShowReferModal("bungee")}
                          className="bg-gradient-to-r from-[#FF8C00] to-orange-500 hover:opacity-90 text-white"
                        >
                          <Share2 className="size-4 mr-2" />
                          Share Invite Link
                        </Button>
                      </div>
                    </div>
                  )
                )}
                {commandCenterTab === "hiring" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="size-16 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center mb-4">
                      <Briefcase className="size-8 text-fuchsia-500" />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Hiring Bounties Yet</h3>
                    <p className={`text-sm mb-4 max-w-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      When businesses post hiring bounties, they&apos;ll appear here. Recruit businesses to Bungee to unlock opportunities!
                    </p>
                    <Button 
                      onClick={() => setShowBusinessLocator(true)}
                      className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:opacity-90 text-white"
                    >
                      <Building2 className="size-4 mr-2" />
                      Find Businesses to Recruit
                    </Button>
                  </div>
                )}
                {commandCenterTab === "products" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="size-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <ShoppingBag className="size-8 text-blue-500" />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Product Referrals Yet</h3>
                    <p className={`text-sm mb-4 max-w-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Product referral opportunities from businesses will appear here once they join Bungee.
                    </p>
                    <Button 
                      onClick={() => setShowBusinessLocator(true)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white"
                    >
                      <Building2 className="size-4 mr-2" />
                      Recruit Businesses
                    </Button>
                  </div>
                )}
                {commandCenterTab === "services" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                      <Shield className="size-8 text-emerald-500" />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Service Referrals Yet</h3>
                    <p className={`text-sm mb-4 max-w-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Service opportunities will appear here when businesses on Bungee need referrals for their services.
                    </p>
                    <Button 
                      onClick={() => setShowBusinessLocator(true)}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white"
                    >
                      <Building2 className="size-4 mr-2" />
                      Recruit Businesses
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== MAIN DASHBOARD LAYOUT (when no view selected) ===== */}
          {!mainView && (
            <div className="space-y-4">
              {/* 1. THREE REFERRAL CATEGORY CARDS - Premium Clean Design */}
              <div>
                <div className="mb-2">
                  <p className={`text-xs sm:text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="text-[#FF8C00] font-semibold">Make referrals</span> and earn bounties
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {/* Refer Services Card - Clean White */}
                  <button 
                    onClick={() => {
                      setMainView("referrals")
                      setActiveCategory("services")
                    }}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-500'} hover:shadow-xl shadow-sm`}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop" 
                        alt="Home service professional"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className={`p-2 sm:p-3 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <h3 className={`text-[10px] sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Refer Services</h3>
                      <p className={`text-[7px] sm:text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 line-clamp-2`}>Help friends find local pros and earn up to $1K per lead</p>
                    </div>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge className="bg-emerald-600 text-white border-0 text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
                        15 Open
                      </Badge>
                    </div>
                  </button>

                  {/* Refer Products Card - Clean White */}
                  <button 
                    onClick={() => {
                      setMainView("referrals")
                      setActiveCategory("igotguy")
                    }}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'} hover:shadow-xl shadow-sm`}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop" 
                        alt="Product delivery packages"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className={`p-2 sm:p-3 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <h3 className={`text-[10px] sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Refer Products</h3>
                      <p className={`text-[7px] sm:text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 line-clamp-2`}>Share favorite local products and claim cash bonuses</p>
                    </div>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge className="bg-blue-600 text-white border-0 text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
                        $25-500
                      </Badge>
                    </div>
                  </button>

                  {/* Refer Jobs Card - Clean White */}
                  <button 
                    onClick={() => {
                      setMainView("referrals")
                      setActiveCategory("jobs")
                    }}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-fuchsia-500' : 'bg-white border-gray-200 hover:border-fuchsia-500'} hover:shadow-xl shadow-sm`}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=faces" 
                        alt="Professional interview"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className={`p-2 sm:p-3 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <h3 className={`text-[10px] sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Refer Jobs</h3>
                      <p className={`text-[7px] sm:text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5 line-clamp-2`}>Connect connections with open positions and earn up to $2.5K</p>
                    </div>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge className="bg-fuchsia-600 text-white border-0 text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
                        23 Open
                      </Badge>
                    </div>
                  </button>
                </div>
              </div>

              {/* Partner Spotlight - Native Sponsored Card */}
              <SponsorCarousel variant="native" isDarkMode={isDarkMode} />

              {/* 2. RANKINGS & REWARDS - Premium Clean Cards */}
              <div>
                <div className="mb-2">
                  <p className={`text-xs sm:text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="text-[#FF8C00] font-semibold">Manage your account</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:gap-3 w-full">
                  {/* Rankings Card - Clean White */}
                  <button 
                    onClick={() => setMainView("rank")}
                    className={`w-full group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-[#FF8C00]' : 'bg-white border-gray-200 hover:border-[#FF8C00]'} hover:shadow-xl shadow-sm`}
                  >
                    <div className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-black shadow-lg border border-[#FF8C00]/30">
                        <BungeeCordIcon color={CORD_COLORS.orange} size={24} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className={`text-sm sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rankings</h3>
                        <p className={`text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Track your network status and unlock higher earnings</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-[#FF8C00] transition-colors`} />
                    </div>
                  </button>

                  {/* Rewards Card - Clean White */}
                  <button 
                    onClick={() => setMainView("rewards")}
                    className={`w-full group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-[#FF8C00]' : 'bg-white border-gray-200 hover:border-[#FF8C00]'} hover:shadow-xl shadow-sm`}
                  >
                    <div className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img 
                          src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=150&h=150&fit=crop" 
                          alt="Cash rewards"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className={`text-sm sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rewards</h3>
                        <p className={`text-[10px] sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>View and cash out your referral bounty balances</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-[#FF8C00] transition-colors`} />
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. CORD RANKINGS - Inline Display */}
              <div className={`rounded-xl sm:rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black shadow-lg border border-[#FF8C00]/30">
                      <BungeeCordIcon color={CORD_COLORS.orange} size={18} />
                    </div>
                    <div>
                      <h3 className={`text-sm sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Cord Rankings</h3>
                      <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>12 ranks to climb</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAllRankings(true)}
                    className="text-xs text-[#FF8C00] hover:underline font-medium"
                  >
                    View Details
                  </button>
                </div>
                
                {/* Rankings Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {/* Green Cord - Current */}
                  <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/30">
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-emerald-500 shadow-lg shadow-emerald-500/20 mb-2">
                      <BungeeCordIcon color={CORD_COLORS.green} size={14} />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-500">Green</p>
                    <Badge className="mt-1 bg-emerald-600 text-white text-[8px] px-1.5">Current</Badge>
                  </div>
                  
                  {/* Pink Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.pink} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-pink-400">Pink</p>
                    <p className="text-[8px] text-gray-500">500 XP</p>
                  </div>
                  
                  {/* Blue Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.blue} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-blue-400">Blue</p>
                    <p className="text-[8px] text-gray-500">1,200 XP</p>
                  </div>
                  
                  {/* Purple Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.purple} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-purple-400">Purple</p>
                    <p className="text-[8px] text-gray-500">2,500 XP</p>
                  </div>
                  
                  {/* Red Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.red} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-red-400">Red</p>
                    <p className="text-[8px] text-gray-500">4,000 XP</p>
                  </div>
                  
                  {/* Burgundy Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.burgundy} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-rose-600">Burgundy</p>
                    <p className="text-[8px] text-gray-500">6,500 XP</p>
                  </div>
                  
                  {/* Bronze Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.bronze} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-amber-500">Bronze</p>
                    <p className="text-[8px] text-gray-500">10,000 XP</p>
                  </div>
                  
                  {/* Silver Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.silver} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-300">Silver</p>
                    <p className="text-[8px] text-gray-500">15,000 XP</p>
                  </div>
                  
                  {/* Gold Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.gold} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-yellow-400">Gold</p>
                    <p className="text-[8px] text-gray-500">22,000 XP</p>
                  </div>
                  
                  {/* Platinum Cord */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-gray-600 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.platinum} size={14} />
                      <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-gray-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-100">Platinum</p>
                    <p className="text-[8px] text-gray-500">32,000 XP</p>
                  </div>
                  
                  {/* Bungee Orange Cord - Ultimate */}
                  <div className={`flex flex-col items-center p-3 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} col-span-2 sm:col-span-1`}>
                    <div className="size-8 sm:size-10 rounded-full bg-black flex items-center justify-center border border-[#FF8C00]/50 mb-2 relative">
                      <BungeeCordIcon color={CORD_COLORS.orange} size={14} />
                      <Crown className="absolute -top-1 -right-1 size-3 text-[#FF8C00]" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-[#FF8C00]">Bungee Orange</p>
                    <p className="text-[8px] text-gray-500">50,000 XP</p>
                  </div>
                </div>
              </div>

              {/* 4. REWARDS CENTER - Inline Display */}
              <div className={`rounded-xl sm:rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 sm:p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=100&h=100&fit=crop" 
                        alt="Rewards"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className={`text-sm sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Rewards</h3>
                      <p className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Earn points, unlock rewards</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMainView("rewards")}
                    className="text-xs text-[#FF8C00] hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                
                {/* Points Balance */}
                <div className={`rounded-xl p-4 mb-4 ${isDarkMode ? 'bg-gradient-to-r from-[#FF8C00]/20 to-orange-500/10' : 'bg-gradient-to-r from-[#FF8C00]/10 to-orange-500/5'} border border-[#FF8C00]/30`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Points Balance</p>
                      <p className="text-2xl sm:text-3xl font-bold text-[#FF8C00]">0</p>
                    </div>
                    <div className="size-12 rounded-full bg-[#FF8C00]/20 flex items-center justify-center">
                      <Coins className="size-6 text-[#FF8C00]" />
                    </div>
                  </div>
                  <p className={`text-[10px] mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Make referrals to earn points and unlock rewards</p>
                </div>
                
                {/* Quick Rewards Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                      <DollarSign className="size-4 text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-semibold text-emerald-500">$10 Cash</p>
                    <p className="text-[8px] text-gray-500">500 pts</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                      <Award className="size-4 text-blue-500" />
                    </div>
                    <p className="text-[10px] font-semibold text-blue-500">Priority Badge</p>
                    <p className="text-[8px] text-gray-500">1,000 pts</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                      <Crown className="size-4 text-purple-500" />
                    </div>
                    <p className="text-[10px] font-semibold text-purple-500">VIP Status</p>
                    <p className="text-[8px] text-gray-500">2,500 pts</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="size-8 mx-auto rounded-full bg-[#FF8C00]/20 flex items-center justify-center mb-2">
                      <Zap className="size-4 text-[#FF8C00]" />
                    </div>
                    <p className="text-[10px] font-semibold text-[#FF8C00]">2x XP Weekend</p>
                    <p className="text-[8px] text-gray-500">1,500 pts</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ OPS VIEW ============ */}
          {mainView === "ops" && (
            <div className="space-y-4">
              {/* Back Button */}
              <button 
                onClick={() => setMainView(null)}
                className="flex items-center gap-2 text-[#FF8C00] hover:text-orange-400 font-semibold transition-colors mb-2"
              >
                <ChevronRight className="size-4 rotate-180" />
                <span className="text-sm">Back to Dashboard</span>
              </button>

                            <div className={`rounded-2xl p-4 border border-[#FF8C00]/30 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Briefcase className="size-6 text-[#FF8C00]" />
                  Operations
                </h2>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your referral operations and track activity</p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-2xl font-bold text-[#FF8C00]">{userStats.totalReferrals}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Referrals</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-2xl font-bold text-emerald-700">{userStats.verifiedReferrals}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-2xl font-bold text-blue-700">{Math.max(userStats.totalReferrals - userStats.verifiedReferrals, 0)}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-2xl font-bold text-fuchsia-700">{userStats.successRate}%</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-xl p-3">
                  <h3 className="text-sm font-semibold text-white mb-2">Recent Activity</h3>
                  {referralList.length > 0 && !isDemo ? (
                    <div className="space-y-2">
                      {referralList.slice(0, 5).map((referral) => (
                        <div key={referral.id} className="flex items-center justify-between gap-2 py-2 border-b border-gray-700 last:border-0">
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">
                              {getProfileDisplayName(referral.referred_user || {})}
                            </p>
                            <p className="text-xs text-gray-500">
                              {referral.referred_user?.user_type === 'business' ? 'Business signup' : 'Member signup'} · {formatReferralDate(referral.created_at)}
                            </p>
                          </div>
                          <Badge className="bg-emerald-600 text-white border-0 text-[10px] shrink-0">Joined</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Clock className="size-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No activity yet</p>
                      <p className="text-xs text-gray-600">Start making referrals to see activity here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============ REFERRALS VIEW ============ */}
          {mainView === "referrals" && (
            <div className="space-y-4">
              {/* Back Button */}
              <button 
                onClick={() => {
                  setMainView(null)
                  setActiveCategory(null)
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"
              >
                <ChevronRight className="size-4 rotate-180" />
                <span className="text-sm">Back to Dashboard</span>
              </button>

                            <div className={`rounded-2xl p-4 border border-emerald-700/30 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Users className="size-6 text-emerald-700" />
                  Make Referrals
                </h2>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Browse and refer people from your network</p>

                {/* Referral Category Cards - Premium Clean Design */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {/* Refer Services Card - Clean White */}
                  <button 
                    onClick={() => setActiveCategory("services")}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-[0.98] ${activeCategory === "services" ? `ring-2 ring-emerald-500 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}` : `border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-500'}`} hover:shadow-md`}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop" 
                        alt="Home service professional"
                        className={`w-full h-full object-cover ${activeCategory === "services" ? 'opacity-90' : ''} group-hover:scale-110 transition-transform duration-500`}
                      />
                    </div>
                    <div className={`p-2 sm:p-3 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <h3 className={`text-[10px] sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Refer Services</h3>
                      <p className="text-[8px] sm:text-xs text-emerald-600 font-medium">Up to $1K</p>
                    </div>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge className="bg-emerald-600 text-white border-0 text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
                        15 Open
                      </Badge>
                    </div>
                  </button>

                  {/* Refer Products Card - Clean White */}
                  <button 
                    onClick={() => setActiveCategory("igotguy")}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-[0.98] ${activeCategory === "igotguy" ? `ring-2 ring-blue-500 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}` : `border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}`} hover:shadow-md`}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop" 
                        alt="Product delivery packages"
                        className={`w-full h-full object-cover ${activeCategory === "igotguy" ? 'opacity-90' : ''} group-hover:scale-110 transition-transform duration-500`}
                      />
                    </div>
                    <div className={`p-2 sm:p-3 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <h3 className={`text-[10px] sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Refer Products</h3>
                      <p className="text-[8px] sm:text-xs text-blue-600 font-medium">Product Rewards</p>
                    </div>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge className="bg-blue-600 text-white border-0 text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shadow-md">
                        $25-500
                      </Badge>
                    </div>
                  </button>

                  {/* Refer Jobs Card - Clean White */}
                  <button 
                    onClick={() => setActiveCategory("jobs")}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-[0.98] ${activeCategory === "jobs" ? `ring-2 ring-fuchsia-500 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}` : `border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-fuchsia-500' : 'bg-white border-gray-200 hover:border-fuchsia-500'}`} hover:shadow-md`}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=faces" 
                        alt="Professional interview"
                        className={`w-full h-full object-cover ${activeCategory === "jobs" ? 'opacity-90' : ''} group-hover:scale-110 transition-transform duration-500`}
                      />
                    </div>
                    <div className={`p-2 sm:p-3 text-center border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <h3 className={`text-[10px] sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Refer Jobs</h3>
                      <p className="text-[8px] sm:text-xs text-fuchsia-600 font-medium">Up to $2.5K</p>
                    </div>
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge className="bg-fuchsia-600 text-white border-0 text-[7px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                        23 Open
                      </Badge>
                    </div>
                  </button>
                </div>

                {/* Business Locator Button - Clean Design */}
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => setShowBusinessLocator(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg ${isDarkMode ? 'bg-[#FF8C00] hover:bg-orange-600' : 'bg-[#FF8C00] hover:bg-orange-600'}`}
                  >
                    <Target className="size-5 text-white" />
                    <span className="text-white font-bold text-sm">Bungee Map</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============ EARN VIEW ============ */}
          {mainView === "earn" && (
            <div className="space-y-4">
              {/* Back Button */}
              <button 
                onClick={() => setMainView(null)}
                className="flex items-center gap-2 text-[#FF8C00] hover:text-orange-400 font-semibold transition-colors mb-2"
              >
                <ChevronRight className="size-4 rotate-180" />
                <span className="text-sm">Back to Dashboard</span>
              </button>

                            <div className={`rounded-2xl p-4 border border-fuchsia-700/30 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <DollarSign className="size-6 text-fuchsia-700" />
                  Earnings
                </h2>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track your earnings and payment history</p>

                {/* Earnings Summary */}
                <div className="bg-gradient-to-br from-fuchsia-700/20 to-purple-500/20 rounded-xl p-4 mb-4 border border-fuchsia-700/30">
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Earned</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$0.00</p>
                  <p className="text-xs text-fuchsia-700 mt-1">Start referring to earn!</p>
                </div>

                {/* Earnings Breakdown */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-lg font-bold text-emerald-700">$0</p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jobs</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-lg font-bold text-blue-700">$0</p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Services</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-lg font-bold text-[#FF8C00]">$0</p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Products</p>
                  </div>
                </div>

                {/* Payment History */}
                <div className={`rounded-xl p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Payment History</h3>
                  <div className="text-center py-6">
                    <DollarSign className="size-8 text-gray-400 mx-auto mb-2" />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>No payments yet</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>Earnings will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ REWARDS VIEW - GAMIFIED ============ */}
          {mainView === "rewards" && (
            <div className="space-y-4">
              <div className={`rounded-2xl overflow-hidden border border-blue-700/30 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                {/* Header with Animation and Close Button */}
                <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 p-6 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                  <div className="relative flex items-center gap-4">
                    <button 
                      onClick={() => setMainView(null)}
                      className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors border border-white/30"
                    >
                      <ArrowLeft className="size-5 text-white" />
                    </button>
                    <div className="size-14 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/30">
                      <img 
                        src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=150&h=150&fit=crop" 
                        alt="Rewards and gifts"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Rewards Center</h2>
                      <p className="text-blue-200">Earn points, unlock rewards, level up!</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Points Balance Card */}
                  <div className="relative bg-gradient-to-br from-[#FF8C00]/20 via-orange-900/20 to-purple-900/20 rounded-2xl p-5 border border-[#FF8C00]/30 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8C00]/10 rounded-full blur-2xl" />
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 mb-1">Your Reward Points</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-4xl font-black text-white">0</p>
                          <span className="text-lg text-[#FF8C00] font-bold">pts</span>
                        </div>
                        {/* Empty State CTA - Complete profile to earn first points */}
                        <button
                          onClick={() => setShowAvatarModal(true)}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF8C00] hover:bg-[#E67E00] active:scale-[0.98] transition-all text-sm font-bold text-white shadow-lg shadow-[#FF8C00]/30 touch-manipulation text-left leading-tight"
                        >
                          <Sparkles className="size-4 flex-shrink-0" />
                          <span>Complete your profile to earn your first 50 points!</span>
                        </button>
                      </div>
                      <div className="relative size-20 flex items-center justify-center flex-shrink-0">
                        <div className={`size-16 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
                          <Coins className="size-8 text-[#FF8C00] stroke-[1.5]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Streak */}
                  <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className={`size-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
                          <Flame className="size-5 text-orange-500 stroke-[1.5]" />
                        </div>
                        Daily Streak
                      </h3>
                      <span className={`text-2xl font-black ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`}>0 Days</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div 
                          key={day}
                          className={`flex-1 h-3 rounded-full transition-all ${day <= 0 ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Log in daily and make referrals to build your streak!</p>
                  </div>

                  {/* Achievements & Badges System - Categorized */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Trophy className="size-5 text-yellow-500" />
                        Achievements &amp; Badges
                      </h3>
                      {(() => {
                        const allBadges = BADGE_CATEGORIES.flatMap((c) => c.badges)
                        const unlockedCount = allBadges.filter((b) => b.unlocked).length
                        return (
                          <Badge className="bg-[#FF8C00] text-white border-0 text-xs">
                            {unlockedCount}/{allBadges.length} Unlocked
                          </Badge>
                        )
                      })()}
                    </div>

                    <div className="space-y-5">
                      {BADGE_CATEGORIES.map((category) => (
                        <div key={category.category}>
                          <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {category.category}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {category.badges.map((badge) => {
                              const BadgeIcon = badge.icon
                              const isUnlocked = badge.unlocked
                              return (
                                <div
                                  key={badge.id}
                                  className={`relative rounded-2xl p-4 border transition-all overflow-hidden ${
                                    isUnlocked ? 'hover:scale-[1.02]' : ''
                                  } ${
                                    isDarkMode
                                      ? isUnlocked ? 'bg-gray-900/80 border-[#FF8C00]/40' : 'bg-gray-900/40 border-gray-700'
                                      : isUnlocked ? 'bg-white border-[#FF8C00]/40' : 'bg-gray-50 border-gray-200'
                                  }`}
                                  style={isUnlocked ? { boxShadow: '0 0 16px rgba(255,140,0,0.18)' } : undefined}
                                >
                                  {/* Lock indicator for locked badges */}
                                  {!isUnlocked && (
                                    <div className={`absolute top-2 right-2 size-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                      <Lock className="size-3 text-gray-400" />
                                    </div>
                                  )}

                                  {/* Icon medallion */}
                                  <div
                                    className={`size-12 rounded-xl flex items-center justify-center mb-3 ${
                                      isUnlocked
                                        ? 'bg-gradient-to-br from-[#FF8C00] to-orange-400'
                                        : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                                    }`}
                                    style={isUnlocked ? { boxShadow: '0 4px 12px rgba(255,140,0,0.35)' } : undefined}
                                  >
                                    <BadgeIcon className={`size-6 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
                                  </div>

                                  <p className={`text-sm font-bold ${
                                    isUnlocked
                                      ? (isDarkMode ? 'text-white' : 'text-gray-900')
                                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                                  }`}>
                                    {badge.title}
                                  </p>
                                  <p className={`text-[11px] leading-snug mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {badge.description}
                                  </p>

                                  {/* Status: unlocked check or progress bar */}
                                  {isUnlocked ? (
                                    <div className="flex items-center gap-1 mt-2 text-emerald-500">
                                      <CheckCircle2 className="size-3.5" />
                                      <span className="text-[11px] font-semibold">Unlocked</span>
                                    </div>
                                  ) : badge.progress ? (
                                    <div className="mt-2">
                                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                        <div
                                          className="h-full rounded-full bg-[#FF8C00] transition-all duration-500"
                                          style={{ width: `${Math.min(100, Math.round((badge.progress.current / badge.progress.target) * 100))}%` }}
                                        />
                                      </div>
                                      <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {badge.progress.current} / {badge.progress.target}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 mt-2 text-gray-400">
                                      <Lock className="size-3" />
                                      <span className="text-[11px] font-semibold">Locked</span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Rewards - WITH GAME IMAGES */}
                  <div>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Gift className="size-5 text-blue-500" />
                      Redeem Rewards
                    </h3>
                    <div className="space-y-3">
                      {[
                        { image: "/images/rewards/cash-bonus-reward.png", name: "$10 Cash Bonus", pts: 500, color: "#10B981", glow: "rgba(16,185,129,0.4)" },
                        { image: "/images/rewards/priority-badge-reward.png", name: "Priority Badge", pts: 1000, color: "#3B82F6", glow: "rgba(59,130,246,0.4)" },
                        { image: "/images/rewards/vip-status-reward.png", name: "VIP Status (1 Month)", pts: 2500, color: "#8B5CF6", glow: "rgba(139,92,246,0.4)" },
                        { image: "/images/rewards/double-xp-reward.png", name: "Double XP Weekend", pts: 1500, color: "#FF8C00", glow: "rgba(255,140,0,0.4)" },
                      ].map((reward, i) => {
                        // Current user points balance (0 for new users)
                        const currentPoints = 0
                        const isUnlocked = currentPoints >= reward.pts
                        const progressPct = Math.min(100, Math.round((currentPoints / reward.pts) * 100))
                        return (
                        <div 
                          key={i}
                          className={`relative rounded-2xl p-4 border-2 transition-all overflow-hidden ${isUnlocked ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-default'} ${isDarkMode ? 'bg-gray-900/80 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                          style={{ boxShadow: isUnlocked ? `0 0 15px ${reward.glow}` : 'none' }}
                        >
                          {/* Corner lock badge for locked rewards */}
                          {!isUnlocked && (
                            <div className={`absolute top-2 right-2 size-7 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-200'} border z-10`}>
                              <Lock className="size-3.5 text-gray-400" />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <img 
                                src={reward.image} 
                                alt={reward.name} 
                                className={`size-16 object-contain transition-all ${isUnlocked ? '' : 'grayscale opacity-40'}`}
                                style={{ filter: isUnlocked ? `drop-shadow(0 0 10px ${reward.glow})` : 'none' }}
                              />
                              <div>
                                <p className={`font-bold text-lg ${isUnlocked ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}>{reward.name}</p>
                                <p className="text-sm font-semibold" style={{ color: isUnlocked ? reward.color : (isDarkMode ? '#6b7280' : '#9ca3af') }}>{reward.pts} points required</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isUnlocked ? (
                                <span 
                                  className="text-sm font-bold px-4 py-2 rounded-full border-2"
                                  style={{ backgroundColor: `${reward.color}20`, borderColor: `${reward.color}60`, color: reward.color, boxShadow: `0 0 10px ${reward.glow}` }}
                                >
                                  CLAIM
                                </span>
                              ) : (
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                  LOCKED
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Progress bar showing how close to unlocking */}
                          {!isUnlocked && (
                            <div className="mt-3">
                              <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <div 
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${progressPct}%`, backgroundColor: reward.color }}
                                />
                              </div>
                              <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {currentPoints} / {reward.pts} pts &middot; {reward.pts - currentPoints} to go
                              </p>
                            </div>
                          )}
                        </div>
                      )})}
                    </div>
                  </div>

                  {/* How to Earn Points */}
                  <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <TrendingUp className="size-5 text-emerald-500" />
                      How to Earn Points
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { action: "Successful Referral", pts: "+10 pts" },
                        { action: "Daily Login", pts: "+1 pt" },
                        { action: "Share on Social", pts: "+5 pts" },
                        { action: "Complete Profile", pts: "+25 pts" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{item.action}</span>
                          <span className="font-bold text-emerald-500">{item.pts}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ RANK VIEW ============ */}
          {mainView === "rank" && (
            <div className="space-y-4">
              {/* Back Button */}
              <button 
                onClick={() => setMainView(null)}
                className="flex items-center gap-2 text-[#FF8C00] hover:text-orange-400 font-semibold transition-colors mb-2"
              >
                <ChevronRight className="size-4 rotate-180" />
                <span className="text-sm">Back to Dashboard</span>
              </button>

                            <div className={`rounded-2xl p-4 border border-purple-500/30 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Trophy className="size-6 text-purple-500" />
                  Your Rank
                </h2>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Level up your Bungee Cord rank to earn more</p>

                {/* Current Rank */}
                <div className="bg-gradient-to-br from-emerald-700/20 to-green-500/10 rounded-xl p-4 mb-4 border border-emerald-700/30 text-center">
                  <div className="size-16 mx-auto rounded-full bg-black flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-500 mb-2">
                    <BungeeCordIcon color={CORD_COLORS.green} size={28} />
                  </div>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Green Cord</p>
                  <p className="text-sm text-emerald-700">NewBe - Starting Rank</p>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>0% bonus on earnings</p>
                </div>

                {/* Progress to Next Rank */}
                <div className={`rounded-xl p-3 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Progress to Gray Cord</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userStats.totalReferrals}/5 referrals</p>
                  </div>
                  <Progress value={Math.min((userStats.totalReferrals / 5) * 100, 100)} className="h-2" />
                  <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Complete 5 successful referrals to rank up</p>
                </div>

                {/* All Cord Ranks */}
                <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Medal className="size-4 text-[#FF8C00]" />
                  All Bungee Cord Ranks
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {/* Green Cord - Current/Unlocked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-700/20 to-green-500/10 border border-emerald-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 border border-emerald-500 shadow-lg shadow-emerald-500/20">
                      <BungeeCordIcon color={CORD_COLORS.green} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-emerald-400">Green Cord</p>
                      <p className="text-[10px] text-gray-400">NewBe Bungee - 0 XP</p>
                    </div>
                    <Badge className="bg-emerald-700 text-white text-[8px] shrink-0">Current</Badge>
                  </div>

                  {/* Pink Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.pink} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-pink-400">Pink Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 500 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">5% bonus</span>
                  </div>

                  {/* Blue Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.blue} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-400">Blue Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 1,200 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">10% bonus</span>
                  </div>

                  {/* Purple Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.purple} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-purple-400">Purple Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 2,500 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">15% bonus</span>
                  </div>

                  {/* Red Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.red} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-red-400">Red Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 4,000 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">20% bonus</span>
                  </div>

                  {/* Burgundy Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.burgundy} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-rose-700">Burgundy Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 6,500 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">25% bonus</span>
                  </div>

                  {/* Bronze Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.bronze} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-500">Bronze Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 10,000 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">30% bonus</span>
                  </div>

                  {/* Silver Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.silver} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200">Silver Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 15,000 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">35% bonus</span>
                  </div>

                  {/* Gold Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.gold} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-yellow-400">Gold Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 22,000 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">40% bonus</span>
                  </div>

                  {/* Platinum Cord - Locked */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.platinum} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100">Platinum Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 32,000 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">75% bonus</span>
                  </div>

                  {/* Bungee Orange Cord - Locked (Ultimate) */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="size-10 rounded-full bg-black flex items-center justify-center shrink-0 relative border border-gray-700">
                      <BungeeCordIcon color={CORD_COLORS.orange} size={16} />
                      <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700">
                        <Lock className="size-2.5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#FF8C00]">Bungee Orange Cord</p>
                      <p className="text-[10px] text-white bg-gray-700/50 px-1.5 py-0.5 rounded inline-block">Locked - 50,000 XP required</p>
                    </div>
                    <span className="text-[9px] text-gray-500 shrink-0">100% bonus</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Modals - Full Screen on Mobile */}
      {activeCategory && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          style={{ zIndex: 9999 }}
          onClick={() => setActiveCategory(null)}
        >
          <Card 
            className="w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[85vh] overflow-hidden bg-white dark:bg-gray-800 border-0 sm:border sm:border-gray-200 dark:sm:border-gray-700 rounded-none sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Jobs Modal */}
            {activeCategory === "jobs" && (
              <>
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces" 
                          alt="Professional interview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">Available Jobs</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Refer candidates and earn rewards</CardDescription>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)] sm:max-h-[60vh]">
                  {/* Bungee Map Button */}
                  <div className="mb-4 flex justify-center">
                    <button 
                      onClick={() => {
                        setActiveCategory(null)
                        setShowBusinessLocator(true)
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF8C00] hover:bg-[#E67E00] transition-all shadow-md"
                    >
                      <MapPin className="size-5 text-white" />
                      <span className="text-white font-semibold text-sm">Open Bungee Map</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Senior Software Engineer", company: "TechCorp Inc.", location: "San Francisco, CA", bounty: "$2,500", urgent: true, description: "Looking for an experienced software engineer with 5+ years in React and Node.js. Must have experience with cloud platforms.", requirements: ["5+ years experience", "React/Node.js", "Cloud platforms", "Team leadership"] },
                      { title: "Product Manager", company: "StartupXYZ", location: "Remote", bounty: "$1,800", urgent: false, description: "Seeking a product manager to lead our mobile app development. Experience with agile methodologies required.", requirements: ["3+ years PM experience", "Mobile apps", "Agile/Scrum", "Data analytics"] },
                      { title: "Data Analyst", company: "DataDriven Co.", location: "Austin, TX", bounty: "$1,200", urgent: false, description: "Need a data analyst to help drive business decisions with data insights.", requirements: ["SQL proficiency", "Python/R", "Visualization tools", "Business acumen"] },
                      { title: "UX Designer", company: "Creative Labs", location: "New York, NY", bounty: "$1,500", urgent: true, description: "Creative UX designer needed for enterprise software redesign project.", requirements: ["Figma expert", "User research", "Design systems", "Prototyping"] },
                      { title: "DevOps Engineer", company: "CloudScale", location: "Seattle, WA", bounty: "$2,000", urgent: false, description: "DevOps engineer to manage our CI/CD pipelines and cloud infrastructure.", requirements: ["AWS/GCP", "Kubernetes", "CI/CD", "Infrastructure as Code"] },
                      { title: "Marketing Director", company: "BrandBoost", location: "Chicago, IL", bounty: "$2,200", urgent: false, description: "Marketing leader to drive brand awareness and lead generation strategies.", requirements: ["10+ years marketing", "B2B experience", "Team management", "Digital marketing"] },
                    ].map((job, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-fuchsia-300 dark:hover:border-fuchsia-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                              {job.urgent && <Badge className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30 text-xs">Urgent</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{job.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">{job.bounty}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reward</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white" onClick={() => setShareModalItem({type: 'job', item: job})}>I Got Someone</Button>
                          <Button size="sm" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600" onClick={() => setDetailsModalItem({type: 'job', item: job})}>View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </>
            )}

            {/* Services Modal */}
            {activeCategory === "services" && (
              <>
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&h=150&fit=crop" 
                          alt="Home service professional"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">Service Requests</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Connect service providers and earn rewards</CardDescription>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)] sm:max-h-[60vh]">
                  {/* Bungee Map Button */}
                  <div className="mb-4 flex justify-center">
                    <button 
                      onClick={() => {
                        setActiveCategory(null)
                        setShowBusinessLocator(true)
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF8C00] hover:bg-[#E67E00] transition-all shadow-md"
                    >
                      <MapPin className="size-5 text-white" />
                      <span className="text-white font-semibold text-sm">Open Bungee Map</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Commercial HVAC Repair", requester: "Office Building LLC", location: "Dallas, TX", bounty: "$500", category: "HVAC", description: "Our main AC unit is not cooling properly. Need an experienced commercial HVAC technician for diagnosis and repair.", requirements: ["Commercial HVAC certified", "Available within 48 hours", "Licensed and insured"] },
                      { title: "Legal Consultation - M&A", requester: "GrowthCo Startup", location: "Remote", bounty: "$1,000", category: "Legal", description: "Seeking legal counsel for potential acquisition. Need expertise in tech startup M&A transactions.", requirements: ["M&A experience", "Tech industry knowledge", "Due diligence expertise"] },
                      { title: "Website Redesign", requester: "Local Restaurant", location: "Miami, FL", bounty: "$300", category: "Web Dev", description: "Need a modern, mobile-friendly website with online ordering integration.", requirements: ["Portfolio required", "E-commerce experience", "SEO knowledge"] },
                      { title: "Accounting Services", requester: "Small Business Owner", location: "Denver, CO", bounty: "$400", category: "Finance", description: "Looking for a CPA to help with quarterly taxes and bookkeeping setup.", requirements: ["CPA certified", "QuickBooks experience", "Small business focus"] },
                      { title: "Security System Install", requester: "Retail Store", location: "Phoenix, AZ", bounty: "$350", category: "Security", description: "Need complete security camera system installed for a 3,000 sq ft retail space.", requirements: ["Licensed installer", "Commercial experience", "24/7 monitoring setup"] },
                    ].map((service, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{service.title}</h4>
                              <Badge className="bg-emerald-50 dark:bg-emerald-700/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/30 text-xs">{service.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Requested by: {service.requester}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{service.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{service.bounty}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reward</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShareModalItem({type: 'service', item: service})}>I Got Someone</Button>
                          <Button size="sm" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600" onClick={() => setDetailsModalItem({type: 'service', item: service})}>View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </>
            )}

            {/* Product Rewards Modal (formerly I Got a Guy) */}
            {activeCategory === "igotguy" && (
              <>
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop" 
                          alt="Product shopping"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">Product Rewards</CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">Quick connects for instant rewards</CardDescription>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-120px)] sm:max-h-[60vh]">
                  {/* Bungee Map Button */}
                  <div className="mb-4 flex justify-center">
                    <button 
                      onClick={() => {
                        setActiveCategory(null)
                        setShowBusinessLocator(true)
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF8C00] hover:bg-[#E67E00] transition-all shadow-md"
                    >
                      <MapPin className="size-5 text-white" />
                      <span className="text-white font-semibold text-sm">Open Bungee Map</span>
                    </button>
                  </div>
                  <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-700/10 border border-blue-200 dark:border-blue-700/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Know someone perfect for a quick gig? Connect them instantly and earn rewards ranging from <span className="text-blue-600 dark:text-blue-400 font-bold">$25 to $500</span>!</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Need a Plumber ASAP", requester: "John D.", location: "Local - 5 miles", bounty: "$75", time: "2 hours ago", description: "Kitchen sink is clogged and water is backing up. Need someone who can come today.", requirements: ["Licensed plumber", "Available today", "Drain cleaning experience"] },
                      { title: "Looking for a Photographer", requester: "Sarah M.", location: "Downtown", bounty: "$100", time: "4 hours ago", description: "Need a photographer for a small birthday party this weekend. 2-3 hours of coverage.", requirements: ["Portfolio available", "Event photography experience", "Own equipment"] },
                      { title: "Dog Walker Needed", requester: "Mike R.", location: "Suburb Area", bounty: "$25", time: "1 day ago", description: "Looking for a reliable dog walker for my golden retriever. Mon-Fri, 30 min walks.", requirements: ["Dog experience", "Reliable schedule", "References preferred"] },
                      { title: "Moving Help - 2 People", requester: "Lisa K.", location: "Cross-town", bounty: "$150", time: "1 day ago", description: "Need 2 strong people to help move furniture from apartment to house. About 4 hours of work.", requirements: ["Heavy lifting ability", "Available Saturday", "Own transportation"] },
                      { title: "Catering for Event", requester: "Event Co.", location: "Conference Center", bounty: "$500", time: "2 days ago", description: "Corporate event catering for 50 people. Lunch service with vegetarian options required.", requirements: ["Catering license", "Corporate experience", "Can provide references"] },
                      { title: "Guitar Lessons", requester: "Parent", location: "Home Visit", bounty: "$50", time: "3 days ago", description: "Looking for guitar teacher for 12-year-old beginner. Weekly 1-hour lessons.", requirements: ["Teaching experience", "Patient with kids", "Can travel to home"] },
                    ].map((request, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{request.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">From: {request.requester}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{request.location} • {request.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{request.bounty}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reward</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShareModalItem({type: 'product', item: request})}>I Got Someone!</Button>
                          <Button size="sm" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600" onClick={() => setDetailsModalItem({type: 'product', item: request})}>Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Business Locator Full Screen */}
      {/* ===== AVATAR CUSTOMIZATION MODAL ===== */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-[#0F1419] overflow-y-auto">
          <style>{`
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes subtleBounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            @keyframes cordGlow {
              0%, 100% { filter: drop-shadow(0 0 3px rgba(255, 140, 0, 0.4)); }
              50% { filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.7)); }
            }
            .avatar-enter { animation: fadeInScale 0.3s ease-out forwards; }
            .bungee-character { animation: subtleBounce 3s ease-in-out infinite; }
            .bungee-cord { animation: cordGlow 2s ease-in-out infinite; }
          `}</style>
          <div className="min-h-full flex flex-col avatar-enter">
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 sm:p-6 bg-gradient-to-r from-[#FF8C00]/20 to-purple-900/20 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setShowAvatarModal(false)
                    setTempAvatar(null)
                    setAvatarSaved(false)
                  }}
                  className="p-2.5 rounded-full bg-gray-700/90 hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <ArrowLeft className="size-5 text-white" />
                </button>
                <div className="size-12 rounded-xl bg-[#FF8C00]/20 flex items-center justify-center">
                  <User className="size-6 text-[#FF8C00]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create Your Bungee Avatar</h2>
                  <p className="text-sm text-gray-400">Upload your face to become a Bungee character!</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-lg mx-auto w-full">
              {/* Bungee Character Preview */}
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  {(tempAvatar || uploadedAvatar) ? "Your Bungee character is ready!" : "Upload your face to create your Bungee avatar"}
                </p>
                
                {/* Animated Bungee Character */}
                <div className="relative inline-block bungee-character">
                  <svg viewBox="0 0 200 320" className="w-48 h-72 mx-auto">
                    {/* Spiky Hair */}
                    <g className="hair">
                      <path d="M60 75 L70 30 L85 65" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2"/>
                      <path d="M75 70 L90 20 L105 60" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2"/>
                      <path d="M95 65 L110 15 L125 55" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2"/>
                      <path d="M115 70 L130 25 L140 65" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2"/>
                      <path d="M130 75 L145 40 L150 70" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2"/>
                    </g>
                    
                    {/* Face Circle with User Photo or Default */}
                    <defs>
                      <clipPath id="faceClipPath">
                        <circle cx="100" cy="95" r="45"/>
                      </clipPath>
                    </defs>
                    <circle cx="100" cy="95" r="48" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="4"/>
                    {(tempAvatar || uploadedAvatar) ? (
                      <image 
                        href={tempAvatar || uploadedAvatar || ''} 
                        x="55" y="50" 
                        width="90" height="90" 
                        clipPath="url(#faceClipPath)"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    ) : (
                      <>
                        <circle cx="100" cy="95" r="45" fill="#F5DEB3"/>
                        {/* Default face features */}
                        <circle cx="85" cy="90" r="4" fill="#1a1a1a"/>
                        <circle cx="115" cy="90" r="4" fill="#1a1a1a"/>
                        <ellipse cx="100" cy="100" rx="3" ry="2" fill="#1a1a1a"/>
                        {/* Goatee */}
                        <path d="M85 110 Q100 130 115 110 Q100 125 85 110" fill="#1a1a1a"/>
                      </>
                    )}
                    
                    {/* Animated Orange Bungee Cord (zigzag through body) */}
                    <path 
                      className="bungee-cord"
                      d="M100 145 L115 165 L85 185 L115 205 L85 225 L100 245" 
                      fill="none" 
                      stroke="#FF8C00" 
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Arms */}
                    <g>
                      <path d="M70 150 L30 180 L25 175" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round"/>
                      {/* Left Glove */}
                      <ellipse cx="22" cy="178" rx="15" ry="12" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
                    </g>
                    <g>
                      <path d="M130 150 L170 180 L175 175" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round"/>
                      {/* Right Glove */}
                      <ellipse cx="178" cy="178" rx="15" ry="12" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
                    </g>
                    
                    {/* Legs */}
                    <path d="M90 245 L70 300" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round"/>
                    <path d="M110 245 L130 300" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round"/>
                    
                    {/* Shoes */}
                    <ellipse cx="65" cy="305" rx="18" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
                    <ellipse cx="135" cy="305" rx="18" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
                  </svg>
                  
                  {/* Level Badge */}
                  <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center border-3 border-[#0F1419] shadow-lg">
                    <span className="text-white font-bold text-sm">Lv.{userStats.level}</span>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Upload Your Face</h3>
                
                {/* Upload Photo */}
                <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-16 rounded-full bg-[#FF8C00]/20 flex items-center justify-center border-2 border-dashed border-[#FF8C00]/50 overflow-hidden">
                      {(tempAvatar || uploadedAvatar) ? (
                        <img src={tempAvatar || uploadedAvatar || ''} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="size-8 text-[#FF8C00]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Upload Your Face Photo</p>
                      <p className="text-xs text-gray-400">Auto-fits to circle (PNG/JPG)</p>
                    </div>
                  </div>
                  
                  {/* Two Options: Camera and Gallery */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Take Selfie Button */}
                    <label className="cursor-pointer active:scale-95 transition-transform">
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size must be less than 5MB")
                              return
                            }
                            // Auto-crop and center the image
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const img = new window.Image()
                              img.crossOrigin = "anonymous"
                              img.onload = () => {
                                // Create canvas for cropping to square
                                const canvas = document.createElement('canvas')
                                const size = Math.min(img.width, img.height)
                                canvas.width = 400
                                canvas.height = 400
                                const ctx = canvas.getContext('2d')
                                if (ctx) {
                                  // Calculate center crop
                                  const sx = (img.width - size) / 2
                                  const sy = (img.height - size) / 2
                                  // Draw cropped and centered image
                                  ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400)
                                  const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
                                  setTempAvatar(croppedDataUrl)
                                  setAvatarSaved(false)
                                }
                              }
                              img.src = event.target?.result as string
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <span className="flex items-center justify-center gap-2 w-full py-4 text-sm font-semibold rounded-xl bg-[#FF8C00] hover:bg-[#E67E00] text-white transition-colors shadow-lg shadow-[#FF8C00]/20">
                        <Camera className="size-5" />
                        Take Selfie
                      </span>
                    </label>
                    
                    {/* Choose from Gallery Button */}
                    <label className="cursor-pointer active:scale-95 transition-transform">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size must be less than 5MB")
                              return
                            }
                            // Auto-crop and center the image
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const img = new window.Image()
                              img.crossOrigin = "anonymous"
                              img.onload = () => {
                                // Create canvas for cropping to square
                                const canvas = document.createElement('canvas')
                                const size = Math.min(img.width, img.height)
                                canvas.width = 400
                                canvas.height = 400
                                const ctx = canvas.getContext('2d')
                                if (ctx) {
                                  // Calculate center crop
                                  const sx = (img.width - size) / 2
                                  const sy = (img.height - size) / 2
                                  // Draw cropped and centered image
                                  ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400)
                                  const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
                                  setTempAvatar(croppedDataUrl)
                                  setAvatarSaved(false)
                                }
                              }
                              img.src = event.target?.result as string
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <span className="flex items-center justify-center gap-2 w-full py-4 text-sm font-semibold rounded-xl bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 transition-colors">
                        <ImageIcon className="size-5" />
                        Photo Library
                      </span>
                    </label>
                  </div>
                  
                  {(tempAvatar || uploadedAvatar) && (
                    <button 
                      onClick={() => {
                        setTempAvatar(null)
                        setUploadedAvatar(null)
                        localStorage.removeItem('bungee_avatar')
                        setAvatarSaved(false)
                      }}
                      className="mt-4 w-full text-xs text-red-400 hover:text-red-300 transition-colors py-2 border border-red-400/30 rounded-lg hover:bg-red-400/10"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Cord Color Selection */}
                <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
                  <p className="text-sm font-semibold text-white mb-3">Bungee Cord Color (Earned by Rank)</p>
                  <div className="flex gap-2">
                    {[
                      { color: "#22C55E", name: "Green", unlocked: true },
                      { color: "#3B82F6", name: "Blue", unlocked: false },
                      { color: "#A855F7", name: "Purple", unlocked: false },
                      { color: "#FF8C00", name: "Orange", unlocked: false },
                    ].map((cord, idx) => (
                      <button
                        key={cord.name}
                        disabled={!cord.unlocked}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                          idx === 0 ? 'bg-gray-700 ring-2 ring-[#FF8C00]' : 'bg-gray-700/50'
                        } ${!cord.unlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
                      >
                        <div className="w-4 h-6" style={{ backgroundColor: cord.color, borderRadius: '2px' }}/>
                        <span className="text-gray-300">{cord.name}</span>
                        {!cord.unlocked && <Lock className="size-3 text-gray-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Name */}
                <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
                  <p className="text-sm font-semibold text-white mb-2">Display Name</p>
                  <input
                    type="text"
                    defaultValue={userName}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-[#FF8C00] focus:outline-none"
                    placeholder="Enter your display name"
                  />
                </div>
              </div>

              {/* Save Button */}
              <Button 
                className={`w-full font-semibold py-3 transition-all ${
                  avatarSaved 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-[#FF8C00] hover:bg-[#E67E00]'
                } text-white`}
                onClick={() => {
                  const avatarToSave = tempAvatar || uploadedAvatar
                  if (avatarToSave) {
                    localStorage.setItem('bungee_avatar', avatarToSave)
                    setUploadedAvatar(avatarToSave)
                    setTempAvatar(null)
                    setAvatarSaved(true)
                    // Reset saved state after 2 seconds
                    setTimeout(() => setAvatarSaved(false), 2000)
                  }
                }}
              >
                {avatarSaved ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="size-5" />
                    Avatar Saved!
                  </span>
                ) : (
                  'Save Bungee Avatar'
                )}
              </Button>

              {/* Cord Badge Preview */}
              <div className="text-center p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Your avatar will display with your cord rank</p>
                <div className="flex items-center justify-center gap-2">
                  <BungeeCordIcon color={CORD_COLORS.green} size={16} />
                  <span className="text-sm text-emerald-400 font-medium">Green Cord - New Bungee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== WALLET MODAL ===== */}
      {walletOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1419] overflow-y-auto">
          <div className="min-h-full flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 sm:p-6 bg-gradient-to-r from-[#FF8C00]/20 to-amber-900/20 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setWalletOpen(false)}
                  className="p-2.5 rounded-full bg-gray-700/90 hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <ArrowLeft className="size-5 text-white" />
                </button>
                <div className="size-12 rounded-xl bg-[#FF8C00]/20 flex items-center justify-center">
                  <Wallet className="size-6 text-[#FF8C00]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">My Wallet</h2>
                  <p className="text-sm text-gray-400">Manage your earnings</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-lg mx-auto w-full">
              {/* Total Balance Card */}
              <div className="bg-gradient-to-br from-[#FF8C00]/20 to-amber-900/10 rounded-2xl p-6 border border-[#FF8C00]/30">
                <p className="text-sm text-gray-400 mb-1">Total Balance</p>
                <p className="text-4xl font-black text-white mb-4">$0.00</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Available to withdraw</span>
                  <span className="text-xs text-emerald-400 font-semibold">$0.00</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-[#FF8C00]/50 transition-all">
                  <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ArrowDownToLine className="size-5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-white">Deposit</span>
                </button>
                <button 
                  onClick={() => {
                    if (isTaxVerified || isDemo) {
                      // Proceed with withdrawal
                      console.log('Processing withdrawal...')
                    } else {
                      setShowTaxVerification(true)
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-[#FF8C00]/50 transition-all"
                >
                  <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <ArrowUpFromLine className="size-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {isTaxVerified || isDemo ? "Withdraw" : "Verify to Withdraw"}
                  </span>
                </button>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Payment Methods</h3>
                <div className="space-y-3">
                  {/* Bitcoin Option */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-amber-500/50 transition-all group">
                    <div className="size-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Bitcoin className="size-6 text-amber-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Bitcoin</p>
                      <p className="text-xs text-gray-400">Cryptocurrency payments</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-white">$0.00</span>
                      <span className="text-[10px] text-gray-500">0.00000 BTC</span>
                    </div>
                    <ChevronRight className="size-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                  </button>

                  {/* Cash Option */}
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-emerald-500/50 transition-all group">
                    <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Banknote className="size-6 text-emerald-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Cash</p>
                      <p className="text-xs text-gray-400">Bank transfers & PayPal</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-white">$0.00</span>
                      <span className="text-[10px] text-gray-500">USD Balance</span>
                    </div>
                    <ChevronRight className="size-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
                  <button className="text-xs text-[#FF8C00] hover:underline flex items-center gap-1">
                    <History className="size-3" />
                    View All
                  </button>
                </div>
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
                  <div className="size-12 mx-auto rounded-full bg-gray-700/50 flex items-center justify-center mb-3">
                    <Coins className="size-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400">No transactions yet</p>
                  <p className="text-xs text-gray-500 mt-1">Start earning by referring businesses and friends!</p>
                </div>
              </div>

              {/* Earning Stats */}
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                <h3 className="text-sm font-bold text-white mb-3">Lifetime Earnings</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-white">$0</p>
                    <p className="text-[10px] text-gray-400">Total Earned</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">$0</p>
                    <p className="text-[10px] text-gray-400">Withdrawn</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-400">$0</p>
                    <p className="text-[10px] text-gray-400">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBusinessLocator && (
        <BusinessLocatorMap onClose={() => setShowBusinessLocator(false)} />
      )}

      {/* Referral Code Modal - Full Screen */}
      {showReferModal && (
        <div className="fixed inset-0 z-50 bg-[#1F2937] overflow-y-auto">
          <div className="min-h-full flex flex-col">
            {/* Header */}
            <div className={`sticky top-0 z-10 p-4 sm:p-6 ${showReferModal === "business" ? "bg-gradient-to-r from-[#FF8C00]/20 to-orange-900/20" : "bg-gradient-to-r from-emerald-900/20 to-emerald-900/20"} border-b border-gray-700`}>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowReferModal(null)}
                  className="p-2.5 rounded-full bg-gray-700/90 hover:bg-gray-600 transition-colors border border-gray-600"
                >
                  <ArrowLeft className="size-5 text-white" />
                </button>
                <div className={`size-12 rounded-xl ${showReferModal === "business" ? "bg-[#FF8C00]/20" : "bg-emerald-700/20"} flex items-center justify-center`}>
                  {showReferModal === "business" ? (
                    <Building2 className="size-6 text-[#FF8C00]" />
                  ) : (
                    <Users className="size-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Refer a {showReferModal === "business" ? "Business" : "Bungee"}
                  </h2>
                  <p className="text-sm text-gray-400">Share your unique code with others</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 space-y-5 max-w-md mx-auto w-full">
              {/* Your Unique Code */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Your Unique Referral Code</label>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 px-4 py-3 rounded-lg ${showReferModal === "business" ? "bg-[#FF8C00]/10 border border-[#FF8C00]/30" : "bg-emerald-700/10 border border-emerald-700/30"}`}>
                    <p className={`text-lg font-mono font-bold ${showReferModal === "business" ? "text-[#FF8C00]" : "text-emerald-400"}`}>
                      {referralCodes[showReferModal]}
                    </p>
                  </div>
                  <Button 
                    onClick={handleCopyCode}
                    className={`h-12 px-4 ${showReferModal === "business" ? "bg-[#FF8C00] hover:bg-[#E67E00]" : "bg-emerald-700 hover:bg-emerald-800"} text-white`}
                  >
                    {copiedCode ? <Check className="size-5" /> : <Copy className="size-5" />}
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Your Referral Link</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
                    <p className="text-sm text-gray-300 truncate">{referralLinks[showReferModal]}</p>
                  </div>
                  <Button 
                    onClick={handleCopyLink}
                    variant="outline"
                    className="h-10 px-3 border-gray-700 bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {copiedLink ? <Check className="size-4 text-emerald-400" /> : <LinkIcon className="size-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-3 block">Share Via</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={handleShareSMS}
                    variant="outline" 
                    className="h-14 flex-col gap-1 border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-blue-500"
                  >
                    <MessageSquare className="size-5 text-blue-400" />
                    <span className="text-xs text-gray-300">Text Message</span>
                  </Button>
                  <Button 
                    onClick={handleShareEmail}
                    variant="outline" 
                    className="h-14 flex-col gap-1 border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-purple-500"
                  >
                    <Mail className="size-5 text-purple-400" />
                    <span className="text-xs text-gray-300">Email</span>
                  </Button>
                </div>
              </div>

              {/* Bonus Info */}
              <div className={`p-3 rounded-lg ${showReferModal === "business" ? "bg-[#FF8C00]/10 border border-[#FF8C00]/20" : "bg-emerald-700/10 border border-emerald-700/20"}`}>
                <div className="flex items-start gap-2">
                  <Gift className={`size-5 mt-0.5 ${showReferModal === "business" ? "text-[#FF8C00]" : "text-emerald-400"}`} />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {showReferModal === "business" ? "Earn $500 per business!" : "Earn $50 + 10% of their earnings!"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {showReferModal === "business" 
                        ? "Plus 5% residual income from all transactions for 18 months"
                        : "Get residual income from their referrals for 18 months"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6 pt-2">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${showReferModal === "business" ? "text-[#FF8C00]" : "text-emerald-400"}`}>
                    {modalReferralCount}
                  </p>
                  <p className="text-xs text-gray-400">Successful Referrals</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${showReferModal === "business" ? "text-[#FF8C00]" : "text-emerald-400"}`}>
                    ${userStats.totalEarned.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Total Earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Rankings Modal - Full Screen Gamified */}
      {showAllRankings && (
        <div className="fixed inset-0 z-50 bg-[#0F1419] overflow-y-auto">
          <div className="min-h-full">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF8C00]/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-[#FF8C00]/20 via-purple-900/20 to-[#FF8C00]/20 border-b border-gray-800 backdrop-blur-xl">
              <div className="max-w-4xl mx-auto px-4 py-4">
                  <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowAllRankings(false)}
                    className="p-2.5 rounded-full bg-gray-700/90 hover:bg-gray-600 transition-colors border border-gray-600"
                  >
                    <ArrowLeft className="size-5 text-white" />
                  </button>
                  <div className="relative">
                    <div className="size-14 rounded-2xl bg-black flex items-center justify-center shadow-lg shadow-[#FF8C00]/30 border border-[#FF8C00]/30">
                      <BungeeCordIcon color={CORD_COLORS.orange} size={24} />
                    </div>
                    <div className="absolute -top-1 -right-1 size-5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#0F1419]">
                      {userStats.level}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white">Bungee Cord Rankings</h1>
                    <p className="text-sm text-gray-400">12 Levels to Apex Status</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative max-w-4xl mx-auto px-4 py-6 space-y-8">
              
              {/* Current Rank Hero Card */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Rank Badge */}
                    <div className="relative">
                      <div className="size-32 rounded-full bg-black flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-4 border-emerald-400/50">
                        <BungeeCordIcon color={CORD_COLORS.green} size={56} />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                        CURRENT
                      </div>
                    </div>
                    
                    {/* Rank Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-black text-emerald-400">Green Cord</h2>
                      <p className="text-xl text-gray-300 mb-2">Starter</p>
                      <p className="text-gray-400 mb-4">You&apos;re just getting started! Complete referrals to climb the ranks.</p>
                      
                      {/* XP Progress */}
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Progress to Gray Cord</span>
                          <span className="text-sm font-bold text-emerald-400">{userStats.xp} / 500 XP</span>
                        </div>
                        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-gray-500 rounded-full transition-all duration-500 relative"
                            style={{ width: `${Math.min((userStats.xp / 500) * 100, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{500 - userStats.xp} XP needed to rank up</p>
                      </div>
                    </div>

                    {/* Current Perks */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-emerald-500/30">
                      <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                        <Award className="size-4" /> Your Perks
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="size-4 text-emerald-400" />
                          <span>Access to basic referrals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="size-4 text-emerald-400" />
                          <span>Community forum access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All 12 Ranks Grid */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="size-5 text-[#FF8C00]" />
                  All 12 Cord Rankings
                </h3>
                <p className="text-gray-400 mb-6">Climb the ladder, unlock perks, and maximize your earnings!</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {BUNGEE_RANKS.map((rank, index) => {
                    const isCurrentRank = index === 0
                    const isLocked = index > 0
                    const IconComponent = rank.icon
                    
                    return (
                      <div 
                        key={rank.level}
                        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                          isCurrentRank 
                            ? 'border-emerald-500 bg-gradient-to-br from-emerald-900/50 to-gray-900 shadow-lg shadow-emerald-500/20' 
                            : isLocked 
                              ? 'border-gray-700 bg-gray-900/50 opacity-70 hover:opacity-100' 
                              : 'border-gray-700 bg-gray-900/50'
                        }`}
                      >
                        {/* Glow Effect */}
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{ background: `radial-gradient(circle at 50% 0%, ${rank.color}, transparent 70%)` }}
                        />
                        
                        <div className="relative p-4 text-center">
                          {/* Level Badge */}
                          <div className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                            Lv.{rank.level}
                          </div>
                          
                          {/* Lock Icon for Locked Ranks */}
                          {isLocked && (
                            <div className="absolute top-2 left-2">
                              <Lock className="size-4 text-gray-500" />
                            </div>
                          )}
                          
                          {/* Rank Icon */}
                          <div 
                            className="size-16 mx-auto rounded-full flex items-center justify-center mb-3 border-2"
                            style={{ 
                              background: `linear-gradient(135deg, ${rank.color}40, ${rank.color}20)`,
                              borderColor: `${rank.color}60`,
                              boxShadow: isCurrentRank ? `0 0 20px ${rank.color}40` : 'none'
                            }}
                          >
                            <IconComponent className="size-8" style={{ color: rank.color }} />
                          </div>
                          
                          {/* Rank Name */}
                          <h4 className="font-bold text-white text-sm mb-1">{rank.name}</h4>
                          <p className="text-xs text-gray-400 mb-2">{rank.title}</p>
                          
                          {/* XP Required */}
                          <div className="text-xs px-2 py-1 rounded-full bg-gray-800" style={{ color: rank.color }}>
                            {rank.xpRequired.toLocaleString()} XP
                          </div>
                          
                          {/* Current Badge */}
                          {isCurrentRank && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: rank.color }}>
                              YOU ARE HERE
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bonus Perks Preview */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="size-5 text-yellow-500" />
                  Unlock Amazing Perks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="size-12 rounded-full bg-[#FF8C00]/20 flex items-center justify-center mb-3">
                      <DollarSign className="size-6 text-[#FF8C00]" />
                    </div>
                    <h4 className="font-bold text-white mb-1">Bonus Earnings</h4>
                    <p className="text-sm text-gray-400">Up to 100% bonus on all bounties at Apex rank</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="size-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                      <Star className="size-6 text-purple-500" />
                    </div>
                    <h4 className="font-bold text-white mb-1">Priority Matching</h4>
                    <p className="text-sm text-gray-400">Get first dibs on premium job opportunities</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                      <Trophy className="size-6 text-emerald-500" />
                    </div>
                    <h4 className="font-bold text-white mb-1">Exclusive Events</h4>
                    <p className="text-sm text-gray-400">VIP access to networking events and more</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setShowLeaderboard(false)}
        >
          <div 
            className="w-full max-w-lg max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-yellow-500/20 to-[#FF8C00]/20 border-b border-gray-700 relative">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowLeaderboard(false)}
                  className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-700/90 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <ArrowLeft className="size-5 text-gray-900 dark:text-white" />
                </button>
                <div className="size-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="size-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Leaderboard</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Top referrers this week</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-3">
                {/* Empty leaderboard - all spots open */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700/30 border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className={`size-8 rounded-full flex items-center justify-center font-bold ${
                        rank === 1 ? "bg-yellow-500/30 text-yellow-600 dark:text-yellow-400" : 
                        rank === 2 ? "bg-gray-400/30 text-gray-500 dark:text-gray-400" : 
                        rank === 3 ? "bg-amber-600/30 text-amber-600 dark:text-amber-400" : 
                        "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      }`}>
                        {rank}
                      </span>
                      <div>
                        <span className="text-gray-400 dark:text-gray-500 italic">Open Spot</span>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">Be the first!</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 dark:text-gray-500">--</p>
                    </div>
                  </div>
                ))}
                
                {/* User Position */}
                <div className="mt-4 p-4 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="size-8 rounded-full flex items-center justify-center font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        --
                      </span>
                      <div>
                        <span className="text-gray-900 dark:text-white font-semibold">You</span>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">Starter Cord</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-600 dark:text-gray-400">${userStats.totalEarned.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{userStats.totalReferrals} referrals</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#FF8C00] mt-2 text-center">Start referring to climb the ranks!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar - Three Circles with Icons */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)]`}>
        <div className="flex items-start justify-around py-4 px-6 max-w-lg mx-auto">
          {/* Refer User */}
          <button 
            onClick={() => setShowReferModal("bungee")}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all group-active:scale-95 animate-pulse-ring ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-2 border-[#FF8C00] shadow-md shadow-[#FF8C00]/20`}>
              <UserPlus className="w-6 h-6 text-[#FF8C00]" />
            </div>
            <span className="text-xs font-semibold text-[#FF8C00]">Refer User</span>
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Earn 100 points per referral</span>
          </button>

          {/* Refer Business */}
          <button 
            onClick={() => setShowReferModal("business")}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all group-active:scale-95 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <Building2 className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Refer Biz</span>
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Earn 100 points per referral</span>
          </button>
      </div>
      </div>

      {/* Floating Ask Bungee Button - Draggable, positions itself */}
      <AskBungeeChat 
        variant="floating"
        onNavigate={(tab) => {
          if (tab === 'jobs') setActiveCategory('jobs')
          else if (tab === 'services') setActiveCategory('services')
          else if (tab === 'products' || tab === 'igotguy') setActiveCategory('igotguy')
        }}
      />

      {/* Share Modal - I Got Someone */}
      {shareModalItem && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          onClick={() => setShareModalItem(null)}
        >
          <Card 
            className="w-full max-w-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className={`border-b border-gray-200 dark:border-gray-700 ${
              shareModalItem.type === 'job' ? 'bg-gradient-to-r from-fuchsia-700/20 to-fuchsia-900/20' :
              shareModalItem.type === 'service' ? 'bg-gradient-to-r from-emerald-700/20 to-green-900/20' :
              'bg-gradient-to-r from-blue-700/20 to-blue-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-xl flex items-center justify-center ${
                    shareModalItem.type === 'job' ? 'bg-fuchsia-700/20' :
                    shareModalItem.type === 'service' ? 'bg-emerald-700/20' :
                    'bg-blue-700/20'
                  }`}>
                    <Share2 className={`size-6 ${
                      shareModalItem.type === 'job' ? 'text-fuchsia-400' :
                      shareModalItem.type === 'service' ? 'text-emerald-400' :
                      'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Share This Opportunity</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Refer someone you know</CardDescription>
                  </div>
                </div>
                <button 
                  onClick={() => setShareModalItem(null)}
                  className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-500 flex items-center justify-center text-gray-900 dark:text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Opportunity Summary */}
              <div className={`p-4 rounded-xl border ${
                shareModalItem.type === 'job' ? 'bg-fuchsia-700/10 border-fuchsia-700/30' :
                shareModalItem.type === 'service' ? 'bg-emerald-700/10 border-emerald-700/30' :
                'bg-blue-700/10 border-blue-700/30'
              }`}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{shareModalItem.item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{shareModalItem.item.company || shareModalItem.item.requester}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{shareModalItem.item.location}</p>
                <p className={`text-lg font-bold mt-2 ${
                  shareModalItem.type === 'job' ? 'text-fuchsia-400' :
                  shareModalItem.type === 'service' ? 'text-emerald-400' :
                  'text-blue-400'
                }`}>Reward: {shareModalItem.item.bounty}</p>
              </div>

              {/* Your Referral Link */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Your Referral Link</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-mono">
                      https://justbungee.com/refer/{shareModalItem.type}/{userCode}/{shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://justbungee.com/refer/${shareModalItem.type}/${userCode}/${shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`)
                      setCopiedShareLink(true)
                      setTimeout(() => setCopiedShareLink(false), 2000)
                    }}
                    className={`h-10 px-3 ${
                      shareModalItem.type === 'job' ? 'bg-fuchsia-700 hover:bg-fuchsia-800' :
                      shareModalItem.type === 'service' ? 'bg-emerald-700 hover:bg-emerald-800' :
                      'bg-blue-700 hover:bg-blue-800'
                    } text-white`}
                  >
                    {copiedShareLink ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 block">Share Via</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Email */}
                  <button 
                    onClick={() => {
                      const subject = `Check out this opportunity: ${shareModalItem.item.title}`
                      const body = `Hey!\n\nI found an opportunity I think you'd be perfect for:\n\n${shareModalItem.item.title}\n${shareModalItem.item.company || shareModalItem.item.requester}\n${shareModalItem.item.location}\nReward: ${shareModalItem.item.bounty}\n\nApply through my referral link:\nhttps://justbungee.com/refer/${shareModalItem.type}/${userCode}/${shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}\n\n- ${userName}`
                      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <Mail className="size-5 text-red-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Email</span>
                  </button>

                  {/* SMS */}
                  <button 
                    onClick={() => {
                      const message = `Hey! Check out this opportunity: ${shareModalItem.item.title} at ${shareModalItem.item.company || shareModalItem.item.requester}. Reward: ${shareModalItem.item.bounty}. Apply here: https://justbungee.com/refer/${shareModalItem.type}/${userCode}/${shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`
                      window.open(`sms:?body=${encodeURIComponent(message)}`)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <MessageSquare className="size-5 text-emerald-700" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">SMS</span>
                  </button>

                  {/* WhatsApp */}
                  <button 
                    onClick={() => {
                      const message = `Hey! Check out this opportunity: ${shareModalItem.item.title} at ${shareModalItem.item.company || shareModalItem.item.requester}. Reward: ${shareModalItem.item.bounty}. Apply here: https://justbungee.com/refer/${shareModalItem.type}/${userCode}/${shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`
                      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <MessageSquareDot className="size-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</span>
                  </button>

                  {/* LinkedIn */}
                  <button 
                    onClick={() => {
                      const url = `https://justbungee.com/refer/${shareModalItem.type}/${userCode}/${shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <Briefcase className="size-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">LinkedIn</span>
                  </button>

                  {/* Twitter/X */}
                  <button 
                    onClick={() => {
                      const text = `Check out this opportunity: ${shareModalItem.item.title} - Reward: ${shareModalItem.item.bounty}`
                      const url = `https://justbungee.com/refer/${shareModalItem.type}/${userCode}/${shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <X className="size-5 text-gray-900 dark:text-white" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">X / Twitter</span>
                  </button>

                  {/* Facebook */}
                  <button 
                    onClick={() => {
                      const url = `https://justbungee.com/refer/${shareModalItem.type}/${userCode}/${shareModalItem.item.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <Users className="size-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Facebook</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalItem && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          onClick={() => setDetailsModalItem(null)}
        >
          <Card 
            className="w-full max-w-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className={`border-b border-gray-200 dark:border-gray-700 ${
              detailsModalItem.type === 'job' ? 'bg-gradient-to-r from-fuchsia-700/20 to-fuchsia-900/20' :
              detailsModalItem.type === 'service' ? 'bg-gradient-to-r from-emerald-700/20 to-green-900/20' :
              'bg-gradient-to-r from-blue-700/20 to-blue-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-xl flex items-center justify-center ${
                    detailsModalItem.type === 'job' ? 'bg-fuchsia-700/20' :
                    detailsModalItem.type === 'service' ? 'bg-emerald-700/20' :
                    'bg-blue-700/20'
                  }`}>
                    <Eye className={`size-6 ${
                      detailsModalItem.type === 'job' ? 'text-fuchsia-400' :
                      detailsModalItem.type === 'service' ? 'text-emerald-400' :
                      'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Opportunity Details</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Full information</CardDescription>
                  </div>
                </div>
                <button 
                  onClick={() => setDetailsModalItem(null)}
                  className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-500 flex items-center justify-center text-gray-900 dark:text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Title and Bounty */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{detailsModalItem.item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{detailsModalItem.item.company || detailsModalItem.item.requester}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="size-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{detailsModalItem.item.location}</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl ${
                  detailsModalItem.type === 'job' ? 'bg-fuchsia-700/20' :
                  detailsModalItem.type === 'service' ? 'bg-emerald-700/20' :
                  'bg-blue-700/20'
                }`}>
                  <p className={`text-xl font-bold ${
                    detailsModalItem.type === 'job' ? 'text-fuchsia-400' :
                    detailsModalItem.type === 'service' ? 'text-emerald-400' :
                    'text-blue-400'
                  }`}>{detailsModalItem.item.bounty}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Reward</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {detailsModalItem.item.description || "No description available."}
                </p>
              </div>

              {/* Requirements */}
              {detailsModalItem.item.requirements && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                  <ul className="space-y-2">
                    {detailsModalItem.item.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className={`size-4 ${
                          detailsModalItem.type === 'job' ? 'text-fuchsia-400' :
                          detailsModalItem.type === 'service' ? 'text-emerald-400' :
                          'text-blue-400'
                        }`} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => {
                    setDetailsModalItem(null)
                    setShareModalItem(detailsModalItem)
                  }}
                  className={`flex-1 ${
                    detailsModalItem.type === 'job' ? 'bg-fuchsia-700 hover:bg-fuchsia-800' :
                    detailsModalItem.type === 'service' ? 'bg-emerald-700 hover:bg-emerald-800' :
                    'bg-blue-700 hover:bg-blue-800'
                  } text-white`}
                >
                  <Share2 className="size-4 mr-2" />
                  I Got Someone
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setDetailsModalItem(null)}
                  className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bungee Tax Verification Modal */}
      <BungeeTaxVerificationModal
        isOpen={showTaxVerification}
        onClose={() => setShowTaxVerification(false)}
        onVerified={() => {
          setIsTaxVerified(true)
          setShowTaxVerification(false)
        }}
        userId={userProfile?.id || user?.id || ''}
        isDarkMode={isDarkMode}
        pendingAmount="$0.00"
      />

    </div>
  )
}
