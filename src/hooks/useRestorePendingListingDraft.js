'use client'

import { useEffect } from 'react'
import { hasConfirmedEvaluationPayment } from '@/libs/evaluationBooking'
import {
  applyPendingListingDraft,
  readPendingListingDraft,
} from '@/libs/pendingListingDraft'

/**
 * Restore in-progress listing form after abandoning Clozer/Stripe (no listing id yet).
 * Restores form fields, media previews, and top dropdown selections.
 */
export function useRestorePendingListingDraft(listingId, restoreApi) {
  useEffect(() => {
    if (listingId) return

    const api =
      typeof restoreApi === 'function'
        ? { setFormData: restoreApi }
        : restoreApi

    if (!api || typeof api.setFormData !== 'function') return

    try {
      const sessionRaw = localStorage.getItem('checkoutSession')
      const session = sessionRaw ? JSON.parse(sessionRaw) : null
      if (hasConfirmedEvaluationPayment(session)) return

      const draft = readPendingListingDraft()
      if (!draft) return

      applyPendingListingDraft(draft, {
        ...api,
        clearEvalSlots: true,
      })
    } catch {
      /* ignore corrupt storage */
    }
  }, [listingId, restoreApi])
}

/** Refetch saved listing when user returns from Clozer/Stripe (edit flow with id). */
export function useRefetchListingOnReturn(listingId, routeName, fetchData) {
  useEffect(() => {
    if (!listingId || !routeName || typeof fetchData !== 'function') return

    const refetch = () => fetchData(routeName)

    const onPageShow = (event) => {
      if (event.persisted) refetch()
    }

    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [listingId, routeName, fetchData])
}
