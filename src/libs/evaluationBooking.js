import customAxios from '@/utils/apis/apis'

/** Evaluation fee confirmed (Stripe 2 AED hold or Clozer installment approved). */
export function hasConfirmedEvaluationPayment(sessionOrForm) {
  if (!sessionOrForm || typeof sessionOrForm !== 'object') return false
  return sessionOrForm.EvaluationPaymentStatus === true
}

/** Book evaluator timeslot only after evaluation payment succeeded. */
export async function bookEvaluationTimeslotFromFormData(formData) {
  const timeslotId = formData?.evaluationTimeslotId
  const date = formData?.evaluationSlotDate
  const timeSlots = formData?.evaluationSlotTimeslots

  if (!timeslotId || !date || !Array.isArray(timeSlots)) return

  await customAxios.put(`/arrange-view/timeslot/update/${timeslotId}`, {
    timeSlots,
    date,
  })
}

/** Remove client-only slot metadata before listing API payloads. */
export function stripEvaluationBookingMeta(data) {
  if (!data || typeof data !== 'object') return data
  const next = { ...data }
  delete next.evaluationTimeslotId
  delete next.evaluationSlotDate
  delete next.evaluationSlotTime
  delete next.evaluationSlotTimeslots
  return next
}

/** Clear incomplete payment session only — keep listing draft so fields stay filled. */
export function clearAbandonedEvaluationPaymentDraft() {
  if (typeof window === 'undefined') return

  try {
    const sessionRaw = localStorage.getItem('checkoutSession')
    const session = sessionRaw ? JSON.parse(sessionRaw) : null

    if (!hasConfirmedEvaluationPayment(session)) {
      localStorage.removeItem('checkoutSession')
      localStorage.removeItem('clozerTransactionId')
    }
  } catch {
    localStorage.removeItem('checkoutSession')
    localStorage.removeItem('clozerTransactionId')
  }
}
