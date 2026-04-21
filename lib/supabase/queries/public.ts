import type { Barbershop, Location, Barber, Service } from "@/types"
import { createServerClient } from "@/lib/supabase/server"

export interface PublicShopData {
  shop: Barbershop
  location: Location | null
  services: Service[]
  barbers: Barber[]
  galleryUrls: string[]
}

export async function getPublicShopData(slug: string): Promise<PublicShopData | null> {
  const supabase = await createServerClient()

  const { data: shop, error: shopError } = await supabase
    .from("barbershops")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (shopError || !shop) return null

  const [
    { data: location },
    { data: services },
    { data: barbers },
    { data: galleryFiles },
  ] = await Promise.all([
    supabase
      .from("locations")
      .select("*")
      .eq("barbershop_id", shop.id)
      .eq("is_active", true)
      .single(),
    supabase
      .from("services")
      .select("*")
      .eq("barbershop_id", shop.id)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("barbers")
      .select("*")
      .eq("barbershop_id", shop.id)
      .eq("is_active", true)
      .order("name"),
    supabase.storage.from("gallery").list(shop.id, { limit: 12 }),
  ])

  const galleryUrls = (galleryFiles ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(`${shop.id}/${f.name}`)
      return publicUrl
    })

  return {
    shop,
    location: location ?? null,
    services: services ?? [],
    barbers: barbers ?? [],
    galleryUrls,
  }
}
