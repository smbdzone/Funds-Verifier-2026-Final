'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Banner } from '@/components/modules/Banner'
import PaginationComponent from '@/components/modules/Pagination'
import OffPlanPropertyCard from '@/components/offplan/OffPlanPropertyCard'
import OffPlanPageSkeleton from '@/components/offplan/OffPlanPageSkeleton'
import { fetchApprovedOffPlanListings } from '@/libs/offPlanListings'

function filterOffPlanListings(listings, { country, city, minPrice, maxPrice }) {
  return listings.filter((listing) => {
    if (country && listing.country !== country) return false
    if (city && listing.city !== city) return false

    const min = minPrice ? Number(minPrice) : null
    const max = maxPrice ? Number(maxPrice) : null
    const priceFrom = Number(listing.priceFrom) || 0
    const priceTo = Number(listing.priceTo) || 0

    if (min != null && priceTo < min) return false
    if (max != null && priceFrom > max) return false

    return true
  })
}

export default function OffPlanPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFullListing, setShowFullListing] = useState(false)
  const [mobileCardIndex, setMobileCardIndex] = useState(0)
  const itemsPerPage = 6

  const country = searchParams.get('country') || ''
  const city = searchParams.get('city') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setLoadError('')
      try {
        const rows = await fetchApprovedOffPlanListings({
          country,
          city,
          minPrice,
          maxPrice,
          limit: 200,
        })
        if (!cancelled) setListings(rows)
      } catch (error) {
        if (!cancelled) {
          setListings([])
          setLoadError(error?.message || 'Could not load off-plan listings')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [country, city, minPrice, maxPrice])

  const filteredListings = useMemo(
    () =>
      filterOffPlanListings(listings, {
        country,
        city,
        minPrice,
        maxPrice,
      }),
    [listings, country, city, minPrice, maxPrice],
  )

  const hasActiveFilters = Boolean(country || city || minPrice || maxPrice)

  useEffect(() => {
    setCurrentPage(1)
    setMobileCardIndex(0)
    if (hasActiveFilters) {
      setShowFullListing(true)
    }
  }, [country, city, minPrice, maxPrice, hasActiveFilters])

  if (isLoading) {
    return <OffPlanPageSkeleton />
  }

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / itemsPerPage))
  const paginatedListings = showFullListing
    ? filteredListings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    )
    : filteredListings.slice(0, 3)

  const mobileListings = filteredListings
  const mobileVisibleCard = mobileListings[mobileCardIndex]
  const canGoMobilePrev = mobileCardIndex > 0
  const canGoMobileNext = mobileCardIndex < mobileListings.length - 1

  return (
    <>
      <Banner title='Off Plan Properties' />

      <section className='bg-white py-10 sm:py-14 md:py-20'>
        <div className='theme-container mx-auto px-4 sm:px-6'>
          <div className='mx-auto mb-8 flex w-full max-w-[670px] flex-col items-center gap-5 text-center'>
            <div className='flex w-full flex-col items-center gap-[14px]'>
              <h2 className='w-full whitespace-nowrap text-center text-[25px] font-bold leading-[28px] text-prussianBlue sm:text-[40px] sm:leading-[49px]'>
                Off-Plan Properties
              </h2>
              <div className='flex items-center gap-[6px]'>
                <div className='h-[5.62px] w-[31.84px] rounded-[21px] bg-prussianBlue' />
                <div className='h-[5.62px] w-[84.91px] rounded-[18px] bg-[#8D7C3B]' />
              </div>
            </div>
            <p className='w-full text-center text-[14px] font-normal leading-[24px] text-black sm:text-[19px] sm:leading-[30px]'>
              Discover verified off-plan projects with flexible payment plans,
              trusted developers, and clear handover timelines across Dubai.
            </p>
          </div>

          {loadError ? (
            <p className='mb-6 text-center text-sm text-red-600'>{loadError}</p>
          ) : null}

          {!filteredListings.length ? (
            <p className='py-12 text-center text-base text-black/60'>
              No off-plan listings are available yet. Check back soon.
            </p>
          ) : (
            <>
              <div className='hidden sm:grid grid-cols-1 items-stretch justify-items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3'>
                {paginatedListings.map((listing) => (
                  <div key={listing.id} className='flex h-full w-full min-h-0'>
                    <OffPlanPropertyCard
                      href={`/offplan/${listing.slug}`}
                      title={listing.title}
                      location={listing.location}
                      deliveryLabel={listing.deliveryLabel}
                      paymentPlanLabel={listing.paymentPlanLabel}
                      rating={listing.rating}
                      reviewCount={listing.reviewCount}
                      listingRef={listing.ref}
                      qrScanSrc={listing.qrScanSrc}
                      priceFrom={listing.priceFrom}
                      priceTo={listing.priceTo}
                      images={listing.images}
                      developerAvatar={listing.developerAvatar}
                      approvalBadge={listing.approvalBadge}
                      analytics={listing.analytics}
                      slug={listing.slug}
                      uuid={listing.uuid}
                      assetType={listing.assetType}
                      className='max-w-none'
                    />
                  </div>
                ))}
              </div>

              <div className='sm:hidden'>
                {mobileVisibleCard ? (
                  <>
                    {mobileListings.length > 1 ? (
                      <div className='mb-4 flex items-center justify-center gap-4'>
                        <button
                          type='button'
                          onClick={() => setMobileCardIndex((prev) => prev - 1)}
                          disabled={!canGoMobilePrev}
                          className='flex h-10 w-10 items-center justify-center rounded-sm [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] disabled:cursor-not-allowed disabled:opacity-40'
                          aria-label='Previous card'
                        >
                          <img
                            src='/icons/golden-arrow-previous.png'
                            alt=''
                            className='h-3 w-3'
                          />
                        </button>
                        <span className='text-[18px] font-medium text-prussianBlue'>
                          {mobileCardIndex + 1} / {mobileListings.length}
                        </span>
                        <button
                          type='button'
                          onClick={() => setMobileCardIndex((prev) => prev + 1)}
                          disabled={!canGoMobileNext}
                          className='flex h-10 w-10 items-center justify-center rounded-sm [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] disabled:cursor-not-allowed disabled:opacity-40'
                          aria-label='Next card'
                        >
                          <img
                            src='/icons/golden-arrow-previous.png'
                            alt=''
                            className='h-3 w-3 rotate-180'
                          />
                        </button>
                      </div>
                    ) : null}

                    <OffPlanPropertyCard
                      key={mobileVisibleCard.id}
                      href={`/offplan/${mobileVisibleCard.slug}`}
                      title={mobileVisibleCard.title}
                      location={mobileVisibleCard.location}
                      deliveryLabel={mobileVisibleCard.deliveryLabel}
                      paymentPlanLabel={mobileVisibleCard.paymentPlanLabel}
                      rating={mobileVisibleCard.rating}
                      reviewCount={mobileVisibleCard.reviewCount}
                      listingRef={mobileVisibleCard.ref}
                      qrScanSrc={mobileVisibleCard.qrScanSrc}
                      priceFrom={mobileVisibleCard.priceFrom}
                      priceTo={mobileVisibleCard.priceTo}
                      images={mobileVisibleCard.images}
                      developerAvatar={mobileVisibleCard.developerAvatar}
                      approvalBadge={mobileVisibleCard.approvalBadge}
                      analytics={mobileVisibleCard.analytics}
                      slug={mobileVisibleCard.slug}
                      uuid={mobileVisibleCard.uuid}
                      assetType={mobileVisibleCard.assetType}
                    />
                  </>
                ) : null}
              </div>
            </>
          )}

          {!showFullListing && filteredListings.length > 3 ? (
            <div className='mt-8 hidden justify-center sm:flex'>
              <button
                type='button'
                onClick={() => {
                  setShowFullListing(true)
                  setCurrentPage(1)
                  setMobileCardIndex(0)
                }}
                className='inline-flex h-11 min-w-[160px] items-center justify-center rounded-sm px-6 text-[18px] font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] transition-opacity hover:opacity-90'
              >
                View More
              </button>
            </div>
          ) : null}

          {showFullListing && totalPages > 1 ? (
            <div className='mt-8 flex justify-center'>
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page)
                  setMobileCardIndex(0)
                }}
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
