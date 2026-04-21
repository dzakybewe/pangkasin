import type { Barbershop, Location } from "@/types"
import { createServerClient } from "@/lib/supabase/server"

export async function getShopBySlug(slug: string): Promise<Barbershop | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("barbershops")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()
  if (error) return null
  return data
}

export interface ShopWithLocation {
  shop: Barbershop
  location: Location | null
}

export async function getShopWithLocation(barbershopId: string): Promise<ShopWithLocation | null> {
  const supabase = await createServerClient()
  const { data: shop, error: shopError } = await supabase
    .from("barbershops")
    .select("*")
    .eq("id", barbershopId)
    .single()
  if (shopError || !shop) return null

  const { data: location } = await supabase
    .from("locations")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("is_active", true)
    .single()

  return { shop, location: location ?? null }
}

export async function updateShopSettings(
  id: string,
  updates: Partial<Barbershop>
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("barbershops")
    .update(updates)
    .eq("id", id)
  if (error) throw new Error(error.message)
}

export async function upsertLocation(
  barbershopId: string,
  data: Omit<Location, "id" | "barbershop_id" | "is_active">
): Promise<void> {
  const supabase = await createServerClient()
  const { data: existing } = await supabase
    .from("locations")
    .select("id")
    .eq("barbershop_id", barbershopId)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("locations")
      .update(data)
      .eq("id", existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from("locations")
      .insert({ ...data, barbershop_id: barbershopId })
    if (error) throw new Error(error.message)
  }
}
