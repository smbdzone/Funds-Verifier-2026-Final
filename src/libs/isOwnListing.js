/**
 * True when the logged-in user is the asset holder / owner of this listing.
 * Used to hide viewing / developer request CTAs on one's own assets.
 */
export function isOwnListing(listing, user) {
  if (!listing || !user) return false

  const myIds = [
    user.uuid,
    user._id,
    user.id,
    user.userUUID,
  ]
    .filter(Boolean)
    .map((v) => String(v).trim().toLowerCase())

  if (!myIds.length) return false

  const ownerCandidates = [
    listing.userUUID,
    listing.userUuid,
    listing.ownerUUID,
    listing.ownerUuid,
    listing.sellerUUID,
    listing.sellerUuid,
    listing.createdByUUID,
    listing.createdByUuid,
    typeof listing.user === 'string' ? listing.user : null,
    listing.user?.uuid,
    listing.user?._id,
    listing.user?.id,
    listing.owner?.uuid,
    listing.owner?._id,
    listing.seller?.uuid,
    listing.seller?._id,
  ]
    .filter(Boolean)
    .map((v) => String(v).trim().toLowerCase())

  return ownerCandidates.some((id) => myIds.includes(id))
}
