'use client'

import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import Description from '@/components/Product_page/Description'
import Review from '@/components/Product_page/Review'
import OffPlanLayoutFloorPlanDisplay from '@/components/offplan/OffPlanLayoutFloorPlanDisplay'
import OffPlanPaymentPlanDisplay from '@/components/offplan/OffPlanPaymentPlanDisplay'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import ListingQrCodeSection from '@/components/shared/ListingQrCodeSection'
import ListingDetailsGrid from '@/components/shared/ListingDetailsGrid'
import ListingDetailCertificates from '@/components/shared/ListingDetailCertificates'
import ListingDetailTitleRow from '@/components/shared/ListingDetailTitleRow'
import ListingDetailsHeading from '@/components/shared/ListingDetailsHeading'
import ListingDetailMediaColumn from '@/components/shared/ListingDetailMediaColumn'
import ArrangeViewingButton from '@/components/shared/ArrangeViewingButton'
import { formatOffPlanPriceRange } from '@/constants/offPlanDummyListings'
import { formatPropertySizeDisplay } from '@/libs/propertySizeUnits'
import { getListingAmenities } from '@/libs/listingAmenities'
import { formatListingLocation } from '@/libs/listingLocationUtils'
import { getListingDetailMediaItems } from '@/libs/listingCardMedia'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { IoCheckmarkSharp } from 'react-icons/io5'

const TABS = [
  'Description',
  'Reviews',
  'Amenities',
  'Payment Plan',
  'Layout & Floor Plan',
]

