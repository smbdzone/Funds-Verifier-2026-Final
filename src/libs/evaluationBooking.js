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
  delete next.evaluationTopUpAmount
  return next
}

function sameFeeToken(a, b) {
  const left = String(a ?? '')
    .trim()
    .toLowerCase()
  const right = String(b ?? '')
    .trim()
    .toLowerCase()
  if (left === right) return true
  const studio = (v) => v === '0' || v === 'studio'
  return studio(left) && studio(right)
}

function listingEvaluationCategory(formData = {}) {
  const assetType = String(formData?.assetType || '').toLowerCase()
  if (assetType.includes('car')) {
    return String(formData?.carType || formData?.category || '').trim()
  }
  if (assetType.includes('boat')) {
    return String(formData?.category || formData?.evaluationFeeCategory || '').trim()
  }
  if (assetType.includes('jewel')) {
    return String(
      formData?.make || formData?.category || formData?.brands || '',
    ).trim()
  }
  return String(formData?.category || formData?.carType || '').trim()
}

function matchDropdownLabel(saved, dropdown) {
  const token = String(saved || '').trim()
  if (!token) return ''
  const labels = (Array.isArray(dropdown) ? dropdown : [])
    .map((item) =>
      typeof item === 'string' ? item : String(item?.text || item?.value || ''),
    )
    .filter(Boolean)
  const exact = labels.find((label) => label === token)
  if (exact) return exact
  const ci = labels.find(
    (label) => label.toLowerCase() === token.toLowerCase(),
  )
  return ci || ''
}

/** Fill missing paid-fee snapshot from the listing after a successful evaluation. */
export function seedEvaluationFeeSnapshot(formData = {}) {
  if (!formData || typeof formData !== 'object') return formData
  if (!formData.evaluationDateTime) return formData

  const next = { ...formData }
  if (!String(next.evaluationFeeSubCategory || '').trim() && next.propertyType) {
    next.evaluationFeeSubCategory = String(next.propertyType).trim()
  }
  if (
    !String(next.evaluationFeeBedrooms ?? '').trim() &&
    next.bedrooms != null &&
    next.bedrooms !== ''
  ) {
    next.evaluationFeeBedrooms = String(next.bedrooms).trim()
  }
  if (!String(next.evaluationFeeCategory || '').trim()) {
    const listingCategory = listingEvaluationCategory(next)
    if (listingCategory) next.evaluationFeeCategory = listingCategory
  }

  const price = Number(next.evaluationFeePrice) || 0
  const paid = Number(next.evaluationFeePaidAmount)
  if (!(Number.isFinite(paid) && paid > 0) && price > 0) {
    next.evaluationFeePaidAmount = price
  }
  return next
}

export function resolveEvaluationFeePrefill(formData = {}, options = {}) {
  const isProperty = Boolean(options.isProperty)
  const dropdown3D = options.dropdown3D
  const dropdown = options.dropdown
  const preferListingFields = !options.lockFeeFields

  let category = String(formData?.evaluationFeeCategory || '').trim()
  let subCategory = String(formData?.evaluationFeeSubCategory || '').trim()
  let value = String(
    formData?.evaluationFeeBedrooms ?? formData?.value ?? '',
  ).trim()
  let price = Number(formData?.evaluationFeePrice) || 0

  if (isProperty) {
    if (preferListingFields && formData?.propertyType) {
      subCategory = String(formData.propertyType).trim()
    } else if (!subCategory && formData?.propertyType) {
      subCategory = String(formData.propertyType).trim()
    }
    if (
      preferListingFields &&
      formData?.bedrooms != null &&
      formData.bedrooms !== ''
    ) {
      value = String(formData.bedrooms).trim()
    } else if (!value && formData?.bedrooms != null && formData.bedrooms !== '') {
      value = String(formData.bedrooms).trim()
    }
    if (!category && subCategory && Array.isArray(dropdown3D)) {
      const parent = dropdown3D.find((item) =>
        (item?.mapData || []).some(
          (row) =>
            String(row?.value || '').trim() === subCategory ||
            String(row?.text || '').trim() === subCategory,
        ),
      )
      category = String(parent?.text || '').trim()
    }
  } else {
    const listingCategory = listingEvaluationCategory(formData)
    if (preferListingFields && listingCategory) {
      category = listingCategory
    } else if (!category && listingCategory) {
      category = listingCategory
    }
    category = matchDropdownLabel(category, dropdown)
  }

  return { category, subCategory, value, price }
}

