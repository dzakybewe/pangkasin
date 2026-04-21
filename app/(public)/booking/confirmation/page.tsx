import Link from "next/link"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { CheckCircle, Calendar, User, Scissors, Clock, MapPin } from "lucide-react"
import { getShopBySlug } from "@/lib/supabase/queries/barbershops"
import { getBookingById } from "@/lib/supabase/queries/bookings"
import { createServerClient } from "@/lib/supabase/server"

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>
}) {
  const { booking_id } = await searchParams
  if (!booking_id) redirect("/booking")

  const headersList = await headers()
  const slug = headersList.get("x-shop-slug")
  if (!slug) notFound()

  const shop = await getShopBySlug(slug)
  if (!shop) notFound()

  const booking = await getBookingById(booking_id, shop.id)
  if (!booking) redirect("/booking")

  const t = await getTranslations("booking.confirmation")

  const supabase = await createServerClient()
  const { data: location } = await supabase
    .from("locations")
    .select("address, city")
    .eq("barbershop_id", shop.id)
    .single()

  const dateObj = new Date(booking.datetime)
  const dateStr = dateObj.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })

  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Checkmark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
          <p className="text-text-secondary mt-1">{t("subtitle")}</p>
        </div>

        {/* Booking summary card */}
        <div className="bg-bg-surface border border-border rounded-xl divide-y divide-border">
          <div className="p-5 flex gap-3">
            <Scissors className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-text-muted text-xs">{t("service")}</p>
              <p className="text-text-primary font-medium">{booking.service.name}</p>
            </div>
          </div>
          <div className="p-5 flex gap-3">
            <User className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-text-muted text-xs">{t("barber")}</p>
              <p className="text-text-primary font-medium">{booking.barber.name}</p>
            </div>
          </div>
          <div className="p-5 flex gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-text-muted text-xs">{t("date")}</p>
              <p className="text-text-primary font-medium">{dateStr}</p>
            </div>
          </div>
          <div className="p-5 flex gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-text-muted text-xs">{t("time")}</p>
              <p className="text-text-primary font-medium">{timeStr}</p>
            </div>
          </div>
          {location && (
            <div className="p-5 flex gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-text-muted text-xs">{t("location")}</p>
                <p className="text-text-primary font-medium">{location.address}, {location.city}</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-text-muted text-xs text-center mt-4">{t("payAtShop")}</p>

        <div className="flex flex-col gap-3 mt-6">
          <Link
            href="/booking"
            className="w-full h-11 flex items-center justify-center bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            {t("bookAgain")}
          </Link>
          <Link
            href="/"
            className="w-full h-11 flex items-center justify-center border border-border text-text-secondary rounded-lg hover:border-primary/50 hover:text-text-primary transition-colors text-sm"
          >
            {t("contactShop")}
          </Link>
        </div>
      </div>
    </main>
  )
}
