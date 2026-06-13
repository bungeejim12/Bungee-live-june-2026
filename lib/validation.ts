// Bungee Validation & Reputation System
// Moves the platform from a "lead volume" model to a "quality-verified" model.
// Bungees are graded on conversion performance, not raw share count.

export type ReferralStatus = "pending" | "verified" | "disqualified"

export interface ValidatedReferral {
  id: string
  // Who/what was referred
  leadName: string
  businessName: string
  category: string
  channel: string // sms | email | link | map
  // Validation pipeline
  status: ReferralStatus
  submittedAt: string // ISO
  conversionDate: string | null // ISO, set when business marks Converted
  estimatedValue: number // potential payout for this lead
  flaggedForReview?: boolean // set by velocity check
}

export interface QualityScore {
  stars: number // 0–5, one decimal
  conversionRate: number // 0–100, verified / (verified + disqualified)
  verified: number
  pending: number
  disqualified: number
  total: number
  isVerifiedBungee: boolean // 4-star or higher with enough volume
}

// A Bungee needs a minimum number of decided (verified or disqualified) leads
// before a meaningful star rating is shown — prevents a single conversion = 5 stars.
const MIN_DECIDED_FOR_RATING = 3

/**
 * Quality Score is based on CONVERSIONS, not shares.
 * Stars are derived from the conversion rate of decided leads
 * (verified vs. disqualified). Pending leads do not yet count for or against.
 */
export function computeQualityScore(referrals: ValidatedReferral[]): QualityScore {
  const verified = referrals.filter((r) => r.status === "verified").length
  const pending = referrals.filter((r) => r.status === "pending").length
  const disqualified = referrals.filter((r) => r.status === "disqualified").length
  const total = referrals.length
  const decided = verified + disqualified

  const conversionRate = decided > 0 ? Math.round((verified / decided) * 100) : 0

  // Star rating: map conversion rate 0–100% onto 0–5 stars, rounded to 1 decimal.
  // Until the Bungee has enough decided leads, scale the rating by volume so new
  // accounts can't instantly hit 5 stars off one conversion.
  let stars = 0
  if (decided > 0) {
    const rawStars = (conversionRate / 100) * 5
    const volumeFactor = Math.min(decided / MIN_DECIDED_FOR_RATING, 1)
    stars = Math.round(rawStars * volumeFactor * 10) / 10
  }

  return {
    stars,
    conversionRate,
    verified,
    pending,
    disqualified,
    total,
    isVerifiedBungee: stars >= 4 && decided >= MIN_DECIDED_FOR_RATING,
  }
}

export interface VelocityResult {
  count: number // referrals submitted in the trailing window
  triggered: boolean // exceeded the threshold
  windowLabel: string
}

const VELOCITY_LIMIT = 3 // more than 3 in the window trips the check
const VELOCITY_WINDOW_MS = 60 * 60 * 1000 // 1 hour

/**
 * Spam / bot prevention. Counts how many referrals were submitted in the
 * trailing 1-hour window. If more than 3, the UI should warn the user and
 * route new submissions to manual review.
 */
export function checkVelocity(referrals: ValidatedReferral[], now: number = Date.now()): VelocityResult {
  const recent = referrals.filter((r) => {
    const t = new Date(r.submittedAt).getTime()
    return now - t <= VELOCITY_WINDOW_MS
  }).length

  return {
    count: recent,
    triggered: recent > VELOCITY_LIMIT,
    windowLabel: "1 hour",
  }
}

export function statusLabel(status: ReferralStatus): string {
  switch (status) {
    case "verified":
      return "Verified"
    case "disqualified":
      return "Disqualified"
    default:
      return "Pending"
  }
}

// Tailwind class helpers so the UI styling stays consistent everywhere.
export function statusClasses(status: ReferralStatus, isDarkMode = false): string {
  switch (status) {
    case "verified":
      return isDarkMode
        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
        : "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "disqualified":
      return isDarkMode
        ? "bg-red-500/15 text-red-400 border-red-500/30"
        : "bg-red-50 text-red-700 border-red-200"
    default:
      return isDarkMode
        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
        : "bg-amber-50 text-amber-700 border-amber-200"
  }
}

function isoMinutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60 * 1000).toISOString()
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

// Demo dataset used when the dashboard is in demo mode. Mix of statuses so the
// Quality Score, trust widget, and table all render meaningfully.
export const demoValidatedReferrals: ValidatedReferral[] = [
  {
    id: "vr-1",
    leadName: "Marcus Pena",
    businessName: "Elite HVAC Services",
    category: "HVAC",
    channel: "sms",
    status: "verified",
    submittedAt: isoDaysAgo(14),
    conversionDate: isoDaysAgo(9),
    estimatedValue: 500,
  },
  {
    id: "vr-2",
    leadName: "Sofia Reyes",
    businessName: "BrightSmile Dental",
    category: "Healthcare",
    channel: "email",
    status: "verified",
    submittedAt: isoDaysAgo(11),
    conversionDate: isoDaysAgo(7),
    estimatedValue: 350,
  },
  {
    id: "vr-3",
    leadName: "Derek Nguyen",
    businessName: "Apex Auto Repair",
    category: "Automotive",
    channel: "link",
    status: "verified",
    submittedAt: isoDaysAgo(8),
    conversionDate: isoDaysAgo(5),
    estimatedValue: 250,
  },
  {
    id: "vr-4",
    leadName: "Tasha Bell",
    businessName: "GreenLeaf Landscaping",
    category: "Home Services",
    channel: "map",
    status: "pending",
    submittedAt: isoDaysAgo(2),
    conversionDate: null,
    estimatedValue: 400,
  },
  {
    id: "vr-5",
    leadName: "Omar Haddad",
    businessName: "City Fitness Club",
    category: "Fitness",
    channel: "sms",
    status: "pending",
    submittedAt: isoDaysAgo(1),
    conversionDate: null,
    estimatedValue: 150,
  },
  {
    id: "vr-6",
    leadName: "Priya Malhotra",
    businessName: "QuickFix Plumbing",
    category: "Home Services",
    channel: "email",
    status: "disqualified",
    submittedAt: isoDaysAgo(6),
    conversionDate: null,
    estimatedValue: 300,
  },
]

// Demo dataset for the business owner's inbound leads (Business dashboard).
export const demoIncomingLeads: ValidatedReferral[] = [
  {
    id: "lead-1",
    leadName: "Jennifer Wu",
    businessName: "Referred by Alex Carter",
    category: "New Customer",
    channel: "sms",
    status: "pending",
    submittedAt: isoMinutesAgo(45),
    conversionDate: null,
    estimatedValue: 500,
  },
  {
    id: "lead-2",
    leadName: "Robert Ellis",
    businessName: "Referred by Maria Lopez",
    category: "New Customer",
    channel: "link",
    status: "pending",
    submittedAt: isoDaysAgo(1),
    conversionDate: null,
    estimatedValue: 350,
  },
  {
    id: "lead-3",
    leadName: "Chen Wei",
    businessName: "Referred by Alex Carter",
    category: "New Customer",
    channel: "email",
    status: "verified",
    submittedAt: isoDaysAgo(4),
    conversionDate: isoDaysAgo(2),
    estimatedValue: 250,
  },
  {
    id: "lead-4",
    leadName: "Unknown / No Contact",
    businessName: "Referred by Sam Diaz",
    category: "New Customer",
    channel: "link",
    status: "pending",
    submittedAt: isoDaysAgo(2),
    conversionDate: null,
    estimatedValue: 100,
  },
]

export function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}
