import { isOffPlanListing } from '@/libs/filterMyListingTab'
import { formatNumberWithCommas } from '@/utils/global-functions/global'

/**
 * Compact price part: 1.1M above 1M; optional k for thousands (public cards).
 */
export function formatCompactPriceAmount(value, { abbreviateThousands = false } = {}) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return ''

  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
  }

  if (abbreviateThousands && amount >= 1_000) {
    const thousands = amount / 1_000
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(0)}k`
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
 * Off-plan ranges use compact M/k formatting when values are large.
 */
export function formatListingPriceDisplay(listing) {
  if (isOffPlanListing(listing)) {
    return formatOffPlanPriceRangeDisplay(listing?.priceFrom, listing?.priceTo)
  }

  return formatCompactPriceAmount(listing?.price)
}
