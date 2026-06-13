import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Must match the Eye in the Sky access password used in the admin dashboard.
const ADMIN_PASSWORD = "bungee26"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key") ?? request.headers.get("x-admin-key") ?? ""

  if (key !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Compliance vault is not configured (missing Supabase service key)." },
      { status: 503 },
    )
  }

  // All signed documents across every account (bypasses RLS via service role).
  const { data: docs, error } = await supabase
    .from("signed_documents")
    .select("id, user_id, doc_key, doc_title, doc_version, audience, signer_name, signed_at")
    .order("signed_at", { ascending: false })

  if (error) {
    console.error("[v0] failed to load signed documents (admin):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Resolve account display info for the unique signers.
  const userIds = Array.from(new Set((docs ?? []).map((d) => d.user_id)))
  const profileMap = new Map<string, { name: string; email: string | null; userType: string | null }>()

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, user_type")
      .in("id", userIds)

    for (const p of profiles ?? []) {
      const name = [p.first_name, p.last_name].filter(Boolean).join(" ").trim()
      profileMap.set(p.id, {
        name: name || p.email || "Unknown account",
        email: p.email ?? null,
        userType: p.user_type ?? null,
      })
    }
  }

  const documents = (docs ?? []).map((d) => {
    const profile = profileMap.get(d.user_id)
    return {
      ...d,
      account_name: profile?.name ?? "Unknown account",
      account_email: profile?.email ?? null,
      account_type: profile?.userType ?? d.audience,
    }
  })

  return NextResponse.json({ documents })
}
