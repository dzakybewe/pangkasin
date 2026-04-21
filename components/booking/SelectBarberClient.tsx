"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookingProgress } from "@/components/booking/BookingProgress"
import type { BarberWithServices, Service } from "@/types"

interface SelectBarberClientProps {
  service: Service
  barbers: BarberWithServices[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)
}

export function SelectBarberClient({ service, barbers }: SelectBarberClientProps) {
  const t = useTranslations("booking.selectBarber")
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const availableBarbers = barbers.filter((b) => b.barber_services[0]?.is_available)
  const prices = barbers.map((b) => b.barber_services[0]?.price).filter((p): p is number => p != null)
  const minPrice = prices.length ? Math.min(...prices) : null
  const maxPrice = prices.length ? Math.max(...prices) : null

  const selectedBarber = barbers.find((b) => b.id === selectedId)
  const selectedPrice = selectedBarber?.barber_services[0]?.price

  return (
    <div className="min-h-screen bg-bg-base pb-32">
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <BookingProgress currentStep={2} />

        <h1 className="text-2xl font-bold text-text-primary mb-2">{t("title")}</h1>
        <p className="text-text-secondary mb-8">{t("subtitle")}</p>

        <div className="space-y-3">
          {/* Any Barber option */}
          {availableBarbers.length > 0 && (
            <button
              onClick={() => setSelectedId("any")}
              className={cn(
                "w-full text-left bg-bg-surface border rounded-xl p-5 transition-all",
                selectedId === "any"
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-border/80 hover:bg-bg-elevated"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-bg-elevated border border-border flex items-center justify-center shrink-0">
                  <span className="text-text-muted text-xl">✦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-semibold">{t("anyBarber")}</p>
                  <p className="text-text-secondary text-sm">{t("anyBarberDesc")}</p>
                  {minPrice != null && maxPrice != null && (
                    <p className="text-primary text-sm font-medium mt-1">
                      {minPrice === maxPrice
                        ? formatPrice(minPrice)
                        : t("priceRange", { min: minPrice.toLocaleString("id-ID"), max: maxPrice.toLocaleString("id-ID") })}
                    </p>
                  )}
                </div>
                {selectedId === "any" && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
              </div>
            </button>
          )}

          {/* Individual barbers */}
          {barbers.map((barber) => {
            const svc = barber.barber_services[0]
            const isUnavailable = !svc?.is_available
            const isSelected = selectedId === barber.id

            return (
              <button
                key={barber.id}
                onClick={() => !isUnavailable && setSelectedId(barber.id)}
                disabled={isUnavailable}
                className={cn(
                  "w-full text-left bg-bg-surface border rounded-xl p-5 transition-all",
                  isSelected && "border-primary ring-1 ring-primary",
                  !isSelected && !isUnavailable && "border-border hover:border-border/80 hover:bg-bg-elevated",
                  isUnavailable && "border-border opacity-40 grayscale cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-bg-elevated border border-border overflow-hidden shrink-0">
                    {barber.photo_url ? (
                      <Image
                        src={barber.photo_url}
                        alt={barber.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-text-muted text-xl font-bold">
                          {barber.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-semibold">{barber.name}</p>
                    {barber.specialty && (
                      <p className="text-text-secondary text-sm">{barber.specialty}</p>
                    )}
                    {svc && (
                      <p className={cn("text-sm font-medium mt-1", isUnavailable ? "text-text-muted" : "text-primary")}>
                        {isUnavailable ? t("unavailable") : formatPrice(svc.price)}
                      </p>
                    )}
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            {selectedId ? (
              <>
                <p className="text-text-primary font-medium truncate">
                  {selectedId === "any" ? t("anyBarber") : selectedBarber?.name}
                </p>
                <p className="text-primary text-sm">
                  {selectedId === "any"
                    ? minPrice != null && maxPrice != null
                      ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                      : ""
                    : selectedPrice != null ? formatPrice(selectedPrice) : ""}
                </p>
              </>
            ) : (
              <p className="text-text-muted text-sm">{t("subtitle")}</p>
            )}
          </div>
          <Button
            disabled={!selectedId}
            onClick={() => router.push(`/booking/schedule?service_id=${service.id}&barber_id=${selectedId}`)}
            className="shrink-0 h-11 px-6 bg-primary text-text-inverse font-semibold hover:bg-primary-hover disabled:bg-bg-elevated disabled:text-text-muted"
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  )
}
