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

export function parsePropertySizeInput(rawValue) {
  const cleaned = String(rawValue || '').replace(/,/g, '').trim()
  if (!cleaned) return ''
  const n = Number(cleaned)
  if (!Number.isFinite(n) || n <= 0) return ''
  return String(n)
}

export function getPropertySizeValue(property, unit) {
  const selectedUnit = unit || property?.sizeUnit || 'SQFT'
  if (selectedUnit === 'SQM') {
    const sqm = property?.sizeSQM
    if (sqm !== '' && sqm != null && Number(sqm) > 0) return sqm
    return property?.sizeSQFT ?? ''
  }
  const sqft = property?.sizeSQFT
  if (sqft !== '' && sqft != null && Number(sqft) > 0) return sqft
  return property?.sizeSQM ?? ''
}

/**
 * From/To values for the selected unit (off-plan listings store a size range).
 * Falls back to the single size value when no range was entered.
 */
export function getPropertySizeRange(property, unit) {
  const selectedUnit = unit || property?.sizeUnit || 'SQFT'
  const from =
    selectedUnit === 'SQM'
      ? property?.sizeSQMFrom ?? property?.sizeSQM
      : property?.sizeSQFTFrom ?? property?.sizeSQFT
  const to =
    selectedUnit === 'SQM' ? property?.sizeSQMTo : property?.sizeSQFTTo
  return { from, to, unit: selectedUnit }
}

/**
 * Label + numeric value for cards and detail views (no unit conversion).
 * Shows "from-to UNIT" when a size range was entered (off-plan), otherwise
 * the single value as before.
 */
export function formatPropertySizeDisplay(property) {
  const unit = property?.sizeUnit || 'SQFT'
  const { from, to } = getPropertySizeRange(property, unit)
  const fromFormatted = formatPropertySizeNumber(from)
  const toFormatted = formatPropertySizeNumber(to)
  if (fromFormatted && toFormatted && fromFormatted !== toFormatted) {
    return `${fromFormatted}-${toFormatted} ${unit}`
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
