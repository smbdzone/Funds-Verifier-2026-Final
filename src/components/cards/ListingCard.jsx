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
import { Pagination, Scrollbar, A11y } from 'swiper/modules'
import Link from 'next/link'
import Modal2 from '../product-modal/modal2'
import Image from 'next/image'
import { formatNumberWithCommas } from '@/utils/global-functions/global'
import { formatCardPrice, formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { isOffPlanListing } from '@/libs/filterMyListingTab'
import { formatPropertySizeDisplay } from '@/libs/propertySizeUnits'
import Open3dModal from '@/components/3dModal/Open3dModal'
import {
  getListingCarouselItems,
  getListingDocumentSrc,
  getTechnicalReportSrc,
  isListingCarouselPlaceholderSlide,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'
import {
  getListingPremiumDisplay,
  getListingWalkthroughUrl,
  LISTING_PREMIUM_BLUE_GRADIENT,
} from '@/libs/listingPremiumStatus'
import {
  getListingEditPath,
  getPendingEvaluationViewPath,
} from '@/libs/listingEditPaths'
import { getListingDetailId } from '@/libs/listingSlug'
import { hasPendingDocumentRequests } from '@/utils/requestDocumentUtils'
import ListingCarouselNavButton from '@/components/cards/ListingCarouselNavButton'
import { useProfile } from '@/context/UserContext'

const renderListingDetails = (listing, hasFeaturedStyling) => {
  switch (listing.assetType) {
    case 'Property For Lease':
    case 'Property For Sale':
    case 'Property Off Plan':
    case 'Property Off Plan For Sale':
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
  showEdit,
}) => {
  const { user } = useProfile() || {}
  const roleNorm = String(user?.role || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '')
  const isAdminViewer =
    roleNorm === 'admin' || roleNorm === 'superadmin'
  // Super Admin / Admin: same card look as asset holder, but no edit control
  const canEdit = showEdit ?? !isAdminViewer

  const [walkthroughListingId, setWalkthroughListingId] = useState(null)
  const [walkthroughLink, setWalkthroughLink] = useState('')
  const [modalCardId, setModalCardId] = useState(null)
  const [analyticsCardId, setAnalyticsCardId] = useState(null)
  const getDynamicLink = (assetType, slug) => {
    if (usePendingEvaluation) {
      return getPendingEvaluationViewPath(assetType, slug)
    } else {
      let assetTypeText
      switch (assetType) {
        case 'Property For Lease':
        case 'Property For Sale':
          assetTypeText = 'property'
          break
        case 'Property Off Plan For Sale':
        case 'Property Off Plan':
          assetTypeText = 'offplan'
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
          assetTypeText = String(assetType || '')
            .toLowerCase()
            .includes('off plan')
            ? 'offplan'
            : String(assetType || 'property').toLowerCase()
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
      const documentRequestedPending = hasPendingDocumentRequests(listing)

      const showDocIcons =
        usePendingEvaluation || listing.status !== 0

      const technicalModalKey = `tr-${listing.uuid}`
      const evalModalKey = `ec-${listing.uuid}`
      const technicalDownloadName =
        listing?.technicalReport?.reportFile?.Certificate?.name ||
        'technical-report.pdf'

      const isOffPlan = isOffPlanListing(listing)

      return (
        <>
          <div
            className={`group relative my-5 flex w-full flex-col items-stretch gap-2 rounded-lg p-2 custom-shadow overflow-x-hidden sm:flex-row sm:items-center sm:gap-4 md:gap-4 md:p-5 xl:gap-10 ${hasFeaturedStyling ? '' : 'bg-white'
              }`}
            style={
              hasFeaturedStyling
                ? { background: LISTING_PREMIUM_BLUE_GRADIENT }
                : undefined
            }
          >
            <div className='absolute top-2 right-2 z-50 flex w-auto flex-col items-end gap-1.5'>
              <div className='flex w-full items-center justify-end gap-2'>
                {documentRequestedPending ? (
                  <div className='relative group'>
                    <span className='inline-flex items-center rounded bg-yellow-400 px-2.5 py-1 text-xs font-semibold text-black shadow-sm'>
                      Document Requested
                    </span>
                    <span className='absolute top-full left-1/2 z-50 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs text-black shadow-md group-hover:flex'>
                      Upload requested documents in Documents Storage
                    </span>
                  </div>
                ) : null}
                {String(listing?.offPlanApprovalFeeStatus || '') === 'requested' ? (
                  <div className='relative group'>
                    <span className='inline-flex items-center rounded bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm'>
                      Approval Fee Due
                    </span>
                    <span className='absolute top-full left-1/2 z-50 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs text-black shadow-md group-hover:flex'>
                      Pay the optional off-plan approval fee under Invoices
                    </span>
                  </div>
                ) : null}
                {String(listing?.offPlanApprovalFeeStatus || '') === 'paid' ? (
                  <div className='relative group'>
                    <span className='inline-flex items-center rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm'>
                      Invoice
                    </span>
                    <span className='absolute top-full left-1/2 z-50 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs text-black shadow-md group-hover:flex'>
                      Off-plan approval fee paid — view under Invoices
                    </span>
                  </div>
                ) : null}
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
                    {premiumBadge || 'Approved'}
                  </button>
                )}

                {/* Edit — hidden for Super Admin / Admin */}
                {canEdit ? (
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
                ) : null}
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
              <ListingCardQrThumb listing={listing} />
            </div>

            <div className='listing-card-media-swiper relative mx-auto xl:!max-w-[350px]'>
              {swiperSlides.length > 1 ? (
                <ListingCarouselNavButton
                  direction='prev'
                  onClick={() => handlePrevSlide(i)}
                />
              ) : null}
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
                navigation={false}
                style={{ maxWidth: '312px', width: '100%', height: '250px' }}
                modules={[Pagination, Scrollbar, A11y]}
                onSwiper={(swiper) => {
                  swiperRefs.current[i] = swiper
                }}
              >
                {swiperSlides.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <video
                        className='rounded-lg object-cover object-center w-full !h-[250px] bg-black'
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
                      <div className='relative flex h-[250px] w-full max-w-[312px] items-center justify-center overflow-hidden rounded-lg'>
                        <Image
                          className='listing-card-photo h-full w-full rounded-lg object-cover object-center !h-[250px]'
                          src={item.src}
                          height={253}
                          width={314}
                          alt={listing.title}
                        />
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
              {swiperSlides.length > 1 ? (
                <ListingCarouselNavButton
                  direction='next'
                  onClick={() => handleNextSlide(i)}
                />
              ) : null}
            </div>
            {/* Details section */}
            <div className='flex w-full min-w-0 flex-1 flex-col pr-14 sm:pr-20 sm:pt-8 xl:!max-w-[450px] xl:pt-10'>
              <span
                className={`capitalize lg:text-base text-sm${hasFeaturedStyling
                  ? 'text-gradient-custom text-light-gold capitalize'
                  : ''
                  }`}
              >
                {listing.assetType === 'Property Off Plan For Sale'
                  ? 'Off Plan Property'
                  : `${assetTypeText} for Sale`}
              </span>

              <div className='listing-card-meta flex w-full items-start justify-between gap-3'>
                <div className='min-w-0 flex-1 break-words text-left'>
                  <Link
                    href={getDynamicLink(
                      listing?.assetType,
                      getListingDetailId(listing),
                    )}
                    className='listing-card-title block w-full break-words text-left'
                  >
                    {hasFeaturedStyling ? (
                      <div className='flex flex-wrap items-start gap-2'>
                        <h2 className='min-w-0 flex-1 break-words text-gradient-custom lg:text-3xl sm:text-xl text-lg font-semibold capitalize'>
                          {listing.title}
                        </h2>
                        <div className='shrink-0 text-gradient-custom'>
                          <BlueTickIcon className='text-light-gold' />
                        </div>
                      </div>
                    ) : (
                      <h2 className='break-words lg:text-3xl sm:text-xl text-lg font-semibold capitalize text-blue'>
                        {listing.title}
                      </h2>
                    )}
                  </Link>
                </div>
              </div>
              <div className='overflow-hidden'>
                <div className='flex flex-col'>
                  <div className='flex flex-wrap items-center space-x-4'>
                    <p
                      className={`text-prussianBlue mb-2 lg:text-base text-sm font-medium ${hasFeaturedStyling ? 'text-gradient-custom' : 'text-blue'
                        }`}
                    >
                      {isOffPlan ? 'Price Range:' : 'Price:'}{' '}
                      {formatListingCardPrice(listing)}
                    </p>
                    {!isOffPlan ? (
                      <p
                        className={`mb-2 lg:text-base text-sm font-medium ${hasFeaturedStyling
                          ? 'text-gradient-custom'
                          : 'text-prussianBlue'
                          }`}
                      >
                        Market Price:
                        {formatCardPrice(listing.evaluationPrices)}
                      </p>
                    ) : null}
                    {assetTypeText === 'property' && !isOffPlan && (
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
                </div>
              </div>

              <div className='relative'>
                <button
                  type='button'
                  onClick={() =>
                    setAnalyticsCardId(
                      analyticsCardId === listing.uuid ? null : listing.uuid,
                    )
                  }
                  className='flex gap-2 items-center cursor-pointer'
                >
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
                    <span className='ml-1 text-xs opacity-80'>
                      ({formatNumberWithCommas(
                        listing?.analytics?.clicks ?? 0,
                      )}{' '}
                      views)
                    </span>
                  </p>
                </button>
                {analyticsCardId === listing.uuid ? (
                  <>
                    <div
                      className='fixed inset-0 z-40'
                      onClick={() => setAnalyticsCardId(null)}
                    />
                    <div className='absolute bottom-[calc(100%+10px)] left-0 z-50 w-[230px] rounded-lg border border-gray-100 bg-white p-4 shadow-lg'>
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='text-sm font-semibold text-prussianBlue'>
                          Listing analytics
                        </span>
                        <button
                          type='button'
                          onClick={() => setAnalyticsCardId(null)}
                          className='text-sm font-semibold text-dark-grey/60 hover:text-dark-grey'
                          aria-label='Close analytics'
                        >
                          ✕
                        </button>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-dark-grey/80'>
                            Views
                          </span>
                          <span className='text-sm font-semibold text-prussianBlue'>
                            {formatNumberWithCommas(
                              listing?.analytics?.clicks ?? 0,
                            )}
                          </span>
                        </div>
                      </div>
                      <p className='mt-3 text-[11px] leading-4 text-dark-grey/60'>
                        Views count when a visitor opens this listing only —
                        not when it appears with other cards.
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )
    })
  )
}
export default ListingCard
