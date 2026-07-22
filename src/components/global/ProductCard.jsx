import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LocationIcon } from '../Icons'
import {
  getListingPremiumDisplay,
  getListingWalkthroughUrl,
} from '@/libs/listingPremiumStatus'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import Modal2 from '../product-modal/modal2'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '@/components/modules/style.css'
import { formatCardPrice, formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { swiperCanLoop } from '@/utils/swiperLoop'
import Open3dModal from '../3dModal/Open3dModal'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import {
  getListingCarouselItems,
  getListingDocumentSrc,
  getListingQrScanSrc,
  getTechnicalReportSrc,
  isListingCarouselPlaceholderSlide,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingSharePath } from '@/libs/listingSocialShare'

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
    price,
    evaluationPrices,
    roi,
    country,
    technicalReport,
    evaluationCertificate,
  } = item

  const [showROI, setShowROI] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(false)

  useState(() => {
    if (type === 'property') setShowROI(true)
  })

  const technicalReportSrc = getTechnicalReportSrc(technicalReport)
  const evaluationCertificateSrc = getListingDocumentSrc(evaluationCertificate)
  const walkthroughUrl = getListingWalkthroughUrl(item)

  const { badge: premiumBadge } = getListingPremiumDisplay(item)

  const carouselSlides = getListingCarouselItems(item)
  const listingHref = getListingSharePath({ ...item, type })

  return (
    <div
      key={item.uuid}
      className='relative flex p-3 md:pr-0 flex-col gap-4 xl:gap-5 items-center md:flex-row rounded-[12px] bg-white shadow-xl'
    >
      {premiumBadge && (
        <button
          className='z-30 absolute top-2 right-2 border rounded px-1 gradient text-white'
        >
          {premiumBadge}
        </button>
      )}
      <div className='w-full xl:w-1/2 relative'>
        <div
          onClick={() => handlePrevSlide(item.uuid)}
          className='absolute z-30 opacity-70 hover:opacity-100 bg-white md:top-[30%] top-[50%] left-2 h-7 w-7 md:px-2 md:py-12 rounded-full  md:h-fit md:w-fit flex items-center justify-center'
        >
          <img
            src='/icons/golden-arrow-previous.png'
            className='mr-1 md:mr-0'
            alt='previous'
          />
        </div>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          hashNavigation={{ watchState: true }}
          loop={swiperCanLoop(carouselSlides.length, 1)}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          style={{ maxWidth: '312px', width: '100%', height: '220px' }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
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
                  <source src={slide.src} type={slide.contentType || 'video/mp4'} />
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
          {walkthroughUrl && (
            <SwiperSlide key='walkthrough-3d'>
              <div className='rounded-lg !w-[314px] !h-[220px] flex items-center justify-center bg-gray-800 text-white'>
                <iframe
                  src={walkthroughUrl}
                  title='3D Video'
                  className='rounded-lg !w-[314px] !h-[220px] border-none'
                  allowFullScreen
                ></iframe>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
        <div
          onClick={() => handleNextSlide(item.uuid)}
          className='bg-white absolute opacity-70 z-30 hover:opacity-100 md:top-[30%] top-[50%] right-2 h-7 w-7 md:px-2 md:py-12 rounded-full  md:h-fit md:w-fit flex items-center justify-center'
        >
          <img
            src='/icons/golden-arrow-previous.png'
            className='transform ml-0.5 md:ml-0 rotate-180'
            alt='next'
          />
        </div>
      </div>
      <div
        className={`w-full text-base text-reef-gold`}
      >
        <div className='listing-card-meta flex w-full items-start justify-between gap-3'>
          <div className='min-w-0 flex-1 break-words text-left'>
            <Link
              href={listingHref}
              className='listing-card-title block w-full break-words text-left'
            >
              <h2 className='break-words xl:text-xl md:text-lg text-base font-semibold capitalize text-black'>
                {title}
              </h2>
            </Link>
          </div>
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
        <div className='w-full flex flex-wrap gap-x-2 my-2'>
          <p
            className={`lg:text-base md:text-sm text-xs text-reef-gold`}
          >
            Selling Price: AED {formatListingCardPrice(item)}
          </p>
          <p
            className={`lg:text-base md:text-sm text-xs text-reef-gold`}
          >
            Market Price: AED {formatCardPrice(evaluationPrices)}
          </p>
          {showROI && (
            <p
              className={`lg:text-base md:text-sm text-xs text-reef-gold`}
            >
              ROI: {roi ? roi : 5}%
            </p>
          )}
        </div>
        <div className='flex flex-wrap gap-3 items-center md:mb-3 mb-1'>
          {attributes?.map((attr, index) => (
            <div
              key={index}
              className='flex w-fit flex-wrap items-center gap-1'
            >
              <span className='bg-gradient-to-r from-[#a2913e] to-[#d7c590] rounded-full h-[16px] w-[16px] shrink-0'></span>
              <span
                className={`lg:text-base md:text-sm text-xs text-reef-gold`}
              >
                {attr}
              </span>
            </div>
          ))}
        </div>
        <div className='flex'>
          <div className='flex md:gap-3 gap-1 items-center mb-3'>
            <LocationIcon
              className={` text-reef-gold`}
            />
            <p
              className={`lg:text-base md:mt-0 mt-2 md:text-sm text-xs text-reef-gold`}
            >
              {country}
            </p>
          </div>
          <div className='flex justify-center items-center gap-3 ml-3'>
            {evaluationCertificateSrc ? (
              <>
                <div className='bg-[#E0E0E0] p-1 rounded relative group'>
                  <img
                    src='/icons/card2.png'
                    className='w-[23px] h-[23px] cursor-pointer'
                    alt='Evaluation certificate'
                    onClick={() => openModal(evaluationCertificate?.uuid)}
                  />
                  <div className='absolute w-fit text-nowrap right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-2 text-center rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300'>
                    Evaluation Certificate
                  </div>
                </div>
                <Modal2
                  isOpen={modalCardId === evaluationCertificate?.uuid}
                  onClose={closeModal}
                  file2Url={evaluationCertificateSrc}
                  downloadFileName={evaluationCertificate?.Certificate?.name}
                  modalTitle='Evaluation Certificate'
                />
              </>
            ) : (
              ' '
            )}
            {technicalReportSrc ? (
              <>
                <div className='bg-[#E0E0E0] p-1 rounded relative group'>
                  <img
                    src='/icons/card1.png'
                    className='w-[23px] h-[23px] cursor-pointer'
                    alt='Technical report'
                    onClick={() =>
                      openModal(`tr-${item?.uuid || technicalReport?.uuid}`)
                    }
                  />
                  <div className='absolute w-fit text-nowrap right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-2 text-center rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300'>
                    Technical Report
                  </div>
                </div>
                <Modal2
                  isOpen={modalCardId === `tr-${item?.uuid || technicalReport?.uuid}`}
                  onClose={closeModal}
                  file2Url={technicalReportSrc}
                  downloadFileName={
                    technicalReport?.reportFile?.Certificate?.name ||
                    'technical-report.pdf'
                  }
                  modalTitle='Technical Report'
                />
              </>
            ) : null}
            {walkthroughUrl ? (
              <>
                <div
                  onClick={() => {
                    setSelectedMedia(true)
                  }}
                  className='bg-[#E0E0E0] p-1 rounded relative group'
                >
                  <img
                    src='/icons/3dicon.png'
                    className='w-[23px] h-[23px] cursor-pointer'
                  />
                  <div className='absolute w-fit text-nowrap right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-2 text-center rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300'>
                    3D Walkthrough
                  </div>
                </div>
                {selectedMedia && (
                  <Open3dModal
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    link={walkthroughUrl}
                  />
                )}
              </>
            ) : null}
          </div>
        </div>
        <ListingSocialShare
          listing={{ ...item, type }}
          label='Share With:'
          labelClassName='md:mb-3 mb-1 lg:text-base md:text-sm text-xs'
          iconClassName='h-5 w-5'
          iconGapClassName='gap-3'
          stacked
        />
      </div>
    </div>
  )
}

export default ProductCard
