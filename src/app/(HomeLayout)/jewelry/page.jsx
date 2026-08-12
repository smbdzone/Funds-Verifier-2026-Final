'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { JewelleryListingCard } from '@/components/modules/Jewelry/Jewellery-listing-card'
import { Banner } from '@/components/modules/Banner'
import CarWrapper from '../../../components/Wrappers/CarWrapper'
import QuarterPageBanner from '@/components/advertisementComponent/QuarterPageBanner'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'

function JewelryPageContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'Jewelery'
  const model = searchParams.get('model') || ''

  return (
    <div className='w-full bg-[#f0f8ff78]'>
      <Banner
        title='Jewelery For Sale'
        catagory={category}
        subcatagory={model}
      />
      <QuarterPageBanner />
      <CarWrapper>
        <JewelleryListingCard />
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
      <JewelryPageContent />
    </Suspense>
  )
}
