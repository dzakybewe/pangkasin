import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createServerClient } from "@/lib/supabase/server"
import { getScheduleByBarber, getBlockedDates } from "@/lib/supabase/queries/availability"
import { AvailabilityManager } from "@/components/admin/AvailabilityManager"
import {
  saveScheduleAction,
  addBlockedDateAction,
  deleteBlockedDateAction,
} from "./actions"

export default async function BarberAvailabilityPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barber_id")
    .eq("id", user.id)
    .single()

  if (!userData?.barber_id) redirect("/admin/login")

  const today = new Date().toISOString().split("T")[0]

  const [t, schedules, blockedDates] = await Promise.all([
    getTranslations("barber.availability"),
    getScheduleByBarber(userData.barber_id),
    getBlockedDates(userData.barber_id, today),
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
        <p className="text-text-secondary text-sm mt-1">{t("subtitle")}</p>
      </div>
      <AvailabilityManager
        barberId={userData.barber_id}
        barberName=""
        initialSchedules={schedules}
        initialBlockedDates={blockedDates}
        saveScheduleAction={saveScheduleAction}
        addBlockedDateAction={addBlockedDateAction}
        deleteBlockedDateAction={deleteBlockedDateAction}
      />
    </div>
  )
}
