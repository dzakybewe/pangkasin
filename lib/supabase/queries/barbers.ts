import type { Barber, BarberService, BarberWithServices } from "@/types"
import { createServerClient } from "@/lib/supabase/server"

export async function getBarberServicesForBarber(
  barberId: string,
  barbershopId: string
): Promise<(BarberService & { service_name: string })[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("barber_services")
    .select("*, services(name)")
    .eq("barber_id", barberId)
    .eq("services.barbershop_id", barbershopId)
  if (error) throw new Error(error.message)
  return (data ?? []).map((row) => ({
    ...row,
    service_name: (row.services as { name: string } | null)?.name ?? "",
  }))
}

export async function upsertBarberService(
  barberId: string,
  serviceId: string,
  price: number,
  isAvailable: boolean
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("barber_services")
    .upsert(
      { barber_id: barberId, service_id: serviceId, price, is_available: isAvailable },
      { onConflict: "barber_id,service_id" }
    )
  if (error) throw new Error(error.message)
}

export async function getBarbersByShop(barbershopId: string): Promise<Barber[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("barbers")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("is_active", true)
    .order("name")
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getBarberById(id: string, barbershopId: string): Promise<Barber | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("barbers")
    .select("*")
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
    .single()
  if (error) return null
  return data
}

export async function getBarberWithServices(
  barbershopId: string,
  serviceId: string
): Promise<BarberWithServices[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("barbers")
    .select("*, barber_services!inner(*)")
    .eq("barbershop_id", barbershopId)
    .eq("is_active", true)
    .eq("barber_services.service_id", serviceId)
  if (error) throw new Error(error.message)
  return (data ?? []) as BarberWithServices[]
}

export async function createBarber(
  barbershopId: string,
  data: Omit<Barber, "id" | "barbershop_id">
): Promise<Barber> {
  const supabase = await createServerClient()
  const { data: barber, error } = await supabase
    .from("barbers")
    .insert({ ...data, barbershop_id: barbershopId })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return barber
}

export async function updateBarber(
  id: string,
  barbershopId: string,
  updates: Partial<Barber>
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("barbers")
    .update(updates)
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
  if (error) throw new Error(error.message)
}

export async function deleteBarber(id: string, barbershopId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("barbers")
    .update({ is_active: false })
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
  if (error) throw new Error(error.message)
}
