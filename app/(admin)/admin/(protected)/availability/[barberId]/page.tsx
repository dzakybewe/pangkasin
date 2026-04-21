import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { ChevronLeft } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { getBarberById } from "@/lib/supabase/queries/barbers"
import { getScheduleByBarber, getBlockedDates } from "@/lib/supabase/queries/availability"
import { AvailabilityManager } from "@/components/admin/AvailabilityManager"
import {
  saveScheduleAction,
  addBlockedDateAction,
  deleteBlockedDateAction,
} from "./actions"

export default async function BarberAvailabilityPage({
  params,
}: {
  params: Promise<{ barberId: string }>
}) {
  const { barberId } = await params

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barbershop_id")
    .eq("id", user.id)
    .single()

  if (!userData?.barbershop_id) redirect("/admin/login")

  const today = new Date().toISOString().split("T")[0]

  const [t, barber, schedules, blockedDates] = await Promise.all([
    getTranslations("admin.availability"),
    getBarberById(barberId, userData.barbershop_id),
    getScheduleByBarber(barberId),
    getBlockedDates(barberId, today),
  ])

  if (!barber) notFound()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/availability" className="text-text-muted hover:text-text-primary transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">
          {t("manageAvailability", { name: barber.name })}
        </h1>
      </div>

      <AvailabilityManager
        barberId={barberId}
        barberName={barber.name}
        initialSchedules={schedules}
        initialBlockedDates={blockedDates}
        saveScheduleAction={saveScheduleAction}
        addBlockedDateAction={addBlockedDateAction}
        deleteBlockedDateAction={deleteBlockedDateAction}
      />
    </div>
  )
}
