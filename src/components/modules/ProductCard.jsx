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
  // Below 1200px: details always visible. 1200px+: reveal on QR hover.
  const detailsVisibleClass = qrHovered
    ? 'max-h-[480px] opacity-100'
    : 'max-h-[480px] opacity-100 min-[1200px]:max-h-0 min-[1200px]:opacity-0 min-[1200px]:pointer-events-none'
  return (
    <div
      key={item.uuid}
      className={`group relative flex w-full flex-col items-stretch gap-3 rounded-[12px] p-3 sm:flex-row sm:items-center sm:gap-4 sm:pr-0 xl:gap-5 ${hasAdditionalContent ? 'custom-shadow' : 'bg-white shadow-xl'
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
          className='hidden sm:block'
        />
      </div>
      <div className='relative w-full shrink-0 sm:w-[280px] md:w-[312px] xl:w-auto xl:max-w-[350px]'>
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
          className='!h-[200px] w-full sm:!h-[220px]'
          style={{ width: '100%', maxWidth: '100%' }}
          modules={[Pagination, Scrollbar, A11y]}
          onSwiper={(swiper) => {
            swiperRefs.current[item.uuid] = swiper
          }}
        >
          {carouselSlides.map((slide, index) => (
            <SwiperSlide key={`slide-${index}-${slide.type}`}>
              {slide.type === 'video' ? (
                <video
                  className='h-[200px] w-full rounded-lg bg-black object-cover sm:h-[220px]'
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
                <div className='listing-carousel-placeholder listing-carousel-placeholder-frame flex h-[200px] min-h-[200px] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#eef0f3] to-[#e2e6ec] sm:h-[220px] sm:min-h-[220px]'>
                  <img
                    src={PLACEHOLDER}
                    alt=''
                    aria-hidden
                    className='listing-placeholder-camera-icon opacity-55 blur-[2px]'
                    draggable={false}
                  />
                </div>
              ) : (
                <div className='relative h-[200px] w-full overflow-hidden rounded-lg sm:h-[220px]'>
                  <Image
                    className='h-full w-full rounded-lg object-cover'
                    src={slide.src}
                    height={220}
                    width={314}
                    alt={title}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
          {video3DWalkthrough?.link && (
            <SwiperSlide key='walkthrough-3d'>
              <div className='flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-800 text-white sm:h-[220px]'>
                <iframe
                  src={video3DWalkthrough.link}
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
      <div
        className={`flex min-w-0 flex-1 flex-col gap-2.5 pr-2 text-base sm:pr-24 ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
          }`}
      >
        <div className='flex min-w-0 flex-col gap-1.5 text-left'>
          <Link href={listingHref} className='min-w-0 max-w-full break-words'>
            <h2
              className={`break-words text-lg font-semibold capitalize leading-snug md:text-xl xl:text-2xl ${hasAdditionalContent ? 'text-white' : 'text-black'
                }`}
            >
              {title}
            </h2>
          </Link>
          <ListingCardViewCount listing={item} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${detailsVisibleClass}`}
          aria-hidden={false}
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
              <div className='flex flex-wrap items-center gap-2'>
                <ListingCardQrThumb
                  listing={item}
                  onHoverChange={setQrHovered}
                  size={48}
                  className='sm:hidden'
                />
                <ListingCardCertificates listing={item} />
              </div>
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
