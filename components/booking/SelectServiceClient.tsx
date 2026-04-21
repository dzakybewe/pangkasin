"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookingProgress } from "@/components/booking/BookingProgress"
import type { Service } from "@/types"

interface SelectServiceClientProps {
  services: Service[]
}

export function SelectServiceClient({ services }: SelectServiceClientProps) {
  const t = useTranslations("booking.selectService")
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = services.find((s) => s.id === selectedId)

  return (
    <div className="min-h-screen bg-bg-base pb-32">
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <BookingProgress currentStep={1} />

        <h1 className="text-2xl font-bold text-text-primary mb-2">{t("title")}</h1>
        <p className="text-text-secondary mb-8">{t("subtitle")}</p>

        <div className="space-y-3">
          {services.map((service) => {
            const isSelected = selectedId === service.id
            return (
              <button
                key={service.id}
                onClick={() => setSelectedId(service.id)}
                className={cn(
                  "w-full text-left bg-bg-surface border rounded-xl p-5 transition-all",
                  isSelected
                    ? "border-primary ring-1 ring-primary"
                    : "border-border hover:border-border/80 hover:bg-bg-elevated"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text-primary font-semibold">{service.name}</h3>
                    {service.description && (
                      <p className="text-text-secondary text-sm mt-1">{service.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-text-muted text-sm mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t("duration", { duration: service.duration_minutes })}</span>
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
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
            {selected ? (
              <>
                <p className="text-text-primary font-medium truncate">{selected.name}</p>
                <p className="text-text-muted text-sm">{t("duration", { duration: selected.duration_minutes })}</p>
              </>
            ) : (
              <p className="text-text-muted text-sm">{t("subtitle")}</p>
            )}
          </div>
          <Button
            disabled={!selectedId}
            onClick={() => router.push(`/booking/barber?service_id=${selectedId}`)}
            className="shrink-0 h-11 px-6 bg-primary text-text-inverse font-semibold hover:bg-primary-hover disabled:bg-bg-elevated disabled:text-text-muted"
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  )
}
