'use client'

import { getListingAmenities } from '@/libs/listingAmenities'

/**
 * Compact amenity chips for listing cards / detail summaries.
 */
export default function ListingAmenitiesRow({
  listing,
  amenities: amenitiesProp,
  limit = 4,
  className = '',
  chipClassName = '',
}) {
  const amenities = Array.isArray(amenitiesProp)
    ? amenitiesProp.filter(Boolean)
    : getListingAmenities(listing)

  if (!amenities.length) return null

  const visible = limit > 0 ? amenities.slice(0, limit) : amenities
  const remaining = amenities.length - visible.length

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`.trim()}
      aria-label='Amenities'
    >
      {visible.map((item) => (
        <span
          key={item}
          className={`inline-flex max-w-full truncate rounded-[3px] bg-[#F5F5F5] px-2 py-1 text-xs text-prussianBlue sm:text-sm ${chipClassName}`.trim()}
          title={item}
        >
          {item}
        </span>
      ))}
      {remaining > 0 ? (
        <span className='text-xs text-prussianBlue/70 sm:text-sm'>
          +{remaining} more
        </span>
      ) : null}
    </div>
  )
}
