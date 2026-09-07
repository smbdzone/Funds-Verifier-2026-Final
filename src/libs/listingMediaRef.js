/** Listing APIs expect Mongo ObjectIds for populated media fields;
 * upload handlers return full documents with `_id`.
 * Empty strings must not be sent — Mongoose rejects Cast to ObjectId for "".
 */
export function listingMediaRef(uploadOrExisting) {
  if (uploadOrExisting == null || uploadOrExisting === '') return undefined
  if (
    typeof uploadOrExisting === 'object' &&
    uploadOrExisting._id != null
  ) {
    return uploadOrExisting._id
  }
  if (typeof uploadOrExisting === 'string' && !uploadOrExisting.trim()) {
    return undefined
  }
  return uploadOrExisting
}

/** Resolve ObjectId from /upload-certificate (or populated EvaluationCertificate). */
export function listingCertificateRef(uploadOrExisting) {
  if (uploadOrExisting == null || uploadOrExisting === '') return undefined
  if (typeof uploadOrExisting === 'object') {
    const id =
      uploadOrExisting.certificate?._id ||
      uploadOrExisting._id ||
      uploadOrExisting.certificate?.id ||
      uploadOrExisting.id
    if (id != null && id !== '') return id
  }
  if (typeof uploadOrExisting === 'string' && !uploadOrExisting.trim()) {
    return undefined
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

/** Remove empty ObjectId refs so MongoDB does not cast "" to ObjectId. */
export function stripEmptyObjectIdRefs(body) {
  if (!body || typeof body !== 'object') return body
  for (const key of [
    'technicalReport',
    'video3DWalkthrough',
    'evaluationCertificate',
    'video',
    'qrScan',
    'pictures',
    'thumbnailImg',
    'agencyAgreement',
    'unitLayout',
    'floorPlan',
    'titleDeed',
  ]) {
    const value = body[key]
    if (value === null || value === '' || value === undefined) {
      delete body[key]
    }
  }
  return body
}

/** @deprecated Use stripEmptyObjectIdRefs */
export function stripEmptyPremiumRefs(body) {
  return stripEmptyObjectIdRefs(body)
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
  return stripEmptyObjectIdRefs(target)
}
