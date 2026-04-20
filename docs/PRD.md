# Pangkasin — Product Requirements Document
> Version 3.0 | April 2026 | **One-time reference document — delete after PROJECT.md is fully populated**

---

## 1. What is Pangkasin?

Pangkasin is a **multi-tenant SaaS platform** that gives Indonesian barbershops and salons their own branded online presence, a customer-facing booking system, and an admin dashboard — all under a custom subdomain (`kings-cut.pangkasin.com`).

- **"Pangkas"** = to trim/cut in Indonesian
- **"-in"** suffix = modern Indonesian app feel (like Gojek, Tokopedia)
- Broader than barbershop only — covers salons, spas, grooming in future phases
- Built for Indonesia first, designed to expand across Southeast Asia

---

## 2. Problem Being Solved

| Problem | Reality |
|---|---|
| No online presence | Most Indonesian barbershops have no website |
| Bookings via WhatsApp | Manual, chaotic, causes double bookings and missed appointments |
| No schedule visibility | Barbers don't know their day, owners can't manage workload |

---

## 3. Target Users

### Barbershop Owner / Manager
- Runs a barbershop anywhere in Indonesia (1–10+ barbers)
- Non-technical — needs a simple admin panel
- Currently managing bookings via WhatsApp or walk-ins
- Wants a professional digital presence

### End Customer
- Books as a guest — name + phone only, no account needed
- Mobile-first — majority book from phones
- Wants to choose their barber and see real-time availability

### Individual Barber
- Sees their own upcoming schedule
- Manages their own working hours and days off
- Logs in separately from the owner (same login page, role-based redirect)

---

## 4. Business Model & Pricing

### Starter Plan (v1 — only plan at launch)
- **Monthly:** Rp 149.000/bulan
- **Annual:** Rp 1.490.000/tahun (pay 10 months, get 12 — 2 months free)
- **Domain:** `<shop-name>.pangkasin.com` (subdomain, free)
- **Setup fee:** None — pure recurring subscription

### Pro Plan (Phase 2)
- **Monthly:** Rp 299.000/bulan
- **Annual:** Rp 2.990.000/tahun
- **Domain:** Client's own custom domain (e.g. kingscut.com) mapped to Pangkasin

### Cost Structure
- Domain: Rp 170.066/year (pangkasin.com on Hostinger)
- Hosting: Free (Vercel)
- Database: Free (Supabase free tier)
- Total early stage cost: ~Rp 170k/year

---

## 5. Domain & Multi-Tenancy

### Subdomain Strategy
One domain purchase supports unlimited free subdomains:
```
kings-cut.pangkasin.com       → Kings Cut Jakarta
rumble.pangkasin.com          → Rumble Barbershop
salon-cantik.pangkasin.com    → Salon Cantik Bandung
```

### How Shop Identity Works
- Wildcard DNS `*.pangkasin.com` points to Vercel
- Next.js middleware extracts subdomain from request hostname
- Shop loaded from `barbershops` table by `slug` field
- Phase 2: check `custom_domain` field first, fallback to slug

### Multi-Location (Franchise)
- `locations` table exists in DB from day one
- v1 UI: single location only (location step hidden in booking)
- v2 UI: location selection added as Step 0 in booking flow

---

## 6. Sitemap & Routes

### Public Routes (Customer-facing)
No Pangkasin branding visible. Branded as the barbershop.

| Route | Page |
|---|---|
| `/` | Landing page — hero, services, team, gallery, location, footer |
| `/booking` | Step 1 — Select service |
| `/booking/barber` | Step 2 — Select barber (with price per barber) |
| `/booking/schedule` | Step 3 — Pick date, time slot, enter name + phone |
| `/booking/confirmation` | Booking confirmed — appointment summary |

### Admin Routes (Owner)
| Route | Page |
|---|---|
| `/admin/login` | Login page — shared with barbers, role-based redirect after auth |
| `/admin/dashboard` | Today's appointments, this week count, all-time total |
| `/admin/bookings` | View, filter, confirm, done, cancel bookings |
| `/admin/team` | Add, edit, remove barbers |
| `/admin/services` | Add, edit, remove services |
| `/admin/availability` | Set working hours + blocked dates per barber |
| `/admin/settings` | Logo, brand color, shop name, address, contact |

