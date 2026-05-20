'use client'
import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import Description from '@/components/Product_page/Description'
import LiftSlider from '@/components/Product_page/Left_slider'
import Review from '@/components/Product_page/Review'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { GoDotFill } from 'react-icons/go'
import { IoCheckmarkSharp } from 'react-icons/io5'
import Modal from '../product-modal/modal'
import Modal2 from '../product-modal/modal2'
import axios from 'axios'
import { FaStar } from 'react-icons/fa'
import { formatPriceUS } from '@/utils'
import {
  FaceBookIcon,
  InstaIcon,
  TwitterIcon,
  WhiteLinkdInIcon,
  WhiteTickTokIcon,
} from '../Icons'
import Open3dModal from '../3dModal/Open3dModal'
import { formatNumberWithCommas } from '../../utils/global-functions/global'
import ImageSlider from '../modules/Jewelry/ImageSlider'
import {
  getListingDetailMediaItems,
  getListingDocumentSrc,
  getTechnicalReportSrc,
} from '@/libs/listingCardMedia'

export default function ProductView({ data }) {
  const combinedMedia = getListingDetailMediaItems(data)
  const [previewMedia, setPreviewMedia] = useState(
    () => combinedMedia[0] || null,
  )

  const [reviewCounts, setReviewCounts] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/count`,
          { productId: data.uuid },
        )
        setReviewCounts(response.data.count || 0)
        setAverageRating(response.data.averageRating || 0)
      } catch (error) {
        console.error('Failed to fetch review data:', error)
      }
    }

    if (data.uuid) {
      fetchReviewData()
    }
  }, [data.uuid])

  const [showCalendarPopup, setShowCalendarPopup] = useState(false)
  const [openDiscription, setOpenDiscription] = useState(true)
  const [openReview, setOpenReview] = useState(false)
  const [openAdditional_info, setOpenAdditional_info] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(false)

  const handleOpenValues = (value) => {
    if (value === 'Description') {
      setOpenAdditional_info(false)
      setOpenReview(false)
      setOpenDiscription(true)
    } else if (value === 'Reviews') {
      setOpenDiscription(false)
      setOpenAdditional_info(false)
      setOpenReview(true)
    } else if (value === 'Additional') {
      setOpenDiscription(false)
      setOpenReview(false)
      setOpenAdditional_info(true)
    }
  }

  const truncateTitle = (title) => {
    const words = title?.split(' ')
    if (words?.length > 3) {
      return words?.slice(0, 3).join(' ') + '...'
    }
    return title
  }

  const handleArrangeViewingClick = () => {
    setShowCalendarPopup(true)
  }

  const handleCloseCalendarPopup = () => {
    setShowCalendarPopup(false)
  }

  const technicalReportSrc = getTechnicalReportSrc(data?.technicalReport)
  const evaluationCertificateSrc = getListingDocumentSrc(
    data?.evaluationCertificate,
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)

  const closeModal = () => setIsModalOpen(false)
  const closeModal2 = () => setIsModal2Open(false)

  return (
    <div className='theme-container'>
      <div className='sm:flex xl:flex-nowrap flex-wrap gap-6 lg:gap-12 pt-4 sm:pt-10 lg:pt-24 pb-5'>
        <div className='flex items-stretch sm:flex-row flex-col gap-4'>
          <div className='w-full md:block hidden sm:w-[160px] shrink-0'>
            <LiftSlider
              setPreviewMedia={setPreviewMedia}
              media={combinedMedia}
            />
          </div>
          <div className='w-fullblock md:hidden sm:w-[160px] shrink-0'>
            <ImageSlider media={combinedMedia} />
          </div>
          <div className='md:block hidden'>
            {previewMedia?.type === 'video' ? (
              <video
                key={previewMedia.src}
                controls
                playsInline
                preload='metadata'
                height={580}
                width={580}
                className='sm:w-[70%] lg:min-w-[580px] lg:min-h-[560px] object-cover rounded-lg bg-black'
                src={previewMedia.src}
              >
                Your browser does not support the video tag.
              </video>
            ) : previewMedia?.type === 'walkthrough' ? (
              <iframe
                src={previewMedia.src}
                height={580}
                width={580}
                className='sm:w-[70%] lg:min-w-[580px] lg:min-h-[560px] object-cover rounded-lg'
                frameBorder='0'
                allowFullScreen
                title='3D Walkthrough'
              />
            ) : (
              <div className='xl:w-[580px] w-full md:h-[560px]'>
                <img
                  alt='preview'
                  height={580}
                  width={580}
                  className='h-full w-full object-cover rounded-lg'
                  src={previewMedia?.src || '/assets/images/room.jpg'}
                />
              </div>
            )}
          </div>
        </div>
        <div className='relative flex space-y-2 xl:space-y-0 items-start flex-col justify-between mt-6 sm:mt-0'>
          <h1 className='text-wrap text-blue capitalize lg:text-3xl md:text-2xl text-xl truncate w-[90%] font-semibold mb-1'>
            {data?.title}
          </h1>
          <h2 className='md:text-sm text-[10px] text-black tracking-wide'>
            Availability: {data?.dealClosed ? 'Sold' : 'In Stock'}
          </h2>
          <div className='flex mb-2'>
            <span className='flex items-center'>
              {/* Render dynamic star ratings */}
              <div className='flex space-x-2 items-center justify-center'>
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <div key={starIndex} className='md:h-5 md:w-5 h-4 w-4'>
                    <FaStar
                      size={20}
                      color={
                        starIndex < Number(averageRating)
                          ? '#FFD700'
                          : '#D3D3D3'
                      }
                    />
                  </div>
                ))}
                <span className='ml-3 mt-2 md:text-base text-xs md:mt-0 opacity-50'>
                  {Number(averageRating)
                    ? Number(averageRating).toFixed(1)
                    : '0.0'}
                </span>
                <span className='ml-3 md:text-base text-xs mt-2 md:mt-0 opacity-50'>
                  {reviewCounts > 1
                    ? `(${reviewCounts} Reviews)`
                    : `(${reviewCounts} Review)`}
                </span>
              </div>
            </span>
          </div>
          <p className='leading-relaxed md:text-base text-xs text-black'>
            {data.description}
          </p>
          <div className='mt-3 space-y-3'>
            <h2 className='font-medium md:text-base text-sm mb-2'>Details</h2>
            <div className='flex gap-1 flex-wrap  items-center p-2 shadow rounded mb-2  sm:gap-5'>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='flex mr-1 sm:mr-2 text-gold-800' />{' '}
                Property Type:
                {data?.propertyType < 10
                  ? '0' + data?.propertyType
                  : data?.propertyType?.toString()}
              </span>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='flex mr-2 text-gold-800' /> Bedrooms:
                {data?.bedrooms < 10
                  ? '0' + data?.bedrooms
                  : data?.bedrooms?.toString()}
              </span>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='flex mr-2 text-gold-800' /> Bathrooms :
                {data?.bathrooms < 10
                  ? '0' + data?.bathrooms
                  : data?.bathrooms?.toString()}
              </span>
              {parseInt(data?.garages) ? (
                <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                  <GoDotFill className='flex mr-2 text-gold-800' /> Garage :
                  {data?.garages < 10
                    ? '0' + data?.garages
                    : data?.garages?.toString()}
                </span>
              ) : (
                <></>
              )}
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='flex mr-2 text-gold-800' /> SqFt :
                {data?.sizeSQFT < 10
                  ? '0' + data?.sizeSQFT
                  : formatNumberWithCommas(data?.sizeSQFT)}
              </span>
            </div>

            <div className='w-full flex flex-wrap gap-x-4 my-2'>
              <p className='text-reefGold md:text-base text-sm'>
                Selling Price: AED {formatPriceUS(data?.price)}
              </p>
              <p className='text-reefGold md:text-base text-sm'>
                Market Price: AED &nbsp;
                {formatNumberWithCommas(data?.evaluationPrices)}
              </p>
              <p className='text-reefGold md:text-base text-sm'>
                ROI: {data?.roi ? data.roi : 0}%
              </p>
            </div>
          </div>
          <div className='flex gap-3 flex-wrap items-center mt-2 xl:mt-0 xl:mb-0 mb-3'>
            <button
              className='flex text-white justify-center btn-gradient border-0 py-2 px-2 flex-grow focus:outline-none md:text-sm text-[10px] font-medium rounded'
              onClick={handleArrangeViewingClick}
            >
              Arrange Viewing
            </button>
            <div className='flex gap-3 ml-3'>
              {technicalReportSrc ? (
                <>
                  <div className='bg-[#E0E0E0] p-1 rounded relative group'>
                    <img
                      src='/icons/card1.png'
                      className='w-[23px] h-[23px] cursor-pointer'
                      alt='Technical report'
                      onClick={() => setIsModalOpen(true)}
                    />
                    <div className='absolute w-[200px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                      Technical Report
                    </div>
                  </div>
                  <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    fileUrl={technicalReportSrc}
                  />
                </>
              ) : null}

              {evaluationCertificateSrc ? (
                <>
                  <div className='bg-[#E0E0E0] p-1 rounded relative group'>
                    <img
                      src='/icons/card2.png'
                      className='w-[23px] h-[23px] cursor-pointer'
                      alt='Evaluation certificate'
                      onClick={() => setIsModal2Open(true)}
                    />
                    <div className='absolute w-[200px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                      Evaluation Certificate
                    </div>
                  </div>
                  <Modal2
                    isOpen={isModal2Open}
                    onClose={closeModal2}
                    file2Url={evaluationCertificateSrc}
                    downloadFileName={data?.evaluationCertificate?.Certificate?.name}
                    modalTitle='Evaluation Certificate'
                  />
                </>
              ) : (
                ' '
              )}
              {data?.video3DWalkthrough?.link ? (
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
                    <div className='absolute w-[200px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
                      3D Walkthrough
                    </div>
                  </div>
                  {selectedMedia && (
                    <Open3dModal
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                      link={data?.video3DWalkthrough?.link}
                    />
                  )}
                </>
              ) : (
                ' '
              )}
            </div>
          </div>
          <span className='font-medium md:text-lg text-base mb-2 block'>
            Ref: {data?.uuid ? data.uuid.slice(0, 8) : 'N/A'}
          </span>
          <div className='flex justify-between w-full items-end'>
            <div className='flex gap-5 font-medium  items-center'>
              <span className='md:text-lg text-base'>Share:</span>
              <div className='flex gap-2'>
                <Link href='#'>
                  <FaceBookIcon className='h-[16px] w-[16px]' />
                </Link>
                <Link href='#'>
                  <InstaIcon className='h-[16px] w-[16px]' />
                </Link>
                <Link href='#'>
                  <WhiteLinkdInIcon className='h-[16px] w-[16px]' />
                </Link>
                <Link href='#'>
                  <TwitterIcon className='h-[16px] w-[16px]' />
                </Link>
                <Link href='#'>
                  <WhiteTickTokIcon className='h-[16px] w-[16px]' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-light-gray  sm:p-5 rounded-md'>
        <div className='flex gap-2 sm:gap-4 md:pb-4 justify-center'>
          <button
            onClick={() => handleOpenValues('Description')}
            className={`flex-grow md:text-base text-xs flex justify-center py-1 ${openDiscription
              ? 'text-lightBlue  bg-gradient-to-r text-white sm:text-black from-[#a2913e] via-[#d7c590] to-[#a2913e] md:bg-none md:border-b-2 md:border-gold-800'
              : 'text-black'
              }`}
          >
            Description
          </button>
          <button
            onClick={() => handleOpenValues('Reviews')}
            className={`flex-grow md:text-base text-xs flex justify-center py-1 ${openReview
              ? 'text-lightBlue  bg-gradient-to-r text-white sm:text-black from-[#a2913e] via-[#d7c590] to-[#a2913e] md:bg-none md:border-b-2 md:border-gold-800'
              : 'text-black'
              }`}
          >
            Reviews
          </button>
          <button
            onClick={() => handleOpenValues('Additional')}
            className={`flex-grow md:text-base text-xs flex justify-center py-1 ${openAdditional_info
              ? 'text-lightBlue  bg-gradient-to-r text-white sm:text-black from-[#a2913e] via-[#d7c590] to-[#a2913e] md:bg-none md:border-b-2 md:border-gold-800'
              : 'text-black'
              }`}
          >
            Additional Information
          </button>
        </div>
        {openDiscription && (
          <>
            {data.additionalDescription !== '' ? (
              <Description text={data.additionalDescription} />
            ) : (
              <Description text={'No Description For this Product'} />
            )}
          </>
        )}
        {openReview && <Review productdata={data} />}
        {openAdditional_info && (
          <>
            {data.facilities.length !== 0 ? (
              <div className='md:grid flex flex-wrap grid-cols-3'>
                {data.facilities.map((item, columnIndex) => (
                  <div key={columnIndex} className='col-span-1'>
                    <div className='text-base flex flex-row flex-wrap font-normal'>
                      <div className='flex flex-row flex-wrap items-center p-2 space-x-2'>
                        <IoCheckmarkSharp
                          className='md:mr-4 border border-reefGold'
                          color='#A2913E'
                        />
                        <span className='md:text-base text-xs'>{item}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='w-full flex items-center justify-center text-prussianBlue text-xl py-5'>
                No Additional Facilities!
              </div>
            )}
          </>
        )}
      </div>
      {showCalendarPopup && (
        <CalendarPopup onClose={handleCloseCalendarPopup} productData={data} />
      )}
    </div>
  )
}
