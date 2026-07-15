'use client'

import { useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  applyPendingListingDraft,
  clearPendingListingDraft,
  readPendingListingDraft,
} from '@/libs/pendingListingDraft'

/**
 * Restores listing form data after returning from Clozer evaluation payment (approved).
 */
export function useRestoreListingAfterClozerPayment(restoreApi) {
  useEffect(() => {
    const api =
      typeof restoreApi === 'function'
        ? { setFormData: restoreApi }
        : restoreApi

    if (!api || typeof api.setFormData !== 'function') return

    try {
      const sessionRaw = localStorage.getItem('checkoutSession')
      const draft = readPendingListingDraft()
      if (!sessionRaw || !draft) return

      const session = JSON.parse(sessionRaw)
      if (
        session.payment_provider !== 'clozer' ||
        !session.EvaluationPaymentStatus
      ) {
        return
      }

      applyPendingListingDraft(draft, {
        ...api,
        clearEvalSlots: false,
      })

      api.setFormData((prev) => ({
        ...prev,
        EvaluationPaymentStatus: true,
        payment_provider: 'clozer',
        clozer_transaction_id: session.clozer_transaction_id,
      }))

      clearPendingListingDraft()
      toast.info(
        'Installment plan confirmed. Review your listing and click Submit to publish.',
      )
    } catch {
      /* ignore corrupt storage */
    }
  }, [restoreApi])
}
