import axios from 'axios'
import Link from 'next/link'
import { Suspense } from 'react'
import ButtomSlider from '@/components/Product_page/Buttom_slider'
import ProductView from '@/components/views/ProductView'
import GlobalLoader from '@/utils/GlobalLoader'
import customAxios from '../../../../utils/apis/apis'

const GetProductData = async ({ slug }) => {
  try {
    const propertyResponse = await customAxios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/property/${slug}`
    )
    // Fetch related property data
    const propertyDataResponse = await customAxios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/property`
    )

    const propertyInfo = propertyResponse?.data
    const propertyData = propertyDataResponse?.data || []
    return { propertyInfo, propertyData }
  } catch (error) {
    return null
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const data = await GetProductData({ slug })

  if (!data || !data.propertyInfo) {
    return (
      <div className='w-full h-[500px] flex items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Property not found</h1>
      </div>
    )
  }

  const { propertyData, propertyInfo } = data

  return (
    <div className='w-full sm:pb-8'>
      <Suspense fallback={<GlobalLoader />}>
        <div className='w-full valuesBg flex py-10 sm:py-24 md:px-20 flex-col'>
          <div className='container mx-auto'>
            <h1 className='heading text-white  md:text-2xl text-lg fs-60 font-semibold'>
              {propertyInfo?.assetType}
            </h1>
            <p className='md:text-2xl text-[12px] text-white mt-2 capitalize'>
              <span className='text-[#9b9b9b7c]'>
                <Link href='/'>Home</Link> /{' '}
                <Link href='/property'>Properties</Link> /
              </span>
              {propertyInfo?.title}
            </p>
          </div>
        </div>
        <ProductView data={propertyInfo} />
        <div className='theme-container '>
          <h1 className='md:text-2xl text-lg mb-3 sm:mb-6 font-semibold text-left text-blue'>
            Related Properties
          </h1>
          <ButtomSlider data={propertyData || []} />
        </div>
      </Suspense>
    </div>
  )
}
