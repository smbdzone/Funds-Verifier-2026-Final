'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { GoDotFill } from 'react-icons/go'
import { IoCheckmarkSharp } from 'react-icons/io5'
import CompletePaymentComponent from '@/components/CheckoutLayoutComponent/CompletePaymentComponent'
import {
  getListingImageSrc,
  getListingVideoSrc,
} from '@/libs/listingCardMedia'
import ListingSocialShare from '@/components/shared/ListingSocialShare'
import { formatPriceUS } from '@/utils'
import { formatNumberWithCommas } from '../../utils/global-functions/global'

export default function CheckoutView({
  data,
  priceInAed,
  priceInUsdt,
  feeInUsdt,
}) {
  const [previewMedia, setPreviewMedia] = useState(() => {
    const images = data?.pictures?.images || []
    const videos = data?.video?.videos || []
    const thumbnail = data?.thumbnailImg?.images || []
    const walkthrough = data?.video3DWalkthrough?.link || null

    // Prefer freshly-signed CloudFront URLs (signedUrl) over the stored url.
    const allMedia = [
      ...images.map((image) => getListingImageSrc(image)),
      ...videos.map((video) => getListingVideoSrc(video)),
      ...thumbnail.map((thumb) => getListingImageSrc(thumb)),
    ].filter((src) => src && src !== '/listing/camera.svg')

    if (walkthrough) {
      allMedia.push(walkthrough)
    }

    return allMedia.length > 0 ? allMedia[0] : null
  })

  const [paymentComplete, setPaymentComplete] = useState(false)

  const truncateTitle = (title) => {
    const words = title?.split(' ')
    if (words?.length > 3) {
      return words?.slice(0, 3).join(' ') + '...'
    }
    return title
  }

  const combinedMedia = [
    ...(data?.pictures?.images || []),
    ...(data?.video?.videos || []),
    ...(data?.thumbnailImg?.images || []),
  ]

  // Add the walkthrough link if it exists
  if (
    data?.video3DWalkthrough &&
    data?.video3DWalkthrough?.link &&
    (data?.video3DWalkthrough?.link.startsWith('http://') ||
      data?.video3DWalkthrough?.link.startsWith('https://'))
  ) {
    combinedMedia.push({
      url: data?.video3DWalkthrough,
      type: 'walkthrough',
    })
  }

  return (
    <div className='theme-container'>
      {!paymentComplete ? (
        <>
          <div className='sm:flex xl:flex-nowrap items-center sm:gap-6 gap-3 lg:gap-10 flex-wrap pt-10 lg:pt-24 pb-5'>
            <div className='flex items-stretch shrink-0 sm:flex-row flex-col gap-4'>
              {typeof previewMedia === 'string' &&
                previewMedia.endsWith('.mp4') ? (
                <video
                  controls
                  height={580}
                  width={450}
                  className='md:w-[70%] w-full lg:w-[450px] md:h-[450px] h- object-cover rounded-lg'
                  src={previewMedia}
                >
                  Your browser does not support the video tag.
                </video>
              ) : typeof previewMedia === 'string' &&
                previewMedia.startsWith('http') &&
                !previewMedia.endsWith('.jpg') ? (
                <Image
                  src={previewMedia}
                  height={680}
                  width={450}
                  className='md:w-[70%] w-full lg:w-[450px] md:h-[450px] h-[300px] object-contain rounded-lg'
                  frameBorder='0'
                  allowFullScreen
                  title='3D Walkthrough'
                />
              ) : (
                <Image
                  alt={previewMedia}
                  quality={100}
                  height={680}
                  width={450}
                  className='md:w-[70%] w-full lg:w-[450px] md:h-[450px] h-[300px] object-cover rounded-lg'
                  src={previewMedia || '/assets/images/room.jpg'}
                />
              )}
            </div>
            <div className='relative flex lg:h-[450px] items-start flex-col lg:space-y-0 space-y-5 lg:justify-between mt-6 sm:mt-0'>
              <span className='font-medium lg:text-[18px] sm:text-base text-sm block'>
                Ref: {data?.uuid ? data.uuid.slice(0, 8) : 'N/A'}
              </span>
              <h1 className='text-wrap text-blue capitalize lg:text-4xl sm:text-2xl text-lg font-semibold mb-1'>
                {data?.title}
              </h1>
              <p className='lg:h-[120px] sm:text-sm lg:text-base text-xs leading-relaxed text-black'>
                {data.description}
              </p>
              <div className='mt-3'>
                <h2 className='font-medium lg:text-base sm:text-sm text-xs mb-2'>
                  Details
                </h2>
                <div className='flex flex-wrap lg:text-base sm:text-sm text-xs items-center p-2 shadow rounded mb-2 gap-5'>
                  {data?.bedrooms ? (
                    <>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex  mr-2 text-gold-800' />
                        Bedrooms:
                        {data?.bedrooms < 10
                          ? '0' + data?.bedrooms
                          : data?.bedrooms?.toString()}
                      </span>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' />
                        Bathrooms :
                        {data?.bathrooms < 10
                          ? '0' + data?.bathrooms
                          : data?.bathrooms?.toString()}
                      </span>
                      {parseInt(data?.garages) ? (
                        <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                          <GoDotFill className='flex mr-2 text-gold-800' />
                          Garage :
                          {data?.garages < 10
                            ? '0' + data?.garages
                            : data?.garages?.toString()}
                        </span>
                      ) : (
                        <></>
                      )}
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> SqFt :
                        {data?.sizeSQFT < 10
                          ? '0' + data?.sizeSQFT
                          : formatNumberWithCommas(data?.sizeSQFT)}
                      </span>
                    </>
                  ) : data.assetType === 'Car For Sale' ? (
                    <>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Year:
                        {data?.year}
                      </span>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Engine
                        :
                      </span>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Fuel
                        Economy :
                      </span>

                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' />
                        Interior Color :
                      </span>
                    </>
                  ) : data.assetType === 'Jewellery For Sale' ? (
                    <>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Grams:
                        {data.grams}
                      </span>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Metal
                        Type : {data.jewelryMetal}
                      </span>

                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Tags :
                      </span>

                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'></span>
                    </>
                  ) : (
                    <>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Color:
                      </span>
                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Place:
                      </span>

                      <span className='flex flex-row items-center lg:text-base sm:text-sm text-xs'>
                        <GoDotFill className='flex mr-2 text-gold-800' /> Speed:
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className='flex justify-between w-full items-end'>
                <ListingSocialShare
                  listing={data}
                  label='Share:'
                  labelClassName='lg:text-base sm:text-sm text-xs'
                  linkedinIcon='white'
                />
              </div>
            </div>
          </div>

          <div className='bg-light-gray p-5 rounded-md'>
            <button
              className={`flex-grow lg:w-[264px] lg:h-[50px] px-4 py-2 text-base flex justify-center items-center text-white btn-gradient border-0 focus:outline-none font-medium rounded `}
            >
              Additional Information
            </button>

            <>
              {data.facilities && data.facilities.length !== 0 ? (
                <div className='grid shadow rounded mt-5 sm:grid-cols-2 grid-cols-1 lg:grid-cols-4'>
                  {data.facilities.map((item, columnIndex) => (
                    <div key={columnIndex} className='col-span-1'>
                      <div className='sm:flex flex-wrap font-normal'>
                        <div className='flex lg:text-base sm:text-sm text-xs flex-row items-start lg:items-center p-2 space-x-2'>
                          <IoCheckmarkSharp
                            className='mr-4 border border-reefGold'
                            color='#A2913E'
                          />
                          {item}
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
          </div>

          <div className='flex items-end sm:justify-end justify-center'>
            <div className='flex flex-col items-center sm:justify-end justify-center'>
              <h1 className='text-[18px]'>Current Price</h1>
              <p className='text-[18px]'>
                <span className='text-blue capitalize text-lg sm:text-2xl lg:text-[30px] truncate w-[90%] font-semibold mb-1'>
                  ${formatPriceUS(data?.price)}
                </span>
                {`(AED ${formatPriceUS(priceInAed)})`}
              </p>
              <div className='w-full flex items-center sm:justify-end justify-center'>
                <button
                  onClick={() => {
                    setPaymentComplete(true)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`w-32 mt-4 py-3 text-base flex justify-center items-center text-white btn-gradient border-0 focus:outline-none font-medium rounded `}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <CompletePaymentComponent
          title={truncateTitle(data?.title)}
          data={data}
          priceInAed={priceInAed}
          priceInUsdt={priceInUsdt}
          feeInUsdt={feeInUsdt}
          previewMedia={previewMedia}
          setPaymentComplete={setPaymentComplete}
        />
      )}
    </div>
  )
}
