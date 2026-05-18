'use client'
import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { IoIosArrowUp, IoIosArrowDown, IoIosPlay } from 'react-icons/io'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

const ImageSlider = ({ media = [] }) => {
  const swiperRef = useRef(null)

  const goToPrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev() // Properly call Swiper's slidePrev method
    }
  }

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext() // Properly call Swiper's slideNext method
    }
  }

  return (
    <div className='container mx-auto  md:hidden'>
      <div className='flex flex-col h-[350px] gap-3 items-center relative'>
        {/* Swiper */}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            420: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
          }}
          className='w-full h-full'
          onSwiper={(swiper) => (swiperRef.current = swiper)} // Assign Swiper instance to ref
        >
          {Array.isArray(media) &&
            media.map((item, index) => {
              if (!item?.src) return null
              return (
                <SwiperSlide key={index}>
                  {item.type === 'video' ? (
                    <video
                      controls
                      playsInline
                      preload='metadata'
                      src={item.src}
                      className='cursor-pointer object-cover h-full w-full rounded-lg pb-2 bg-black'
                    />
                  ) : item.type === 'walkthrough' ? (
                    <iframe
                      src={item.src}
                      title='3D Walkthrough'
                      className='cursor-pointer object-cover h-full w-full rounded-lg pb-2'
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt='media'
                      height={350}
                      width={350}
                      className='rounded cursor-pointer w-full h-full object-cover'
                    />
                  )}
                </SwiperSlide>
              )
            })}
        </Swiper>
        <div className='flex gap-x-2'>
          {/* Previous Arrow */}
          <div onClick={goToPrevSlide} className='cursor-pointer'>
            <div className='btn-gradient px-1 py-1 -rotate-90 rounded'>
              <IoIosArrowUp className='ArrowDown text-base' />
            </div>
          </div>
          {/* Next Arrow */}
          <div onClick={goToNextSlide} className='cursor-pointer'>
            <div className='btn-gradient px-1 py-1 -rotate-90 rounded'>
              <IoIosArrowDown className='ArrowDown text-base' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageSlider
