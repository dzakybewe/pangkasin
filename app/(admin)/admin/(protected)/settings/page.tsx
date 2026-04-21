import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createServerClient } from "@/lib/supabase/server"
import { getShopWithLocation } from "@/lib/supabase/queries/barbershops"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function SettingsPage() {
  const t = await getTranslations("admin.settings")
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barbershop_id")
    .eq("id", user.id)
    .single()

  if (!userData) redirect("/admin/login")

  const data = await getShopWithLocation(userData.barbershop_id)
  if (!data) redirect("/admin/login")

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-text-primary mb-8">{t("title")}</h1>
      <SettingsForm shop={data.shop} location={data.location} />
    </div>
  )
}
