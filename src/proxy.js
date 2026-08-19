import { NextResponse } from 'next/server'
import { isSafePostLoginPath } from '@/utils/auth/postLoginRedirect'
import { isPathAllowedForRole } from '@/utils/auth/roleAccess'

const LOGIN_ROUTES = ['/login', '/user-login']
const CONSUMER_ROLES = new Set(['AssetHolder', 'DealHunter'])

function resolvePostLoginTarget(request, role, fallbackPath) {
  const raw = request.nextUrl.searchParams.get('redirect')
  if (!raw) return fallbackPath
  let decoded = raw
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    decoded = raw
  }
  if (!isSafePostLoginPath(decoded)) return fallbackPath
  if (!isPathAllowedForRole(decoded, role)) return fallbackPath
  return decoded
}

const normalizeRole = (role) => {
  if (!role) return role
  const cleaned = String(role)
    .replace(/[\s-_]/g, '')
    .toLowerCase()

  if (cleaned === 'assetholder') return 'AssetHolder'
  if (cleaned === 'dealhunter') return 'DealHunter'
  if (cleaned === 'subevaluator') return 'SubEvaluator'
  if (cleaned === '3dwalkthrough') return '3dWalkthrough'
  if (cleaned === 'technicalreport') return 'TechnicalReport'
  if (cleaned === 'evaluator') return 'Evaluator'
  if (cleaned === 'trustee') return 'Trustee'
  if (cleaned === 'admin') return 'Admin'
  if (cleaned === 'advertiser') return 'Advertiser'
  if (cleaned === 'developer') return 'Developer'

  return role
}

const roleRoutes = {
  AssetHolder: [
    '/seller-profile',
    '/dashboard',
    '/dashboard/property-listing',
    '/dashboard/property-forsale',
    '/dashboard/car-listing',
    '/dashboard/jewelry-listing',
    '/dashboard/boat-listing',
    '/dashboard/add-asset',
    '/advertise-with-us',
    '/advertise-with-us/analytics',
  ],
  DealHunter: [
    '/profile',
    '/profile/deal-preference',
    '/profile/purchase-tracker',
    '/seller-profile/all-slot',
    '/seller-profile/my-listing',
    '/dashboard/property-listing',
    '/dashboard/property-forsale',
    '/dashboard/car-listing',
    '/dashboard/jewelry-listing',
    '/dashboard/boat-listing',
    '/dashboard/add-asset',
    '/advertise-with-us',
    '/advertise-with-us/analytics',
  ],
  Trustee: [
    '/trustee',
    '/trustee/asset-overview',
    '/trustee/assigned',
    '/trustee/document',
    '/trustee/metrices',
    '/trustee/transaction',
  ],
  Evaluator: [
    '/evaluator-profile',
    '/evaluator-profile/boat-evaluation',
    '/evaluator-profile/car-evaluation',
    '/evaluator-profile/property-evaluation',
    '/evaluator-profile/jewellery-evaluation',
    '/evaluator-profile/jewelry-evaluation',
    '/evaluator-profile/closed-cases',
    '/evaluator-profile/create-slot',
    '/evaluator-profile/edit-profile',
    '/evaluator-profile/price-list',
    '/evaluator-profile/sale-tab',
    '/advertise-with-us',
    '/advertise-with-us/analytics',
  ],
  SubEvaluator: [
    '/sub-evaluator-profile',
    '/sub-evaluator-profile/boat-evaluation',
    '/sub-evaluator-profile/car-evaluation',
    '/sub-evaluator-profile/property-evaluation',
    '/sub-evaluator-profile/jewellery-evaluation',
    '/sub-evaluator-profile/jewelry-evaluation',
    '/sub-evaluator-profile/edit-profile',
  ],
  '3dWalkthrough': [
    '/3d-walkthrough',
    '/3d-walkthrough/create-slot',
    '/3d-walkthrough/price',
    '/smb-details',
  ],
  TechnicalReport: [
    '/survey-dashboard',
    '/survey-dashboard/requested-reports',
    '/survey-dashboard/technical-report',
    '/survey-dashboard/security',
    '/survey-dashboard/create-slot',
  ],
}

