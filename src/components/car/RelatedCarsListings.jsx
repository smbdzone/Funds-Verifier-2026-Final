'use client'

import RelatedAssetListings from '@/components/shared/RelatedAssetListings'

export default function RelatedCarsListings({ listings = [] }) {
  return <RelatedAssetListings title='Related Cars' listings={listings} />
}
