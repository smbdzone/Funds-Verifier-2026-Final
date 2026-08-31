'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Banner } from '@/components/modules/Banner'
import OffPlanPropertyCard from '@/components/offplan/OffPlanPropertyCard'
import OffPlanPageSkeleton from '@/components/offplan/OffPlanPageSkeleton'
import { fetchApprovedOffPlanListings } from '@/libs/offPlanListings'

const GOLD_GRADIENT =
  '[background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]'
const ABOVE_TABLET_STEP = 2
const DESKTOP_STEP = 3

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

function OffPlanCardItem({ listing }) {
  return (
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
      listing={listing.listing}
      className='max-w-none'
    />
  )
}

export default function OffPlanPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [mobileCardIndex, setMobileCardIndex] = useState(0)
  const [aboveTabletVisible, setAboveTabletVisible] = useState(ABOVE_TABLET_STEP)
  const [desktopVisible, setDesktopVisible] = useState(DESKTOP_STEP)

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

  useEffect(() => {
    setMobileCardIndex(0)
    setAboveTabletVisible(ABOVE_TABLET_STEP)
    setDesktopVisible(DESKTOP_STEP)
  }, [country, city, minPrice, maxPrice, filteredListings.length])

  if (isLoading) {
    return <OffPlanPageSkeleton />
  }

  const mobileVisibleCard = filteredListings[mobileCardIndex]
  const canGoMobilePrev = mobileCardIndex > 0
  const canGoMobileNext = mobileCardIndex < filteredListings.length - 1

  const aboveTabletData = filteredListings.slice(0, aboveTabletVisible)
  const hasMoreAboveTablet = aboveTabletVisible < filteredListings.length

  const desktopData = filteredListings.slice(0, desktopVisible)
  const hasMoreDesktop = desktopVisible < filteredListings.length

  return (
    <>
      <Banner title='Off Plan Properties' />

      <section className='bg-white py-8 sm:py-12 md:py-16 lg:py-20'>
        <div className='theme-container mx-auto px-4 sm:px-6'>
          <div className='mx-auto mb-6 flex w-full max-w-[670px] flex-col items-center gap-4 text-center lg:mb-8 lg:gap-5'>
            <div className='flex w-full flex-col items-center gap-[14px]'>
              <h2 className='w-full text-center text-[22px] font-bold leading-[28px] text-prussianBlue sm:text-[28px] sm:leading-[34px] lg:text-[40px] lg:leading-[49px]'>
                Off-Plan Properties
              </h2>
              <div className='flex items-center gap-[6px]'>
                <div className='h-[5.62px] w-[31.84px] rounded-[21px] bg-prussianBlue' />
                <div className='h-[5.62px] w-[84.91px] rounded-[18px] bg-[#8D7C3B]' />
              </div>
            </div>
            <p className='w-full text-center text-[13px] font-normal leading-[20px] text-black sm:text-[15px] sm:leading-[24px] lg:text-[19px] lg:leading-[30px]'>
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
              {/* Mobile: 1 small card + arrows */}
              <div className='md:hidden'>
                {mobileVisibleCard ? (
                  <>
                    {filteredListings.length > 1 ? (
                      <div className='mb-3 flex items-center justify-center gap-3'>
                        <button
                          type='button'
                          onClick={() => setMobileCardIndex((prev) => prev - 1)}
                          disabled={!canGoMobilePrev}
                          className={`flex h-8 w-8 items-center justify-center rounded-sm disabled:cursor-not-allowed disabled:opacity-40 ${GOLD_GRADIENT}`}
                          aria-label='Previous card'
                        >
                          <img
                            src='/icons/golden-arrow-previous.png'
                            alt=''
                            className='h-2.5 w-2.5'
                          />
                        </button>
                        <span className='text-sm font-medium text-prussianBlue'>
                          {mobileCardIndex + 1} / {filteredListings.length}
                        </span>
                        <button
                          type='button'
                          onClick={() => setMobileCardIndex((prev) => prev + 1)}
                          disabled={!canGoMobileNext}
                          className={`flex h-8 w-8 items-center justify-center rounded-sm disabled:cursor-not-allowed disabled:opacity-40 ${GOLD_GRADIENT}`}
                          aria-label='Next card'
                        >
                          <img
                            src='/icons/golden-arrow-previous.png'
                            alt=''
                            className='h-2.5 w-2.5 rotate-180'
                          />
                        </button>
                      </div>
                    ) : null}

                    <div className='mx-auto w-full max-w-[320px] sm:max-w-[360px]'>
                      <OffPlanCardItem listing={mobileVisibleCard} />
                    </div>
                  </>
                ) : null}
              </div>

              {/* Tablet / big tablet (incl. 1024): 2 cards + See more */}
              <div className='hidden grid-cols-2 items-stretch justify-items-stretch gap-4 md:grid xl:hidden md:gap-5'>
                {aboveTabletData.map((listing) => (
                  <div key={listing.id} className='flex h-full w-full min-h-0'>
                    <OffPlanCardItem listing={listing} />
                  </div>
                ))}
              </div>

              {hasMoreAboveTablet ? (
                <div className='mt-8 hidden justify-center md:flex xl:hidden'>
                  <button
                    type='button'
                    onClick={() =>
                      setAboveTabletVisible((count) =>
                        Math.min(count + ABOVE_TABLET_STEP, filteredListings.length),
                      )
                    }
                    className={`inline-flex h-10 min-w-[140px] items-center justify-center rounded-sm px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 ${GOLD_GRADIENT}`}
                  >
                    See more
                  </button>
                </div>
              ) : null}

              {/* Above big tablet (1280+): 3 cards + See more */}
              <div className='hidden items-stretch justify-items-stretch gap-6 xl:grid xl:grid-cols-3'>
                {desktopData.map((listing) => (
                  <div key={listing.id} className='flex h-full w-full min-h-0'>
                    <OffPlanCardItem listing={listing} />
                  </div>
                ))}
              </div>

              {hasMoreDesktop ? (
                <div className='mt-8 hidden justify-center xl:flex'>
                  <button
                    type='button'
                    onClick={() =>
                      setDesktopVisible((count) =>
                        Math.min(count + DESKTOP_STEP, filteredListings.length),
                      )
                    }
                    className={`inline-flex h-11 min-w-[160px] items-center justify-center rounded-sm px-6 text-[18px] font-medium text-white transition-opacity hover:opacity-90 ${GOLD_GRADIENT}`}
                  >
                    See more
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  )
}
