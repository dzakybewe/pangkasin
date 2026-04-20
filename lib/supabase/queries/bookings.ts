import type { Booking, BookingStatus, BookingWithDetails } from "@/types"
import { createServerClient } from "@/lib/supabase/server"

export async function getBookingsByShop(
  barbershopId: string,
  filters?: { status?: BookingStatus; barberId?: string; date?: string }
): Promise<BookingWithDetails[]> {
  const supabase = await createServerClient()
  let query = supabase
    .from("bookings")
    .select("*, barber:barbers(id,name,photo_url), service:services(id,name,duration_minutes)")
    .eq("barbershop_id", barbershopId)
    .order("datetime", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.barberId) query = query.eq("barber_id", filters.barberId)
  if (filters?.date) {
    const start = `${filters.date}T00:00:00`
    const end = `${filters.date}T23:59:59`
    query = query.gte("datetime", start).lte("datetime", end)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as BookingWithDetails[]
}

export async function getBookingsByBarber(
  barberId: string,
  barbershopId: string
): Promise<BookingWithDetails[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*, barber:barbers(id,name,photo_url), service:services(id,name,duration_minutes)")
    .eq("barber_id", barberId)
    .eq("barbershop_id", barbershopId)
    .in("status", ["confirmed", "pending"])
    .order("datetime")
  if (error) throw new Error(error.message)
  return (data ?? []) as BookingWithDetails[]
}

export async function createBooking(
  data: Omit<Booking, "id" | "created_at">
): Promise<Booking> {
  const supabase = await createServerClient()
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return booking
}

export async function updateBookingStatus(
  id: string,
  barbershopId: string,
  status: BookingStatus
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
  if (error) throw new Error(error.message)
}

export async function getAvailableSlots(
  barberId: string,
  date: string
): Promise<string[]> {
  const supabase = await createServerClient()
  const dayOfWeek = new Date(date).getDay()

  const [scheduleRes, bookingsRes, blockedRes] = await Promise.all([
    supabase
      .from("schedules")
      .select("*")
      .eq("barber_id", barberId)
      .eq("day_of_week", dayOfWeek)
      .eq("is_working", true)
      .single(),
    supabase
      .from("bookings")
      .select("datetime")
      .eq("barber_id", barberId)
      .gte("datetime", `${date}T00:00:00`)
      .lte("datetime", `${date}T23:59:59`)
      .in("status", ["confirmed", "pending"]),
    supabase
      .from("blocked_dates")
      .select("date")
      .eq("barber_id", barberId)
      .eq("date", date),
  ])

  if (blockedRes.data?.length || !scheduleRes.data) return []

  const schedule = scheduleRes.data
  const bookedTimes = new Set(
    (bookingsRes.data ?? []).map((b) =>
      new Date(b.datetime).toTimeString().slice(0, 5)
    )
  )

  const slots: string[] = []
  const [openH, openM] = schedule.open_time.split(":").map(Number)
  const [closeH, closeM] = schedule.close_time.split(":").map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  for (let m = openMinutes; m < closeMinutes; m += 30) {
    const h = Math.floor(m / 60)
    const min = m % 60
    const timeStr = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`
    if (!bookedTimes.has(timeStr)) {
      slots.push(timeStr)
    }
  }

  return slots
}
