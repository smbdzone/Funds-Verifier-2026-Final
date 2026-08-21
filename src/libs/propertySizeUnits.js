export const PROPERTY_SIZE_UNITS = ['SQFT', 'SQM']

export function formatPropertySizeNumber(value) {
  if (value === '' || value == null) return ''
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return ''
  const rounded = Math.round(n * 100) / 100
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(rounded)
}

/** Strip commas/signs; keep digits + at most one decimal point while typing. */
export function sanitizePropertySizeTyping(rawValue) {
  let cleaned = String(rawValue || '')
    .replace(/,/g, '')
    .replace(/[^\d.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, '')
  }
  return cleaned
}

export function parsePropertySizeInput(rawValue) {
  const cleaned = sanitizePropertySizeTyping(rawValue).trim()
  if (!cleaned || cleaned === '.') return ''
  const n = Number(cleaned)
  if (!Number.isFinite(n) || n <= 0) return ''
  return String(n)
}

export function getPropertySizeValue(property, unit) {
  const selectedUnit = unit || property?.sizeUnit || property?.sizeType || 'SQFT'
  if (selectedUnit === 'SQM') {
    const from = property?.sizeSQMFrom ?? property?.sizeSQM
    if (from !== '' && from != null && Number(from) > 0) return from
    return ''
  }
  const from = property?.sizeSQFTFrom ?? property?.sizeSQFT
  if (from !== '' && from != null && Number(from) > 0) return from
  return ''
}

/**
 * From/To values for the selected unit (off-plan listings store a size range).
 * Falls back to the single size value when no range was entered.
 */
export function getPropertySizeRange(property, unit) {
  const selectedUnit = unit || property?.sizeUnit || property?.sizeType || 'SQFT'
  const from =
    selectedUnit === 'SQM'
      ? property?.sizeSQMFrom ?? property?.sizeSQM
      : property?.sizeSQFTFrom ?? property?.sizeSQFT
  const to =
    selectedUnit === 'SQM'
      ? property?.sizeSQMTo ?? property?.sizeSQM
      : property?.sizeSQFTTo ?? property?.sizeSQFT
  return { from, to, unit: selectedUnit === 'SQM' ? 'SQM' : 'SQFT' }
}

/**
 * Label + numeric value for cards and detail views (no unit conversion).
 * From only → "50,000 SQFT"; from + to → "50,000 - 60,000 SQFT".
 */
export function formatPropertySizeDisplay(property) {
  const unit =
    property?.sizeUnit === 'SQM' || property?.sizeType === 'SQM' ? 'SQM' : 'SQFT'
  const { from, to } = getPropertySizeRange(property, unit)
  const fromFormatted = formatPropertySizeNumber(from)
  const toFormatted = formatPropertySizeNumber(to)
  if (fromFormatted && toFormatted && fromFormatted !== toFormatted) {
    return `${fromFormatted} - ${toFormatted} ${unit}`
  }
  const value = getPropertySizeValue(property, unit)
  const formatted = formatPropertySizeNumber(value) || fromFormatted || toFormatted
  if (!formatted) return ''
  return `${formatted} ${unit}`
}

/** Numeric part only (e.g. "1,200-1,500" or "1,200") for labels that add their own unit. */
export function formatPropertySizeValueDisplay(property) {
  const display = formatPropertySizeDisplay(property)
  if (!display) return ''
  return display.replace(/ (SQFT|SQM)$/, '')
}
