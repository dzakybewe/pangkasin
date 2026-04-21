import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Check, X, Globe, CalendarDays, LayoutDashboard, Users, Smartphone } from "lucide-react"

const PROBLEM_ITEMS = [
  {
    icon: "❌",
    title: "Tidak Punya Website",
    desc: "Pelanggan susah cari info jam buka, lokasi, dan layanan toko kamu.",
  },
  {
    icon: "❌",
    title: "Booking Lewat WhatsApp",
    desc: "Pesan satu per satu, sering kelupaan, double booking, dan susah tracking.",
  },
  {
    icon: "❌",
    title: "Jadwal Berantakan",
    desc: "Susah manage jadwal barber tanpa sistem yang terintegrasi.",
  },
]

const FEATURE_ITEMS = [
  { icon: Globe, title: "Subdomain Branded", desc: "Dapatkan toko-kamu.pangkasin.com — link profesional untuk dibagikan ke pelanggan." },
  { icon: CalendarDays, title: "Booking Online 24/7", desc: "Pelanggan bisa booking sendiri kapan saja, pilih layanan dan barber favorit." },
  { icon: LayoutDashboard, title: "Admin Dashboard", desc: "Pantau semua booking, kelola status, dan lihat statistik dari satu tempat." },
  { icon: Users, title: "Manajemen Tim", desc: "Tambah barber, atur jadwal kerja, dan tentukan harga per layanan per barber." },
  { icon: Smartphone, title: "Mobile-First Design", desc: "Tampilan keren dan responsif di semua perangkat, dari HP hingga desktop." },
]

const HOW_IT_WORKS = [
  { step: "01", title: "Daftar & Konfigurasi", desc: "Buat akun, upload logo, tambah layanan dan barber. Setup selesai dalam 15 menit." },
  { step: "02", title: "Bagikan Link ke Pelanggan", desc: "Share link toko-kamu.pangkasin.com via WhatsApp, Instagram, atau kartu nama digital." },
  { step: "03", title: "Terima Booking Otomatis", desc: "Pelanggan booking sendiri, jadwal langsung masuk ke dashboard kamu." },
]

const PRICING_FEATURES = [
  "Subdomain branded (toko.pangkasin.com)",
  "Landing page barbershop",
  "Sistem booking online",
  "Admin dashboard",
  "Manajemen tim & barber",
  "Manajemen layanan & harga",
  "Kelola jadwal & hari libur",
  "Tampilan mobile-first",
]

const TESTIMONIALS = [
  { name: "Andi Santoso", shop: "Kings Cut Jakarta", text: "Booking online beneran ngebantu banget. Pelanggan udah bisa reservasi sendiri tanpa WA dulu." },
  { name: "Budi Pratama", shop: "Rumble Barbershop", text: "Setup-nya gampang, tampilannya keren. Pelanggan sering bilang websitenya profesional." },
  { name: "Rizki Fadillah", shop: "Classic Cuts Bandung", text: "Dashboard-nya simpel tapi lengkap. Bisa pantau semua booking dari HP." },
]

const FAQ_ITEMS = [
  { q: "Apakah perlu keahlian teknis untuk setup?", a: "Tidak sama sekali. Interface kami dirancang simpel — upload logo, tambah layanan, dan toko kamu langsung live." },
  { q: "Bagaimana pelanggan bisa menemukan toko saya?", a: "Kamu akan dapat link toko-kamu.pangkasin.com yang bisa dibagikan di WhatsApp, bio Instagram, atau kartu nama digital." },
  { q: "Bisakah saya punya lebih dari satu barber?", a: "Bisa! Kamu bisa tambah banyak barber, atur jadwal masing-masing, dan set harga per layanan per barber." },
  { q: "Apakah ada masa percobaan gratis?", a: "Ya, kami menyediakan trial 14 hari gratis. Tidak perlu kartu kredit." },
  { q: "Bagaimana sistem pembayaran booking?", a: "Booking dikonfirmasi secara online, tapi pembayaran tetap dilakukan langsung di toko. Tidak ada payment gateway yang diperlukan." },
]

