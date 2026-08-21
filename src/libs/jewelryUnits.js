import { formatNumberWithCommas } from '@/utils/global-functions/global'

export const JEWELRY_WEIGHT_UNITS = ['gm', 'kg', 'lb', 'oz']

/** Normalize weight unit saved by asset holder: gm | kg | lb | oz */
export function resolveJewelryWeightUnit(listingOrUnit) {
  const raw =
    typeof listingOrUnit === 'string'
      ? listingOrUnit
      : listingOrUnit?.weightUnit
  const unit = String(raw || '')
    .trim()
    .toLowerCase()
  if (unit === 'pound' || unit === 'pounds') return 'lb'
  if (unit === 'g' || unit === 'gram' || unit === 'grams') return 'gm'
  if (JEWELRY_WEIGHT_UNITS.includes(unit)) return unit
  return 'gm'
}

/** e.g. "60 gm" or "1.5 kg" — same unit asset holder selected */
export function formatJewelryWeight(listing) {
  if (listing == null) return ''
  const value = listing.grams
  if (value == null || value === '') return ''
  const unit = resolveJewelryWeightUnit(listing)
  return `${formatNumberWithCommas(value)} ${unit}`
}
