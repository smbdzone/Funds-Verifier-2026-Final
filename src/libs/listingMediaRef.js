/** Listing APIs expect Mongo ObjectIds for populated media fields;
 * upload handlers return full documents with `_id`.
 * Never send preview image objects (signedUrl-only) — they CastError to 500.
 */

const OBJECT_ID_RE = /^[a-f\d]{24}$/i

function asObjectIdString(value) {
  if (value == null || value === '') return undefined
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed || !OBJECT_ID_RE.test(trimmed)) return undefined
    return trimmed
  }
  if (typeof value === 'object') {
    const id =
      value._id ??
      value.id ??
      value.assetId ??
      value.certificate?._id ??
      value.certificate?.id
    if (id == null || id === '') return undefined
    return asObjectIdString(id)
  }
  return undefined
}

/**
 * Resolve a media field to a Mongo ObjectId string, or undefined.
 * Never returns a plain image/video preview object.
 */
export function listingMediaRef(uploadOrExisting) {
  return asObjectIdString(uploadOrExisting)
}

/** Empty video list → clear on update (`null`); omit on create. */
export function listingVideoPayloadValue(
  videos,
  videoID,
  existingVideo,
  isUpdate,
) {
  const list = Array.isArray(videos) ? videos : videos ? [videos] : []
  if (!list.length) return isUpdate ? null : undefined
  return listingMediaRef(videoID) ?? listingMediaRef(existingVideo)
}

/** Resolve ObjectId from /upload-certificate (or populated EvaluationCertificate). */
export function listingCertificateRef(uploadOrExisting) {
  return asObjectIdString(uploadOrExisting)
}

/** Stamp parent ImageAsset id onto a peeled preview so re-save keeps a valid ref. */
export function withParentAssetId(preview, parentAsset) {
  if (!preview) return null
  if (preview instanceof File || preview instanceof Blob) return preview
  const parentId = asObjectIdString(parentAsset) || asObjectIdString(preview)
  if (!parentId) return preview
  if (typeof preview === 'string') {
    return { url: preview, signedUrl: preview, _id: parentId, assetId: parentId }
  }
  return {
    ...preview,
    _id: preview._id || parentId,
    assetId: preview.assetId || parentId,
  }
}

/** Mongo id from a created 3D / technical-report request response. */
export function premiumServiceRequestId(entity) {
  return asObjectIdString(entity) ?? null
}

/**
 * Keep existing 3D / technical refs when saving after paying for only one service.
 * Sending `null` was wiping the other premium service on the listing.
 */
export function mergePremiumServiceRef(newRequestId, existingValue) {
  const newId = premiumServiceRequestId(newRequestId)
  if (newId) return newId
  return listingMediaRef(existingValue)
}

const UNSAFE_LISTING_UPDATE_KEYS = [
  'userId',
  '_id',
  '__v',
  'ratings',
  'analytics',
  'totalrating',
  'createdAt',
  'updatedAt',
  'isDeleted',
  'deletedAt',
  'dealhunterId',
  'transactionId',
  'customFacilities',
  'customMaterials',
  'customExtras',
  'customExteriorColors',
  'customInteriorColors',
  'feedback',
  'warrenty',
]

/**
 * Drop populated GET leftovers so asset-holder PUT does not CastError.
 */
export function sanitizeAssetHolderUpdatePayload(body = {}, formData = {}) {
  if (!body || typeof body !== 'object') return body
  for (const key of UNSAFE_LISTING_UPDATE_KEYS) {
    delete body[key]
  }
  const warranty = formData?.warranty || formData?.warrenty || body.warranty
  if (warranty) body.warranty = warranty

  if (formData?.underProcess || body.underProcess) {
    delete body.price
    delete body.priceFrom
    delete body.priceTo
    delete body.underProcess
  }

  if (Array.isArray(body.uploadDocument) && body.uploadDocument.some((d) => d && typeof d === 'object')) {
    delete body.uploadDocument
  } else if (body.uploadDocument && typeof body.uploadDocument === 'object') {
    delete body.uploadDocument
  }
  if (body.requestDocument && typeof body.requestDocument === 'object') {
    delete body.requestDocument
  }
  return body
}

/** Remove empty / invalid ObjectId refs so MongoDB does not CastError. */
export function stripEmptyObjectIdRefs(body) {
  if (!body || typeof body !== 'object') return body
  // null means "clear this field on save" for layout/docs — keep it.
  const CLEARABLE_WITH_NULL = new Set([
    'unitLayout',
    'floorPlan',
    'titleDeed',
    'agencyAgreement',
    'video',
  ])
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
    if (!(key in body)) continue
    const value = body[key]
    if (value === null && CLEARABLE_WITH_NULL.has(key)) {
      body[key] = null
      continue
    }
    if (value === null || value === '' || value === undefined) {
      delete body[key]
      continue
    }
    const id = asObjectIdString(value)
    if (!id) {
      delete body[key]
      continue
    }
    body[key] = id
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