/** True when listing type/bedrooms no longer match the fee that was already paid. */
export function evaluationFeeFieldsChanged(formData = {}, options = {}) {
  const isProperty = Boolean(options.isProperty)
  if (!formData?.evaluationDateTime) return false

  if (isProperty) {
    const listingType = String(formData.propertyType || '').trim()
    const listingBeds = String(formData.bedrooms ?? '').trim()
    const snapType = String(formData.evaluationFeeSubCategory || '').trim()
    const snapBeds = String(formData.evaluationFeeBedrooms ?? '').trim()
    if (listingType && snapType && !sameFeeToken(listingType, snapType)) {
      return true
    }
    if (listingBeds && snapBeds && !sameFeeToken(listingBeds, snapBeds)) {
      return true
    }
    return false
  }

  const listingCategory = listingEvaluationCategory(formData)
  const snapCategory = String(formData.evaluationFeeCategory || '').trim()
  if (listingCategory && snapCategory && !sameFeeToken(listingCategory, snapCategory)) {
    return true
  }

  return false
}

/** Extra AED to collect when fee-related fields change on edit. Time-only = 0. */
export function getEvaluationTopUpAmount(formData = {}) {
  const explicit = Number(formData?.evaluationTopUpAmount)
  if (Number.isFinite(explicit) && explicit > 0) return explicit

  const nextPrice = Number(formData?.evaluationFeePrice) || 0
  const paid = Number(formData?.evaluationFeePaidAmount)
  const paidSafe = Number.isFinite(paid) && paid > 0 ? paid : 0

  if (nextPrice <= 0) return 0
  if (paidSafe <= 0) return 0
  return Math.max(0, nextPrice - paidSafe)
}

/** Amount already paid for evaluation. Missing snapshot uses the last stored fee. */
export function paidEvaluationFeeBaseline(formData = {}) {
  const paid = Number(formData?.evaluationFeePaidAmount)
  if (Number.isFinite(paid) && paid > 0) return paid
  if (!formData?.evaluationDateTime) return 0
  const previousPrice = Number(formData?.evaluationFeePrice) || 0
  return previousPrice > 0 ? previousPrice : 0
}

export function markEvaluationTopUpJustPaid() {
  try {
    sessionStorage.setItem('fv.evaluationTopUpJustPaid', '1')
  } catch {
    /* ignore */
  }
}

export function consumeEvaluationTopUpJustPaid() {
  try {
    const due = sessionStorage.getItem('fv.evaluationTopUpJustPaid') === '1'
    if (due) sessionStorage.removeItem('fv.evaluationTopUpJustPaid')
    return due
  } catch {
    return false
  }
}

/** Edit save must collect extra fee when the new price is higher than what was paid. */
export function shouldCollectEvaluationTopUp(formData = {}, listingId) {
  if (!listingId) return false
  if (getEvaluationTopUpAmount(formData) <= 0) return false
  try {
    if (sessionStorage.getItem('fv.evaluationTopUpJustPaid') === '1') {
      return false
    }
  } catch {
    /* ignore */
  }
  return true
}

export function withEvaluationFeePaid(formData = {}) {
  const nextPrice = Number(formData?.evaluationFeePrice) || 0
  if (nextPrice <= 0) return formData
  return {
    ...formData,
    evaluationFeePaidAmount: nextPrice,
    evaluationTopUpAmount: 0,
  }
}

export function applyPaidEvaluationFeeIfConfirmed(formData = {}, listingId) {
  if (getEvaluationTopUpAmount(formData) > 0) {
    if (consumeEvaluationTopUpJustPaid()) {
      return withEvaluationFeePaid(formData)
    }
    return formData
  }
  if (!listingId) return withEvaluationFeePaid(formData)
  if (hasConfirmedEvaluationPayment(formData)) {
    return withEvaluationFeePaid(formData)
  }
  try {
    const raw =
      typeof window !== 'undefined'
        ? localStorage.getItem('checkoutSession')
        : null
    const session = raw ? JSON.parse(raw) : null
    if (hasConfirmedEvaluationPayment(session)) {
      return withEvaluationFeePaid(formData)
    }
  } catch {
    /* ignore */
  }
  return formData
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
