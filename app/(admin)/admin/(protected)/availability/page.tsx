import Link from "next/link"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { createServerClient } from "@/lib/supabase/server"
import { getBarbersByShop } from "@/lib/supabase/queries/barbers"

export default async function AvailabilityPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("barbershop_id")
    .eq("id", user.id)
    .single()

  if (!userData?.barbershop_id) redirect("/admin/login")

  const [t, barbers] = await Promise.all([
    getTranslations("admin.availability"),
    getBarbersByShop(userData.barbershop_id),
  ])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
      <p className="text-text-secondary text-sm">{t("selectBarber")}</p>

      {barbers.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-12">No barbers yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {barbers.map((barber) => (
            <Link
              key={barber.id}
              href={`/admin/availability/${barber.id}`}
              className="flex items-center gap-4 px-5 py-4 bg-bg-surface hover:bg-bg-elevated transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border overflow-hidden shrink-0">
                {barber.photo_url ? (
                  <Image src={barber.photo_url} alt={barber.name} width={40} height={40} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-text-muted text-sm font-bold">{barber.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-text-primary font-medium">{barber.name}</p>
                {barber.specialty && <p className="text-text-muted text-sm">{barber.specialty}</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
