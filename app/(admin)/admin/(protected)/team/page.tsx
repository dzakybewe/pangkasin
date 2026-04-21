import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createServerClient } from "@/lib/supabase/server"
import { getBarbersByShop, getBarberServicesForBarber } from "@/lib/supabase/queries/barbers"
import { getServicesByShop } from "@/lib/supabase/queries/services"
import { TeamManager } from "@/components/admin/TeamManager"
import type { BarberService } from "@/types"

export default async function TeamPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barbershop_id")
    .eq("id", user.id)
    .single()

  if (!userData?.barbershop_id) redirect("/admin/login")

  const t = await getTranslations("admin.team")

  const [barbers, services] = await Promise.all([
    getBarbersByShop(userData.barbershop_id),
    getServicesByShop(userData.barbershop_id),
  ])

  const barberServicesEntries = await Promise.all(
    barbers.map(async (b) => {
      const svcList = await getBarberServicesForBarber(b.id, userData.barbershop_id)
      return [b.id, svcList] as [string, (BarberService & { service_name: string })[]]
    })
  )
  const barberServicesMap = Object.fromEntries(barberServicesEntries)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
      <TeamManager
        barbershopId={userData.barbershop_id}
        barbers={barbers}
        services={services}
        barberServicesMap={barberServicesMap}
      />
    </div>
  )
}
