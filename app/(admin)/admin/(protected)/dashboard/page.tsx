import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Calendar, Users, Scissors, Clock } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { getDashboardStats, getBookingsByShop } from "@/lib/supabase/queries/bookings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types"

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      className={cn({
        "bg-warning/10 text-warning border-warning/20": status === "pending",
        "bg-success/10 text-success border-success/20": status === "confirmed",
        "bg-bg-elevated text-text-muted border-border": status === "done",
        "bg-error/10 text-error border-error/20": status === "cancelled",
      })}
    >
      {status}
    </Badge>
  )
}

export default async function DashboardPage() {
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

  const [t, stats, todayBookings] = await Promise.all([
    getTranslations("admin.dashboard"),
    getDashboardStats(userData.barbershop_id),
    getBookingsByShop(userData.barbershop_id, { date: today }),
  ])

  const sortedToday = [...todayBookings].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  )

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-bg-surface border-border ring-0 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-text-muted text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("todayAppointments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">{stats.todayCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-surface border-border ring-0 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-text-muted text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("weekBookings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">{stats.weekCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-bg-surface border-border ring-0 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-text-muted text-sm font-medium flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              {t("allTimeBookings")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">{stats.allTimeCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's schedule */}
      <Card className="bg-bg-surface border-border ring-0 border">
        <CardHeader>
          <CardTitle className="text-text-primary text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {t("todaySchedule")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedToday.length === 0 ? (
            <p className="text-text-muted text-sm px-4 pb-4">{t("noAppointmentsToday")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-text-muted">{t("time")}</TableHead>
                  <TableHead className="text-text-muted">{t("customer")}</TableHead>
                  <TableHead className="text-text-muted">{t("service")}</TableHead>
                  <TableHead className="text-text-muted">{t("barber")}</TableHead>
                  <TableHead className="text-text-muted">{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedToday.map((booking) => {
                  const time = new Date(booking.datetime).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  return (
                    <TableRow key={booking.id} className="border-border">
                      <TableCell className="text-text-primary font-medium">{time}</TableCell>
                      <TableCell>
                        <p className="text-text-primary font-medium">{booking.customer_name}</p>
                        <p className="text-text-muted text-xs">{booking.customer_phone}</p>
                      </TableCell>
                      <TableCell className="text-text-secondary">{booking.service.name}</TableCell>
                      <TableCell className="text-text-secondary">{booking.barber.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
