'use client'

import CalendarPopup from '@/components/CalendarPopup/CalendarPopup'
import Description from '@/components/Product_page/Description'
import LiftSlider from '@/components/Product_page/Left_slider'
import Review from '@/components/Product_page/Review'
import ImageSlider from '@/components/modules/Jewelry/ImageSlider'
import OffPlanLayoutFloorPlanDisplay from '@/components/offplan/OffPlanLayoutFloorPlanDisplay'
import OffPlanPaymentPlanDisplay from '@/components/offplan/OffPlanPaymentPlanDisplay'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import { formatOffPlanPriceRange } from '@/constants/offPlanDummyListings'
import { formatPropertySizeNumber } from '@/libs/propertySizeUnits'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { GoDotFill } from 'react-icons/go'
import { IoCheckmarkSharp } from 'react-icons/io5'

const TABS = [
  'Description',
  'Reviews',
  'Additional',
  'Payment Plan',
  'Layout & Floor Plan',
]

export default function OffPlanProductView({ data }) {
  const [activeTab, setActiveTab] = useState('Description')
  const [previewSrc, setPreviewSrc] = useState(data?.images?.[0] || '/offplan/image1.svg')
  const [reviewCounts, setReviewCounts] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)

  const bookingProductData = useMemo(
    () => ({
      ...data,
      assetType: data?.assetType || 'Property Off Plan For Sale',
    }),
    [data],
  )

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/count`,
          { productId: data?.uuid },
        )
        setReviewCounts(response.data.count || 0)
        setAverageRating(Number(response.data.averageRating) || 0)
      } catch (error) {
        console.error('Failed to fetch review data:', error)
      }
    }

    if (data?.uuid) {
      fetchReviewData()
    }
  }, [data?.uuid])

  const media = useMemo(
    () =>
      (data?.images || ['/offplan/image1.svg']).map((src) => ({
        type: 'image',
        src,
      })),
    [data?.images],
  )

  const tabButtonClass = (tab) =>
    `flex-grow md:text-base text-xs flex justify-center py-1 ${activeTab === tab
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
    <div className='theme-container'>
      <div className='flex flex-wrap gap-6 pb-5 pt-4 sm:pt-10 lg:flex-nowrap lg:gap-12 lg:pt-24'>
        <div className='flex w-full flex-col items-stretch gap-4 sm:flex-row'>
          <div className='hidden w-full shrink-0 sm:block sm:w-[160px] md:block'>
            <LiftSlider
              setPreviewMedia={(item) => setPreviewSrc(item?.src)}
              media={media}
            />
          </div>
          <div className='block w-full shrink-0 sm:hidden md:hidden'>
            <ImageSlider media={media} />
          </div>
          <div className='hidden md:block'>
            <div className='h-[560px] w-full xl:w-[580px]'>
              <img
                alt={data?.title || 'Off-plan property'}
                className='h-full w-full rounded-lg object-cover'
                src={previewSrc}
              />
            </div>
          </div>
        </div>

        <div className='relative mt-6 flex w-full flex-col items-start justify-between space-y-2 sm:mt-0 xl:space-y-0'>
          <h1 className='mb-1 w-[90%] truncate text-wrap text-xl font-semibold capitalize text-blue md:text-2xl lg:text-3xl'>
            {data?.title}
          </h1>

          <p className='text-[10px] tracking-wide text-black md:text-sm'>
            Ready: {data?.deliveryLabel}
          </p>

          <div className='mb-2 flex'>
            <div className='flex items-center justify-center space-x-2'>
              {Array.from({ length: 5 }, (_, starIndex) => (
                <div key={starIndex} className='h-4 w-4 md:h-5 md:w-5'>
                  <FaStar
                    size={20}
                    color={
                      starIndex < Math.round(averageRating)
                        ? '#FFD700'
                        : '#D3D3D3'
                    }
                  />
                </div>
              ))}
              <span className='ml-3 mt-2 text-xs opacity-50 md:mt-0 md:text-base'>
                {averageRating.toFixed(1)}
              </span>
              <span className='ml-3 mt-2 text-xs opacity-50 md:mt-0 md:text-base'>
                ({reviewCounts} Reviews)
              </span>
            </div>
          </div>

          <p className='text-xs leading-relaxed text-black md:text-base'>
            {data?.description}
          </p>

          <div className='mt-3 space-y-3'>
            <h2 className='mb-2 text-sm font-medium md:text-base'>Details</h2>
            <div className='mb-2 flex flex-wrap items-center gap-1 rounded p-2 shadow sm:gap-5'>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='mr-1 flex text-gold-800 sm:mr-2' />
                Developer: {data?.developer}
              </span>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='mr-2 flex text-gold-800' />
                Property Type: {data?.propertyType}
              </span>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='mr-2 flex text-gold-800' />
                Bedrooms: {String(data?.bedrooms).padStart(2, '0')}
              </span>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='mr-2 flex text-gold-800' />
                Bathrooms: {String(data?.bathrooms).padStart(2, '0')}
              </span>
              <span className='flex flex-row items-center text-[7px] sm:text-xs md:text-sm'>
                <GoDotFill className='mr-2 flex text-gold-800' />
                {data?.sizeUnit || 'SQFT'}:{' '}
                {formatPropertySizeNumber(data?.sizeSQFT)}
              </span>
            </div>

            <div className='my-2 flex w-full flex-wrap gap-x-4'>
              <p className='text-sm text-reefGold md:text-base'>
                Price Range: {formatOffPlanPriceRange(data?.priceFrom, data?.priceTo)}
              </p>
              <p className='text-sm text-reefGold md:text-base'>
                Payment Plan: {data?.paymentPlanLabel}
              </p>
            </div>
          </div>

          <div className='mb-3 mt-2 flex flex-wrap items-center gap-3'>
            <button
              type='button'
              onClick={handleDeveloperRequestClick}
              className='btn-gradient flex flex-grow justify-center rounded border-0 px-2 py-2 text-[10px] font-medium text-white focus:outline-none md:text-sm'
            >
              Developer Request
            </button>
          </div>

          <div className='mb-3 mt-2 flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='relative h-[70px] w-[78px] overflow-hidden rounded-sm bg-[#D9D9D9]'>
                <Image
                  src={data?.developerAvatar || '/avatar/Avatars 2.png'}
                  alt={data?.developer || 'Developer'}
                  width={78}
                  height={70}
                  className='h-[70px] w-[78px] object-cover'
                />
              </div>
              <span className='text-base font-medium text-black md:text-lg'>
                Ref: {data?.ref}
              </span>
            </div>
            <ListingSocialShare
              listing={data}
              linkedinIcon='white'
            />
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
          <Description text={data?.additionalDescription || data?.description} />
        ) : null}

        {activeTab === 'Reviews' ? <Review productdata={data} /> : null}

        {activeTab === 'Additional' ? (
          <>
            {data?.facilities?.length ? (
              <div className='flex flex-wrap md:grid md:grid-cols-3'>
                {data.facilities.map((item) => (
                  <div key={item} className='col-span-1'>
                    <div className='flex flex-row flex-wrap items-center space-x-2 p-2 text-base font-normal'>
                      <IoCheckmarkSharp
                        className='border border-reefGold md:mr-4'
                        color='#A2913E'
                      />
                      <span className='text-xs md:text-base'>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='px-4 py-6 text-sm text-black/60'>
                No additional facilities listed.
              </p>
            )}
          </>
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
