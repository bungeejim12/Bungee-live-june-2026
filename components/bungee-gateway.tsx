"use client"

import React, { useState } from 'react'
import { X, Shield, CheckCircle2, Lock, Zap, Users, DollarSign, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function BungeeGateway() {
  // Core System States
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authStep, setAuthStep] = useState(1)
  
  // Form Inputs
  const [emailInput, setEmailInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  
  // Current Verified Session Data
  const [currentPassport, setCurrentPassport] = useState<{
    email: string
    phone: string
    passportID: string
    verifiedAt: string
  } | null>(null)
  
  // Mock Real-Time User Referral Tracking Stats
  const [trackedUserStats] = useState({
    referralsMade: 4,
    pendingConnections: 2,
    totalRevenueEarned: 481.00,
    theSnapPayouts: 2,
    history: [
      { id: 101, type: 'Service Referral', description: 'Referred Apex Roofing to Neighbor', payout: '$120.00', status: 'Settled' },
      { id: 102, type: 'Talent Sourcing', description: 'Referred Professional Recruiter to Open Umbrella Role', payout: '$361.00', status: 'Paid' },
      { id: 103, type: 'Local Service', description: 'Referred Coastal Landscaping to Office Complex', payout: 'Processing', status: 'Pending' }
    ]
  })

  // Handle Authentication Logic
  const handleInitiateAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput || !phoneInput) {
      alert("Please enter both your Email and Phone Number to request secure access.")
      return
    }
    setAuthStep(2)
  }

  const handleVerifyPassport = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode === "777" || verificationCode.length >= 3) {
      const generatedPassportID = `BUNGEE-PASS-${btoa(emailInput).substring(0, 8).toUpperCase()}`
      
      setCurrentPassport({
        email: emailInput,
        phone: phoneInput,
        passportID: generatedPassportID,
        verifiedAt: new Date().toLocaleTimeString()
      })
      
      setIsLoggedIn(true)
      setShowAuthModal(false)
      setAuthStep(1)
    } else {
      alert("Verification check failed. Enter testing code '777' to bypass smoothly.")
    }
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    setCurrentPassport(null)
    setEmailInput('')
    setPhoneInput('')
    setVerificationCode('')
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6 md:p-8">
      
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            BUNGEE <span className="text-[#FF6B00] text-base md:text-lg font-bold tracking-wide ml-2">{'"'}I GOTTA GUY!{'"'}</span>
          </h1>
        </div>
        
        <div>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Passport Active</span>
                <span className="text-sm text-[#FF6B00] font-bold font-mono">{currentPassport?.passportID}</span>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="border-[#333] bg-[#1A1A1A] text-white hover:bg-[#252525] text-xs font-bold uppercase tracking-wide"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:inline">[ Free Version / Guest Look ]</span>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold uppercase text-xs tracking-wide"
              >
                Access My Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={`grid gap-8 ${isLoggedIn ? 'lg:grid-cols-[2fr_1fr]' : 'grid-cols-1'}`}>
        
        {/* LEFT COLUMN: Primary User Console */}
        <div className="space-y-6">
          
          {/* Welcome Header */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
            <h2 className="text-xl md:text-2xl font-black mb-2">
              {isLoggedIn ? `Welcome Back, ${currentPassport?.email}` : "Ecosystem Gateway"}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isLoggedIn 
                ? "Your corporate node passport session is active. You are fully authorized to execute referrals, request professional recruiter tracking metrics, and collect 'The Snap' rewards." 
                : "You are currently exploring the open, baseline presentation structure of the system. To view real dashboard metrics, track pending balances, or execute trusted handoffs into local services (Roofers, Landscapers, Pest Control), initialize a secure verification passport above."}
            </p>
          </div>

          {/* Metric Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1A1A1A] p-5 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="size-4 text-gray-500" />
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Total Earnings Tracked</p>
              </div>
              <p className={`text-3xl font-black ${isLoggedIn ? 'text-[#FF6B00]' : 'text-[#444]'}`}>
                {isLoggedIn ? `$${trackedUserStats.totalRevenueEarned.toFixed(2)}` : "$0.00"}
              </p>
              {!isLoggedIn && <Badge variant="outline" className="mt-2 text-[10px] border-[#333] text-gray-500">LOCKED</Badge>}
            </div>
            
            <div className="bg-[#1A1A1A] p-5 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-4 text-gray-500" />
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Referrals Verified</p>
              </div>
              <p className={`text-3xl font-black ${isLoggedIn ? 'text-white' : 'text-[#444]'}`}>
                {isLoggedIn ? trackedUserStats.referralsMade : "0"}
              </p>
            </div>
            
            <div className="bg-[#1A1A1A] p-5 rounded-lg border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="size-4 text-gray-500" />
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Active {'"'}The Snap{'"'} Bounties</p>
              </div>
              <p className={`text-3xl font-black ${isLoggedIn ? 'text-white' : 'text-[#444]'}`}>
                {isLoggedIn ? trackedUserStats.pendingConnections : "0"}
              </p>
            </div>
          </div>

          {/* Historical Transaction Feed */}
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 relative">
            <h3 className="text-sm font-black uppercase tracking-wide mb-5">Your Ecosystem Tracker Feed</h3>
            
            <div className={`transition-all duration-300 ${isLoggedIn ? '' : 'blur-sm opacity-25'}`}>
              {trackedUserStats.history.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-[#262626] last:border-0">
                  <div>
                    <p className="font-bold text-sm mb-1">{item.description}</p>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#FF6B00] font-mono">{item.payout}</p>
                    <span className={`text-[10px] ${item.status === 'Paid' || item.status === 'Settled' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      ● {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {!isLoggedIn && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  className="border-[#FF6B00] bg-[#121212] text-[#FF6B00] hover:bg-[#FF6B00]/10 font-bold uppercase text-xs tracking-wide"
                >
                  <Lock className="size-4 mr-2" />
                  Verify Passcode To Unlock Live Tracking Feed
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Session Passport (Only when authenticated) */}
        {isLoggedIn && (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 h-fit">
            <h3 className="text-sm font-black text-[#FF6B00] uppercase tracking-widest mb-5">Session Passport Brief</h3>
            
            <div className="space-y-5 text-sm">
              <div>
                <span className="block text-[10px] text-gray-600 font-bold uppercase tracking-wide mb-1">Authenticated Owner</span>
                <span className="font-semibold">{currentPassport?.email}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-600 font-bold uppercase tracking-wide mb-1">Secure Mobile Anchor</span>
                <span className="font-mono text-gray-300">{currentPassport?.phone}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-600 font-bold uppercase tracking-wide mb-1">Session Created At</span>
                <span className="text-gray-400">{currentPassport?.verifiedAt}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-[#262626] text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Secure Dual-Gate Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-[#2A2A2A] w-full max-w-md relative">
            <button 
              onClick={() => { setShowAuthModal(false); setAuthStep(1) }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-[#FF6B00] mb-1">BUNGEE</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[3px]">Secure Two-Part Gateway Initialization</p>
            </div>

            {authStep === 1 ? (
              <form onSubmit={handleInitiateAuth} className="space-y-5">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-2">Corporate Email Address</label>
                  <Input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="bg-[#121212] border-[#333] text-white placeholder:text-gray-600 focus:border-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-2">Mobile Telephone Number</label>
                  <Input 
                    type="tel" 
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="bg-[#121212] border-[#333] text-white placeholder:text-gray-600 focus:border-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold uppercase tracking-wide py-6"
                >
                  Request Verification Code
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPassport} className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-5">
                    We sent a temporary verification pass token to your phone and to <strong className="text-white">{emailInput}</strong>.
                  </p>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">Enter Secure 3-Digit Token</label>
                  <Input 
                    type="text" 
                    required
                    maxLength={6}
                    placeholder="000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-32 mx-auto bg-[#121212] border-[#FF6B00] text-white text-xl font-bold tracking-[6px] text-center focus:ring-[#FF6B00]"
                  />
                  <span className="block text-gray-600 text-[10px] mt-3">Test Sandbox Mode: Enter any 3 numbers to pass</span>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#121212] font-bold uppercase tracking-wide py-6"
                >
                  <Shield className="size-4 mr-2" />
                  Verify & Activate Passport
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
