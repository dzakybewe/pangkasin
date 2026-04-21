"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { BookingProgress } from "@/components/booking/BookingProgress"
import { getSlotsAction, createBookingAction } from "@/app/(public)/booking/actions"
import type { Service, Barber } from "@/types"

interface ScheduleClientProps {
  barbershopId: string
  service: Service
  barber: Barber | null
  barberId: string
}

function groupSlots(slots: string[]) {
  return {
    morning: slots.filter((s) => {
      const h = parseInt(s.split(":")[0])
      return h >= 6 && h < 12
    }),
    afternoon: slots.filter((s) => {
      const h = parseInt(s.split(":")[0])
      return h >= 12 && h < 17
    }),
    evening: slots.filter((s) => {
      const h = parseInt(s.split(":")[0])
      return h >= 17 && h <= 22
    }),
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)
}

export function ScheduleClient({ barbershopId, service, barber, barberId }: ScheduleClientProps) {
  const t = useTranslations("booking.schedule")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [error, setError] = useState<string | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    setSelectedTime(null)
    setSlots([])
    if (!date) return

    const dateStr = date.toISOString().split("T")[0]
    setLoadingSlots(true)
    startTransition(async () => {
      const result = await getSlotsAction(barberId, dateStr)
      setSlots(result)
      setLoadingSlots(false)
    })
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)
    setError(null)

    const dateStr = selectedDate.toISOString().split("T")[0]
    const result = await createBookingAction({
      barbershopId,
      serviceId: service.id,
      barberId,
      date: dateStr,
      time: selectedTime,
      customerName,
      customerPhone,
    })

    if (result.success && result.bookingId) {
      router.push(`/booking/confirmation?booking_id=${result.bookingId}`)
    } else {
      setError(result.error ?? "booking.error.generic")
      setIsSubmitting(false)
    }
  }

  const grouped = groupSlots(slots)
  const dateStr = selectedDate?.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-bg-base pb-32">
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <BookingProgress currentStep={3} />

        <h1 className="text-2xl font-bold text-text-primary mb-2">{t("title")}</h1>
        <p className="text-text-secondary mb-8">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Calendar */}
          <div className="bg-bg-surface border border-border rounded-xl p-5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < today}
              className="mx-auto"
            />
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div className="bg-bg-surface border border-border rounded-xl p-5">
              <p className="text-text-secondary text-sm mb-4">{dateStr}</p>

              {loadingSlots || isPending ? (
                <p className="text-text-muted text-sm">{t("title")}...</p>
              ) : slots.length === 0 ? (
                <p className="text-text-muted text-sm">{t("noSlots")}</p>
              ) : (
                <div className="space-y-5">
                  {(["morning", "afternoon", "evening"] as const).map((period) => {
                    const periodSlots = grouped[period]
                    if (!periodSlots.length) return null
                    return (
                      <div key={period}>
                        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                          {t(period)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {periodSlots.map((slot) => (
                            <Button
                              key={slot}
                              type="button"
                              variant="outline"
                              onClick={() => setSelectedTime(slot)}
                              className={cn(
                                "h-10 px-4 text-sm font-medium transition-colors",
                                selectedTime === slot
                                  ? "bg-primary text-text-inverse border-primary hover:bg-primary hover:text-text-inverse"
                                  : "bg-bg-elevated border-border text-text-secondary hover:border-primary/50 hover:text-text-primary hover:bg-bg-elevated"
                              )}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Customer details form */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-text-primary">{t("yourDetails")}</h2>
            <div className="space-y-2">
              <Label htmlFor="customer_name" className="text-text-secondary text-sm">{t("fullName")}</Label>
              <Input
                id="customer_name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t("fullNamePlaceholder")}
                required
                className="bg-bg-input border-border text-text-primary placeholder:text-text-muted focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone" className="text-text-secondary text-sm">{t("phone")}</Label>
              <Input
                id="customer_phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t("phonePlaceholder")}
                required
                className="bg-bg-input border-border text-text-primary placeholder:text-text-muted focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}
        </form>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          {selectedDate && selectedTime && (
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-3 text-sm">
              <span className="text-text-secondary">{service.name}</span>
              <span className="text-text-muted">·</span>
              <span className="text-text-secondary">{barber?.name ?? "Any Barber"}</span>
              <span className="text-text-muted">·</span>
              <span className="text-text-secondary">{dateStr}</span>
              <span className="text-text-muted">·</span>
              <span className="text-primary font-medium">{selectedTime}</span>
            </div>
          )}
          <Button
            type="button"
            disabled={!selectedDate || !selectedTime || !customerName || !customerPhone || isSubmitting}
            onClick={() => {
              const form = document.querySelector("form") as HTMLFormElement | null
              form?.requestSubmit()
            }}
            className="w-full h-11 bg-primary text-text-inverse font-semibold hover:bg-primary-hover disabled:bg-bg-elevated disabled:text-text-muted"
          >
            {isSubmitting ? "..." : t("confirmBooking")}
          </Button>
          <p className="text-text-muted text-xs text-center mt-2">{t("termsNote")}</p>
        </div>
      </div>
    </div>
  )
}