export async function SaasLandingPage() {
  const t = await getTranslations("saas")

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">

      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-text-inverse font-bold text-sm">P</span>
            </div>
            <span className="text-text-primary font-bold text-lg">Pangkasin</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#features", label: t("nav.features") },
              { href: "#pricing", label: t("nav.pricing") },
              { href: "#faq", label: t("nav.about") },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center h-9 px-5 bg-primary text-text-inverse text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            {t("nav.cta")}
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-bg-base via-bg-surface to-bg-base opacity-80" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F2B90D 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(242,185,13,0.4) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {t("hero.badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t("hero.title").split(" ").map((word, i, arr) =>
              i >= arr.length - 2
                ? <span key={i} className={i === arr.length - 2 ? "text-primary" : "text-primary"}>{word}{i < arr.length - 1 ? " " : ""}</span>
                : <span key={i}>{word} </span>
            )}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-lg"
              style={{ boxShadow: "0 0 24px rgba(242,185,13,0.3)" }}
            >
              {t("hero.ctaPrimary")}
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center h-12 px-8 border border-border text-text-secondary font-medium rounded-lg hover:border-primary/50 hover:text-text-primary transition-colors"
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bg-surface/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("problem.title")}</h2>
            <p className="text-text-secondary">{t("problem.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEM_ITEMS.map((item) => (
              <div key={item.title} className="bg-bg-surface border border-border rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center mb-4">
                  <X className="w-5 h-5 text-error" />
                </div>
                <h3 className="text-text-primary font-semibold mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-primary font-semibold mt-8 text-lg">
            ✦ Pangkasin menyelesaikan semua itu.
          </p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("features.title")}</h2>
            <p className="text-text-secondary">{t("features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-bg-surface border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-text-primary font-semibold mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bg-surface/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("howItWorks.title")}</h2>
            <p className="text-text-secondary">{t("howItWorks.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <div key={step} className="relative text-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px bg-border" />
                )}
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">{step}</span>
                </div>
                <h3 className="text-text-primary font-semibold mb-2">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("pricing.title")}</h2>
            <p className="text-text-secondary">{t("pricing.subtitle")}</p>
          </div>

          <div
            className="bg-bg-surface border border-primary/30 rounded-2xl p-8"
            style={{ boxShadow: "0 0 40px rgba(242,185,13,0.08)" }}
          >
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                {t("pricing.plan")}
              </span>
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-4xl font-bold text-text-primary">{t("pricing.monthlyPrice")}</span>
                <span className="text-text-muted mb-1">{t("pricing.monthlyPer")}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-text-muted">{t("pricing.annualPrice")}{t("pricing.annualPer")}</span>
                <span className="px-2 py-0.5 bg-success/10 text-success rounded-full text-xs font-medium">
                  {t("pricing.annualSaving")}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {PRICING_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/admin/login"
              className="flex items-center justify-center w-full h-12 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              style={{ boxShadow: "0 0 20px rgba(242,185,13,0.25)" }}
            >
              {t("pricing.cta")}
            </Link>
            <p className="text-text-muted text-xs text-center mt-3">{t("pricing.note")}</p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bg-surface/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t("testimonials.title")}</h2>
            <p className="text-text-secondary">{t("testimonials.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((item) => (
              <div key={item.name} className="bg-bg-surface border border-border rounded-xl p-6">
                <p className="text-text-secondary text-sm leading-relaxed mb-5">"{item.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{item.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium text-sm">{item.name}</p>
                    <p className="text-text-muted text-xs">{item.shop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t("faq.title")}</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map(({ q, a }) => (
              <details key={q} className="group bg-bg-surface border border-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-text-primary font-medium text-sm select-none hover:bg-bg-elevated transition-colors">
                  {q}
                  <span className="text-text-muted group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4">▾</span>
                </summary>
                <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-border pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(242,185,13,0.5) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-text-secondary mb-8">{t("cta.subtitle")}</p>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center h-13 px-10 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-colors text-lg"
            style={{ boxShadow: "0 0 32px rgba(242,185,13,0.35)" }}
          >
            {t("cta.button")}
          </Link>
          <p className="text-text-muted text-sm mt-3">{t("cta.note")}</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-text-inverse font-bold text-xs">P</span>
                </div>
                <span className="text-text-primary font-bold">Pangkasin</span>
              </div>
              <p className="text-text-muted text-xs">{t("footer.tagline")}</p>
            </div>
            <nav className="flex items-center gap-6">
              {[
                { href: "#features", label: t("nav.features") },
                { href: "#pricing", label: t("nav.pricing") },
                { href: "#faq", label: t("nav.about") },
                { href: "/admin/login", label: t("nav.cta") },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-text-muted hover:text-text-secondary text-sm transition-colors">
                  {label}
                </a>
              ))}
            </nav>
            <p className="text-text-muted text-xs">
              © {new Date().getFullYear()} Pangkasin. {t("footer.rights")}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
