"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Plus, Pencil, Trash2, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "@/app/(admin)/admin/(protected)/services/actions"
import type { Service } from "@/types"

interface ServicesManagerProps {
  services: Service[]
}

export function ServicesManager({ services }: ServicesManagerProps) {
  const t = useTranslations("admin.services")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [panelOpen, setPanelOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("30")
  const [formError, setFormError] = useState<string | null>(null)

  function openAdd() {
    setName(""); setDescription(""); setDuration("30"); setFormError(null)
    setEditingService(null)
    setPanelOpen(true)
  }

  function openEdit(svc: Service) {
    setName(svc.name)
    setDescription(svc.description ?? "")
    setDuration(String(svc.duration_minutes))
    setFormError(null)
    setEditingService(svc)
    setPanelOpen(true)
  }

  function closePanel() { setPanelOpen(false); setEditingService(null) }

  function handleSubmit() {
    if (!name.trim()) { setFormError("Name is required"); return }
    if (!duration || Number(duration) < 1) { setFormError("Duration must be at least 1 minute"); return }
    const fd = new FormData()
    fd.set("name", name.trim())
    fd.set("description", description.trim())
    fd.set("duration_minutes", duration)
    setFormError(null)
    startTransition(async () => {
      const result = editingService
        ? await updateServiceAction(editingService.id, fd)
        : await createServiceAction(fd)
      if (result.success) { closePanel(); router.refresh() }
      else setFormError(result.error ?? "An error occurred")
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteServiceAction(id)
      setDeletingId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={openAdd}
          className="bg-primary text-text-inverse hover:bg-primary-hover gap-2 h-9 px-4"
        >
          <Plus className="w-4 h-4" />
          {t("addService")}
        </Button>
      </div>

      {services.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-12">{t("noServices")}</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center gap-4 px-5 py-4 bg-bg-surface">
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium">{svc.name}</p>
                {svc.description && (
                  <p className="text-text-secondary text-sm mt-0.5 truncate">{svc.description}</p>
                )}
                <div className="flex items-center gap-1 text-text-muted text-xs mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{svc.duration_minutes} min</span>
                </div>
              </div>
              <p className="text-text-muted text-xs">{t("priceNote")}</p>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="icon-xs" variant="ghost" onClick={() => openEdit(svc)} className="text-text-muted hover:text-text-primary">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon-xs" variant="ghost" onClick={() => setDeletingId(svc.id)} className="text-text-muted hover:text-error">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={closePanel} />
          <div className="w-full max-w-md bg-bg-surface border-l border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-text-primary font-semibold">
                {editingService ? t("editService") : t("addService")}
              </h2>
              <Button size="icon-xs" variant="ghost" onClick={closePanel} className="text-text-muted">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">{t("name")} *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="bg-bg-input border-border text-text-primary" />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">{t("description")}</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">{t("duration")} *</Label>
                <Input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-bg-input border-border text-text-primary"
                />
              </div>

              <p className="text-text-muted text-xs">{t("priceNote")}</p>
              {formError && <p className="text-error text-sm">{formError}</p>}
            </div>

            <div className="p-5 border-t border-border">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full bg-primary text-text-inverse hover:bg-primary-hover h-10"
              >
                {isPending ? "Saving..." : editingService ? t("editService") : t("addService")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeletingId(null)} />
          <div className="relative bg-bg-surface border border-border rounded-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <h3 className="text-text-primary font-semibold">{t("deleteService")}</h3>
            <p className="text-text-secondary text-sm">{t("deleteConfirm")}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeletingId(null)}
                className="flex-1 border-border text-text-secondary">Cancel</Button>
              <Button
                disabled={isPending}
                onClick={() => handleDelete(deletingId)}
                className="flex-1 bg-error/10 text-error border-error/20 border hover:bg-error/20"
              >
                {isPending ? "Deleting..." : t("deleteService")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
