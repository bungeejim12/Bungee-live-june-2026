import { generateText, Output } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Strip HTML to readable text and cap length so we stay within token limits.
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000)
}

const ExtractionSchema = z.object({
  name: z.string().describe("A concise, marketable name for the primary product or service offered."),
  summary: z.string().describe("A punchy 1-2 sentence elevator pitch a referrer could say out loud."),
  deepDive: z
    .string()
    .describe("A detailed paragraph covering key features, specs, scope of work, inclusions, and what makes it valuable."),
  audienceTags: z
    .array(z.string())
    .describe("3 to 5 short target-audience labels, e.g. 'Homeowners', 'Small Businesses', 'New Parents'."),
  customerIncentive: z
    .string()
    .describe("A compelling suggested perk for the referred customer, e.g. '10% off the first order'."),
  offeringType: z.enum(["product", "service"]).describe("Whether this is primarily a physical/digital product or a service."),
})

export async function POST(req: Request) {
  try {
    const { url, text } = await req.json()

    let sourceContent = ""
    let sourceLabel = ""

    if (url && typeof url === "string") {
      // Normalize URL
      let target = url.trim()
      if (!/^https?:\/\//i.test(target)) target = `https://${target}`

      try {
        const res = await fetch(target, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; BungeeBot/1.0; +https://justbungee.com)",
            Accept: "text/html,application/xhtml+xml",
          },
          signal: AbortSignal.timeout(12000),
        })
        if (!res.ok) {
          return Response.json(
            { error: `Could not reach that page (status ${res.status}). Try pasting your description instead.` },
            { status: 422 },
          )
        }
        const html = await res.text()
        sourceContent = htmlToText(html)
        sourceLabel = `the website ${target}`
      } catch (err) {
        console.log("[v0] AI assist scrape error:", err)
        return Response.json(
          { error: "We couldn't load that website. Check the URL or paste your description instead." },
          { status: 422 },
        )
      }
    } else if (text && typeof text === "string") {
      sourceContent = text.trim().slice(0, 12000)
      sourceLabel = "the description provided by the business"
    } else {
      return Response.json({ error: "Provide a website URL or some text to analyze." }, { status: 400 })
    }

    if (sourceContent.length < 40) {
      return Response.json(
        { error: "There wasn't enough content to analyze. Try a different URL or add more detail." },
        { status: 422 },
      )
    }

    const { experimental_output } = await generateText({
      model: "openai/gpt-5.4-mini",
      experimental_output: Output.object({ schema: ExtractionSchema }),
      system:
        "You are a marketing copywriter for Bungee, a word-of-mouth referral platform. " +
        "Businesses list products and services, and trusted local 'Cords' refer them to earn bounties. " +
        "Given raw content from a business, extract and craft compelling, accurate marketing copy that a " +
        "referrer could use. Keep it honest to the source content; never invent prices or fake claims. " +
        "Write in clear, energetic, plain language.",
      prompt:
        `Analyze the following content from ${sourceLabel} and produce structured marketing fields ` +
        `for one primary offering.\n\n--- CONTENT START ---\n${sourceContent}\n--- CONTENT END ---`,
    })

    return Response.json({ data: experimental_output })
  } catch (err) {
    console.log("[v0] AI assist error:", err)
    return Response.json({ error: "The AI assistant ran into a problem. Please try again." }, { status: 500 })
  }
}
