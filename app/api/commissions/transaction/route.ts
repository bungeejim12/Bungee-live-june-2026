import { NextResponse } from "next/server"
import { recordCommissionForTransaction } from "@/lib/commission-engine"

// Must match the Eye in the Sky access password.
const ADMIN_PASSWORD = "bungee26"

// Server-to-server endpoint: record a fee-bearing transaction and pay out the
// referral residual. Protected by the admin key so only trusted callers can
// trigger fund movement.
export async function POST(request: Request) {
  const key = request.headers.get("x-admin-key") ?? ""
  if (key !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { transactionId?: string; grossPayout?: number; referredId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { transactionId, grossPayout, referredId } = body
  if (!transactionId || typeof grossPayout !== "number" || grossPayout < 0 || !referredId) {
    return NextResponse.json(
      { error: "transactionId, referredId, and a non-negative grossPayout are required" },
      { status: 400 },
    )
  }

  try {
    const result = await recordCommissionForTransaction({ transactionId, grossPayout, referredId })
    return NextResponse.json(result)
  } catch (err) {
    console.error("[v0] commission transaction failed:", err)
    return NextResponse.json({ error: "Failed to record commission" }, { status: 500 })
  }
}
