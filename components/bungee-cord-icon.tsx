"use client"

import { cn } from "@/lib/utils"

interface BungeeCordIconProps {
  className?: string
  color?: string
  size?: number | string
}

// The Bungee Cord logo - a wavy cord shape matching the brand logo
export function BungeeCordIcon({ 
  className, 
  color = "#FF8C00", 
  size = 24 
}: BungeeCordIconProps) {
  return (
    <svg 
      viewBox="0 0 40 80" 
      fill="none" 
      width={size} 
      height={typeof size === 'number' ? size * 2 : size}
      className={cn("flex-shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wavy bungee cord path matching the logo */}
      <path
        d="M20 4
           C20 4 28 8 26 14
           C24 20 14 18 16 26
           C18 34 30 30 28 40
           C26 50 12 48 14 58
           C16 68 22 72 20 76"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// Cord rank colors matching each level - adjusted for visibility on black backgrounds
export const CORD_COLORS = {
  green: "#10b981",      // Green Cord - NewBe
  pink: "#ec4899",       // Pink Cord - Rookie (hot pink for visibility)
  blue: "#3b82f6",       // Blue Cord - Rising
  purple: "#a855f7",     // Purple Cord - Active (brighter purple)
  red: "#ef4444",        // Red Cord - Trusted
  burgundy: "#9f1239",   // Burgundy Cord - Expert (deep wine red)
  bronze: "#d97706",     // Bronze Cord - Elite (brighter bronze)
  silver: "#cbd5e1",     // Silver Cord - Champion (brighter silver)
  gold: "#facc15",       // Gold Cord - Master (brighter gold)
  platinum: "#e2e8f0",   // Platinum Cord - Legend (bright platinum)
  orange: "#FF8C00",     // Bungee Orange - Apex
} as const

export type CordColor = keyof typeof CORD_COLORS

// Helper to get cord color by rank level
export function getCordColorByLevel(level: number): string {
  const colors = Object.values(CORD_COLORS)
  const index = Math.min(level - 1, colors.length - 1)
  return colors[Math.max(0, index)]
}

// Cord rank badge component with icon
export function CordRankBadge({ 
  cordColor, 
  isLocked = false,
  size = 20,
  showGlow = false,
  className
}: { 
  cordColor: CordColor
  isLocked?: boolean
  size?: number
  showGlow?: boolean
  className?: string
}) {
  const color = CORD_COLORS[cordColor]
  
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full",
        showGlow && !isLocked && "shadow-lg",
        className
      )}
      style={{
        width: size * 2,
        height: size * 2,
        backgroundColor: isLocked ? `${color}20` : `${color}30`,
        boxShadow: showGlow && !isLocked ? `0 4px 14px ${color}40` : undefined
      }}
    >
      <BungeeCordIcon 
        color={isLocked ? `${color}50` : color} 
        size={size} 
      />
    </div>
  )
}
