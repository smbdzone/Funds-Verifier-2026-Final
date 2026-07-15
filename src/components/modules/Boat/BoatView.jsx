'use client'
import React, { useState } from 'react'
import LeftSlider from '@/components/Product_page/Left_slider'
import Image from 'next/image'
import { GoDotFill } from 'react-icons/go'
import { Rating } from '@mui/material'
import { IoCheckmarkSharp } from 'react-icons/io5'
import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import Link from 'next/link'
import Description from '@/components/Product_page/Description'
import Review from '@/components/Product_page/Review'
import Open3dModal from '@/components/3dModal/Open3dModal'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import Modal2 from '@/components/product-modal/modal2'
import Modal from '@/components/product-modal/modal'
import ImageSlider from '../Jewelry/ImageSlider'
import { formatNumberWithCommas } from '../../../utils/global-functions/global'
import { formatPriceUS } from '@/utils'
import {
  getListingDetailMediaItems,
  getListingDocumentSrc,
  getTechnicalReportSrc,
} from '@/libs/listingCardMedia'

export default function BoatView({ data: boatData }) {
  const data = boatData ?? {}
  const combinedMedia = getListingDetailMediaItems(data)
  const extrasList = Array.isArray(data?.extras) ? data.extras : []
  const interiorColors = Array.isArray(data?.interiorColor)
    ? data.interiorColor
    : []
  const [previewMedia, setPreviewMedia] = useState(
    () => combinedMedia[0] || null,
  )
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)
  const [openDiscription, setOpenDiscription] = useState(true)
  const [openReview, setOpenReview] = useState(false)
  const [openAdditional_info, setOpenAdditional_info] = useState(false)

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
    const words = title?.split(' ') ?? []
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '...'
    }
    return title
  }

  const handleArrangeViewingClick = () => {
    setShowCalendarPopup(true)
  }

  const handleCloseCalendarPopup = () => {
    setShowCalendarPopup(false)
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const closeModal2 = () => {
    setIsModal2Open(false)
  }

  const technicalReportSrc = getTechnicalReportSrc(data?.technicalReport)
  const evaluationCertificateSrc = getListingDocumentSrc(
    data?.evaluationCertificate,
  )
  const [technicalRep, setTechnicalRep] = useState(() => technicalReportSrc)
  const [certificateRep, setcertificateRep] = useState(
    () => evaluationCertificateSrc,
  )

  const openTechnicalReport = () => {
    if (technicalRep) {
      setIsModalOpen(true)
    } else {
      console.error('No valid report URL available.')
    }
  }
  const openEvaluationCertificate = () => {
    if (certificateRep) {
      setIsModal2Open(true)
    } else {
      console.error('No valid certificate URL available.')
    }
  }

  if (!boatData) return null

  return (
    <div className='theme-container'>
      <div className='sm:flex xl:flex-nowrap flex-wrap gap-6 lg:gap-12 pt-4 sm:pt-10 lg:pt-24 pb-5'>
        <div className='flex items-stretch sm:flex-row flex-col gap-4'>
          <div className='w-full md:block hidden sm:w-[160px] shrink-0'>
            <LeftSlider
              setPreviewMedia={setPreviewMedia}
              media={combinedMedia}
            />
          </div>

          <div className='w-full block md:hidden sm:w-[160px] shrink-0'>
            <ImageSlider media={combinedMedia} />
          </div>
          <div className='md:block hidden'>
            {previewMedia?.type === 'video' ? (
              <video
                controls
                height={580}
                width={580}
                className='lg:w-[70%] lg:min-w-[580px] lg:min-h-[560px] object-cover rounded-lg'
                src={previewMedia.src}
              >
                Your browser does not support the video tag.
              </video>
            ) : previewMedia?.type === 'walkthrough' ? (
              <iframe
                src={previewMedia.src}
                height={580}
                width={580}
                className='lg:w-[70%] lg:min-w-[580px] lg:min-h-[560px] object-cover rounded-lg'
                frameBorder='0'
                allowFullScreen
                title='3D Walkthrough'
              />
            ) : (
              <div className='xl:w-[580px] w-full md:h-[560px]'>
                <Image
                  alt='preview'
                  quality={100}
                  height={580}
                  width={580}
                  className='h-full object-cover rounded-lg'
                  src={previewMedia?.src || '/assets/images/room.jpg'}
                />
              </div>
            )}
          </div>
        </div>
        <div className='relative flex items-start flex-col justify-between mt-6 sm:mt-0'>
          <h1 className='text-wrap text-blue capitalize lg:text-3xl md:text-2xl text-xl truncate font-semibold mb-1'>
            {data?.title}
          </h1>
          <h2 className='md:text-sm text-[10px] text-black tracking-wide'>
            Availability: {data?.dealClosed ? 'Sold' : 'In Stock'}
          </h2>
          <div className='flex mb-2'>
            <span className='flex items-center'>
              <Rating
                className='md:text-base text-sm'
                name='half-rating-read'
                defaultValue={data?.totalRating || 0}
                precision={0.5}
                readOnly
              />
              <span className='text-gray-600 md:text-base text-xs ml-3'>
                {data?.totalRating} Reviews
              </span>
            </span>
          </div>
          <Description text={data?.description} />
          <div className='mt-3 w-full'>
            <h2 className='font-medium md:text-base text-sm mb-2'>Details</h2>
            <div className='flex flex-wrap items-center p-1 shadow rounded mb-2 gap-x-4 gap-y-2 sm:gap-5'>
              <span className='flex flex-row items-center text-[9px] sm:text-xs md:text-sm'>
                <GoDotFill className='flex mr-1 sm:mr-2 text-gold-800' /> Model:
                {data?.model}
              </span>
              <span className='flex flex-row items-center  text-[9px] sm:text-xs  md:text-sm'>
                <GoDotFill className='flex mr-1 sm:mr-2 text-gold-800' /> Age:
                {data?.age}
              </span>

              <span className='flex flex-row items-center  text-[9px] sm:text-xs  md:text-sm'>
                <GoDotFill className='flex mr-1 sm:mr-2 text-gold-800' />{' '}
                Length:
                {data?.length}
              </span>

              <span className='flex w- flex-wrap flex-row items-center  text-[9px] sm:text-xs  md:text-sm'>
                <GoDotFill className='flex mr-1 sm:mr-2 text-gold-800' />
                Interior Color:
                {interiorColors.map((col, i) => (
                  <span key={col + i} className='mx-1'>
                    {col}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className='w-full flex flex-wrap gap-x-4 my-2'>
            <p className='text-reefGold md:text-base text-sm'>
              Selling Price: AED {formatPriceUS(data?.price)}
            </p>
            <p className='text-reefGold md:text-base text-sm'>
              Market Price: AED &nbsp;
              {formatNumberWithCommas(data?.evaluationPrices)}
            </p>
          </div>
          <div className='flex gap-3 flex-wrap items-center mb-5'>
            <button
              onClick={handleArrangeViewingClick}
              className='flex text-white justify-center btn-gradient border-0 py-2 sm:px-2 px-1  flex-grow focus:outline-none md:text-sm text-[10px] font-medium rounded'
            >
              Arrange Viewing
            </button>
            <div className='flex gap-3 ml-3'>
              {technicalReportSrc ? (
                <>
                  <div className='bg-[#E0E0E0] p-1 rounded relative group'>
                    <img
                      src='/icons/card1.png'
                      className='w-[23px] h-[23px]  cursor-pointer'
                      onClick={() => openTechnicalReport(technicalReportSrc)}
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
                      onClick={() =>
                        openEvaluationCertificate(evaluationCertificateSrc)
                      }
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
          <div className='flex w-full justify-between'>
            <ListingSocialShare
              listing={{ ...data, type: 'boat' }}
              linkedinIcon='white'
            />
          </div>
        </div>
      </div>
      <div className='bg-light-gray p-5 rounded-md'>
        <div className='flex gap-4 pb-4 justify-center'>
          <button
            className={`flex-grow md:text-base text-xs flex justify-center py-1 ${openDiscription
              ? 'text-lightBlue border-b-2 border-gold-800'
              : 'text-black'
              }`}
            onClick={() => {
              handleOpenValues('Description')
            }}
          >
            DESCRIPTION
          </button>
          <button
            className={`flex-grow md:text-base text-xs flex justify-center py-1 ${openAdditional_info
              ? 'text-lightBlue border-b-2 border-gold-800'
              : 'text-black'
              }`}
            onClick={() => {
              handleOpenValues('Additional')
            }}
          >
            ADDITIONAL INFORMATION
          </button>
          <button
            className={`flex-grow md:text-base text-xs flex justify-center py-1 ${openReview
              ? 'text-lightBlue border-b-2 border-gold-800'
              : 'text-black'
              }`}
            onClick={() => {
              handleOpenValues('Reviews')
            }}
          >
            REVIEWS
          </button>
        </div>

        {openAdditional_info && (
          <>
            {extrasList.length > 0 ? (
              <div className='md:grid flex flex-wrap grid-cols-4'>
                {extrasList.map((item, columnIndex) => (
                  <div key={columnIndex} className='col-span-1'>
                    <div className='text-base font-normal'>
                      <div className='flex flex-row flex-wrap items-center p-2 space-x-2'>
                        <IoCheckmarkSharp className='md:mr-4 mr-1' /> {item}
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

        {openDiscription && (
          <>
            {data?.description ? (
              <Description text={data.description} />
            ) : (
              <Description text={'No Description For this Product'} />
            )}
          </>
        )}
        {openReview && (
          <div>
            <Review productdata={data} />
          </div>
        )}
        {showCalendarPopup && (
          <CalendarPopup
            onClose={handleCloseCalendarPopup}
            productData={data}
          />
        )}
      </div>
    </div>
  )
}
