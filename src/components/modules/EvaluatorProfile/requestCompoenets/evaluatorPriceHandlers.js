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

/**
 * Prefer size for the listing's unit, including off-plan From range fields.
 * Falls back across SQFT/SQM single + from values.
 */
export const getListingSizeForEvaluator = (listing) => {
  if (!listing) return null
  const unit = String(listing.sizeUnit || listing.sizeType || 'SQFT').toUpperCase()
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

/** Seed editable draft from a property document. */
export const initPropertyDetailsDraft = (property = {}) => ({
  title: property.title ?? '',
  price:
    property.price != null && property.price !== ''
      ? String(property.price).replace(/[^\d]/g, '')
      : '',
  bedrooms:
    property.bedrooms != null && property.bedrooms !== ''
      ? String(property.bedrooms)
      : '',
  bathrooms:
    property.bathrooms != null && property.bathrooms !== ''
      ? String(property.bathrooms)
      : '',
  developer: property.developer ?? '',
  isFurnished:
    property.isFurnished === true ||
    property.isFurnished === 'Yes' ||
    property.isFurnished === 'yes',
  occupancyStatus: property.occupancyStatus ?? '',
  listing: property.listing ?? '',
  lease: property.lease ?? '',
  description: property.description ?? '',
  sizeSQFT:
    property.sizeSQFT != null && property.sizeSQFT !== ''
      ? String(property.sizeSQFT)
      : '',
  facilities: getListingAmenities(property),
})

/** Editable listing details for evaluation (excludes locked name / email / phone). */
export const buildPropertyDetailsUpdatePayload = (draft = {}, { isOffPlan = false } = {}) => {
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
  if (draft.isFurnished !== undefined) {
    payload.isFurnished = draft.isFurnished ? 'Yes' : 'No'
  }
  if (draft.occupancyStatus !== undefined) {
    payload.occupancyStatus = String(draft.occupancyStatus || '').trim()
  }
  if (draft.listing !== undefined) {
    payload.listing = String(draft.listing || '').trim()
  }
  if (draft.lease !== undefined) {
    payload.lease = draft.lease
  }
  if (draft.description !== undefined) {
    payload.description = String(draft.description || '').trim()
  }
  if (Array.isArray(draft.facilities)) {
    payload.facilities = draft.facilities
  }
  if (draft.sizeSQFT !== undefined && draft.sizeSQFT !== '') {
    const sizeNum = Number(draft.sizeSQFT)
    if (Number.isFinite(sizeNum)) {
      payload.sizeSQFT = sizeNum
      if (isOffPlan) payload.sizeSQFTFrom = sizeNum
    }
  }
  return payload
}

