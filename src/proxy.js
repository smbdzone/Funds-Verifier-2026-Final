// import { NextResponse } from 'next/server'

// const PUBLIC_ROUTES = ['/login', '/user-login']

// const normalizeRole = (role) => {
//   if (!role) return role
//   const cleaned = String(role)
//     .replace(/[\s-_]/g, '')
//     .toLowerCase()
//   if (cleaned === 'assetholder') return 'AssetHolder'
//   if (cleaned === 'dealhunter') return 'DealHunter'
//   if (cleaned === 'subevaluator') return 'SubEvaluator'
//   if (cleaned === '3dwalkthrough') return '3dWalkthrough'
//   if (cleaned === 'technicalreport') return 'TechnicalReport'
//   if (cleaned === 'evaluator') return 'Evaluator'
//   if (cleaned === 'trustee') return 'Trustee'
//   if (cleaned === 'admin') return 'Admin'
//   return role
// }

// const roleRoutes = {
//   AssetHolder: [
//     '/seller-profile',
//     '/dashboard',
//     '/dashboard/property-listing',
//     '/dashboard/car-listing',
//     '/dashboard/jewelry-listing',
//     '/dashboard/boat-listing',
//     '/dashboard/add-asset',
//     '/advertise-with-us',
//     '/advertise-with-us/analytics',
//   ],
//   DealHunter: [
//     '/profile',
//     '/profile/deal-preference',
//     '/profile/purchase-tracker',
//     '/advertise-with-us',
//     '/advertise-with-us/analytics',
//   ],
//   Trustee: [
//     '/trustee',
//     '/trustee/asset-overview',
//     '/trustee/assigned',
//     '/trustee/document',
//     '/trustee/metrices',
//     '/trustee/transaction',
//     '/trustee/viewing',
//   ],
//   Evaluator: [
//     '/evaluator-profile',
//     '/evaluator-profile/boat-evaluation',
//     '/evaluator-profile/car-evaluation',
//     '/evaluator-profile/property-evaluation',
//     '/evaluator-profile/jewellery-evaluation',
//     '/evaluator-profile/closed-cases',
//     '/evaluator-profile/create-slot',
//     '/evaluator-profile/document-storage',
//     '/evaluator-profile/edit-profile',
//     '/evaluator-profile/electronic-consent',
//     '/evaluator-profile/price-list',
//     '/evaluator-profile/sale-tab',
//     '/evaluator-profile/transaction-tracker',
//     '/advertise-with-us',
//     '/advertise-with-us/analytics',
//   ],
//   SubEvaluator: [
//     '/sub-evaluator-profile',
//     '/sub-evaluator-profile/boat-evaluation',
//     '/sub-evaluator-profile/car-evaluation',
//     '/sub-evaluator-profile/property-evaluation',
//     '/sub-evaluator-profile/jewellery-evaluation',
//     '/sub-evaluator-profile/document-storage',
//     '/sub-evaluator-profile/edit-profile',
//     '/sub-evaluator-profile/electronic-consent',
//     '/sub-evaluator-profile/price-list',
//     '/sub-evaluator-profile/transaction-tracker',
//   ],
//   '3dWalkthrough': [
//     '/3d-walkthrough',
//     '/3d-walkthrough/create-slot',
//     '/3d-walkthrough/price',
//   ],
//   TechnicalReport: [
//     '/survey-dashboard',
//     '/survey-dashboard/requested-reports',
//     '/survey-dashboard/security',
//     '/survey-dashboard/create-slot',
//   ],
// }

// export async function middleware(request) {
//   const { nextUrl, cookies } = request
//   const pathname = nextUrl.pathname

//   if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next()

//   let role = normalizeRole(cookies.get('role')?.value)
//   let accessToken = cookies.get('accessToken')?.value
//   let refreshToken = cookies.get('refreshToken')?.value
//   const hasRefreshToken = !!refreshToken
//   const isProd = process.env.NODE_ENV === 'production'

