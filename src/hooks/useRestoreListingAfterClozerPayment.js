'use client'

import { useEffect } from 'react'
import { toast } from 'react-toastify'

/**
 * Restores listing form data after returning from Clozer evaluation payment.
 */
export function useRestoreListingAfterClozerPayment(setFormData) {
  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem('checkoutSession')
      const draftRaw = localStorage.getItem('pendingListingDraft')
      if (!sessionRaw || !draftRaw) return

      const session = JSON.parse(sessionRaw)
      if (
        session.payment_provider !== 'clozer' ||
        !session.EvaluationPaymentStatus
      ) {
        return
      }

      const draft = JSON.parse(draftRaw)
      if (!draft?.formData) return

      setFormData((prev) => ({
        ...prev,
        ...draft.formData,
        EvaluationPaymentStatus: true,
        payment_provider: 'clozer',
        clozer_transaction_id: session.clozer_transaction_id,
      }))

      localStorage.removeItem('pendingListingDraft')
      toast.info(
        'Installment plan confirmed. Review your listing and click Submit to publish.',
      )
    } catch {
      /* ignore corrupt storage */
    }
  }, [setFormData])
}
