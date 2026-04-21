"use server"

import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { createService, updateService, deleteService } from "@/lib/supabase/queries/services"

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

export async function createServiceAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const barbershopId = await getAuthBarbershopId()
    await createService(barbershopId, {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      duration_minutes: Number(formData.get("duration_minutes")),
    })
    return { success: true }
  } catch {
    return { success: false, error: "Failed to create service" }
  }
}

export async function updateServiceAction(
  serviceId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const barbershopId = await getAuthBarbershopId()
    await updateService(serviceId, barbershopId, {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      duration_minutes: Number(formData.get("duration_minutes")),
    })
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update service" }
  }
}

export async function toggleServiceActiveAction(
  serviceId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const barbershopId = await getAuthBarbershopId()
    await updateService(serviceId, barbershopId, { is_active: isActive })
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update service" }
  }
}

export async function deleteServiceAction(serviceId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const barbershopId = await getAuthBarbershopId()
    await deleteService(serviceId, barbershopId)
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete service" }
  }
}
