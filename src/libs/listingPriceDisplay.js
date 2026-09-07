import { isOffPlanListing } from '@/libs/filterMyListingTab'
import { formatNumberWithCommas } from '@/utils/global-functions/global'

/**
 * Format amount/divisor as compact suffix without rounding
 * (e.g. 1020000 → "1.02M", 50000 → "50k", 1500000 → "1.5M").
 */
function formatExactCompact(amount, divisor, suffix) {
  const whole = Math.trunc(amount / divisor)
  const remainder = amount % divisor
  if (remainder === 0) return `${whole}${suffix}`

  const fractionDigits = String(divisor).length - 1
  const frac = String(remainder)
    .padStart(fractionDigits, '0')
    .replace(/0+$/, '')

  return frac ? `${whole}.${frac}${suffix}` : `${whole}${suffix}`
}

/**
 * Compact price part: M at/above 1M; optional k for thousands (public cards).
 * Keeps exact decimals — does not round (1,020,000 → 1.02M, not 1.0M).
 */
export function formatCompactPriceAmount(value, { abbreviateThousands = false } = {}) {
  const raw = Number(value)
  if (!Number.isFinite(raw) || raw <= 0) return ''

  // Prices are whole AED; truncate fractional noise without rounding up.
  const amount = Math.trunc(raw)

  if (amount >= 1_000_000) {
    return formatExactCompact(amount, 1_000_000, 'M')
  }

  if (abbreviateThousands && amount >= 1_000) {
    return formatExactCompact(amount, 1_000, 'k')
  }

  return formatNumberWithCommas(amount)
}

export function formatOffPlanPriceRangeDisplay(
  priceFrom,
  priceTo,
  { abbreviateThousands = false, currencyPrefix = '' } = {},
) {
  const opts = { abbreviateThousands }
  const fromFormatted = formatCompactPriceAmount(priceFrom, opts)
  const toFormatted = formatCompactPriceAmount(priceTo, opts)

  let range = ''
  if (fromFormatted && toFormatted && fromFormatted !== toFormatted) {
    range = `${fromFormatted} - ${toFormatted}`
  } else {
    range =
      fromFormatted ||
      toFormatted ||
      formatCompactPriceAmount(priceFrom ?? priceTo, opts)
  }

  return currencyPrefix ? `${currencyPrefix}${range}` : range
}

/**
 * Price label for listing cards and dashboards.
 * Off-plan ranges and single prices use compact M/k (no rounding).
 */
export function formatListingPriceDisplay(listing) {
  if (isOffPlanListing(listing)) {
    return formatOffPlanPriceRangeDisplay(listing?.priceFrom, listing?.priceTo, {
      abbreviateThousands: true,
    })
  }

  return formatCompactPriceAmount(listing?.price, { abbreviateThousands: true })
}

/** Single price on public listing cards (sliders, product cards). Uses k/M when large. */
export function formatCardPrice(price) {
  return formatCompactPriceAmount(price, { abbreviateThousands: true }) || '0'
}

/** Public card price — off-plan range or single compact price. */
export function formatListingCardPrice(listing) {
  if (isOffPlanListing(listing)) {
    const range = formatOffPlanPriceRangeDisplay(
      listing?.priceFrom,
      listing?.priceTo,
      { abbreviateThousands: true },
    )
    return range || formatCardPrice(listing?.price)
  }

  return formatCardPrice(listing?.price)
}
