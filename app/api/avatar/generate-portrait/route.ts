import { experimental_generateImage as generateImage } from "ai"
import { NextResponse } from "next/server"

// Generate an AI portrait from a "hobby or vibe" prompt.
// Returns a base64 data URL the client composites onto the Bungee body.
export async function POST(req: Request) {
  try {
    const { vibe } = await req.json()

    if (!vibe || typeof vibe !== "string" || !vibe.trim()) {
      return NextResponse.json({ error: "Please describe a hobby or vibe." }, { status: 400 })
    }

    const cleanVibe = vibe.trim().slice(0, 120)

    const prompt = [
      `A friendly cartoon avatar portrait representing someone whose vibe is: "${cleanVibe}".`,
      "Head and shoulders only, centered, facing forward, looking at the camera.",
      "Bold clean line-art illustration style, flat colors, simple shapes, expressive face.",
      "Plain solid light gray background, no text, no logos, no border.",
      "The face should be clearly visible and centered for use as a profile picture.",
    ].join(" ")

    const { image } = await generateImage({
      model: "openai/gpt-image-1-mini",
      prompt,
      size: "1024x1024",
    })

    const dataUrl = `data:${image.mediaType ?? "image/png"};base64,${image.base64}`

    return NextResponse.json({ image: dataUrl })
  } catch (error) {
    console.error("[v0] generate-portrait error:", error)
    return NextResponse.json(
      { error: "Could not generate a portrait. Try a different vibe or upload a photo." },
      { status: 500 },
    )
  }
}
