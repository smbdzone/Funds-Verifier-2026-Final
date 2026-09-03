import { getListingAmenities } from '@/libs/listingAmenities'

export const formatNumericInput = (e, setRaw, setFormatted) => {
  const rawValue = e.target.value.replace(/,/g, '')
  if (/^\d*$/.test(rawValue)) {
    const formattedVal = rawValue
      ? new Intl.NumberFormat('en-US').format(rawValue)
      : ''
    setRaw(rawValue)
    setFormatted(formattedVal)
  }
}

export const initFormattedPrice = (
  value,
  setRaw,
  setFormatted,
  { skipZero = true } = {},
) => {
  const num = Number(value)
  const isEmpty =
    value == null ||
    value === '' ||
    (skipZero && Number.isFinite(num) && num === 0)

  if (isEmpty) {
    setRaw('')
    setFormatted('')
    return
  }

  const raw = String(value).replace(/,/g, '')
  setRaw(raw)
  setFormatted(raw ? new Intl.NumberFormat('en-US').format(raw) : '')
}

/** Prefer listing price, then off-plan priceFrom / priceTo. */
export const getListingPriceForEvaluator = (listing) => {
  if (!listing) return null
  const candidates = [listing.price, listing.priceFrom, listing.priceTo]
  for (const value of candidates) {
    if (value == null || value === '') continue
    const num = Number(value)
    if (Number.isFinite(num) && num > 0) return value
  }
  return null
}

/** Listing size unit as stored by the asset holder (SQFT or SQM). */
export const getListingSizeUnitForEvaluator = (listing = {}) => {
  // Allow passing the unit string directly ("SQM" / "SQFT").
  if (typeof listing === 'string') {
    const unit = listing.trim().toUpperCase()
    return unit === 'SQM' ? 'SQM' : 'SQFT'
  }
  const unit = String(listing?.sizeUnit || listing?.sizeType || 'SQFT')
    .trim()
    .toUpperCase()
  return unit === 'SQM' ? 'SQM' : 'SQFT'
}

/**
 * Prefer size for the listing's unit, including off-plan From range fields.
 * Falls back across SQFT/SQM single + from values.
 */
export const getListingSizeForEvaluator = (listing) => {
  if (!listing) return null
  const unit = getListingSizeUnitForEvaluator(listing)
  const preferred =
    unit === 'SQM'
      ? [
        listing.sizeSQMFrom,
        listing.sizeSQM,
        listing.sizeSQFTFrom,
        listing.sizeSQFT,
      ]
      : [
        listing.sizeSQFTFrom,
        listing.sizeSQFT,
        listing.sizeSQMFrom,
        listing.sizeSQM,
      ]

  for (const value of preferred) {
    if (value == null || value === '') continue
    const num = Number(value)
    if (Number.isFinite(num) && num > 0) return value
  }
  return null
}

/**
 * Normalize a listing payload the way asset-holder edit (`ListingsProvider.fetchData`)
 * does — fill off-plan From fields into primary price/size and lease aliases.
 */
export const normalizeListingForEvaluator = (listing = {}) => {
  if (!listing || typeof listing !== 'object') return {}

  const resolvedPrice = getListingPriceForEvaluator(listing)
  const sizeUnit = getListingSizeUnitForEvaluator(listing)
  const resolvedSize = getListingSizeForEvaluator(listing)
  const leaseCheques =
    listing.leaseNumberofCheques ?? listing.lease ?? ''

  const priceEmpty =
    listing.price == null ||
    listing.price === '' ||
    Number(listing.price) === 0
  const sizeEmpty =
    sizeUnit === 'SQM'
      ? listing.sizeSQM == null ||
      listing.sizeSQM === '' ||
      Number(listing.sizeSQM) === 0
      : listing.sizeSQFT == null ||
      listing.sizeSQFT === '' ||
      Number(listing.sizeSQFT) === 0

  return {
    ...listing,
    price: priceEmpty && resolvedPrice != null ? resolvedPrice : listing.price,
    priceFrom: listing.priceFrom ?? '',
    priceTo: listing.priceTo ?? '',
    sizeSQFT:
      sizeUnit === 'SQFT' && sizeEmpty && resolvedSize != null
        ? resolvedSize
        : listing.sizeSQFT,
    sizeSQM:
      sizeUnit === 'SQM' && sizeEmpty && resolvedSize != null
        ? resolvedSize
        : listing.sizeSQM,
    sizeSQFTFrom: listing.sizeSQFTFrom ?? listing.sizeSQFT ?? '',
    sizeSQFTTo: listing.sizeSQFTTo ?? '',
    sizeSQMFrom: listing.sizeSQMFrom ?? listing.sizeSQM ?? '',
    sizeSQMTo: listing.sizeSQMTo ?? '',
    sizeType: sizeUnit,
    sizeUnit,
    additionalDescription: listing.additionalDescription || '',
    country: listing.country || '',
    city: listing.city || '',
    neighbourhood: listing.neighbourhood || '',
    mapUrl: listing.mapUrl || '',
    dldNumber: listing.dldNumber || '',
    advertisementId: listing.advertisementId || '',
    leaseNumberofCheques: leaseCheques,
    lease: leaseCheques,
    facilities: Array.isArray(listing.facilities)
      ? listing.facilities.filter(Boolean)
      : getListingAmenities(listing),
  }
}

