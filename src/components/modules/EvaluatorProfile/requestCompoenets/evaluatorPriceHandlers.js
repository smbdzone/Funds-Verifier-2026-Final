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
}) => {
  const payload = {}
  if (listingPrice !== '') {
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
