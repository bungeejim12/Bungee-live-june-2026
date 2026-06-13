import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

// Accepts a composite avatar image (base64 data URL), stores it in Blob,
// and saves the resulting URL on the authenticated user's profile.
export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image || typeof image !== "string" || !image.startsWith("data:image")) {
      return NextResponse.json({ error: "Invalid image data." }, { status: 400 })
    }

    // Identify the signed-in user from their Supabase session.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "You must be signed in to save an avatar." }, { status: 401 })
    }

    // Convert the data URL to a Buffer.
    const base64 = image.split(",")[1] ?? ""
    const buffer = Buffer.from(base64, "base64")

    const blob = await put(`avatars/${user.id}-${Date.now()}.png`, buffer, {
      access: "public",
      contentType: "image/png",
    })

    // Persist the avatar URL. Use admin client to bypass RLS reliably.
    const admin = createAdminClient()
    if (admin) {
      const { error } = await admin
        .from("profiles")
        .update({ avatar_url: blob.url, updated_at: new Date().toISOString() })
        .eq("id", user.id)
      if (error) {
        console.error("[v0] save avatar profile update (admin):", error.message)
      }
    } else {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: blob.url, updated_at: new Date().toISOString() })
        .eq("id", user.id)
      if (error) {
        console.error("[v0] save avatar profile update:", error.message)
      }
    }

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] save-avatar error:", error)
    return NextResponse.json({ error: "Could not save your avatar." }, { status: 500 })
  }
}
