'use client'

import React, { Suspense, useEffect } from 'react'
import { Banner } from '@/components/modules/Banner'
import ClientWrapper from '@/components/Wrappers/ClientWrapper'
import { propertyType } from '../../../constants/listing-data'
import { useSecureAxios } from '../../../utils/useSecureAxios'
import { usePublicTokenContext } from '../../../utils/PublicTokenProvider.'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { ListingCardSkeleton } from '@/components/global/ListingCardSkeleton'

function getPropertyTypeText(propertyTypeValue, propertyTypeArray) {
  for (const type of propertyTypeArray) {
    if (
      type.mapData &&
      type.mapData.some((item) => item.value === propertyTypeValue)
    ) {
      return type.text
    }
  }
  return 'Residential'
}

function PropertyPageContent({ params }) {
  const api = useSecureAxios()
  const publicToken = usePublicTokenContext()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!publicToken) return

    api
      .get('/public/data')
      .then(() => {})
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error(err)
        }
      })
  }, [api, publicToken])

  const assetType = searchParams.get('assetType')
  const propertyTypeValue = searchParams.get('propertyType')
  const propertyTypeText = getPropertyTypeText(propertyTypeValue, propertyType)

  return (
    <div className='w-full bg-[#f0f8ff78]'>
      <Banner
        title={assetType || 'Properties For Sale'}
        catagory={propertyTypeText || 'Properties'}
        subcatagory={propertyTypeValue || 'Apartment'}
      />
      <ClientWrapper params={params} />
    </div>
  )
}

export default function Page({ params }) {
  return (
    <Suspense
      fallback={
        <div className='py-6 px-4'>
          <ListingCardSkeleton count={3} />
        </div>
      }
    >
      <PropertyPageContent params={params} />
    </Suspense>
  )
}
