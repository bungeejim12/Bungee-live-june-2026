"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Lock, 
  Eye, 
  EyeOff,
  RefreshCw,
  X,
  DollarSign,
  Shield,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  Building2,
  UserCheck,
  Ban
} from 'lucide-react'

interface CorporateAdminDashboardProps {
  onClose?: () => void
}

// Hardcoded Access Password
const ADMIN_PASSWORD = "bungee26"

type ActivityType = 'business' | 'bungee'
type ActivityStatus = 'Campaign Created' | 'Referral Pending' | 'AI Vetted' | 'Escrow Cleared' | 'Processing' | 'Payout Sent'

interface ActivityItem {
  id: number
  type: ActivityType
  target: string
  detail: string
  volume: string
  allocation?: string
  time: string
  status: ActivityStatus
}

interface FlaggedItem {
  id: number
  accountName: string
  accountType: 'business' | 'bungee'
  flagReason: string
  severity: 'high' | 'medium' | 'low'
  timestamp: string
  trustScore?: number
}

export default function CorporateAdminDashboard({ onClose }: CorporateAdminDashboardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'business' | 'bungee'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Global Metrics State
  const [metrics, setMetrics] = useState({
    activeMarketplaceVolume: 847520,
    stripeEscrowBalance: 234180,
    corporateRevenue: 61295,
    totalActiveNodes: 1882
  })

  // Live Cross-Ecosystem Stream - Global Network Pulse
  const [activities] = useState<ActivityItem[]>([
    { id: 1, type: 'business', target: 'ABC Company', detail: '$100 Bounty Posted for HVAC Lead', volume: '$100.00', time: 'Just Now', status: 'Campaign Created' },
    { id: 2, type: 'bungee', target: 'Jim V.', detail: 'Referral submitted -> Payout Allocation', volume: '$75.00', allocation: '$75 Bungee / $25 Corporate', time: '2 mins ago', status: 'Referral Pending' },
    { id: 3, type: 'business', target: 'Elite Pest Control', detail: '$250 Bounty for Emergency Service Lead', volume: '$250.00', time: '8 mins ago', status: 'Campaign Created' },
    { id: 4, type: 'bungee', target: 'Sarah K.', detail: 'AI validation passed for roofing referral', volume: '$150.00', allocation: '$112.50 Bungee / $37.50 Corporate', time: '15 mins ago', status: 'AI Vetted' },
    { id: 5, type: 'business', target: 'Paramount Remodeling', detail: 'Escrow released after job completion', volume: '$400.00', time: '32 mins ago', status: 'Escrow Cleared' },
    { id: 6, type: 'bungee', target: 'David L.', detail: 'Payout processed via Stripe Connect', volume: '$120.00', allocation: '$90 Bungee / $30 Corporate', time: '1 hour ago', status: 'Payout Sent' },
    { id: 7, type: 'business', target: 'Sunshine Plumbing', detail: '$175 Bounty Posted for Plumbing Lead', volume: '$175.00', time: '1.5 hours ago', status: 'Campaign Created' },
    { id: 8, type: 'bungee', target: 'Jennifer M.', detail: 'Referral under AI integrity review', volume: '$200.00', allocation: 'Pending Verification', time: '2 hours ago', status: 'Processing' },
    { id: 9, type: 'business', target: 'First Coast HVAC', detail: 'Campaign funds cleared from escrow', volume: '$361.00', time: '3 hours ago', status: 'Escrow Cleared' },
    { id: 10, type: 'bungee', target: 'Michael S.', detail: 'Successful referral conversion recorded', volume: '$85.00', allocation: '$63.75 Bungee / $21.25 Corporate', time: '4 hours ago', status: 'AI Vetted' },
  ])

  // AI Integrity & Fraud Control Queue
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([
    { id: 1, accountName: 'suspicious_user_42', accountType: 'bungee', flagReason: 'Duplicate cell number check triggered - matched 3 existing accounts', severity: 'high', timestamp: '5 mins ago', trustScore: 12 },
    { id: 2, accountName: 'QuickFix Contractors', accountType: 'business', flagReason: 'Unusual bounty velocity - 15 campaigns in 2 hours', severity: 'medium', timestamp: '18 mins ago', trustScore: 45 },
    { id: 3, accountName: 'john_referrer', accountType: 'bungee', flagReason: 'Low Referral Trust Score warning - multiple rejected leads', severity: 'medium', timestamp: '45 mins ago', trustScore: 28 },
    { id: 4, accountName: 'ghost_leads_llc', accountType: 'business', flagReason: 'Payment method flagged by Stripe fraud detection', severity: 'high', timestamp: '1 hour ago', trustScore: 8 },
    { id: 5, accountName: 'rapid_ref_mike', accountType: 'bungee', flagReason: 'Referral pattern anomaly - same customer submitted to 5 businesses', severity: 'medium', timestamp: '2 hours ago', trustScore: 35 },
  ])

  // Simulate real-time metric updates
  useEffect(() => {
    if (!isAuthenticated) return
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeMarketplaceVolume: prev.activeMarketplaceVolume + Math.floor(Math.random() * 500) - 200,
        stripeEscrowBalance: prev.stripeEscrowBalance + Math.floor(Math.random() * 300) - 100,
        corporateRevenue: prev.corporateRevenue + Math.floor(Math.random() * 50),
        totalActiveNodes: prev.totalActiveNodes + Math.floor(Math.random() * 3) - 1
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Handle password validation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Unauthorized access code.')
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleApproveOverride = (id: number) => {
    setFlaggedItems(prev => prev.filter(item => item.id !== id))
  }

  const handleDeplatform = (id: number) => {
    setFlaggedItems(prev => prev.filter(item => item.id !== id))
  }

  const filteredActivities = activities.filter(act => {
    if (filter === 'all') return true
    return act.type === filter
  })

  const getStatusBadge = (status: ActivityStatus) => {
    const configs: Record<ActivityStatus, { bg: string; text: string; border: string }> = {
      'Campaign Created': { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
      'Referral Pending': { bg: 'rgba(251, 191, 36, 0.15)', text: '#FBB024', border: 'rgba(251, 191, 36, 0.3)' },
      'AI Vetted': { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
      'Escrow Cleared': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', border: 'rgba(139, 92, 246, 0.3)' },
      'Processing': { bg: 'rgba(251, 191, 36, 0.15)', text: '#FBB024', border: 'rgba(251, 191, 36, 0.3)' },
      'Payout Sent': { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
    }
    return configs[status] || configs['Processing']
  }

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' }
      case 'medium': return { bg: 'rgba(251, 191, 36, 0.15)', text: '#FBB024', border: 'rgba(251, 191, 36, 0.3)' }
      case 'low': return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' }
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      router.push('/')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
  }

  // --- GATED SECURITY SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: '#0A0A0A', fontFamily: '"Inter", "Montserrat", sans-serif' }}>
        {/* Exit Button - Top Left */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-2.5 rounded-full hover:bg-gray-800 transition-colors border border-gray-700"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <X className="size-5" style={{ color: '#888888' }} />
        </button>
        
        <div 
          className="w-full max-w-md text-center p-12 rounded-2xl"
          style={{ 
            backgroundColor: '#111111', 
            border: '1px solid #222222',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
          }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
            <Shield className="size-8" style={{ color: '#FF6B00' }} />
          </div>
          <h2 className="text-3xl font-black mb-1 tracking-wide" style={{ color: '#FF6B00' }}>EYE IN THE SKY</h2>
          <p className="text-xs uppercase tracking-widest mb-8" style={{ color: '#666666' }}>Master Admin Control Panel</p>
          
          <form onSubmit={handleLogin}>
            <div className="relative mb-5">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="ENTER SECURE PASSCODE" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-4 rounded-lg text-center text-base outline-none"
                style={{ 
                  backgroundColor: '#0A0A0A', 
                  border: '1px solid #2A2A2A',
                  color: '#FFFFFF',
                  letterSpacing: '3px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#666666' }}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            
            {error && (
              <p className="text-sm font-bold mb-5" style={{ color: '#FF3333' }}>{error}</p>
            )}
            
            <button 
              type="submit" 
              className="w-full py-4 rounded-lg text-base font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ 
                backgroundColor: '#FF6B00', 
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              Verify Authorization
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- PREMIUM CORPORATE CONTROL PANEL ---
  return (
    <div className="min-h-screen p-4 lg:p-8" style={{ backgroundColor: '#0A0A0A', fontFamily: '"Inter", "Montserrat", sans-serif' }}>
      
      {/* Dynamic Upper Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 mb-8" style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black m-0 tracking-tight text-white">
            Eye in the Sky <span className="text-base lg:text-lg font-medium ml-2 lg:ml-3" style={{ color: '#FF6B00' }}>— Master Admin Control</span>
          </h1>
          <p className="text-sm font-medium mt-2" style={{ color: '#666666' }}>Global Real-Time Activity Control & Ecosystem Health</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors hover:bg-[#1A1A1A]"
            style={{ 
              backgroundColor: '#111111', 
              border: '1px solid #222222',
              color: '#888888'
            }}
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors hover:bg-[#1A1A1A]"
            style={{ 
              backgroundColor: '#111111', 
              border: '1px solid #222222',
              color: '#888888'
            }}
          >
            <Lock className="size-3.5" />
            Lock
          </button>
          <button 
            onClick={handleClose} 
            className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-red-500/20"
            style={{ 
              backgroundColor: '#111111', 
              border: '1px solid #222222',
            }}
            title="Exit Dashboard"
          >
            <X className="size-4" style={{ color: '#888888' }} />
          </button>
        </div>
      </div>

      {/* === GLOBAL METRICS SUMMARY ROW === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Active Marketplace Volume */}
        <div 
          className="p-6 rounded-xl relative overflow-hidden"
          style={{ 
            backgroundColor: '#111111', 
            border: '1px solid #1A1A1A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #3B82F6, #60A5FA)' }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Activity className="size-5" style={{ color: '#3B82F6' }} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666666' }}>Active Marketplace Volume</p>
          </div>
          <p className="text-3xl font-black text-white">{formatCurrency(metrics.activeMarketplaceVolume)}</p>
          <p className="text-xs mt-2" style={{ color: '#444444' }}>Floating in active campaigns</p>
        </div>

        {/* Stripe Escrow Balance */}
        <div 
          className="p-6 rounded-xl relative overflow-hidden"
          style={{ 
            backgroundColor: '#111111', 
            border: '1px solid #1A1A1A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <Shield className="size-5" style={{ color: '#8B5CF6' }} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666666' }}>Stripe Escrow Balance</p>
          </div>
          <p className="text-3xl font-black text-white">{formatCurrency(metrics.stripeEscrowBalance)}</p>
          <p className="text-xs mt-2" style={{ color: '#444444' }}>Held in transit pre-payout</p>
        </div>

        {/* Bungee Corporate Revenue (25%) */}
        <div 
          className="p-6 rounded-xl relative overflow-hidden"
          style={{ 
            backgroundColor: '#111111', 
            border: '1px solid #1A1A1A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #FF6B00, #FF8C00)' }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)' }}>
              <TrendingUp className="size-5" style={{ color: '#FF6B00' }} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666666' }}>Corporate Revenue (25%)</p>
          </div>
          <p className="text-3xl font-black" style={{ color: '#FF6B00' }}>{formatCurrency(metrics.corporateRevenue)}</p>
          <p className="text-xs mt-2" style={{ color: '#444444' }}>Platform take-rate earnings</p>
        </div>

        {/* Total Active Nodes */}
        <div 
          className="p-6 rounded-xl relative overflow-hidden"
          style={{ 
            backgroundColor: '#111111', 
            border: '1px solid #1A1A1A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <Users className="size-5" style={{ color: '#10B981' }} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#666666' }}>Total Active Nodes</p>
          </div>
          <p className="text-3xl font-black text-white">{metrics.totalActiveNodes.toLocaleString()}</p>
          <p className="text-xs mt-2" style={{ color: '#444444' }}>Verified Merchants + Bungees</p>
        </div>
      </div>

      {/* === GLOBAL NETWORK PULSE - Real-Time Activity Stream === */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)' }}>
              <Zap className="size-5" style={{ color: '#FF6B00' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Global Network Pulse</h2>
              <p className="text-xs" style={{ color: '#666666' }}>Real-time cross-ecosystem activity</p>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              style={{ 
                backgroundColor: filter === 'all' ? '#FF6B00' : '#111111',
                color: filter === 'all' ? '#FFFFFF' : '#888888',
                border: filter === 'all' ? 'none' : '1px solid #222222'
              }}
            >
              ALL
            </button>
            <button 
              onClick={() => setFilter('business')} 
              className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: filter === 'business' ? '#FF6B00' : '#111111',
                color: filter === 'business' ? '#FFFFFF' : '#888888',
                border: filter === 'business' ? 'none' : '1px solid #222222'
              }}
            >
              <Building2 className="size-3.5" />
              MERCHANTS
            </button>
            <button 
              onClick={() => setFilter('bungee')} 
              className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: filter === 'bungee' ? '#FF6B00' : '#111111',
                color: filter === 'bungee' ? '#FFFFFF' : '#888888',
                border: filter === 'bungee' ? 'none' : '1px solid #222222'
              }}
            >
              <UserCheck className="size-3.5" />
              BUNGEES
            </button>
          </div>
        </div>

        <div 
          className="rounded-xl overflow-hidden"
          style={{ 
            backgroundColor: '#111111', 
            border: '1px solid #1A1A1A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0D0D0D' }}>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Type</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Entity</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Activity</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Volume</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Allocation</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Time</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((act) => {
                  const statusStyle = getStatusBadge(act.status)
                  return (
                    <tr key={act.id} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-[#151515] transition-colors">
                      <td className="px-5 py-4">
                        <span 
                          className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide"
                          style={{ 
                            backgroundColor: act.type === 'business' ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.05)',
                            color: act.type === 'business' ? '#FF6B00' : '#CCCCCC',
                            border: act.type === 'business' ? '1px solid rgba(255,107,0,0.2)' : '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          {act.type === 'business' ? 'MERCHANT' : 'BUNGEE'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-white">{act.target}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#999999' }}>{act.detail}</td>
                      <td className="px-5 py-4 font-bold font-mono" style={{ color: '#FF6B00' }}>{act.volume}</td>
                      <td className="px-5 py-4 text-xs font-mono" style={{ color: '#666666' }}>{act.allocation || '—'}</td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#555555' }}>{act.time}</td>
                      <td className="px-5 py-4">
                        <span 
                          className="px-3 py-1.5 rounded-md text-xs font-bold"
                          style={{ 
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`
                          }}
                        >
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y" style={{ borderColor: '#1A1A1A' }}>
            {filteredActivities.map((act) => {
              const statusStyle = getStatusBadge(act.status)
              return (
                <div key={act.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide"
                      style={{ 
                        backgroundColor: act.type === 'business' ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.05)',
                        color: act.type === 'business' ? '#FF6B00' : '#CCCCCC',
                        border: act.type === 'business' ? '1px solid rgba(255,107,0,0.2)' : '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {act.type === 'business' ? 'MERCHANT' : 'BUNGEE'}
                    </span>
                    <span 
                      className="px-3 py-1.5 rounded-md text-xs font-bold"
                      style={{ 
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`
                      }}
                    >
                      {act.status}
                    </span>
                  </div>
                  <p className="font-bold text-white">{act.target}</p>
                  <p className="text-sm" style={{ color: '#999999' }}>{act.detail}</p>
                  {act.allocation && (
                    <p className="text-xs font-mono" style={{ color: '#666666' }}>{act.allocation}</p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold font-mono" style={{ color: '#FF6B00' }}>{act.volume}</span>
                    <span className="text-xs" style={{ color: '#555555' }}>{act.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* === AI INTEGRITY & FRAUD CONTROL QUEUE === */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <AlertTriangle className="size-5" style={{ color: '#EF4444' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI System Guardrails & Exception Logs</h2>
            <p className="text-xs" style={{ color: '#666666' }}>Automated fraud detection & compliance queue</p>
          </div>
          <span 
            className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}
          >
            {flaggedItems.length} FLAGGED
          </span>
        </div>

        <div 
          className="rounded-xl overflow-hidden"
          style={{ 
            backgroundColor: '#111111', 
            border: '1px solid #1A1A1A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          {flaggedItems.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="size-12 mx-auto mb-4" style={{ color: '#10B981' }} />
              <p className="text-lg font-semibold text-white">All Clear</p>
              <p className="text-sm" style={{ color: '#666666' }}>No flagged accounts or submissions</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0D0D0D' }}>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Account</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Type</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Flag Reason</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Severity</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Trust Score</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Time</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: '#555555' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flaggedItems.map((item) => {
                      const severityStyle = getSeverityColor(item.severity)
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid #1A1A1A' }} className="hover:bg-[#151515] transition-colors">
                          <td className="px-5 py-4 font-semibold text-white font-mono">{item.accountName}</td>
                          <td className="px-5 py-4">
                            <span 
                              className="px-3 py-1.5 rounded-md text-xs font-bold uppercase"
                              style={{ 
                                backgroundColor: item.accountType === 'business' ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.05)',
                                color: item.accountType === 'business' ? '#FF6B00' : '#CCCCCC',
                              }}
                            >
                              {item.accountType}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: '#999999', maxWidth: '300px' }}>{item.flagReason}</td>
                          <td className="px-5 py-4">
                            <span 
                              className="px-3 py-1.5 rounded-md text-xs font-bold uppercase"
                              style={{ 
                                backgroundColor: severityStyle.bg,
                                color: severityStyle.text,
                                border: `1px solid ${severityStyle.border}`
                              }}
                            >
                              {item.severity}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span 
                              className="font-bold font-mono"
                              style={{ color: item.trustScore && item.trustScore < 30 ? '#EF4444' : item.trustScore && item.trustScore < 50 ? '#FBB024' : '#10B981' }}
                            >
                              {item.trustScore || '—'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: '#555555' }}>{item.timestamp}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleApproveOverride(item.id)}
                                className="px-3 py-2 rounded-lg text-xs font-bold transition-colors hover:opacity-80"
                                style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                              >
                                Approve Override
                              </button>
                              <button 
                                onClick={() => handleDeplatform(item.id)}
                                className="px-3 py-2 rounded-lg text-xs font-bold transition-colors hover:opacity-80"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                              >
                                De-platform
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y" style={{ borderColor: '#1A1A1A' }}>
                {flaggedItems.map((item) => {
                  const severityStyle = getSeverityColor(item.severity)
                  return (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white font-mono">{item.accountName}</span>
                        <span 
                          className="px-3 py-1.5 rounded-md text-xs font-bold uppercase"
                          style={{ 
                            backgroundColor: severityStyle.bg,
                            color: severityStyle.text,
                          }}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#999999' }}>{item.flagReason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: '#555555' }}>Trust Score: <span className="font-bold" style={{ color: item.trustScore && item.trustScore < 30 ? '#EF4444' : '#FBB024' }}>{item.trustScore || '—'}</span></span>
                        <span className="text-xs" style={{ color: '#555555' }}>{item.timestamp}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => handleApproveOverride(item.id)}
                          className="flex-1 py-2 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleDeplatform(item.id)}
                          className="flex-1 py-2 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}
                        >
                          De-platform
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
