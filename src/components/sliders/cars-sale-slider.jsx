'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { formatCardPrice } from '@/libs/listingPriceDisplay'
import { ucFirst } from '@/utils'
import {
  getListingCardImageSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingRef } from '@/libs/listingRef'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay } from 'swiper/modules' // Import Autoplay module
import axios from 'axios'
import star from '@/assets/star-6.svg'
import location from '@/assets/vector2.svg'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import arrow_right from '@/assets/vector1.svg'
import Image from 'next/image'
import Link from 'next/link'
import { swiperCanLoop } from '@/utils/swiperLoop'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'

// Utility function to shuffle an array
const shuffleArray = (array) => {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item)
}

export default function CarForSale() {
  const { carsForSale } = useAppContext()
  const swiperRef = useRef(null)
  const [reviewCounts, setReviewCounts] = useState({})
  const [averageRating, setAverageRating] = useState({})
  const [shuffledCars, setShuffledCars] = useState([])

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

  // Fetch review count and average rating for each car
  useEffect(() => {
    const fetchReviewCounts = async () => {
      try {
        const counts = {}
        const ratings = {}

        await Promise.all(
          carsForSale?.products?.map(async (car) => {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/count`,
              { productId: car.uuid }
            )
            counts[car.uuid] = response.data.count
            ratings[car.uuid] = response.data.averageRating
          })
        )

        setReviewCounts(counts)
        setAverageRating(ratings)
      } catch (error) {
        console.error('Failed to fetch review counts and ratings:', error)
      }
    }

    if (carsForSale) {
      fetchReviewCounts()
    }
  }, [carsForSale])

  // Shuffle cars when page loads and every 10 seconds
  useEffect(() => {
    const products = carsForSale?.products || []
    if (products.length) {
      setShuffledCars(shuffleArray(products))

      const intervalId = setInterval(() => {
        setShuffledCars(shuffleArray(products))
      }, 10000)

      return () => clearInterval(intervalId)
    }
    setShuffledCars([])
  }, [carsForSale])

  const truncateTitle = (title) => {
    if (!title) return ''
    return String(title)
  }

  return (
    <div className='container mx-auto'>
      <div className='home-listing-slider-row relative flex flex-row items-center gap-3'>
        <div
          onClick={handlePrevSlide}
          className='cursor-pointer absolute top-[50%] -left-12 z-40'
        >
          <div className='btn-gradient px-2 py-1 rounded'>
            <Image
              src={arrow_right}
              alt='previous'
              className='transform rotate-180'
            />
          </div>
        </div>
        <Swiper className='listing-cards-swiper w-full'
          slidesPerView={1}
          spaceBetween={10}
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
          hashNavigation={{
            watchState: true,
          }}
          loop={swiperCanLoop(shuffledCars.length, 3)}
          modules={[Pagination, Autoplay]} // Add the Autoplay module here
          autoplay={{
            delay: 10000, // Slide transition delay set to 10 seconds
            disableOnInteraction: false, // Allow user interaction without stopping autoplay
          }}
          ref={swiperRef}
        >
          {shuffledCars.map((car, index) => {
            const imageSrc = getListingCardImageSrc(car)

            return (
              <SwiperSlide className='listing-card-slide !h-auto' key={car.uuid || index}>
                <div className='listing-card mx-1 my-1 h-full w-full rounded-md bg-white'>
                  <figure className='listing-card-image relative h-[190px] w-full overflow-hidden rounded-md md:h-[240px] lg:h-[275px]'>
                    {imageSrc ? (
                      <Image
                        width={414}
                        height={275}
                        className='h-full w-full rounded-md object-cover'
                        alt={car?.make || 'Car'}
                        src={imageSrc}
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center rounded-md bg-[#f0f4f8]'>
                        <Image
                          width={64}
                          height={64}
                          src={PLACEHOLDER}
                          alt='No photo'
                          className='opacity-40'
                        />
                      </div>
                    )}
                  </figure>
                  <div className='listing-card-body w-full'>
                    <div className='flex flex-1 flex-col space-y-3 px-4 py-2'>
                      <div className='flex w-full flex-row flex-wrap items-center gap-x-3 gap-y-1'>
                        {/* Render Stars and Rating */}
                        <div className='rating-container'>
                          <div className='flex flex-row items-center'>
                            {Array.from({ length: 5 }, (_, starIndex) => (
                              <div key={starIndex} className='h-5 w-5'>
                                <FaStar
                                  size={20}
                                  color={
                                    starIndex <
                                      Number(averageRating[car.uuid] || 0)
                                      ? '#e1ba00' // Filled star
                                      : '#D3D3D3' // Unfilled star
                                  }
                                />
                              </div>
                            ))}
                            <div className='ms-3 opacity-[50%]'>
                              {averageRating[car.uuid]
                                ? parseFloat(averageRating[car.uuid]).toFixed(1)
                                : '0.0'}
                            </div>
                          </div>
                        </div>
                        <div className='opacity-[50%]'>
                          {reviewCounts[car.uuid]
                            ? reviewCounts[car.uuid] > 1
                              ? `(${reviewCounts[car.uuid]} Reviews)`
                              : `(${reviewCounts[car.uuid]} Review)`
                            : `(0 Review)`}
                        </div>
                        <div className='ml-auto'>
                          <ListingCardViewCount listing={car} />
                        </div>
                      </div>
                      <div className='listing-card-meta flex w-full items-start justify-between gap-3'>
                        <div className='flex min-w-0 flex-1 flex-col items-start gap-1 text-left'>
                          <Link
                            href={`/car/${car.slug || car.uuid}`}
                            className='listing-card-title block w-full break-words text-left text-[#002D4F] text-xl font-medium'
                          >
                            {truncateTitle(car.title) || ucFirst(car.carType)}
                          </Link>
                          <p className='listing-card-type w-full text-left text-[#002D4F] opacity-70 md:text-sm text-xs capitalize'>
                            {car.carType ? ucFirst(car.carType) : 'Car For Sale'}
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
                            <div className='listing-card-location min-w-0 break-words'>
                              {truncateTitle(car.neighbourhood)}
                            </div>
                          </div>
                        </div>
                        <ListingCardQrThumb listing={car} className='ml-auto' />
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
                                car?.sellerAvatar || car?.userId?.profileImage,
                              )}
                              unoptimized
                            />
                          </div>
                          <div className='text-base font-medium text-[#000000]'>
                            Ref: {getListingRef(car)}
                          </div>
                        </div>
                        <div className='text-lg font-semibold text-[#000000]'>
                          AED {formatCardPrice(car.price)}
                        </div>
                      </div>
                    </div>
                  </div></div>
              </SwiperSlide>
            )
          })}
        </Swiper>
        <div
          onClick={handleNextSlide}
          className='cursor-pointer absolute top-[50%] -right-12 z-40'
        >
          <div className='btn-gradient px-2 py-1 rounded'>
            <Image src={arrow_right} alt='next' />
          </div>
        </div>
      </div>
    </div>
  )
}
