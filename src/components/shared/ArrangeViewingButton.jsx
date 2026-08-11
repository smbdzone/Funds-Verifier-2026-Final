'use client'

import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useProfile } from '@/context/UserContext'
import { setPostLoginRedirect } from '@/utils/auth/postLoginRedirect'
import { isOwnListing } from '@/libs/isOwnListing'

/**
 * Public listing viewing requests require an authenticated UAE Pass session.
 * Hidden while auth is loading and for the asset holder of this listing —
 * so owners never see a one-frame flash of the button on refresh.
 */
export default function ArrangeViewingButton({ onAuthenticated, listing }) {
  const { user, isAuthenticated, loading } = useProfile()
  const pathname = usePathname()
  const router = useRouter()
  const ownsListing = listing ? isOwnListing(listing, user) : false

  // Wait for profile before deciding visibility (avoids flash for asset holders).
  if (loading || ownsListing) return null

  const handleClick = () => {
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
      className='btn-gradient flex w-full justify-center rounded border-0 px-5 py-3 text-xs font-medium text-white focus:outline-none sm:w-auto md:text-sm'
    >
      Arrange Viewing
    </button>
  )
}
