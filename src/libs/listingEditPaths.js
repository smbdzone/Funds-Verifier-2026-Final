/**
 * Dashboard edit URL for an asset-holder listing (any status, including pending evaluation).
 */
export function getListingEditPath(assetType, listingId) {
  if (!listingId) return '#'

  switch (assetType) {
    case 'Property For Lease':
    case 'Property For Sale':
    case 'Property Off Plan For Sale':
      return `/dashboard/property-listing?id=${listingId}`
    case 'Car For Sale':
      return `/dashboard/car-listing?id=${listingId}`
    case 'Jewellery For Sale':
      return `/dashboard/jewelry-listing?id=${listingId}`
    case 'Boats For Sale':
      return `/dashboard/boat-listing?id=${listingId}`
    default:
      return '#'
  }
}

/** Pending evaluation detail page (upload requested docs, view status). */
export function getPendingEvaluationViewPath(assetType, listingId) {
  if (!listingId) return '#'
  return `/seller-profile/pending-evaluation/${listingId}?assetType=${encodeURIComponent(assetType || '')}`
}
