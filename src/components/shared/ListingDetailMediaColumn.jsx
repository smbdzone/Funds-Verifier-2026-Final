'use client'

import LiftSlider from '@/components/Product_page/Left_slider'
import ImageSlider from '@/components/modules/Jewelry/ImageSlider'
import ListingMapSection from '@/components/ListingsForm/ListingMapSection'

/**
 * Off-plan-style left column: thumbs + preview, with Location map under the image.
 * Watermark is burned into listing photos on upload (no CSS overlay here).
 */
export default function ListingDetailMediaColumn({
  media = [],
  previewMedia,
  setPreviewMedia,
  mapUrl = '',
  imageAlt = 'Listing',
}) {
  const renderPreview = () => {
    if (previewMedia?.type === 'video') {
      return (
        <video
          key={previewMedia.src}
          controls
          playsInline
          preload='metadata'
          className='h-full w-full rounded-lg bg-black object-cover'
          src={previewMedia.src}
        >
          Your browser does not support the video tag.
        </video>
      )
    }

    if (previewMedia?.type === 'walkthrough') {
      return (
        <iframe
          src={previewMedia.src}
          className='h-full w-full rounded-lg object-cover'
          frameBorder='0'
          allowFullScreen
          title='3D Walkthrough'
        />
      )
    }

    return (
      <img
        alt={imageAlt}
        className='h-full w-full rounded-lg object-cover'
        src={previewMedia?.src || '/assets/images/room.jpg'}
      />
    )
  }

  return (
    <div className='flex w-full flex-col items-stretch gap-4 sm:flex-row'>
      <div className='hidden w-full shrink-0 sm:block sm:w-[160px] md:block'>
        <LiftSlider setPreviewMedia={setPreviewMedia} media={media} />
      </div>

      <div className='block w-full shrink-0 sm:hidden md:hidden'>
        <ImageSlider media={media} />
        <ListingMapSection
          mapUrl={mapUrl}
          showInput={false}
          title='Location'
          showEmptyPlaceholder
          className='mt-4 w-full'
          iframeClassName='h-[240px] w-full rounded-[5px]'
        />
      </div>

      <div className='hidden w-full flex-col gap-4 md:flex xl:w-[580px]'>
        <div className='h-[560px] w-full'>{renderPreview()}</div>
        <ListingMapSection
          mapUrl={mapUrl}
          showInput={false}
          title='Location'
          showEmptyPlaceholder
          className='w-full'
          iframeClassName='h-[280px] w-full rounded-[5px] sm:h-[320px]'
        />
      </div>
    </div>
  )
}
