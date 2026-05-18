'use client'
import { Rating } from '@mui/material'
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRouter } from 'next/navigation'
import { formatPriceUS } from '@/utils'
import axios from 'axios' // Import axios
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import {
  getListingImageSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'

const ButtomSlider = ({ data }) => {
  const router = useRouter()
  const swiperRef = useRef(null)

  // State to store review counts and average ratings
  const [reviewCounts, setReviewCounts] = useState({})
  const [averageRatings, setAverageRatings] = useState({})

  // Handle previous and next slide actions
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

  // Function to truncate the title
  const truncateTitle = (title) => {
    const words = title.split(' ')
    return words.length > 2 ? `${words.slice(0, 2).join(' ')}...` : title
  }

  // Function to handle click and navigate based on asset type
  const handleClick = (value) => {
    let pathToGo = ''

    switch (value.assetType) {
      case 'Property For Sale':
      case 'Property For Lease':
        pathToGo = 'property'
        break
      case 'Car For Sale':
        pathToGo = 'car'
        break
      case 'Jewellery For Sale':
        pathToGo = 'jewelry'
        break
      case 'Boats For Sale':
        pathToGo = 'boat'
        break
      default:
        pathToGo = ''
    }
    if (pathToGo) {
      router.push(`/${pathToGo}/${value.uuid}`)
    }
  }

  // Fetch review count and average rating for each property
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const counts = {}
        const ratings = {}

        await Promise.all(
          data?.map(async (property) => {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/count`,
              { productId: property.uuid }
            )
            counts[property.uuid] = response.data.count || 0
            ratings[property.uuid] = response.data.averageRating || 0
          })
        )

        setReviewCounts(counts)
        setAverageRatings(ratings)
      } catch (error) {
        console.error('Failed to fetch review data:', error)
      }
    }

    if (data?.length) {
      fetchReviewData()
    }
  }, [data])

  return (
    <div className='lg:px-10'>
      <div className='flex md:flex-row flex-col items-center relative'>
        <div className='sm:block flex gap-x-3'>
          <div
            onClick={handlePrevSlide}
            className='btn-gradient sm:px-2 px-1 py-1 rounded cursor-pointer -rotate-90  md:absolute md:top-[50%] -left-3 xl:-left-12 lg:-left-2 z-40'
          >
            <IoIosArrowUp className='ArrowDown text-base md:text-lg' />
          </div>
          <div
            onClick={handleNextSlide}
            className='btn-gradient sm:px-2 px-1 py-1 rounded cursor-pointer -rotate-90  md:absolute md:top-[50%] -right-3 xl:-right-12 lg:-right-2 z-40'
          >
            <IoIosArrowDown className='ArrowDown text-base md:text-lg' />
          </div>
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          hashNavigation={{
            watchState: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          modules={[Pagination]}
          ref={swiperRef}
          className='h-[380px] !pb-[40px] w-full'
        >
          {data?.products?.map((property, index) => (
            <SwiperSlide key={index} className='md:mt-8 mt-4'>
              <div
                onClick={() => handleClick(property)}
                className='cursor-pointer w-full rounded-lg h-auto shadow mx-1 flex flex-col justify-between'
              >
                <div className='relative lg:w-full h-[250px]'>
                  <Image
                    src={(() => {
                      const thumb = property?.thumbnailImg?.images?.[0]
                      const firstPic = property?.pictures?.images?.[0]
                      const candidate = thumb || firstPic
                      const src = candidate
                        ? getListingImageSrc(candidate)
                        : PLACEHOLDER
                      return src === PLACEHOLDER
                        ? '/product/rectangle-105@2x.png'
                        : src
                    })()}
                    alt={`slide-${index}`}
                    className='object-cover rounded-[12px]'
                    width={300}
                    height={300}
                  />
                </div>
                <div className='p-3'>
                  <h2 className='lg:text-xl md:text-lg text-base capitalize font-medium text-blue'>
                    {truncateTitle(property.title)}
                  </h2>
                  <div className='flex flex-row justify-center items-center space-x-3'>
                    {/* Use dynamic rating and review count */}
                    <Rating
                      className='text-xs'
                      name='half-rating-read'
                      value={averageRatings[property.uuid] || 0}
                      precision={0.5}
                      readOnly
                    />
                    <span className='text-xs underline'>
                      {reviewCounts[property.uuid] || 0} Reviews
                    </span>
                  </div>
                  <div className='md:pt-2'>
                    <span className='font-medium lg:text-xl md:text-base text-sm'>
                      AED {formatPriceUS(property.price || 0)}
                    </span>
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

export default ButtomSlider
