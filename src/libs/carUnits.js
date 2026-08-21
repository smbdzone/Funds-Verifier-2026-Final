import { formatNumberWithCommas } from '@/utils/global-functions/global'

/** Normalize unit saved by asset holder: km | mile */
export function resolveMileageUnit(listingOrUnit) {
  const raw =
    typeof listingOrUnit === 'string'
      ? listingOrUnit
      : listingOrUnit?.mileageUnit
  return String(raw || '').toLowerCase() === 'mile' ? 'mile' : 'km'
}

/** Normalize unit saved by asset holder: kg | lb */
export function resolveCapacityWeightUnit(listingOrUnit) {
  const raw =
    typeof listingOrUnit === 'string'
      ? listingOrUnit
      : listingOrUnit?.capacityWeightUnit
  return String(raw || '').toLowerCase() === 'lb' ? 'lb' : 'kg'
}

/** e.g. "12,500 km" or "8,000 mile" — same unit asset holder selected */
export function formatCarMileage(listing) {
  if (listing == null) return ''
  const value = listing.kilometers
  if (value == null || value === '') return ''
  const unit = resolveMileageUnit(listing)
  return `${formatNumberWithCommas(value)} ${unit}`
}

/** e.g. "1500 kg" or "3200 lb" — same unit asset holder selected */
export function formatCarCapacityWeight(listing) {
  if (listing == null) return ''
  const value = listing.capacityWeight
  if (value == null || value === '') return ''
  const unit = resolveCapacityWeightUnit(listing)
  return `${value} ${unit}`
}
