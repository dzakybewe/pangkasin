<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---
# AGENT.md — Coding Behavior Rules for Claude Code
> Read this file at the start of every session before writing any code.

---

## 0. MCP Servers Available

The following MCP servers are connected and should be used when relevant:

| MCP | Use For |
|---|---|
| **Supabase MCP** | Creating/modifying tables, writing RLS policies, running migrations, querying DB directly — use this instead of asking the human to do it manually in the dashboard |
| **21st.dev Magic MCP** | Fetching and installing UI components from the 21st.dev registry directly into the project |

Always prefer using MCP tools over asking the human to do something manually in a dashboard.

---

## 1. Read the Official Docs First

Next.js bundles its own documentation inside the installed package. **Before writing any Next.js code, always read the relevant bundled docs** to get the correct, version-accurate approach:

```
node_modules/next/dist/docs/
├── 01-app/
│   ├── 01-getting-started/
│   ├── 02-guides/
│   └── 03-api-reference/
├── 02-pages/
├── 03-architecture/
└── index.mdx
```

This ensures you're always using the correct patterns for the exact installed version — not outdated knowledge. When in doubt about **any** Next.js feature (routing, middleware, data fetching, styling, fonts, i18n, etc.), **read the bundled docs first** before writing code.

Same applies for other libraries — always check the installed version's actual documentation before assuming an API or pattern.

---

## 2. Core Principles

- Always follow **best practices per the installed version's documentation**
- When unsure between approaches, choose the **simpler, more maintainable** one
- Write code as if a **senior developer will review it**
- Never sacrifice correctness for speed
- Always think about **multi-tenancy** — every query must be scoped to `barbershop_id`

---

## 3. TypeScript Rules

- **Strict TypeScript only** — `"strict": true` in tsconfig, zero `any` types
- Always define types/interfaces for all data structures
- Use `type` for unions and primitives, `interface` for object shapes
- Export types from a central `/types` folder or colocate with feature
- Never use `// @ts-ignore` or `// @ts-expect-error` without explanation
- Use Zod for runtime validation on all form submissions and API inputs

```typescript
// ✅ Good
interface Barber {
  id: string
  barbershopId: string
  name: string
  photoUrl: string | null
  isActive: boolean
}

// ❌ Bad
const barber: any = {}
```

---

## 4. Next.js Rules

> When in doubt on any of these, read `node_modules/next/dist/docs/` first.

### App Router
- Use **App Router** (`/app` directory) exclusively — no Pages Router
- **Server Components by default** — only add `'use client'` when you need:
  - useState, useEffect, or other React hooks
  - Browser APIs (window, document)
  - Event listeners
  - Third-party client libraries

### Data Fetching
- Fetch data in **Server Components** when possible
- Use **Server Actions** for form mutations (create, update, delete)
- Use **API Routes** only for webhooks or third-party integrations
- Never `fetch()` your own API routes from Server Components — call DB directly

### Routing & Middleware
- Use Next.js middleware (`middleware.ts`) for auth protection and subdomain routing
- Dynamic routes: `[param]` convention
- Route groups: `(group)` convention e.g. `(public)`, `(admin)`, `(barber)`

### Performance
- Use `next/image` for all images — never raw `<img>` tags
- Use `next/font` for font loading
- Use `Suspense` boundaries for async Server Components

---

## 5. Folder Structure

