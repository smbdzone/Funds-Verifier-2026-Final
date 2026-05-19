/**
 * Client-side filters for seller-profile My Listing tabs.
 * Tab index matches MyListingsTabClient tabs array.
 */
export function filterListingsByMyListingTab(listings, tabIdx) {
  const list = Array.isArray(listings) ? listings : []
  if (!tabIdx) return list

  return list.filter((listing) => {
    const t = String(listing?.assetType || '').toLowerCase()
    switch (tabIdx) {
      case 1:
        return t.includes('property')
      case 2:
        return t.includes('car')
      case 3:
        return t.includes('jewel')
      case 4:
        return t.includes('boat')
      default:
        return true
    }
  })
}
