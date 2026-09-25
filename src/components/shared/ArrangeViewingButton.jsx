'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useProfile } from '@/context/UserContext'
import { setPostLoginRedirect } from '@/utils/auth/postLoginRedirect'
import { CONSUMER_ROLES } from '@/utils/auth/roleHome'
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

/** Viewing requests are for UAE Pass consumer accounts only (not staff roles). */
function canArrangeViewingAsConsumer(user, isAuthenticated) {
  return Boolean(
    isAuthenticated && user?.role && CONSUMER_ROLES.has(user.role),
  )
}

/**
 * Public listing viewing requests require an authenticated UAE Pass consumer session.
 * Staff roles (Admin, Evaluator, Trustee, etc.) must still go through UAE Pass.
 * Obligation popup shows first. Agree → UAE Pass (if needed) then calendar.
 */
export default function ArrangeViewingButton({ onAuthenticated, listing }) {
  const { user, isAuthenticated, loading } = useProfile()
  const pathname = usePathname()
  const router = useRouter()
  const ownsListing = listing ? isOwnListing(listing, user) : false
  const [showObligation, setShowObligation] = useState(false)

  const listingUuid = listing?.uuid || ''
  const isConsumerSession = canArrangeViewingAsConsumer(user, isAuthenticated)

  const redirectToUaePass = () => {
    const returnTo =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : pathname

    setPostLoginRedirect(returnTo)
    toast.info('Please sign in with UAE Pass to arrange a viewing.')
    // Force UAE Pass even when a staff role session is already active.
    const loginUrl = `/login?redirect=${encodeURIComponent(returnTo)}&uaepass=1`
    if (typeof window !== 'undefined') {
      window.location.assign(loginUrl)
      return
    }
    router.push(loginUrl)
  }

  const openViewingFlow = () => {
    if (listingUuid) clearAgreedListingUuid()
    onAuthenticated?.()
  }

  // After UAE Pass return: open calendar once for this listing (consumer only).
  useEffect(() => {
    if (loading || ownsListing) return
    if (!isConsumerSession || !listingUuid) return
    if (readAgreedListingUuid() !== listingUuid) return
    openViewingFlow()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot after auth + prior Agree
  }, [loading, ownsListing, isConsumerSession, listingUuid])

  // Wait for profile before deciding visibility (avoids flash for asset holders).
  if (loading || ownsListing) return null

  const handleClick = () => {
    // Already agreed this session and signed in as consumer → skip popup.
    if (
      isConsumerSession &&
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

    if (!isConsumerSession) {
      redirectToUaePass()
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
