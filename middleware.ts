import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /kiosk と /api と /login は認証不要
  if (
    pathname.startsWith('/kiosk') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login')
  ) {
    return NextResponse.next()
  }

  // Supabase のセッションCookieを確認
  const hasCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  if (!hasCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
