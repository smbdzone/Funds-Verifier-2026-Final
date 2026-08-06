'use client'

import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useProfile } from '@/context/UserContext'
import { setPostLoginRedirect } from '@/utils/auth/postLoginRedirect'

/**
 * Public listing viewing requests require an authenticated UAE Pass session.
 * The public /login page offers UAE Pass as its only sign-in method.
 */
export default function ArrangeViewingButton({ onAuthenticated }) {
  const { user, isAuthenticated, loading } = useProfile()
  const pathname = usePathname()
  const router = useRouter()

  const handleClick = () => {
    if (loading) return

    if (!isAuthenticated || !user) {
      const returnTo =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : pathname

      setPostLoginRedirect(returnTo)
      toast.info('Please sign in with UAE Pass to arrange a viewing.')
      router.push(`/login?redirect=${encodeURIComponent(returnTo)}`)
      return
    }

    onAuthenticated?.()
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={loading}
      className='btn-gradient flex w-full justify-center rounded border-0 px-5 py-3 text-xs font-medium text-white focus:outline-none disabled:cursor-wait disabled:opacity-60 sm:w-auto md:text-sm'
    >
      Arrange Viewing
    </button>
  )
}
