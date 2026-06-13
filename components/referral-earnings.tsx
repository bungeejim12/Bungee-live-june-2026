"use client"

import { useMemo } from "react"
import { DollarSign, TrendingUp, Clock, Building2, User } from "lucide-react"
import {
  type ReferredAccount,
  computeResidualPortfolio,
  RESIDUAL_TIERS,
  RESIDUAL_WINDOW_MONTHS,
  formatCurrency,
} from "@/lib/payments"

interface ReferralEarningsProps {
  accounts: ReferredAccount[]
  isDarkMode?: boolean
}

// Bungee-facing recurring income widget. Shows accumulated residual earnings
// from referred accounts, tiered over an 18-month window. Each account's tier
// is derived from how long it has been active, so the numbers move with time.
export function ReferralEarnings({ accounts, isDarkMode = false }: ReferralEarningsProps) {
  const portfolio = useMemo(() => computeResidualPortfolio(accounts), [accounts])

  const card = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900"
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-500"
  const subCard = isDarkMode ? "bg-gray-700" : "bg-gray-100"

  return (
    <div className="space-y-4">
      {/* Headline recurring income */}
      <div className="rounded-2xl p-5 border border-[#FF8C00]/30 bg-gradient-to-br from-[#FF8C00]/15 to-amber-500/10">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="size-5 text-[#FF8C00]" />
          <p className={`text-sm font-medium ${textMuted}`}>Accumulated Residual Income</p>
        </div>
        <p className={`text-4xl font-bold ${textPrimary}`}>{formatCurrency(portfolio.totalAccumulated)}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF8C00]">
            <TrendingUp className="size-3.5" />
            {formatCurrency(portfolio.totalMonthlyResidual)}/mo recurring
          </span>
          <span className={`text-xs ${textMuted}`}>{portfolio.activeCount} active referrals</span>
        </div>
      </div>

      {/* Lifetime projection */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-4 border ${card}`}>
          <p className={`text-[11px] uppercase tracking-wide ${textMuted}`}>Projected Remaining</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(portfolio.totalProjectedRemaining)}</p>
          <p className={`text-[11px] mt-0.5 ${textMuted}`}>Through month {RESIDUAL_WINDOW_MONTHS}</p>
        </div>
        <div className={`rounded-xl p-4 border ${card}`}>
          <p className={`text-[11px] uppercase tracking-wide ${textMuted}`}>18-Month Lifetime Value</p>
          <p className={`text-xl font-bold mt-1 ${textPrimary}`}>{formatCurrency(portfolio.totalLifetimeProjected)}</p>
          <p className={`text-[11px] mt-0.5 ${textMuted}`}>Total residual potential</p>
        </div>
      </div>

      {/* Tier schedule legend */}
      <div className={`rounded-xl p-4 border ${card}`}>
        <p className={`text-xs font-semibold mb-3 ${textPrimary}`}>Residual Schedule (% of the 30% service fee)</p>
        <div className="grid grid-cols-3 gap-2">
          {RESIDUAL_TIERS.map((tier) => (
            <div key={tier.label} className={`rounded-lg p-2.5 text-center ${subCard}`}>
              <p className="text-base font-bold text-[#FF8C00]">{(tier.rate * 100).toFixed(tier.rate * 100 % 1 === 0 ? 0 : 1)}%</p>
              <p className={`text-[10px] ${textMuted}`}>{tier.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-account breakdown */}
      <div className={`rounded-2xl border overflow-hidden ${card}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`font-bold ${textPrimary}`}>Your Referred Accounts</h3>
          <p className={`text-xs ${textMuted}`}>Recurring income updates automatically as each account ages.</p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {portfolio.accounts.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="size-8 text-gray-400 mx-auto mb-2" />
              <p className={`text-sm ${textMuted}`}>No referred accounts yet</p>
              <p className={`text-xs ${isDarkMode ? "text-gray-600" : "text-gray-500"}`}>
                Refer a user or business to start earning residual income.
              </p>
            </div>
          )}
          {portfolio.accounts.map((acct) => {
            const Icon = acct.type === "business" ? Building2 : User
            const progress = Math.min((acct.monthsActive / RESIDUAL_WINDOW_MONTHS) * 100, 100)
            return (
              <div key={acct.accountId} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-full bg-[#FF8C00]/10 flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-[#FF8C00]" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${textPrimary}`}>{acct.name}</p>
                      <p className={`text-[11px] ${textMuted}`}>
                        {acct.currentTier ? acct.currentTier.label : "Past 18-month window"} ·{" "}
                        {acct.isActive ? `${formatCurrency(acct.currentMonthlyResidual)}/mo` : "Completed"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(acct.accumulatedResidual)}</p>
                    <p className={`text-[10px] ${textMuted}`}>earned</p>
                  </div>
                </div>
                {/* 18-month progress */}
                <div className="mt-2.5">
                  <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div className="h-full rounded-full bg-[#FF8C00]" style={{ width: `${progress}%` }} />
                  </div>
                  <div className={`flex items-center justify-between mt-1 text-[10px] ${textMuted}`}>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      Month {Math.min(acct.monthsActive, RESIDUAL_WINDOW_MONTHS)} of {RESIDUAL_WINDOW_MONTHS}
                    </span>
                    <span>{formatCurrency(acct.projectedRemaining)} remaining</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
