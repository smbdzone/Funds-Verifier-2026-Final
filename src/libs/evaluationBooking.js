import customAxios from '@/utils/apis/apis'

export const EVALUATION_SLOT_FIELDS = [
  'evaluationDateTime',
  'evaluatorUUID',
  'evaluationTimeslotId',
  'evaluationSlotDate',
  'evaluationSlotTime',
  'evaluationSlotTimeslots',
]

/** Evaluation fee confirmed (Stripe 2 AED hold or Clozer installment approved). */
export function hasConfirmedEvaluationPayment(sessionOrForm) {
  if (!sessionOrForm || typeof sessionOrForm !== 'object') return false
  return sessionOrForm.EvaluationPaymentStatus === true
}

/** Clear evaluation date/time so the user can pick the same slot again. */
export function clearEvaluationSlotFields(data) {
  if (!data || typeof data !== 'object') return data
  const next = { ...data }
  for (const key of EVALUATION_SLOT_FIELDS) {
    delete next[key]
  }
  return next
}

export function clearEvaluationSlotSelection(setFormData) {
  if (typeof setFormData !== 'function') return
  setFormData((prev) => clearEvaluationSlotFields(prev))
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
