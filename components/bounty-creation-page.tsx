"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Users, 
  Building2, 
  CheckCircle2, 
  Loader2, 
  CreditCard,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Mail,
  Copy,
  Check,
  Share2,
  MessageSquare
} from 'lucide-react'

// ============================================
// BOUNTY SPLIT CALCULATION UTILITY
// ============================================
interface BountySplit {
  totalBounty: number
  bungeeShare: number      // 75% to Bungee referrer
  corporateShare: number   // 25% platform fee
}

export function calculateBountySplit(totalAmount: number): BountySplit {
  const bungeeShare = totalAmount * 0.75
  const corporateShare = totalAmount * 0.25
  
  return {
    totalBounty: totalAmount,
    bungeeShare: Math.round(bungeeShare * 100) / 100,      // Round to 2 decimal places
    corporateShare: Math.round(corporateShare * 100) / 100
  }
}

// ============================================
// STRIPE CONNECT MOCK CHECKOUT SESSION BUILDER
// ============================================
interface StripeCheckoutConfig {
  totalAmount: number
  bungeeConnectedAccountId: string
  bountyDescription: string
  businessName: string
}

export function buildStripeConnectCheckoutPayload(config: StripeCheckoutConfig) {
  const split = calculateBountySplit(config.totalAmount)
  
  // Stripe uses cents, so multiply by 100
  const amountInCents = Math.round(split.totalBounty * 100)
  const bungeeShareInCents = Math.round(split.bungeeShare * 100)
  const applicationFeeInCents = Math.round(split.corporateShare * 100)
  
  return {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Bounty Reward: ${config.bountyDescription}`,
            description: `Referral bounty from ${config.businessName}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      // Application fee retained by platform (25%)
      application_fee_amount: applicationFeeInCents,
      // Transfer destination for Bungee referrer (75%)
      transfer_data: {
        destination: config.bungeeConnectedAccountId,
      },
    },
    success_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/business?bounty_success=true`,
    cancel_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard/business?bounty_cancelled=true`,
  }
}

// ============================================
// BOUNTY CREATION PAGE COMPONENT
// ============================================
interface BountyCreationPageProps {
  onClose?: () => void
  onSuccess?: (bountyData: BountySplit) => void
  isDarkMode?: boolean
  businessName?: string
}

