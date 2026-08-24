import axios from 'axios'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import ProductView from '@/components/views/ProductView'
import RelatedAssetListings from '@/components/shared/RelatedAssetListings'
import GlobalLoader from '@/utils/GlobalLoader'
import { withPublicApiRetry } from '@/libs/publicApiClient'
import { buildListingPageMetadata } from '@/libs/listingMetadata'
import { isOffPlanListing } from '@/libs/filterMyListingTab'
import { getListingDetailId } from '@/libs/listingSlug'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const GetProductData = cache(async ({ slug }) => {
  try {
    const [propertyResponse, relatedResponse] = await withPublicApiRetry(
      (headers) =>
        Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/property/${slug}`, {
            headers,
          }),
          axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/property/related-property`,
            {
              headers,
              params: {
                statusFilter: 1,
                limit: 24,
                excludeSlug: slug,
                excludeOffPlan: true,
              },
            },
          ),
        ]),
    )

    const propertyInfo = propertyResponse?.data
    const relatedProducts = relatedResponse?.data?.products || []

    const products = relatedProducts.filter((item) => {
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
      relatedListings: products,
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
      <div className='flex h-[500px] w-full items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Property not found</h1>
      </div>
    )
  }

  const { relatedListings, propertyInfo } = data

  if (isOffPlanListing(propertyInfo)) {
    const offPlanId = getListingDetailId(propertyInfo) || slug
    redirect(`/offplan/${offPlanId}`)
  }

  return (
    <div className='w-full sm:pb-8'>
      <Suspense fallback={<GlobalLoader />}>
        <div className='valuesBg flex w-full flex-col justify-end px-4 py-5 sm:px-6 sm:py-10 md:px-20 md:py-14 lg:py-20'>
          <div className='container mx-auto'>
            <h1 className='max-w-[18ch] text-[15px] font-semibold leading-snug text-white sm:max-w-none sm:text-xl sm:leading-tight md:text-2xl lg:text-3xl'>
              {propertyInfo?.assetType || 'Properties For Sale'}
            </h1>
            <p className='mt-1.5 text-[10px] capitalize leading-normal text-white/90 sm:mt-2 sm:text-xs md:text-sm'>
              <span className='text-white/50'>
                <Link href='/'>Home</Link> /{' '}
                <Link href='/property'>Properties</Link> /
              </span>{' '}
              Listing details
            </p>
          </div>
        </div>

        <ProductView data={propertyInfo} />

        <RelatedAssetListings
          title='Related Properties'
          listings={relatedListings}
        />
      </Suspense>
    </div>
  )
}
