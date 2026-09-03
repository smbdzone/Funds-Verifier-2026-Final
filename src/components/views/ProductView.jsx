'use client'

import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import Description from '@/components/Product_page/Description'
import Review from '@/components/Product_page/Review'
import React, { useEffect, useMemo, useState } from 'react'
import { formatPriceUS } from '@/utils'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import { formatNumberWithCommas } from '../../utils/global-functions/global'
import { formatPropertySizeDisplay } from '@/libs/propertySizeUnits'
import {
  getListingDetailMediaItems,
  getListingQrScanSrc,
} from '@/libs/listingCardMedia'
import { getListingRef } from '@/libs/listingRef'
import ListingQrCodeSection from '@/components/shared/ListingQrCodeSection'
import ListingDetailsGrid from '@/components/shared/ListingDetailsGrid'
import ListingDetailMediaColumn from '@/components/shared/ListingDetailMediaColumn'
import ListingAmenitiesPanel from '@/components/shared/ListingAmenitiesPanel'
import ListingDetailCertificates from '@/components/shared/ListingDetailCertificates'
import ListingDetailTitleRow from '@/components/shared/ListingDetailTitleRow'
import ListingDetailsHeading from '@/components/shared/ListingDetailsHeading'
import ArrangeViewingButton from '@/components/shared/ArrangeViewingButton'
import OffPlanLayoutFloorPlanDisplay from '@/components/offplan/OffPlanLayoutFloorPlanDisplay'
import { getListingAmenities } from '@/libs/listingAmenities'
import { formatListingLocation } from '@/libs/listingLocationUtils'
import { isOwnListing } from '@/libs/isOwnListing'
import { resolveLayoutImageSrc } from '@/libs/offPlanListings'
import { useProfile } from '@/context/UserContext'

const TABS = ['Description', 'Reviews', 'Amenities', 'Layout & Floor Plan']

export default function ProductView({ data }) {
  const { user } = useProfile()
  const ownsListing = isOwnListing(data, user)
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

  useEffect(() => {
    const next =
      combinedMedia.find((item) => item.type === 'image') ||
      combinedMedia[0] ||
      null
    setPreviewMedia((prev) => {
      if (!next) return null
      if (prev?.src && combinedMedia.some((item) => item.src === prev.src)) {
        return prev
      }
      return next
    })
  }, [combinedMedia])

  const unitLayoutSrc = useMemo(
    () => resolveLayoutImageSrc(data?.unitLayout),
    [data?.unitLayout],
  )
  const floorPlanSrc = useMemo(
    () => resolveLayoutImageSrc(data?.floorPlan),
    [data?.floorPlan],
  )
  // Show Layout & Floor Plan like off-plan whenever either image was uploaded
  const hasLayoutMedia = Boolean(unitLayoutSrc || floorPlanSrc)
  const visibleTabs = useMemo(
    () =>
      hasLayoutMedia
        ? TABS
        : TABS.filter((tab) => tab !== 'Layout & Floor Plan'),
    [hasLayoutMedia],
  )

  useEffect(() => {
    if (!hasLayoutMedia && activeTab === 'Layout & Floor Plan') {
      setActiveTab('Description')
    }
  }, [hasLayoutMedia, activeTab])

  const pad = (value) => {
    if (value == null || value === '') return ''
    const num = Number(value)
    if (Number.isFinite(num)) return String(num).padStart(2, '0')
    return String(value)
  }

  const detailRows = useMemo(
    () => [
      { label: 'Location', value: formatListingLocation(data), fullWidth: true },
      { label: 'Project Name', value: data?.projectName },
      { label: 'Developer', value: data?.developer },
      { label: 'Property Type', value: data?.propertyType },
      { label: 'Bedrooms', value: pad(data?.bedrooms) },
      { label: 'Bathrooms', value: pad(data?.bathrooms) },
      {
        label: 'Size',
        value: formatPropertySizeDisplay(data),
      },
      { label: 'Furnished', value: data?.isFurnished },
      { label: 'Occupancy Status', value: data?.occupancyStatus },
      { label: 'Advertisement ID', value: data?.advertisementId },
      { label: 'Project Number', value: data?.dldNumber },
      {
        label: 'Garage',
        value: parseInt(data?.garages, 10) ? pad(data?.garages) : '',
      },
    ],
    [data],
  )

  const amenities = useMemo(() => getListingAmenities(data), [data])

  const tabButtonClass = (tab) =>
    `flex-grow md:text-base text-xs flex justify-center py-1 ${activeTab === tab
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
          imageAlt={data?.title || 'Property'}
        />

        <div className='relative mt-6 flex w-full flex-col items-start gap-5 sm:mt-0'>
          <ListingDetailTitleRow listing={data} />

          <div className='flex w-full flex-col gap-3'>
            <ListingDetailsHeading listing={data} />
            <ListingDetailsGrid rows={detailRows} />
          </div>

          <div className='flex w-full flex-wrap gap-x-4 gap-y-1'>
            <p className='text-sm font-semibold text-reefGold md:text-base'>
              Selling Price: AED {formatPriceUS(data?.price)}
            </p>
            <p className='text-sm font-semibold text-reefGold md:text-base'>
              Market Price: AED {formatNumberWithCommas(data?.evaluationPrices)}
            </p>
            <p className='text-sm font-semibold text-reefGold md:text-base'>
              ROI: {data?.roi ? data.roi : 0}%
            </p>
          </div>

          <div className='flex w-full flex-wrap items-center gap-3'>
            {!ownsListing ? (
              <ArrangeViewingButton
                onAuthenticated={() => setShowCalendarPopup(true)}
              />
            ) : null}

            <ListingDetailCertificates listing={data} />
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
          {visibleTabs.map((tab) => (
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

        {activeTab === 'Layout & Floor Plan' && hasLayoutMedia ? (
          <OffPlanLayoutFloorPlanDisplay
            unitLayout={unitLayoutSrc}
            floorPlan={floorPlanSrc}
          />
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
