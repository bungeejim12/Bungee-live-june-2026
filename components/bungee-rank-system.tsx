"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Star, Trophy, Crown, Flame, Shield, Target, Award, TrendingUp, Lock, X } from "lucide-react"

// 12-Level Bungee Cord Ranking System
// Starting from Green (Starter) and progressing to Orange (brand color = highest rank)
export const BUNGEE_RANKS = [
  {
    level: 1,
    name: "Green Cord",
    title: "Starter",
    color: "#22C55E",
    bgGradient: "from-green-500 to-green-400",
    borderColor: "border-green-500",
    textColor: "text-green-500",
    glowColor: "shadow-green-500/50",
    xpRequired: 0,
    xpToNext: 500,
    perks: ["Access to basic referrals", "Community forum access"],
    icon: Zap,
  },
  {
    level: 2,
    name: "Gray Cord",
    title: "Rookie",
    color: "#6B7280",
    bgGradient: "from-gray-500 to-gray-400",
    borderColor: "border-gray-500",
    textColor: "text-gray-400",
    glowColor: "shadow-gray-500/50",
    xpRequired: 500,
    xpToNext: 1200,
    perks: ["5% bonus on bounties", "Early access to new jobs"],
    icon: Star,
  },
  {
    level: 3,
    name: "Cyan Cord",
    title: "Rising",
    color: "#06B6D4",
    bgGradient: "from-cyan-500 to-cyan-400",
    borderColor: "border-cyan-500",
    textColor: "text-cyan-500",
    glowColor: "shadow-cyan-500/50",
    xpRequired: 1200,
    xpToNext: 2000,
    perks: ["7% bonus on bounties", "Priority job alerts"],
    icon: Target,
  },
  {
    level: 4,
    name: "Blue Cord",
    title: "Active",
    color: "#3B82F6",
    bgGradient: "from-blue-500 to-blue-400",
    borderColor: "border-blue-500",
    textColor: "text-blue-500",
    glowColor: "shadow-blue-500/50",
    xpRequired: 2000,
    xpToNext: 3500,
    perks: ["10% bonus on bounties", "Priority matching", "Profile badge"],
    icon: Shield,
  },
  {
    level: 5,
    name: "Purple Cord",
    title: "Trusted",
    color: "#A855F7",
    bgGradient: "from-purple-500 to-purple-400",
    borderColor: "border-purple-500",
    textColor: "text-purple-500",
    glowColor: "shadow-purple-500/50",
    xpRequired: 3500,
    xpToNext: 5500,
    perks: ["15% bonus on bounties", "Featured in searches", "Access to premium jobs"],
    icon: Award,
  },
  {
    level: 6,
    name: "Pink Cord",
    title: "Proven",
    color: "#EC4899",
    bgGradient: "from-pink-500 to-pink-400",
    borderColor: "border-pink-500",
    textColor: "text-pink-500",
    glowColor: "shadow-pink-500/50",
    xpRequired: 5500,
    xpToNext: 8000,
    perks: ["18% bonus on bounties", "Verified badge", "Direct company connections"],
    icon: Flame,
  },
  {
    level: 7,
    name: "Red Cord",
    title: "Expert",
    color: "#EF4444",
    bgGradient: "from-red-500 to-red-400",
    borderColor: "border-red-500",
    textColor: "text-red-500",
    glowColor: "shadow-red-500/50",
    xpRequired: 8000,
    xpToNext: 12000,
    perks: ["22% bonus on bounties", "Mentorship program access", "Exclusive events"],
    icon: Flame,
  },
  {
    level: 8,
    name: "Black Cord",
    title: "Elite",
    color: "#1F2937",
    bgGradient: "from-gray-800 to-gray-700",
    borderColor: "border-gray-700",
    textColor: "text-gray-300",
    glowColor: "shadow-gray-700/50",
    xpRequired: 12000,
    xpToNext: 18000,
    perks: ["27% bonus on bounties", "VIP support", "Custom profile themes"],
    icon: Shield,
  },
  {
    level: 9,
    name: "Bronze Cord",
    title: "Champion",
    color: "#CD7F32",
    bgGradient: "from-amber-600 to-amber-500",
    borderColor: "border-amber-600",
    textColor: "text-amber-600",
    glowColor: "shadow-amber-600/50",
    xpRequired: 18000,
    xpToNext: 26000,
    perks: ["35% bonus on bounties", "Bronze badge", "Leaderboard placement"],
    icon: Trophy,
  },
  {
    level: 10,
    name: "Silver Cord",
    title: "Master",
    color: "#C0C0C0",
    bgGradient: "from-slate-400 to-slate-300",
    borderColor: "border-slate-400",
    textColor: "text-slate-400",
    glowColor: "shadow-slate-400/50",
    xpRequired: 26000,
    xpToNext: 38000,
    perks: ["45% bonus on bounties", "Silver badge", "Revenue sharing unlocked"],
    icon: Star,
  },
  {
    level: 11,
    name: "Gold Cord",
    title: "Legend",
    color: "#FFD700",
    bgGradient: "from-yellow-500 to-yellow-400",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-500",
    glowColor: "shadow-yellow-500/60",
    xpRequired: 38000,
    xpToNext: 55000,
    perks: ["60% bonus on bounties", "Gold badge", "Advisory board seat", "Equity grants"],
    icon: Crown,
  },
  {
    level: 12,
    name: "Bungee Orange Cord",
    title: "Apex",
    color: "#FF8C00",
    bgGradient: "from-[#FF8C00] to-orange-400",
    borderColor: "border-[#FF8C00]",
    textColor: "text-[#FF8C00]",
    glowColor: "shadow-[#FF8C00]/80",
    xpRequired: 55000,
    xpToNext: null,
    perks: ["100% bonus on bounties", "Bungee Orange badge", "Founding member status", "Full equity participation", "Personal success manager"],
    icon: Crown,
  },
]

