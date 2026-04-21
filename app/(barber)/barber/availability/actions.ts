"use server"

import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { upsertSchedule, createBlockedDate, deleteBlockedDate } from "@/lib/supabase/queries/availability"
import type { Schedule } from "@/types"

async function getAuthBarberId(): Promise<string> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  const { data } = await supabase
    .from("users")
    .select("barber_id")
    .eq("id", user.id)
    .single()
  if (!data?.barber_id) redirect("/admin/login")
  return data.barber_id
}

export async function saveScheduleAction(
  barberId: string,
  schedules: Omit<Schedule, "id">[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const authBarberId = await getAuthBarberId()
    if (authBarberId !== barberId) return { success: false, error: "Unauthorized" }
    await upsertSchedule(barberId, schedules)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to save schedule" }
  }
}

export async function addBlockedDateAction(
  barberId: string,
  date: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const authBarberId = await getAuthBarberId()
    if (authBarberId !== barberId) return { success: false, error: "Unauthorized" }
    await createBlockedDate(barberId, date, reason || undefined)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to add blocked date" }
  }
}

export async function deleteBlockedDateAction(
  id: string,
  barberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const authBarberId = await getAuthBarberId()
    if (authBarberId !== barberId) return { success: false, error: "Unauthorized" }
    await deleteBlockedDate(id, barberId)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete blocked date" }
  }
}
