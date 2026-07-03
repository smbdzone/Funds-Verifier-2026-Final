export const ROI_BRACKET_TOLERANCE_PERCENT = 20

export function formatRoiValue(value) {
  const rounded = Math.round(Number(value) * 100) / 100
  if (!Number.isFinite(rounded)) return ''
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(2).replace(/\.?0+$/, '')
}

/** ±tolerance% of the entered ROI (e.g. 5% → 4%–6% at 20%). */
export function computeRoiBracket(centerValue, tolerancePercent = ROI_BRACKET_TOLERANCE_PERCENT) {
  const center = Number(centerValue)
  if (!Number.isFinite(center) || center < 0) return null

  const delta = (center * tolerancePercent) / 100
  const min = Math.max(0, center - delta)
  const max = center + delta

  return {
    center,
    tolerancePercent,
    delta,
    min,
    max,
    minLabel: formatRoiValue(min),
    maxLabel: formatRoiValue(max),
    deltaLabel: formatRoiValue(delta),
    centerLabel: formatRoiValue(center),
  }
}
