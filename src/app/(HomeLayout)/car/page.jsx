'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CarListingCard } from '@/components/modules/Car/Car-listing-card'
import { Banner } from '@/components/modules/Banner'
import CarWrapper from '../../../components/Wrappers/CarWrapper'
import QuarterPageBanner from '@/components/advertisementComponent/QuarterPageBanner'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'

function CarPageContent() {
  const searchParams = useSearchParams()
  const make = searchParams.get('make') || 'Cars'
  const model = searchParams.get('model') || null

  return (
    <div className='w-full bg-[#f0f8ff78]'>
      <Banner
        title='Car For Sale'
        catagory={make}
        subcatagory={model}
      />
      <QuarterPageBanner />
      <CarWrapper>
        <CarListingCard />
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
      <CarPageContent />
    </Suspense>
  )
}
