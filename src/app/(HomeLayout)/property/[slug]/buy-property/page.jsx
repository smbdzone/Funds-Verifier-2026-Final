import React, { Suspense } from 'react'
import CheckoutLayout from '@/components/CheckoutLayoutComponent/CheckoutLayout'
import axios from 'axios'
import customAxios from '../../../../../utils/apis/apis'

const page = async ({ params }) => {
  const { slug } = params
  const propertyResponse = await customAxios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/property/${slug}`
  )
  const propertyInfo = propertyResponse.data

  // Fetch related property data
  const propertyDataResponse = await customAxios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/property`
  )
  const propertyData = propertyDataResponse.data
  return (
    <Suspense fallback={<p className='text-center'>Loading...</p>}>
      <CheckoutLayout propertyInfo={propertyInfo} propertyData={propertyData} />
    </Suspense>
  )
}

export default page