```
pangkasin/
├── app/
│   ├── (saas)/             # SaaS marketing routes — root domain only (pangkasin.com)
│   │   └── page.tsx        # Pangkasin SaaS landing page
│   ├── (public)/           # Customer-facing routes — barbershop subdomains
│   │   ├── page.tsx        # Barbershop landing page (shop.pangkasin.com/)
│   │   └── booking/
│   │       ├── page.tsx              # Step 1: Select service
│   │       ├── barber/page.tsx       # Step 2: Select barber
│   │       ├── schedule/page.tsx     # Step 3: Schedule & details
│   │       └── confirmation/page.tsx # Booking confirmed
│   ├── (admin)/            # Owner routes
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       ├── (protected)/          # Auth-gated admin pages
│   │       │   ├── layout.tsx        # Sidebar + auth check
│   │       │   ├── dashboard/page.tsx
│   │       │   ├── bookings/page.tsx
│   │       │   ├── team/page.tsx
│   │       │   ├── services/page.tsx
│   │       │   ├── availability/
│   │       │   │   ├── page.tsx              # List barbers to select
│   │       │   │   └── [barberId]/page.tsx   # Set hours for specific barber
│   │       │   └── settings/page.tsx
│   ├── (barber)/           # Barber routes
│   │   └── barber/
│   │       ├── schedule/page.tsx
│   │       └── availability/page.tsx
│   ├── api/                # API routes (webhooks only)
│   └── layout.tsx
├── components/
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── booking/            # Booking flow specific components
│   ├── admin/              # Admin panel specific components
│   ├── barber/             # Barber portal specific components
│   └── shared/             # Shared across all sections
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client
│   │   └── queries/        # All DB query functions
│   │       ├── barbershops.ts
│   │       ├── barbers.ts
│   │       ├── services.ts
│   │       ├── bookings.ts
│   │       └── availability.ts
│   └── utils.ts
├── types/
│   └── index.ts            # All shared TypeScript types
├── messages/
│   ├── id.json             # Bahasa Indonesia strings
│   └── en.json             # English strings
├── middleware.ts            # Auth + subdomain routing
├── PRD.md                  # (delete after setup)
├── PROJECT.md
├── DESIGN_SYSTEM.md
├── AGENT.md
└── prompts/
    ├── new-agent-prompt.md
    ├── pre-deployment-prompt.md
    └── docs-update-prompt.md
```

---

## 6. Supabase Rules

### Client Usage
- Server Components, Server Actions, API Routes → use **server client**
- Client Components → use **browser client**
- Check Supabase docs for the correct SSR helpers for the installed version

### Query Rules
- **All queries must be scoped to `barbershop_id`** — no exceptions
- All queries live in `/lib/supabase/queries/` — never inline in components
- Always handle errors — never assume a query succeeds
- Use typed returns — generate types with `supabase gen types`

```typescript
// ✅ Good — scoped query in /lib/supabase/queries/barbers.ts
export async function getBarbersByShop(barbershopId: string): Promise<Barber[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('barbershop_id', barbershopId)
    .eq('is_active', true)

  if (error) throw new Error(error.message)
  return data
}

// ❌ Bad — unscoped, inline query
const { data } = await supabase.from('barbers').select('*')
```

### RLS
- Always enable RLS on every table
- Never disable RLS even for debugging — use service role key carefully
- Test RLS policies before considering a feature complete

---

## 7. Styling Rules

- **Tailwind CSS only** — no inline styles, no CSS modules, no styled-components
- Use **design system values** from `DESIGN_SYSTEM.md` — no hardcoded color hex values
- For Tailwind configuration specifics, read the installed version's bundled docs
- Use `cn()` utility for conditional class merging
- Mobile-first responsive — always start with mobile, add `md:` and `lg:` breakpoints
- Dark theme is the only theme — no light mode needed

```typescript
// ✅ Good — uses design system tokens
<div className="bg-bg-surface border border-border rounded-lg p-6">

// ❌ Bad — hardcoded color
<div style={{ backgroundColor: '#1A1A1A', padding: '24px' }}>
```

---

## 8. UI Component Library Rules

**Use the best tool for the job.** Do not default to building everything from scratch. Evaluate available libraries before writing custom components.

### Decision Order
For any UI component needed, evaluate in this order:

1. **shadcn/ui** — base library, installed by default. Use for: buttons, inputs, dialogs, dropdowns, tables, cards, badges, tabs, calendars, toggles
2. **21st.dev** — premium component registry. Use when shadcn doesn't have what you need or when a significantly better component exists. Components are copied directly into the project (not npm installed). Browse at https://21st.dev to find components.
3. **Magic UI** — animation-focused components. Use for: hero sections, landing page animations, loading states, transitions
4. **Build custom** — only if none of the above have a suitable component

### How to Use 21st.dev
21st.dev is a registry, not an npm package. To use a component:
- Browse https://21st.dev for the right component
- Copy the component code directly into `/components/ui/`
- Adapt it to match the Pangkasin design system tokens

