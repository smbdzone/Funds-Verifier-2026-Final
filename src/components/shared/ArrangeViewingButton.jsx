'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useProfile } from '@/context/UserContext'
import { setPostLoginRedirect } from '@/utils/auth/postLoginRedirect'
import { isOwnListing } from '@/libs/isOwnListing'
import SaleProceedObligationModal from '@/components/shared/SaleProceedObligationModal'

const OBLIGATION_AGREED_KEY = 'fvViewingObligationAgreed'

function readAgreedListingUuid() {
  try {
    return sessionStorage.getItem(OBLIGATION_AGREED_KEY) || ''
  } catch {
    return ''
  }
}

function rememberAgreedListingUuid(uuid) {
  if (!uuid) return
  try {
    sessionStorage.setItem(OBLIGATION_AGREED_KEY, uuid)
  } catch {
    /* ignore */
  }
}

function clearAgreedListingUuid() {
  try {
    sessionStorage.removeItem(OBLIGATION_AGREED_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Public listing viewing requests require an authenticated UAE Pass session.
 * Obligation popup shows first (even before login). Agree → login (if needed)
 * then calendar; Disagree → notify FV admin.
 */
export default function ArrangeViewingButton({ onAuthenticated, listing }) {
  const { user, isAuthenticated, loading } = useProfile()
  const pathname = usePathname()
  const router = useRouter()
  const ownsListing = listing ? isOwnListing(listing, user) : false
  const [showObligation, setShowObligation] = useState(false)

  const listingUuid = listing?.uuid || ''

  const redirectToLogin = () => {
    const returnTo =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : pathname

    setPostLoginRedirect(returnTo)
    toast.info('Please sign in with UAE Pass to arrange a viewing.')
    router.push(`/login?redirect=${encodeURIComponent(returnTo)}`)
  }

  const openViewingFlow = () => {
    if (listingUuid) clearAgreedListingUuid()
    onAuthenticated?.()
  }

  // After login return: if they already Agreed on this listing, open calendar once.
  useEffect(() => {
    if (loading || ownsListing) return
    if (!isAuthenticated || !user || !listingUuid) return
    if (readAgreedListingUuid() !== listingUuid) return
    openViewingFlow()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot after auth + prior Agree
  }, [loading, ownsListing, isAuthenticated, user, listingUuid])

  // Wait for profile before deciding visibility (avoids flash for asset holders).
  if (loading || ownsListing) return null

  const handleClick = () => {
    // Already agreed this session and signed in → skip popup.
    if (
      isAuthenticated &&
      user &&
      listingUuid &&
      readAgreedListingUuid() === listingUuid
    ) {
      openViewingFlow()
      return
    }
    setShowObligation(true)
  }

  const handleAgree = () => {
    setShowObligation(false)
    if (listingUuid) rememberAgreedListingUuid(listingUuid)

    if (!isAuthenticated || !user) {
      redirectToLogin()
      return
    }

    openViewingFlow()
  }

  return (
    <>
      <button
        type='button'
        onClick={handleClick}
        className='btn-gradient flex w-full justify-center rounded border-0 px-5 py-3 text-xs font-medium text-white focus:outline-none sm:w-auto md:text-sm'
      >
        Arrange Viewing
      </button>

      <SaleProceedObligationModal
        show={showObligation}
        context='viewing'
        assetType={listing?.assetType || ''}
        listingTitle={listing?.title || ''}
        listingUuid={listingUuid}
        onAgree={handleAgree}
        onClose={() => setShowObligation(false)}
      />
    </>
  )
}
