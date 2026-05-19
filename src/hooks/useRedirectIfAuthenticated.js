'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useProfile } from '@/context/UserContext'
import {
  CONSUMER_ROLES,
  getRoleHomeRoute,
} from '@/utils/auth/roleHome'

/**
 * Client fallback when edge proxy cannot see HttpOnly cookies (e.g. localhost vs production domain).
 */
export function useRedirectIfAuthenticated({ blockConsumerOnUserLogin = false } = {}) {
  const { user, loading, isAuthenticated } = useProfile()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user && !isAuthenticated) return

    const role = user?.role
    if (!role) return

    if (
      blockConsumerOnUserLogin &&
      pathname === '/user-login' &&
      CONSUMER_ROLES.has(role)
    ) {
      router.replace(getRoleHomeRoute(role))
      return
    }

    if (pathname === '/login' || pathname === '/user-login') {
      router.replace(getRoleHomeRoute(role))
    }
  }, [
    user,
    loading,
    isAuthenticated,
    pathname,
    router,
    blockConsumerOnUserLogin,
  ])
}
