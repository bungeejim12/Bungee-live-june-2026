"use client"

import { useState } from "react"
import { Lock, Plus, Trash2, Save, RefreshCw, Sliders, TrendingDown } from "lucide-react"
import { formatCurrency } from "@/lib/payments"

const ADMIN_PASSWORD = "bungee26"

interface Tier {
  label: string
  startMonth: number
  endMonth: number
  rate: number // fraction (0.1 = 10%)
}

interface Config {
  serviceFeeRate: number
  windowMonths: number
  tiers: Tier[]
}

export function CommissionConfigDashboard() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [authError, setAuthError] = useState(false)

  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [previewGross, setPreviewGross] = useState(100)

  const loadConfig = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/commission-config?key=${encodeURIComponent(ADMIN_PASSWORD)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load config")
      setConfig({ serviceFeeRate: json.serviceFeeRate, windowMonths: json.windowMonths, tiers: json.tiers })
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Failed to load config" })
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthed(true)
      setAuthError(false)
      loadConfig()
    } else {
      setAuthError(true)
    }
  }

  const updateTier = (index: number, patch: Partial<Tier>) => {
    if (!config) return
    const tiers = config.tiers.map((t, i) => (i === index ? { ...t, ...patch } : t))
    setConfig({ ...config, tiers })
  }

  const addTier = () => {
    if (!config) return
    const last = config.tiers[config.tiers.length - 1]
    const start = last ? last.endMonth + 1 : 1
    setConfig({
      ...config,
      tiers: [...config.tiers, { label: `Months ${start}-${start + 5}`, startMonth: start, endMonth: start + 5, rate: 0.02 }],
    })
  }

  const removeTier = (index: number) => {
    if (!config) return
    setConfig({ ...config, tiers: config.tiers.filter((_, i) => i !== index) })
  }

  const save = async () => {
    if (!config) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/commission-config?key=${encodeURIComponent(ADMIN_PASSWORD)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to save")
      setMessage({ type: "ok", text: "Configuration saved. The engine will use these values on the next transaction." })
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Failed to save" })
    } finally {
      setSaving(false)
    }
  }

  // ---- Auth gate ----
  if (!isAuthed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0A0A0A" }}>
        <form
          onSubmit={handleAuth}
          className="w-full max-w-sm rounded-2xl p-6 sm:p-8"
          style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F" }}
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex size-14 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: "rgba(255,107,0,0.1)" }}>
              <Lock className="size-7" style={{ color: "#FF6B00" }} />
            </div>
            <h1 className="text-xl font-bold text-white">Commission Engine</h1>
            <p className="text-sm mt-1" style={{ color: "#666666" }}>
              Restricted configuration. Enter the access code.
            </p>
          </div>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Access code"
            className="w-full rounded-lg px-4 py-3 text-white outline-none mb-3"
            style={{ backgroundColor: "#0A0A0A", border: `1px solid ${authError ? "#EF4444" : "#2A2A2A"}` }}
            autoFocus
          />
          {authError && <p className="text-xs mb-3" style={{ color: "#EF4444" }}>Incorrect access code.</p>}
          <button
            type="submit"
            className="w-full rounded-lg py-3 font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FF6B00" }}
          >
            Unlock
          </button>
        </form>
      </main>
    )
  }

  // ---- Live preview math (mirrors the engine) ----
  const grossCents = Math.round(previewGross * 100)
  const feeCents = config ? Math.round(grossCents * config.serviceFeeRate) : 0

  return (
    <main className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(255,107,0,0.1)" }}>
              <Sliders className="size-6" style={{ color: "#FF6B00" }} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white text-balance">Commission Decay Engine</h1>
              <p className="text-sm" style={{ color: "#666666" }}>Adjustable configuration — applied to every new transaction.</p>
            </div>
          </div>
          <button
            onClick={loadConfig}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Reload
          </button>
        </div>

        {message && (
          <div
            className="rounded-lg px-4 py-3 mb-6 text-sm"
            style={{
              backgroundColor: message.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: message.type === "ok" ? "#22C55E" : "#EF4444",
              border: `1px solid ${message.type === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {message.text}
          </div>
        )}

        {!config ? (
          <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", color: "#666666" }}>
            {loading ? "Loading configuration..." : "No configuration loaded."}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Global settings */}
            <section className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F" }}>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#888888" }}>Global Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: "#AAAAAA" }}>Corporate Service Fee (%)</span>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    value={Math.round(config.serviceFeeRate * 1000) / 10}
                    onChange={(e) => setConfig({ ...config, serviceFeeRate: Number(e.target.value) / 100 })}
                    className="rounded-lg px-3 py-2.5 text-white outline-none"
                    style={{ backgroundColor: "#0A0A0A", border: "1px solid #2A2A2A" }}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: "#AAAAAA" }}>Residual Window (months)</span>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={config.windowMonths}
                    onChange={(e) => setConfig({ ...config, windowMonths: Number(e.target.value) })}
                    className="rounded-lg px-3 py-2.5 text-white outline-none"
                    style={{ backgroundColor: "#0A0A0A", border: "1px solid #2A2A2A" }}
                  />
                </label>
              </div>
            </section>

            {/* Decay tiers */}
            <section className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "#888888" }}>
                  <TrendingDown className="size-4" style={{ color: "#FF6B00" }} />
                  Decay Schedule
                </h2>
                <button
                  onClick={addTier}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}
                >
                  <Plus className="size-3.5" />
                  Add Tier
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {config.tiers.map((tier, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-2 items-end rounded-xl p-3"
                    style={{ backgroundColor: "#0A0A0A", border: "1px solid #1F1F1F" }}
                  >
                    <label className="col-span-12 sm:col-span-4 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wide" style={{ color: "#666666" }}>Label</span>
                      <input
                        value={tier.label}
                        onChange={(e) => updateTier(i, { label: e.target.value })}
                        className="rounded-md px-2.5 py-2 text-sm text-white outline-none"
                        style={{ backgroundColor: "#111111", border: "1px solid #2A2A2A" }}
                      />
                    </label>
                    <label className="col-span-4 sm:col-span-2 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wide" style={{ color: "#666666" }}>Start mo.</span>
                      <input
                        type="number"
                        min={1}
                        value={tier.startMonth}
                        onChange={(e) => updateTier(i, { startMonth: Number(e.target.value) })}
                        className="rounded-md px-2.5 py-2 text-sm text-white outline-none"
                        style={{ backgroundColor: "#111111", border: "1px solid #2A2A2A" }}
                      />
                    </label>
                    <label className="col-span-4 sm:col-span-2 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wide" style={{ color: "#666666" }}>End mo.</span>
                      <input
                        type="number"
                        min={1}
                        value={tier.endMonth}
                        onChange={(e) => updateTier(i, { endMonth: Number(e.target.value) })}
                        className="rounded-md px-2.5 py-2 text-sm text-white outline-none"
                        style={{ backgroundColor: "#111111", border: "1px solid #2A2A2A" }}
                      />
                    </label>
                    <label className="col-span-8 sm:col-span-3 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wide" style={{ color: "#666666" }}>Rate (% of fee)</span>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        max={100}
                        value={Math.round(tier.rate * 1000) / 10}
                        onChange={(e) => updateTier(i, { rate: Number(e.target.value) / 100 })}
                        className="rounded-md px-2.5 py-2 text-sm text-white outline-none"
                        style={{ backgroundColor: "#111111", border: "1px solid #2A2A2A" }}
                      />
                    </label>
                    <div className="col-span-4 sm:col-span-1 flex justify-end">
                      <button
                        onClick={() => removeTier(i)}
                        className="flex size-9 items-center justify-center rounded-md transition-colors"
                        style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                        aria-label="Remove tier"
                      >
                        <Trash2 className="size-4" style={{ color: "#EF4444" }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Live preview */}
            <section className="rounded-2xl p-5" style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F" }}>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#888888" }}>Live Payout Preview</h2>
              <label className="flex flex-col gap-1.5 mb-4 max-w-[200px]">
                <span className="text-xs font-semibold" style={{ color: "#AAAAAA" }}>Sample Worker Payout ($)</span>
                <input
                  type="number"
                  min={0}
                  value={previewGross}
                  onChange={(e) => setPreviewGross(Number(e.target.value))}
                  className="rounded-lg px-3 py-2.5 text-white outline-none"
                  style={{ backgroundColor: "#0A0A0A", border: "1px solid #2A2A2A" }}
                />
              </label>

              <div className="flex items-center justify-between py-2 text-sm" style={{ borderBottom: "1px solid #1A1A1A" }}>
                <span style={{ color: "#AAAAAA" }}>Service fee collected ({Math.round(config.serviceFeeRate * 1000) / 10}%)</span>
                <span className="font-mono font-bold text-white">{formatCurrency(feeCents / 100)}</span>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                {config.tiers.map((tier, i) => {
                  const residualCents = Math.round(feeCents * tier.rate)
                  return (
                    <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#0A0A0A" }}>
                      <span className="text-sm" style={{ color: "#CCCCCC" }}>
                        {tier.label} <span style={{ color: "#666666" }}>({Math.round(tier.rate * 1000) / 10}%)</span>
                      </span>
                      <span className="font-mono font-bold" style={{ color: "#FF6B00" }}>
                        {formatCurrency(residualCents / 100)}<span className="text-xs font-normal" style={{ color: "#666666" }}>/mo</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Save */}
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#FF6B00" }}
            >
              <Save className="size-5" />
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
