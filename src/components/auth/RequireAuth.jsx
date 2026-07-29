'use client'

import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useProfile } from '@/context/UserContext'
import { getRoleHomeRoute } from '@/utils/auth/roleHome'

const normalizeRole = (role) => {
  if (!role) return ''
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
  return String(role)
}

/**
 * Redirects unauthenticated visitors to /login.
 * Optional `roles` limits access to specific roles (e.g. AssetHolder / DealHunter).
 */
export default function RequireAuth({
  children,
  loginPath = '/login',
  roles,
}) {
  const { user, loading, isAuthenticated } = useProfile()
  const router = useRouter()
  const pathname = usePathname()

  const isLoggedIn = Boolean(user || isAuthenticated)
  const allowedRoles = useMemo(
    () =>
      Array.isArray(roles) && roles.length
        ? roles.map(normalizeRole).filter(Boolean)
        : null,
    [roles],
  )

  const userRole = normalizeRole(
    user?.parentEvaluator && user?.role === 'Evaluator'
      ? 'SubEvaluator'
      : user?.role,
  )

  const roleAllowed =
    !allowedRoles || (userRole && allowedRoles.includes(userRole))

  useEffect(() => {
    if (loading) return

    if (!isLoggedIn) {
      const search =
        typeof window !== 'undefined' ? window.location.search || '' : ''
      const returnPath = `${pathname || ''}${search}`
      const redirectTo = returnPath
        ? `${loginPath}?redirect=${encodeURIComponent(returnPath)}`
        : loginPath
      router.replace(redirectTo)
      return
    }

    if (!roleAllowed) {
      router.replace(getRoleHomeRoute(userRole) || '/unauthorized')
    }
  }, [
    loading,
    isLoggedIn,
    roleAllowed,
    loginPath,
    pathname,
    router,
    userRole,
  ])

  if (loading || !isLoggedIn || !roleAllowed) {
    return (
      <div className='flex min-h-[40vh] w-full items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-[#002D4F] border-t-transparent' />
      </div>
    )
  }

  return children
}
