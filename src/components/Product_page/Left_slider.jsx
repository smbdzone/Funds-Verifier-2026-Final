'use client'
import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Pagination, Mousewheel } from 'swiper/modules'
import { IoIosArrowUp, IoIosArrowDown, IoIosPlay } from 'react-icons/io'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import './styles.css'

SwiperCore.use([Mousewheel, Pagination]) // Initialize Swiper core modules

export default function ProductSlider({ setPreviewMedia, media = [] }) {
  const handlePreviewMedia = (item) => {
    setPreviewMedia(item)
  }

  const swiperRef = useRef(null)

  const goToPrevSlide = () => {
    swiperRef.current?.swiper?.slidePrev()
  }

  const goToNextSlide = () => {
    swiperRef.current?.swiper?.slideNext()
  }

  return (
    <div className='custom-swiper flex flex-col items-center'>
      <button className='custom-swiper-prev rounded-sm' onClick={goToPrevSlide}>
        <IoIosArrowUp className='ArrowDown text-2xl' />
      </button>
      <Swiper
        direction={'vertical'}
        slidesPerView={3}
        spaceBetween={2}
        ref={swiperRef}
        loop={true}
        breakpoints={{
          375: {
            slidesPerView: 1, // Mobile
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2, // Tablet
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3, // Tablet
            spaceBetween: 15,
          },
        }}
        className='w-full sm:h-[320px] md:h-[505px] h-[300px]'
      >
        {Array.isArray(media) &&
          media.map((item, index) => {
            if (!item?.src) return null
            return (
              <SwiperSlide key={index}>
                {item.type === 'video' ? (
                  <div
                    onClick={() => handlePreviewMedia(item)}
                    className='relative cursor-pointer object-cover h-full w-full rounded-lg pb-2 bg-black overflow-hidden'
                  >
                    <video
                      src={item.src}
                      preload='metadata'
                      muted
                      playsInline
                      className='object-cover h-full w-full pointer-events-none'
                    />
                    <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                      <IoIosPlay className='text-white text-4xl drop-shadow' />
                    </div>
                  </div>
                ) : item.type === 'walkthrough' ? (
                  <div
                    onClick={() => handlePreviewMedia(item)}
                    className='relative cursor-pointer object-cover h-full w-full rounded-lg pb-2 overflow-hidden'
                  >
                    <iframe
                      src={item.src}
                      title='3D Walkthrough'
                      className='object-cover h-full w-full pointer-events-none'
                    />
                    <div className='absolute inset-0 bg-transparent' />
                  </div>
                ) : (
                  <img
                    onClick={() => handlePreviewMedia(item)}
                    src={item.src}
                    alt='thumbnail'
                    height={350}
                    width={350}
                    className='rounded cursor-pointer object-cover w-full h-full'
                  />
                )}
              </SwiperSlide>
            )
          })}
      </Swiper>

      <button className='custom-swiper-next rounded-sm' onClick={goToNextSlide}>
        <IoIosArrowDown className='ArrowDown text-2xl' />
      </button>
    </div>
  )
}
