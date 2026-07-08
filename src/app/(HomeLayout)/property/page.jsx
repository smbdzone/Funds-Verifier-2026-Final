/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { Suspense, useEffect } from 'react'
import { Banner } from '@/components/modules/Banner'
import ClientWrapper from '@/components/Wrappers/ClientWrapper'
import QuarterPageBanner from '@/components/advertisementComponent/QuarterPageBanner'
import { propertyType } from '../../../constants/listing-data'
import { useSecureAxios } from '../../../utils/useSecureAxios'
import { usePublicTokenContext } from '../../../utils/PublicTokenProvider.'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'

export default function Page({ params }) {
  const api = useSecureAxios()
  const publicToken = usePublicTokenContext()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!publicToken) return // ✅ wait safely inside effect

    api
      .get('/public/data')
      .then((res) => {
        // console.log(res.data)
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.error(err)
        }
      })
  }, [publicToken]) // 🔑 dependency is REQUIRED
  const getPropertyTypeText = (propertyTypeValue, propertyTypeArray) => {
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

  const assetType = searchParams.get('assetType')
  const propertyTypeValue = searchParams.get('propertyType')
  const propertyTypeText = getPropertyTypeText(propertyTypeValue, propertyType)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='w-full bg-[#f0f8ff78]'>
        <Banner
          title={assetType || 'Properties For Sale'}
          catagory={propertyTypeText || 'Properties'}
          subcatagory={propertyTypeValue || 'Apartment'}
        />
        <QuarterPageBanner />
        <ClientWrapper params={params} />
      </div>
    </Suspense>
  )
}
