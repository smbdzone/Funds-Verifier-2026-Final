import Link from 'next/link'
import { Suspense } from 'react'
import OffPlanProductView from '@/components/offplan/OffPlanProductView'
import RelatedOffPlanListings from '@/components/offplan/RelatedOffPlanListings'
import PrivateListingDetailGate from '@/components/shared/PrivateListingDetailGate'
import GlobalLoader from '@/utils/GlobalLoader'
import {
  fetchApprovedOffPlanListings,
  fetchOffPlanListingBySlug,
} from '@/libs/offPlanListings'

/** View counts on related cards must not be frozen by the Full Route Cache. */
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const listing = await fetchOffPlanListingBySlug(slug)

  if (!listing) {
    return { title: 'Off-plan property not found | Funds Verifier' }
  }

  return {
    title: `${listing.title} | Off Plan Properties`,
    description: listing.description,
  }
}

export default async function OffPlanDetailPage({ params }) {
  const { slug } = await params

  const [listing, relatedCandidates] = await Promise.all([
    fetchOffPlanListingBySlug(slug),
    fetchApprovedOffPlanListings({ limit: 24 }),
  ])

  if (!listing) {
    return (
      <div className='flex h-[500px] w-full items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Off-plan property not found</h1>
      </div>
    )
  }

  const relatedListings = relatedCandidates.filter(
    (item) => item.slug !== listing.slug,
  )

  return (
    <div className='w-full sm:pb-8'>
      <Suspense fallback={<GlobalLoader />}>
        <div className='valuesBg flex w-full flex-col justify-end px-4 py-5 sm:px-6 sm:py-10 md:px-20 md:py-14 lg:py-20'>
          <div className='container mx-auto'>
            <h1 className='max-w-[18ch] text-[15px] font-semibold leading-snug text-white sm:max-w-none sm:text-xl sm:leading-tight md:text-2xl lg:text-3xl'>
              Property Off Plan For Sale
            </h1>
            <p className='mt-1.5 text-[10px] capitalize leading-normal text-white/90 sm:mt-2 sm:text-xs md:text-sm'>
              <span className='text-white/50'>
                <Link href='/'>Home</Link> / <Link href='/offplan'>Off Plan</Link> /
              </span>{' '}
              Listing details
            </p>
          </div>
        </div>

        <PrivateListingDetailGate listing={listing}>
          <OffPlanProductView data={listing} />
        </PrivateListingDetailGate>

        <RelatedOffPlanListings listings={relatedListings} />
      </Suspense>
    </div>
  )
}
