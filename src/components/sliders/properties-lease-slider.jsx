'use client'
import React, { useRef } from 'react'
import { swiperCanLoop } from '@/utils/swiperLoop'
import { useAppContext } from '@/context/AppContext'
import { formatCardPrice } from '@/libs/listingPriceDisplay'
import { ucFirst } from '@/utils'
import {
  getListingCardImageSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingRef } from '@/libs/listingRef'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay } from 'swiper/modules'
import location from '@/assets/vector2.svg'
import arrow_right from '@/assets/vector1.svg'
import Image from 'next/image'
import Link from 'next/link'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'

export default function PropertyLeaseSlider() {
  const { propertiesForLease } = useAppContext()
  const swiperRef = useRef(null)

  // Handle Previous Slide
  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  // Handle Next Slide
  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  return (
    <div className='container w-full mx-auto'>
      <div>
        <div className='relative flex justify-between items-center'>
          <div className=' md:text-4xl lg:text-5xl text-[15px] text-[#002D4F] md:text-center font-semibold text-left w-full'>
            Verified Properties for Lease
          </div>
          <div className='flex   md:hidden space-x-5'>
            <div
              onClick={handlePrevSlide}
              className='cursor-pointer md:absolute md:top-[50%] lg:-left-10 md:-left-7 z-40'
            >
              <div className='btn-gradient px-2 py-1 rounded'>
                <Image
                  src={arrow_right}
                  alt='previous'
                  height={24}
                  width={24}
                  className='transform h-full w-full rotate-180'
                />
              </div>
            </div>
            <div
              onClick={handleNextSlide}
              className='cursor-pointer md:absolute md:top-[50%] lg:-right-10 md:-right-7  z-40'
            >
              <div className='btn-gradient px-2 py-1 rounded'>
                <Image
                  src={arrow_right}
                  height={24}
                  width={24}
                  className='h-full w-full'
                  alt='next'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-row md:my-5 my-3 w-full md:justify-center gap-2'>
          <div className='rounded-2xl bg-[#002D4F] md:w-[31.8px] w-5 h-[5.6px]' />
          <div className='rounded-lg bg-[#8D7C3B] md:w-[84.9px] w-12 h-[5.6px]' />
        </div>
        <div className='flex leading-[30px] text-black justify-center mb-5'>
          <p className='xl:w-[35%] lg:w-[50%] md:px-5 text-xs text-left md:text-center'>
            Lorem ipsum placeholder or dummy text used in typesetting and
            graphic design for previewing layouts.
          </p>
        </div>
      </div>
      <div className='home-listing-slider-row relative flex w-full flex-col items-center gap-3 md:flex-row md:px-0'>
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
            className='cursor-pointer md:absolute md:top-[50%] lg:-right-10 md:-right-7  z-40'
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
        <Swiper className='listing-cards-swiper w-full'
          slidesPerView={1} // 👈 Default for screens < 375px
          spaceBetween={10}
          hashNavigation={{
            watchState: true,
          }}
          loop={swiperCanLoop(propertiesForLease?.products?.length || 0, 3)}
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
          ref={swiperRef}
        >
          {propertiesForLease?.products?.map((propertyForLease, index) => (
            <SwiperSlide
              style={{ width: '100% !important' }}
              className='listing-card-slide !h-auto shrink-0 w-full'
              key={index}
            >
              <div className='listing-card mx-1 my-1 h-full w-full rounded-md bg-white'>
                {(() => {
                  const imageSrc = getListingCardImageSrc(propertyForLease)
                  return imageSrc ? (
                    <div className='listing-card-image relative h-[190px] w-full shrink-0 overflow-hidden rounded-md md:h-[240px] lg:h-[275px]'>
                      <Image
                        width={414}
                        height={275}
                        className='h-full w-full rounded-md object-cover'
                        alt={propertyForLease?.propertyType || 'Property'}
                        src={imageSrc}
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
                  )
                })()}
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
                                    Number(propertyForLease.averageRating || 0)
                                    ? '#e1ba00'
                                    : '#D3D3D3'
                                }
                              />
                            </div>
                          ))}
                          <div className='ms-3 ml-2 md:text-base text-xs opacity-[50%]'>
                            {propertyForLease.averageRating
                              ? parseFloat(
                                propertyForLease.averageRating
                              ).toFixed(1)
                              : '0.0'}
                          </div>
                        </div>
                      </div>
                      <div className='opacity-[50%] md:text-base text-xs'>
                        {propertyForLease.reviewCount > 1
                          ? `(${propertyForLease.reviewCount} Reviews)`
                          : `(${propertyForLease.reviewCount || 0} Review)`}
                      </div>
                      <div className='ml-auto'>
                        <ListingCardViewCount listing={propertyForLease} />
                      </div>
                    </div>
                    <div className='listing-card-meta flex w-full items-start justify-between gap-3'>
                      <div className='flex min-w-0 flex-1 flex-col items-start gap-1 text-left'>
                        <Link
                          href={`/property/${propertyForLease.slug || propertyForLease.uuid}`}
                          className='listing-card-title block w-full break-words text-left text-[#002D4F] md:text-xl text-sm font-medium capitalize'
                        >
                          {propertyForLease.title ||
                            `${ucFirst(propertyForLease.propertyType)} For Lease`}
                        </Link>
                        {propertyForLease.propertyType ? (
                          <p className='listing-card-type w-full text-left text-[#002D4F] opacity-70 md:text-sm text-xs capitalize'>
                            {ucFirst(propertyForLease.propertyType)} For Lease
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
                            {propertyForLease.neighbourhood}
                          </div>
                        </div>
                      </div>
                      <ListingCardQrThumb listing={propertyForLease} className='ml-auto' />
                    </div>
                  </div>
                  <div className='listing-card-footer'>
                    <div className='box-border my-3 w-full h-0.5 border-t-[2px] border-solid border-[#969696]' />
                    <div className='flex flex-row items-center justify-between pb-4 px-5'>
                      <div className='flex flex-row gap-4 items-center'>
                        <div className='flex w-[50px] h-[50px]'>
                          <Image
                            width={50}
                            height={50}
                            className='object-cover'
                            alt=''
                            src={getProfileImageSrc(
                              propertyForLease.sellerAvatar ||
                              propertyForLease.userId?.profileImage,
                            )}
                            unoptimized
                          />
                        </div>
                        <div className='md:text-sm lg:text-base text-xs font-medium text-[#000000]'>
                          Ref: {getListingRef(propertyForLease)}
                        </div>
                      </div>
                      <div className='lg:text-lg md:text-sm text-xs font-semibold text-[#000000]'>
                        AED {formatCardPrice(propertyForLease.price)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
