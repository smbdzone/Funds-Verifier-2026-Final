'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useProfile } from '@/context/UserContext'
import { CONSUMER_ROLES } from '@/utils/auth/roleHome'
import { resolveRoleSafeRedirect } from '@/utils/auth/roleAccess'
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

function resolveDestinationForRole(searchParams, role) {
  return resolveRoleSafeRedirect(resolveIntendedPath(searchParams), role)
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

    // Staff arranging a viewing, or Asset Holder opening Deal Hunter finance:
    // stay on /login so UAE Pass can start instead of bouncing to seller-profile.
    const forceUaePass = searchParams?.get?.('uaepass') === '1'
    const wantsDealHunterProfile = String(
      searchParams?.get?.('redirect') || '',
    ).includes('/profile')
    if (forceUaePass && !CONSUMER_ROLES.has(role)) {
      return
    }
    if (forceUaePass && role === 'AssetHolder' && wantsDealHunterProfile) {
      return
    }

    if (
      blockConsumerOnUserLogin &&
      pathname === '/user-login' &&
      CONSUMER_ROLES.has(role)
    ) {
      router.replace(resolveDestinationForRole(searchParams, role))
      return
    }

    if (pathname === '/login' || pathname === '/user-login') {
      router.replace(resolveDestinationForRole(searchParams, role))
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
