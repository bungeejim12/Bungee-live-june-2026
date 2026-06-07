"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Building2,
  Zap,
  TrendingUp,
  ChevronRight,
  DollarSign,
  Eye,
  Search,
  MoreVertical,
  Pause,
  Trash2,
  Activity,
  CreditCard,
  Percent,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  ShoppingBag,
  Wrench,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
} from "lucide-react"
import { RankBadge, BUNGEE_RANKS } from "@/components/bungee-rank-system"
import { AskBungeeChat } from "@/components/ask-bungee-chat"

interface CorporateDashboardProps {
  onViewChange?: (view: "business" | "referral" | "pitch" | "corporate") => void
  currentView?: "business" | "referral" | "pitch" | "corporate"
}

// Mock data for businesses
const mockBusinesses = [
  { id: "biz_1", name: "Acme Corporation", status: "active", openJobs: 4, marketplaceItems: 2, services: 3, totalPaidToBungees: 12500, joinDate: "2024-01-15", referredBy: "John Smith" },
  { id: "biz_2", name: "TechStart Inc", status: "active", openJobs: 7, marketplaceItems: 0, services: 1, totalPaidToBungees: 8750, joinDate: "2024-02-20", referredBy: "Sarah Johnson" },
  { id: "biz_3", name: "Global Solutions", status: "frozen", openJobs: 0, marketplaceItems: 5, services: 2, totalPaidToBungees: 3200, joinDate: "2023-11-08", referredBy: "Mike Williams" },
  { id: "biz_4", name: "Local Hardware", status: "active", openJobs: 2, marketplaceItems: 12, services: 0, totalPaidToBungees: 1850, joinDate: "2024-03-01", referredBy: "Emily Davis" },
  { id: "biz_5", name: "Premier Services", status: "suspended", openJobs: 0, marketplaceItems: 0, services: 8, totalPaidToBungees: 15600, joinDate: "2023-08-22", referredBy: "Chris Brown" },
  { id: "biz_6", name: "Quick Logistics", status: "active", openJobs: 5, marketplaceItems: 1, services: 4, totalPaidToBungees: 9200, joinDate: "2024-01-30", referredBy: "Amanda Wilson" },
]

// Mock data for bungees
const mockBungees = [
  { id: "bungee_1", name: "John Smith", rankLevel: 8, totalEarnings: 14250, referralsMade: 87, successRate: 82, businessesReferred: 5, xp: 12500, xpToNext: 15000 },
  { id: "bungee_2", name: "Sarah Johnson", rankLevel: 6, totalEarnings: 8750, referralsMade: 54, successRate: 76, businessesReferred: 3, xp: 7200, xpToNext: 10000 },
  { id: "bungee_3", name: "Mike Williams", rankLevel: 5, totalEarnings: 5200, referralsMade: 38, successRate: 71, businessesReferred: 2, xp: 4800, xpToNext: 6500 },
  { id: "bungee_4", name: "Emily Davis", rankLevel: 9, totalEarnings: 22400, referralsMade: 112, successRate: 88, businessesReferred: 8, xp: 18500, xpToNext: 22000 },
  { id: "bungee_5", name: "Chris Brown", rankLevel: 4, totalEarnings: 3100, referralsMade: 24, successRate: 67, businessesReferred: 1, xp: 3200, xpToNext: 4000 },
  { id: "bungee_6", name: "Amanda Wilson", rankLevel: 7, totalEarnings: 11800, referralsMade: 68, successRate: 79, businessesReferred: 4, xp: 10200, xpToNext: 12500 },
  { id: "bungee_7", name: "David Lee", rankLevel: 10, totalEarnings: 35600, referralsMade: 156, successRate: 91, businessesReferred: 12, xp: 24000, xpToNext: 30000 },
  { id: "bungee_8", name: "Lisa Chen", rankLevel: 3, totalEarnings: 1850, referralsMade: 15, successRate: 60, businessesReferred: 0, xp: 1500, xpToNext: 2500 },
]

