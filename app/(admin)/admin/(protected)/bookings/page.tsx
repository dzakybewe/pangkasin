import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { createServerClient } from "@/lib/supabase/server"
import { getBookingsByShop } from "@/lib/supabase/queries/bookings"
import { getBarbersByShop } from "@/lib/supabase/queries/barbers"
import { BookingsTable } from "@/components/admin/BookingsTable"
import type { BookingStatus } from "@/types"

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; barber_id?: string; status?: string }>
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barbershop_id")
    .eq("id", user.id)
    .single()

  if (!userData?.barbershop_id) redirect("/admin/login")

  const { date, barber_id, status } = await searchParams

  const [t, bookings, barbers] = await Promise.all([
    getTranslations("admin.bookings"),
    getBookingsByShop(userData.barbershop_id, {
      date,
      barberId: barber_id,
      status: status as BookingStatus | undefined,
    }),
    getBarbersByShop(userData.barbershop_id),
  ])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
      <Suspense fallback={null}>
        <BookingsTable bookings={bookings} barbers={barbers} />
      </Suspense>
    </div>
  )
}
