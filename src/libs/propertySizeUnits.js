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

/** Label + numeric value for cards and detail views (no unit conversion). */
export function formatPropertySizeDisplay(property) {
  const unit = property?.sizeUnit || 'SQFT'
  const value = getPropertySizeValue(property, unit)
  const formatted = formatPropertySizeNumber(value)
  if (!formatted) return ''
  return `${formatted} ${unit}`
}