### Barber Routes (Individual Barber)
| Route | Page |
|---|---|
| `/barber/schedule` | Own upcoming appointments (read-only) |
| `/barber/availability` | Own working hours + days off |

**Note:** `/admin/login` handles both owner and barber login. After Supabase Auth verifies credentials, system checks `users.role` and redirects:
- `owner` → `/admin/dashboard`
- `barber` → `/barber/schedule`

---

## 7. Booking Flow

**Target: Customer completes booking in under 2 minutes. No login required.**

```
Landing Page (/)
  ↓ "Book Now" CTA
Step 1 — Select Service (/booking)
  Shows: service name, description, duration
  NO price shown yet (price depends on barber)
  ↓ tap service card
Step 2 — Select Barber (/booking/barber)
  Shows: barber photo, name, specialty, price for selected service
  Grayed out: barbers who cannot do the selected service (is_available = false)
  Option: "Any Barber" (shows price range e.g. Rp 50k – Rp 100k)
  ↓ tap barber card
Step 3 — Schedule & Details (/booking/schedule)
  Shows: calendar (block past dates), available time slots grouped by morning/afternoon/evening
  Customer enters: full name + phone number (WhatsApp preferred)
  Bottom bar: selected service + barber + price
  ↓ "Confirm Booking"
Step 4 — Confirmation (/booking/confirmation)
  Shows: appointment summary (service, barber, date, time, location)
  Option: Add to Calendar
  Customer pays at the shop — no online payment in v1
```

---

## 8. Features — v1 Scope

### ✅ In v1
| Feature | Notes |
|---|---|
| Branded landing page | Hero, services, team, gallery, location — no Pangkasin branding |
| Online booking flow (guest) | 3 steps + confirmation, no login needed |
| Real-time slot availability | Based on barber schedule + existing bookings |
| Barber-based pricing | Price lives on `barber_services` join table, not `services` |
| Admin login (shared) | Role-based redirect after auth |
| Admin dashboard | Today's appointments, this week count, all-time counter |
| Manage bookings | View, confirm, mark done, cancel |
| Team management | Add/edit/remove barbers with photo, bio, specialty |
| Service management | Add/edit/remove services with name, description, duration |
| Barber availability | Working hours per day + blocked dates per barber |
| Shop settings | Logo, brand color, shop name, address, contact, social links |
| Barber schedule view | Own upcoming appointments |
| Barber availability self-management | Own working hours + days off |
| Subdomain routing | Multi-tenant via Next.js middleware |
| i18n | Indonesian (default) + English via next-intl |

### ❌ Not in v1 (future phases)
- WhatsApp notifications → v2
- Customer booking cancellation → v2
- Self-serve signup + billing → v2
- Analytics dashboard → v2
- Loyalty / punch card → v2
- Multi-location UI → v2
- Custom domain (Pro plan) → v2
- POS / transaction tracking → v3
- Native mobile app → v3

---

## 9. Database Schema

> All tables have `barbershop_id`. Tables with location data also have `location_id`. Built multi-tenant from day one.

### `barbershops`
```sql
id              uuid PRIMARY KEY
name            text
slug            text UNIQUE          -- used for subdomain routing
logo_url        text
primary_color   text                 -- hex color e.g. #F2B90D
owner_id        uuid                 -- references auth.users
custom_domain   text                 -- nullable, Phase 2 Pro plan
country         text DEFAULT 'ID'    -- future international expansion
currency        text DEFAULT 'IDR'   -- future multi-currency
is_active       boolean DEFAULT true
created_at      timestamptz
```

### `locations`
```sql
id              uuid PRIMARY KEY
barbershop_id   uuid REFERENCES barbershops
name            text
address         text
city            text
province        text
phone           text
maps_url        text
is_active       boolean DEFAULT true
```

### `barbers`
```sql
id              uuid PRIMARY KEY
barbershop_id   uuid REFERENCES barbershops
location_id     uuid REFERENCES locations
name            text
photo_url       text
bio             text
specialty       text
is_active       boolean DEFAULT true
```

### `services`
```sql
id              uuid PRIMARY KEY
barbershop_id   uuid REFERENCES barbershops
name            text
description     text
duration_minutes integer
is_active       boolean DEFAULT true
-- NO price here — price is on barber_services
```

