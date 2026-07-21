'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { formatPriceUS, ucFirst } from '@/utils'
import {
  getListingCardImageSrc,
  getListingQrScanSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingRef } from '@/libs/listingRef'
import { getListingDetailId } from '@/libs/listingSlug'
import { FaStar } from 'react-icons/fa'
import location from '@/assets/vector2.svg'
import arrow_right from '@/assets/vector1.svg'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import { HomeListingSliderSkeleton } from '@/components/home/HomeSectionSkeletons'
import { publicApiFetch } from '@/libs/publicApiClient'

const APPROVED_JEWELRY_URL = '/jewelry?statusFilter=1&limit=100&sort=-createdAt'

function filterApprovedJewelry(products) {
  if (!Array.isArray(products)) return []
  return products.filter((item) => Number(item?.status) === 1)
}

function truncateTitle(title) {
  if (!title) return 'Jewellery'
  const words = String(title).split(' ')
  if (words.length > 4) {
    return `${words.slice(0, 4).join(' ')}...`
  }
  return title
}

function getJewelryCardImageSrc(jewelry) {
  const items = getListingCarouselItems(jewelry)
  const slide = items.find(
    (item) => item.type === 'image' && !isListingCarouselPlaceholderSlide(item),
  )
  if (slide?.src) return slide.src
  const thumb = getListingThumbSrc(jewelry)
  return thumb !== PLACEHOLDER ? thumb : ''
}

export default function JewelrySaleSlider() {
  const [approvedJewelry, setApprovedJewelry] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const swiperRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchApprovedJewelry = async () => {
      setIsLoading(true)
      try {
        const response = await publicApiFetch(APPROVED_JEWELRY_URL, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        if (!cancelled) {
          setApprovedJewelry(filterApprovedJewelry(data?.products))
        }
      } catch (error) {
        console.error('Failed to load verified jewellery for sale:', error)
        if (!cancelled) {
          setApprovedJewelry([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchApprovedJewelry()

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

  const hasListings = approvedJewelry.length > 0

  return (
    <div className='container mx-auto'>
      <div className='mb-3 sm:mb-0'>
        <div className='relative flex justify-between items-center'>
          <div className='md:text-4xl lg:text-5xl text-xl text-[#002D4F] text-center font-semibold w-full'>
            Verified Jewellery for Sale
          </div>
        </div>
        <div className='flex flex-row md:my-5 my-2 w-full justify-center gap-2'>
          <div className='rounded-2xl bg-[#002D4F] md:w-[31.8px] w-5 h-[5.6px]' />
          <div className='rounded-lg bg-[#8D7C3B] md:w-[84.9px] w-12 h-[5.6px]' />
        </div>
        <div className='flex leading-[30px] text-black justify-center mb-2 sm:mb-5'>
          <p className='xl:w-[35%] lg:w-[50%] md:px-5 text-xs text-center'>
            Browse evaluator-approved jewellery listed for sale on Funds
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

      {isLoading ? <HomeListingSliderSkeleton count={3} /> : null}

      {!isLoading && !hasListings ? (
        <p className='text-center text-sm text-[#002D4F]/70 py-12'>
          No evaluator-approved jewellery for sale yet.
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
            loop={approvedJewelry.length > 1}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              376: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1440: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
            }}
            ref={swiperRef}
            className='w-full'
          >
            {approvedJewelry.map((item) => {
              const imageSrc = getListingCardImageSrc(item)

              return (
                <SwiperSlide className='w-full' key={item.uuid}>
                  <div className='overflow-hidden w-full mx-2 mb-2 shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-md bg-white'>
                    {imageSrc ? (
                      <Image
                        width={414}
                        height={275}
                        className='rounded-md object-cover !h-[275px] w-full'
                        alt={item.title || item.category || 'Jewellery'}
                        src={imageSrc}
                      />
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

                    <div className='flex flex-col'>
                      <div className='flex flex-col px-4 py-2 space-y-3'>
                        <div className='flex flex-row items-center'>
                          <div className='rating-container mr-3'>
                            <div className='flex flex-row items-center'>
                              {Array.from({ length: 5 }, (_, starIndex) => (
                                <div key={starIndex} className='h-5 w-5'>
                                  <FaStar
                                    size={20}
                                    color={
                                      starIndex <
                                        Number(item.averageRating || 0)
                                        ? '#e1ba00'
                                        : '#D3D3D3'
                                    }
                                  />
                                </div>
                              ))}
                              <div className='ms-3 ml-2 md:text-base text-xs opacity-[50%]'>
                                {item.averageRating
                                  ? parseFloat(item.averageRating).toFixed(1)
                                  : '0.0'}
                              </div>
                            </div>
                          </div>
                          <div className='opacity-[50%] md:text-base text-xs'>
                            {item.reviewCount > 1
                              ? `(${item.reviewCount} Reviews)`
                              : `(${item.reviewCount || 0} Review)`}
                          </div>
                        </div>
                        <Link
                          href={`/jewelry/${getListingDetailId(item)}`}
                          className='flex items-center gap-2 text-[#002D4F] md:text-xl text-sm font-medium w-full text-left capitalize'
                        >
                          {getListingQrScanSrc(item) ? (
                            <Image
                              src={getListingQrScanSrc(item)}
                              width={36}
                              height={36}
                              alt='QR code'
                              className='h-9 w-9 shrink-0 rounded border border-gray-200 bg-white object-contain'
                              unoptimized
                            />
                          ) : null}
                          {truncateTitle(item.title)}
                        </Link>
                        {item.category ? (
                          <p className='text-[#002D4F] opacity-70 md:text-sm text-xs -mt-1 capitalize'>
                            {ucFirst(item.category)}
                          </p>
                        ) : null}
                        <div className='text-[#002D4F] flex flex-row space-x-2 w-full text-base items-start'>
                          <div className='inline-block w-3.5'>
                            <Image
                              width={20}
                              height={20}
                              alt=''
                              src={location.src}
                            />
                          </div>
                          <div className='flex md:text-base text-xs truncate overflow-ellipsis'>
                            {item.neighbourhood || item.city}
                          </div>
                        </div>
                      </div>
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
                                item?.sellerAvatar ||
                                item?.userId?.profileImage,
                              )}
                              unoptimized
                            />
                          </div>
                          <div className='md:text-sm lg:text-base text-xs font-medium text-[#000000]'>
                            Ref: {getListingRef(item)}
                          </div>
                        </div>
                        <div className='lg:text-lg md:text-sm text-xs font-semibold text-[#000000]'>
                          AED {formatPriceUS(item.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      ) : null}
    </div>
  )
}
