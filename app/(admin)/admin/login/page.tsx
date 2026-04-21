import { getTranslations } from "next-intl/server"
import { LoginForm } from "@/components/admin/LoginForm"

export default async function LoginPage() {
  const t = await getTranslations("admin.login")

  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary mb-4">
            <span className="text-text-inverse font-bold text-lg">P</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
          <p className="text-text-secondary text-sm mt-1">{t("subtitle")}</p>
        </div>

        {/* Card */}
        <div className="bg-bg-surface border border-border rounded-xl p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
