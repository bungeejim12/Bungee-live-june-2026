"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, FileText, Loader2, ShieldCheck } from "lucide-react"
import type { LegalDocument } from "@/lib/legal-documents"
import { createClient, isSupabaseClientConfigured } from "@/lib/supabase/client"

export interface SignedRecord {
  doc_key: string
  doc_title: string
  doc_version: string
  signer_name: string
  signed_at: string
}

interface DocumentSignModalProps {
  document: LegalDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called after a successful sign + save so the parent can update its list. */
  onSigned: (record: SignedRecord) => void
  /** Demo mode skips the database write but still simulates completion. */
  isDemo?: boolean
}

export function DocumentSignModal({ document, open, onOpenChange, onSigned, isDemo }: DocumentSignModalProps) {
  const [signerName, setSignerName] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [scrolledToEnd, setScrolledToEnd] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset transient state whenever a new document is opened.
  const resetState = () => {
    setSignerName("")
    setAgreed(false)
    setScrolledToEnd(false)
    setError(null)
    setSubmitting(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetState()
    onOpenChange(next)
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24
    if (reachedBottom) setScrolledToEnd(true)
  }

  const canSign = scrolledToEnd && agreed && signerName.trim().length >= 2 && !submitting

  const handleSign = async () => {
    if (!document || !canSign) return
    setSubmitting(true)
    setError(null)

    const record: SignedRecord = {
      doc_key: document.key,
      doc_title: document.title,
      doc_version: document.version,
      signer_name: signerName.trim(),
      signed_at: new Date().toISOString(),
    }

    try {
      if (!isDemo && isSupabaseClientConfigured()) {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("You must be signed in to sign documents.")

        const { error: insertError } = await supabase.from("signed_documents").upsert(
          {
            user_id: user.id,
            doc_key: document.key,
            doc_title: document.title,
            doc_version: document.version,
            audience: document.audience,
            signer_name: record.signer_name,
            signed_at: record.signed_at,
          },
          { onConflict: "user_id,doc_key,doc_version" },
        )
        if (insertError) throw insertError
      }

      onSigned(record)
      handleOpenChange(false)
    } catch (e) {
      console.error("[v0] document sign failed:", e)
      setError(e instanceof Error ? e.message : "Could not save your signature. Please try again.")
      setSubmitting(false)
    }
  }

  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-left text-lg text-slate-900 dark:text-white">{document.title}</DialogTitle>
              <DialogDescription className="text-left text-slate-500 dark:text-gray-400">
                {document.version} · Please read the full document before signing
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable document body */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[42vh] overflow-y-auto px-6 py-5 text-sm leading-relaxed text-slate-700 dark:text-gray-300"
        >
          <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-slate-600 dark:bg-gray-800 dark:text-gray-400">
            {document.summary}
          </p>
          {document.sections.map((section) => (
            <div key={section.heading} className="mb-4">
              <h4 className="mb-1 font-semibold text-slate-900 dark:text-white">{section.heading}</h4>
              <p>{section.body}</p>
            </div>
          ))}
          <p className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-gray-700 dark:text-gray-500">
            End of document. By signing below you agree to the terms above as of the date of signature.
          </p>
        </div>

        {/* Signing controls */}
        <div className="space-y-4 border-t border-slate-200 bg-slate-50 px-6 py-5 dark:border-gray-700 dark:bg-gray-800">
          {!scrolledToEnd && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Scroll to the end of the document to enable signing.
            </p>
          )}

          <div className="flex items-start gap-3">
            <Checkbox
              id="legal-ack"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
              disabled={!scrolledToEnd}
              className="mt-0.5"
            />
            <Label
              htmlFor="legal-ack"
              className="text-sm font-normal leading-snug text-slate-700 dark:text-gray-300"
            >
              {document.acknowledgment}
            </Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signer-name" className="text-sm text-slate-700 dark:text-gray-300">
              Type your full legal name to sign
            </Label>
            <Input
              id="signer-name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="e.g. Jordan Alvarez"
              disabled={!scrolledToEnd}
              autoComplete="name"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-gray-500">
              <ShieldCheck className="size-3.5" />
              Signature is recorded with a timestamp.
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => handleOpenChange(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button
                onClick={handleSign}
                disabled={!canSign}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Sign &amp; Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
