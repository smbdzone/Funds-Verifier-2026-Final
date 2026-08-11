/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { CarListingCard } from '@/components/modules/Car/Car-listing-card'
import { Banner } from '@/components/modules/Banner'
import CarWrapper from '../../../components/Wrappers/CarWrapper'
import QuarterPageBanner from '@/components/advertisementComponent/QuarterPageBanner'
import { Suspense } from 'react'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'
export default function page({ searchParams }) {
  return (
    <Suspense fallback={<div className='py-6 px-4'><ListingCardSkeleton count={3} /></div>}>

    <div className='w-full bg-[#f0f8ff78]'>
      <Banner
        title='Car For Sale'
        catagory={searchParams.make || 'Cars'}
        subcatagory={searchParams?.model || null}
      />
      <CarWrapper>
        <CarListingCard />
      </CarWrapper>
      {/* Ad banner sits at the bottom, directly above the footer. */}
      <QuarterPageBanner />
    </div>
    </Suspense>
  )
}
