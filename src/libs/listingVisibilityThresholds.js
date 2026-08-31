/** Minimum price (AED) before Public/Private radios appear. Keep in sync with backend AssetsListingsPricing. */
export const LISTING_VISIBILITY_THRESHOLDS = {
  property: 5_000_000,
  car: 250_000,
  boat: 1_000_000,
  jewelry: 250_000,
}

export const PROPERTY_LISTING_VISIBILITY_THRESHOLD =
  LISTING_VISIBILITY_THRESHOLDS.property

export function parseListingPriceAmount(value) {
  if (value == null || value === '') return NaN
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN
  }
  const cleaned = String(value).replace(/,/g, '').trim()
  if (!cleaned) return NaN
  const amount = Number(cleaned)
  return Number.isFinite(amount) ? amount : NaN
}

export function meetsPrivateListingThreshold(type, price) {
  const threshold = LISTING_VISIBILITY_THRESHOLDS[type]
  if (threshold == null) return false
  const amount = parseListingPriceAmount(price)
  return Number.isFinite(amount) && amount >= threshold
}

/** Same create/edit rule: at-or-above threshold, or already saved as Private. */
export function shouldShowListingVisibility(type, price, currentListing = '') {
  if (meetsPrivateListingThreshold(type, price)) return true
  return String(currentListing || '').trim() === 'Private'
}
