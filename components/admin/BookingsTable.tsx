"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { updateBookingStatusAction } from "@/app/(admin)/admin/(protected)/bookings/actions"
import type { Barber, BookingStatus, BookingWithDetails } from "@/types"

interface BookingsTableProps {
  bookings: BookingWithDetails[]
  barbers: Barber[]
}

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "done", "cancelled"]

function statusBadgeClass(status: BookingStatus) {
  return cn({
    "bg-warning/10 text-warning border-warning/20": status === "pending",
    "bg-success/10 text-success border-success/20": status === "confirmed",
    "bg-bg-elevated text-text-muted border-border": status === "done",
    "bg-error/10 text-error border-error/20": status === "cancelled",
  })
}

export function BookingsTable({ bookings, barbers }: BookingsTableProps) {
  const t = useTranslations("admin.bookings")
  const tc = useTranslations("admin.bookings.statuses")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleAction(bookingId: string, status: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatusAction(bookingId, status)
      router.refresh()
    })
  }

  const currentDate = searchParams.get("date") ?? ""
  const currentBarber = searchParams.get("barber_id") ?? ""
  const currentStatus = searchParams.get("status") ?? ""

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={currentDate}
          onChange={(e) => updateFilter("date", e.target.value)}
          className="h-8 px-3 rounded-lg bg-bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
        />

        <select
          value={currentBarber}
          onChange={(e) => updateFilter("barber_id", e.target.value)}
          className="h-8 px-3 rounded-lg bg-bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:border-primary"
        >
          <option value="">{t("filterByBarber")}</option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={currentStatus}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="h-8 px-3 rounded-lg bg-bg-surface border border-border text-text-secondary text-sm focus:outline-none focus:border-primary"
        >
          <option value="">{t("filterByStatus")}</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{tc(s)}</option>
          ))}
        </select>

        {(currentDate || currentBarber || currentStatus) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(pathname)}
            className="text-text-muted hover:text-text-primary"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      {bookings.length === 0 ? (
        <p className="text-text-muted text-sm py-8 text-center">{t("noBookings")}</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent bg-bg-elevated">
                <TableHead className="text-text-muted">{t("dateTime")}</TableHead>
                <TableHead className="text-text-muted">{t("customer")}</TableHead>
                <TableHead className="text-text-muted">{t("service")}</TableHead>
                <TableHead className="text-text-muted">{t("barber")}</TableHead>
                <TableHead className="text-text-muted">{t("status")}</TableHead>
                <TableHead className="text-text-muted text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const dt = new Date(booking.datetime)
                const dateStr = dt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                const timeStr = dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })

                return (
                  <TableRow key={booking.id} className="border-border">
                    <TableCell>
                      <p className="text-text-primary text-sm font-medium">{dateStr}</p>
                      <p className="text-text-muted text-xs">{timeStr}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-text-primary text-sm font-medium">{booking.customer_name}</p>
                      <p className="text-text-muted text-xs">{booking.customer_phone}</p>
                    </TableCell>
                    <TableCell className="text-text-secondary text-sm">{booking.service.name}</TableCell>
                    <TableCell className="text-text-secondary text-sm">{booking.barber.name}</TableCell>
                    <TableCell>
                      <Badge className={statusBadgeClass(booking.status)}>
                        {tc(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === "pending" && (
                          <Button
                            size="xs"
                            disabled={isPending}
                            onClick={() => handleAction(booking.id, "confirmed")}
                            className="bg-success/10 text-success border-success/20 hover:bg-success/20 border"
                          >
                            {t("confirm")}
                          </Button>
                        )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <Button
                            size="xs"
                            disabled={isPending}
                            onClick={() => handleAction(booking.id, "done")}
                            className="bg-bg-elevated text-text-secondary border-border hover:bg-bg-base border"
                          >
                            {t("markDone")}
                          </Button>
                        )}
                        {booking.status !== "cancelled" && booking.status !== "done" && (
                          <Button
                            size="xs"
                            disabled={isPending}
                            onClick={() => handleAction(booking.id, "cancelled")}
                            className="bg-error/10 text-error border-error/20 hover:bg-error/20 border"
                          >
                            {t("cancel")}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
