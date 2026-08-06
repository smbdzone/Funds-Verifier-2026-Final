import axios from 'axios'
import Link from 'next/link'
import { Suspense } from 'react'
import ButtomSlider from '@/components/Product_page/Buttom_slider'
import ProductView from '@/components/views/ProductView'
import GlobalLoader from '@/utils/GlobalLoader'
import { getPublicApiHeaders } from '@/libs/publicApiClient'
import { buildListingPageMetadata } from '@/libs/listingMetadata'
import { isOffPlanListing } from '@/libs/filterMyListingTab'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const GetProductData = cache(async ({ slug }) => {
  try {
    const headers = await getPublicApiHeaders()
    const propertyResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/property/${slug}`,
      { headers },
    )
    const propertyDataResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/property?statusFilter=1&limit=50&sort=-createdAt`,
      { headers },
    )

    const propertyInfo = propertyResponse?.data
    const propertyData = propertyDataResponse?.data
    const relatedProducts = (propertyData?.products || []).filter((item) => {
      if (Number(item?.status) !== 1) return false
      if (isOffPlanListing(item)) return false
      if (propertyInfo?.uuid && item?.uuid === propertyInfo.uuid) return false
      if (
        propertyInfo?.slug &&
        item?.slug &&
        item.slug === propertyInfo.slug
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
    console.error('Failed to load property:', slug, error?.message)
    return null
  }
})

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = await GetProductData({ slug })

  if (!data?.propertyInfo) {
    return { title: 'Property not found | Funds Verifier' }
  }

  return buildListingPageMetadata(data.propertyInfo, {
    routeSegment: 'property',
    listingId: slug,
  })
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
              Listing details
            </p>
          </div>
        </div>
        <ProductView data={propertyInfo} />
        {propertyData?.products?.length > 0 ? (
          <div className='theme-container mt-8 border-t border-reefGold pt-10 sm:mt-12 sm:pt-12'>
            <h1 className='md:text-2xl text-lg mb-3 sm:mb-6 font-semibold text-left text-blue'>
              Related Properties
            </h1>
            <ButtomSlider data={propertyData} />
          </div>
        ) : null}
      </Suspense>
    </div>
  )
}
