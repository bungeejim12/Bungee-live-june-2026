"use server"

import { createClient } from "@/lib/supabase/server"

export type RewardType = "flat" | "percentage" | "custom"
export type BountyCategory = "recruiting" | "services" | "products"

export interface CreateBountyInput {
  category: BountyCategory
  title: string
  description?: string
  department?: string
  locationStyle?: string
  targetPersona?: string
  keySellingPoints?: string
  websiteUrl?: string
  imageUrl?: string
  rewardType: RewardType
  rewardAmount?: number
  rewardPercentage?: number
  rewardCustomText?: string
  bungeeReward?: number
  corporateFee?: number
  totalEscrow?: number
}

export interface CreateBountyResult {
  success: boolean
  id?: string
  error?: string
}

/**
 * Persists a referral bounty campaign to Supabase.
 * Relies on RLS: the row is scoped to the authenticated business (auth.uid()).
 */
export async function createBounty(input: CreateBountyInput): Promise<CreateBountyResult> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: "You must be signed in to launch a campaign." }
  }

  if (!input.title?.trim()) {
    return { success: false, error: "A title is required." }
  }

  // Only persist the reward field relevant to the selected reward type.
  const rewardAmount = input.rewardType === "flat" ? input.rewardAmount ?? null : null
  const rewardPercentage = input.rewardType === "percentage" ? input.rewardPercentage ?? null : null
  const rewardCustomText = input.rewardType === "custom" ? input.rewardCustomText?.trim() || null : null

  const { data, error } = await supabase
    .from("bounties")
    .insert({
      business_id: user.id,
      category: input.category,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      department: input.department?.trim() || null,
      location_style: input.locationStyle?.trim() || null,
      target_persona: input.targetPersona?.trim() || null,
      key_selling_points: input.keySellingPoints?.trim() || null,
      website_url: input.websiteUrl?.trim() || null,
      image_url: input.imageUrl?.trim() || null,
      reward_type: input.rewardType,
      reward_amount: rewardAmount,
      reward_percentage: rewardPercentage,
      reward_custom_text: rewardCustomText,
      bungee_reward: input.bungeeReward ?? 0,
      corporate_fee: input.corporateFee ?? 0,
      total_escrow: input.totalEscrow ?? 0,
      status: "active",
    })
    .select("id")
    .single()

  if (error) {
    console.error("[v0] createBounty error:", error.message)
    return { success: false, error: "Failed to save the campaign. Please try again." }
  }

  return { success: true, id: data.id }
}
