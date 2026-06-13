"use client"

import { useState, useRef, useEffect } from "react"
import { createJobOrder } from "@/app/actions/job-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VoiceTextarea as Textarea } from "@/components/voice-textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Briefcase,
  DollarSign,
  MapPin,
  Lightbulb,
  Megaphone,
  RotateCcw,
  AlertCircle,
} from "lucide-react"

interface BusinessContext {
  businessName?: string | null
  location?: string | null
}

interface AiJobWizardProps {
  onClose: () => void
  business?: BusinessContext
  isDemo?: boolean
}

type WorkModel = "On-Site" | "Hybrid" | "Remote"

interface Answers {
  title: string
  compensation: string
  workModel: WorkModel
  requirements: string
  sellingPoints: string
  bounty: string
}

interface Suggestion {
  normalizedTitle: string
  typicalCompensation: string
  suggestedRequirements: string
  suggestedSellingPoints: string
  suggestedBounty: number
}

interface JobSummary {
  title: string
  compensation: string
  workModel: string
  summary: string
  requirements: string[]
  sellingPoints: string[]
}

const AI_PROMPTS = [
  "What role are you looking to fill?",
  "Got it. Let's look at compensation. What's the target salary or hourly rate, and is it remote, hybrid, or on-site?",
  "Perfect. Now tell me about the ideal candidate. What are the non-negotiable skills, certifications, or years of experience they need to hit the ground running?",
  "Lastly, what's the 'sell'? Why would a top-tier candidate want to leave their current job for this one? And set the Cord referral bounty you'll pay on a successful hire.",
]

const TOTAL_STEPS = 4

