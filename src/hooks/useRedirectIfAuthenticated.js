'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useProfile } from '@/context/UserContext'
import {
  CONSUMER_ROLES,
  getRoleHomeRoute,
} from '@/utils/auth/roleHome'
import { isUaePassCallback } from '@/utils/auth/uaePass'
import {
  peekPostLoginRedirect,
  consumePostLoginRedirect,
  isSafePostLoginPath,
  captureRedirectQueryParam,
} from '@/utils/auth/postLoginRedirect'

function resolveIntendedPath(searchParams) {
  captureRedirectQueryParam(searchParams)
  const fromQuery = searchParams?.get?.('redirect')
  if (fromQuery) {
    let decoded = fromQuery
    try {
      decoded = decodeURIComponent(fromQuery)
    } catch {
      decoded = fromQuery
    }
    if (isSafePostLoginPath(decoded)) {
      consumePostLoginRedirect()
      return decoded
    }
  }
  return peekPostLoginRedirect() ? consumePostLoginRedirect() : null
}

/**
 * Client fallback when edge proxy cannot see HttpOnly cookies (e.g. localhost vs production domain).
 */
export function useRedirectIfAuthenticated({ blockConsumerOnUserLogin = false } = {}) {
  const { user, loading, isAuthenticated } = useProfile()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (isUaePassCallback()) return
    if (loading) return
    if (!user && !isAuthenticated) return

    const role = user?.role
    if (!role) return

    // Staff arranging a viewing: stay on /login so UAE Pass can start.
    if (
      searchParams?.get?.('uaepass') === '1' &&
      !CONSUMER_ROLES.has(role)
    ) {
      return
    }

    if (
      blockConsumerOnUserLogin &&
      pathname === '/user-login' &&
      CONSUMER_ROLES.has(role)
    ) {
      const intended = resolveIntendedPath(searchParams)
      router.replace(intended || getRoleHomeRoute(role))
      return
    }

    if (pathname === '/login' || pathname === '/user-login') {
      const intended = resolveIntendedPath(searchParams)
      router.replace(intended || getRoleHomeRoute(role))
    }
  }, [
    user,
    loading,
    isAuthenticated,
    pathname,
    router,
    searchParams,
    blockConsumerOnUserLogin,
  ])
}
