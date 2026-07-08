/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { JewelleryListingCard } from '@/components/modules/Jewelry/Jewellery-listing-card'
import { Banner } from '@/components/modules/Banner'
import CarWrapper from '../../../components/Wrappers/CarWrapper'
import QuarterPageBanner from '@/components/advertisementComponent/QuarterPageBanner'
import { Suspense } from 'react'

export default function page({ searchParams }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='w-full bg-[#f0f8ff78]'>
        <Banner
          title='Jewelery For Sale'
          catagory={searchParams?.category || 'Jewelery'}
          subcatagory={searchParams?.model || ''}
        />
        <QuarterPageBanner />
        <CarWrapper>
          <JewelleryListingCard />
        </CarWrapper>
      </div>
    </Suspense>
  )
}
