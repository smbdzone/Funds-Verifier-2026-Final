/**
 * Simo spec: Approved (white) → pay for one premium service → Featured (blue)
 * → pay for both → Recommended (blue). Icons use delivered assets only.
 */

export function isListingEvaluatorApproved(listing) {
  if (!listing) return false
  const cert = listing.evaluationCertificate
  const hasCertificate =
    cert != null &&
    cert !== '' &&
    (typeof cert === 'object'
      ? Boolean(cert._id || cert.uuid)
      : Boolean(cert))
  return Number(listing.status) === 1 && hasCertificate
}

export function canRequestPremiumServices(listing) {
  return isListingEvaluatorApproved(listing)
}

/** True when a premium service is linked (ObjectId or populated doc), not "" or null. */
export function hasLinkedPremiumService(ref) {
  if (ref == null || ref === '') return false
  if (typeof ref === 'string') {
    const trimmed = ref.trim()
    return trimmed.length > 0 && /^[a-f\d]{24}$/i.test(trimmed)
  }
  if (typeof ref === 'object') {
    return Boolean(ref._id || ref.uuid)
  }
  return false
}

/** Premium service payment confirmed — unpaid/abandoned checkout attempts do not count. */
export function isPremiumServicePaid(ref) {
  if (!hasLinkedPremiumService(ref)) return false
  if (typeof ref === 'string') return false
  return hasSuccessfulPremiumPayment(ref)
}

/** Block re-requesting only after payment succeeded (not on abandoned Clozer/Stripe attempts). */
export function blocksPremiumServiceRequest(ref) {
  return isPremiumServicePaid(ref)
}

/** UI label for linked 3D / technical report fields. */
export function premiumServiceFieldLabel(ref) {
  if (!isPremiumServicePaid(ref)) return ''
  const status = String(ref?.status || ref?.payment_method_status || '').toLowerCase()
  if (status === 'successful' || status === 'paid' || status === 'succeeded') {
    return 'Completed'
  }
  return 'Requested'
}

/** Drop empty premium refs from API payloads / form state (avoids ObjectId cast errors). */
export function normalizeListingPremiumRefs(listing) {
  if (!listing || typeof listing !== 'object') return listing
  const next = { ...listing }
  for (const key of ['technicalReport', 'video3DWalkthrough', 'evaluationCertificate']) {
    const value = next[key]
    if (value === '' || value === null) {
      delete next[key]
    }
  }
  return next
}

/** Premium styling only after payment — not on unpaid request records. */
function hasSuccessfulPremiumPayment(service) {
  if (!service) return false
  if (typeof service === 'string') return true
  if (typeof service !== 'object') return false

  const paymentStatus = String(service.payment_method_status || '').toLowerCase()
  if (paymentStatus === 'paid' || paymentStatus === 'succeeded') return true

  if (String(service.status || '').toLowerCase() === 'successful') return true

  return false
}

export function getListingWalkthroughUrl(listing) {
  const link = listing?.video3DWalkthrough?.link
  if (typeof link !== 'string') return ''
  const trimmed = link.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return ''
}

export const LISTING_PREMIUM_BLUE_GRADIENT =
  'linear-gradient(135deg, #0B2D4E 0%, #839cb9 100%)'

/**
 * @returns {{
 *   approved: boolean,
 *   hasFeaturedStyling: boolean,
 *   isRecommended: boolean,
 *   badge: 'Approved' | 'Featured' | 'Recommended' | null,
 *   hasPaidTechnical: boolean,
 *   hasPaid3D: boolean,
 * }}
 */
export function getListingPremiumDisplay(listing) {
  const approved = isListingEvaluatorApproved(listing)
  const hasPaidTechnical = hasSuccessfulPremiumPayment(listing?.technicalReport)
  const hasPaid3D = hasSuccessfulPremiumPayment(listing?.video3DWalkthrough)
  const premiumCount = (hasPaidTechnical ? 1 : 0) + (hasPaid3D ? 1 : 0)

  const hasFeaturedStyling = approved && premiumCount >= 1
  const isRecommended = approved && premiumCount >= 2

  let badge = null
  if (Number(listing?.status) === 0) {
    badge = null
  } else if (approved) {
    if (isRecommended) badge = 'Recommended'
    else if (hasFeaturedStyling) badge = 'Featured'
    else badge = 'Approved'
  }

  return {
    approved,
    hasFeaturedStyling,
    isRecommended,
    badge,
    hasPaidTechnical,
    hasPaid3D,
  }
}
