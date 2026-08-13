/** Map dropdown labels (Studio, 12+) to numeric bed/bath counts for the API. */
export function parseBedBathCount(value) {
  const v = String(value ?? '').trim()
  if (!v) return null
  if (/^studio$/i.test(v)) return 0
  if (v.endsWith('+')) {
    const n = Number(v.replace(/[^\d]/g, ''))
    return Number.isFinite(n) ? n : null
  }
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** Reverse map stored numbers back to dropdown / display labels. */
export function formatBedBathCount(value) {
  if (value === '' || value == null) return ''
  if (Number(value) === 0) return 'Studio'
  return String(value)
}

/** Display bedrooms/bathrooms on listing detail pages. */
export function displayBedBathCount(value) {
  if (value === '' || value == null) return ''
  if (Number(value) === 0) return 'Studio'
  const num = Number(value)
  if (Number.isFinite(num)) return String(num).padStart(2, '0')
  return String(value)
}
