'use client'

import { FaUser } from 'react-icons/fa'
import { formatNumberWithCommas } from '@/utils/global-functions/global'

/**
 * Small avatar icon + view count for public listing cards.
 * Counts detail opens for this listing only (analytics.clicks).
 */
export default function ListingCardViewCount({ listing, className = '' }) {
  const clicks = Number(listing?.analytics?.clicks)
  const views = Number.isFinite(clicks) ? Math.max(0, Math.floor(clicks)) : 0

  return (
    <div
      className={`inline-flex shrink-0 items-center gap-1.5 text-[#002D4F]/70 ${className}`}
      title={`${formatNumberWithCommas(views)} view${views === 1 ? '' : 's'}`}
    >
      <span className='flex h-6 w-6 items-center justify-center rounded-full bg-[#002D4F]/10 text-[#002D4F]'>
        <FaUser size={11} aria-hidden />
      </span>
      <span className='text-xs font-medium tabular-nums md:text-sm'>
        {formatNumberWithCommas(views)}
      </span>
    </div>
  )
}
