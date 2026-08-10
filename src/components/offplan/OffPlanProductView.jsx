'use client'

import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import Description from '@/components/Product_page/Description'
import LiftSlider from '@/components/Product_page/Left_slider'
import Review from '@/components/Product_page/Review'
import ImageSlider from '@/components/modules/Jewelry/ImageSlider'
import OffPlanLayoutFloorPlanDisplay from '@/components/offplan/OffPlanLayoutFloorPlanDisplay'
import OffPlanPaymentPlanDisplay from '@/components/offplan/OffPlanPaymentPlanDisplay'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import ListingQrCodeSection from '@/components/shared/ListingQrCodeSection'
import ListingMapSection from '@/components/ListingsForm/ListingMapSection'
import ListingDetailsGrid from '@/components/shared/ListingDetailsGrid'
import ListingDetailCertificates from '@/components/shared/ListingDetailCertificates'
import ListingDetailTitleRow from '@/components/shared/ListingDetailTitleRow'
import ListingDetailsHeading from '@/components/shared/ListingDetailsHeading'
import ArrangeViewingButton from '@/components/shared/ArrangeViewingButton'
import { formatOffPlanPriceRange } from '@/constants/offPlanDummyListings'
import { formatPropertySizeDisplay } from '@/libs/propertySizeUnits'
import { getListingAmenities } from '@/libs/listingAmenities'
import { formatListingLocation } from '@/libs/listingLocationUtils'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import { isOwnListing } from '@/libs/isOwnListing'
import { useProfile } from '@/context/UserContext'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { IoCheckmarkSharp } from 'react-icons/io5'

const TABS = [
  'Description',
  'Reviews',
  'Amenities',
  'Payment Plan',
  'Layout & Floor Plan',
]

export default function OffPlanProductView({ data }) {
  const { user } = useProfile()
  const ownsListing = isOwnListing(data, user)
  const [activeTab, setActiveTab] = useState('Description')
  const [previewSrc, setPreviewSrc] = useState(data?.images?.[0] || '/offplan/image1.svg')
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)

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

  const media = useMemo(
    () =>
      (data?.images || ['/offplan/image1.svg']).map((src) => ({
        type: 'image',
        src,
      })),
    [data?.images],
  )

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
        {/* Media: full width through tablet/1024; beside details only on xl+ */}
        <div className='flex w-full min-w-0 flex-col items-stretch gap-4 min-[700px]:flex-row xl:max-w-[740px] xl:shrink-0'>
          {/* Detail preview thumbs — 700px+ */}
          <div className='hidden w-full shrink-0 min-[700px]:block min-[700px]:w-[110px] lg:w-[140px] xl:w-[160px]'>
            <LiftSlider
              setPreviewMedia={(item) => setPreviewSrc(item?.src)}
              media={media}
            />
          </div>
          {/* Mobile only (&lt;700): carousel */}
          <div className='block w-full shrink-0 min-[700px]:hidden'>
            <ImageSlider media={media} />
            <ListingMapSection
              mapUrl={data?.mapUrl}
              showInput={false}
              title='Location'
              showEmptyPlaceholder
              className='mt-4 w-full'
              iframeClassName='h-[240px] w-full rounded-[5px] sm:h-[280px]'
            />
          </div>
          {/* 700px+: main preview + map (full width until xl) */}
          <div className='hidden w-full min-w-0 flex-col gap-4 min-[700px]:flex min-[700px]:flex-1'>
            <div className='relative h-[360px] w-full overflow-hidden rounded-lg lg:h-[420px] xl:h-[560px]'>
              <img
                alt={data?.title || 'Off-plan property'}
                className='h-full w-full object-cover'
                src={previewSrc}
              />
            </div>
            <ListingMapSection
              mapUrl={data?.mapUrl}
              showInput={false}
              title='Location'
              showEmptyPlaceholder
              className='w-full'
              iframeClassName='h-[260px] w-full rounded-[5px] sm:h-[300px] lg:h-[320px]'
            />
          </div>
        </div>

        {/* Details: below map through 1024; side column only on xl+ (large screen) */}
        <div className='relative mt-2 flex w-full min-w-0 flex-col items-start gap-5 xl:mt-0 xl:flex-1'>
          <ListingDetailTitleRow listing={data} />

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

          {!ownsListing ? (
            <ArrangeViewingButton
              onAuthenticated={handleDeveloperRequestClick}
            />
          ) : null}

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
