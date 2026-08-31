'use client'

import React, { useMemo, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'
import { formatCardPrice, formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { ucFirst } from '@/utils'
import {
  getListingCardImageSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingRef } from '@/libs/listingRef'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import location from '@/assets/vector2.svg'
import arrow_right from '@/assets/vector1.svg'
import { isOffPlanListing } from '@/libs/filterMyListingTab'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'
import { useAppContext } from '@/context/AppContext'
import PrivateListingGate from '@/components/shared/PrivateListingGate'

function isYes(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase() === 'yes'
}

function getProducts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

function filterApprovedForSale(products) {
  if (!Array.isArray(products)) return []
  return products.filter((item) => {
    if (Number(item?.status) !== 1) return false
    if (isOffPlanListing(item)) return false

    const assetType = String(item?.assetType || '').toLowerCase()
    const forSale =
      isYes(item?.propertyForSale) || assetType.includes('for sale')
    const leaseOnly =
      isYes(item?.propertyForLease) &&
      !forSale &&
      assetType.includes('for lease')

    return forSale && !leaseOnly
  })
}

function truncateTitle(title) {
  if (!title) return 'Property'
  return String(title)
}

export default function PropertySaleSlider() {
  const { propertiesForSale } = useAppContext()
  const swiperRef = useRef(null)

  const approvedProperties = useMemo(
    () => filterApprovedForSale(getProducts(propertiesForSale)),
    [propertiesForSale],
  )

  const handlePrevSlide = () => {
    swiperRef.current?.swiper?.slidePrev()
  }

  const handleNextSlide = () => {
    swiperRef.current?.swiper?.slideNext()
  }

  const hasListings = approvedProperties.length > 0

  return (
    <div className='container w-full mx-auto'>
      <div className='mb-3 sm:mb-0'>
        <div className='relative flex justify-between items-center'>
          <div className='md:text-4xl lg:text-5xl text-xl text-[#002D4F] text-center font-semibold w-full'>
            Verified Properties for Sale
          </div>
        </div>
        <div className='flex flex-row md:my-5 my-2 w-full justify-center gap-2'>
          <div className='rounded-2xl bg-[#002D4F] md:w-[31.8px] w-5 h-[5.6px]' />
          <div className='rounded-lg bg-[#8D7C3B] md:w-[84.9px] w-12 h-[5.6px]' />
        </div>
        <div className='flex leading-[30px] text-black justify-center mb-2 sm:mb-5'>
          <p className='xl:w-[35%] lg:w-[50%] md:px-5 text-xs text-center'>
            Browse evaluator-approved properties listed for sale on Funds
            Verifier.
          </p>
        </div>

        {hasListings ? (
          <div className='flex justify-center md:hidden space-x-2'>
            <div onClick={handlePrevSlide} className='cursor-pointer'>
              <div className='btn-gradient px-1 py-1 rounded'>
                <Image
                  src={arrow_right}
                  alt='previous'
                  height={15}
                  width={15}
                  className='transform rotate-180 w-[10px] h-[10px]'
                />
              </div>
            </div>
            <div onClick={handleNextSlide} className='cursor-pointer'>
              <div className='btn-gradient px-1 py-1 rounded'>
                <Image
                  src={arrow_right}
                  alt='next'
                  height={15}
                  width={15}
                  className='transform w-[10px] h-[10px]'
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {!hasListings ? (
        <p className='text-center text-sm text-[#002D4F]/70 py-12'>
          No evaluator-approved properties for sale yet.
        </p>
      ) : (
        <div className='home-listing-slider-row relative flex flex-col items-center overflow-visible md:flex-row'>
          <div className='hidden md:block space-x-5 pb-5'>
            <div
              onClick={handlePrevSlide}
              className='cursor-pointer md:absolute md:top-[50%] lg:-left-10 md:-left-7 z-40'
            >
              <div className='btn-gradient px-2 py-1 rounded'>
                <Image
                  src={arrow_right}
                  alt='previous'
                  height={20}
                  width={20}
                  className='transform h-full w-full rotate-180'
                />
              </div>
            </div>
            <div
              onClick={handleNextSlide}
              className='cursor-pointer md:absolute md:top-[50%] lg:-right-10 md:-right-7 z-40'
            >
              <div className='btn-gradient px-2 py-1 rounded'>
                <Image
                  src={arrow_right}
                  height={20}
                  width={20}
                  className='h-full w-full'
                  alt='next'
                />
              </div>
            </div>
          </div>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            loop={approvedProperties.length > 1}
            hashNavigation={{ watchState: true }}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              900: {
                slidesPerView: 2,
                spaceBetween: 14,
              },
              1400: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
            }}
            className='listing-cards-swiper w-full'
            ref={swiperRef}
          >
            {approvedProperties.map((propertyForSale) => {
              const imageSrc = getListingCardImageSrc(propertyForSale)

              return (
                <SwiperSlide className='listing-card-slide !h-auto w-full' key={propertyForSale.uuid}>
                  <PrivateListingGate listing={propertyForSale}>
                  <div className='listing-card mx-1 my-1 h-full w-full rounded-md bg-white'>
                    {imageSrc ? (
                      <div className='listing-card-image relative h-[190px] w-full shrink-0 overflow-hidden rounded-md md:h-[240px] lg:h-[275px]'>
                        <Image
                          className='listing-card-photo h-full w-full rounded-md object-cover object-center'
                          alt={propertyForSale.title || 'Property'}
                          src={imageSrc}
                          width={414}
                          height={275}
                        />
                      </div>
                    ) : (
                      <div className='listing-card-image flex h-[190px] w-full shrink-0 items-center justify-center rounded-md bg-[#f0f4f8] md:h-[240px] lg:h-[275px]'>
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
                            <div className='flex flex-row items-end'>
                              {Array.from({ length: 5 }, (_, starIndex) => (
                                <div key={starIndex} className='h-5 w-5'>
                                  <FaStar
                                    size={20}
                                    color={
                                      starIndex <
                                        Number(propertyForSale.averageRating || 0)
                                        ? '#e1ba00'
                                        : '#D3D3D3'
                                    }
                                  />
                                </div>
                              ))}
                              <div className='opacity-[50%] ml-2 md:text-base text-xs'>
                                {propertyForSale.averageRating
                                  ? parseFloat(
                                    propertyForSale.averageRating,
                                  ).toFixed(1)
                                  : '0.0'}
                              </div>
                            </div>
                          </div>
                          <div className='opacity-[50%] md:text-base text-xs'>
                            {propertyForSale.reviewCount > 1
                              ? `(${propertyForSale.reviewCount} Reviews)`
                              : `(${propertyForSale.reviewCount || 0} Review)`}
                          </div>
                          <div className='ml-auto'>
                            <ListingCardViewCount listing={propertyForSale} />
                          </div>
                        </div>
                        <div className='listing-card-meta flex w-full items-start justify-between gap-3'>
                          <div className='flex min-w-0 flex-1 flex-col items-start gap-1 text-left'>
                            <Link
                              href={`/property/${propertyForSale.slug || propertyForSale.uuid}`}
                              className='listing-card-title block w-full break-words text-left text-[#002D4F] md:text-xl text-sm font-medium capitalize'
                            >
                              {truncateTitle(propertyForSale.title)}
                            </Link>
                            {propertyForSale.propertyType ? (
                              <p className='listing-card-type w-full text-left text-[#002D4F] opacity-70 md:text-sm text-xs capitalize'>
                                {ucFirst(propertyForSale.propertyType)} For Sale
                              </p>
                            ) : null}
                            <div className='flex w-full flex-row items-start justify-start space-x-2 text-base text-[#002D4F]'>
                              <div className='inline-block w-3.5 shrink-0'>
                                <Image
                                  width={20}
                                  height={20}
                                  alt=''
                                  src={location.src}
                                />
                              </div>
                              <div className='listing-card-location min-w-0 break-words md:text-base text-xs'>
                                {propertyForSale.neighbourhood}
                              </div>
                            </div>
                          </div>
                          <ListingCardQrThumb listing={propertyForSale} size={72} className='ml-auto shrink-0' />
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
                                  propertyForSale.sellerAvatar ||
                                  propertyForSale.userId?.profileImage,
                                )}
                                unoptimized
                              />
                            </div>
                            <div className='text-xs font-medium text-[#000000] md:text-sm lg:text-base'>
                              Ref: {getListingRef(propertyForSale)}
                            </div>
                          </div>
                          <div className='text-xs font-semibold text-[#000000] md:text-sm lg:text-lg'>
                            AED{' '}
                            {isOffPlanListing(propertyForSale)
                              ? formatListingCardPrice(propertyForSale)
                              : formatCardPrice(propertyForSale.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </PrivateListingGate>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      )}
    </div>
  )
}
