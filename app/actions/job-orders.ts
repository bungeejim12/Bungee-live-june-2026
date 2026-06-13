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
  /** When true, the order is also routed to the Pro-Bungee recruiter desk. */
  sendToProRecruiters?: boolean
}

export interface CreateJobOrderResult {
  success: boolean
  id?: string
  error?: string
}

export interface JobOrderRecord {
  id: string
  title: string
  work_model: string | null
  location: string | null
  compensation: string | null
  requirements: string | null
  selling_points: string | null
  bounty_amount: number | null
  summary: string | null
  status: string
  send_to_pro_recruiters: boolean
  pro_recruiter_status: string | null
  created_at: string
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
      send_to_pro_recruiters: input.sendToProRecruiters ?? false,
      pro_recruiter_status: input.sendToProRecruiters ? "requested" : null,
    })
    .select("id")
    .single()

  if (error) {
    console.error("[v0] createJobOrder error:", error.message)
    return { success: false, error: "Failed to save the job order. Please try again." }
  }

  return { success: true, id: data.id }
}

/**
 * Fetches job orders that the business routed to the Pro-Bungee recruiter desk.
 * Used by the Managed Recruiting view. RLS scopes rows to the authenticated business.
 */
export async function getProRecruiterJobOrders(): Promise<JobOrderRecord[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("job_orders")
    .select(
      "id, title, work_model, location, compensation, requirements, selling_points, bounty_amount, summary, status, send_to_pro_recruiters, pro_recruiter_status, created_at",
    )
    .eq("send_to_pro_recruiters", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] getProRecruiterJobOrders error:", error.message)
    return []
  }

  return (data ?? []) as JobOrderRecord[]
}
