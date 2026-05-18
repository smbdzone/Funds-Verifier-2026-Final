import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'
import { useAppContext } from '@/context/AppContext'
import { formatPriceUS, ucFirst } from '@/utils'
import { getListingThumbSrc } from '@/libs/listingCardMedia'
import avatar1 from '@/assets/avators/Avatars 1.png'
import avatar2 from '@/assets/avators/Avatars 2.png'
import avatar3 from '@/assets/avators/Avatars 3.png'
import location from '@/assets/vector2.svg'
import arrow_right from '@/assets/vector1.svg'

const avatars = [avatar1, avatar2, avatar3]

export default function PropertySaleSlider() {
  const { propertiesForSale } = useAppContext()
  const swiperRef = useRef(null)

  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

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
            Lorem ipsum placeholder or dummy text used in typesetting and
            graphic design for previewing layouts.
          </p>
        </div>

        {/* ✅ Updated mobile arrows here */}
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
      </div>

      <div className='flex md:flex-row flex-col items-center relative'>
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
          loop={true}
          hashNavigation={{ watchState: true }}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            375: {
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
          className='w-full'
          ref={swiperRef}
        >
          {propertiesForSale?.products?.map((propertyForSale, index) => (
            <SwiperSlide className='w-full' key={index}>
              <div className='mx-2 w-full mb-2 shadow-[0px_0px_8px_rgba(0,_0,_0,_0.15)] rounded-md bg-white'>
                <Image
                  className='rounded-md object-cover !h-[275px]'
                  alt={'Vila image'}
                  src={getListingThumbSrc(propertyForSale, '/villa.jpg')}
                  width={414}
                  height={275}
                />
                <div className='flex w-full flex-col'>
                  <div className='flex flex-col px-4 py-2 space-y-3'>
                    <div className='flex flex-row items-center'>
                      <div className='rating-container mr-3'>
                        <div className='flex flex-row justify-between items-end'>
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
                                  propertyForSale.averageRating
                                ).toFixed(1)
                              : '0.0'}
                          </div>
                        </div>
                      </div>
                      <div className='opacity-[50%] md:text-base text-xs ms-3'>
                        {propertyForSale.reviewCount > 1
                          ? `(${propertyForSale.reviewCount} Reviews)`
                          : `(${propertyForSale.reviewCount} Review)`}
                      </div>
                    </div>
                    <Link
                      href={`/property/${propertyForSale.uuid}`}
                      className='flex text-[#002D4F] md:text-xl text-sm font-medium w-full text-left'
                    >
                      {ucFirst(propertyForSale.propertyType)} For Sale
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
                      <div className='truncate md:text-base text-xs overflow-ellipsis'>
                        {propertyForSale.neighbourhood}
                      </div>
                    </div>
                  </div>
                  <div className='w-full box-border my-3 h-0.5 border-t-[2px] border-solid border-[#969696]' />
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
                      <div className='md:text-sm lg:text-base text-xs font-medium text-[#000000]'>
                        Ref:{' '}
                        {propertyForSale?.uuid
                          ? propertyForSale.uuid.slice(0, 8)
                          : 'N/A'}
                      </div>
                    </div>
                    <div className='g:text-lg md:text-sm text-xs font-semibold text-[#000000]'>
                      AED {formatPriceUS(propertyForSale.price)}
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
