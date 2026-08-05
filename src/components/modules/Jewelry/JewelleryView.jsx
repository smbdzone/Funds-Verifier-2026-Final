'use client'

import React, { useMemo, useState } from 'react'
import Description from '@/components/Product_page/Description'
import Review from '@/components/Product_page/Review'
import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import { formatPriceUS } from '@/utils'
import Open3dModal from '@/components/3dModal/Open3dModal'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import Modal2 from '@/components/product-modal/modal2'
import Modal from '@/components/product-modal/modal'
import { formatNumberWithCommas } from '../../../utils/global-functions/global'
import {
  getListingDetailMediaItems,
  getListingDocumentSrc,
  getListingQrScanSrc,
  getTechnicalReportSrc,
} from '@/libs/listingCardMedia'
import { getListingRef } from '@/libs/listingRef'
import ListingQrCodeSection from '@/components/shared/ListingQrCodeSection'
import ListingDetailsGrid from '@/components/shared/ListingDetailsGrid'
import ListingDetailMediaColumn from '@/components/shared/ListingDetailMediaColumn'
import ListingAmenitiesPanel from '@/components/shared/ListingAmenitiesPanel'
import { getListingAmenities } from '@/libs/listingAmenities'
import { formatListingLocation } from '@/libs/listingLocationUtils'
import { isOwnListing } from '@/libs/isOwnListing'
import { useProfile } from '@/context/UserContext'

const TABS = ['Description', 'Reviews', 'Amenities']

