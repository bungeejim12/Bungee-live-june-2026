"use client"

import { isSupabaseClientConfigured } from "@/lib/supabase/client"

export function SupabaseConfigBanner() {
  if (isSupabaseClientConfigured()) return null

  return (
    <div className="mx-4 mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">Supabase client not configured</p>
      <p className="mt-1">
        Add <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> from
        Supabase Dashboard → Settings → API Keys, then restart <code className="font-mono text-xs">bun dev</code>.
      </p>
    </div>
  )
}