### How to Decide
Ask yourself:
- Does shadcn/ui have this? → use it
- Is this a complex/animated UI element shadcn can't do well? → check 21st.dev or Magic UI
- Is this completely unique to Pangkasin's domain? → build custom

### Rules
- Always adapt any third-party component to use design system tokens from `DESIGN_SYSTEM.md`
- Never use a component's default colors — always override with Pangkasin's palette
- Document in a comment which library a component came from if not custom

---

## 9. i18n Rules

- **Never hardcode UI strings** — always use translation keys
- Default locale: `id` (Bahasa Indonesia)
- Supported locales: `id`, `en`
- All keys must exist in both `messages/id.json` and `messages/en.json`
- Use descriptive namespaced keys: `booking.selectService.title`
- For implementation specifics, read the installed `next-intl` docs

```typescript
// ✅ Good
const t = useTranslations('booking.selectService')
return <h1>{t('title')}</h1>

// ❌ Bad
return <h1>Pilih Layanan</h1>
```

---

## 10. Component Rules

- One component per file
- Component files use **PascalCase**: `BookingCard.tsx`
- Utility files use **camelCase**: `formatCurrency.ts`
- Always define prop types explicitly — no implicit `any`
- Prefer composition over large monolithic components
- Extract reusable logic into custom hooks (`/hooks`)

```typescript
// ✅ Good
interface BookingCardProps {
  booking: Booking
  onStatusChange: (id: string, status: BookingStatus) => void
}

export function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  // ...
}
```

---

## 11. Multi-Tenancy Rules

These rules are **non-negotiable**:

- Every DB query **must** be filtered by `barbershop_id`
- The `barbershop_id` always comes from the **subdomain**, never from user input
- Never trust client-provided `barbershop_id` — always resolve from middleware
- The resolved shop must be attached to the request via middleware and accessed server-side
- Public booking pages: resolve shop from subdomain, never expose other shops' data

---

## 12. Error Handling

- Always use try/catch for async operations
- Never swallow errors silently
- Show user-friendly error messages (use i18n keys)
- Log errors server-side for debugging
- Use typed error handling — define error types

```typescript
// ✅ Good
try {
  const booking = await createBooking(data)
  return { success: true, booking }
} catch (error) {
  console.error('[createBooking]', error)
  return { success: false, error: 'booking.error.createFailed' }
}
```

---

## 13. Git Rules

### Current (pre-first deployment)
- Single `main` branch — push directly
- Commit messages: `feat:`, `fix:`, `chore:`, `docs:` prefixes

### After First Deployment
- Full gitflow: `main` + `dev` + feature branches
- Feature branches: `feature/booking-flow`, `fix/availability-bug`
- PRs from feature → dev → main
- Never push directly to main after first deployment

### Commit Message Format

Follow **Conventional Commits**: `<type>: <short description>` — one line, lowercase, no period.

```
feat: add barber availability management page
fix: resolve slot availability calculation bug
chore: update dependencies
docs: update PROJECT.md with new routes
refactor: extract booking slot logic to utils
style: fix inconsistent card padding
perf: memoize availability query
test: add booking flow unit tests
build: upgrade to next-intl v5
ci: add github actions workflow
```

**Types:** `feat` `fix` `chore` `docs` `refactor` `style` `perf` `test` `build` `ci`
**BREAKING CHANGE:** append `!` after type — e.g. `feat!: rename barbershop slug field`

---

## 14. Environment Variables

- Never hardcode env values — always use `process.env.VARIABLE_NAME`
- All env vars must be documented in `.env.example`
- Public vars (browser-accessible): prefix with `NEXT_PUBLIC_`
- Secret vars (server-only): no prefix

```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## 15. What Never To Do

- ❌ Never use `any` TypeScript type
- ❌ Never write unscoped Supabase queries (missing `barbershop_id` filter)
- ❌ Never hardcode colors — use design system tokens
- ❌ Never hardcode UI strings — use i18n keys
- ❌ Never use `<img>` — always `next/image`
- ❌ Never fetch your own API routes from Server Components
- ❌ Never disable RLS in Supabase
- ❌ Never commit `.env` files
- ❌ Never write tests in v1 (ship fast)
- ❌ Never use inline styles
- ❌ Never add `'use client'` without a clear reason
- ❌ Never assume how a library works — read the bundled/installed docs first
