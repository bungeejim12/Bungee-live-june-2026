"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, XCircle, Clock, ShieldCheck, RotateCcw, AlertTriangle } from "lucide-react"
import {
  type ValidatedReferral,
  type ReferralStatus,
  statusLabel,
  statusClasses,
  formatDate,
} from "@/lib/validation"
import { ReferrerBadge } from "@/components/referrer-badge"

interface LeadValidationPanelProps {
  initialLeads: ValidatedReferral[]
}

// Business-owner controls for validating inbound referrals.
// "Mark Converted" moves a lead to Verified (raising the Bungee's score);
// "Disqualify" flags a low-quality / blind lead (lowering the Bungee's score).
export function LeadValidationPanel({ initialLeads }: LeadValidationPanelProps) {
  const [leads, setLeads] = useState<ValidatedReferral[]>(initialLeads)

  const setStatus = (id: string, status: ReferralStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              conversionDate: status === "verified" ? new Date().toISOString() : null,
            }
          : l,
      ),
    )
  }

  const counts = useMemo(() => {
    return {
      pending: leads.filter((l) => l.status === "pending").length,
      verified: leads.filter((l) => l.status === "verified").length,
      disqualified: leads.filter((l) => l.status === "disqualified").length,
    }
  }, [leads])

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
        <div className="size-8 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center">
          <ShieldCheck className="size-4 text-[#FF8C00]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Validate Inbound Leads</h3>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            Confirm conversions to reward quality Bungees. Disqualify blind leads to keep your pipeline clean.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
          <span className="rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-800 px-2 py-0.5 font-medium">
            {counts.pending} pending
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {leads.length === 0 && (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">No inbound leads yet.</p>
        )}
        {leads.map((lead) => {
          const Icon =
            lead.status === "verified" ? CheckCircle2 : lead.status === "disqualified" ? XCircle : Clock
          return (
            <div key={lead.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold shrink-0">
                {lead.leadName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{lead.leadName}</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClasses(
                      lead.status,
                    )}`}
                  >
                    <Icon className="size-3" />
                    {statusLabel(lead.status)}
                  </span>
                  {lead.leadName.toLowerCase().includes("unknown") && lead.status === "pending" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 text-[10px] font-medium">
                      <AlertTriangle className="size-3" />
                      Low detail
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {lead.category} · Submitted {formatDate(lead.submittedAt)} · ${lead.estimatedValue}
                </p>
                {/* Referring Bungee — avatar + cord rank attached to this person */}
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#FF8C00]/5 border border-[#FF8C00]/15 px-2 py-1.5 w-fit max-w-full">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#FF8C00] shrink-0">
                    Via Bungee
                  </span>
                  <ReferrerBadge referrer={lead.referrer} />
                </div>
              </div>

              {/* Owner controls */}
              <div className="flex items-center gap-2 shrink-0">
                {lead.status === "pending" ? (
                  <>
                    <button
                      onClick={() => setStatus(lead.id, "verified")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Mark Converted
                    </button>
                    <button
                      onClick={() => setStatus(lead.id, "disqualified")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-semibold px-3 py-1.5 transition-colors"
                    >
                      <XCircle className="size-3.5" />
                      Disqualify
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setStatus(lead.id, "pending")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-medium px-3 py-1.5 transition-colors"
                  >
                    <RotateCcw className="size-3.5" />
                    Undo
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
