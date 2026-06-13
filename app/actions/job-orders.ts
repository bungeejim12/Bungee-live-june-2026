"use server"

import { createClient } from "@/lib/supabase/server"

export interface CreateJobOrderInput {
  title: string
  employmentType?: string
  workModel?: string
  location?: string
  compensation?: string
  requirements?: string
  sellingPoints?: string
  bountyAmount?: number
  bountyTrigger?: string
  summary?: string
}

export interface CreateJobOrderResult {
  success: boolean
  id?: string
  error?: string
}

/**
 * Persists a conversational AI job order to Supabase.
 * Relies on RLS: the row is scoped to the authenticated business (auth.uid()).
 */
export async function createJobOrder(input: CreateJobOrderInput): Promise<CreateJobOrderResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: "You must be signed in to send a job order." }
  }

  if (!input.title?.trim()) {
    return { success: false, error: "A role title is required." }
  }

  const { data, error } = await supabase
    .from("job_orders")
    .insert({
      business_id: user.id,
      title: input.title.trim(),
      employment_type: input.employmentType?.trim() || null,
      work_model: input.workModel?.trim() || null,
      location: input.location?.trim() || null,
      compensation: input.compensation?.trim() || null,
      requirements: input.requirements?.trim() || null,
      selling_points: input.sellingPoints?.trim() || null,
      bounty_amount: typeof input.bountyAmount === "number" ? input.bountyAmount : null,
      bounty_trigger: input.bountyTrigger?.trim() || null,
      summary: input.summary?.trim() || null,
      status: "active",
    })
    .select("id")
    .single()

  if (error) {
    console.error("[v0] createJobOrder error:", error.message)
    return { success: false, error: "Failed to save the job order. Please try again." }
  }

  return { success: true, id: data.id }
}
