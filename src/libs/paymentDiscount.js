const DEFAULT_DISCOUNT_PERCENT = Number(
  process.env.NEXT_PUBLIC_FULL_PAY_DISCOUNT_PERCENT || 5,
)

export function getFullPayDiscountPercent() {
  const value = Number(DEFAULT_DISCOUNT_PERCENT)
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.min(50, value)
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
