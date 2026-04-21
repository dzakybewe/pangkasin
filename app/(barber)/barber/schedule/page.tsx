import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Clock } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { getBookingsByBarber } from "@/lib/supabase/queries/bookings"

export default async function BarberSchedulePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barber_id, barbershop_id")
    .eq("id", user.id)
    .single()

  if (!userData?.barber_id || !userData?.barbershop_id) redirect("/admin/login")

  const [t, bookings] = await Promise.all([
    getTranslations("barber.schedule"),
    getBookingsByBarber(userData.barber_id, userData.barbershop_id),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + 7)

  const todayBookings = bookings.filter((b) => {
    const d = new Date(b.datetime)
    return d >= today && d < new Date(today.getTime() + 86400000)
  })

  const weekBookings = bookings.filter((b) => {
    const d = new Date(b.datetime)
    return d >= today && d <= endOfWeek
  })

  const groupedByDay = weekBookings.reduce<Record<string, typeof weekBookings>>((acc, b) => {
    const day = new Date(b.datetime).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })
    acc[day] = [...(acc[day] ?? []), b]
    return acc
  }, {})

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>

      {/* Today */}
      <section>
        <h2 className="text-text-primary font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          {t("today")}
        </h2>
        {todayBookings.length === 0 ? (
          <p className="text-text-muted text-sm">{t("noAppointments")}</p>
        ) : (
          <div className="space-y-2">
            {todayBookings.map((b) => (
              <div key={b.id} className="bg-bg-surface border border-border rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="text-primary font-semibold text-sm w-12 shrink-0">
                  {new Date(b.datetime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium">{b.customer_name}</p>
                  <p className="text-text-secondary text-sm">{b.service.name}</p>
                </div>
                <p className="text-text-muted text-xs">{b.customer_phone}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* This Week */}
      <section>
        <h2 className="text-text-primary font-semibold mb-4">{t("thisWeek")}</h2>
        {Object.keys(groupedByDay).length === 0 ? (
          <p className="text-text-muted text-sm">{t("noAppointments")}</p>
        ) : (
          <div className="space-y-5">
            {Object.entries(groupedByDay).map(([day, dayBookings]) => (
              <div key={day}>
                <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">{day}</p>
                <div className="space-y-2">
                  {dayBookings.map((b) => (
                    <div key={b.id} className="bg-bg-surface border border-border rounded-xl px-5 py-4 flex items-center gap-4">
                      <div className="text-primary font-semibold text-sm w-12 shrink-0">
                        {new Date(b.datetime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium">{b.customer_name}</p>
                        <p className="text-text-secondary text-sm">{b.service.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
