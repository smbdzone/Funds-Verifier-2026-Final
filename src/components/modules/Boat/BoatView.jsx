'use client'

import React, { useMemo, useState } from 'react'
import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import Description from '@/components/Product_page/Description'
import Review from '@/components/Product_page/Review'
import Open3dModal from '@/components/3dModal/Open3dModal'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import Modal2 from '@/components/product-modal/modal2'
import Modal from '@/components/product-modal/modal'
import {
  formatNumberWithCommas,
  formatColorList,
} from '../../../utils/global-functions/global'
import { formatPriceUS } from '@/utils'
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
import ListingDetailTitleRow from '@/components/shared/ListingDetailTitleRow'
import ListingDetailsHeading from '@/components/shared/ListingDetailsHeading'
import ArrangeViewingButton from '@/components/shared/ArrangeViewingButton'
import ListingAmenitiesPanel from '@/components/shared/ListingAmenitiesPanel'
import { getListingAmenities } from '@/libs/listingAmenities'
import { formatListingLocation, shouldShowProjectNumber } from '@/libs/listingLocationUtils'

const TABS = ['Description', 'Reviews', 'Amenities']

export default function BoatView({ data: boatData }) {
  const data = boatData ?? {}
  const combinedMedia = useMemo(
    () => getListingDetailMediaItems(data),
    [data],
  )
  const [previewMedia, setPreviewMedia] = useState(() => {
    const media = getListingDetailMediaItems(data)
    return media.find((item) => item.type === 'image') || media[0] || null
  })
  const [activeTab, setActiveTab] = useState('Description')
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(false)

  const detailRows = useMemo(
    () => [
      { label: 'Location', value: formatListingLocation(data) },
      { label: 'Brand', value: data?.brands },
      { label: 'Model', value: data?.model },
      { label: 'Category', value: data?.category },
      { label: 'Length', value: data?.length },
      { label: 'Age', value: data?.age },
      { label: 'Seats', value: data?.seats },
      { label: 'Condition', value: data?.condition },
      { label: 'Usage', value: data?.usage },
      {
        label: 'Warranty',
        value: data?.warranty || data?.warrenty,
      },
      { label: 'Weight', value: data?.weight },
      {
        label: 'Exterior Color',
        value: formatColorList(data?.exteriorColor),
      },
      {
        label: 'Interior Color',
        value: formatColorList(data?.interiorColor),
      },
      {
        label: 'Exterior Two Tone',
        value: formatColorList(data?.exteriorTwoTone),
      },
      {
        label: 'Interior Two Tone',
        value: formatColorList(data?.interiorTwoTone),
      },
      {
        label: 'Project Number',
        value: shouldShowProjectNumber(data) ? data?.dldNumber : '',
      },
    ],
    [data],
  )

  const amenities = useMemo(() => getListingAmenities(data), [data])
  const technicalReportSrc = getTechnicalReportSrc(data?.technicalReport)
  const evaluationCertificateSrc = getListingDocumentSrc(
    data?.evaluationCertificate,
  )

  const tabButtonClass = (tab) =>
    `flex-grow px-1.5 py-1 text-[10px] leading-tight sm:px-2 sm:text-xs md:text-base md:leading-normal flex justify-center ${activeTab === tab
      ? 'text-lightBlue bg-gradient-to-r text-white sm:text-black from-[#a2913e] via-[#d7c590] to-[#a2913e] md:bg-none md:border-b-2 md:border-gold-800'
      : 'text-black'
    }`

  if (!boatData) return null

  return (
    <div className='theme-container !max-w-none w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
      <div className='flex w-full flex-col gap-6 pb-5 pt-4 sm:pt-10 min-[700px]:pt-12 xl:flex-row xl:flex-nowrap xl:gap-12 xl:pt-24'>
        <ListingDetailMediaColumn
          media={combinedMedia}
          previewMedia={previewMedia}
          setPreviewMedia={setPreviewMedia}
          showMap={false}
          imageAlt={data?.title || 'Boat'}
        />

        <div className='relative mt-2 flex w-full min-w-0 flex-col items-start gap-5 xl:mt-0 xl:flex-1'>
          <ListingDetailTitleRow listing={data} />

          <div className='flex w-full min-w-0 flex-col gap-3'>
            <ListingDetailsHeading listing={data} />
            <ListingDetailsGrid
              rows={detailRows}
            />
          </div>

          <div className='flex w-full flex-wrap gap-x-4 gap-y-1'>
            <p className='text-sm font-semibold text-reefGold md:text-base'>
              Selling Price: AED {formatPriceUS(data?.price)}
            </p>
            <p className='text-sm font-semibold text-reefGold md:text-base'>
              Market Price: AED {formatNumberWithCommas(data?.evaluationPrices)}
            </p>
          </div>

          <div className='flex w-full flex-wrap items-center gap-3'>
            <ArrangeViewingButton
              listing={data}
              onAuthenticated={() => setShowCalendarPopup(true)}
            />
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
            <ListingQrCodeSection listing={data} src={getListingQrScanSrc(data)} />
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
