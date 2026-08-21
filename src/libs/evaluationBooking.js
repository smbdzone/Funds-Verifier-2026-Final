import customAxios from '@/utils/apis/apis'
import { formatDateTime } from '@/utils/global-functions/global'

export const EVALUATION_SLOT_FIELDS = [
  'evaluationDateTime',
  'evaluatorUUID',
  'evaluationTimeslotId',
  'evaluationSlotDate',
  'evaluationSlotTime',
  'evaluationSlotTimeslots',
]

/** Display already-booked evaluation as "Aug 22, 2026 · 02:00 PM". */
export function formatEvaluationDateTimeDisplay(value) {
  if (!value) return ''
  const { formattedDate, formattedTime } = formatDateTime(value)
  if (!formattedDate || formattedDate === '--') return ''
  if (!formattedTime || formattedTime === '--') return formattedDate

  // Match slot labels like "02:00 PM"
  const match = String(formattedTime).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return `${formattedDate} · ${formattedTime}`
  const hour = String(match[1]).padStart(2, '0')
  const minute = match[2]
  const period = match[3].toUpperCase()
  return `${formattedDate} · ${hour}:${minute} ${period}`
}

/** Parse listing evaluationDateTime into calendar date + slot time label. */
export function parseEvaluationDateTimeSelection(value) {
  if (!value) return { date: null, time: null }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { date: null, time: null }

  const day = new Date(date)
  day.setHours(0, 0, 0, 0)

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  const time = `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`

  return { date: day, time }
}

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
