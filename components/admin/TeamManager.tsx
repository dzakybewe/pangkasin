"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  createBarberAction,
  updateBarberAction,
  deleteBarberAction,
  upsertBarberServiceAction,
} from "@/app/(admin)/admin/(protected)/team/actions"
import type { Barber, BarberService, Service } from "@/types"

interface TeamManagerProps {
  barbershopId: string
  barbers: Barber[]
  services: Service[]
  barberServicesMap: Record<string, (BarberService & { service_name: string })[]>
}

interface ServicePricing {
  serviceId: string
  price: string
  isAvailable: boolean
}

type PanelMode = "add" | "edit" | "services" | null

export function TeamManager({ barbershopId, barbers, services, barberServicesMap }: TeamManagerProps) {
  const t = useTranslations("admin.team")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [panelMode, setPanelMode] = useState<PanelMode>(null)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Services pricing state
  const [servicePricing, setServicePricing] = useState<ServicePricing[]>([])

  function openAdd() {
    setName(""); setBio(""); setSpecialty(""); setPhotoUrl(""); setFormError(null)
    setPanelMode("add")
    setEditingBarber(null)
  }

  function openEdit(barber: Barber) {
    setName(barber.name)
    setBio(barber.bio ?? "")
    setSpecialty(barber.specialty ?? "")
    setPhotoUrl(barber.photo_url ?? "")
    setFormError(null)
    setEditingBarber(barber)
    setPanelMode("edit")
  }

  function openServices(barber: Barber) {
    const existing = barberServicesMap[barber.id] ?? []
    setServicePricing(
      services.map((svc) => {
        const found = existing.find((e) => e.service_id === svc.id)
        return { serviceId: svc.id, price: found ? String(found.price) : "0", isAvailable: found?.is_available ?? false }
      })
    )
    setEditingBarber(barber)
    setPanelMode("services")
  }

  function closePanel() {
    setPanelMode(null)
    setEditingBarber(null)
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true)
    const supabase = createBrowserClient()
    const ext = file.name.split(".").pop()
    const path = `${barbershopId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("barbers").upload(path, file, { upsert: true })
    if (error) { setFormError("Photo upload failed"); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from("barbers").getPublicUrl(path)
    setPhotoUrl(publicUrl)
    setUploading(false)
  }

  function handleSubmitForm() {
    if (!name.trim()) { setFormError("Name is required"); return }
    const fd = new FormData()
    fd.set("name", name.trim())
    fd.set("bio", bio.trim())
    fd.set("specialty", specialty.trim())
    fd.set("photo_url", photoUrl)

    setFormError(null)
    startTransition(async () => {
      const result = panelMode === "add"
        ? await createBarberAction(fd)
        : await updateBarberAction(editingBarber!.id, fd)
      if (result.success) { closePanel(); router.refresh() }
      else setFormError(result.error ?? "An error occurred")
    })
  }

  function handleSaveServices() {
    if (!editingBarber) return
    startTransition(async () => {
      for (const sp of servicePricing) {
        if (sp.isAvailable || Number(sp.price) > 0) {
          await upsertBarberServiceAction(editingBarber.id, sp.serviceId, Number(sp.price), sp.isAvailable)
        }
      }
      closePanel()
      router.refresh()
    })
  }

  function handleDelete(barberId: string) {
    startTransition(async () => {
      await deleteBarberAction(barberId)
      setDeletingId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span />
        <Button
          onClick={openAdd}
          className="bg-primary text-text-inverse hover:bg-primary-hover gap-2 h-9 px-4"
        >
          <Plus className="w-4 h-4" />
          {t("addBarber")}
        </Button>
      </div>

      {barbers.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-12">{t("noBarbers")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {barbers.map((barber) => (
            <div key={barber.id} className="bg-bg-surface border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-bg-elevated border border-border overflow-hidden shrink-0">
                  {barber.photo_url ? (
                    <Image src={barber.photo_url} alt={barber.name} width={56} height={56} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-text-muted text-xl font-bold">{barber.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-semibold">{barber.name}</p>
                  {barber.specialty && <p className="text-text-secondary text-sm">{barber.specialty}</p>}
                  <Badge className="mt-1 bg-success/10 text-success border-success/20 border">{t("available")}</Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-1 border-t border-border">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => openServices(barber)}
                  className="flex-1 text-text-secondary hover:text-text-primary text-xs"
                >
                  {t("manageServices")}
                </Button>
                <Button size="icon-xs" variant="ghost" onClick={() => openEdit(barber)} className="text-text-muted hover:text-text-primary">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon-xs" variant="ghost" onClick={() => setDeletingId(barber.id)} className="text-text-muted hover:text-error">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit panel */}
      {(panelMode === "add" || panelMode === "edit") && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={closePanel} />
          <div className="w-full max-w-md bg-bg-surface border-l border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-text-primary font-semibold">
                {panelMode === "add" ? t("addBarber") : t("editBarber")}
              </h2>
              <Button size="icon-xs" variant="ghost" onClick={closePanel} className="text-text-muted">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Photo upload */}
              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">{t("photo")}</Label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-bg-elevated border border-border overflow-hidden shrink-0">
                    {photoUrl ? (
                      <Image src={photoUrl} alt="Preview" width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="w-5 h-5 text-text-muted" />
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-border text-text-secondary hover:text-text-primary"
                  >
                    {uploading ? "Uploading..." : t("uploadPhoto")}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f) }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">{t("name")} *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")}
                  className="bg-bg-input border-border text-text-primary" />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">{t("specialty")}</Label>
                <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder={t("specialtyPlaceholder")}
                  className="bg-bg-input border-border text-text-primary" />
              </div>

              <div className="space-y-2">
                <Label className="text-text-secondary text-sm">{t("bio")}</Label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("bioPlaceholder")}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-primary"
                />
              </div>

              {formError && <p className="text-error text-sm">{formError}</p>}
            </div>

            <div className="p-5 border-t border-border">
              <Button
                onClick={handleSubmitForm}
                disabled={isPending || uploading}
                className="w-full bg-primary text-text-inverse hover:bg-primary-hover h-10"
              >
                {isPending ? "Saving..." : t("addBarber")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Services panel */}
      {panelMode === "services" && editingBarber && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={closePanel} />
          <div className="w-full max-w-md bg-bg-surface border-l border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-text-primary font-semibold">{t("services")}</h2>
                <p className="text-text-muted text-xs">{editingBarber.name}</p>
              </div>
              <Button size="icon-xs" variant="ghost" onClick={closePanel} className="text-text-muted">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {services.map((svc) => {
                const sp = servicePricing.find((p) => p.serviceId === svc.id)
                if (!sp) return null
                return (
                  <div key={svc.id} className="bg-bg-elevated border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-text-primary text-sm font-medium">{svc.name}</p>
                      <button
                        type="button"
                        onClick={() => setServicePricing((prev) =>
                          prev.map((p) => p.serviceId === svc.id ? { ...p, isAvailable: !p.isAvailable } : p)
                        )}
                        className={`relative w-10 h-5 rounded-full transition-colors ${sp.isAvailable ? "bg-primary" : "bg-bg-base border border-border"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${sp.isAvailable ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                    {sp.isAvailable && (
                      <div className="space-y-1">
                        <Label className="text-text-muted text-xs">{t("price")} (Rp)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={sp.price}
                          onChange={(e) => setServicePricing((prev) =>
                            prev.map((p) => p.serviceId === svc.id ? { ...p, price: e.target.value } : p)
                          )}
                          className="bg-bg-input border-border text-text-primary h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
              {services.length === 0 && (
                <p className="text-text-muted text-sm text-center py-8">No services yet. Add services first.</p>
              )}
            </div>

            <div className="p-5 border-t border-border">
              <Button
                onClick={handleSaveServices}
                disabled={isPending}
                className="w-full bg-primary text-text-inverse hover:bg-primary-hover h-10"
              >
                {isPending ? "Saving..." : "Save Services"}
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
            <h3 className="text-text-primary font-semibold">{t("deleteBarber")}</h3>
            <p className="text-text-secondary text-sm">{t("deleteConfirm")}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeletingId(null)}
                className="flex-1 border-border text-text-secondary">Cancel</Button>
              <Button
                disabled={isPending}
                onClick={() => handleDelete(deletingId)}
                className="flex-1 bg-error/10 text-error border-error/20 border hover:bg-error/20"
              >
                {isPending ? "Deleting..." : t("deleteBarber")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
