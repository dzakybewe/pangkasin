"use client"

import { useActionState, useState, useRef } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Upload } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveSettingsAction, type SettingsFormState } from "@/app/(admin)/admin/(protected)/settings/actions"
import type { Barbershop, Location } from "@/types"

interface SettingsFormProps {
  shop: Barbershop
  location: Location | null
}

const initialState: SettingsFormState = { success: false, error: null }

export function SettingsForm({ shop, location }: SettingsFormProps) {
  const t = useTranslations("admin.settings")
  const tc = useTranslations("common")
  const [state, formAction, pending] = useActionState(saveSettingsAction, initialState)
  const [logoUrl, setLogoUrl] = useState(shop.logo_url ?? "")
  const [primaryColor, setPrimaryColor] = useState(shop.primary_color)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createBrowserClient()
      const ext = file.name.split(".").pop()
      const path = `${shop.id}/logo.${ext}`
      const { error } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from("logos")
        .getPublicUrl(path)

      setLogoUrl(publicUrl)
    } catch (err) {
      console.error("[handleLogoUpload]", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="logo_url" value={logoUrl} />

      {/* Logo */}
      <section className="bg-bg-surface border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">{t("logo")}</h2>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl bg-bg-elevated border border-border flex items-center justify-center overflow-hidden shrink-0">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
            ) : (
              <span className="text-text-muted text-2xl font-bold">
                {shop.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="border-border text-text-secondary hover:text-text-primary hover:border-primary gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? tc("loading") : t("uploadLogo")}
            </Button>
            <p className="text-text-muted text-xs mt-2">PNG, JPG, WebP, SVG — maks. 2MB</p>
          </div>
        </div>
      </section>

      {/* Shop info */}
      <section className="bg-bg-surface border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-text-primary">{t("shopName")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="shop_name" className="text-text-secondary text-sm">{t("shopName")}</Label>
            <Input
              id="shop_name"
              name="shop_name"
              defaultValue={shop.name}
              required
              className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_color" className="text-text-secondary text-sm">{t("brandColor")}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-11 h-11 rounded-md cursor-pointer bg-bg-input border border-border p-1"
              />
              <Input
                id="primary_color"
                name="primary_color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#F2B90D"
                className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-bg-surface border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-text-primary">{t("address")}</h2>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-text-secondary text-sm">{t("address")}</Label>
          <Input
            id="address"
            name="address"
            defaultValue={location?.address ?? ""}
            required
            className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-text-secondary text-sm">{t("city")}</Label>
            <Input
              id="city"
              name="city"
              defaultValue={location?.city ?? ""}
              required
              className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province" className="text-text-secondary text-sm">{t("province")}</Label>
            <Input
              id="province"
              name="province"
              defaultValue={location?.province ?? ""}
              required
              className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-text-secondary text-sm">{t("phone")}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={location?.phone ?? ""}
              required
              className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-secondary text-sm">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={location?.email ?? ""}
              className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className="bg-bg-surface border border-border rounded-xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-text-primary">{t("socialLinks")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-text-secondary text-sm">{t("instagram")}</Label>
            <Input
              id="instagram"
              name="instagram"
              placeholder="@namashop"
              defaultValue={location?.instagram ?? ""}
              className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-text-secondary text-sm">{t("whatsapp")}</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              placeholder="628xxxxxxxxxx"
              defaultValue={location?.whatsapp ?? ""}
              className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maps_url" className="text-text-secondary text-sm">{t("googleMaps")}</Label>
          <Input
            id="maps_url"
            name="maps_url"
            type="url"
            placeholder="https://maps.google.com/..."
            defaultValue={location?.maps_url ?? ""}
            className="bg-bg-input border-border text-text-primary focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </section>

      {/* Feedback + submit */}
      {state.success && (
        <p className="text-success text-sm">{t("settingsSaved")}</p>
      )}
      {state.error && (
        <p className="text-error text-sm">{state.error}</p>
      )}

      <Button
        type="submit"
        disabled={pending || uploading}
        className="bg-primary text-text-inverse font-semibold hover:bg-primary-hover disabled:bg-bg-elevated disabled:text-text-muted h-11 px-8"
      >
        {pending ? tc("saving") : t("saveSettings")}
      </Button>
    </form>
  )
}