export default function AiJobWizard({ onClose, business, isDemo }: AiJobWizardProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({
    title: "",
    compensation: "",
    workModel: "On-Site",
    requirements: "",
    sellingPoints: "",
    bounty: "",
  })
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [summary, setSummary] = useState<JobSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the transcript scrolled to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [step, suggestion, suggestLoading])

  const update = (patch: Partial<Answers>) => setAnswers((prev) => ({ ...prev, ...patch }))

  // After the owner names the role, fetch smart scoping hints for the remaining steps.
  const fetchSuggestions = async (title: string) => {
    setSuggestLoading(true)
    setSuggestion(null)
    try {
      const res = await fetch("/api/hiring/job-order-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest",
          title,
          businessName: business?.businessName || undefined,
          location: business?.location || undefined,
        }),
      })
      const result = await res.json()
      if (res.ok && result.data) setSuggestion(result.data)
    } catch (err) {
      console.log("[v0] suggestion fetch failed:", err)
    } finally {
      setSuggestLoading(false)
    }
  }

  const goNext = async () => {
    if (step === 1) {
      if (!answers.title.trim()) return
      await fetchSuggestions(answers.title.trim())
      setStep(2)
      return
    }
    if (step === 2) {
      if (!answers.compensation.trim()) return
      setStep(3)
      return
    }
    if (step === 3) {
      if (!answers.requirements.trim()) return
      setStep(4)
      return
    }
    if (step === 4) {
      if (!answers.sellingPoints.trim() || !answers.bounty.trim()) return
      await buildSummary()
    }
  }

  const goBack = () => {
    if (step === 1) {
      onClose()
      return
    }
    setStep((s) => s - 1)
  }

  const buildSummary = async () => {
    setSummaryLoading(true)
    try {
      const res = await fetch("/api/hiring/job-order-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "summary", answers }),
      })
      const result = await res.json()
      if (res.ok && result.data) {
        setSummary(result.data)
      } else {
        // Fallback to a locally assembled summary if the AI call fails.
        setSummary({
          title: answers.title,
          compensation: answers.compensation,
          workModel: answers.workModel,
          summary: `${answers.title} (${answers.workModel})`,
          requirements: answers.requirements.split("\n").filter(Boolean),
          sellingPoints: answers.sellingPoints.split("\n").filter(Boolean),
        })
      }
    } catch (err) {
      console.log("[v0] summary build failed:", err)
    } finally {
      setSummaryLoading(false)
    }
  }

  // Persist the finished job order to Supabase, then show the success screen.
  const handleSubmit = async () => {
    if (!summary) return
    setSaving(true)
    setSaveError("")

    // In demo mode there's no authenticated business, so skip the DB write.
    if (isDemo) {
      setTimeout(() => {
        setSaving(false)
        setSubmitted(true)
      }, 700)
      return
    }

    const bountyNum = Number.parseFloat(answers.bounty)
    const res = await createJobOrder({
      title: summary.title,
      employmentType: "Full-time",
      workModel: summary.workModel,
      location: business?.location || undefined,
      compensation: summary.compensation,
      requirements: summary.requirements.join("\n"),
      sellingPoints: summary.sellingPoints.join("\n"),
      bountyAmount: Number.isFinite(bountyNum) ? bountyNum : undefined,
      bountyTrigger: "Successful hire",
      summary: summary.summary,
    })
    setSaving(false)
    if (res.success) {
      setSubmitted(true)
    } else {
      setSaveError(res.error || "Couldn't save the job order. Please try again.")
    }
  }

  const canAdvance =
    step === 1
      ? answers.title.trim().length > 0
      : step === 2
        ? answers.compensation.trim().length > 0
        : step === 3
          ? answers.requirements.trim().length > 0
          : answers.sellingPoints.trim().length > 0 && answers.bounty.trim().length > 0

  // ---- Success screen ----
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="size-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-5 shadow-lg">
          <CheckCircle2 className="size-9 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Job order created!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
          Your {summary?.title || "role"} is ready to send to the Cord referral network with a{" "}
          ${answers.bounty} bounty.
        </p>
        <Button onClick={onClose} className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold">
          Back to Hiring
        </Button>
      </div>
    )
  }

  // ---- Summary review screen ----
  if (summary) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setSummary(null)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#FF8C00] mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to questions
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-5 text-[#FF8C00]" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your AI-drafted job order</h2>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{summary.title}</h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-1">
                <DollarSign className="size-4 text-emerald-500" />
                {summary.compensation}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4 text-blue-500" />
                {summary.workModel}
              </span>
              <span className="inline-flex items-center gap-1">
                <Megaphone className="size-4 text-[#FF8C00]" />${answers.bounty} bounty
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{summary.summary}</p>
          </div>

          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Briefcase className="size-4 text-gray-400" />
              Requirements
            </h4>
            <ul className="space-y-1.5">
              {summary.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Lightbulb className="size-4 text-amber-400" />
              Why candidates will want this
            </h4>
            <ul className="space-y-1.5">
              {summary.sellingPoints.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Sparkles className="size-4 text-[#FF8C00] shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full mt-5 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold h-11 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 mr-1.5 animate-spin" />
              Sending to Cord Network...
            </>
          ) : (
            <>
              <Send className="size-4 mr-1.5" />
              Send to Cord Network
            </>
          )}
        </Button>
        {saveError && (
          <p className="text-xs text-red-600 flex items-center justify-center gap-1 mt-3">
            <AlertCircle className="size-3" />
            {saveError}
          </p>
        )}
        <p className="text-[11px] text-center text-gray-400 mt-3">
          Review the details above. AI drafts are editable before launch.
        </p>
      </div>
    )
  }

  // ---- Conversational interview ----
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#FF8C00]"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
          <Bot className="size-4 text-[#FF8C00]" />
          AI Job Wizard
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? "bg-[#FF8C00]" : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      {/* Transcript */}
      <div ref={scrollRef} className="space-y-4 mb-5 max-h-[42vh] overflow-y-auto pr-1">
        {AI_PROMPTS.slice(0, step).map((prompt, i) => (
          <div key={i} className="space-y-3">
            {/* AI bubble */}
            <div className="flex items-start gap-2.5">
              <span className="size-8 rounded-full bg-[#FF8C00] flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="size-4 text-white" />
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-700 px-4 py-2.5 max-w-[85%]">
                <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">{prompt}</p>
              </div>
            </div>

            {/* Echo the owner's prior answers as user bubbles */}
            {i < step - 1 && (
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-[#FF8C00] px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                    {i === 0 && answers.title}
                    {i === 1 && `${answers.compensation} · ${answers.workModel}`}
                    {i === 2 && answers.requirements}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {suggestLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 pl-10">
            <Loader2 className="size-3.5 animate-spin" />
            Analyzing the role to tailor my questions...
          </div>
        )}
      </div>

      {/* AI suggestion chips for the current step */}
      {suggestion && step > 1 && (
        <div className="mb-4 rounded-xl border border-[#FF8C00]/30 bg-orange-50 dark:bg-[#FF8C00]/10 p-3">
          <p className="text-[11px] font-semibold text-[#FF8C00] flex items-center gap-1 mb-1.5">
            <Sparkles className="size-3" />
            AI suggestion for a {suggestion.normalizedTitle}
          </p>
          {step === 2 && (
            <button
              onClick={() => update({ compensation: suggestion.typicalCompensation })}
              className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#FF8C00] text-left"
            >
              Typical range: <span className="font-semibold">{suggestion.typicalCompensation}</span> — tap to use
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => update({ requirements: suggestion.suggestedRequirements })}
              className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#FF8C00] text-left"
            >
              {suggestion.suggestedRequirements}
              <span className="block mt-1 font-semibold text-[#FF8C00]">Tap to use this draft</span>
            </button>
          )}
          {step === 4 && (
            <div className="space-y-1.5">
              <button
                onClick={() => update({ sellingPoints: suggestion.suggestedSellingPoints })}
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#FF8C00] text-left block"
              >
                {suggestion.suggestedSellingPoints}
                <span className="block mt-1 font-semibold text-[#FF8C00]">Tap to use these selling points</span>
              </button>
              <button
                onClick={() => update({ bounty: String(suggestion.suggestedBounty) })}
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-[#FF8C00] text-left"
              >
                Suggested bounty: <span className="font-semibold">${suggestion.suggestedBounty}</span> — tap to use
              </button>
            </div>
          )}
        </div>
      )}

      {/* Input area for the current step */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        {step === 1 && (
          <Input
            autoFocus
            value={answers.title}
            onChange={(e) => update({ title: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && canAdvance && goNext()}
            placeholder="e.g., Senior CNC Machinist, Residential HVAC Tech, Project Manager..."
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Input
              autoFocus
              value={answers.compensation}
              onChange={(e) => update({ compensation: e.target.value })}
              placeholder="e.g., $85k - $95k / yr or $35/hr"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <Select value={answers.workModel} onValueChange={(v) => update({ workModel: v as WorkModel })}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white">
                <SelectValue placeholder="Work model" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white">
                {(["On-Site", "Hybrid", "Remote"] as WorkModel[]).map((m) => (
                  <SelectItem key={m} value={m} className="text-slate-900 dark:text-white">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 3 && (
          <Textarea
            autoFocus
            value={answers.requirements}
            onChange={(e) => update({ requirements: e.target.value })}
            placeholder="e.g., Must have EPA Universal certification and 3+ years field experience troubleshooting commercial chillers..."
            className="min-h-[120px] resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        )}

        {step === 4 && (
          <div className="space-y-3">
            <Textarea
              autoFocus
              value={answers.sellingPoints}
              onChange={(e) => update({ sellingPoints: e.target.value })}
              placeholder="e.g., 4-day work weeks, company truck provided from day one, rapid track to management..."
              className="min-h-[100px] resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                type="number"
                value={answers.bounty}
                onChange={(e) => update({ bounty: e.target.value })}
                placeholder="Bounty paid to Cord upon successful hire"
                className="pl-9 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        <Button
          onClick={goNext}
          disabled={!canAdvance || summaryLoading}
          className="w-full mt-4 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold disabled:opacity-50"
        >
          {summaryLoading ? (
            <>
              <Loader2 className="size-4 mr-1.5 animate-spin" />
              Drafting your job order...
            </>
          ) : step === TOTAL_STEPS ? (
            <>
              <Sparkles className="size-4 mr-1.5" />
              Generate Job Order
            </>
          ) : (
            <>
              Continue
              <Send className="size-4 ml-1.5" />
            </>
          )}
        </Button>
      </div>

      {step > 1 && (
        <button
          onClick={() => {
            setStep(1)
            setSuggestion(null)
          }}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mx-auto mt-4"
        >
          <RotateCcw className="size-3" />
          Start over
        </button>
      )}
    </div>
  )
}
