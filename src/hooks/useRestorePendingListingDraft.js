'use client'

import { useEffect } from 'react'
import { hasConfirmedEvaluationPayment, clearEvaluationSlotFields } from '@/libs/evaluationBooking'

/** Restore in-progress new listing form after abandoning Clozer/Stripe (no id yet). */
export function useRestorePendingListingDraft(listingId, setFormData) {
  useEffect(() => {
    if (listingId || typeof setFormData !== 'function') return

    try {
      const sessionRaw = localStorage.getItem('checkoutSession')
      const session = sessionRaw ? JSON.parse(sessionRaw) : null
      if (hasConfirmedEvaluationPayment(session)) return

      const draftRaw = localStorage.getItem('pendingListingDraft')
      if (!draftRaw) return

      const draft = JSON.parse(draftRaw)
      if (!draft?.formData) return

      setFormData((prev) => ({
        ...prev,
        ...clearEvaluationSlotFields(draft.formData),
      }))
    } catch {
      /* ignore corrupt storage */
    }
  }, [listingId, setFormData])
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
