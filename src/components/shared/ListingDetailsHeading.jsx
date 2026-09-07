'use client'

import ListingCardViewCount from '@/components/shared/ListingCardViewCount'

/**
 * "Details" heading with listing analytics (person icon + views) immediately
 * beside it — used on property, car, boat, jewelry, and off-plan detail pages.
 */
export default function ListingDetailsHeading({ listing, label = 'Details' }) {
  return (
    <div className='flex w-full flex-wrap items-center gap-2.5'>
      <h2 className='text-sm font-semibold text-black md:text-base'>{label}</h2>
      <ListingCardViewCount listing={listing} />
    </div>
  )
}
