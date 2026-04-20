import type { Barbershop } from "@/types"
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
