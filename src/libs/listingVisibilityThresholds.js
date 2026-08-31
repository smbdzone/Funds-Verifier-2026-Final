/** Minimum price (AED) before Public/Private radios appear. Keep in sync with backend AssetsListingsPricing. */
export const LISTING_VISIBILITY_THRESHOLDS = {
  property: 5_000_000,
  car: 200_000,
  boat: 1_000_000,
  jewelry: 100_000,
}

export const PROPERTY_LISTING_VISIBILITY_THRESHOLD =
  LISTING_VISIBILITY_THRESHOLDS.property

export function meetsPrivateListingThreshold(type, price) {
  const threshold = LISTING_VISIBILITY_THRESHOLDS[type]
  if (threshold == null) return false
  const amount = Number(price)
  return Number.isFinite(amount) && amount >= threshold
}
