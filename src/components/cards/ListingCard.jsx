import {
  Analytics,
  BlueTickIcon,
  LocationIcon,
  EditIcon,
  DeleteIcon,
} from '@/components/Icons'
import IconButton from '@mui/material/IconButton'
import { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import Link from 'next/link'
import Modal2 from '../product-modal/modal2'
import Image from 'next/image'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import { formatPropertySizeDisplay } from '@/libs/propertySizeUnits'
import Open3dModal from '@/components/3dModal/Open3dModal'
import {
  getListingCarouselItems,
  getListingDocumentSrc,
  getTechnicalReportSrc,
  isListingCarouselPlaceholderSlide,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import {
  getListingPremiumDisplay,
  getListingWalkthroughUrl,
  LISTING_PREMIUM_BLUE_GRADIENT,
} from '@/libs/listingPremiumStatus'
import {
  getListingEditPath,
  getPendingEvaluationViewPath,
} from '@/libs/listingEditPaths'

const renderListingDetails = (listing, hasFeaturedStyling) => {
  switch (listing.assetType) {
    case 'Property For Lease':
    case 'Property For Sale':
    case 'Property Off Plan':
      return (
        <div className='flex flex-wrap gap-3 items-center mb-3'>
          <span className='bg-[#F5F5F5] shrink-0 rounded-full h-[25px] w-[25px] '></span>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              }`}
          >
            {listing.bedrooms} Beds
          </span>
          <span className='bg-[#F5F5F5] shrink-0 rounded-full h-[25px] w-[25px] '></span>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              }`}
          >
            {listing.bathrooms} Baths
          </span>
          <span className='bg-[#F5F5F5] shrink-0 rounded-full h-[25px] w-[25px] '></span>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              }`}
          >
            {formatPropertySizeDisplay(listing)}
          </span>
        </div>
      )
    case 'Car For Sale':
      return (
        <div className='flex gap-x-1 items-center mb-3'>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              } truncate`}
          >
            Model: {listing.model}
          </span>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              } truncate`}
          >
            Used: {listing.bodyCondition}
          </span>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              } truncate`}
          >
            Steering: {listing.steeringSide}
          </span>
        </div>
      )
    case 'Jewellery For Sale':
      return (
        <div className='flex flex-wrap gap-3 items-center mb-3'>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              }`}
          >
            Age: {listing.age}
          </span>
          <span className='bg-[#F5F5F5] shrink-0 rounded-full h-[25px] w-[25px] '></span>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              }`}
          >
            Grams: {listing.grams}
          </span>
        </div>
      )
    case 'Boats For Sale':
      return (
        <div
          className={`flex flex-wrap gap-3 items-center mb-3 ${hasFeaturedStyling ? 'text-gradient-custom' : 'text-prussianBlue'
            }`}
        >
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              }`}
          >
            Condition: {listing.condition}
          </span>
          <span className='bg-[#F5F5F5] shrink-0 rounded-full h-[25px] w-[25px] '></span>
          <span
            className={`lg:text-base text-sm ${hasFeaturedStyling
              ? 'text-gradient-custom'
              : 'text-prussianBlue'
              }`}
          >
            Length: {listing.length}
          </span>
        </div>
      )
    default:
      return null
  }
}

const getShortTitle = (title, limit = 20) => {
  return title.length > limit ? `${title.slice(0, limit)}...` : title
}

const ListingCard = ({
  listings,
  usePendingEvaluation = false,
  handleDeleteClick,
}) => {
  const [preious] = useState(false)
  const [next] = useState(false)
  const [walkthroughListingId, setWalkthroughListingId] = useState(null)
  const [walkthroughLink, setWalkthroughLink] = useState('')
  const [modalCardId, setModalCardId] = useState(null)

  const getDynamicLink = (assetType, slug) => {
    if (usePendingEvaluation) {
      return getPendingEvaluationViewPath(assetType, slug)
    } else {
      let assetTypeText
      switch (assetType) {
        case 'Property For Lease':
        case 'Property For Sale':
        case 'Property Off Plan For Sale':
          assetTypeText = 'property'
          break
        case 'Car For Sale':
          assetTypeText = 'car'
          break
        case 'Jewellery For Sale':
          assetTypeText = 'jewelry'
          break
        case 'Boats For Sale':
          assetTypeText = 'boat'
          break
        default:
          assetTypeText = assetType.toLowerCase()
      }
      return `/${assetTypeText}/${slug}`
    }
  }

  const openModal = (cardId) => {
    setModalCardId(cardId)
  }

  const closeModal = () => {
    setModalCardId(null)
  }

  const swiperRefs = useRef({})

  const getEditLink = (assetType, listingId) => {
    return getListingEditPath(assetType, listingId)
  }

  const handlePrevSlide = (id) => {
    if (swiperRefs.current[id]) {
      swiperRefs.current[id].slidePrev()
    }
  }

  const handleNextSlide = (id) => {
    if (swiperRefs.current[id]) {
      swiperRefs.current[id].slideNext()
    }
  }

  return (
    listings.length > 0 &&
    listings?.map((listing, i) => {
      const carouselItems = getListingCarouselItems(listing)
      const swiperSlides =
        carouselItems.length > 0
          ? carouselItems
          : [{ type: 'image', src: PLACEHOLDER, isPlaceholder: true }]

      let assetTypeText

      switch (listing.assetType) {
        case 'Property For Lease':
        case 'Property For Sale':
        case 'Property Off Plan For Sale':
          assetTypeText = 'property'
          break
        case 'Car For Sale':
          assetTypeText = 'car'
          break
        case 'Jewellery For Sale':
          assetTypeText = 'jewellery'
          break
        case 'Boats For Sale':
          assetTypeText = 'boat'
          break
        default:
          assetTypeText = listing.assetType
      }
      const technicalReportSrc = getTechnicalReportSrc(listing?.technicalReport)
      const evaluationCertificateSrc = getListingDocumentSrc(
        listing?.evaluationCertificate,
      )
      const walkthroughUrl = getListingWalkthroughUrl(listing)
      const hasWalkthrough = !!walkthroughUrl

      const { hasFeaturedStyling, badge: premiumBadge, hasPaidTechnical } =
        getListingPremiumDisplay(listing)
      const technicalReportPending = hasPaidTechnical && !technicalReportSrc

      const showDocIcons =
        usePendingEvaluation || listing.status !== 0

      const technicalModalKey = `tr-${listing.uuid}`
      const evalModalKey = `ec-${listing.uuid}`
      const technicalDownloadName =
        listing?.technicalReport?.reportFile?.Certificate?.name ||
        'technical-report.pdf'

      return (
        <>
          <div
            className={`relative flex md:p-5 p-2 flex-col md:gap-4 gap-2 xl:gap-10 my-5 rounded-lg items-center md:flex-row custom-shadow overflow-x-hidden ${hasFeaturedStyling ? '' : 'bg-white'
              }`}
            style={
              hasFeaturedStyling
                ? { background: LISTING_PREMIUM_BLUE_GRADIENT }
                : undefined
            }
          >
            <div className='md:absolute top-2 w-full right-2 z-50 items-center justify-end flex gap-2'>
              {/* status */}
              {listing.status === 0 ? (
                <>
                  <div className='relative group'>
                    <button className='bg-blue-500 text-black py-2 rounded'>
                      <Image
                        src='/icons/pending1.svg'
                        height={20}
                        width={20}
                        alt='Pending'
                        className='cursor-pointer'
                      />
                    </button>
                    <span className='absolute top-full left-1/2 transform bg-white shadow-md rounded -translate-x-1/2 mt-0 hidden group-hover:flex whitespace-nowrap bg-gray-800 text-black text-xs py-1 px-2'>
                      Pending
                    </span>
                  </div>
                </>
              ) : (
                <button
                  className='border rounded px-2 py-0.5 gradient text-white text-sm'
                >
                  {premiumBadge}
                </button>
              )}

              {/* Edit Icon with Link */}
              <Link href={getEditLink(listing.assetType, listing.uuid)}>
                <IconButton
                  style={{
                    background: 'transparent',
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <EditIcon className='py-1 text-[#8D7C3B]' />
                </IconButton>
              </Link>
              {typeof handleDeleteClick === 'function' &&
                !usePendingEvaluation && (
                  <IconButton
                    aria-label='Delete listing'
                    style={{ background: 'transparent' }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDeleteClick(listing)
                    }}
                  >
                    <DeleteIcon className='py-1 text-[#8D7C3B]' />
                  </IconButton>
                )}
            </div>

            <div className='xl:!max-w-[350px] relative'>
              {/* Previous arrow */}
              <div
                onClick={() => handlePrevSlide(i)}
                className={`absolute top-[30%] left-10 z-40 h-[100px] w-[25px] flex items-center justify-center ${preious ? 'bg-white' : 'bg-[#FFFFFF]'
                  }`}
              >
                <div className=' px-2 py-1 rounded'>
                  <img
                    src={'/icons/golden-arrow-previous.png'}
                    alt='previous'
                    className=''
                  />
                </div>
              </div>
              {/* Image slider */}
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                hashNavigation={{
                  watchState: true,
                }}
                loop={swiperSlides.length > 1}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                style={{ maxWidth: '312px', width: '100%', height: '250px' }} // Adjusted height to match your design
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                onSwiper={(swiper) => {
                  swiperRefs.current[i] = swiper
                }}
              >
                {swiperSlides.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <video
                        className='rounded-lg object-cover w-full !h-[250px] bg-black'
                        src={item.src}
                        controls
                        playsInline
                        preload='metadata'
                      />
                    ) : isListingCarouselPlaceholderSlide(item) ? (
                      <div className='listing-carousel-placeholder listing-carousel-placeholder-frame flex h-[250px] min-h-[250px] w-full max-w-[312px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#eef0f3] to-[#e2e6ec]'>
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
                        className='rounded-lg object-fill !h-[250px]'
                        src={item.src}
                        height={253}
                        width={314}
                        alt={listing.title}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Next arrow */}
              <div
                onClick={() => handleNextSlide(i)}
                className={`absolute top-[30%] right-10 z-40 h-[100px] w-[25px] flex items-center justify-center ${next ? 'bg-white' : 'bg-[#FFFFFF]'
                  }`}
              >
                <div className='px-2 py-1 rounded'>
                  <img
                    src={'/icons/golden-arrow-previous.png'}
                    className='transform rotate-180'
                    alt='next'
                  />
                </div>
              </div>
            </div>
            {/* Details section */}
            <div className='xl:!max-w-[450px] flex flex-col'>
              <span
                className={`capitalize lg:text-base text-sm${hasFeaturedStyling
                  ? 'text-gradient-custom text-light-gold capitalize'
                  : ''
                  }`}
              >
                {assetTypeText} for Sale
              </span>

              <Link href={getDynamicLink(listing?.assetType, listing.uuid)}>
                {hasFeaturedStyling ? (
                  <div className='flex items-center'>
                    <h2 className='text-gradient-custom lg:text-3xl sm:text-xl text-lg font-semibold capitalize'>
                      {getShortTitle(listing.title)}
                    </h2>
                    <div className='ml-2 text-gradient-custom'>
                      <BlueTickIcon className='text-light-gold' />
                    </div>
                  </div>
                ) : (
                  <h2 className='lg:text-3xl sm:text-xl text-lg font-semibold capitalize text-blue'>
                    {getShortTitle(listing.title)}
                  </h2>
                )}
              </Link>
              <div className='flex flex-wrap items-center space-x-4'>
                <p
                  className={`text-prussianBlue mb-2 lg:text-base text-sm font-medium ${hasFeaturedStyling ? 'text-gradient-custom' : 'text-blue'
                    }`}
                >
                  Price: {formatNumberWithCommas(listing.price)}
                </p>
                <p
                  className={`mb-2 lg:text-base text-sm font-medium ${hasFeaturedStyling
                    ? 'text-gradient-custom'
                    : 'text-prussianBlue'
                    }`}
                >
                  Market Price:
                  {formatNumberWithCommas(listing.evaluationPrices)}
                </p>
                {assetTypeText === 'property' && (
                  <p
                    className={`mb-2 lg:text-base text-sm font-medium ${hasFeaturedStyling
                      ? 'text-gradient-custom'
                      : 'text-prussianBlue'
                      }`}
                  >
                    Roi: {listing?.roi || 0}%
                  </p>
                )}
              </div>

              {renderListingDetails(listing, hasFeaturedStyling)}

              <div className='flex'>
                <div
                  className={`flex gap-3 items-center mb-3 ${hasFeaturedStyling
                    ? 'text-gradient-custom'
                    : 'text-prussianBlue'
                    }`}
                >
                  <LocationIcon
                    className={
                      hasFeaturedStyling ? 'text-light-gold' : 'text-blue'
                    }
                  />

                  <p className='whitespace-normal lg:text-base text-sm'>
                    {listing.country}
                  </p>
                </div>
                <div className='flex gap-3 ml-3 flex-wrap items-center'>
                  {showDocIcons && technicalReportSrc ? (
                    <>
                      <div className='bg-[#E0E0E0] p-1 rounded relative group'>
                        <img
                          src='/icons/card1.png'
                          className='w-[23px] h-[23px] cursor-pointer'
                          alt='Technical report'
                          onClick={() => openModal(technicalModalKey)}
                        />
                        <div className='absolute w-[200px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                          Technical Report
                        </div>
                      </div>
                      <Modal2
                        isOpen={modalCardId === technicalModalKey}
                        onClose={closeModal}
                        file2Url={technicalReportSrc}
                        downloadFileName={technicalDownloadName}
                        modalTitle='Technical Report'
                      />
                    </>
                  ) : null}
                  {showDocIcons && technicalReportPending ? (
                    <div
                      className='bg-[#E0E0E0] p-1 rounded relative group opacity-50 cursor-default'
                      title='Technical report requested — PDF will appear when ready'
                    >
                      <img
                        src='/icons/card1.png'
                        alt='Technical report pending'
                        className='w-[23px] h-[23px]'
                      />
                      <div className='absolute w-[220px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-3 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                        Technical report requested — awaiting PDF upload
                      </div>
                    </div>
                  ) : null}

                  {showDocIcons && evaluationCertificateSrc ? (
                    <>
                      <div className='bg-[#E0E0E0] p-1 rounded relative group'>
                        <img
                          src='/icons/card2.png'
                          className='w-[23px] h-[23px] cursor-pointer'
                          alt='Evaluation certificate'
                          onClick={() => openModal(evalModalKey)}
                        />
                        <div className='absolute w-[200px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                          Evaluation Certificate
                        </div>
                      </div>
                      <Modal2
                        isOpen={modalCardId === evalModalKey}
                        onClose={closeModal}
                        file2Url={evaluationCertificateSrc}
                        downloadFileName={
                          listing?.evaluationCertificate?.Certificate?.name
                        }
                        modalTitle='Evaluation Certificate'
                      />
                    </>
                  ) : null}
                  {showDocIcons && hasWalkthrough ? (
                    <>
                      <div
                        onClick={() => {
                          setWalkthroughListingId(listing.uuid)
                          setWalkthroughLink(walkthroughUrl)
                        }}
                        className='bg-[#E0E0E0] p-1 rounded relative group'
                      >
                        <img
                          src='/icons/3dicon.png'
                          className='w-[23px] h-[23px] cursor-pointer'
                        />
                        <div className='absolute w-[200px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black lg:text-base text-sm p-5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                          3D Walkthrough
                        </div>
                      </div>
                      {walkthroughListingId === listing.uuid && (
                        <Open3dModal
                          selectedMedia={true}
                          setSelectedMedia={() => {
                            setWalkthroughListingId(null)
                            setWalkthroughLink('')
                          }}
                          link={walkthroughLink}
                        />
                      )}
                    </>
                  ) : null}
                </div>
              </div>

              <div className='flex gap-2 items-center'>
                <Analytics
                  className={
                    hasFeaturedStyling ? 'text-light-gold' : 'text-blue'
                  }
                />
                <p
                  className={
                    hasFeaturedStyling
                      ? 'text-light-gold lg:text-base text-sm'
                      : 'text-blue lg:text-base text-sm'
                  }
                >
                  Analytics
                </p>
              </div>
            </div>
          </div>
        </>
      )
    })
  )
}
export default ListingCard
