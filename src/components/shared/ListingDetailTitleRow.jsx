'use client'

import {
  getListingPremiumDisplay,
  LISTING_PREMIUM_BLUE_GRADIENT,
} from '@/libs/listingPremiumStatus'

/** Detail-page title row: title and status badge. */
export default function ListingDetailTitleRow({ listing, title }) {
  const displayTitle = title ?? listing?.title ?? ''
  const { badge, hasFeaturedStyling } = getListingPremiumDisplay(listing)
  const label =
    String(listing?.approvalBadge || '').trim() || badge || null
  const occupancy = String(listing?.occupancyStatus || '')
  const showOccupancy = ['Reserved', 'Under Offer'].includes(occupancy)
  const useBlueBadge =
    hasFeaturedStyling || label === 'Featured' || label === 'Recommended'

  return (
    <div className='flex w-full flex-wrap items-start gap-3'>
      <div className='flex min-w-0 flex-1 flex-wrap items-center gap-2.5'>
        <h1 className='min-w-0 break-words text-wrap text-lg font-semibold capitalize text-blue sm:text-xl md:text-2xl lg:text-3xl'>
          {displayTitle}
        </h1>
      </div>
      {label ? (
        <span
          className={`shrink-0 rounded border px-2.5 py-1 text-xs font-semibold text-white sm:text-sm ${useBlueBadge ? '' : 'gradient'
            }`}
          style={
            useBlueBadge
              ? { background: LISTING_PREMIUM_BLUE_GRADIENT }
              : undefined
          }
        >
          {label}
        </span>
      ) : null}
      {showOccupancy ? (
        <span className='shrink-0 rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 sm:text-sm'>
          {occupancy}
        </span>
      ) : null}
    </div>
  )
}