export const buildEvaluatorUpdatePayload = ({
  listingPrice,
  evaluationPrice,
  roi,
  sizeSQFT,
  warranty,
  length,
  includeRoi = true,
  includeWarranty = false,
  includeLength = false,
  isOffPlan = false,
  includeListingPrice = true,
}) => {
  const payload = {}
  if (includeListingPrice && listingPrice !== '') {
    const priceNum = Number(listingPrice)
    payload.price = priceNum
    // Keep off-plan range in sync with the primary listing price.
    if (isOffPlan) payload.priceFrom = priceNum
  }
  if (evaluationPrice !== '') payload.evaluationPrices = Number(evaluationPrice)
  if (includeRoi && roi !== '') payload.roi = Number(roi)
  if (sizeSQFT !== '') {
    const sizeNum = Number(sizeSQFT)
    payload.sizeSQFT = sizeNum
    if (isOffPlan) payload.sizeSQFTFrom = sizeNum
  }
  if (includeWarranty && warranty) payload.warranty = warranty
  if (includeLength && length) payload.length = length
  return payload
}

const toDraftString = (value) => {
  if (value == null || value === '') return ''
  return String(value)
}

/** Seed editable draft from a property document (full listing fields). */
export const initPropertyDetailsDraft = (property = {}) => {
  const normalized = normalizeListingForEvaluator(property)
  const price = getListingPriceForEvaluator(normalized)
  const sizeUnit = getListingSizeUnitForEvaluator(normalized)
  const size = getListingSizeForEvaluator(normalized)
  const sizeRaw =
    size != null && size !== '' ? String(size).replace(/[^\d.]/g, '') : ''

  return {
    title: normalized.title ?? '',
    price:
      price != null && price !== ''
        ? String(price).replace(/[^\d]/g, '')
        : '',
    bedrooms: toDraftString(normalized.bedrooms),
    bathrooms: toDraftString(normalized.bathrooms),
    developer: normalized.developer ?? '',
    projectName: normalized.projectName ?? '',
    isFurnished: (() => {
      const raw = normalized.isFurnished
      if (raw === true || raw === 'Yes' || raw === 'yes') return true
      const text = String(raw || '').toLowerCase()
      if (!text || text === 'no' || text.includes('unfurnished')) return false
      return text.includes('furnished')
    })(),
    occupancyStatus: normalized.occupancyStatus ?? '',
    listing: normalized.listing ?? '',
    lease: toDraftString(normalized.leaseNumberofCheques ?? normalized.lease),
    leaseNumberofCheques: toDraftString(
      normalized.leaseNumberofCheques ?? normalized.lease,
    ),
    description: normalized.description ?? '',
    additionalDescription: normalized.additionalDescription ?? '',
    country: normalized.country ?? '',
    city: normalized.city ?? '',
    neighbourhood: normalized.neighbourhood ?? '',
    propertyType: normalized.propertyType ?? '',
    assetType: normalized.assetType ?? '',
    mapUrl: normalized.mapUrl ?? '',
    dldNumber: normalized.dldNumber ?? '',
    sizeUnit,
    sizeType: sizeUnit,
    sizeSQFT: sizeUnit === 'SQFT' ? sizeRaw : toDraftString(normalized.sizeSQFT),
    sizeSQM: sizeUnit === 'SQM' ? sizeRaw : toDraftString(normalized.sizeSQM),
    facilities: getListingAmenities(normalized),
  }
}

