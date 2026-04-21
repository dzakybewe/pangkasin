import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { BarberSidebar } from "@/components/barber/BarberSidebar"

export default async function BarberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("role, barber_id")
    .eq("id", user.id)
    .single()

  if (userData?.role === "owner") redirect("/admin/dashboard")

  let barberName = user.email ?? "Barber"
  if (userData?.barber_id) {
    const { data: barber } = await supabase
      .from("barbers")
      .select("name")
      .eq("id", userData.barber_id)
      .single()
    if (barber?.name) barberName = barber.name
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      <BarberSidebar barberName={barberName} userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
