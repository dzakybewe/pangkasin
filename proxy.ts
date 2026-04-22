import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

function extractShopSlug(hostname: string): string | null {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "localhost"
  const host = hostname.split(":")[0]

  if (host === "localhost" || host === appDomain) return null

  if (host.endsWith(`.${appDomain}`) || host.endsWith(".localhost")) {
    return host.split(".")[0] ?? null
  }

  return null
}

export async function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const hostname = request.headers.get("host") ?? ""
  const shopSlug = extractShopSlug(hostname)

  // Forward shop slug to Server Components via request header.
  // Must be set on the request (not response) for headers() in Server Components to see it.
  const requestHeaders = new Headers(request.headers)
  if (shopSlug) requestHeaders.set("x-shop-slug", shopSlug)

  // ── Supabase auth session refresh ──────────────────────────
  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            requestHeaders.set("cookie", `${name}=${value}`)
          )
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = pathname.startsWith("/admin")
  const isBarberRoute = pathname.startsWith("/barber")
  const isLoginPage = pathname === "/admin/login"
  const isProtected = isAdmin || isBarberRoute

  // ── Unauthenticated → redirect to login ────────────────────
  if (isProtected && !isLoginPage && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // ── Authenticated on login page → redirect by role ─────────
  if (isLoginPage && user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userData?.role === "owner") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
    if (userData?.role === "barber") {
      return NextResponse.redirect(new URL("/barber/schedule", request.url))
    }
  }

  // ── Barber trying to access /admin/* → redirect ─────────────
  if (isAdmin && !isLoginPage && user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userData?.role === "barber") {
      return NextResponse.redirect(new URL("/barber/schedule", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
