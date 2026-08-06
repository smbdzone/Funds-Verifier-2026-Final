import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LocationIcon } from '../Icons'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import Modal from '../product-modal/modal'
import Modal2 from '../product-modal/modal2'
import { Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '@/components/modules/style.css'
import { swiperCanLoop } from '@/utils/swiperLoop'
import {
  getListingCarouselItems,
  getListingDocumentSrc,
  isListingCarouselPlaceholderSlide,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { formatCardPrice, formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { getListingSharePath } from '@/libs/listingSocialShare'
import { formatListingLocation } from '@/libs/listingLocationUtils'
import { getListingPremiumDisplay } from '@/libs/listingPremiumStatus'
import ListingCarouselNavButton from '@/components/cards/ListingCarouselNavButton'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardCertificates from '@/components/shared/ListingCardCertificates'

const ProductCard = ({
  type,
  item,
  attributes,
  handlePrevSlide,
  handleNextSlide,
  openTechnicalReport,
  openEvaluationCertificate,
  convertToRelativeURL,
  getShortTitle,
  swiperRefs,
  isModalOpen,
  closeModal,
  pdfUrl,
  isModal2Open,
  closeModal2,
  pdf2Url,
}) => {
  const {
    video3DWalkthrough,
    title,
    price,
    evaluationPrices,
    roi,
    technicalReport,
    evaluationC,
    evaluationCertificate,
  } = item

  const [showROI, setShowROI] = useState(false)
  const [qrHovered, setQrHovered] = useState(false)
  useState(() => {
    if (type === 'property') setShowROI(true)
  })
  const carouselSlides = getListingCarouselItems(item)
  const listingHref = getListingSharePath({ ...item, type })
  const locationLabel = formatListingLocation(item)
  const { badge: premiumBadge } = getListingPremiumDisplay(item)
  const hasAdditionalContent =
    getListingDocumentSrc(technicalReport) &&
    getListingDocumentSrc(evaluationCertificate) &&
    video3DWalkthrough?.link
  const detailsVisibleClass = qrHovered
    ? 'max-h-[480px] opacity-100'
    : 'max-h-0 opacity-0 pointer-events-none'
  return (
    <div
      key={item.uuid}
      className={`group relative flex p-3 pr-0 flex-col gap-4 xl:gap-5 items-center sm:flex-row rounded-[12px] ${hasAdditionalContent ? 'custom-shadow' : 'bg-white'
        }`}
      style={{
        background: hasAdditionalContent
          ? 'linear-gradient(135deg, #0B2D4E 0%, #839cb9 100%)'
          : 'white',
      }}
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
        <ListingCardQrThumb
          listing={item}
          onHoverChange={setQrHovered}
        />
      </div>
      <div className='w-full sm:w-1/2 relative' style={{ maxWidth: '350px' }}>
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
          style={{ maxWidth: '312px', width: '100%', height: '220px' }}
          modules={[Pagination, Scrollbar, A11y]}
          onSwiper={(swiper) => {
            swiperRefs.current[item.uuid] = swiper
          }}
        >
          {carouselSlides.map((slide, index) => (
            <SwiperSlide key={`slide-${index}-${slide.type}`}>
              {slide.type === 'video' ? (
                <video
                  className='rounded-lg !w-[314px] !h-[220px] bg-black'
                  controls
                  playsInline
                  preload='metadata'
                >
                  <source
                    src={slide.src}
                    type={slide.contentType || 'video/mp4'}
                  />
                  Your browser does not support the video tag.
                </video>
              ) : isListingCarouselPlaceholderSlide(slide) ? (
                <div className='listing-carousel-placeholder listing-carousel-placeholder-frame flex h-[220px] min-h-[220px] w-full max-w-[314px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#eef0f3] to-[#e2e6ec]'>
                  <img
                    src={PLACEHOLDER}
                    alt=''
                    aria-hidden
                    className='listing-placeholder-camera-icon opacity-55 blur-[2px]'
                    draggable={false}
                  />
                </div>
              ) : (
                <Image
                  className='rounded-lg !w-[314px] !h-[220px]'
                  src={slide.src}
                  height={210}
                  width={210}
                  alt={title}
                />
              )}
            </SwiperSlide>
          ))}
          {video3DWalkthrough?.link && (
            <SwiperSlide key='walkthrough-3d'>
              <div className='rounded-lg !w-[314px] !h-[220px] flex items-center justify-center bg-gray-800 text-white'>
                <iframe
                  src={video3DWalkthrough.link}
                  title='3D Video'
                  className='rounded-lg !w-[314px] !h-[220px] border-none'
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
      <div
        className={`flex w-full flex-col gap-2.5 text-base ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
          }`}
      >
        <div className='flex flex-wrap items-center gap-2 text-left'>
          <Link href={listingHref} className='min-w-0 max-w-full'>
            <h2
              className={`text-2xl font-semibold capitalize leading-snug ${hasAdditionalContent ? 'text-white' : 'text-black'
                }`}
            >
              {getShortTitle(title)}
            </h2>
          </Link>
          <ListingCardViewCount listing={item} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${detailsVisibleClass}`}
          aria-hidden={!qrHovered}
        >
          <div className='flex flex-col gap-2.5 pb-1'>
            <div className='flex w-full flex-wrap gap-x-3 gap-y-1'>
              <p
                className={`text-base font-semibold ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
                  }`}
              >
                Selling Price: AED {formatListingCardPrice(item)}
              </p>
              <p
                className={`text-base font-semibold ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
                  }`}
              >
                Market Price: AED {formatCardPrice(evaluationPrices)}
              </p>
              {showROI && (
                <p
                  className={`text-base font-semibold ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
                    }`}
                >
                  ROI: {roi ? roi : 5}%
                </p>
              )}
            </div>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5'>
              {attributes?.map((attr, index) => (
                <div key={index} className='flex w-fit items-center gap-1'>
                  <span className='bg-gradient-to-r from-[#a2913e] to-[#d7c590] rounded-full h-[16px] w-[16px] shrink-0'></span>
                  <span
                    className={`font-normal ${hasAdditionalContent ? 'text-white/80' : 'text-reef-gold/80'
                      }`}
                  >
                    {attr}
                  </span>
                </div>
              ))}
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='flex items-center gap-3'>
                <LocationIcon
                  className={`${hasAdditionalContent ? 'text-white/80' : 'text-reef-gold/80'
                    }`}
                />
                <p
                  className={`font-normal ${hasAdditionalContent ? 'text-white/80' : 'text-reef-gold/80'
                    }`}
                >
                  {locationLabel || '—'}
                </p>
              </div>
              <ListingCardCertificates listing={item} />
            </div>
            <ListingSocialShare
              listing={{ ...item, type }}
              label='Share With:'
              labelClassName={`mb-0 text-base font-normal ${hasAdditionalContent ? 'text-white/80' : 'text-reef-gold/80'}`}
              iconClassName='h-[21px] w-[21px]'
              iconGapClassName='gap-3'
              stacked
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
