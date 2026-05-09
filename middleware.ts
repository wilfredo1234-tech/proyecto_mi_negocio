import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  let res = NextResponse.next({
    request: { headers: req.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ── Raíz / ────────────────────────────────────────────────
  if (pathname === '/') {
    if (user) return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ── Rutas públicas ────────────────────────────────────────
  const isPublicRoute = pathname === '/login' || pathname === '/register'

  if (isPublicRoute) {
    if (user) return NextResponse.redirect(new URL('/dashboard', req.url))
    return res
  }

  // ── Onboarding ────────────────────────────────────────────
  if (pathname === '/onboarding') {
    if (!user) return NextResponse.redirect(new URL('/login', req.url))
    return res
  }

  // ── Rutas privadas ────────────────────────────────────────
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}