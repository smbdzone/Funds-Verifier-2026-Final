'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { formatOffPlanPriceRange } from '@/constants/offPlanDummyListings'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'

const OffPlanPropertyCard = ({
  title,
  qrScanSrc,
  location,
  deliveryLabel,
  paymentPlanLabel,
  rating = 0,
  reviewCount = 0,
  listingRef,
  priceFrom,
  priceTo,
  priceLabel,
  images = [],
  developerAvatar = '/assets/images/profile-01.jpg',
  href,
  className = '',
  /** Same as other listings: Approved / Featured / Recommended after Super Admin approve */
  approvalBadge = 'Approved',
  /** Optional analytics for view count ({ clicks, impressions }) */
  analytics = null,
}) => {
  const imageList = useMemo(
    () => (Array.isArray(images) && images.length ? images : ['/assets/images/property.jpg']),
    [images],
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const displayPrice =
    priceLabel || formatOffPlanPriceRange(priceFrom, priceTo)
  const roundedRating = Number(rating || 0).toFixed(1)
  const reviewLabel =
    reviewCount === 1 ? '(1 Review)' : `(${reviewCount || 0} Reviews)`
  const viewListing = {
    analytics: {
      clicks: Number(analytics?.clicks) || 0,
      impressions: Number(analytics?.impressions) || 0,
    },
  }

  const goPrev = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1,
    )
  }

  const goNext = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1,
    )
  }

  const card = (
    <article
      className={`listing-card mx-auto flex h-full w-full max-w-[404px] flex-col items-stretch self-stretch overflow-visible rounded-[5px] bg-white pb-4 ${className}`}
    >
      <div className='listing-card-body flex h-full w-full flex-1 flex-col gap-3'>
        <div className='relative h-[275px] w-full shrink-0 overflow-hidden rounded-t-[5px]'>
          <Image
            src={imageList[activeImageIndex]}
            alt={title}
            width={414}
            height={275}
            className='h-[275px] w-full object-cover'
          />

          {String(paymentPlanLabel || '').trim() ? (
            <div className='absolute right-[10px] top-[10px] rounded-[2px] px-2 py-1 shadow-[0px_0px_8px_rgba(0,0,0,0.15)] [background:linear-gradient(90deg,#A2913E_0%,#D7C590_35.28%,#A2913E_68.99%,#D7C58F_100%)]'>
              <span className='text-[10px] font-medium leading-3 text-prussianBlue'>
                {String(paymentPlanLabel).trim()}
              </span>
            </div>
          ) : null}

          {imageList.length > 1 ? (
            <>
              <button
                type='button'
                onClick={goPrev}
                aria-label='Previous image'
                className='absolute left-3 top-1/2 flex h-[51px] w-[51px] -translate-y-1/2 items-center justify-center rounded-[3px] [background:linear-gradient(90deg,#A2913E_0%,#D7C590_35.28%,#A2913E_68.99%,#D7C58F_100%)]'
              >
                <Image
                  src='/icons/golden-arrow-previous.png'
                  alt=''
                  width={10}
                  height={13}
                />
              </button>
              <button
                type='button'
                onClick={goNext}
                aria-label='Next image'
                className='absolute right-3 top-1/2 flex h-[51px] w-[51px] -translate-y-1/2 items-center justify-center rounded-[3px] [background:linear-gradient(90deg,#A2913E_0%,#D7C590_35.28%,#A2913E_68.99%,#D7C58F_100%)]'
              >
                <Image
                  src='/icons/golden-arrow-previous.png'
                  alt=''
                  width={10}
                  height={13}
                  className='rotate-180'
                />
              </button>
            </>
          ) : null}
        </div>

        <div className='flex w-full flex-1 flex-col'>
          <div className='flex flex-1 flex-col gap-3 px-4 pb-3'>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
              <div className='flex shrink-0 items-end gap-[5px]'>
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    size={18}
                    color={
                      index < Math.round(Number(rating || 0))
                        ? '#E7AD01'
                        : '#D3D3D3'
                    }
                  />
                ))}
              </div>
              <span className='whitespace-nowrap text-[18px] leading-[24px] text-black/50'>
                {roundedRating}
              </span>
              <span className='text-[18px] leading-[24px] text-black/50'>
                {reviewLabel}
              </span>
              <div className='ml-auto'>
                <ListingCardViewCount listing={viewListing} />
              </div>
            </div>

            <div className='listing-card-meta flex w-full min-h-[132px] items-start justify-between gap-3'>
              <div className='flex min-w-0 flex-1 flex-col items-start gap-2 text-left break-words'>
                <h3 className='listing-card-title line-clamp-2 min-h-[52px] w-full break-words text-left text-[18px] font-medium leading-[26px] text-prussianBlue sm:min-h-[48px] sm:text-xl sm:leading-6'>
                  {title}
                </h3>

                {location ? (
                  <p className='listing-card-location flex w-full min-h-[52px] items-start gap-1.5 break-words text-left text-[18px] leading-[26px] text-prussianBlue sm:min-h-[40px] sm:text-base sm:leading-5'>
                    <FaMapMarkerAlt
                      className='mt-1 shrink-0 text-reefGold'
                      size={16}
                      aria-hidden
                    />
                    <span className='line-clamp-2 min-w-0 break-words'>{location}</span>
                  </p>
                ) : (
                  <p className='min-h-[52px] sm:min-h-[40px]' aria-hidden='true' />
                )}

                <div className='flex min-h-[26px] w-full items-center justify-start gap-2 sm:min-h-[24px]'>
                  {deliveryLabel ? (
                    <>
                      <span className='text-[18px] font-medium capitalize leading-[26px] text-prussianBlue sm:text-xl sm:leading-6'>
                        Ready:
                      </span>
                      <span className='text-[18px] font-medium leading-[26px] text-prussianBlue sm:text-xl sm:leading-6'>
                        {deliveryLabel}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              {qrScanSrc ? (
                <Image
                  src={qrScanSrc}
                  width={72}
                  height={72}
                  alt='QR code'
                  className='listing-qr-thumb ml-auto h-[72px] w-[72px] shrink-0 rounded border border-gray-200 bg-white object-contain'
                  unoptimized
                />
              ) : (
                <div className='ml-auto h-[72px] w-[72px] shrink-0' aria-hidden='true' />
              )}
            </div>
          </div>

          <div className='listing-card-footer mt-auto flex flex-col gap-5'>
            <div className='h-0 w-full border-t-2 border-[#969696]' />

            <div className='flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='relative h-[70px] w-[78px] shrink-0 overflow-hidden'>
                  <Image
                    src={getProfileImageSrc(developerAvatar)}
                    alt='Seller'
                    width={78}
                    height={70}
                    className='h-[70px] w-[78px] object-cover'
                    unoptimized
                  />
                </div>
                <span className='text-[18px] font-medium leading-[24px] text-black sm:text-lg sm:leading-[22px]'>
                  Ref: {listingRef}
                </span>
              </div>

              <span className='text-right text-[18px] font-medium leading-[24px] text-black sm:shrink-0 sm:text-lg sm:leading-[22px]'>
                {displayPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )

  if (href) {
    return (
      <Link href={href} className='flex h-full w-full transition-opacity hover:opacity-95'>
        {card}
      </Link>
    )
  }

  return card
}

export default OffPlanPropertyCard
