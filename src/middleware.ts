/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserClient, CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getSession()

  // Subdomain algılama
  const host = request.headers.get('host')
  const url = request.nextUrl.clone()

  // Geliştirme ortamında localhost'u ve Vercel'de .vercel.app'i ele al
  const isLocalhost = host?.includes('localhost')
  const isVercel = host?.includes('.vercel.app')

  let tenantSlug: string | null = null

  if (host) {
    if (isLocalhost) {
      const parts = host.split('.')
      if (parts.length > 2 && parts[0] !== 'www') { // www.localhost:3000 veya sadece localhost:3000 değilse
        tenantSlug = parts[0]
      }
    } else if (isVercel) {
      const parts = host.split('.')
      if (parts.length > 3 && parts[0] !== 'www') { // www.subdomain.vercel.app veya sadece subdomain.vercel.app değilse
        tenantSlug = parts[0]
      }
    } else { // Üretim ortamı için özel domainler
      const parts = host.split('.')
      if (parts && parts.length > 2 && parts[0] !== 'www') {
        tenantSlug = parts[0]
      }
    }
  }

  if (tenantSlug) {
    const { data: tenant, error: _error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()

    if (tenant) {
      // tenantId'yi çerezlere ekle
      response.cookies.set('tenantId', tenant.id, { path: '/' })
      response.cookies.set('tenantSlug', tenantSlug, { path: '/' })
    } else {
      // Kiracı bulunamazsa ana domaine yönlendir
      url.host = isLocalhost ? 'localhost:3000' : (isVercel ? 'berberbul.vercel.app' : 'berberbul.com') // Kendi ana domaininizi buraya yazın
      url.pathname = '/not-found-tenant' // Veya başka bir hata sayfası
      return NextResponse.redirect(url)
    }
  } else {
    // Subdomain yoksa ve ana domainde ise, tenantId çerezini temizle
    response.cookies.delete('tenantId')
    response.cookies.delete('tenantSlug')
  }

  return response
}

export const config = {
  matcher: [
    /*
     *
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - login (login page)
     * - signup (signup page)
     * - auth (auth callback)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|auth).*)(.)',
  ],
}