### `barber_services` (join table — handles both pricing models)
```sql
id              uuid PRIMARY KEY
barber_id       uuid REFERENCES barbers
service_id      uuid REFERENCES services
price           integer              -- in IDR (Rupiah)
duration_minutes integer            -- optional override per barber
is_available    boolean DEFAULT true -- false = barber card grayed out
```

### `schedules`
```sql
id              uuid PRIMARY KEY
barber_id       uuid REFERENCES barbers
day_of_week     integer              -- 0=Sunday, 6=Saturday
open_time       time
close_time      time
is_working      boolean DEFAULT true
```

### `blocked_dates`
```sql
id              uuid PRIMARY KEY
barber_id       uuid REFERENCES barbers
date            date
reason          text
```

### `bookings`
```sql
id              uuid PRIMARY KEY
barbershop_id   uuid REFERENCES barbershops
location_id     uuid REFERENCES locations
barber_id       uuid REFERENCES barbers
service_id      uuid REFERENCES services
customer_name   text
customer_phone  text
datetime        timestamptz
status          text                 -- pending | confirmed | done | cancelled
notes           text
created_at      timestamptz
```

### `users`
```sql
id              uuid PRIMARY KEY     -- matches auth.users id
barbershop_id   uuid REFERENCES barbershops
email           text
role            text                 -- owner | barber
barber_id       uuid REFERENCES barbers  -- nullable, only if role=barber
created_at      timestamptz
```

---

## 10. Auth & Security

### Route Protection (middleware.ts)
- Unauthenticated `/admin/*` or `/barber/*` → silently redirect to `/`
- Authenticated owner visiting `/admin/login` → redirect to `/admin/dashboard`
- Authenticated barber visiting `/admin/login` → redirect to `/barber/schedule`
- Barbers cannot access `/admin/*` routes — role check in middleware

### Supabase RLS
- Owners: read/write only data matching their `barbershop_id`
- Barbers: read bookings for their `barber_id`, write own availability only
- Public booking queries: read-only, scoped to current shop's subdomain

---

## 11. Internationalization (i18n)

- Library: `next-intl`
- Default locale: `id` (Bahasa Indonesia)
- Supported locales: `id`, `en`
- Locale files: `/messages/id.json` and `/messages/en.json`
- **Rule: Never hardcode UI strings in components — always use translation keys**
- URL strategy: prefix-based `/id/...` and `/en/...` or auto-detect from browser

---

## 12. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + 21st.dev as needed |
| Auth + DB | Supabase |
| File Storage | Supabase Storage |
| i18n | next-intl |
| Hosting | Vercel |
| Domain | Hostinger (pangkasin.com) |
| Payments (v2) | Xendit (supports ID, MY, PH, SG, TH, VN) |
| WhatsApp (v2) | Fonnte or Wablas |

---

## 13. Competitor Landscape

| Product | Market | Weakness vs Pangkasin |
|---|---|---|
| Minutes Apps (ID) | Indonesia | Marketplace/directory feel, not own branded site. Rp 250k+/month. |
| Fresha (Global) | Global | 20% fee on new clients. No Indonesia support. |
| Booksy (Global) | Global | USD pricing, no Indonesia. |
| Squire (Global) | US only | No SEA presence. |
| Vagaro (Global) | US/CA/AU | No Rupiah, no WhatsApp. |

**Pangkasin's edge:** Only platform giving each Indonesian barbershop their own branded website (not a marketplace listing) at an affordable Rupiah price point with local payment and WhatsApp support coming in v2.

---

## 14. 4-Week Sprint Plan

| Week | Focus | Deliverables |
|---|---|---|
| Week 1 | Foundation | Next.js setup, Supabase schema + RLS, auth middleware, subdomain routing, shop settings page |
| Week 2 | Public site | Landing page — hero, services, team, gallery, location. Mobile responsive. |
| Week 3 | Booking flow | 3-step booking, real-time slot availability, confirmation screen |
| Week 4 | Admin panel | Dashboard, bookings, team, services, availability, barber login + schedule |

---

*This document is a one-time reference. Once PROJECT.md is fully populated after Week 1, this file can be deleted.*
