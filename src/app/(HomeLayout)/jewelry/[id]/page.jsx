import React, { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ButtomSlider from '@/components/Product_page/Buttom_slider'
import JewelleryView from '@/components/modules/Jewelry/JewelleryView'
import { api } from '@/config'
import GlobalLoader from '@/utils/GlobalLoader'
import { buildListingPageMetadata } from '@/libs/listingMetadata'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const GetProductData = cache(async ({ id }) => {
  try {
    const propertyInfo = await api(`/jewelry/${id}`)
    // Only evaluator-approved jewellery (status = 1) in Related Jewellery
    const propertyData = await api('/jewelry?statusFilter=1&limit=50', {}, 0)
    // Only exclude the current listing by real ids — empty slug/undefined
    // must not be treated as equal (undefined !== undefined is false).
    const relatedProducts = (propertyData?.products || []).filter((item) => {
      if (Number(item?.status) !== 1) return false
      if (propertyInfo?.uuid && item?.uuid === propertyInfo.uuid) return false
      if (
        propertyInfo?.slug &&
        item?.slug &&
        item.slug === propertyInfo.slug
      ) {
        return false
      }
      if (
        propertyInfo?._id &&
        item?._id &&
        String(item._id) === String(propertyInfo._id)
      ) {
        return false
      }
      return true
    })
    return {
      propertyInfo,
      propertyData: { ...propertyData, products: relatedProducts },
    }
  } catch (error) {
    return null
  }
})

export async function generateMetadata({ params }) {
  const { id } = await params
  const data = await GetProductData({ id })

  if (!data?.propertyInfo) {
    return { title: 'Jewelry not found | Funds Verifier' }
  }

  return buildListingPageMetadata(data.propertyInfo, {
    routeSegment: 'jewelry',
    listingId: id,
  })
}

export default async function page({ params }) {
  const { id } = await params
  const data = await GetProductData({ id })
  if (!data || !data.propertyInfo) {
    return (
      <div className='w-full h-[500px] flex items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Jewelry not found</h1>
      </div>
    )
  }

  const { propertyInfo, propertyData } = data

  if (propertyInfo?.slug && id === propertyInfo.uuid) {
    redirect(`/jewelry/${propertyInfo.slug}`)
  }

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
              Listing details
            </p>
          </div>
        </div>
        <JewelleryView data={propertyInfo || {}} />
        {propertyData?.products?.length > 0 ? (
          <div className='theme-container mt-8 border-t border-reefGold pt-10 sm:mt-12 sm:pt-12'>
            <h1 className='md:text-2xl text-lg mb-6 font-semibold text-left text-blue '>
              Related Jewellery
            </h1>
            <ButtomSlider data={propertyData} />
          </div>
        ) : null}
      </Suspense>
    </div>
  )
}
