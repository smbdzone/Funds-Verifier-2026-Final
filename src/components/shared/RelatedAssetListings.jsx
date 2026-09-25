'use client'

import RelatedListingsSection from '@/components/shared/RelatedListingsSection'
import RelatedListingCard from '@/components/shared/RelatedListingCard'

export default function RelatedAssetListings({
  title = 'Related Listings',
  listings = [],
}) {
  return (
    <RelatedListingsSection
      title={title}
      listings={listings}
      renderCard={(listing) => (
        <RelatedListingCard listing={listing} className='!mx-0 !max-w-none' />
      )}
    />
  )
}
