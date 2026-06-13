import { NextResponse } from "next/server"
import { clawbackTransaction } from "@/lib/commission-engine"

const ADMIN_PASSWORD = "bungee26"

// Manually trigger a clawback for a refunded transaction. The Stripe webhook
// does this automatically; this route exists for admin/manual reversals.
export async function POST(request: Request) {
  const key = request.headers.get("x-admin-key") ?? ""
  if (key !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { transactionId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.transactionId) {
    return NextResponse.json({ error: "transactionId is required" }, { status: 400 })
  }

  try {
    const result = await clawbackTransaction(body.transactionId)
    return NextResponse.json(result)
  } catch (err) {
    console.error("[v0] clawback failed:", err)
    return NextResponse.json({ error: "Failed to process clawback" }, { status: 500 })
  }
}
