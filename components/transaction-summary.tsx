"use client"

import { useState } from "react"
import { Receipt, Info } from "lucide-react"
import { computeTransaction, formatCurrency, SERVICE_FEE_RATE } from "@/lib/payments"

interface TransactionSummaryProps {
  defaultWorkerPayment?: number
}

// Business-facing cost calculator. Enter the worker payment and the panel
// breaks down the 30% contingent service fee and the total cost to the business
// with exact two-decimal precision.
export function TransactionSummary({ defaultWorkerPayment = 100 }: TransactionSummaryProps) {
  const [amount, setAmount] = useState<string>(String(defaultWorkerPayment))

  const parsed = Number.parseFloat(amount)
  const workerPayment = Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  const { serviceFee, totalCost } = computeTransaction(workerPayment)
  const feePct = Math.round(SERVICE_FEE_RATE * 100)

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
        <div className="size-8 rounded-lg bg-[#FF8C00]/10 flex items-center justify-center">
          <Receipt className="size-4 text-[#FF8C00]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Transaction Summary</h3>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
            See your total cost before you pay a Bungee worker.
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Worker payment input */}
        <div>
          <label htmlFor="worker-payment" className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
            Worker Payment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">$</span>
            <input
              id="worker-payment"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-slate-900 dark:text-white pl-7 pr-3 py-2.5 text-base font-semibold outline-none focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <Row label="Worker Payment" value={formatCurrency(workerPayment)} />
          <Row label={`Service Fee (${feePct}%)`} value={formatCurrency(serviceFee)} accent />
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Total Cost to Business</span>
            <span className="text-lg font-bold text-[#FF8C00]">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <Info className="size-3.5 shrink-0 mt-0.5" />
          <span>
            The worker receives their full payment of {formatCurrency(workerPayment)}. The {feePct}% contingent service
            fee ({formatCurrency(serviceFee)}) funds the platform and referral residuals.
          </span>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-[#FF8C00]" : "text-gray-900 dark:text-white"}`}>
        {value}
      </span>
    </div>
  )
}
