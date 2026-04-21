import Link from "next/link"
import Image from "next/image"
import { headers } from "next/headers"
import { getTranslations } from "next-intl/server"
import { MapPin, Phone, Mail, Clock, AtSign } from "lucide-react"
import { getPublicShopData } from "@/lib/supabase/queries/public"
import { PublicNavbar } from "@/components/shared/PublicNavbar"
import { SaasLandingPage } from "@/components/saas/SaasLandingPage"

export default async function PublicLandingPage() {
  const headersList = await headers()
  const slug = headersList.get("x-shop-slug")
  const t = await getTranslations("landing")
  const tn = await getTranslations("nav")

  if (!slug) {
    return <SaasLandingPage />
  }

  const data = await getPublicShopData(slug)

  if (!data) {
    return (
      <main className="min-h-screen bg-bg-base flex items-center justify-center px-4">
        <p className="text-text-secondary">Toko tidak ditemukan.</p>
      </main>
    )
  }

  const { shop, location, services, barbers, galleryUrls } = data

  return (
    <div className="min-h-screen bg-bg-base">
      <PublicNavbar shopName={shop.name} logoUrl={shop.logo_url} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-bg-base pt-24 pb-32 px-4">
        <div className="absolute inset-0 bg-linear-to-br from-bg-base via-bg-surface to-bg-base opacity-80" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #F2B90D 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            {shop.name}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
            Tampil Terbaik,<br />
            <span className="text-primary">Booking Mudah</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
            {location?.address && `${location.city} — `}Reservasi online, pilih barber favoritmu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center h-12 px-8 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-lg"
              style={{ boxShadow: "0 0 20px rgba(242,185,13,0.3)" }}
            >
              {tn("bookNow")}
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center h-12 px-8 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
            >
              {t("hero.viewServices")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      {services.length > 0 && (
        <section id="services" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-3">{t("services.title")}</h2>
              <p className="text-text-secondary">{t("services.subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <div key={service.id} className="bg-bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                  <h3 className="text-text-primary font-semibold text-lg mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-text-secondary text-sm mb-4">{service.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-text-muted text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t("services.duration", { duration: service.duration_minutes })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Team ─────────────────────────────────────────────── */}
      {barbers.length > 0 && (
        <section id="team" className="py-20 px-4 bg-bg-surface/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-3">{t("team.title")}</h2>
              <p className="text-text-secondary">{t("team.subtitle")}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {barbers.map((barber) => (
                <div key={barber.id} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-bg-elevated border-2 border-border">
                    {barber.photo_url ? (
                      <Image
                        src={barber.photo_url}
                        alt={barber.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-text-muted text-2xl font-bold">
                          {barber.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-text-primary font-semibold">{barber.name}</h3>
                  {barber.specialty && (
                    <p className="text-text-muted text-sm mt-1">{barber.specialty}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ──────────────────────────────────────────── */}
      {galleryUrls.length > 0 && (
        <section id="gallery" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary text-center mb-12">{t("gallery.title")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {galleryUrls.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-bg-surface">
                  <Image
                    src={url}
                    alt={`Gallery ${i + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Location & Contact ───────────────────────────────── */}
      {location && (
        <section id="location" className="py-20 px-4 bg-bg-surface/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
              {t("location.title")}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{t("location.address")}</p>
                    <p className="text-text-primary">{location.address}</p>
                    <p className="text-text-secondary text-sm">{location.city}, {location.province}</p>
                  </div>
                </div>
                {location.phone && (
                  <div className="flex gap-4">
                    <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-secondary text-sm font-medium mb-1">{t("location.phone")}</p>
                      <a href={`tel:${location.phone}`} className="text-text-primary hover:text-primary transition-colors">
                        {location.phone}
                      </a>
                    </div>
                  </div>
                )}
                {location.email && (
                  <div className="flex gap-4">
                    <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-secondary text-sm font-medium mb-1">Email</p>
                      <a href={`mailto:${location.email}`} className="text-text-primary hover:text-primary transition-colors">
                        {location.email}
                      </a>
                    </div>
                  </div>
                )}
                {location.instagram && (
                  <div className="flex gap-4">
                    <AtSign className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-secondary text-sm font-medium mb-1">Instagram</p>
                      <a
                        href={`https://instagram.com/${location.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-primary hover:text-primary transition-colors"
                      >
                        {location.instagram}
                      </a>
                    </div>
                  </div>
                )}
                {location.whatsapp && (
                  <div className="flex gap-4">
                    <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-text-secondary text-sm font-medium mb-1">WhatsApp</p>
                      <a
                        href={`https://wa.me/${location.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-primary hover:text-primary transition-colors"
                      >
                        {location.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
                {location.maps_url && (
                  <a
                    href={location.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-10 px-5 border border-primary text-primary text-sm font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    {t("location.getDirections")}
                  </a>
                )}
              </div>

              {/* Maps embed */}
              {location.maps_url && (
                <div className="rounded-xl overflow-hidden border border-border h-72 lg:h-auto bg-bg-surface flex items-center justify-center">
                  <a
                    href={location.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 text-text-muted hover:text-primary transition-colors"
                  >
                    <MapPin className="w-10 h-10" />
                    <span className="text-sm">{t("location.getDirections")}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-text-inverse font-bold text-xs">
                {shop.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-text-primary font-semibold text-sm">{shop.name}</span>
          </div>
          <nav className="flex items-center gap-6">
            {[
              { href: "#services", label: tn("services") },
              { href: "#team", label: tn("barbers") },
              { href: "#location", label: tn("location") },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="text-text-muted hover:text-text-secondary text-sm transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} {shop.name}. {t("footer.rights")}.
          </p>
        </div>
      </footer>
    </div>
  )
}
