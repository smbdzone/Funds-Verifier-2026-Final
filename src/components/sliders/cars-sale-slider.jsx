'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { formatPriceUS, ucFirst } from '@/utils'
import { getListingThumbSrc } from '@/libs/listingCardMedia'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay } from 'swiper/modules' // Import Autoplay module
import axios from 'axios'
import star from '@/assets/star-6.svg'
import location from '@/assets/vector2.svg'
import avatar1 from '@/assets/avators/Avatars 1.png'
import avatar2 from '@/assets/avators/Avatars 2.png'
import avatar3 from '@/assets/avators/Avatars 3.png'
import arrow_right from '@/assets/vector1.svg'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa' // Use React Icons for stars

const avatars = [avatar1, avatar2, avatar3]

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
    if (carsForSale) {
      // Shuffle the cars on page load
      const shuffled = shuffleArray(carsForSale)
      setShuffledCars(shuffled)

      // Set up a timer to shuffle every 10 seconds
      const intervalId = setInterval(() => {
        const reshuffled = shuffleArray(carsForSale)
        setShuffledCars(reshuffled)
      }, 10000) // 10 seconds

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId)
    }
  }, [carsForSale])

  const truncateTitle = (title) => {
    const words = title.split(' ')
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '...'
    }
    return title
  }

  return (
    <div className='container mx-auto'>
      <div className='flex flex-row gap-3 items-center relative'>
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
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          hashNavigation={{
            watchState: true,
          }}
          loop={true}
          modules={[Pagination, Autoplay]} // Add the Autoplay module here
          autoplay={{
            delay: 10000, // Slide transition delay set to 10 seconds
            disableOnInteraction: false, // Allow user interaction without stopping autoplay
          }}
          ref={swiperRef}
        >
          {shuffledCars?.map((car, index) => (
            <SwiperSlide key={index}>
              <div className='mx-2 mb-2 shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-md bg-white'>
                <figure className=''>
                  <Image
                    width={414}
                    height={275}
                    className='rounded-md object-cover !h-[275px]'
                    alt={car?.make || 'Car'}
                    src={getListingThumbSrc(car, '/car.jpg')}
                  />
                </figure>
                <div className='flex flex-col'>
                  <div className='flex flex-col px-4 py-2 space-y-3'>
                    <div className='flex flex-row items-center'>
                      {/* Render Stars and Rating */}
                      <div className='rating-container mr-3'>
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
                    </div>
                    <Link
                      href={'/car/' + car.uuid}
                      className='flex text-[#002D4F] text-xl font-medium w-full text-left'
                    >
                      {ucFirst(car.carType)}
                    </Link>
                    <div className='text-[#002D4F] flex flex-row space-x-2 w-full text-base items-start'>
                      <div className='inline-block w-3.5'>
                        <Image
                          width={20}
                          height={20}
                          alt=''
                          src={location.src}
                        />
                      </div>
                      <div className='truncate overflow-ellipsis'>
                        {truncateTitle(car.neighbourhood)}
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
                          src={avatars[index % avatars.length]}
                        />
                      </div>
                      <div className='text-base font-medium text-[#000000]'>
                        Ref: {car?.uuid ? car.uuid.slice(0, 8) : 'N/A'}
                      </div>
                    </div>
                    <div className='text-lg font-semibold text-[#000000]'>
                      AED {formatPriceUS(car.price)}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
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
