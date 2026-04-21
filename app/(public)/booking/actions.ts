"use server"

import { headers } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { getShopBySlug } from "@/lib/supabase/queries/barbershops"
import { getAvailableSlots, createBooking } from "@/lib/supabase/queries/bookings"

export async function getSlotsAction(barberId: string, date: string): Promise<string[]> {
  try {
    if (barberId === "any") {
      const headersList = await headers()
      const slug = headersList.get("x-shop-slug")
      if (!slug) return []
      const shop = await getShopBySlug(slug)
      if (!shop) return []

      const supabase = await createServerClient()
      const { data: barbers } = await supabase
        .from("barbers")
        .select("id")
        .eq("barbershop_id", shop.id)
        .eq("is_active", true)

      if (!barbers?.length) return []

      const allSlots = await Promise.all(
        barbers.map((b) => getAvailableSlots(b.id, date))
      )
      const union = new Set(allSlots.flat())
      return Array.from(union).sort()
    }

    return getAvailableSlots(barberId, date)
  } catch {
    return []
  }
}

export interface CreateBookingInput {
  barbershopId: string
  serviceId: string
  barberId: string
  date: string
  time: string
  customerName: string
  customerPhone: string
}

export interface CreateBookingResult {
  success: boolean
  bookingId?: string
  error?: string
}

export async function createBookingAction(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  try {
    let resolvedBarberId = input.barberId

    if (input.barberId === "any") {
      const supabase = await createServerClient()
      const { data: barbers } = await supabase
        .from("barbers")
        .select("id")
        .eq("barbershop_id", input.barbershopId)
        .eq("is_active", true)

      if (!barbers?.length) return { success: false, error: "booking.error.noBarbers" }

      const slotsPerBarber = await Promise.all(
        barbers.map(async (b) => ({
          id: b.id,
          slots: await getAvailableSlots(b.id, input.date),
        }))
      )

      const available = slotsPerBarber.find((b) => b.slots.includes(input.time))
      if (!available) return { success: false, error: "booking.error.slotTaken" }
      resolvedBarberId = available.id
    }

    const datetime = `${input.date}T${input.time}:00`
    const booking = await createBooking({
      barbershop_id: input.barbershopId,
      location_id: null,
      barber_id: resolvedBarberId,
      service_id: input.serviceId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      datetime,
      status: "pending",
      notes: null,
    })

    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("[createBookingAction]", error)
    return { success: false, error: "booking.error.generic" }
  }
}
