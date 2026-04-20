import type { Schedule, BlockedDate } from "@/types"
import { createServerClient } from "@/lib/supabase/server"

export async function getScheduleByBarber(barberId: string): Promise<Schedule[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("barber_id", barberId)
    .order("day_of_week")
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function upsertSchedule(
  barberId: string,
  schedules: Omit<Schedule, "id">[]
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("schedules")
    .upsert(
      schedules.map((s) => ({ ...s, barber_id: barberId })),
      { onConflict: "barber_id,day_of_week" }
    )
  if (error) throw new Error(error.message)
}

export async function getBlockedDates(
  barberId: string,
  fromDate?: string
): Promise<BlockedDate[]> {
  const supabase = await createServerClient()
  let query = supabase
    .from("blocked_dates")
    .select("*")
    .eq("barber_id", barberId)
    .order("date")
  if (fromDate) query = query.gte("date", fromDate)
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createBlockedDate(
  barberId: string,
  date: string,
  reason?: string
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("blocked_dates")
    .insert({ barber_id: barberId, date, reason: reason ?? null })
  if (error) throw new Error(error.message)
}

export async function deleteBlockedDate(id: string, barberId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("blocked_dates")
    .delete()
    .eq("id", id)
    .eq("barber_id", barberId)
  if (error) throw new Error(error.message)
}