export default function JewelleryView({ data }) {
  const { user } = useProfile()
  const ownsListing = isOwnListing(data, user)
  const combinedMedia = getListingDetailMediaItems(data)
  const [previewMedia, setPreviewMedia] = useState(
    () => combinedMedia[0] || null,
  )
  const [activeTab, setActiveTab] = useState('Description')
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(false)

  const detailRows = useMemo(
    () => [
      { label: 'Location', value: formatListingLocation(data), fullWidth: true },
      { label: 'Grams', value: data?.grams },
      { label: 'Age', value: data?.age },
      { label: 'Category', value: data?.model },
      {
        label: 'Materials',
        value: Array.isArray(data?.materials)
          ? data.materials.filter(Boolean).join(', ')
          : '',
        fullWidth: true,
      },
      { label: 'Quantity', value: '01' },
      { label: 'DLD Number', value: data?.dldNumber },
    ],
    [data],
  )

  const amenities = useMemo(() => getListingAmenities(data), [data])
  const technicalReportSrc = getTechnicalReportSrc(data?.technicalReport)
  const evaluationCertificateSrc = getListingDocumentSrc(
    data?.evaluationCertificate,
  )

  const tabButtonClass = (tab) =>
    `flex-grow md:text-base text-xs flex justify-center py-1 ${
      activeTab === tab
        ? 'text-lightBlue bg-gradient-to-r text-white sm:text-black from-[#a2913e] via-[#d7c590] to-[#a2913e] md:bg-none md:border-b-2 md:border-gold-800'
        : 'text-black'
    }`

  return (
    <div className='theme-container'>
      <div className='flex flex-wrap gap-6 pb-5 pt-4 sm:pt-10 lg:flex-nowrap lg:gap-12 lg:pt-24'>
        <ListingDetailMediaColumn
          media={combinedMedia}
          previewMedia={previewMedia}
          setPreviewMedia={setPreviewMedia}
          mapUrl={data?.mapUrl}
          imageAlt={data?.title || 'Jewellery'}
        />

        <div className='relative mt-6 flex w-full flex-col items-start gap-5 sm:mt-0'>
          <h1 className='w-[90%] truncate text-wrap text-xl font-semibold capitalize text-blue md:text-2xl lg:text-3xl'>
            {data?.title}
          </h1>

          <div className='flex w-full flex-col gap-3'>
            <h2 className='text-sm font-medium md:text-base'>Details</h2>
            <ListingDetailsGrid rows={detailRows} />
          </div>

          <div className='flex w-full flex-wrap gap-x-4 gap-y-1'>
            <p className='text-sm text-reefGold md:text-base'>
              Selling Price: AED {formatPriceUS(data?.price)}
            </p>
            <p className='text-sm text-reefGold md:text-base'>
              Market Price: AED {formatNumberWithCommas(data?.evaluationPrices)}
            </p>
          </div>

          <div className='flex w-full flex-wrap items-center gap-3'>
            {!ownsListing ? (
              <button
                type='button'
                onClick={() => setShowCalendarPopup(true)}
                className='btn-gradient flex w-full justify-center rounded border-0 px-5 py-3 text-xs font-medium text-white focus:outline-none sm:w-auto md:text-sm'
              >
                Arrange Viewing
              </button>
            ) : null}
            <div className='flex gap-3'>
              {technicalReportSrc ? (
                <>
                  <div className='rounded bg-[#E0E0E0] p-1'>
                    <img
                      src='/icons/card1.png'
                      className='h-[23px] w-[23px] cursor-pointer'
                      alt='Technical report'
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    fileUrl={technicalReportSrc}
                  />
                </>
              ) : null}
              {evaluationCertificateSrc ? (
                <>
                  <div className='rounded bg-[#E0E0E0] p-1'>
                    <img
                      src='/icons/card2.png'
                      className='h-[23px] w-[23px] cursor-pointer'
                      alt='Evaluation certificate'
                      onClick={() => setIsModal2Open(true)}
                    />
                  </div>
                  <Modal2
                    isOpen={isModal2Open}
                    onClose={() => setIsModal2Open(false)}
                    file2Url={evaluationCertificateSrc}
                    downloadFileName={
                      data?.evaluationCertificate?.Certificate?.name
                    }
                  />
                </>
              ) : null}
              {data?.video3DWalkthrough?.link ? (
                <>
                  <div
                    onClick={() => setSelectedMedia(true)}
                    className='rounded bg-[#E0E0E0] p-1'
                  >
                    <img
                      src='/icons/3dicon.png'
                      className='h-[23px] w-[23px] cursor-pointer'
                      alt='3D Walkthrough'
                    />
                  </div>
                  {selectedMedia ? (
                    <Open3dModal
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                      link={data?.video3DWalkthrough?.link}
                    />
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          <div className='flex w-full flex-col gap-4 border-t border-black/10 pt-5'>
            <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <span className='text-base font-medium text-black md:text-lg'>
                Ref: {getListingRef(data)}
              </span>
              <ListingSocialShare listing={data} linkedinIcon='white' />
            </div>
            <ListingQrCodeSection src={getListingQrScanSrc(data)} />
          </div>
        </div>
      </div>

      <div className='rounded-md bg-light-gray sm:p-5'>
        <div className='flex flex-wrap justify-center gap-2 pb-4 md:gap-4'>
          {TABS.map((tab) => (
            <button
              key={tab}
              type='button'
              onClick={() => setActiveTab(tab)}
              className={tabButtonClass(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Description' ? (
          <div className='space-y-4'>
            {data?.description ? <Description text={data.description} /> : null}
            {data?.additionalDescription &&
            data.additionalDescription !== data?.description ? (
              <Description text={data.additionalDescription} />
            ) : null}
            {!data?.description && !data?.additionalDescription ? (
              <p className='px-4 py-6 text-sm text-black/60'>
                No description available.
              </p>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'Reviews' ? <Review productdata={data} /> : null}

        {activeTab === 'Amenities' ? (
          <ListingAmenitiesPanel amenities={amenities} />
        ) : null}
      </div>

      {showCalendarPopup ? (
        <CalendarPopup
          onClose={() => setShowCalendarPopup(false)}
          productData={data}
        />
      ) : null}
    </div>
  )
}
