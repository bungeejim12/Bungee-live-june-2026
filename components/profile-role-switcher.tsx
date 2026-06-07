"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  User,
  ChevronDown,
  Check,
  ShieldAlert,
  Wallet,
  Users,
  Briefcase,
  QrCode,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react"

type WorkspaceMode = "merchant" | "referrer"

interface ProfileRoleSwitcherProps {
  currentMode?: WorkspaceMode
  onModeChange?: (mode: WorkspaceMode) => void
  businessName?: string
  userName?: string
  className?: string
}

export function ProfileRoleSwitcher({
  currentMode = "merchant",
  onModeChange,
  businessName = "ABC Company",
  userName = "John Doe",
  className = "",
}: ProfileRoleSwitcherProps) {
  const [mode, setMode] = useState<WorkspaceMode>(currentMode)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleModeChange = (newMode: WorkspaceMode) => {
    setMode(newMode)
    onModeChange?.(newMode)
    setIsOpen(false)
    
    // Navigate to appropriate dashboard
    if (newMode === "merchant") {
      router.push("/dashboard/business")
    } else {
      router.push("/dashboard/bungee")
    }
  }

  const isMerchant = mode === "merchant"

  return (
    <div className={`w-full ${className}`}>
      {/* Workspace Card */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
        {/* Current Workspace Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Active Workspace
          </span>
          {isMerchant && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[9px] font-semibold px-1.5 py-0.5">
              <ShieldAlert className="size-2.5 mr-1" />
              Referral Tracking Muted
            </Badge>
          )}
        </div>

        {/* Dropdown Selector */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4 border-2 border-gray-200 hover:border-[#FF8C00]/50 hover:bg-[#FF8C00]/5 transition-all rounded-xl group"
            >
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                  isMerchant 
                    ? "bg-[#FF8C00]/10 text-[#FF8C00]" 
                    : "bg-emerald-100 text-emerald-600"
                }`}>
                  {isMerchant ? (
                    <Building2 className="size-5" />
                  ) : (
                    <User className="size-5" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">
                    {isMerchant ? "Merchant Workspace" : "Referrer Workspace"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isMerchant ? businessName : userName}
                  </p>
                </div>
              </div>
              <ChevronDown className="size-4 text-gray-400 group-hover:text-[#FF8C00] transition-colors" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="start" 
            className="w-[calc(100%-2rem)] min-w-[280px] p-2 rounded-xl border-2 border-gray-200 shadow-xl"
          >
            <DropdownMenuLabel className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5">
              Switch Workspace
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            
            <DropdownMenuGroup className="space-y-1 py-1">
              {/* Merchant Option */}
              <DropdownMenuItem
                onClick={() => handleModeChange("merchant")}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  isMerchant 
                    ? "bg-[#FF8C00]/10 border-2 border-[#FF8C00]/30" 
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`size-10 rounded-xl flex items-center justify-center ${
                    isMerchant ? "bg-[#FF8C00] text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    <Building2 className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">Merchant Workspace</p>
                      {isMerchant && <Check className="size-4 text-[#FF8C00]" />}
                    </div>
                    <p className="text-xs text-gray-500">{businessName}</p>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Referrer Option */}
              <DropdownMenuItem
                onClick={() => handleModeChange("referrer")}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  !isMerchant 
                    ? "bg-emerald-50 border-2 border-emerald-200" 
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`size-10 rounded-xl flex items-center justify-center ${
                    !isMerchant ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    <User className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">Referrer Workspace</p>
                      {!isMerchant && <Check className="size-4 text-emerald-500" />}
                    </div>
                    <p className="text-xs text-gray-500">{userName}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Guardrail Warning - Merchant Mode */}
        {isMerchant && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200/50">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-amber-800">Self-Referral Protection Active</p>
                <p className="text-[10px] text-amber-600 leading-relaxed mt-0.5">
                  Personal referral tracking is muted to prevent circular payouts on your own listings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Preview */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            {isMerchant ? (
              <>
                {/* Merchant Stats */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="size-3.5 text-[#FF8C00]" />
                    <span className="text-[10px] font-medium text-gray-500">Campaign Escrow</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">$2,450</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="size-3.5 text-[#FF8C00]" />
                    <span className="text-[10px] font-medium text-gray-500">Active Jobs</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">3</p>
                </div>
              </>
            ) : (
              <>
                {/* Referrer Stats */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="size-3.5 text-emerald-500" />
                    <span className="text-[10px] font-medium text-gray-500">Network Invites</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">24</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="size-3.5 text-emerald-500" />
                    <span className="text-[10px] font-medium text-gray-500">18-Mo Pipeline</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">$847</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* QR Code Quick Access - Referrer Only */}
        {!isMerchant && (
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-9 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <QrCode className="size-3.5 mr-2" />
              View Tracking QR Code
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
