"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export type WaitlistEntry = {
  id?: string
  full_name: string
  company_name?: string
  email: string
  phone?: string
  zip_code?: string
  website?: string
  account_type: "bungee" | "business" | "both"
  referral_interest?: string
  pain_point?: string
  created_at?: string
}

// In-memory fallback storage when Supabase is unavailable
// Note: This will be cleared on server restart, but works for testing
const fallbackStorage: WaitlistEntry[] = []

export async function addToWaitlist(entry: Omit<WaitlistEntry, "id" | "created_at">) {
  try {
    const supabase = createAdminClient()
    
    if (!supabase) {
      console.error("[v0] Supabase admin client not available")
      // Fallback to in-memory storage
      const fallbackEntry: WaitlistEntry = {
        ...entry,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }
      fallbackStorage.push(fallbackEntry)
      return { success: true, data: fallbackEntry, fallback: true }
    }
    
    const { data, error } = await supabase
      .from("waitlist")
      .insert([entry])
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase insert error:", error.message, error.details, error.hint)
      // Fallback to in-memory storage
      const fallbackEntry: WaitlistEntry = {
        ...entry,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }
      fallbackStorage.push(fallbackEntry)
      return { success: true, data: fallbackEntry, fallback: true }
    }

    console.log("[v0] Successfully saved to Supabase:", data.id)
    return { success: true, data }
  } catch (err) {
    console.error("[v0] Waitlist error:", err)
    // Fallback to in-memory storage on any error
    const fallbackEntry: WaitlistEntry = {
      ...entry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }
    fallbackStorage.push(fallbackEntry)
    return { success: true, data: fallbackEntry, fallback: true }
  }
}

export async function getWaitlistEntries() {
  try {
    const supabase = createAdminClient()
    
    if (!supabase) {
      return { success: true, data: [...fallbackStorage].reverse(), fallback: true }
    }
    
    const { data, error } = await supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase fetch error:", error.message)
      return { success: true, data: [...fallbackStorage].reverse(), fallback: true }
    }

    // Merge Supabase data with fallback storage (in case some were saved locally)
    const allData = [...(data || []), ...fallbackStorage]
    return { success: true, data: allData }
  } catch (err) {
    console.error("[v0] Fetch error:", err)
    return { success: true, data: [...fallbackStorage].reverse(), fallback: true }
  }
}

export async function getWaitlistCount() {
  try {
    const supabase = createAdminClient()
    
    if (!supabase) {
      return fallbackStorage.length
    }
    
    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })

    if (error) {
      return fallbackStorage.length
    }

    return (count || 0) + fallbackStorage.length
  } catch {
    return fallbackStorage.length
  }
}

export async function deleteWaitlistEntry(id: string) {
  try {
    const supabase = createAdminClient()
    
    if (!supabase) {
      const index = fallbackStorage.findIndex(e => e.id === id)
      if (index !== -1) {
        fallbackStorage.splice(index, 1)
        return { success: true, fallback: true }
      }
      return { success: false, error: "Database not configured" }
    }
    
    // Try to delete from Supabase
    const { error } = await supabase
      .from("waitlist")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("[v0] Supabase delete error:", error.message)
      // Try to delete from fallback storage
      const index = fallbackStorage.findIndex(e => e.id === id)
      if (index !== -1) {
        fallbackStorage.splice(index, 1)
        return { success: true, fallback: true }
      }
      return { success: false, error: error.message }
    }

    // Also try to remove from fallback storage in case it exists there too
    const fallbackIndex = fallbackStorage.findIndex(e => e.id === id)
    if (fallbackIndex !== -1) {
      fallbackStorage.splice(fallbackIndex, 1)
    }

    return { success: true }
  } catch (err) {
    console.error("[v0] Delete error:", err)
    // Try fallback storage
    const index = fallbackStorage.findIndex(e => e.id === id)
    if (index !== -1) {
      fallbackStorage.splice(index, 1)
      return { success: true, fallback: true }
    }
    return { success: false, error: "Failed to delete entry" }
  }
}
