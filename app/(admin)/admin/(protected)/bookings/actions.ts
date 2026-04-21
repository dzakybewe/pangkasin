"use server"

import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { updateBookingStatus } from "@/lib/supabase/queries/bookings"
import type { BookingStatus } from "@/types"

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/admin/login")

    const { data: userData } = await supabase
      .from("users")
      .select("barbershop_id")
      .eq("id", user.id)
      .single()

    if (!userData?.barbershop_id) return { success: false, error: "Unauthorized" }

    await updateBookingStatus(bookingId, userData.barbershop_id, status)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update booking" }
  }
}
