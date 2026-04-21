"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase/server"
import { updateShopSettings, upsertLocation } from "@/lib/supabase/queries/barbershops"

export interface SettingsFormState {
  success: boolean
  error: string | null
}

export async function saveSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: "Unauthorized" }

    const { data: userData } = await supabase
      .from("users")
      .select("barbershop_id")
      .eq("id", user.id)
      .single()
    if (!userData) return { success: false, error: "User not found" }

    const barbershopId = userData.barbershop_id
    const logoUrl = formData.get("logo_url") as string | null
    const shopName = formData.get("shop_name") as string
    const primaryColor = formData.get("primary_color") as string

    await updateShopSettings(barbershopId, {
      name: shopName,
      primary_color: primaryColor,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
    })

    await upsertLocation(barbershopId, {
      name: shopName,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      province: formData.get("province") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || null,
      instagram: (formData.get("instagram") as string) || null,
      whatsapp: (formData.get("whatsapp") as string) || null,
      maps_url: (formData.get("maps_url") as string) || null,
    })

    revalidatePath("/admin/settings")
    return { success: true, error: null }
  } catch (error) {
    console.error("[saveSettingsAction]", error)
    return { success: false, error: "admin.settings.saveError" }
  }
}
