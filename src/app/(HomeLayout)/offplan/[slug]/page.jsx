import Link from 'next/link'
import { Suspense } from 'react'
import OffPlanProductView from '@/components/offplan/OffPlanProductView'
import OffPlanPropertyCard from '@/components/offplan/OffPlanPropertyCard'
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
  const listing = await fetchOffPlanListingBySlug(slug)

  if (!listing) {
    return (
      <div className='flex h-[500px] w-full items-center justify-center'>
        <h1 className='text-2xl font-semibold'>Off-plan property not found</h1>
      </div>
    )
  }

  const allListings = await fetchApprovedOffPlanListings({ limit: 50 })
  const relatedListings = allListings
    .filter((item) => item.slug !== listing.slug)
    .slice(0, 3)

  return (
    <div className='w-full sm:pb-8'>
      <Suspense fallback={<GlobalLoader />}>
        <div className='valuesBg flex w-full flex-col py-10 sm:py-24 md:px-20'>
          <div className='container mx-auto'>
            <h1 className='heading fs-60 text-lg font-semibold text-white md:text-2xl'>
              Property Off Plan For Sale
            </h1>
            <p className='mt-2 text-[12px] capitalize text-white md:text-2xl'>
              <span className='text-[#9b9b9b7c]'>
                <Link href='/'>Home</Link> / <Link href='/offplan'>Off Plan</Link> /
              </span>{' '}
              Listing details
            </p>
          </div>
        </div>

        <OffPlanProductView data={listing} />

        {relatedListings.length ? (
          <div className='theme-container mt-8 border-t border-[#d0d5db] pb-10 pt-10 sm:mt-12 sm:pt-12'>
            <h2 className='mb-6 text-left text-lg font-semibold text-blue md:text-2xl'>
              Related Off-Plan Properties
            </h2>
            <div className='grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3'>
              {relatedListings.map((item) => (
                <OffPlanPropertyCard
                  key={item.id}
                  href={`/offplan/${item.slug}`}
                  title={item.title}
                  location={item.location}
                  deliveryLabel={item.deliveryLabel}
                  paymentPlanLabel={item.paymentPlanLabel}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  listingRef={item.ref}
                  qrScanSrc={item.qrScanSrc}
                  priceFrom={item.priceFrom}
                  priceTo={item.priceTo}
                  images={item.images}
                  developerAvatar={item.developerAvatar}
                  approvalBadge={item.approvalBadge}
                  analytics={item.analytics}
                  slug={item.slug}
                  uuid={item.uuid}
                  assetType={item.assetType}
                />
              ))}
            </div>
          </div>
        ) : null}
      </Suspense>
    </div>
  )
}
