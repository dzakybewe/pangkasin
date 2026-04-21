"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  saveScheduleAction,
  addBlockedDateAction,
  deleteBlockedDateAction,
} from "@/app/(admin)/admin/(protected)/availability/[barberId]/actions"
import type { BlockedDate, Schedule } from "@/types"

const DAYS = [0, 1, 2, 3, 4, 5, 6] as const

interface DaySchedule {
  dayOfWeek: number
  isWorking: boolean
  openTime: string
  closeTime: string
}

interface AvailabilityManagerProps {
  barberId: string
  barberName: string
  initialSchedules: Schedule[]
  initialBlockedDates: BlockedDate[]
}

export function AvailabilityManager({
  barberId,
  barberName,
  initialSchedules,
  initialBlockedDates,
}: AvailabilityManagerProps) {
  const t = useTranslations("admin.availability")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(
    DAYS.map((d) => {
      const existing = initialSchedules.find((s) => s.day_of_week === d)
      return {
        dayOfWeek: d,
        isWorking: existing?.is_working ?? false,
        openTime: existing?.open_time ?? "09:00",
        closeTime: existing?.close_time ?? "17:00",
      }
    })
  )

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(initialBlockedDates)
  const [newDate, setNewDate] = useState("")
  const [newReason, setNewReason] = useState("")
  const [scheduleSaved, setScheduleSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateDay(dayOfWeek: number, updates: Partial<DaySchedule>) {
    setDaySchedules((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...updates } : d))
    )
  }

  function handleSaveSchedule() {
    setError(null)
    setScheduleSaved(false)
    startTransition(async () => {
      const schedules = daySchedules.map((d) => ({
        barber_id: barberId,
        day_of_week: d.dayOfWeek,
        is_working: d.isWorking,
        open_time: d.openTime,
        close_time: d.closeTime,
      }))
      const result = await saveScheduleAction(barberId, schedules)
      if (result.success) { setScheduleSaved(true); router.refresh() }
      else setError(result.error ?? "An error occurred")
    })
  }

  function handleAddBlockedDate() {
    if (!newDate) return
    startTransition(async () => {
      const result = await addBlockedDateAction(barberId, newDate, newReason)
      if (result.success) {
        setNewDate(""); setNewReason("")
        router.refresh()
      }
    })
  }

  function handleDeleteBlockedDate(id: string) {
    startTransition(async () => {
      const result = await deleteBlockedDateAction(id, barberId)
      if (result.success) {
        setBlockedDates((prev) => prev.filter((b) => b.id !== id))
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Weekly Schedule */}
      <section>
        <h2 className="text-text-primary font-semibold mb-4">{t("weeklySchedule")}</h2>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {daySchedules.map((day) => (
            <div key={day.dayOfWeek} className="flex items-center gap-4 px-5 py-3.5 bg-bg-surface">
              <div className="w-24 shrink-0">
                <p className="text-text-primary text-sm font-medium">{t(`days.${day.dayOfWeek}`)}</p>
              </div>

              <button
                type="button"
                onClick={() => updateDay(day.dayOfWeek, { isWorking: !day.isWorking })}
                className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${day.isWorking ? "bg-primary" : "bg-bg-base border border-border"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${day.isWorking ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>

              <span className="text-text-muted text-xs w-16">
                {day.isWorking ? t("working") : "Off"}
              </span>

              {day.isWorking && (
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-muted text-xs">{t("openTime")}</span>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => updateDay(day.dayOfWeek, { openTime: e.target.value })}
                      className="h-7 px-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <span className="text-text-muted text-xs">–</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-muted text-xs">{t("closeTime")}</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => updateDay(day.dayOfWeek, { closeTime: e.target.value })}
                      className="h-7 px-2 rounded-lg bg-bg-elevated border border-border text-text-primary text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={handleSaveSchedule}
            disabled={isPending}
            className="bg-primary text-text-inverse hover:bg-primary-hover h-9 px-5"
          >
            {isPending ? "Saving..." : t("saveSchedule")}
          </Button>
          {scheduleSaved && <span className="text-success text-sm">Saved!</span>}
          {error && <span className="text-error text-sm">{error}</span>}
        </div>
      </section>

      {/* Blocked Dates */}
      <section>
        <h2 className="text-text-primary font-semibold mb-4">{t("blockedDates")}</h2>

        <div className="flex gap-3 mb-4">
          <input
            type="date"
            value={newDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setNewDate(e.target.value)}
            className="h-9 px-3 rounded-lg bg-bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-primary"
          />
          <Input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder={t("reasonPlaceholder")}
            className="bg-bg-surface border-border text-text-primary flex-1"
          />
          <Button
            onClick={handleAddBlockedDate}
            disabled={!newDate || isPending}
            className="bg-primary text-text-inverse hover:bg-primary-hover h-9 px-4 gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t("addBlockedDate")}
          </Button>
        </div>

        {blockedDates.length === 0 ? (
          <p className="text-text-muted text-sm">{t("noBlockedDates")}</p>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {blockedDates.map((bd) => (
              <div key={bd.id} className="flex items-center gap-4 px-5 py-3.5 bg-bg-surface">
                <div className="flex-1">
                  <p className="text-text-primary text-sm font-medium">
                    {new Date(bd.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {bd.reason && <p className="text-text-muted text-xs">{bd.reason}</p>}
                </div>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleDeleteBlockedDate(bd.id)}
                  className="text-text-muted hover:text-error"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
