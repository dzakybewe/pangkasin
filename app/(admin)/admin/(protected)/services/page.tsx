import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createServerClient } from "@/lib/supabase/server"
import { getServicesByShop } from "@/lib/supabase/queries/services"
import { ServicesManager } from "@/components/admin/ServicesManager"

export default async function ServicesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barbershop_id")
    .eq("id", user.id)
    .single()

  if (!userData?.barbershop_id) redirect("/admin/login")

  const [t, services] = await Promise.all([
    getTranslations("admin.services"),
    getServicesByShop(userData.barbershop_id),
  ])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
      <ServicesManager services={services} />
    </div>
  )
}
