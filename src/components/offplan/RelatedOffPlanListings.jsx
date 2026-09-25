'use client'

import RelatedListingsSection from '@/components/shared/RelatedListingsSection'
import OffPlanPropertyCard from '@/components/offplan/OffPlanPropertyCard'

function RelatedCard({ listing }) {
  return (
    <OffPlanPropertyCard
      href={`/offplan/${listing.slug}`}
      title={listing.title}
      location={listing.location}
      deliveryLabel={listing.deliveryLabel}
      paymentPlanLabel={listing.paymentPlanLabel}
      rating={listing.rating}
      reviewCount={listing.reviewCount}
      listingRef={listing.ref}
      qrScanSrc={listing.qrScanSrc}
      priceFrom={listing.priceFrom}
      priceTo={listing.priceTo}
      images={listing.images}
      developerAvatar={listing.developerAvatar}
      approvalBadge={listing.approvalBadge}
      analytics={listing.analytics}
      slug={listing.slug}
      uuid={listing.uuid}
      assetType={listing.assetType}
      listing={listing.listing}
      city={listing.city}
      neighbourhood={listing.neighbourhood}
      roi={listing.roi}
      propertyType={listing.propertyType}
      className='!mx-0 !max-w-none w-full'
    />
  )
}

export default function RelatedOffPlanListings({ listings = [] }) {
  return (
    <RelatedListingsSection
      title='Related Off-Plan Properties'
      listings={listings}
      getKey={(item) => item.id || item.uuid || item.slug}
      renderCard={(listing) => <RelatedCard listing={listing} />}
    />
  )
}
