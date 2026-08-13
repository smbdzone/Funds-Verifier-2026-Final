'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'
import { formatOffPlanPriceRange } from '@/constants/offPlanDummyListings'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'

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
  slug = '',
  uuid = '',
  assetType = 'Property Off Plan For Sale',
}) => {
  const mediaList = useMemo(() => {
    if (!Array.isArray(images) || !images.length) {
      return [{ type: 'image', src: '/assets/images/property.jpg' }]
    }
    return images.map((item) => {
      if (typeof item === 'string') return { type: 'image', src: item }
      if (item?.src) {
        return {
          type: item.type === 'video' ? 'video' : 'image',
          src: item.src,
        }
      }
      return { type: 'image', src: '/assets/images/property.jpg' }
    })
  }, [images])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const activeSlide =
    mediaList[Math.min(activeImageIndex, mediaList.length - 1)] || mediaList[0]

  const displayPrice =
    priceLabel || formatOffPlanPriceRange(priceFrom, priceTo)
  const roundedRating = Number(rating || 0).toFixed(1)
  const reviewLabel =
    reviewCount === 1 ? '(1 Review)' : `(${reviewCount || 0} Reviews)`
  const viewListing = {
    title,
    slug,
    uuid,
    assetType,
    analytics: {
      clicks: Number(analytics?.clicks) || 0,
      impressions: Number(analytics?.impressions) || 0,
    },
  }

  const goPrev = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveImageIndex((prev) =>
      prev === 0 ? mediaList.length - 1 : prev - 1,
    )
  }

  const goNext = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setActiveImageIndex((prev) =>
      prev === mediaList.length - 1 ? 0 : prev + 1,
    )
  }

  const stopCardNavigation = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const card = (
    <article
      className={`listing-card mx-auto flex h-full w-full max-w-[320px] flex-col items-stretch self-stretch overflow-visible rounded-[5px] bg-white pb-3 lg:max-w-[404px] lg:pb-4 ${className}`}
    >
      <div className='listing-card-body flex h-full w-full flex-1 flex-col gap-2 lg:gap-3'>
        <div className='relative h-[190px] w-full shrink-0 overflow-hidden rounded-t-[5px] sm:h-[210px] lg:h-[275px]'>
          {activeSlide?.type === 'video' ? (
            <video
              className='listing-card-photo h-full w-full bg-black object-cover object-center'
              src={activeSlide.src}
              controls
              playsInline
              preload='metadata'
              onClick={stopCardNavigation}
              onPointerDown={stopCardNavigation}
            />
          ) : (
            <Image
              src={activeSlide?.src || '/assets/images/property.jpg'}
              alt={title}
              width={414}
              height={275}
              className='listing-card-photo h-full w-full object-cover object-center'
            />
          )}

          {String(paymentPlanLabel || '').trim() ? (
            <div className='absolute right-2 top-2 rounded-[2px] px-1.5 py-0.5 shadow-[0px_0px_8px_rgba(0,0,0,0.15)] [background:linear-gradient(90deg,#A2913E_0%,#D7C590_35.28%,#A2913E_68.99%,#D7C58F_100%)] lg:right-[10px] lg:top-[10px] lg:px-2 lg:py-1'>
              <span className='text-[9px] font-medium leading-3 text-prussianBlue lg:text-[10px]'>
                {String(paymentPlanLabel).trim()}
              </span>
            </div>
          ) : null}

          {mediaList.length > 1 ? (
            <>
              <button
                type='button'
                onClick={goPrev}
                aria-label='Previous media'
                className='absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[3px] [background:linear-gradient(90deg,#A2913E_0%,#D7C590_35.28%,#A2913E_68.99%,#D7C58F_100%)] lg:left-3 lg:h-[51px] lg:w-[51px]'
              >
                <Image
                  src='/icons/golden-arrow-previous.png'
                  alt=''
                  width={10}
                  height={13}
                  className='h-2.5 w-auto lg:h-[13px]'
                />
              </button>
              <button
                type='button'
                onClick={goNext}
                aria-label='Next media'
                className='absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[3px] [background:linear-gradient(90deg,#A2913E_0%,#D7C590_35.28%,#A2913E_68.99%,#D7C58F_100%)] lg:right-3 lg:h-[51px] lg:w-[51px]'
              >
                <Image
                  src='/icons/golden-arrow-previous.png'
                  alt=''
                  width={10}
                  height={13}
                  className='h-2.5 w-auto rotate-180 lg:h-[13px]'
                />
              </button>
            </>
          ) : null}
        </div>

        <div className='flex w-full flex-1 flex-col'>
          <div className='flex flex-1 flex-col gap-2 px-3 pb-2 lg:gap-3 lg:px-4 lg:pb-3'>
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 lg:gap-x-3'>
              <div className='flex shrink-0 items-end gap-[3px] lg:gap-[5px]'>
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    size={14}
                    className='lg:hidden'
                    color={
                      index < Math.round(Number(rating || 0))
                        ? '#E7AD01'
                        : '#D3D3D3'
                    }
                  />
                ))}
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={`lg-${index}`}
                    size={18}
                    className='hidden lg:inline'
                    color={
                      index < Math.round(Number(rating || 0))
                        ? '#E7AD01'
                        : '#D3D3D3'
                    }
                  />
                ))}
              </div>
              <span className='whitespace-nowrap text-xs leading-5 text-black/50 lg:text-[18px] lg:leading-[24px]'>
                {roundedRating}
              </span>
              <span className='text-xs leading-5 text-black/50 lg:text-[18px] lg:leading-[24px]'>
                {reviewLabel}
              </span>
              <div className='ml-auto scale-90 origin-right lg:scale-100'>
                <ListingCardViewCount listing={viewListing} />
              </div>
            </div>

            <div className='listing-card-meta flex w-full min-h-0 items-start justify-between gap-2 lg:min-h-[132px] lg:gap-3'>
              <div className='flex min-w-0 flex-1 flex-col items-start gap-1.5 text-left break-words lg:gap-2'>
                <h3 className='listing-card-title line-clamp-2 min-h-[40px] w-full break-words text-left text-sm font-medium leading-5 text-prussianBlue lg:min-h-[48px] lg:text-xl lg:leading-6'>
                  {title}
                </h3>

                {location ? (
                  <p className='listing-card-location flex w-full min-h-[36px] items-start gap-1 break-words text-left text-xs leading-4 text-prussianBlue lg:min-h-[40px] lg:gap-1.5 lg:text-base lg:leading-5'>
                    <FaMapMarkerAlt
                      className='mt-0.5 shrink-0 text-reefGold lg:mt-1'
                      size={12}
                      aria-hidden
                    />
                    <span className='line-clamp-2 min-w-0 break-words'>{location}</span>
                  </p>
                ) : (
                  <p className='min-h-[36px] lg:min-h-[40px]' aria-hidden='true' />
                )}

                <div className='flex min-h-[20px] w-full items-center justify-start gap-1.5 lg:min-h-[24px] lg:gap-2'>
                  {deliveryLabel ? (
                    <>
                      <span className='text-xs font-medium capitalize leading-4 text-prussianBlue lg:text-xl lg:leading-6'>
                        Ready:
                      </span>
                      <span className='text-xs font-medium leading-4 text-prussianBlue lg:text-xl lg:leading-6'>
                        {deliveryLabel}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <ListingCardQrThumb
                listing={viewListing}
                src={qrScanSrc || undefined}
                size={72}
                className='ml-auto shrink-0'
              />
            </div>
          </div>

          <div className='listing-card-footer mt-auto flex flex-col gap-3 lg:gap-5'>
            <div className='h-0 w-full border-t border-[#969696] lg:border-t-2' />

            <div className='flex flex-col gap-2 px-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 lg:gap-4 lg:px-4'>
              <div className='flex min-w-0 items-center gap-2 lg:gap-3'>
                <div className='relative h-12 w-14 shrink-0 overflow-hidden lg:h-[70px] lg:w-[78px]'>
                  <Image
                    src={getProfileImageSrc(developerAvatar)}
                    alt='Seller'
                    width={78}
                    height={70}
                    className='listing-card-photo h-full w-full object-cover object-center'
                    unoptimized
                  />
                </div>
                <span className='text-xs font-medium leading-4 text-black lg:text-lg lg:leading-[22px]'>
                  Ref: {listingRef}
                </span>
              </div>

              <span className='text-right text-xs font-medium leading-4 text-black sm:shrink-0 lg:text-lg lg:leading-[22px]'>
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
