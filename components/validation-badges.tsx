"use client"

import { Star, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number // 0–5, supports decimals (half stars)
  size?: number
  className?: string
}

// Renders a 0–5 star rating with support for fractional fill.
export function StarRating({ rating, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) // 0..1 for this star
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-amber-400 fill-amber-400" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface VerifiedBungeeBadgeProps {
  className?: string
  size?: "sm" | "md"
}

// "Verified Bungee" badge — shown for 4-star+ partners.
export function VerifiedBungeeBadge({ className, size = "md" }: VerifiedBungeeBadgeProps) {
  const isSm = size === "sm"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white shadow-sm",
        isSm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      <ShieldCheck className={isSm ? "size-3" : "size-3.5"} />
      Verified Bungee
    </span>
  )
}
