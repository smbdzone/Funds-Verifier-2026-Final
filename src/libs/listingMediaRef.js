/**
 * Listing APIs expect Mongo ObjectIds for populated media fields;
 * upload handlers return full documents with `_id`.
 */
export function listingMediaRef(uploadOrExisting) {
  if (uploadOrExisting == null) return uploadOrExisting
  if (
    typeof uploadOrExisting === 'object' &&
    uploadOrExisting._id != null
  ) {
    return uploadOrExisting._id
  }
  return uploadOrExisting
}

/** Mongo id from a created 3D / technical-report request response. */
export function premiumServiceRequestId(entity) {
  if (entity == null) return null
  if (typeof entity === 'string') return entity
  if (entity._id != null) return entity._id
  return null
}

/**
 * Keep existing 3D / technical refs when saving after paying for only one service.
 * Sending `null` was wiping the other premium service on the listing.
 */
export function mergePremiumServiceRef(newRequestId, existingValue) {
  const newId = premiumServiceRequestId(newRequestId) ?? newRequestId
  if (newId != null && newId !== '') {
    return listingMediaRef(newId) ?? newId
  }
  const existing = listingMediaRef(existingValue) ?? existingValue
  if (existing == null || existing === '') return undefined
  return existing
}

export function applyPremiumServiceRefs(target, formData, ids) {
  const video3D = mergePremiumServiceRef(
    ids.video3DWalkthroughID,
    formData?.video3DWalkthrough,
  )
  const technical = mergePremiumServiceRef(
    ids.technicalReportID,
    formData?.technicalReport,
  )
  if (video3D !== undefined) target.video3DWalkthrough = video3D
  if (technical !== undefined) target.technicalReport = technical
  return target
}
