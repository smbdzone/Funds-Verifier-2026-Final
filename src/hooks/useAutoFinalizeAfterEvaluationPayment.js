'use client'

import { useEffect, useRef } from 'react'
import { hasConfirmedEvaluationPayment } from '@/libs/evaluationBooking'

/**
 * After Clozer evaluation payment succeeds and the draft is restored,
 * finish creating the listing once required fields + media are present.
 */
export function useAutoFinalizeAfterEvaluationPayment({
  listingId,
  formData,
  images,
  thumbnail,
  finalizeSubmission,
  setLoading,
  setShowPayment,
  setConfirmationModal,
}) {
  const startedRef = useRef(false)

  useEffect(() => {
    if (listingId || startedRef.current) return
    if (typeof finalizeSubmission !== 'function') return

    try {
      if (sessionStorage.getItem('fv.autoFinalizeEvaluationPayment') !== '1') {
        return
      }

      const sessionRaw = localStorage.getItem('checkoutSession')
      const session = sessionRaw ? JSON.parse(sessionRaw) : null
      if (
        !hasConfirmedEvaluationPayment(session) &&
        !hasConfirmedEvaluationPayment(formData)
      ) {
        return
      }

      if (!formData?.title || !formData?.evaluationDateTime) return
      if (!images?.length || !thumbnail) return

      startedRef.current = true
      sessionStorage.removeItem('fv.autoFinalizeEvaluationPayment')
      setLoading?.(true)
      setShowPayment?.(false)
      setConfirmationModal?.(false)
      finalizeSubmission()
    } catch {
      startedRef.current = false
    }
  }, [
    listingId,
    formData,
    formData?.title,
    formData?.evaluationDateTime,
    formData?.EvaluationPaymentStatus,
    images?.length,
    thumbnail,
    finalizeSubmission,
    setLoading,
    setShowPayment,
    setConfirmationModal,
  ])
}
