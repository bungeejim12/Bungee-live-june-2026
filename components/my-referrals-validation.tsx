"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, TrendingUp, CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react"
import { StarRating, VerifiedBungeeBadge } from "@/components/validation-badges"
import {
  type ValidatedReferral,
  computeQualityScore,
  checkVelocity,
  statusLabel,
  statusClasses,
  formatDate,
} from "@/lib/validation"

interface MyReferralsValidationProps {
  referrals: ValidatedReferral[]
  isDarkMode?: boolean
  userName?: string
}

type Filter = "all" | "pending" | "verified" | "disqualified"

export function MyReferralsValidation({ referrals, isDarkMode = false, userName = "You" }: MyReferralsValidationProps) {
  const [filter, setFilter] = useState<Filter>("all")

  const score = useMemo(() => computeQualityScore(referrals), [referrals])
  const velocity = useMemo(() => checkVelocity(referrals), [referrals])

  const filtered = useMemo(
    () => (filter === "all" ? referrals : referrals.filter((r) => r.status === filter)),
    [referrals, filter],
  )

  const card = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900"
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-500"

  return (
    <div className="space-y-4">
      {/* Trust Indicator Widget */}
      <div
        className={`rounded-2xl border p-5 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } shadow-sm`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-medium uppercase tracking-wide ${textMuted}`}>Your Quality Score</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`text-4xl font-bold ${textPrimary}`}>{score.stars.toFixed(1)}</span>
              <div className="flex flex-col gap-1">
                <StarRating rating={score.stars} size={18} />
                <span className={`text-xs ${textMuted}`}>{score.conversionRate}% conversion rate</span>
              </div>
            </div>
          </div>
          {score.isVerifiedBungee ? (
            <VerifiedBungeeBadge />
          ) : (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
              isDarkMode ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-500"
            }`}>
              <ShieldCheck className="size-3.5" />
              {`${(4 - score.stars).toFixed(1)}★ to Verified`}
            </span>
          )}
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className={`rounded-xl p-3 text-center ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
            <p className="text-lg font-bold text-emerald-600">{score.verified}</p>
            <p className={`text-[11px] ${textMuted}`}>Verified</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}>
            <p className="text-lg font-bold text-amber-600">{score.pending}</p>
            <p className={`text-[11px] ${textMuted}`}>Pending</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${isDarkMode ? "bg-red-500/10" : "bg-red-50"}`}>
            <p className="text-lg font-bold text-red-600">{score.disqualified}</p>
            <p className={`text-[11px] ${textMuted}`}>Disqualified</p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 mt-3 text-xs ${textMuted}`}>
          <TrendingUp className="size-3.5" />
          Score is based on verified conversions, not lead volume.
        </div>
      </div>

      {/* Velocity Check warning */}
      {velocity.triggered && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
          <div className="size-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900">Velocity check triggered</p>
            <p className="text-xs text-amber-700 mt-0.5">
              You submitted {velocity.count} referrals in the last {velocity.windowLabel}. To protect lead quality,
              new referrals will be placed in manual review. Add more detail to each lead to speed up verification.
            </p>
          </div>
        </div>
      )}

      {/* My Referrals table */}
      <div className={`rounded-2xl border overflow-hidden ${card} shadow-sm`}>
        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`font-bold ${textPrimary}`}>My Referrals</h3>
          <div className="flex items-center gap-1">
            {(["all", "pending", "verified", "disqualified"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-[#FF8C00] text-white"
                    : isDarkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${textMuted} ${isDarkMode ? "bg-gray-900/40" : "bg-gray-50"}`}>
                <th className="font-medium px-4 py-2.5">Lead</th>
                <th className="font-medium px-4 py-2.5">Business</th>
                <th className="font-medium px-4 py-2.5">Status</th>
                <th className="font-medium px-4 py-2.5">Submitted</th>
                <th className="font-medium px-4 py-2.5">Converted</th>
                <th className="font-medium px-4 py-2.5 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <td className={`px-4 py-3 font-medium ${textPrimary}`}>{r.leadName}</td>
                  <td className={`px-4 py-3 ${textMuted}`}>{r.businessName}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} isDarkMode={isDarkMode} />
                  </td>
                  <td className={`px-4 py-3 ${textMuted}`}>{formatDate(r.submittedAt)}</td>
                  <td className={`px-4 py-3 ${textMuted}`}>{formatDate(r.conversionDate)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${r.status === "verified" ? "text-emerald-600" : textMuted}`}>
                    ${r.estimatedValue}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={`px-4 py-8 text-center ${textMuted}`}>
                    No {filter === "all" ? "" : filter} referrals yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map((r) => (
            <div key={r.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className={`font-semibold ${textPrimary}`}>{r.leadName}</p>
                <StatusPill status={r.status} isDarkMode={isDarkMode} />
              </div>
              <p className={`text-xs ${textMuted} mt-0.5`}>{r.businessName}</p>
              <div className={`flex items-center justify-between mt-2 text-xs ${textMuted}`}>
                <span>Submitted {formatDate(r.submittedAt)}</span>
                <span className={`font-semibold ${r.status === "verified" ? "text-emerald-600" : textMuted}`}>
                  ${r.estimatedValue}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className={`px-4 py-8 text-center text-sm ${textMuted}`}>
              No {filter === "all" ? "" : filter} referrals yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status, isDarkMode }: { status: ValidatedReferral["status"]; isDarkMode: boolean }) {
  const Icon = status === "verified" ? CheckCircle2 : status === "disqualified" ? XCircle : Clock
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClasses(
        status,
        isDarkMode,
      )}`}
    >
      <Icon className="size-3" />
      {statusLabel(status)}
    </span>
  )
}
