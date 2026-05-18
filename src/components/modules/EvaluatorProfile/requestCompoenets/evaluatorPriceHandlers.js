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

export const buildEvaluatorUpdatePayload = ({
  listingPrice,
  evaluationPrice,
  roi,
  sizeSQFT,
  includeRoi = true,
}) => {
  const payload = {}
  if (listingPrice !== '') payload.price = Number(listingPrice)
  if (evaluationPrice !== '') payload.evaluationPrices = Number(evaluationPrice)
  if (includeRoi && roi !== '') payload.roi = Number(roi)
  if (sizeSQFT !== '') payload.sizeSQFT = Number(sizeSQFT)
  return payload
}
