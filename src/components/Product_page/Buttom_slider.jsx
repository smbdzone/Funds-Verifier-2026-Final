'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FaStar } from 'react-icons/fa'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import location from '@/assets/vector2.svg'
import {
  formatCardPrice,
  formatListingCardPrice,
} from '@/libs/listingPriceDisplay'
import {
  getListingCardImageSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingDetailId } from '@/libs/listingSlug'
import { getListingRef } from '@/libs/listingRef'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import { isOffPlanListing } from '@/libs/filterMyListingTab'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'

function truncateTitle(title) {
  const text = String(title || '').trim()
  if (!text) return 'Listing'
  const words = text.split(/\s+/)
  return words.length > 4 ? `${words.slice(0, 4).join(' ')}...` : text
}

function ucFirst(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getListingHref(listing) {
  const id = getListingDetailId(listing)
  if (!id) return '#'

  const assetType = String(listing?.assetType || '')
  if (isOffPlanListing(listing) || /off plan/i.test(assetType)) {
    return `/offplan/${id}`
  }
  if (/car/i.test(assetType)) return `/car/${id}`
  if (/boat/i.test(assetType)) return `/boat/${id}`
  if (/jewel/i.test(assetType)) return `/jewelry/${id}`
  return `/property/${id}`
}

function getTypeLabel(listing) {
  const assetType = String(listing?.assetType || '')
  if (isOffPlanListing(listing) || /off plan/i.test(assetType)) {
    return 'Off Plan'
  }
  if (/car/i.test(assetType)) {
    return listing?.carType ? ucFirst(listing.carType) : 'Car For Sale'
  }
  if (/boat/i.test(assetType)) {
    return listing?.condition
      ? String(listing.condition)
      : 'Boats For Sale'
  }
  if (/jewel/i.test(assetType)) {
    return listing?.category ? ucFirst(listing.category) : 'Jewellery For Sale'
  }
  if (listing?.propertyType) {
    const lease = /lease/i.test(assetType)
    return `${ucFirst(listing.propertyType)} ${lease ? 'For Lease' : 'For Sale'}`
  }
  return ucFirst(assetType) || 'Property'
}

function getLocationLabel(listing) {
  return (
    listing?.neighbourhood ||
    listing?.city ||
    listing?.locateBoat ||
    listing?.locateJewelry ||
    ''
  )
}

function getReviewCount(listing) {
  const count = listing?.reviewCount ?? listing?.reviewCounts ?? 0
  return Number(count) || 0
}

const ButtomSlider = ({ data }) => {
  const swiperRef = useRef(null)
  const products = Array.isArray(data?.products) ? data.products : []

  const handlePrevSlide = () => {
    swiperRef.current?.swiper?.slidePrev()
  }

  const handleNextSlide = () => {
    swiperRef.current?.swiper?.slideNext()
  }

  if (!products.length) return null

  return (
    <div className='lg:px-10'>
      <div className='relative flex flex-col items-center md:flex-row'>
        <div className='flex gap-x-3 sm:block'>
          <button
            type='button'
            onClick={handlePrevSlide}
            className='btn-gradient z-40 -rotate-90 cursor-pointer rounded px-1 py-1 sm:px-2 md:absolute md:top-[50%] -left-3 lg:-left-2 xl:-left-12'
            aria-label='Previous listings'
          >
            <IoIosArrowUp className='ArrowDown text-base md:text-lg' />
          </button>
          <button
            type='button'
            onClick={handleNextSlide}
            className='btn-gradient z-40 -rotate-90 cursor-pointer rounded px-1 py-1 sm:px-2 md:absolute md:top-[50%] -right-3 lg:-right-2 xl:-right-12'
            aria-label='Next listings'
          >
            <IoIosArrowDown className='ArrowDown text-base md:text-lg' />
          </button>
        </div>

        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 14 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
          }}
          modules={[Pagination]}
          ref={swiperRef}
          className='listing-cards-swiper w-full'
        >
          {products.map((listing, index) => {
            const imageSrc = getListingCardImageSrc(listing)
            const href = getListingHref(listing)
            const rating = Number(listing?.averageRating || 0)
            const reviewCount = getReviewCount(listing)

            return (
              <SwiperSlide
                key={listing.uuid || listing.slug || index}
                className='listing-card-slide !h-auto w-full'
              >
                <div className='listing-card mx-1 my-1 h-full w-full rounded-md bg-white'>
                  {imageSrc ? (
                    <div className='relative !h-[275px] w-full shrink-0 overflow-hidden rounded-md'>
                      <Image
                        width={414}
                        height={275}
                        className='listing-card-photo h-full w-full rounded-md object-cover object-center'
                        alt={listing.title || 'Listing'}
                        src={imageSrc}
                      />
                    </div>
                  ) : (
                    <div className='flex !h-[275px] w-full shrink-0 items-center justify-center rounded-md bg-[#f0f4f8]'>
                      <Image
                        width={64}
                        height={64}
                        src={PLACEHOLDER}
                        alt='No photo'
                        className='opacity-40'
                      />
                    </div>
                  )}

                  <div className='listing-card-body w-full'>
                    <div className='flex flex-1 flex-col space-y-3 px-4 py-2'>
                      <div className='flex w-full flex-row flex-wrap items-center gap-x-3 gap-y-1'>
                        <div className='rating-container'>
                          <div className='flex flex-row items-center'>
                            {Array.from({ length: 5 }, (_, starIndex) => (
                              <div key={starIndex} className='h-5 w-5'>
                                <FaStar
                                  size={20}
                                  color={
                                    starIndex < rating ? '#e1ba00' : '#D3D3D3'
                                  }
                                />
                              </div>
                            ))}
                            <div className='ml-2 text-xs opacity-[50%] md:text-base'>
                              {rating ? rating.toFixed(1) : '0.0'}
                            </div>
                          </div>
                        </div>
                        <div className='text-xs opacity-[50%] md:text-base'>
                          {reviewCount > 1
                            ? `(${reviewCount} Reviews)`
                            : `(${reviewCount || 0} Review)`}
                        </div>
                        <div className='ml-auto'>
                          <ListingCardViewCount listing={listing} />
                        </div>
                      </div>

                      <div className='listing-card-meta flex w-full items-start justify-between gap-3'>
                        <div className='flex min-w-0 flex-1 flex-col items-start gap-1 text-left'>
                          <Link
                            href={href}
                            className='listing-card-title block w-full break-words text-left text-sm font-medium capitalize text-[#002D4F] md:text-xl'
                          >
                            {truncateTitle(listing.title) || getTypeLabel(listing)}
                          </Link>
                          <p className='listing-card-type w-full text-left text-xs capitalize text-[#002D4F] opacity-70 md:text-sm'>
                            {getTypeLabel(listing)}
                          </p>
                          {getLocationLabel(listing) ? (
                            <div className='flex w-full flex-row items-start justify-start space-x-2 text-base text-[#002D4F]'>
                              <div className='inline-block w-3.5 shrink-0'>
                                <Image
                                  width={20}
                                  height={20}
                                  alt=''
                                  src={location.src}
                                />
                              </div>
                              <div className='listing-card-location min-w-0 break-words text-xs md:text-base'>
                                {getLocationLabel(listing)}
                              </div>
                            </div>
                          ) : (
                            <div className='flex w-full flex-row items-start justify-start space-x-2 text-base text-[#002D4F]'>
                              <div className='inline-block w-3.5 shrink-0'>
                                <Image
                                  width={20}
                                  height={20}
                                  alt=''
                                  src={location.src}
                                />
                              </div>
                              <div className='listing-card-location min-w-0 break-words text-xs md:text-base'>
                                —
                              </div>
                            </div>
                          )}
                        </div>
                        <ListingCardQrThumb listing={listing} size={72} className='ml-auto shrink-0' />
                      </div>
                    </div>

                    <div className='listing-card-footer'>
                      <div className='box-border my-3 h-0.5 w-full border-t-[2px] border-solid border-[#969696]' />
                      <div className='flex flex-row items-center justify-between px-5 pb-4'>
                        <div className='flex flex-row items-center gap-4'>
                          <div className='flex h-[50px] w-[50px]'>
                            <Image
                              width={50}
                              height={50}
                              className='object-cover'
                              alt=''
                              src={getProfileImageSrc(
                                listing?.sellerAvatar ||
                                  listing?.userId?.profileImage,
                              )}
                              unoptimized
                            />
                          </div>
                          <div className='text-xs font-medium text-[#000000] md:text-sm lg:text-base'>
                            Ref: {getListingRef(listing)}
                          </div>
                        </div>
                        <div className='text-xs font-semibold text-[#000000] md:text-sm lg:text-lg'>
                          AED{' '}
                          {isOffPlanListing(listing)
                            ? formatListingCardPrice(listing)
                            : formatCardPrice(listing.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ButtomSlider