//   // NextResponse cookies need the same lifetime rules as backend cookies.
//   // Using seconds because Next cookie helpers expect seconds.
//   const refreshMaxAgeSeconds = 3 * 24 * 60 * 60
//   const cookieCommonOptions = {
//     path: '/',
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? 'none' : 'lax',
//     maxAge: refreshMaxAgeSeconds,
//   }

//   if (!accessToken && !hasRefreshToken) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // Helper to fetch /me
//   const fetchMe = async (token) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//       credentials: 'include',
//     })
//     console.log(res, 'login me response')
//     return res
//   }

//   let meRes
//   const response = NextResponse.next()

//   try {
//     // If no accessToken but has refreshToken, refresh first
//     if (!accessToken && hasRefreshToken) {
//       const refreshRes = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/user/refresh`,
//         {
//           method: 'GET',
//           // headers: {
//           //   Cookie: `refreshToken=${refreshToken}`,
//           // },
//           headers: {
//             Cookie: request.headers.get('cookie') || '',
//           },
//           credentials: 'include',
//         },
//       )

//       if (refreshRes.ok) {
//         const refreshData = await refreshRes.json()
//         accessToken = refreshData.accessToken
//         // Backend rotates refreshToken; persist the rotated value in the browser.
//         if (refreshData.refreshToken) {
//           refreshToken = refreshData.refreshToken
//           // response.cookies.set('refreshToken', refreshData.refreshToken, cookieCommonOptions)
//         }
//         // response.cookies.set('accessToken', accessToken, cookieCommonOptions)
//       } else {
//         return NextResponse.redirect(new URL('/login', request.url))
//       }
//     }

//     if (accessToken) {
//       meRes = await fetchMe(accessToken)
//     }
//     // console.log(meRes,"login me response");

//     // If /me fails with 401, try refresh
//     if (meRes?.status === 401 && hasRefreshToken) {
//       const refreshRes = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/user/refresh`,
//         {
//           method: 'GET',
//           // headers: {
//           //   Cookie: `refreshToken=${refreshToken}`,
//           // },
//           headers: {
//             Cookie: request.headers.get('cookie') || '',
//           },
//           credentials: 'include',
//         },
//       )

//       if (refreshRes.ok) {
//         const refreshData = await refreshRes.json()
//         accessToken = refreshData.accessToken
//         if (refreshData.refreshToken) {
//           refreshToken = refreshData.refreshToken
//           // response.cookies.set('refreshToken', refreshData.refreshToken, cookieCommonOptions)
//         }
//         // response.cookies.set('accessToken', accessToken, cookieCommonOptions)

//         // Retry /me with new token
//         meRes = await fetchMe(accessToken)
//       } else {
//         return NextResponse.redirect(new URL('/login', request.url))
//       }
//     }

//     if (meRes?.ok) {
//       const user = await meRes.json()
//       role = normalizeRole(user.role)
//       if (user.role === 'Evaluator' && user.parentEvaluator)
//         role = 'SubEvaluator'

//       // Ensure role cookie is set (backend should set it, but middleware can sync it)
//       if (role) {
//         response.cookies.set('role', role, { path: '/' })
//       }
//     } else {
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   } catch (err) {
//     console.error('Middleware /me error:', err)
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   const allowedRoutes = roleRoutes[role] || []
//   const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))
//   if (!hasAccess)
//     return NextResponse.redirect(new URL('/unauthorized', request.url))

//   return response
// }

// export const config = {
//   matcher: [
//     '/seller-profile/:path*',
//     '/dashboard/:path*',
//     '/evaluator-profile/:path*',
//     '/sub-evaluator-profile/:path*',
//     '/profile/:path*',
//     '/trustee/:path*',
//     '/3d-walkthrough/:path*',
//     '/survey-dashboard/:path*',
//     '/advertise-with-us',
//     '/advertise-with-us/:path*',
//   ],
// }
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/user-login']

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

  return role
}

