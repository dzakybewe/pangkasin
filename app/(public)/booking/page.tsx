import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { getShopBySlug } from "@/lib/supabase/queries/barbershops"
import { getServicesByShop } from "@/lib/supabase/queries/services"
import { SelectServiceClient } from "@/components/booking/SelectServiceClient"

export default async function SelectServicePage() {
  const headersList = await headers()
  const slug = headersList.get("x-shop-slug")
  if (!slug) notFound()

  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const services = await getServicesByShop(shop.id)

  return <SelectServiceClient services={services} />
}
