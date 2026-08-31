import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LocationIcon } from '../Icons'
import {
  getListingPremiumDisplay,
  getListingWalkthroughUrl,
} from '@/libs/listingPremiumStatus'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import { Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '@/components/modules/style.css'
import { formatCardPrice, formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { swiperCanLoop } from '@/utils/swiperLoop'
import {
  getListingCarouselItems,
  isListingCarouselPlaceholderSlide,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingSharePath } from '@/libs/listingSocialShare'
import { formatListingLocation } from '@/libs/listingLocationUtils'
import ListingCarouselNavButton from '@/components/cards/ListingCarouselNavButton'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'
import ListingCardCertificates from '@/components/shared/ListingCardCertificates'
import PrivateListingGate from '@/components/shared/PrivateListingGate'

const ProductCard = ({
  type,
  item,
  attributes,
  handlePrevSlide,
  handleNextSlide,
  getShortTitle,
  swiperRefs,
  closeModal,
  openModal,
  modalCardId,
}) => {
  if (item?.status !== 1) return
  const {
    title,
    evaluationPrices,
    roi,
  } = item

  const [showROI, setShowROI] = useState(false)

  useState(() => {
    if (type === 'property') setShowROI(true)
  })

  const { badge: premiumBadge } = getListingPremiumDisplay(item)

  const carouselSlides = getListingCarouselItems(item)
  const listingHref = getListingSharePath({ ...item, type })
  const locationLabel = formatListingLocation(item)
  const walkthroughUrl = getListingWalkthroughUrl(item)

  return (
    <PrivateListingGate listing={item}>
    <div
      key={item.uuid}
      className='group relative flex w-full flex-col items-stretch gap-3 rounded-[12px] bg-white p-3 shadow-xl sm:flex-row sm:items-center sm:gap-4 sm:pr-0 xl:gap-5'
    >
      <div className='absolute right-2 top-2 z-30 flex flex-col items-end gap-1.5'>
        {premiumBadge ? (
          <button
            type='button'
            className='rounded border px-1 gradient text-white'
          >
            {premiumBadge}
          </button>
        ) : null}
        {/* Tablet+: QR below Approved / premium badge */}
        <ListingCardQrThumb listing={item} className='hidden sm:block' />
      </div>
      <div className='listing-card-media-swiper relative mx-auto w-full shrink-0 overflow-hidden rounded-lg sm:mx-0'>
        {carouselSlides.length > 1 ? (
          <ListingCarouselNavButton
            direction='prev'
            onClick={() => handlePrevSlide(item.uuid)}
          />
        ) : null}
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          hashNavigation={{ watchState: true }}
          loop={swiperCanLoop(carouselSlides.length, 1)}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          navigation={false}
          className='listing-card-swiper-root !h-full w-full'
          style={{ width: '100%', height: '100%' }}
          modules={[Pagination, Scrollbar, A11y]}
          onSwiper={(swiper) => {
            swiperRefs.current[item.uuid] = swiper
          }}
        >
          {carouselSlides.map((slide, index) => (
            <SwiperSlide key={`slide-${index}-${slide.type}`} className='!h-full'>
              {slide.type === 'video' ? (
                <video
                  className='h-full w-full rounded-lg bg-black object-cover object-center'
                  controls
                  playsInline
                  preload='metadata'
                >
                  <source src={slide.src} type={slide.contentType || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
              ) : isListingCarouselPlaceholderSlide(slide) ? (
                <div className='listing-carousel-placeholder listing-carousel-placeholder-frame flex h-full min-h-0 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#eef0f3] to-[#e2e6ec]'>
                  <img
                    src={PLACEHOLDER}
                    alt=''
                    aria-hidden
                    className='listing-placeholder-camera-icon opacity-55 blur-[2px]'
                    draggable={false}
                  />
                </div>
              ) : (
                <div className='relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg'>
                  <Image
                    className='listing-card-photo h-full w-full rounded-lg object-cover object-center'
                    src={slide.src}
                    height={220}
                    width={314}
                    alt={title}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
          {walkthroughUrl && (
            <SwiperSlide key='walkthrough-3d' className='!h-full'>
              <div className='flex h-full w-full items-center justify-center rounded-lg bg-gray-800 text-white'>
                <iframe
                  src={walkthroughUrl}
                  title='3D Video'
                  className='h-full w-full rounded-lg border-none'
                  allowFullScreen
                ></iframe>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
        {carouselSlides.length > 1 ? (
          <ListingCarouselNavButton
            direction='next'
            onClick={() => handleNextSlide(item.uuid)}
          />
        ) : null}
      </div>
      <div className='flex min-w-0 flex-1 flex-col gap-2.5 pr-2 text-base text-reef-gold sm:pr-24'>
        <div className='flex min-w-0 flex-col gap-1.5 text-left'>
          <Link
            href={listingHref}
            className='min-w-0 max-w-full break-words text-left'
          >
            <h2 className='break-words text-lg font-semibold capitalize leading-snug text-black md:text-xl xl:text-2xl'>
              {title}
            </h2>
          </Link>
          <ListingCardViewCount listing={item} />
        </div>

        <div className='overflow-visible'>
          <div className='flex flex-col gap-2.5 pb-1'>
            <div className='flex w-full flex-wrap items-center gap-x-3 gap-y-1'>
              <p className='text-xs font-semibold text-reef-gold md:text-sm lg:text-base'>
                Selling Price: AED {formatListingCardPrice(item)}
              </p>
              <p className='text-xs font-semibold text-reef-gold md:text-sm lg:text-base'>
                Market Price: AED {formatCardPrice(evaluationPrices)}
              </p>
              {showROI && (
                <p className='text-xs font-semibold text-reef-gold md:text-sm lg:text-base'>
                  ROI: {roi ? roi : 5}%
                </p>
              )}
            </div>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5'>
              {attributes?.map((attr, index) => (
                <div
                  key={index}
                  className='flex w-fit flex-wrap items-center gap-1'
                >
                  <span className='h-[16px] w-[16px] shrink-0 rounded-full bg-gradient-to-r from-[#a2913e] to-[#d7c590]'></span>
                  <span className='text-xs font-normal text-reef-gold/80 md:text-sm lg:text-base'>
                    {attr}
                  </span>
                </div>
              ))}
            </div>
            <div className='flex w-full min-w-0 flex-col gap-2'>
              <div className='flex min-w-0 items-center gap-1 md:gap-3'>
                <LocationIcon className='shrink-0 text-reef-gold/80' />
                <p className='min-w-0 text-xs font-normal text-reef-gold/80 md:text-sm lg:text-base'>
                  {locationLabel || '—'}
                </p>
              </div>
              <ListingCardCertificates listing={item} />
            </div>

            <div className='flex w-full flex-wrap items-end justify-between gap-3'>
              <ListingSocialShare
                listing={{ ...item, type }}
                label='Share With:'
                labelClassName='mb-0 font-normal lg:text-base md:text-sm text-xs text-reef-gold/80'
                iconClassName='h-5 w-5'
                iconGapClassName='gap-3'
                stacked
              />
              {/* Mobile only: QR at end of card */}
              <ListingCardQrThumb
                listing={item}
                size={48}
                className='ml-auto shrink-0 sm:hidden'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </PrivateListingGate>
  )
}

export default ProductCard
