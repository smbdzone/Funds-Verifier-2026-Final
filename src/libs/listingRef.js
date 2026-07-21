/**
 * Reference number shown on listing cards and detail views.
 *
 * Every user gets a unique ref at signup (including UAE Pass signups),
 * derived from the first 8 chars of their uuid. The backend attaches it to
 * listings as `sellerRef`, so all listings of one seller share the same ref.
 * Falls back to the seller uuid on populated responses, then to the old
 * dldNumber / listing-uuid behaviour for legacy data.
 */
export function getListingRef(listing) {
  if (!listing) return 'N/A'
  if (listing.sellerRef) return listing.sellerRef
  const sellerUuid = listing?.userId?.uuid
  if (typeof sellerUuid === 'string' && sellerUuid) {
    return sellerUuid.slice(0, 8).toUpperCase()
  }
  if (listing.dldNumber) return listing.dldNumber
  if (typeof listing.uuid === 'string' && listing.uuid) {
    return listing.uuid.slice(0, 8)
  }
  return 'N/A'
}
