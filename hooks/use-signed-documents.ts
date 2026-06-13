"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient, isSupabaseClientConfigured } from "@/lib/supabase/client"

export interface SignedDocumentRow {
  id?: string
  user_id?: string
  doc_key: string
  doc_title: string
  doc_version: string
  audience: string
  signer_name: string
  signed_at: string
}

/**
 * Loads the signed documents for the current user (or all users when `allUsers`
 * is set, for the admin "Eye in the Sky" compliance view).
 */
export function useSignedDocuments(options?: { allUsers?: boolean; isDemo?: boolean }) {
  const allUsers = options?.allUsers ?? false
  const isDemo = options?.isDemo ?? false
  const [documents, setDocuments] = useState<SignedDocumentRow[]>([])
  const [loading, setLoading] = useState(!isDemo)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (isDemo || !isSupabaseClientConfigured()) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      let query = supabase
        .from("signed_documents")
        .select("id, user_id, doc_key, doc_title, doc_version, audience, signer_name, signed_at")
        .order("signed_at", { ascending: false })

      if (!allUsers) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setDocuments([])
          setLoading(false)
          return
        }
        query = query.eq("user_id", user.id)
      }

      const { data, error: queryError } = await query
      if (queryError) throw queryError
      setDocuments((data as SignedDocumentRow[]) ?? [])
    } catch (e) {
      console.error("[v0] failed to load signed documents:", e)
      setError(e instanceof Error ? e.message : "Failed to load signed documents.")
    } finally {
      setLoading(false)
    }
  }, [allUsers, isDemo])

  useEffect(() => {
    load()
  }, [load])

  // Optimistically merge a freshly signed record without a refetch.
  const addLocal = useCallback((row: SignedDocumentRow) => {
    setDocuments((prev) => {
      const filtered = prev.filter(
        (d) => !(d.doc_key === row.doc_key && d.doc_version === row.doc_version && d.user_id === row.user_id),
      )
      return [row, ...filtered]
    })
  }, [])

  return { documents, loading, error, reload: load, addLocal }
}
