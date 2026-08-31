import React, { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import JewelleryView from '@/components/modules/Jewelry/JewelleryView'
import RelatedAssetListings from '@/components/shared/RelatedAssetListings'
import PrivateListingDetailGate from '@/components/shared/PrivateListingDetailGate'
import { api } from '@/config'
import GlobalLoader from '@/utils/GlobalLoader'
import { buildListingPageMetadata } from '@/libs/listingMetadata'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const GetProductData = cache(async ({ id }) => {
  try {
    const relatedQuery = new URLSearchParams({
      statusFilter: '1',
      limit: '24',
      excludeSlug: id,
      excludeUuid: id,
      excludeId: id,
    })

    const [propertyInfo, relatedData] = await Promise.all([
      api(`/jewelry/${id}`),
      api(`/jewelry/related-jewelry?${relatedQuery.toString()}`, {}, 0),
    ])

    const relatedProducts = relatedData?.products || []
    const products = relatedProducts.filter((item) => {
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
      relatedListings: products,
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
      <div className='flex h-[500px] w-full items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Jewelry not found</h1>
      </div>
    )
  }

  const { propertyInfo, relatedListings } = data

  if (propertyInfo?.slug && id === propertyInfo.uuid) {
    redirect(`/jewelry/${propertyInfo.slug}`)
  }

  return (
    <div className='w-full pb-8'>
      <Suspense fallback={<GlobalLoader />}>
        <div className='valuesBg flex w-full flex-col justify-end px-4 py-5 sm:px-6 sm:py-10 md:px-20 md:py-14 lg:py-20'>
          <div className='container mx-auto'>
            <h1 className='max-w-[18ch] text-[15px] font-semibold leading-snug text-white sm:max-w-none sm:text-xl sm:leading-tight md:text-2xl lg:text-3xl'>
              {propertyInfo?.assetType || 'Jewellery For Sale'}
            </h1>
            <p className='mt-1.5 text-[10px] capitalize leading-normal text-white/90 sm:mt-2 sm:text-xs md:text-sm'>
              <span className='text-white/50'>
                <Link href='/'>Home</Link> /{' '}
                <Link href='/jewelry'>Jewellery</Link> /
              </span>{' '}
              Listing details
            </p>
          </div>
        </div>

        <PrivateListingDetailGate listing={propertyInfo}>
          <JewelleryView data={propertyInfo || {}} />
        </PrivateListingDetailGate>

        <RelatedAssetListings
          title='Related Jewellery'
          listings={relatedListings}
        />
      </Suspense>
    </div>
  )
}