export default function OffPlanProductView({ data }) {
  const [activeTab, setActiveTab] = useState('Description')
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)

  const combinedMedia = useMemo(() => {
    const fromListing = getListingDetailMediaItems(data)
    if (fromListing.length) return fromListing
    const fallbackImages = Array.isArray(data?.images) ? data.images : []
    if (fallbackImages.length) {
      return fallbackImages.map((src) => ({ type: 'image', src }))
    }
    return [{ type: 'image', src: '/offplan/image1.svg' }]
  }, [data])

  const [previewMedia, setPreviewMedia] = useState(() => {
    const media = getListingDetailMediaItems(data)
    return (
      media.find((item) => item.type === 'image') ||
      media[0] ||
      (data?.images?.[0] ? { type: 'image', src: data.images[0] } : null) ||
      { type: 'image', src: '/offplan/image1.svg' }
    )
  })

  useEffect(() => {
    const next =
      combinedMedia.find((item) => item.type === 'image') ||
      combinedMedia[0] ||
      null
    setPreviewMedia(next)
  }, [combinedMedia])

  const bookingProductData = useMemo(
    () => ({
      ...data,
      assetType: data?.assetType || 'Property Off Plan For Sale',
    }),
    [data],
  )

  const detailRows = useMemo(() => {
    const sizeLabel = formatPropertySizeDisplay(data)

    const pad = (value) => {
      if (value == null || value === '') return ''
      if (Number(value) === 0) return 'Studio'
      const num = Number(value)
      if (Number.isFinite(num)) return String(num).padStart(2, '0')
      return String(value)
    }

    return [
      { label: 'Location', value: formatListingLocation(data), fullWidth: true },
      { label: 'Developer', value: data?.developer },
      { label: 'Property Type', value: data?.propertyType },
      { label: 'Bedrooms', value: pad(data?.bedrooms) },
      { label: 'Bathrooms', value: pad(data?.bathrooms) },
      { label: 'Size', value: sizeLabel, fullWidth: true },
      {
        label: 'Payment Plan',
        value: data?.paymentPlanLabel || data?.paymentPlanType,
      },
      { label: 'Layout', value: data?.layout },
      { label: 'Number of Floors', value: data?.numberOfFloors },
      { label: 'Available Apartments', value: data?.availableApartment },
      { label: 'Project Number', value: data?.dldNumber },
      {
        label: 'Price Range',
        value: formatOffPlanPriceRange(data?.priceFrom, data?.priceTo),
        fullWidth: true,
      },
    ]
  }, [data])

  const amenities = useMemo(() => getListingAmenities(data), [data])

  const tabButtonClass = (tab) =>
    `flex-grow px-1.5 py-1 text-[10px] leading-tight sm:px-2 sm:text-xs md:text-base md:leading-normal flex justify-center ${activeTab === tab
      ? 'text-lightBlue bg-gradient-to-r text-white sm:text-black from-[#a2913e] via-[#d7c590] to-[#a2913e] md:bg-none md:border-b-2 md:border-gold-800'
      : 'text-black'
    }`

  const handleDeveloperRequestClick = () => {
    setShowCalendarPopup(true)
  }

  const handleCloseCalendarPopup = () => {
    setShowCalendarPopup(false)
  }

  return (
    <div className='theme-container !max-w-none w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
      <div className='flex w-full flex-col gap-6 pb-5 pt-4 sm:pt-10 min-[700px]:pt-12 xl:flex-row xl:flex-nowrap xl:gap-12 xl:pt-24'>
        <ListingDetailMediaColumn
          media={combinedMedia}
          previewMedia={previewMedia}
          setPreviewMedia={setPreviewMedia}
          mapUrl={data?.mapUrl}
          imageAlt={data?.title || 'Off-plan property'}
        />

        <div className='relative mt-2 flex w-full min-w-0 flex-col items-start gap-5 xl:mt-0 xl:flex-1'>
          <ListingDetailTitleRow listing={data} hideApprovedBadge />

          <div className='flex w-full min-w-0 flex-col gap-3'>
            <ListingDetailsHeading listing={data} />
            <ListingDetailsGrid
              rows={detailRows}
              className='grid w-full grid-cols-1 gap-3 rounded-md border border-black/10 bg-white p-4 shadow min-[700px]:grid-cols-2 min-[700px]:gap-4 min-[700px]:p-5'
              itemClassName='flex min-w-0 items-start break-words text-xs sm:text-sm'
            />
          </div>

          {data?.deliveryLabel ? (
            <p className='text-sm tracking-wide text-black md:text-base'>
              Ready: {data.deliveryLabel}
            </p>
          ) : null}

          <ArrangeViewingButton
            listing={data}
            onAuthenticated={handleDeveloperRequestClick}
          />

          <ListingDetailCertificates listing={data} />

          <div className='flex w-full flex-col gap-4 border-t border-black/10 pt-5'>
            <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <div className='relative h-[70px] w-[78px] shrink-0 overflow-hidden rounded-sm bg-[#D9D9D9]'>
                  <Image
                    src={getProfileImageSrc(data?.developerAvatar)}
                    alt={data?.developer || 'Seller'}
                    width={78}
                    height={70}
                    className='h-[70px] w-[78px] object-cover'
                  />
                </div>
                <span className='text-base font-medium text-black md:text-lg'>
                  Ref: {data?.ref}
                </span>
              </div>
              <ListingSocialShare listing={data} linkedinIcon='white' />
            </div>

            <ListingQrCodeSection listing={data} src={data?.qrScanSrc} />
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
          amenities.length ? (
            <div className='px-2 sm:px-4'>
              <div className='grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3'>
                {amenities.map((item) => (
                  <div
                    key={item}
                    className='flex items-center gap-2 p-2 text-base font-normal'
                  >
                    <IoCheckmarkSharp
                      className='shrink-0 border border-reefGold'
                      color='#A2913E'
                    />
                    <span className='text-xs md:text-base'>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className='px-4 py-6 text-sm text-black/60'>
              No amenities listed for this property.
            </p>
          )
        ) : null}

        {activeTab === 'Payment Plan' ? (
          <OffPlanPaymentPlanDisplay paymentPlan={data?.paymentPlan} />
        ) : null}

        {activeTab === 'Layout & Floor Plan' ? (
          <OffPlanLayoutFloorPlanDisplay
            unitLayout={data?.unitLayout}
            floorPlan={data?.floorPlan}
          />
        ) : null}
      </div>

      {showCalendarPopup ? (
        <CalendarPopup
          onClose={handleCloseCalendarPopup}
          productData={bookingProductData}
        />
      ) : null}
    </div>
  )
}