function getRoleHomeRoute(role) {
  switch (role) {
    case 'AssetHolder':
      return '/seller-profile'
    case 'DealHunter':
      return '/profile'
    case 'Evaluator':
      return '/evaluator-profile'
    case 'SubEvaluator':
      return '/sub-evaluator-profile'
    case 'Trustee':
      return '/trustee'
    case '3dWalkthrough':
      return '/3d-walkthrough'
    case 'TechnicalReport':
      return '/survey-dashboard'
    case 'Advertiser':
      return '/advertiser-dashboard'
    case 'Developer':
      return process.env.NEXT_PUBLIC_DEVELOPER_APP_URL || 'http://localhost:3012'
    default:
      return '/'
  }
}

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    path: '/',
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    ...(isProd && {
      domain: process.env.COOKIE_DOMAIN || '.fundsverifier.com',
    }),
  }
}

function clearAuthCookiesOnResponse(response) {
  const isProd = process.env.NODE_ENV === 'production'
  const domain = process.env.COOKIE_DOMAIN || '.fundsverifier.com'
  const names = ['refreshToken', 'accessToken', 'role', 'fv_session']
  const scopes = [
    getCookieOptions(),
    {
      path: '/',
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      httpOnly: true,
    },
    {
      path: '/',
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      httpOnly: false,
    },
  ]

  if (isProd) {
    scopes.push(
      {
        path: '/',
        secure: true,
        sameSite: 'none',
        domain,
        httpOnly: true,
      },
      {
        path: '/',
        secure: true,
        sameSite: 'none',
        domain,
        httpOnly: false,
      },
    )
  }

  for (const name of names) {
    for (const opts of scopes) {
      response.cookies.set(name, '', { ...opts, maxAge: 0 })
    }
  }
}

function copySetCookieHeaders(fromRes, toRes) {
  const raw = fromRes.headers.get('set-cookie')
  if (!raw) return

  if (typeof fromRes.headers.getSetCookie === 'function') {
    for (const cookie of fromRes.headers.getSetCookie()) {
      toRes.headers.append('set-cookie', cookie)
    }
    return
  }

  toRes.headers.append('set-cookie', raw)
}

async function callBackendLogout(request) {
  const base = process.env.NEXT_PUBLIC_BASE_URL
  if (!base) return null

  try {
    return await fetch(`${base}/user/logout`, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })
  } catch {
    return null
  }
}

async function buildRedirectWithSessionCleared(request, redirectPath) {
  const logoutRes = await callBackendLogout(request)
  const response = NextResponse.redirect(new URL(redirectPath, request.url))

  if (logoutRes?.ok) {
    copySetCookieHeaders(logoutRes, response)
  } else {
    clearAuthCookiesOnResponse(response)
  }

  return response
}

