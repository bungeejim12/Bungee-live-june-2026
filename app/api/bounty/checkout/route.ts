import { NextRequest, NextResponse } from 'next/server'

// ============================================
// BOUNTY SPLIT CALCULATION
// ============================================
interface BountySplit {
  totalBounty: number
  bungeeShare: number      // 75% to Bungee referrer
  corporateShare: number   // 25% platform fee
}

function calculateBountySplit(totalAmount: number): BountySplit {
  const bungeeShare = totalAmount * 0.75
  const corporateShare = totalAmount * 0.25
  
  return {
    totalBounty: totalAmount,
    bungeeShare: Math.round(bungeeShare * 100) / 100,
    corporateShare: Math.round(corporateShare * 100) / 100
  }
}

// ============================================
// STRIPE CONNECT CHECKOUT SESSION
// ============================================
export async function POST(request: NextRequest) {
  try {
    const { 
      totalAmount, 
      bungeeConnectedAccountId, 
      bountyDescription, 
      businessName,
      successUrl,
      cancelUrl 
    } = await request.json()

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid bounty amount' },
        { status: 400 }
      )
    }

    const split = calculateBountySplit(totalAmount)
    
    // Convert to cents for Stripe
    const amountInCents = Math.round(split.totalBounty * 100)
    const applicationFeeInCents = Math.round(split.corporateShare * 100)

    // Log the split for verification
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎯 BOUNTY SPLIT CALCULATION (Server)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`💰 Total Bounty: $${split.totalBounty.toFixed(2)}`)
    console.log(`👤 Bungee Share (75%): $${split.bungeeShare.toFixed(2)}`)
    console.log(`🏢 Platform Fee (25%): $${split.corporateShare.toFixed(2)}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (stripeSecretKey) {
      // PRODUCTION: Create real Stripe checkout session
      const stripe = require('stripe')(stripeSecretKey)
      
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Bounty Reward: ${bountyDescription || 'Referral Bounty'}`,
                description: `Referral bounty from ${businessName || 'Business'}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          // 25% retained by platform as application fee
          application_fee_amount: applicationFeeInCents,
          // 75% transferred to Bungee referrer's connected account
          transfer_data: {
            destination: bungeeConnectedAccountId,
          },
        },
        success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/business?bounty_success=true`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/business?bounty_cancelled=true`,
      })

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        sessionUrl: session.url,
        split: {
          totalBounty: split.totalBounty,
          bungeeShare: split.bungeeShare,
          corporateShare: split.corporateShare,
        }
      })
    } else {
      // MOCK MODE: Return simulated successful checkout
      console.log('⚠️ Stripe not configured - returning mock response')
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return NextResponse.json({
        success: true,
        mock: true,
        message: 'Mock checkout session created (Stripe not configured)',
        sessionId: `mock_session_${Date.now()}`,
        sessionUrl: null,
        split: {
          totalBounty: split.totalBounty,
          bungeeShare: split.bungeeShare,
          corporateShare: split.corporateShare,
        },
        stripePayload: {
          mode: 'payment',
          amount: amountInCents,
          application_fee_amount: applicationFeeInCents,
          transfer_destination: bungeeConnectedAccountId || 'acct_mock_bungee_123',
        }
      })
    }
  } catch (error) {
    console.error('Bounty checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
