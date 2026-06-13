"use client"

import { BungeeCordIcon, CORD_COLORS } from "@/components/bungee-cord-icon"
import type { Referrer } from "@/lib/validation"

interface ReferrerBadgeProps {
  referrer: Referrer
  // "compact" = avatar + name + small rank chip (used in lists)
  // "stacked" = avatar with name/rank below (used in detail spots)
  variant?: "compact" | "stacked"
  isDarkMode?: boolean
}

// Shows the Bungee who brought a lead in: their avatar ringed in their cord
// rank color, plus a rank chip showing cord rank + level.
export function ReferrerBadge({ referrer, variant = "compact", isDarkMode = false }: ReferrerBadgeProps) {
  const cordColor = CORD_COLORS[referrer.cord]
  const initials = referrer.name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")

  const Avatar = (
    <div className="relative shrink-0">
      <div
        className="size-9 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden"
        style={{
          backgroundColor: `${cordColor}22`,
          color: cordColor,
          boxShadow: `0 0 0 2px ${cordColor}`,
        }}
      >
        {referrer.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={referrer.avatarUrl || "/placeholder.svg"} alt={referrer.name} className="size-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {/* Cord rank emblem pinned to the avatar */}
      <span
        className="absolute -bottom-1 -right-1 rounded-full p-0.5 flex items-center justify-center"
        style={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff" }}
      >
        <BungeeCordIcon color={cordColor} size={9} />
      </span>
    </div>
  )

  if (variant === "stacked") {
    return (
      <div className="flex flex-col items-center text-center gap-1">
        {Avatar}
        <div>
          <p className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{referrer.name}</p>
          <span
            className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${cordColor}1f`, color: cordColor }}
          >
            {referrer.rankName} · Lvl {referrer.level}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {Avatar}
      <div className="min-w-0">
        <p className={`text-xs font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {referrer.name}
        </p>
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: `${cordColor}1f`, color: cordColor }}
        >
          {referrer.cord.charAt(0).toUpperCase() + referrer.cord.slice(1)} Cord · {referrer.rankName} · Lvl{" "}
          {referrer.level}
        </span>
      </div>
    </div>
  )
}
