import React, { Suspense } from 'react'
import Link from 'next/link'
import ButtomSlider from '@/components/Product_page/Buttom_slider'
import JewelleryView from '@/components/modules/Jewelry/JewelleryView'
import { api } from '@/config'
import GlobalLoader from '@/utils/GlobalLoader'

const GetProductData = async ({ id }) => {
  try {
    const propertyInfo = await api('/jewelry/' + id)
    const propertyData = await api(`/jewelry`)
    return { propertyInfo, propertyData }
  } catch (error) {
    return null
  }
}

export default async function page({ params }) {
  const {id} =await params
  const data = await GetProductData({ id })
  if (!data || !data.propertyInfo) {
    return (
      <div className='w-full h-[500px] flex items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Jewelry not found</h1>
      </div>
    )
  }

  const { propertyInfo, propertyData } = data

  return (
    <div className='w-full pb-8'>
      <Suspense fallback={<GlobalLoader />}>
        <div className='w-full valuesBg flex py-24 md:px-20 flex-col'>
          <div className='container mx-auto'>
            <h1 className='heading text-white fs-60 md:text-2xl text-xl font-semibold'>
              {propertyInfo?.assetType}
            </h1>
            <p className='md:text-2xl text-base text-white mt-2'>
              <span className='text-[#9b9b9b7c]'>
                <Link href='/'>Home</Link> /
                <Link href='/jewelry'>Jewellery</Link> /
              </span>{' '}
              {propertyInfo?.title}
            </p>
          </div>
        </div>
        <JewelleryView data={propertyInfo || {}} />
        <div className='theme-container'>
          <h1 className='md:text-2xl text-lg mb-6 font-semibold text-left text-blue '>
            Related Jewellery
          </h1>
          <ButtomSlider data={propertyData || []} />
        </div>
        <div></div>
      </Suspense>
    </div>
  )
}
