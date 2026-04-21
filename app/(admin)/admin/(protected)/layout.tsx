import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: userData } = await supabase
    .from("users")
    .select("role, barbershop_id")
    .eq("id", user.id)
    .single()

  if (userData?.role === "barber") redirect("/barber/schedule")

  const { data: shop } = await supabase
    .from("barbershops")
    .select("name")
    .eq("id", userData?.barbershop_id)
    .single()

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      <AdminSidebar
        shopName={shop?.name ?? "Admin"}
        userEmail={user.email ?? ""}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
