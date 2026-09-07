'use client'

/**
 * Public / Private listing radios — shown when price reaches the
 * visibility threshold (property AED 5M+) or when editing an existing listing.
 * Sits beside Price: “Listing” label + radios on one row.
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

/** Property listings: Public/Private choice appears at AED 5,000,000+. */
export const PROPERTY_LISTING_VISIBILITY_THRESHOLD = 5_000_000

export function shouldShowPropertyListingVisibility({
  price,
  priceFrom,
  isOffPlan = false,
  listingId,
  fieldsLocked = false,
}) {
  const amount = Number(
    isOffPlan ? priceFrom || price || 0 : price || 0,
  )
  return (
    amount >= PROPERTY_LISTING_VISIBILITY_THRESHOLD ||
    Boolean(listingId) ||
    Boolean(fieldsLocked)
  )
}