/** Editable listing details for evaluation (excludes locked name / email / phone). */
export const buildPropertyDetailsUpdatePayload = (
  draft = {},
  { isOffPlan = false } = {},
) => {
  const payload = {}
  if (draft.title !== undefined) {
    payload.title = String(draft.title || '').trim()
  }
  if (draft.price !== undefined && draft.price !== '') {
    const priceNum = Number(String(draft.price).replace(/[^\d]/g, ''))
    if (Number.isFinite(priceNum)) {
      payload.price = priceNum
      if (isOffPlan) payload.priceFrom = priceNum
    }
  }
  if (draft.bedrooms !== undefined && draft.bedrooms !== '') {
    const bedNum = Number(draft.bedrooms)
    payload.bedrooms = Number.isFinite(bedNum) ? bedNum : draft.bedrooms
  }
  if (draft.bathrooms !== undefined && draft.bathrooms !== '') {
    const bathNum = Number(draft.bathrooms)
    payload.bathrooms = Number.isFinite(bathNum) ? bathNum : draft.bathrooms
  }
  if (draft.developer !== undefined) {
    payload.developer = String(draft.developer || '').trim()
  }
  if (draft.projectName !== undefined) {
    payload.projectName = String(draft.projectName || '').trim()
  }
  if (draft.isFurnished !== undefined) {
    payload.isFurnished = draft.isFurnished ? 'Yes' : 'No'
  }
  if (draft.occupancyStatus !== undefined) {
    payload.occupancyStatus = String(draft.occupancyStatus || '').trim()
  }
  if (draft.listing !== undefined) {
    payload.listing = String(draft.listing || '').trim()
  }
  const leaseValue = draft.leaseNumberofCheques ?? draft.lease
  if (leaseValue !== undefined && leaseValue !== '') {
    const leaseNum = Number(leaseValue)
    payload.leaseNumberofCheques = Number.isFinite(leaseNum)
      ? leaseNum
      : leaseValue
  }
  if (draft.description !== undefined) {
    payload.description = String(draft.description || '').trim()
  }
  if (draft.additionalDescription !== undefined) {
    payload.additionalDescription = String(
      draft.additionalDescription || '',
    ).trim()
  }
  if (draft.country !== undefined) {
    payload.country = String(draft.country || '').trim()
  }
  if (draft.city !== undefined) {
    payload.city = String(draft.city || '').trim()
  }
  if (draft.neighbourhood !== undefined) {
    payload.neighbourhood = String(draft.neighbourhood || '').trim()
  }
  if (draft.propertyType !== undefined) {
    payload.propertyType = String(draft.propertyType || '').trim()
  }
  if (draft.mapUrl !== undefined) {
    payload.mapUrl = String(draft.mapUrl || '').trim()
  }
  if (draft.dldNumber !== undefined) {
    payload.dldNumber = String(draft.dldNumber || '').trim()
  }
  if (Array.isArray(draft.facilities)) {
    payload.facilities = draft.facilities
  }

  const sizeUnit = getListingSizeUnitForEvaluator(draft)
  payload.sizeUnit = sizeUnit
  payload.sizeType = sizeUnit

  if (sizeUnit === 'SQM') {
    if (draft.sizeSQM !== undefined && draft.sizeSQM !== '') {
      const sizeNum = Number(draft.sizeSQM)
      if (Number.isFinite(sizeNum)) {
        payload.sizeSQM = sizeNum
        if (isOffPlan) payload.sizeSQMFrom = sizeNum
      }
    }
  } else if (draft.sizeSQFT !== undefined && draft.sizeSQFT !== '') {
    const sizeNum = Number(draft.sizeSQFT)
    if (Number.isFinite(sizeNum)) {
      payload.sizeSQFT = sizeNum
      if (isOffPlan) payload.sizeSQFTFrom = sizeNum
    }
  }
  return payload
}

/**
 * Listing-detail fields to persist when the evaluator finalizes/approves,
 * so the public + asset-holder listing show the evaluator's edits.
 */
export const buildEvaluatorFinalizeDetailsPayload = (
  draft = {},
  { isOffPlan = false } = {},
) => buildPropertyDetailsUpdatePayload(draft, { isOffPlan })