// Mock recent activity
const mockActivity = [
  { id: 1, type: "hire", business: "Acme Corporation", bungee: "John Smith", amount: 500, time: "2 min ago" },
  { id: 2, type: "sale", business: "TechStart Inc", bungee: "Emily Davis", amount: 150, time: "15 min ago" },
  { id: 3, type: "referral", business: "Quick Logistics", bungee: "Amanda Wilson", amount: 250, time: "1 hour ago" },
  { id: 4, type: "hire", business: "Local Hardware", bungee: "Sarah Johnson", amount: 350, time: "2 hours ago" },
  { id: 5, type: "sale", business: "Acme Corporation", bungee: "David Lee", amount: 200, time: "3 hours ago" },
]

export function CorporateDashboard({ onViewChange, currentView = "corporate" }: CorporateDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "businesses" | "bungees" | "revenue">("overview")
  const [searchBusiness, setSearchBusiness] = useState("")
  const [searchBungee, setSearchBungee] = useState("")
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null)
  const [expandedBungee, setExpandedBungee] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState(mockBusinesses)
  const [bungees, setBungees] = useState(mockBungees)
  
  // Revenue split configuration
  const [corporateCut, setCorporateCut] = useState(20)
  const [businessReferralSplit, setBusinessReferralSplit] = useState(10)
  const [customCorporateCut, setCustomCorporateCut] = useState("")
  const [customReferralSplit, setCustomReferralSplit] = useState("")

  // Platform stats
  const totalBusinesses = businesses.length
  const activeBusinesses = businesses.filter(b => b.status === "active").length
  const totalBungees = bungees.length
  const platformRevenue = businesses.reduce((sum, b) => sum + b.totalPaidToBungees, 0) * (corporateCut / 100)
  const pendingPayouts = 8750 // Mock value

  const toggleBusinessStatus = (id: string) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === id) {
        const newStatus = b.status === "active" ? "frozen" : b.status === "frozen" ? "active" : b.status
        return { ...b, status: newStatus }
      }
      return b
    }))
  }

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchBusiness.toLowerCase())
  )

  const filteredBungees = bungees.filter(b => 
    b.name.toLowerCase().includes(searchBungee.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-[#374151] text-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-gray-600 bg-[#2D3748]">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#FF8C00] to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="size-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">BUNGEE</h2>
              <p className="text-xs text-gray-400">Eye in the Sky</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Navigation */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Navigation</p>
          <div className="flex flex-col gap-1 mb-6">
            <button
              onClick={() => onViewChange?.("business")}
              className={`flex items-center gap-3 text-sm font-semibold text-left px-4 py-3 rounded-xl transition-all ${currentView === "business" ? "text-white bg-gradient-to-r from-[#FF8C00] to-orange-500 shadow-lg shadow-orange-500/25" : "text-gray-300 hover:bg-gray-700"}`}
            >
              <Building2 className="size-5" />
              Businesses
            </button>
            <button
              onClick={() => onViewChange?.("referral")}
              className={`flex items-center gap-3 text-sm font-semibold text-left px-4 py-3 rounded-xl transition-all ${currentView === "referral" ? "text-white bg-gradient-to-r from-[#FF8C00] to-orange-500 shadow-lg shadow-orange-500/25" : "text-gray-300 hover:bg-gray-700"}`}
            >
              <Users className="size-5" />
              Referrals
            </button>
            <button
              onClick={() => onViewChange?.("corporate")}
              className={`flex items-center gap-3 text-sm font-semibold text-left px-4 py-3 rounded-xl transition-all ${currentView === "corporate" ? "text-white bg-gradient-to-r from-[#FF8C00] to-orange-500 shadow-lg shadow-orange-500/25" : "text-gray-300 hover:bg-gray-700"}`}
            >
              <img src="/images/bungee-logo.png" alt="Bungee" className="size-5 object-contain" />
              Eye in the Sky
            </button>
          </div>

          {/* Admin Badge */}
          <div className="mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <Eye className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Admin Access</p>
                  <p className="text-xs text-gray-400">Full Platform Control</p>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">Eye in the Sky</Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Platform Health</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-700 border border-gray-600">
                <span className="text-sm text-gray-400">Active Businesses</span>
                <span className="font-semibold text-green-400">{activeBusinesses}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-700 border border-gray-600">
                <span className="text-sm text-gray-400">Active Bungees</span>
                <span className="font-semibold text-[#FF8C00]">{totalBungees}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-700 border border-gray-600">
                <span className="text-sm text-gray-400">Revenue (MTD)</span>
                <span className="font-semibold text-white">${platformRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Header */}
        <header className="border-b border-gray-600 bg-[#2D3748] sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Navigation Tabs - visible on all screens */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewChange?.("business")}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${currentView === "business" ? "text-white bg-gradient-to-r from-[#FF8C00] to-orange-500 shadow-md" : "text-gray-300 bg-gray-700 hover:bg-gray-600"}`}
              >
                <Building2 className="size-4" />
                <span className="hidden sm:inline">Business</span>
              </button>
              <button
                onClick={() => onViewChange?.("referral")}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${currentView === "referral" ? "text-white bg-gradient-to-r from-[#FF8C00] to-orange-500 shadow-md" : "text-gray-300 bg-gray-700 hover:bg-gray-600"}`}
              >
                <Users className="size-4" />
                <span className="hidden sm:inline">Referrals</span>
              </button>
              <button
                onClick={() => onViewChange?.("corporate")}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${currentView === "corporate" ? "text-white bg-gradient-to-r from-[#FF8C00] to-orange-500 shadow-md" : "text-gray-300 bg-gray-700 hover:bg-gray-600"}`}
              >
                <img src="/images/bungee-logo.png" alt="Bungee Dashboard" className="size-5 object-contain" />
              </button>
            </div>
            
            {/* Admin Badge */}
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                <Eye className="size-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </header>

        {/* Ask Bungee Chat */}
        <AskBungeeChat />
        
        {/* Dashboard Content */}
        <div className="flex-1 p-4 lg:p-6 bg-[#374151]">
          {/* Header Card */}
          <div className="mb-4">
            <Card className="bg-[#2D3748] border-gray-600 shadow-md">
              <CardContent className="pt-4 pb-4 px-4">
                {/* Title */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Eye className="size-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Eye in the Sky</h1>
                      <p className="text-sm text-gray-400">BUNGEE Corporate - Platform Overview</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[#FF8C00] hover:bg-[#E67E00] text-white gap-2">
                    <RefreshCw className="size-4" />
                    Refresh Data
                  </Button>
                </div>

                {/* Main Tabs (BIGGER) */}
                <div className="mb-3">
                  <div className="grid w-full grid-cols-4 h-auto p-2 bg-gray-700/50 border border-gray-600 rounded-xl gap-2">
                    <button 
                      onClick={() => setActiveTab("overview")}
                      className={`flex items-center justify-center gap-2 py-3.5 px-4 font-semibold rounded-lg text-sm transition-all ${activeTab === "overview" ? "bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white shadow-lg" : "text-gray-400 hover:bg-gray-700"}`}
                    >
                      <BarChart3 className="size-5" />
                      <span>Overview</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("businesses")}
                      className={`flex items-center justify-center gap-2 py-3.5 px-4 font-semibold rounded-lg text-sm transition-all ${activeTab === "businesses" ? "bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white shadow-lg" : "text-gray-400 hover:bg-gray-700"}`}
                    >
                      <Building2 className="size-5" />
                      <span>Businesses</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("bungees")}
                      className={`flex items-center justify-center gap-2 py-3.5 px-4 font-semibold rounded-lg text-sm transition-all ${activeTab === "bungees" ? "bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white shadow-lg" : "text-gray-400 hover:bg-gray-700"}`}
                    >
                      <Users className="size-5" />
                      <span>Bungees</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("revenue")}
                      className={`flex items-center justify-center gap-2 py-3.5 px-4 font-semibold rounded-lg text-sm transition-all ${activeTab === "revenue" ? "bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white shadow-lg" : "text-gray-400 hover:bg-gray-700"}`}
                    >
                      <DollarSign className="size-5" />
                      <span>Revenue</span>
                    </button>
                  </div>
                </div>

                {/* Stats Row (SMALLER) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-blue-500/10 border border-blue-500/30">
                    <div className="size-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                      <Building2 className="size-3 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-400">Total Businesses</p>
                      <p className="text-sm font-semibold text-blue-400">{totalBusinesses}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#FF8C00]/10 border border-[#FF8C00]/30">
                    <div className="size-6 rounded-md bg-[#FF8C00]/20 flex items-center justify-center">
                      <Users className="size-3 text-[#FF8C00]" />
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-400">Active Bungees</p>
                      <p className="text-sm font-semibold text-[#FF8C00]">{totalBungees}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-green-500/10 border border-green-500/30">
                    <div className="size-6 rounded-md bg-green-500/20 flex items-center justify-center">
                      <DollarSign className="size-3 text-green-400" />
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-400">Platform Revenue</p>
                      <p className="text-sm font-semibold text-green-400">${platformRevenue.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-purple-500/10 border border-purple-500/30">
                    <div className="size-6 rounded-md bg-purple-500/20 flex items-center justify-center">
                      <CreditCard className="size-3 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-400">Pending Payouts</p>
                      <p className="text-sm font-semibold text-purple-400">${pendingPayouts.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-4">
                  {/* Recent Activity */}
                  <Card className="bg-[#2D3748] border-gray-600 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Activity className="size-4 text-[#FF8C00]" />
                        Live Activity Feed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mockActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50 border border-gray-600">
                            <div className="flex items-center gap-2">
                              <div className={`size-7 rounded-md flex items-center justify-center ${
                                activity.type === "hire" ? "bg-green-500/20" : 
                                activity.type === "sale" ? "bg-blue-500/20" : "bg-purple-500/20"
                              }`}>
                                {activity.type === "hire" ? <Briefcase className="size-3.5 text-green-400" /> :
                                 activity.type === "sale" ? <ShoppingBag className="size-3.5 text-blue-400" /> :
                                 <Users className="size-3.5 text-purple-400" />}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-white">{activity.bungee}</p>
                                <p className="text-[10px] text-gray-400">{activity.type} at {activity.business}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-green-400">+${activity.amount}</p>
                              <p className="text-[10px] text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performers */}
                  <Card className="bg-[#2D3748] border-gray-600 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Award className="size-4 text-[#FF8C00]" />
                        Top Bungees This Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {bungees.sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 5).map((bungee, index) => {
                          const rank = BUNGEE_RANKS[bungee.rankLevel - 1]
                          return (
                            <div key={bungee.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50 border border-gray-600">
                              <div className="flex items-center gap-2">
                                <div className={`size-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                  index === 0 ? "bg-yellow-500 text-black" :
                                  index === 1 ? "bg-gray-400 text-black" :
                                  index === 2 ? "bg-amber-600 text-white" : "bg-gray-600 text-white"
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-white">{bungee.name}</p>
                                  <div className="flex items-center gap-1">
                                    <div className={`size-2 rounded-full bg-gradient-to-r ${rank.bgGradient}`} />
                                    <p className="text-[10px] text-gray-400">{rank.name}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-green-400">${bungee.totalEarnings.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500">{bungee.referralsMade} referrals</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Platform Metrics */}
                <Card className="bg-[#2D3748] border-gray-600 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <TrendingUp className="size-4 text-[#FF8C00]" />
                      Platform Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
                        <p className="text-2xl font-bold text-white">{businesses.reduce((sum, b) => sum + b.openJobs, 0)}</p>
                        <p className="text-xs text-gray-400">Open Jobs</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
                        <p className="text-2xl font-bold text-white">{businesses.reduce((sum, b) => sum + b.marketplaceItems, 0)}</p>
                        <p className="text-xs text-gray-400">Marketplace Items</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
                        <p className="text-2xl font-bold text-white">{businesses.reduce((sum, b) => sum + b.services, 0)}</p>
                        <p className="text-xs text-gray-400">Active Services</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
                        <p className="text-2xl font-bold text-white">${businesses.reduce((sum, b) => sum + b.totalPaidToBungees, 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Total Paid to Bungees</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Businesses Tab */}
            {activeTab === "businesses" && (
              <div className="space-y-4">
                {/* Search */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input 
                      placeholder="Search businesses..." 
                      value={searchBusiness}
                      onChange={(e) => setSearchBusiness(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 gap-2">
                    <Filter className="size-4" />
                    Filter
                  </Button>
                </div>

                {/* Business List */}
                <div className="space-y-2">
                  {filteredBusinesses.map((business) => (
                    <Card key={business.id} className="bg-[#2D3748] border-gray-600 shadow-sm">
                      <CardContent className="py-3">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedBusiness(expandedBusiness === business.id ? null : business.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                              <Building2 className="size-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-white">{business.name}</p>
                                <Badge className={`text-[10px] ${
                                  business.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                  business.status === "frozen" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                  "bg-red-500/20 text-red-400 border-red-500/30"
                                }`}>
                                  {business.status === "active" ? <CheckCircle className="size-3 mr-1" /> :
                                   business.status === "frozen" ? <Pause className="size-3 mr-1" /> :
                                   <XCircle className="size-3 mr-1" />}
                                  {business.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400">
                                {business.openJobs} jobs | {business.marketplaceItems} items | {business.services} services
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-green-400">${business.totalPaidToBungees.toLocaleString()}</p>
                              <p className="text-[10px] text-gray-500">paid to bungees</p>
                            </div>
                            {expandedBusiness === business.id ? 
                              <ChevronUp className="size-5 text-gray-400" /> : 
                              <ChevronDown className="size-5 text-gray-400" />
                            }
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedBusiness === business.id && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase">Activity Summary</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Open Jobs:</span>
                                    <span className="text-white">{business.openJobs}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Marketplace Items:</span>
                                    <span className="text-white">{business.marketplaceItems}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Services:</span>
                                    <span className="text-white">{business.services}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Joined:</span>
                                    <span className="text-white">{business.joinDate}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Referred By:</span>
                                    <span className="text-[#FF8C00]">{business.referredBy}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-400 uppercase">Actions</p>
                                <div className="flex flex-wrap gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className={`border-gray-600 gap-1 text-xs ${
                                      business.status === "frozen" ? "text-green-400 hover:bg-green-500/20" : "text-yellow-400 hover:bg-yellow-500/20"
                                    }`}
                                    onClick={(e) => { e.stopPropagation(); toggleBusinessStatus(business.id); }}
                                  >
                                    {business.status === "frozen" ? <CheckCircle className="size-3" /> : <Pause className="size-3" />}
                                    {business.status === "frozen" ? "Unfreeze" : "Freeze"}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/20 gap-1 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="size-3" />
                                    Delete
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-[#FF8C00] hover:bg-[#E67E00] text-white gap-1 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="size-3" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Bungees Tab */}
            {activeTab === "bungees" && (
              <div className="space-y-4">
                {/* Search */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input 
                      placeholder="Search bungees..." 
                      value={searchBungee}
                      onChange={(e) => setSearchBungee(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 gap-2">
                    <Filter className="size-4" />
                    Filter by Rank
                  </Button>
                </div>

                {/* Bungee List */}
                <div className="space-y-2">
                  {filteredBungees.map((bungee) => {
                    const rank = BUNGEE_RANKS[bungee.rankLevel - 1]
                    const xpProgress = (bungee.xp / bungee.xpToNext) * 100
                    const closeToLevelUp = xpProgress >= 80
                    
                    return (
                      <Card key={bungee.id} className={`bg-[#2D3748] border-gray-600 shadow-sm ${closeToLevelUp ? "ring-2 ring-[#FF8C00]/50" : ""}`}>
                        <CardContent className="py-3">
                          <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedBungee(expandedBungee === bungee.id ? null : bungee.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`size-10 rounded-full bg-gradient-to-br ${rank.bgGradient} flex items-center justify-center`}>
                                <span className="text-white font-bold text-sm">{bungee.rankLevel}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-white">{bungee.name}</p>
                                  <Badge className={`text-[10px] ${rank.textColor} border-current/30`} style={{ backgroundColor: `${rank.color}20` }}>
                                    {rank.name}
                                  </Badge>
                                  {closeToLevelUp && (
                                    <Badge className="bg-[#FF8C00]/20 text-[#FF8C00] border-[#FF8C00]/30 text-[10px]">
                                      <TrendingUp className="size-3 mr-1" />
                                      Near Level Up!
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400">
                                  {bungee.referralsMade} referrals | {bungee.successRate}% success | {bungee.businessesReferred} businesses
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-400">${bungee.totalEarnings.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500">total earnings</p>
                              </div>
                              {expandedBungee === bungee.id ? 
                                <ChevronUp className="size-5 text-gray-400" /> : 
                                <ChevronDown className="size-5 text-gray-400" />
                              }
                            </div>
                          </div>

                          {/* XP Progress Bar */}
                          <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                              <span>{bungee.xp.toLocaleString()} XP</span>
                              <span>{bungee.xpToNext.toLocaleString()} XP</span>
                            </div>
                            <Progress value={xpProgress} className="h-1.5" />
                          </div>

                          {/* Expanded Details */}
                          {expandedBungee === bungee.id && (
                            <div className="mt-4 pt-4 border-t border-gray-600">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-gray-400 uppercase">Stats</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-400">Total Referrals:</span>
                                      <span className="text-white">{bungee.referralsMade}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-400">Success Rate:</span>
                                      <span className="text-white">{bungee.successRate}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-400">Businesses Referred:</span>
                                      <span className="text-white">{bungee.businessesReferred}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-400">Current Rank:</span>
                                      <span style={{ color: rank.color }}>{rank.title}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-gray-400 uppercase">Actions</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-gray-600 text-gray-300 hover:bg-gray-700 gap-1 text-xs"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Settings className="size-3" />
                                      Adjust XP
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-[#FF8C00] hover:bg-[#E67E00] text-white gap-1 text-xs"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Eye className="size-3" />
                                      Full Activity
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === "revenue" && (
              <div className="space-y-4">
                {/* Corporate Cut Configuration */}
                <Card className="bg-[#2D3748] border-gray-600 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Percent className="size-4 text-[#FF8C00]" />
                      Corporate Cut Configuration
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs">
                      Set the percentage BUNGEE Corporate takes from all bounty payments to Bungees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[10, 20, 30].map((percent) => (
                          <button
                            key={percent}
                            onClick={() => { setCorporateCut(percent); setCustomCorporateCut(""); }}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              corporateCut === percent && !customCorporateCut
                                ? "border-[#FF8C00] bg-[#FF8C00]/20"
                                : "border-gray-600 bg-gray-700/50 hover:border-[#FF8C00]/50"
                            }`}
                          >
                            <p className={`text-xl font-bold ${corporateCut === percent && !customCorporateCut ? "text-[#FF8C00]" : "text-white"}`}>
                              {percent}%
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {percent === 10 ? "Low" : percent === 20 ? "Standard" : "Premium"}
                            </p>
                          </button>
                        ))}
                        <div className="p-3 rounded-lg border-2 border-gray-600 bg-gray-700/50">
                          <Input
                            type="number"
                            placeholder="Custom"
                            value={customCorporateCut}
                            onChange={(e) => { setCustomCorporateCut(e.target.value); setCorporateCut(parseInt(e.target.value) || 0); }}
                            className="bg-transparent border-0 text-center text-xl font-bold text-white p-0 h-auto"
                          />
                          <p className="text-[10px] text-gray-400 text-center">Custom %</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30">
                        <p className="text-sm text-gray-300">
                          Current Setting: <span className="font-bold text-[#FF8C00]">{corporateCut}%</span> of all bounty payments go to BUNGEE Corporate
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Based on current activity, this generates approximately <span className="text-green-400 font-semibold">${platformRevenue.toLocaleString()}</span> in platform revenue
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Referral Split */}
                <Card className="bg-[#2D3748] border-gray-600 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <Users className="size-4 text-purple-400" />
                      Business Referral Split
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs">
                      When a Bungee refers a new business, they earn a percentage of all future bounties paid by that business to other Bungees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[5, 10, 15].map((percent) => (
                          <button
                            key={percent}
                            onClick={() => { setBusinessReferralSplit(percent); setCustomReferralSplit(""); }}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              businessReferralSplit === percent && !customReferralSplit
                                ? "border-purple-500 bg-purple-500/20"
                                : "border-gray-600 bg-gray-700/50 hover:border-purple-500/50"
                            }`}
                          >
                            <p className={`text-xl font-bold ${businessReferralSplit === percent && !customReferralSplit ? "text-purple-400" : "text-white"}`}>
                              {percent}%
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {percent === 5 ? "Low" : percent === 10 ? "Standard" : "Generous"}
                            </p>
                          </button>
                        ))}
                        <div className="p-3 rounded-lg border-2 border-gray-600 bg-gray-700/50">
                          <Input
                            type="number"
                            placeholder="Custom"
                            value={customReferralSplit}
                            onChange={(e) => { setCustomReferralSplit(e.target.value); setBusinessReferralSplit(parseInt(e.target.value) || 0); }}
                            className="bg-transparent border-0 text-center text-xl font-bold text-white p-0 h-auto"
                          />
                          <p className="text-[10px] text-gray-400 text-center">Custom %</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <p className="text-sm text-gray-300">
                          Current Setting: <span className="font-bold text-purple-400">{businessReferralSplit}%</span> goes to the original Bungee who referred the business
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Example: If Sarah refers Acme Corp, and John earns a $500 bounty from Acme Corp, Sarah gets <span className="text-purple-400 font-semibold">${(500 * businessReferralSplit / 100).toFixed(0)}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Apply Changes */}
                <Card className="bg-gradient-to-r from-[#FF8C00]/20 to-purple-500/20 border-[#FF8C00]/30">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">Apply Revenue Configuration</p>
                        <p className="text-xs text-gray-400">Changes will sync to Stripe Connect settings</p>
                      </div>
                      <Button className="bg-[#FF8C00] hover:bg-[#E67E00] text-white gap-2">
                        <CreditCard className="size-4" />
                        Apply to Stripe
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Summary */}
                <Card className="bg-[#2D3748] border-gray-600 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white flex items-center gap-2">
                      <BarChart3 className="size-4 text-green-400" />
                      Revenue Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600 text-center">
                        <p className="text-3xl font-bold text-white">${businesses.reduce((sum, b) => sum + b.totalPaidToBungees, 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Total Platform Volume</p>
                      </div>
                      <div className="p-4 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30 text-center">
                        <p className="text-3xl font-bold text-[#FF8C00]">${platformRevenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Corporate Revenue ({corporateCut}%)</p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                        <p className="text-3xl font-bold text-purple-400">${(businesses.reduce((sum, b) => sum + b.totalPaidToBungees, 0) * businessReferralSplit / 100).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Business Referral Payouts ({businessReferralSplit}%)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
