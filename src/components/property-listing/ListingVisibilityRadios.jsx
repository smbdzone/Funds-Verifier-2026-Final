'use client'

import {
  parseListingPriceAmount,
  PROPERTY_LISTING_VISIBILITY_THRESHOLD,
} from '@/libs/listingVisibilityThresholds'

export { PROPERTY_LISTING_VISIBILITY_THRESHOLD }

/**
 * Public / Private listing radios — shown when price reaches the
 * visibility threshold (property AED 5M+). Same rule on create and edit.
 */
export default function ListingVisibilityRadios({
  listings = ['Private', 'Public'],
  value = '',
  onChange,
  idPrefix = 'listing-vis',
  className = '',
}) {
  if (!Array.isArray(listings) || listings.length === 0) return null

  return (
    <div className={`w-full ${className}`}>
      <div className='flex flex-wrap items-center gap-x-5 gap-y-2'>
        <span className='shrink-0 text-sm font-medium text-dark-black md:text-base'>
          Listing
        </span>
        <form className='flex flex-wrap items-center gap-x-5 gap-y-2'>
          {listings.map((listing, index) => (
            <div key={listing} className='radio-container flex'>
              <input
                className='custom-radio visually-hidden custom-checkbox'
                type='radio'
                name='listing'
                value={listing || ''}
                id={`${idPrefix}-${index}`}
                checked={value === listing}
                onChange={(e) => onChange?.(e, 'listing')}
              />
              <label className='custom-label' htmlFor={`${idPrefix}-${index}`}>
                {listing}
              </label>
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}

export function shouldShowPropertyListingVisibility({
  price,
  priceFrom,
  isOffPlan = false,
  currentListing = '',
} = {}) {
  const raw = isOffPlan ? priceFrom || price || 0 : price || 0
  const amount = parseListingPriceAmount(raw)
  if (
    Number.isFinite(amount) &&
    amount >= PROPERTY_LISTING_VISIBILITY_THRESHOLD
  ) {
    return true
  }
  return String(currentListing || '').trim() === 'Private'
}
