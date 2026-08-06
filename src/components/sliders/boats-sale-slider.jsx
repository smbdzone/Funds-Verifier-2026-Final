'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { formatCardPrice } from '@/libs/listingPriceDisplay'
import {
  getListingCardImageSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingRef } from '@/libs/listingRef'
import { FaStar } from 'react-icons/fa'
import location from '@/assets/vector2.svg'
import arrow_right from '@/assets/vector1.svg'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import { HomeListingSliderSkeleton } from '@/components/home/HomeSectionSkeletons'
import { publicApiFetch } from '@/libs/publicApiClient'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'

const APPROVED_BOATS_URL = '/boat?statusFilter=1&limit=100&sort=-createdAt'

function filterApprovedBoats(products) {
  if (!Array.isArray(products)) return []
  return products.filter((item) => Number(item?.status) === 1)
}

function truncateTitle(title) {
  if (!title) return 'Boat'
  return String(title)
}

export default function BoatsSaleSlider() {
  const [approvedBoats, setApprovedBoats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const swiperRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchApprovedBoats = async () => {
      setIsLoading(true)
      try {
        const response = await publicApiFetch(APPROVED_BOATS_URL, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        if (!cancelled) {
          setApprovedBoats(filterApprovedBoats(data?.products))
        }
      } catch (error) {
        console.error('Failed to load verified boats for sale:', error)
        if (!cancelled) {
          setApprovedBoats([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchApprovedBoats()

    return () => {
      cancelled = true
    }
  }, [])

  const handlePrevSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNextSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  const hasListings = approvedBoats.length > 0

  return (
    <div className='container mx-auto'>
      <div className='mb-3 sm:mb-0'>
        <div className='relative flex justify-between items-center'>
          <div className='md:text-4xl lg:text-5xl text-xl text-[#002D4F] text-center font-semibold w-full'>
            Verified Boats for Sale
          </div>
        </div>
        <div className='flex flex-row md:my-5 my-2 w-full justify-center gap-2'>
          <div className='rounded-2xl bg-[#002D4F] md:w-[31.8px] w-5 h-[5.6px]' />
          <div className='rounded-lg bg-[#8D7C3B] md:w-[84.9px] w-12 h-[5.6px]' />
        </div>
        <div className='flex leading-[30px] text-black justify-center mb-2 sm:mb-5'>
          <p className='xl:w-[35%] lg:w-[50%] md:px-5 text-xs text-center'>
            Browse evaluator-approved boats listed for sale on Funds Verifier.
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

      {isLoading ? <HomeListingSliderSkeleton count={3} /> : null}

      {!isLoading && !hasListings ? (
        <p className='text-center text-sm text-[#002D4F]/70 py-12'>
          No evaluator-approved boats for sale yet.
        </p>
      ) : null}

      {!isLoading && hasListings ? (
        <div className='flex flex-row gap-3 items-center relative'>
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
            hashNavigation={{ watchState: true }}
            loop={approvedBoats.length > 1}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              700: {
                slidesPerView: 2,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
            }}
            ref={swiperRef}
            className='listing-cards-swiper w-full'
          >
            {approvedBoats.map((boatForSale) => {
              const imageSrc = getListingCardImageSrc(boatForSale)

              return (
                <SwiperSlide className='listing-card-slide !h-auto w-full' key={boatForSale.uuid}>
                  <div className='listing-card mx-1 my-1 h-full w-full rounded-md bg-white'>
                    {imageSrc ? (
                      <div className='relative shrink-0 overflow-hidden rounded-md !h-[275px] w-full'>
                        <Image
                          width={414}
                          height={275}
                          className='h-full w-full rounded-md object-cover'
                          alt={boatForSale.title || boatForSale?.make || 'Boat'}
                          src={imageSrc}
                        />
                      </div>
                    ) : (
                      <div className='flex justify-center items-center rounded-md bg-[#f0f4f8] !h-[275px] w-full'>
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
                                      starIndex <
                                        Number(boatForSale.averageRating || 0)
                                        ? '#e1ba00'
                                        : '#D3D3D3'
                                    }
                                  />
                                </div>
                              ))}
                              <div className='ms-3 ml-2 md:text-base text-xs opacity-[50%]'>
                                {boatForSale.averageRating
                                  ? parseFloat(boatForSale.averageRating).toFixed(
                                    1,
                                  )
                                  : '0.0'}
                              </div>
                            </div>
                          </div>
                          <div className='opacity-[50%] md:text-base text-xs'>
                            {(boatForSale.reviewCount ?? boatForSale.reviewCounts) >
                              1
                              ? `(${boatForSale.reviewCount ?? boatForSale.reviewCounts} Reviews)`
                              : `(${boatForSale.reviewCount ?? boatForSale.reviewCounts ?? 0} Review)`}
                          </div>
                          <div className='ml-auto'>
                            <ListingCardViewCount listing={boatForSale} />
                          </div>
                        </div>
                        <div className='listing-card-meta flex w-full items-start justify-between gap-3'>
                          <div className='flex min-w-0 flex-1 flex-col items-start gap-1 text-left'>
                            <Link
                              href={`/boat/${boatForSale.slug || boatForSale.uuid}`}
                              className='listing-card-title block w-full break-words text-left text-[#002D4F] md:text-xl text-sm font-medium'
                            >
                              {truncateTitle(boatForSale.title)}
                            </Link>
                            <p className='listing-card-type w-full text-left text-[#002D4F] opacity-70 md:text-sm text-xs capitalize'>
                              {boatForSale.condition
                                ? String(boatForSale.condition)
                                : 'Boats For Sale'}
                            </p>
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
                                {boatForSale.neighbourhood}
                              </div>
                            </div>
                          </div>
                          <ListingCardQrThumb listing={boatForSale} className='ml-auto' />
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
                                  boatForSale?.sellerAvatar ||
                                  boatForSale?.userId?.profileImage,
                                )}
                                unoptimized
                              />
                            </div>
                            <div className='md:text-sm lg:text-base text-xs font-medium text-[#000000]'>
                              Ref: {getListingRef(boatForSale)}
                            </div>
                          </div>
                          <div className='lg:text-lg md:text-sm text-xs font-semibold text-[#000000]'>
                            AED {formatCardPrice(boatForSale.price)}
                          </div>
                        </div>
                      </div>
                    </div></div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      ) : null}
    </div>
  )
}
