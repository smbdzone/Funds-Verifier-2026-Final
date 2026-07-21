'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { formatOffPlanPriceRange } from '@/constants/offPlanDummyListings'
import { getProfileImageSrc } from '@/utils/global-functions/global'

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
      className={`mx-auto flex w-full max-w-[404px] flex-col items-stretch self-stretch rounded-[5px] bg-white pb-4 shadow-[0px_0px_8px_rgba(0,0,0,0.15)] ${className}`}
    >
      <div className='flex w-full flex-col gap-3'>
        <div className='relative h-[275px] w-full overflow-hidden rounded-t-[5px]'>
          <Image
            src={imageList[activeImageIndex]}
            alt={title}
            width={414}
            height={275}
            className='h-[275px] w-full object-cover'
          />

          {paymentPlanLabel ? (
            <div className='absolute right-[10px] top-[10px] rounded-[2px] px-2 py-1 shadow-[0px_0px_8px_rgba(0,0,0,0.15)] [background:linear-gradient(90deg,#A2913E_0%,#D7C590_35.28%,#A2913E_68.99%,#D7C58F_100%)]'>
              <span className='text-[10px] font-medium leading-3 text-prussianBlue'>
                {paymentPlanLabel}
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

        <div className='flex w-full flex-col gap-5'>
          <div className='flex flex-col gap-3 px-4'>
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
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='flex items-center gap-2 text-[18px] font-medium leading-[26px] text-prussianBlue sm:text-xl sm:leading-6'>
                {qrScanSrc ? (
                  <Image
                    src={qrScanSrc}
                    width={36}
                    height={36}
                    alt='QR code'
                    className='h-9 w-9 shrink-0 rounded border border-gray-200 bg-white object-contain'
                    unoptimized
                  />
                ) : null}
                {title}
              </h3>

              <p className='text-[18px] leading-[26px] text-prussianBlue sm:text-base sm:leading-5'>{location}</p>

              <div className='flex items-center gap-2'>
                <span className='text-[18px] font-medium capitalize leading-[26px] text-prussianBlue sm:text-xl sm:leading-6'>
                  Ready:
                </span>
                <span className='text-[18px] font-medium leading-[26px] text-prussianBlue sm:text-xl sm:leading-6'>
                  {deliveryLabel}
                </span>
              </div>
            </div>
          </div>

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
    </article>
  )

  if (href) {
    return (
      <Link href={href} className='block transition-opacity hover:opacity-95'>
        {card}
      </Link>
    )
  }

  return card
}

export default OffPlanPropertyCard
