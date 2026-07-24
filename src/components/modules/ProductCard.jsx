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
  getListingQrScanSrc,
  isListingCarouselPlaceholderSlide,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { formatCardPrice, formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { getListingSharePath } from '@/libs/listingSocialShare'
import ListingCarouselNavButton from '@/components/cards/ListingCarouselNavButton'

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
    country,
    technicalReport,
    evaluationC,
    evaluationCertificate,
  } = item

  const [showROI, setShowROI] = useState(false)
  useState(() => {
    if (type === 'property') setShowROI(true)
  })
  const carouselSlides = getListingCarouselItems(item)
  const listingHref = getListingSharePath({ ...item, type })
  const hasAdditionalContent =
    getListingDocumentSrc(technicalReport) &&
    getListingDocumentSrc(evaluationCertificate) &&
    video3DWalkthrough?.link
  return (
    <div
      key={item.uuid}
      className={`flex p-3 pr-0 flex-col gap-4 xl:gap-5 items-center sm:flex-row rounded-[12px] ${hasAdditionalContent ? 'custom-shadow' : 'bg-white'
        }`}
      style={{
        background: hasAdditionalContent
          ? 'linear-gradient(135deg, #0B2D4E 0%, #839cb9 100%)'
          : 'white',
      }}
    >
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
        className={`w-full text-base ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
          }`}
      >
        <div className='listing-card-meta flex w-full items-start justify-between gap-2'>
          <Link href={listingHref} className='min-w-0 flex-1'>
            <h2
              className={`text-xl font-semibold capitalize ${hasAdditionalContent ? 'text-white' : 'text-black'
                }`}
            >
              {getShortTitle(title)}
            </h2>
          </Link>
          {getListingQrScanSrc(item) ? (
            <Image
              src={getListingQrScanSrc(item)}
              width={72}
              height={72}
              alt='QR code'
              className='listing-qr-thumb ml-auto h-[72px] w-[72px] shrink-0 rounded border border-gray-200 bg-white object-contain'
              unoptimized
            />
          ) : null}
        </div>
        <div className='w-full flex gap-x-2 my-2'>
          <p
            className={`text-base ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
              }`}
          >
            Selling Price: AED {formatListingCardPrice(item)}
          </p>
          <p
            className={`text-base ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
              }`}
          >
            Market Price: AED {formatCardPrice(evaluationPrices)}
          </p>
          {showROI && (
            <p
              className={`text-base ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
                }`}
            >
              ROI: {roi ? roi : 5}%
            </p>
          )}
        </div>
        <div className='flex flex-wrap gap-3 items-center mb-3'>
          {attributes?.map((attr, index) => (
            <div key={index} className='flex w-fit items-center gap-1'>
              <span className='bg-gradient-to-r from-[#a2913e] to-[#d7c590] rounded-full h-[16px] w-[16px] shrink-0'></span>
              <span
                className={`${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
                  }`}
              >
                {attr}
              </span>
            </div>
          ))}
        </div>
        <div className='flex'>
          <div className='flex gap-3 items-center mb-3'>
            <LocationIcon
              className={` ${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
                }`}
            />
            <p
              className={`${hasAdditionalContent ? 'text-white' : 'text-reef-gold'
                }`}
            >
              {country}
            </p>
          </div>
          <div className='flex gap-3 ml-3'>
            {technicalReport && technicalReport.trim() !== '' && (
              <div className='p-1 rounded relative group'>
                <img
                  src='/icons/card1.png'
                  className={`w-[23px] h-[23px] cursor-pointer ${hasAdditionalContent ? 'filter brightness-0 invert' : ''
                    }`}
                  alt='Technical report'
                  onClick={() =>
                    openTechnicalReport(convertToRelativeURL(technicalReport))
                  }
                />
                <div
                  className='absolute w-[170px] flex justify-center bg-blue-600 -left-4 transform -translate-y-1/2 text-white text-sm p-2 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'
                  style={{ top: '-20px' }}
                >
                  Technical Report
                </div>
                <Modal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  fileUrl={pdfUrl}
                />
              </div>
            )}
            {evaluationC && evaluationC.trim() !== '' && (
              <div className='p-1 rounded relative group'>
                <img
                  src='/icons/card2.png'
                  className={`w-[23px] h-[23px] cursor-pointer ${hasAdditionalContent ? 'filter brightness-0 invert' : ''
                    }`}
                  alt='Evaluation certificate'
                  onClick={() =>
                    openEvaluationCertificate(convertToRelativeURL(evaluationC))
                  }
                />
                <div
                  className='absolute w-[170px] flex justify-center bg-blue-600 -left-4 transform -translate-y-1/2 text-white text-sm p-2 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'
                  style={{ top: '-20px' }}
                >
                  Evaluation Certificate
                </div>
                <Modal2
                  isOpen={isModal2Open}
                  onClose={closeModal2}
                  file2Url={pdf2Url}
                  downloadFileName={evaluationCertificate?.Certificate?.name}
                />
              </div>
            )}
            {video3DWalkthrough && video3DWalkthrough.trim() !== '' && (
              <div className='p-1 rounded relative group'>
                <img
                  src='/icons/3dicon.png'
                  className={`w-[23px] h-[23px] cursor-pointer ${hasAdditionalContent ? 'filter brightness-0 invert' : ''
                    }`}
                />
                <div
                  className='absolute w-[170px] flex justify-center bg-blue-600 -left-4 transform -translate-y-1/2 text-white text-sm p-2 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'
                  style={{ top: '-20px' }}
                >
                  3D Walkthrough
                </div>
              </div>
            )}
          </div>
        </div>
        <ListingSocialShare
          listing={{ ...item, type }}
          label='Share With:'
          labelClassName='mb-3 text-base'
          iconClassName='h-[21px] w-[21px]'
          iconGapClassName='gap-3'
          stacked
        />
      </div>
    </div>
  )
}

export default ProductCard
