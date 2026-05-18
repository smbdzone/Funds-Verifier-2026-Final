/**
 * Simo spec: Approved (white) → pay for one premium service → Featured (blue)
 * → pay for both → Recommended (blue). Icons use delivered assets only.
 */

export function isListingEvaluatorApproved(listing) {
  if (!listing) return false
  return Number(listing.status) === 1 && !!listing.evaluationCertificate
}

export function canRequestPremiumServices(listing) {
  return isListingEvaluatorApproved(listing)
}

/** Premium styling only after Stripe payment — not on unpaid request records. */
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
