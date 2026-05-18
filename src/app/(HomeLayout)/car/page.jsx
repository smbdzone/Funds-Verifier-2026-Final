/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { CarListingCard } from '@/components/modules/Car/Car-listing-card'
import { Banner } from '@/components/modules/Banner'
import CarWrapper from '../../../components/Wrappers/CarWrapper'
import { Suspense } from 'react'
export default function page({ searchParams }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>

    <div className='w-full bg-[#f0f8ff78]'>
      <Banner
        title='Car For Sale'
        catagory={searchParams.make || 'Cars'}
        subcatagory={searchParams?.model || null}
      />
      <CarWrapper>
        <CarListingCard />
      </CarWrapper>
    </div>
    </Suspense>
  )
}
