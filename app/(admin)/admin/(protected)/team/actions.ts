"use server"

import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import {
  createBarber,
  updateBarber,
  deleteBarber,
  upsertBarberService,
} from "@/lib/supabase/queries/barbers"

async function getAuthBarbershopId(): Promise<string> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  const { data } = await supabase
    .from("users")
    .select("barbershop_id")
    .eq("id", user.id)
    .single()
  if (!data?.barbershop_id) redirect("/admin/login")
  return data.barbershop_id
}

export async function createBarberAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const barbershopId = await getAuthBarbershopId()
    await createBarber(barbershopId, {
      name: formData.get("name") as string,
      bio: (formData.get("bio") as string) || null,
      specialty: (formData.get("specialty") as string) || null,
      photo_url: (formData.get("photo_url") as string) || null,
      is_active: true,
      location_id: null,
    })
    return { success: true }
  } catch {
    return { success: false, error: "Failed to create barber" }
  }
}

export async function updateBarberAction(
  barberId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const barbershopId = await getAuthBarbershopId()
    await updateBarber(barberId, barbershopId, {
      name: formData.get("name") as string,
      bio: (formData.get("bio") as string) || null,
      specialty: (formData.get("specialty") as string) || null,
      photo_url: (formData.get("photo_url") as string) || null,
    })
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update barber" }
  }
}

export async function deleteBarberAction(barberId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const barbershopId = await getAuthBarbershopId()
    await deleteBarber(barberId, barbershopId)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete barber" }
  }
}

export async function upsertBarberServiceAction(
  barberId: string,
  serviceId: string,
  price: number,
  isAvailable: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await upsertBarberService(barberId, serviceId, price, isAvailable)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update service" }
  }
}
