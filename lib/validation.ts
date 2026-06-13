// Bungee Validation & Reputation System
// Moves the platform from a "lead volume" model to a "quality-verified" model.
// Bungees are graded on conversion performance, not raw share count.

export type ReferralStatus = "pending" | "verified" | "disqualified"

// Cord rank colors map 1:1 to the platform's rank ladder (see bungee-cord-icon.tsx).
export type ReferrerCord =
  | "green"
  | "pink"
  | "blue"
  | "purple"
  | "red"
  | "burgundy"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "orange"

// The referring Bungee attached to a lead — their avatar + rank travel with the referral.
export interface Referrer {
  name: string
  cord: ReferrerCord
  rankName: string
  level: number
  avatarUrl?: string // optional photo; falls back to cord-colored initials
}

export interface ValidatedReferral {
  id: string
  // Who/what was referred
  leadName: string
  businessName: string
  category: string
  channel: string // sms | email | link | map
  // The Bungee who brought this lead in
  referrer: Referrer
  // Validation pipeline
  status: ReferralStatus
  submittedAt: string // ISO
  conversionDate: string | null // ISO, set when business marks Converted
  estimatedValue: number // potential payout for this lead
  flaggedForReview?: boolean // set by velocity check
}

// Rank name for each cord, matching the ranking ladder shown on the Bungee dashboard.
export const CORD_RANK_NAME: Record<ReferrerCord, string> = {
  green: "NewBe",
  pink: "Rookie",
  blue: "Rising",
  purple: "Active",
  red: "Trusted",
  burgundy: "Expert",
  bronze: "Elite",
  silver: "Champion",
  gold: "Master",
  platinum: "Legend",
  orange: "Apex",
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
    referrer: { name: "Alex Carter", cord: "gold", rankName: "Master", level: 9 },
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
    referrer: { name: "Maria Lopez", cord: "silver", rankName: "Champion", level: 8 },
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
    referrer: { name: "Alex Carter", cord: "gold", rankName: "Master", level: 9 },
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
    referrer: { name: "Jordan Kim", cord: "blue", rankName: "Rising", level: 3 },
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
    referrer: { name: "Jordan Kim", cord: "blue", rankName: "Rising", level: 3 },
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
    referrer: { name: "Sam Diaz", cord: "pink", rankName: "Rookie", level: 2 },
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
    referrer: { name: "Alex Carter", cord: "gold", rankName: "Master", level: 9 },
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
    referrer: { name: "Maria Lopez", cord: "silver", rankName: "Champion", level: 8 },
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
    referrer: { name: "Alex Carter", cord: "gold", rankName: "Master", level: 9 },
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
    referrer: { name: "Sam Diaz", cord: "pink", rankName: "Rookie", level: 2 },
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

// Ordered cord ladder (lowest → highest) so a level maps to a rank consistently.
const CORD_LADDER: ReferrerCord[] = [
  "green",
  "pink",
  "blue",
  "purple",
  "red",
  "burgundy",
  "bronze",
  "silver",
  "gold",
  "platinum",
  "orange",
]

function stableHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Derive a stable Bungee identity (cord rank + level) from a referrer's name.
 * Used to attach an avatar + ranking to legacy activity rows that only store a name.
 * The same name always yields the same rank, so the UI stays consistent.
 */
export function getReferrerFromName(name: string): Referrer {
  const h = stableHash(name)
  const cordIndex = h % CORD_LADDER.length
  const cord = CORD_LADDER[cordIndex]
  // Level scales with rank position, with a little per-name variation.
  const level = cordIndex + 1 + (h % 3)
  return {
    name,
    cord,
    rankName: CORD_RANK_NAME[cord],
    level,
  }
}
