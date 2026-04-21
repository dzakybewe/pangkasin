import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getShopBySlug } from "@/lib/supabase/queries/barbershops"
import { getBarberWithServices } from "@/lib/supabase/queries/barbers"
import { createServerClient } from "@/lib/supabase/server"
import { SelectBarberClient } from "@/components/booking/SelectBarberClient"
import type { BarberWithServices } from "@/types"

export default async function SelectBarberPage({
  searchParams,
}: {
  searchParams: Promise<{ service_id?: string }>
}) {
  const { service_id } = await searchParams
  if (!service_id) redirect("/booking")

  const headersList = await headers()
  const slug = headersList.get("x-shop-slug")
  if (!slug) notFound()

  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const supabase = await createServerClient()
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", service_id)
    .eq("barbershop_id", shop.id)
    .single()

  if (!service) redirect("/booking")

  const barbers = await getBarberWithServices(shop.id, service_id)

  return <SelectBarberClient service={service} barbers={barbers as BarberWithServices[]} />
}
