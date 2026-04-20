# PROJECT.md — Pangkasin
> Living document — always reflects current state of the project.
> Updated on every pre-deployment check.

---

## What is Pangkasin?

A multi-tenant SaaS platform for Indonesian barbershops and salons. Each shop gets their own branded subdomain (`shop-name.pangkasin.com`), a public booking website, and an admin dashboard.

**Domain:** pangkasin.com
**Stage:** v1 — active development
**Builder:** Solo developer

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js (latest) | SSR, middleware, server actions |
| Language | TypeScript (strict) | No `any` types |
| Styling | Tailwind CSS | Design system in DESIGN_SYSTEM.md |
| UI Components | shadcn/ui + 21st.dev | As needed per component |
| Auth + DB | Supabase | Auth, PostgreSQL, Storage |
| i18n | next-intl | `id` (default) + `en` |
| Hosting | Vercel | Auto-deploy on push to main |
| Domain | Hostinger | pangkasin.com, 1-year term |

---

## How to Run Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in values (see Environment Variables section below)

# Run development server
npm run dev

# App runs at http://localhost:3000
```

### Local Subdomain Testing
To test subdomain routing locally, add entries to `/etc/hosts`:
```
127.0.0.1 kings-cut.localhost
127.0.0.1 test-shop.localhost
```
Then visit `http://kings-cut.localhost:3000`

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # From Supabase project settings
SUPABASE_SERVICE_ROLE_KEY=          # From Supabase project settings (server only)

# App
NEXT_PUBLIC_APP_URL=https://pangkasin.com
NEXT_PUBLIC_APP_DOMAIN=pangkasin.com
```

---

## Architecture Overview

### Multi-Tenancy
Each barbershop is identified by their subdomain slug:
- `kings-cut.pangkasin.com` → slug: `kings-cut`
- Next.js middleware extracts subdomain from hostname
- Shop loaded from `barbershops` table by `slug`
- All DB queries scoped to resolved `barbershop_id`

### Auth Flow
- Single login page at `/admin/login` for both owners and barbers
- After Supabase Auth verification, role checked from `users` table
- `owner` → redirect to `/admin/dashboard`
- `barber` → redirect to `/barber/schedule`
- Unauthenticated access to `/admin/*` or `/barber/*` → redirect to `/`

### i18n
- Default locale: `id` (Bahasa Indonesia)
- Supported: `id`, `en`
- Translation files: `/messages/id.json`, `/messages/en.json`
- Never hardcode UI strings — always use translation keys

---

## Database Schema

> See PRD.md for full schema detail during initial setup.
> Update this section as schema evolves.

### Tables
- `barbershops` — one row per client shop
- `locations` — shop locations (v1: single per shop)
- `barbers` — individual barbers per shop
- `services` — services offered (no price — price on barber_services)
- `barber_services` — join table: which barber does which service + their price
- `bookings` — customer appointment records
- `schedules` — working hours per barber per day of week
- `blocked_dates` — barber days off / holidays
- `users` — admin users linked to Supabase Auth

### Key Design Decisions
- `services` has no price — price lives on `barber_services` (supports both service-based and barber-based pricing)
- `barber_services.is_available = false` → barber card grayed out in booking flow
- `locations` table exists from day one even though v1 UI is single-location only
- `barbershops.country` and `.currency` fields exist for future SEA expansion

---

## Routes

### Public (Customer-facing)
| Route | Page | Status |
|---|---|---|
| `/` | Landing page | 🔴 Not started |
| `/booking` | Step 1: Select service | 🔴 Not started |
| `/booking/barber` | Step 2: Select barber | 🔴 Not started |
| `/booking/schedule` | Step 3: Schedule & details | 🔴 Not started |
| `/booking/confirmation` | Booking confirmed | 🔴 Not started |

### Admin (Owner)
| Route | Page | Status |
|---|---|---|
| `/admin/login` | Login (shared with barbers) | 🔴 Not started |
| `/admin/dashboard` | Overview + stats | 🔴 Not started |
| `/admin/bookings` | Manage bookings | 🔴 Not started |
| `/admin/team` | Manage barbers | 🔴 Not started |
| `/admin/services` | Manage services | 🔴 Not started |
| `/admin/availability` | Barber availability list | 🔴 Not started |
| `/admin/availability/[barberId]` | Set hours for specific barber | 🔴 Not started |
| `/admin/settings` | Shop settings | 🔴 Not started |

### Barber Portal
| Route | Page | Status |
|---|---|---|
| `/barber/schedule` | My schedule | 🔴 Not started |
| `/barber/availability` | My availability | 🔴 Not started |

> Status: 🔴 Not started | 🟡 In progress | 🟢 Done

---

## Features Status

### v1 — In Scope
| Feature | Status |
|---|---|
| Subdomain multi-tenant routing | 🔴 |
| Supabase schema + RLS | 🔴 |
| Auth (owner + barber login) | 🔴 |
| Branded landing page | 🔴 |
| Booking flow (3 steps + confirmation) | 🔴 |
| Real-time slot availability | 🔴 |
| Barber-based pricing (barber_services) | 🔴 |
| Admin dashboard | 🔴 |
| Manage bookings | 🔴 |
| Team management | 🔴 |
| Service management | 🔴 |
| Barber availability management | 🔴 |
| Shop settings | 🔴 |
| Barber schedule view | 🔴 |
| Barber availability self-management | 🔴 |
| i18n (id + en) | 🔴 |

### Deferred (v2+)
- WhatsApp notifications
- Customer booking cancellation
- Self-serve onboarding + billing
- Analytics dashboard
- Loyalty / punch card
- Multi-location UI
- Custom domain (Pro plan)
- POS / transaction tracking

---

## Git Strategy

### Current (pre-first deployment)
- Single `main` branch
- Push directly to main
- Auto-deploy to Vercel on every push

### After First Deployment
- Full gitflow: `main` → `dev` → `feature/*`
- Never push directly to main
- Feature branches: `feature/booking-flow`, `fix/slot-availability`

---

## Pricing

| Plan | Price | Domain |
|---|---|---|
| Starter | Rp 149.000/bulan or Rp 1.490.000/tahun | `<shop>.pangkasin.com` |
| Pro (v2) | Rp 299.000/bulan or Rp 2.990.000/tahun | Client's own domain |

Annual = pay 10 months, get 12 (2 months free).

---

## Key Decisions Log

| Decision | Rationale |
|---|---|
| Price on `barber_services`, not `services` | Supports both service-based and barber-based pricing models |
| `locations` table from day one | Avoids schema migration when adding multi-location in v2 |
| Single login page for owner + barber | Simpler UX, role-based redirect after auth |
| No customer accounts | Reduces friction — guest booking with name + phone only |
| No WhatsApp in v1 | Scope control for 1-month timeline |
| Xendit over Midtrans (v2) | Supports 6 SEA countries for future international expansion |
| Space Grotesk font | Matches Stitch-generated design system (Midnight Obsidian theme) |
