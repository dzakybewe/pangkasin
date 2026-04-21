import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getShopBySlug } from "@/lib/supabase/queries/barbershops"
import { getBarberById } from "@/lib/supabase/queries/barbers"
import { createServerClient } from "@/lib/supabase/server"
import { ScheduleClient } from "@/components/booking/ScheduleClient"

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ service_id?: string; barber_id?: string }>
}) {
  const { service_id, barber_id } = await searchParams
  if (!service_id || !barber_id) redirect("/booking")

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

  const barber = barber_id !== "any"
    ? await getBarberById(barber_id, shop.id)
    : null

  return (
    <ScheduleClient
      barbershopId={shop.id}
      service={service}
      barber={barber}
      barberId={barber_id}
    />
  )
}