// The Bungee Cord with Lightning Bolt Component
export function BungeeCord({ rank, size = "md", showGlow = true, animated = false }: { 
  rank: typeof BUNGEE_RANKS[0]
  size?: "sm" | "md" | "lg" | "xl"
  showGlow?: boolean
  animated?: boolean
}) {
  const sizeClasses = {
    sm: "w-8 h-12",
    md: "w-12 h-18",
    lg: "w-16 h-24",
    xl: "w-24 h-36",
  }
  
  const boltSizes = {
    sm: "w-4 h-6",
    md: "w-6 h-9",
    lg: "w-8 h-12",
    xl: "w-12 h-18",
  }

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Glow effect */}
      {showGlow && (
        <div 
          className={`absolute inset-0 rounded-full blur-xl opacity-60 ${animated ? "animate-pulse" : ""}`}
          style={{ backgroundColor: rank.color }}
        />
      )}
      
      {/* The Cord (outer ring) */}
      <div 
        className={`relative rounded-full flex items-center justify-center ${sizeClasses[size]} ${animated ? "animate-bounce" : ""}`}
        style={{ 
          background: `linear-gradient(135deg, ${rank.color}, ${rank.color}88)`,
          boxShadow: showGlow ? `0 0 20px ${rank.color}80, 0 0 40px ${rank.color}40` : "none",
        }}
      >
        {/* Inner circle */}
        <div 
          className="absolute inset-1 rounded-full bg-gray-900 flex items-center justify-center"
          style={{ 
            boxShadow: `inset 0 0 10px ${rank.color}40`,
          }}
        >
          {/* Lightning Bolt */}
          <svg 
            viewBox="0 0 24 24" 
            className={boltSizes[size]}
            fill={rank.color}
            style={{ filter: `drop-shadow(0 0 4px ${rank.color})` }}
          >
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Rank Card Component
export function RankCard({ rank, isCurrentRank = false, isLocked = false }: {
  rank: typeof BUNGEE_RANKS[0]
  isCurrentRank?: boolean
  isLocked?: boolean
}) {
  const IconComponent = rank.icon

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
        isCurrentRank 
          ? `border-2 ${rank.borderColor} ${rank.glowColor} shadow-lg` 
          : isLocked 
            ? "border-gray-700 opacity-60" 
            : "border-gray-700 hover:border-gray-600"
      } bg-gray-800`}
    >
      {isCurrentRank && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-[#FF8C00] text-white text-xs">Current</Badge>
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10 pointer-events-none">
          <Lock className="size-8 text-gray-500" />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <BungeeCord rank={rank} size="md" showGlow={isCurrentRank} animated={isCurrentRank} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${rank.textColor}`}>{rank.name}</span>
              <IconComponent className="size-4" style={{ color: rank.color }} />
            </div>
            <p className="text-sm text-gray-400">{rank.title}</p>
            <p className="text-xs text-gray-500 mt-1">Level {rank.level}</p>
          </div>
        </div>
        
        {/* Perks Preview */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-2">Perks:</p>
          <div className="flex flex-wrap gap-1">
            {rank.perks.slice(0, 2).map((perk, i) => (
              <Badge key={i} variant="outline" className="text-[10px] border-gray-600 text-gray-400">
                {perk}
              </Badge>
            ))}
            {rank.perks.length > 2 && (
              <Badge variant="outline" className="text-[10px] border-gray-600 text-gray-400">
                +{rank.perks.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Full Ranking System Display
export function BungeeRankSystem({ currentLevel = 1, currentXP = 0, onClose }: { currentLevel?: number, currentXP?: number, onClose?: () => void }) {
  const [selectedRank, setSelectedRank] = useState<typeof BUNGEE_RANKS[0] | null>(null)
  const currentRank = BUNGEE_RANKS[Math.min(currentLevel - 1, 11)]
  const nextRank = currentLevel < 12 ? BUNGEE_RANKS[currentLevel] : null
  
  const xpProgress = nextRank 
    ? ((currentXP - currentRank.xpRequired) / (nextRank.xpRequired - currentRank.xpRequired)) * 100
    : 100

  return (
    <div className="space-y-6 relative">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute -top-2 right-0 p-2.5 rounded-full bg-gray-700/90 hover:bg-red-500 transition-colors z-10 border border-gray-600"
        >
          <X className="size-6 text-white" />
        </button>
      )}
      
      {/* Current Rank Hero */}
      <Card className={`border-2 ${currentRank.borderColor} bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden relative`}>
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 50%, ${currentRank.color}, transparent 70%)` }}
        />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <BungeeCord rank={currentRank} size="xl" showGlow animated />
              <div>
                <CardTitle className={`text-3xl font-black ${currentRank.textColor}`}>
                  {currentRank.name}
                </CardTitle>
                <CardDescription className="text-lg text-gray-300">{currentRank.title}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gray-700 text-white">Level {currentRank.level}</Badge>
                  <Badge style={{ backgroundColor: `${currentRank.color}30`, color: currentRank.color, borderColor: currentRank.color }} className="border">
                    {currentXP.toLocaleString()} XP
                  </Badge>
                </div>
              </div>
            </div>
            
            {nextRank && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Next Rank</p>
                <p className={`font-bold ${nextRank.textColor}`}>{nextRank.name}</p>
                <p className="text-xs text-gray-500">{(nextRank.xpRequired - currentXP).toLocaleString()} XP to go</p>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          {/* Progress to Next Rank */}
          {nextRank && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress to {nextRank.name}</span>
                <span className="text-sm font-bold" style={{ color: currentRank.color }}>{Math.round(xpProgress)}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${xpProgress}%`,
                    background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`,
                    boxShadow: `0 0 10px ${currentRank.color}80`,
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Current Perks */}
          <div>
            <p className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Award className="size-4" style={{ color: currentRank.color }} />
              Your Current Perks
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentRank.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-700/50">
                  <div className="size-2 rounded-full" style={{ backgroundColor: currentRank.color }} />
                  <span className="text-sm text-gray-300">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Ranks Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="size-5 text-[#FF8C00]" />
          Bungee Cord Ranking System
        </h3>
        <p className="text-gray-400 mb-6">Climb the ranks, unlock exclusive perks, and maximize your earnings!</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BUNGEE_RANKS.map((rank) => (
            <div key={rank.level} onClick={() => setSelectedRank(rank)} className="cursor-pointer">
              <RankCard 
                rank={rank} 
                isCurrentRank={rank.level === currentLevel}
                isLocked={rank.level > currentLevel}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Selected Rank Detail Modal */}
      {selectedRank && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setSelectedRank(null)}
        >
          <Card 
            className={`w-full max-w-lg border-2 ${selectedRank.borderColor} bg-gray-800 relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X button */}
            <button 
              onClick={() => setSelectedRank(null)}
              className="absolute top-3 right-3 size-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
            >
              <span className="text-xl leading-none">&times;</span>
            </button>
            <div 
              className="absolute inset-0 opacity-20 rounded-lg"
              style={{ background: `radial-gradient(circle at 50% 0%, ${selectedRank.color}, transparent 70%)` }}
            />
            <CardHeader className="relative text-center">
              <div className="flex justify-center mb-4">
                <BungeeCord rank={selectedRank} size="xl" showGlow animated />
              </div>
              <CardTitle className={`text-2xl font-black ${selectedRank.textColor}`}>
                {selectedRank.name}
              </CardTitle>
              <CardDescription className="text-lg">{selectedRank.title} - Level {selectedRank.level}</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">XP Required</p>
                <p className="text-xl font-bold text-white">
                  {selectedRank.xpRequired.toLocaleString()} XP
                  {selectedRank.xpToNext && (
                    <span className="text-sm text-gray-400 font-normal ml-2">
                      (Next: {selectedRank.xpToNext.toLocaleString()} XP)
                    </span>
                  )}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-3">All Perks at this Level</p>
                <div className="space-y-2">
                  {selectedRank.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
                      <div 
                        className="size-3 rounded-full" 
                        style={{ backgroundColor: selectedRank.color, boxShadow: `0 0 8px ${selectedRank.color}` }} 
                      />
                      <span className="text-gray-200">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedRank(null)}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${selectedRank.color}, ${selectedRank.color}aa)`,
                  boxShadow: `0 4px 20px ${selectedRank.color}40`,
                }}
              >
                Close
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Mini Rank Badge for use in profiles/cards
export function RankBadge({ level, showLabel = true }: { level: number, showLabel?: boolean }) {
  const rank = BUNGEE_RANKS[Math.min(level - 1, 11)]
  
  return (
    <div className="flex items-center gap-2">
      <BungeeCord rank={rank} size="sm" showGlow={false} />
      {showLabel && (
        <span className={`text-sm font-semibold ${rank.textColor}`}>{rank.name}</span>
      )}
    </div>
  )
}
