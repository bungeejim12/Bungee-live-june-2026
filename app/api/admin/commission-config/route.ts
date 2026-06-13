import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const ADMIN_PASSWORD = "bungee26"

interface TierInput {
  label: string
  startMonth: number
  endMonth: number
  rate: number
}

function authorized(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key") ?? request.headers.get("x-admin-key") ?? ""
  return key === ADMIN_PASSWORD
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service key not configured" }, { status: 503 })
  }

  const { data, error } = await supabase
    .from("commission_config")
    .select("service_fee_rate, window_months, tiers, updated_at")
    .eq("id", 1)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Config not found" }, { status: 500 })
  }

  return NextResponse.json({
    serviceFeeRate: Number(data.service_fee_rate),
    windowMonths: Number(data.window_months),
    tiers: data.tiers,
    updatedAt: data.updated_at,
  })
}

export async function PUT(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { serviceFeeRate?: number; windowMonths?: number; tiers?: TierInput[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { serviceFeeRate, windowMonths, tiers } = body

  // Validation — these values sit directly in the money path.
  if (typeof serviceFeeRate !== "number" || serviceFeeRate < 0 || serviceFeeRate > 1) {
    return NextResponse.json({ error: "serviceFeeRate must be a fraction between 0 and 1" }, { status: 400 })
  }
  if (typeof windowMonths !== "number" || windowMonths < 1 || windowMonths > 120) {
    return NextResponse.json({ error: "windowMonths must be between 1 and 120" }, { status: 400 })
  }
  if (!Array.isArray(tiers) || tiers.length === 0) {
    return NextResponse.json({ error: "At least one tier is required" }, { status: 400 })
  }
  for (const t of tiers) {
    if (
      typeof t.label !== "string" ||
      typeof t.startMonth !== "number" ||
      typeof t.endMonth !== "number" ||
      typeof t.rate !== "number" ||
      t.startMonth < 1 ||
      t.endMonth < t.startMonth ||
      t.rate < 0 ||
      t.rate > 1
    ) {
      return NextResponse.json(
        { error: "Each tier needs a label, valid month range, and a rate between 0 and 1" },
        { status: 400 },
      )
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service key not configured" }, { status: 503 })
  }

  const { error } = await supabase
    .from("commission_config")
    .update({
      service_fee_rate: serviceFeeRate,
      window_months: windowMonths,
      tiers,
    })
    .eq("id", 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
