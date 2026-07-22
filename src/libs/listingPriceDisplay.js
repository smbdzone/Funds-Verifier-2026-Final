import { isOffPlanListing } from '@/libs/filterMyListingTab'
import { formatNumberWithCommas } from '@/utils/global-functions/global'

/**
 * Price label for listing cards and dashboards.
 * Off-plan: "50,000 - 60,000" when from/to differ; otherwise single price.
 */
export function formatListingPriceDisplay(listing) {
  if (isOffPlanListing(listing)) {
    const fromFormatted = formatNumberWithCommas(listing?.priceFrom)
    const toFormatted = formatNumberWithCommas(listing?.priceTo)

    if (fromFormatted && toFormatted && fromFormatted !== toFormatted) {
      return `${fromFormatted} - ${toFormatted}`
    }

    return fromFormatted || toFormatted || formatNumberWithCommas(listing?.price)
  }

  return formatNumberWithCommas(listing?.price)
}
