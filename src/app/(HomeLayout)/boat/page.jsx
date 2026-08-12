'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { BoatListingCard } from '@/components/modules/Boat/Boat-listing-card'
import { Banner } from '@/components/modules/Banner'
import CarWrapper from '../../../components/Wrappers/CarWrapper'
import QuarterPageBanner from '@/components/advertisementComponent/QuarterPageBanner'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'

function BoatPageContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'Boats'
  const model = searchParams.get('model') || null

  return (
    <div className='w-full bg-[#f0f8ff78]'>
      <Banner
        title='Boats For Sale'
        catagory={category}
        subcatagory={model}
      />
      <QuarterPageBanner />
      <CarWrapper>
        <BoatListingCard />
      </CarWrapper>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='py-6 px-4'>
          <ListingCardSkeleton count={3} />
        </div>
      }
    >
      <BoatPageContent />
    </Suspense>
  )
}
