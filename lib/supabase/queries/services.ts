import type { Service } from "@/types"
import { createServerClient } from "@/lib/supabase/server"

export async function getServicesByShop(barbershopId: string): Promise<Service[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("is_active", true)
    .order("name")
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createService(
  barbershopId: string,
  data: Omit<Service, "id" | "barbershop_id" | "is_active">
): Promise<Service> {
  const supabase = await createServerClient()
  const { data: service, error } = await supabase
    .from("services")
    .insert({ ...data, barbershop_id: barbershopId })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return service
}

export async function updateService(
  id: string,
  barbershopId: string,
  updates: Partial<Service>
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
  if (error) throw new Error(error.message)
}

export async function deleteService(id: string, barbershopId: string): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("services")
    .update({ is_active: false })
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
  if (error) throw new Error(error.message)
}
