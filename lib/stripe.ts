import "server-only"

import Stripe from "stripe"

// Stripe is used ONLY to move money (Connect transfers + reversals).
// All commission math and the 18-month timeline live in lib/commission-engine.ts.
//
// Lazily instantiated so importing this module never throws at load time when
// STRIPE_SECRET_KEY isn't present in the runtime env. The key is read on first
// use instead, and callers that never move money never need it.
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  _stripe = new Stripe(key)
  return _stripe
}

/** True when a Stripe secret key is available in the runtime environment. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
