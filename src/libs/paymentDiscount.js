const ENV_FALLBACK = Number(process.env.NEXT_PUBLIC_FULL_PAY_DISCOUNT_PERCENT || 5)

let cachedDiscountPercent = Number.isFinite(ENV_FALLBACK) ? ENV_FALLBACK : 5
let discountLoadPromise = null

function clampDiscountPercent(value) {
  const num = Number(value)
  if (!Number.isFinite(num) || num <= 0) return 0
  return Math.min(50, Math.max(0, num))
}

export function setFullPayDiscountPercent(value) {
  cachedDiscountPercent = clampDiscountPercent(value)
}

export function getFullPayDiscountPercent() {
  return cachedDiscountPercent
}

export async function loadFullPayDiscountPercent() {
  if (discountLoadPromise) return discountLoadPromise

  discountLoadPromise = (async () => {
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')
    if (!base) return cachedDiscountPercent

    try {
      const res = await fetch(`${base}/success-fee/full-pay-discount`)
      if (!res.ok) return cachedDiscountPercent

      const data = await res.json()
      if (data?.fullPayDiscountPercent != null) {
        setFullPayDiscountPercent(data.fullPayDiscountPercent)
      }
    } catch {
      // Keep cached/env fallback on network errors.
    }

    return cachedDiscountPercent
  })()

  return discountLoadPromise
}

export function applyFullPayDiscount(amount) {
  const total = Number(amount)
  if (!Number.isFinite(total) || total <= 0) {
    return { original: total, discounted: total, discountPercent: 0, discountAmount: 0 }
  }

  const discountPercent = getFullPayDiscountPercent()
  if (discountPercent <= 0) {
    return { original: total, discounted: total, discountPercent: 0, discountAmount: 0 }
  }

  const discountAmount = Math.round(total * (discountPercent / 100) * 100) / 100
  const discounted = Math.round((total - discountAmount) * 100) / 100

  return { original: total, discounted, discountPercent, discountAmount }
}

export function formatAed(amount) {
  return `${Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} AED`
}
