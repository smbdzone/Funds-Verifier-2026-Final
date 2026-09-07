/**
 * Client-side filters for seller-profile My Listing tabs.
 * Tab index matches MyListingsTabClient tabs array.
 */
export function isOffPlanListing(listing) {
  return String(listing?.assetType || '')
    .toLowerCase()
    .includes('off plan')
}

export function filterListingsByMyListingTab(listings, tabIdx) {
  const list = Array.isArray(listings) ? listings : []
  if (!tabIdx) return list

  return list.filter((listing) => {
    const t = String(listing?.assetType || '').toLowerCase()
    switch (tabIdx) {
      case 1:
        return t.includes('property') && !isOffPlanListing(listing)
      case 2:
        return isOffPlanListing(listing)
      case 3:
        return t.includes('car')
      case 4:
        return t.includes('jewel')
      case 5:
        return t.includes('boat')
      default:
        return true
    }
  })
}
