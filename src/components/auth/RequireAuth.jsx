'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useProfile } from '@/context/UserContext'

/**
 * Redirects unauthenticated visitors to /login.
 * Use inside UserProvider as a client-side fallback to the edge proxy.
 */
export default function RequireAuth({ children, loginPath = '/login' }) {
  const { user, loading, isAuthenticated } = useProfile()
  const router = useRouter()
  const pathname = usePathname()

  const isLoggedIn = Boolean(user || isAuthenticated)

  useEffect(() => {
    if (loading) return
    if (isLoggedIn) return

    const redirectTo = pathname
      ? `${loginPath}?redirect=${encodeURIComponent(pathname)}`
      : loginPath
    router.replace(redirectTo)
  }, [loading, isLoggedIn, loginPath, pathname, router])

  if (loading || !isLoggedIn) {
    return (
      <div className='flex min-h-[40vh] w-full items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-[#002D4F] border-t-transparent' />
      </div>
    )
  }

  return children
}
