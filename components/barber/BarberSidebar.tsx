"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { CalendarDays, Clock, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@/lib/supabase/client"

interface BarberSidebarProps {
  barberName: string
  userEmail: string
}

const NAV = [
  { href: "/barber/schedule", icon: CalendarDays, key: "mySchedule" as const },
  { href: "/barber/availability", icon: Clock, key: "myAvailability" as const },
]

export function BarberSidebar({ barberName, userEmail }: BarberSidebarProps) {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-bg-surface border-r border-border">
      <div className="px-5 py-6 border-b border-border">
        <p className="text-text-primary font-semibold truncate">{barberName}</p>
        <p className="text-text-muted text-xs mt-0.5 truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, key }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {t(key)}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {t("logout")}
        </button>
      </div>
    </aside>
  )
}
