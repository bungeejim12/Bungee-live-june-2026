import { generateText, Output } from "ai"
import { z } from "zod"

export const maxDuration = 30

// Two modes:
//  - action "suggest": given a job title, return smart hints to help the owner answer.
//  - action "summary": given all collected answers, return a polished job order + posting copy.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const action = body?.action as "suggest" | "summary"

    if (action === "suggest") {
      const title = String(body?.title ?? "").trim()
      if (!title) {
        return Response.json({ error: "A job title is required." }, { status: 400 })
      }

      const businessName = String(body?.businessName ?? "").trim()
      const location = String(body?.location ?? "").trim()
      const contextLine =
        (businessName ? `The hiring company is "${businessName}". ` : "") +
        (location
          ? `They are located in ${location}, so tailor compensation to that regional market. `
          : "")

      const { experimental_output } = await generateText({
        model: "openai/gpt-5.4-mini",
        system:
          "You are an expert technical recruiter helping a small business owner scope a job order. " +
          "Be concrete and realistic for the specific role and US labor market. Never invent legal claims. " +
          "Keep every field short and practical.",
        prompt:
          `The owner wants to hire for this role: "${title}".\n` +
          (contextLine ? contextLine + "\n" : "") +
          "Generate helpful scoping hints they can use as a starting point.",
        experimental_output: Output.object({
          schema: z.object({
            normalizedTitle: z
              .string()
              .describe("A clean, standardized version of the job title."),
            typicalCompensation: z
              .string()
              .describe("A realistic comp range, e.g. '$28-$38/hr' or '$70k-$95k/yr'."),
            suggestedRequirements: z
              .string()
              .describe("2-4 sentences of likely non-negotiable skills, certs, or experience."),
            suggestedSellingPoints: z
              .string()
              .describe("2-3 compelling reasons a top candidate would take this job."),
            suggestedBounty: z
              .number()
              .describe("A reasonable referral bounty in whole US dollars (e.g. 500)."),
          }),
        }),
      })

      return Response.json({ data: experimental_output })
    }

    if (action === "summary") {
      const answers = body?.answers ?? {}
      const { experimental_output } = await generateText({
        model: "openai/gpt-5.4-mini",
        system:
          "You are an expert recruiter writing a crisp, professional job order from an owner's raw answers. " +
          "Do not invent compensation, requirements, or benefits that were not provided. " +
          "Polish wording, fix grammar, and keep it concise and scannable.",
        prompt:
          "Create a polished job order from these answers:\n" +
          JSON.stringify(answers, null, 2),
        experimental_output: Output.object({
          schema: z.object({
            title: z.string(),
            compensation: z.string(),
            workModel: z.string(),
            summary: z
              .string()
              .describe("A 1-2 sentence overview of the role suitable for a posting header."),
            requirements: z
              .array(z.string())
              .describe("3-6 concise bullet points of must-have requirements."),
            sellingPoints: z
              .array(z.string())
              .describe("2-5 concise bullet points on why a candidate would want this role."),
          }),
        }),
      })

      return Response.json({ data: experimental_output })
    }

    return Response.json({ error: "Unknown action." }, { status: 400 })
  } catch (err) {
    console.log("[v0] job-order AI error:", err)
    return Response.json(
      { error: "The AI assistant is unavailable right now. Please try again." },
      { status: 500 },
    )
  }
}
