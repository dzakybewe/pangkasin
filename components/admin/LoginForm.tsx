"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const t = useTranslations("admin.login")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setError(
          signInError.message.toLowerCase().includes("invalid")
            ? t("error.invalidCredentials")
            : t("error.generic")
        )
        return
      }

      if (!data.user) {
        setError(t("error.generic"))
        return
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (userData?.role === "barber") {
        router.push("/barber/schedule")
      } else {
        router.push("/admin/dashboard")
      }

      router.refresh()
    } catch {
      setError(t("error.generic"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-text-secondary text-sm font-medium">
          {t("email")}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="bg-bg-input border-border text-text-primary placeholder:text-text-muted focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-text-secondary text-sm font-medium">
          {t("password")}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-bg-input border-border text-text-primary placeholder:text-text-muted focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
        />
      </div>

      {error && (
        <p className="text-error text-sm">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-primary text-text-inverse font-semibold hover:bg-primary-hover disabled:bg-bg-elevated disabled:text-text-muted cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? t("signingIn") : t("signIn")}
      </Button>
    </form>
  )
}
