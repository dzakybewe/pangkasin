"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PublicNavbarProps {
  shopName: string
  logoUrl: string | null
}

export function PublicNavbar({ shopName, logoUrl }: PublicNavbarProps) {
  const t = useTranslations("nav")
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: "#services", label: t("services") },
    { href: "#team", label: t("barbers") },
    { href: "#gallery", label: t("gallery") },
    { href: "#location", label: t("location") },
  ]

  return (
    <header className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Shop name */}
          <a href="#" className="flex items-center gap-2.5">
            {logoUrl ? (
              <Image src={logoUrl} alt={shopName} width={32} height={32} className="rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-text-inverse font-bold text-sm">
                  {shopName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="font-semibold text-text-primary text-sm">{shopName}</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center h-9 px-4 bg-primary text-text-inverse text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
            >
              {t("bookNow")}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden text-text-secondary hover:text-text-primary p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden border-t border-border bg-bg-surface", mobileOpen ? "block" : "hidden")}>
        <nav className="px-4 py-4 space-y-3">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block text-text-secondary hover:text-text-primary text-sm font-medium"
            >
              {label}
            </a>
          ))}
          <Link
            href="/booking"
            className="block w-full text-center h-10 leading-10 bg-primary text-text-inverse text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors mt-2"
          >
            {t("bookNow")}
          </Link>
        </nav>
      </div>
    </header>
  )
}
