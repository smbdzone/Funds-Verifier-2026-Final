/** Default success fees (AED) — mirrors backend defaults. */
export const DEFAULT_SUCCESS_FEES = {
  propertySuccessFee: 6000,
  boatSuccessFee: 3000,
  carSuccessFee: 2000,
  jewelrySuccessFee: 2000,
}

let cachedFees = { ...DEFAULT_SUCCESS_FEES }
let feesLoadPromise = null

export function getCachedSuccessFees() {
  return cachedFees
}

export function resolveSuccessFeeForAssetType(assetType, fees = cachedFees) {
  const t = String(assetType || '').toLowerCase()
  if (t.includes('property') || t.includes('off plan') || t.includes('offplan')) {
    return Number(fees.propertySuccessFee) || DEFAULT_SUCCESS_FEES.propertySuccessFee
  }
  if (t.includes('car')) {
    return Number(fees.carSuccessFee) || DEFAULT_SUCCESS_FEES.carSuccessFee
  }
  if (t.includes('boat')) {
    return Number(fees.boatSuccessFee) || DEFAULT_SUCCESS_FEES.boatSuccessFee
  }
  if (t.includes('jewel')) {
    return Number(fees.jewelrySuccessFee) || DEFAULT_SUCCESS_FEES.jewelrySuccessFee
  }
  return Number(fees.propertySuccessFee) || DEFAULT_SUCCESS_FEES.propertySuccessFee
}

export function formatSuccessFeeAed(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return 'AED —'
  return `AED ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

export async function loadPublicSuccessFees() {
  if (feesLoadPromise) return feesLoadPromise

  feesLoadPromise = (async () => {
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')
    if (!base) return cachedFees

    try {
      const res = await fetch(`${base}/success-fee/public`)
      if (!res.ok) return cachedFees
      const data = await res.json()
      cachedFees = {
        propertySuccessFee:
          Number(data.propertySuccessFee) || DEFAULT_SUCCESS_FEES.propertySuccessFee,
        boatSuccessFee:
          Number(data.boatSuccessFee) || DEFAULT_SUCCESS_FEES.boatSuccessFee,
        carSuccessFee:
          Number(data.carSuccessFee) || DEFAULT_SUCCESS_FEES.carSuccessFee,
        jewelrySuccessFee:
          Number(data.jewelrySuccessFee) || DEFAULT_SUCCESS_FEES.jewelrySuccessFee,
      }
    } catch {
      // Keep defaults on network errors.
    }

    return cachedFees
  })()

  return feesLoadPromise
}
