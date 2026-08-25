import customAxios from '@/utils/apis/apis'
import { formatEvaluationDateTimeDisplay } from '@/libs/evaluationBooking'
import { isPremiumServicePaid } from '@/libs/listingPremiumStatus'

/** Amount already paid for a 3D walkthrough or technical report. */
export function premiumServicePaidBaseline(existing) {
  if (!isPremiumServicePaid(existing)) return 0
  const paid = Number(existing?.price)
  return Number.isFinite(paid) && paid > 0 ? paid : 0
}

/** Extra AED when the new fee is higher than what was already paid. */
export function premiumServiceExtraFee(nextPrice, existing) {
  const baseline = premiumServicePaidBaseline(existing)
  const next = Number(nextPrice) || 0
  if (baseline <= 0 || next <= 0) return 0
  return Math.max(0, next - baseline)
}

export function premiumServiceChargeAmount(nextPrice, existing) {
  const extra = premiumServiceExtraFee(nextPrice, existing)
  if (premiumServicePaidBaseline(existing) > 0) return extra
  return Number(nextPrice) || 0
}

export function formatPremiumServiceDateTime(value) {
  if (!value) return ''
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatEvaluationDateTimeDisplay(value)
  }
  const formatted = formatEvaluationDateTimeDisplay(value)
  if (formatted) return formatted
  return typeof value === 'string' ? value : ''
}

function listingFeeCategory(formData = {}) {
  const assetType = String(formData?.assetType || '').toLowerCase()
  if (assetType.includes('car')) {
    return String(formData?.carType || formData?.category || '').trim()
  }
  if (assetType.includes('boat')) {
    return String(
      formData?.category || formData?.evaluationFeeCategory || '',
    ).trim()
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

/** Prefill type/bedrooms/fee from the paid request, then the listing. */
export function resolvePremiumServiceFeePrefill({
  existingRequest,
  listingFormData = {},
  type = '',
  dropdown3D,
  dropdown,
} = {}) {
  const isProperty = type === 'Property For Sale'
  let category = String(existingRequest?.category || '').trim()
  let subCategory = String(existingRequest?.subCategory || '').trim()
  let value = String(existingRequest?.value || '').trim()
  let price = Number(existingRequest?.price) || 0

  if (isProperty) {
    if (!subCategory && listingFormData?.propertyType) {
      subCategory = String(listingFormData.propertyType).trim()
    }
    if (!value && listingFormData?.bedrooms != null && listingFormData.bedrooms !== '') {
      value = String(listingFormData.bedrooms).trim()
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
    if (!category) category = listingFeeCategory(listingFormData)
    category = matchDropdownLabel(category, dropdown)
  }

  return { category, subCategory, value, price }
}

/** Time-only (or cheaper category) update — no Stripe/Clozer charge. */
export async function updatePremiumServiceBooking(payload) {
  const response = await customAxios.put('/services/booking', payload)
  return response.data
}