export default function BountyCreationPage({ onClose, onSuccess, isDarkMode = false, businessName = 'Your Business' }: BountyCreationPageProps) {
  const [bountyAmount, setBountyAmount] = useState<string>('')
  const [bountyDescription, setBountyDescription] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [split, setSplit] = useState<BountySplit>({ totalBounty: 0, bungeeShare: 0, corporateShare: 0 })
  const [isCopied, setIsCopied] = useState(false)
  const [campaignUrl, setCampaignUrl] = useState<string>('')

  // Update split calculation when amount changes
  useEffect(() => {
    const amount = parseFloat(bountyAmount) || 0
    setSplit(calculateBountySplit(amount))
  }, [bountyAmount])

  // Format currency display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Build native mailto link with bounty data
  const buildMailtoLink = () => {
    const subject = `Help us find our next hire (Earn a ${formatCurrency(split.totalBounty)} Reward!)`
    
    const body = `Hi team,

We just launched a new referral campaign on Bungee! If you know anyone who would be a perfect fit for our team, please share this link with them. If they get hired, you will earn a ${formatCurrency(split.bungeeShare)} cash bounty reward directly!

View details and refer candidates here: ${campaignUrl}

Best regards,
${businessName}`

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  // Copy campaign link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Build native SMS link with anti-spam high-trust message
  const buildSmsLink = () => {
    const smsBody = `Hello, this is the Manager at ${businessName}. We just launched a cash referral bounty on Bungee 🟠—a platform that lets our team safely earn payouts for connecting us with great talent. We're offering a ${formatCurrency(split.bungeeShare)} reward if your referral gets successfully hired! Don't visit the site blindly or think this is random phone spam—here is our official, verified Bungee portal where you can securely view the role and submit a contact to claim the bounty: ${campaignUrl}`
    
    return `sms:?body=${encodeURIComponent(smsBody)}`
  }

  // Mock Stripe checkout handler
  const handleCreateBounty = async () => {
    if (!bountyAmount || parseFloat(bountyAmount) <= 0) return
    
    setIsProcessing(true)
    
    // Build the Stripe Connect checkout payload
    const checkoutPayload = buildStripeConnectCheckoutPayload({
      totalAmount: parseFloat(bountyAmount),
      bungeeConnectedAccountId: 'acct_mock_bungee_user_123', // Mock connected account
      bountyDescription: bountyDescription || 'Referral Bounty',
      businessName: businessName,
    })
    
    // Log the split values for verification
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('BOUNTY SPLIT CALCULATION VERIFIED')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Total Bounty Amount: ${formatCurrency(split.totalBounty)}`)
    console.log(`Bungee Referrer Allocation (75%): ${formatCurrency(split.bungeeShare)}`)
    console.log(`Platform Infrastructure Fee (25%): ${formatCurrency(split.corporateShare)}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Stripe Checkout Payload:', JSON.stringify(checkoutPayload, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate Stripe checkout processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate campaign tracking URL
    const bountyId = `bounty_${Date.now()}`
    const generatedUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/refer/${bountyId}`
    setCampaignUrl(generatedUrl)
    
    // Mock successful completion
    setIsProcessing(false)
    setIsSuccess(true)
    
    // Trigger success callback
    if (onSuccess) {
      onSuccess(split)
    }
  }

  // Success state - Broadcast to Network sharing modal
  if (isSuccess) {
    return (
      <Card className={`w-full max-w-lg mx-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-xl`}>
        <CardContent className="pt-8 pb-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Bounty is Live!
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Now share it with your network to start receiving referrals.
            </p>
          </div>
          
          {/* Split Summary */}
          <div className={`rounded-xl p-5 mb-6 ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Bounty</span>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(split.totalBounty)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Referrer Payout (75%)</span>
                <span className={`font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {formatCurrency(split.bungeeShare)}
                </span>
              </div>
            </div>
          </div>

          {/* Broadcast to Network Section */}
          <div className={`rounded-xl p-6 shadow-md ${isDarkMode ? 'bg-gray-700/30 border border-gray-600' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-5">
              <Share2 className="h-5 w-5 text-[#FF8C00]" />
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Broadcast to Network
              </span>
            </div>

            <div className="space-y-4">
              {/* Primary Email Share Button */}
              <a
                href={buildMailtoLink()}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-lg bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-base transition-colors shadow-sm"
              >
                <Mail className="h-5 w-5" />
                Share with Email List
              </a>
              
              {/* Helper Text for Email */}
              <p className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                This opens your email app. Just paste your contact list into the BCC line to send!
              </p>

              {/* Secondary SMS / Text Message Button */}
              <a
                href={buildSmsLink()}
                className={`flex items-center justify-center gap-3 w-full py-4 px-6 rounded-lg border-2 font-semibold text-base transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-500 text-gray-200 hover:border-gray-400 hover:bg-gray-700' 
                    : 'bg-white border-gray-400 text-gray-800 hover:border-gray-500 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                Text Message to My Team
              </a>
              
              {/* Helper Text for SMS */}
              <p className={`text-center text-xs italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                This opens your mobile phone&apos;s messaging app. Simply select your contacts or team threads and hit send!
              </p>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-3 w-full py-3 px-6 rounded-lg border font-medium transition-all ${
                  isCopied 
                    ? isDarkMode 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                      : 'bg-emerald-50 border-emerald-500 text-emerald-600'
                    : isDarkMode 
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700/50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-5 w-5" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Copy Campaign Link
                  </>
                )}
              </button>

              {/* Campaign URL Display */}
              <div className={`p-3 rounded-lg text-xs font-mono truncate ${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
                {campaignUrl}
              </div>
            </div>
          </div>

          {/* Done Button */}
          <Button 
            onClick={onClose} 
            variant="ghost"
            className={`w-full mt-6 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Done
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full max-w-lg mx-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#FF8C00]/20' : 'bg-[#FF8C00]/10'}`}>
            <DollarSign className="h-6 w-6 text-[#FF8C00]" />
          </div>
          <div>
            <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create Bounty Reward
            </CardTitle>
            <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Set up your referral reward with Stripe Connect
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Bounty Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="bounty-amount" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            Total Bounty Reward
          </Label>
          <div className="relative">
            <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <Input
              id="bounty-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="100.00"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
              className={`pl-10 text-lg h-12 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>

        {/* Dynamic Split Breakdown Card */}
        <div className={`rounded-xl p-5 space-y-4 transition-all ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#FF8C00]" />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Payment Split Preview
            </span>
          </div>
          
          {/* Bungee Referrer Allocation */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <Users className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  Bungee Referrer Allocation
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-emerald-400/70' : 'text-emerald-600'}`}>
                  75% of bounty
                </p>
              </div>
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {formatCurrency(split.bungeeShare)}
            </span>
          </div>
          
          {/* Platform Infrastructure Fee */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-600/50 border border-gray-500/30' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-500/30' : 'bg-gray-100'}`}>
                <Building2 className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Platform Infrastructure Fee
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  25% platform fee
                </p>
              </div>
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatCurrency(split.corporateShare)}
            </span>
          </div>
          
          {/* Total Line */}
          <div className={`flex items-center justify-between pt-3 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Charge
            </span>
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(split.totalBounty)}
            </span>
          </div>
        </div>

        {/* Stripe Connect Badge */}
        <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
          <Shield className="h-4 w-4 text-blue-500" />
          <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Secured by Stripe Connect
          </span>
          <CreditCard className="h-4 w-4 text-blue-500" />
        </div>

        {/* Benefits List */}
        <div className={`space-y-2 pt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center gap-2 text-xs">
            <Zap className="h-3.5 w-3.5 text-[#FF8C00]" />
            <span>Instant payouts to Bungee referrers</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-[#FF8C00]" />
            <span>Track all bounty performance in your dashboard</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-3 pt-2">
        {onClose && (
          <Button 
            variant="outline" 
            onClick={onClose}
            className={`flex-1 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
          >
            Cancel
          </Button>
        )}
        <Button 
          onClick={handleCreateBounty}
          disabled={!bountyAmount || parseFloat(bountyAmount) <= 0 || isProcessing}
          className="flex-1 bg-[#FF8C00] hover:bg-[#E67E00] text-white gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Create Bounty
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