const roleRoutes = {
  AssetHolder: [
    '/seller-profile',
    '/dashboard',
    '/dashboard/property-listing',
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
    '/trustee/viewing',
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
    '/evaluator-profile/document-storage',
    '/evaluator-profile/edit-profile',
    '/evaluator-profile/electronic-consent',
    '/evaluator-profile/price-list',
    '/evaluator-profile/sale-tab',
    '/evaluator-profile/transaction-tracker',
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
    '/sub-evaluator-profile/document-storage',
    '/sub-evaluator-profile/edit-profile',
    '/sub-evaluator-profile/electronic-consent',
    '/sub-evaluator-profile/price-list',
    '/sub-evaluator-profile/transaction-tracker',
  ],
  '3dWalkthrough': [
    '/3d-walkthrough',
    '/3d-walkthrough/create-slot',
    '/3d-walkthrough/price',
  ],
  TechnicalReport: [
    '/survey-dashboard',
    '/survey-dashboard/requested-reports',
    '/survey-dashboard/security',
    '/survey-dashboard/create-slot',
  ],
}

export async function proxy(request) {
  const { nextUrl, cookies } = request
  const pathname = nextUrl.pathname

  // ✅ Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  let role = normalizeRole(cookies.get('role')?.value)
  let accessToken = cookies.get('accessToken')?.value
  let refreshToken = cookies.get('refreshToken')?.value

  const hasRefreshToken = !!refreshToken
  const isProd = process.env.NODE_ENV === 'production'

  // ✅ Cookie config (CRITICAL for UAE Pass)
  const cookieOptions = {
    path: '/',
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  }

  // ❌ No tokens at all → redirect
  if (!accessToken && !hasRefreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const response = NextResponse.next()

  const fetchMe = async (token) => {
    return await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
  }

  try {
    // ✅ STEP 1: If no accessToken → refresh
    if (!accessToken && hasRefreshToken) {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/refresh`,
        {
          method: 'GET',
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
          credentials: 'include',
        },
      )

      if (!refreshRes.ok) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      const refreshData = await refreshRes.json()

      accessToken = refreshData.accessToken

      // ✅ SAVE TOKENS (CRITICAL FIX)
      // response.cookies.set('accessToken', accessToken, cookieOptions)

      // if (refreshData.refreshToken) {
      //   // response.cookies.set('refreshToken', refreshData.refreshToken, {
      //   //   ...cookieOptions,
      //   //   httpOnly: true,
      //   // })
      // }
    }

    // ✅ STEP 2: Call /me
    let meRes = accessToken ? await fetchMe(accessToken) : null

    // ✅ STEP 3: If expired → refresh again
    if (meRes?.status === 401 && hasRefreshToken) {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/refresh`,
        {
          method: 'GET',
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
          credentials: 'include',
        },
      )

      if (!refreshRes.ok) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      const refreshData = await refreshRes.json()
      accessToken = refreshData.accessToken

      // ✅ SAVE AGAIN
      // response.cookies.set('accessToken', accessToken, cookieOptions)

      // if (refreshData.refreshToken) {
      //   // response.cookies.set('refreshToken', refreshData.refreshToken, {
      //   //   ...cookieOptions,
      //   //   httpOnly: true,
      //   // })
      // }

      meRes = await fetchMe(accessToken)
    }

    // ❌ If still invalid
    if (!meRes?.ok) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // ✅ STEP 4: Get user + role
    const user = await meRes.json()
    role = normalizeRole(user.role)

    if (user.role === 'Evaluator' && user.parentEvaluator) {
      role = 'SubEvaluator'
    }

    // ✅ Sync role cookie
    // if (role) {
    //   // response.cookies.set('role', role, cookieOptions)
    // }
  } catch (err) {
    console.error('Proxy error:', err)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ STEP 5: Route authorization
  const allowedRoutes = roleRoutes[role] || []
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route))

  if (!hasAccess) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/seller-profile/:path*',
    '/dashboard/:path*',
    '/evaluator-profile/:path*',
    '/sub-evaluator-profile/:path*',
    '/profile/:path*',
    '/trustee/:path*',
    '/3d-walkthrough/:path*',
    '/survey-dashboard/:path*',
    '/advertise-with-us',
    '/advertise-with-us/:path*',
  ],
}
