import { Suspense } from 'react'
import BoatView from '@/components/modules/Boat/BoatView'
import RelatedAssetListings from '@/components/shared/RelatedAssetListings'
import PrivateListingDetailGate from '@/components/shared/PrivateListingDetailGate'
import axios from 'axios'
import Link from 'next/link'
import GlobalLoader from '@/utils/GlobalLoader'
import { withPublicApiRetry } from '@/libs/publicApiClient'
import { buildListingPageMetadata } from '@/libs/listingMetadata'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

const GetProductData = cache(async ({ slug }) => {
  try {
    const [propertyResponse, relatedResponse] = await withPublicApiRetry(
      (headers) =>
        Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/boat/${slug}`, {
            headers,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/boat/related-boat`, {
            headers,
            params: {
              statusFilter: 1,
              limit: 24,
              excludeSlug: slug,
            },
          }),
        ]),
    )

    const boatInfo = propertyResponse?.data
    const relatedProducts = relatedResponse?.data?.products || []
    const products = relatedProducts.filter((boat) => {
      if (boatInfo?.uuid && boat?.uuid === boatInfo.uuid) return false
      if (boatInfo?.slug && boat?.slug && boat.slug === boatInfo.slug) {
        return false
      }
      return true
    })

    return {
      boatInfo,
      relatedListings: products,
    }
  } catch (error) {
    return null
  }
})

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = await GetProductData({ slug })

  if (!data?.boatInfo) {
    return { title: 'Boat not found | Funds Verifier' }
  }

  return buildListingPageMetadata(data.boatInfo, {
    routeSegment: 'boat',
    listingId: slug,
  })
}

export default async function Page({ params }) {
  const { slug } = await params

  const data = await GetProductData({ slug })
  if (!data || !data.boatInfo) {
    return (
      <div className='flex h-[500px] w-full items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Boat not found</h1>
      </div>
    )
  }

  const { boatInfo, relatedListings } = data

  return (
    <div className='w-full pb-8'>
      <Suspense fallback={<GlobalLoader />}>
        <div className='valuesBg flex w-full flex-col justify-end px-4 py-5 sm:px-6 sm:py-10 md:px-20 md:py-14 lg:py-20'>
          <div className='container mx-auto'>
            <h1 className='max-w-[18ch] text-[15px] font-semibold leading-snug text-white sm:max-w-none sm:text-xl sm:leading-tight md:text-2xl lg:text-3xl'>
              {boatInfo?.assetType || 'Boats For Sale'}
            </h1>
            <p className='mt-1.5 text-[10px] capitalize leading-normal text-white/90 sm:mt-2 sm:text-xs md:text-sm'>
              <span className='text-white/50'>
                <Link href='/'>Home</Link> / <Link href='/boat'>Boats</Link> /
              </span>{' '}
              Listing details
            </p>
          </div>
        </div>

        <PrivateListingDetailGate listing={boatInfo}>
          <BoatView data={boatInfo} />
        </PrivateListingDetailGate>

        <RelatedAssetListings
          title='Related Boats'
          listings={relatedListings}
        />
      </Suspense>
    </div>
  )
}
