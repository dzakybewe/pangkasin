"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { LayoutDashboard, CalendarDays, Users, Scissors, Clock, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserClient } from "@/lib/supabase/client"

interface AdminSidebarProps {
  shopName: string
  userEmail: string
}

const navItems = [
  { href: "/admin/dashboard", labelKey: "dashboard" as const, icon: LayoutDashboard },
  { href: "/admin/bookings", labelKey: "bookings" as const, icon: CalendarDays },
  { href: "/admin/team", labelKey: "team" as const, icon: Users },
  { href: "/admin/services", labelKey: "services" as const, icon: Scissors },
  { href: "/admin/availability", labelKey: "availability" as const, icon: Clock },
  { href: "/admin/settings", labelKey: "settings" as const, icon: Settings },
]

export function AdminSidebar({ shopName, userEmail }: AdminSidebarProps) {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-64 shrink-0 bg-bg-sidebar border-r border-border flex flex-col h-screen sticky top-0">
      {/* Shop identity */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-text-inverse font-bold text-sm">
              {shopName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-semibold text-text-primary truncate text-sm">{shopName}</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-bg-elevated text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(labelKey)}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-border">
        <p className="text-text-muted text-xs truncate mb-3">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-text-secondary hover:text-error text-sm font-medium transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </button>
      </div>
    </aside>
  )
}