async function resolveSession(request) {
  const base = process.env.NEXT_PUBLIC_BASE_URL
  if (!base) {
    console.error('Proxy: NEXT_PUBLIC_BASE_URL is not set')
    return { ok: false, hasCookies: false }
  }

  const { cookies } = request
  const readCookie = (name) => {
    const raw = cookies.get(name)?.value
    return raw && String(raw).trim() ? String(raw).trim() : null
  }

  let accessToken = readCookie('accessToken')
  const refreshToken = readCookie('refreshToken')
  const hasRefreshToken = !!refreshToken
  const cookieHeader = request.headers.get('cookie') || ''

  if (!accessToken && !hasRefreshToken) {
    return { ok: false, hasCookies: false }
  }

  const cookieOptions = getCookieOptions()
  const pendingCookies = []

  const fetchRefresh = async () => {
    const refreshRes = await fetch(`${base}/user/refresh`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
      credentials: 'include',
    })
    if (!refreshRes.ok) return null
    const refreshData = await refreshRes.json()
    return refreshData.accessToken || null
  }

  const fetchMe = async (token) => {
    return fetch(`${base}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
  }

  try {
    if (!accessToken && hasRefreshToken) {
      accessToken = await fetchRefresh()
      if (!accessToken) return { ok: false, hasCookies: true }
      pendingCookies.push({ name: 'accessToken', value: accessToken })
    }

    if (!accessToken) return { ok: false, hasCookies: true }

    let meRes = await fetchMe(accessToken)

    if (meRes.status === 401 && hasRefreshToken) {
      accessToken = await fetchRefresh()
      if (!accessToken) return { ok: false, hasCookies: true }
      pendingCookies.push({ name: 'accessToken', value: accessToken })
      meRes = await fetchMe(accessToken)
    }

    if (!meRes.ok) return { ok: false, hasCookies: true }

    const user = await meRes.json()
    let role = normalizeRole(user.role)
    if (user.role === 'Evaluator' && user.parentEvaluator) {
      role = 'SubEvaluator'
    }

    return {
      ok: true,
      role,
      accessToken,
      pendingCookies,
      cookieOptions,
    }
  } catch (err) {
    console.error('Proxy session error:', err)
    return { ok: false, hasCookies: true }
  }
}

function applyPendingCookies(response, pendingCookies, cookieOptions) {
  for (const { name, value } of pendingCookies) {
    response.cookies.set(name, value, cookieOptions)
  }
}

function redirectAuthenticated(request, session, targetPath) {
  const response = NextResponse.redirect(new URL(targetPath, request.url))
  applyPendingCookies(response, session.pendingCookies, session.cookieOptions)
  return response
}

async function handleLoginRoutes(request, pathname) {
  const session = await resolveSession(request)

  if (!session.ok) {
    if (session.hasCookies) {
      return buildRedirectWithSessionCleared(request, pathname)
    }
    return NextResponse.next()
  }

  const { role } = session

  // Arrange Viewing: staff sessions must reach /login so UAE Pass can start.
  const forceUaePass = request.nextUrl.searchParams.get('uaepass') === '1'
  if (forceUaePass && !CONSUMER_ROLES.has(role)) {
    return NextResponse.next()
  }

  if (pathname === '/user-login' && CONSUMER_ROLES.has(role)) {
    const target = resolvePostLoginTarget(
      request,
      role,
      getRoleHomeRoute(role),
    )
    return redirectAuthenticated(request, session, target)
  }

  if (pathname === '/login' || pathname === '/user-login') {
    // Honor ?redirect= only when this role can open that path.
    const target = resolvePostLoginTarget(
      request,
      role,
      getRoleHomeRoute(role),
    )
    return redirectAuthenticated(request, session, target)
  }

  return NextResponse.next()
}

/** Next.js 16+ edge auth — replaces deprecated `middleware` export. */
export async function proxy(request) {
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  // Public access for listing form (requested): /dashboard/property-listing
  // This bypasses cookie/role checks entirely.
  if (pathname === '/dashboard/property-listing' || pathname.startsWith('/dashboard/property-listing/')) {
    return NextResponse.next()
  }

  if (LOGIN_ROUTES.includes(pathname)) {
    return handleLoginRoutes(request, pathname)
  }

  const session = await resolveSession(request)

  if (!session.ok) {
    if (session.hasCookies) {
      return buildRedirectWithSessionCleared(request, '/login')
    }

    // Local dev: API sets cookies on :4000; Next runs on :5002 — edge cannot see them.
    // Let the page load; client RequireAuth + axios session still gate access.
    const isLocalHost =
      nextUrl.hostname === 'localhost' || nextUrl.hostname === '127.0.0.1'
    const hasFrontendAuthCookie =
      request.cookies.get('accessToken') || request.cookies.get('refreshToken')
    if (isLocalHost && !hasFrontendAuthCookie) {
      return NextResponse.next()
    }

    const returnPath = `${pathname}${nextUrl.search || ''}`
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', returnPath)
    return NextResponse.redirect(loginUrl)
  }

  const { role } = session
  const allowedRoutes = roleRoutes[role] || []
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

  if (!hasAccess) {
    // Wrong-role deep links after login used to dump users on /unauthorized.
    // Send them to their dashboard instead.
    const home = getRoleHomeRoute(role)
    if (home && home.startsWith('/') && home !== pathname) {
      const response = NextResponse.redirect(new URL(home, request.url))
      applyPendingCookies(response, session.pendingCookies, session.cookieOptions)
      return response
    }
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  const response = NextResponse.next()
  applyPendingCookies(response, session.pendingCookies, session.cookieOptions)
  return response
}

export const config = {
  matcher: [
    '/login',
    '/user-login',
    // Exact roots + nested paths (`:path*` alone does not always match the bare URL)
    '/seller-profile',
    '/seller-profile/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/evaluator-profile',
    '/evaluator-profile/:path*',
    '/sub-evaluator-profile',
    '/sub-evaluator-profile/:path*',
    '/profile',
    '/profile/:path*',
    '/trustee',
    '/trustee/:path*',
    '/3d-walkthrough',
    '/3d-walkthrough/:path*',
    '/smb-details',
    '/survey-dashboard',
    '/survey-dashboard/:path*',
  ],
}
