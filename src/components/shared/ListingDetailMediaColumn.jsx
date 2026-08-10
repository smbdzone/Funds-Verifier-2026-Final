'use client'

import LiftSlider from '@/components/Product_page/Left_slider'
import ImageSlider from '@/components/modules/Jewelry/ImageSlider'
import ListingMapSection from '@/components/ListingsForm/ListingMapSection'

/**
 * Mobile (&lt;700): carousel.
 * 700px+: thumbs + main image + map (full width when stacked).
 * Parent stacks details below until lg, then side-by-side.
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
    <div className='flex w-full min-w-0 flex-col items-stretch gap-4 min-[700px]:flex-row xl:max-w-[740px] xl:shrink-0'>
      {/* Detail preview thumbs — 700px+ */}
      <div className='hidden w-full shrink-0 min-[700px]:block min-[700px]:w-[110px] lg:w-[140px] xl:w-[160px]'>
        <LiftSlider setPreviewMedia={setPreviewMedia} media={media} />
      </div>

      {/* Mobile only (&lt;700): carousel */}
      <div className='block w-full shrink-0 min-[700px]:hidden'>
        <ImageSlider media={media} />
        <ListingMapSection
          mapUrl={mapUrl}
          showInput={false}
          title='Location'
          showEmptyPlaceholder
          className='mt-4 w-full'
          iframeClassName='h-[240px] w-full rounded-[5px] sm:h-[280px]'
        />
      </div>

      {/* 700px+: main preview + map */}
      <div className='hidden w-full min-w-0 flex-col gap-4 min-[700px]:flex min-[700px]:flex-1'>
        <div className='h-[360px] w-full lg:h-[420px] xl:h-[560px]'>{renderPreview()}</div>
        <ListingMapSection
          mapUrl={mapUrl}
          showInput={false}
          title='Location'
          showEmptyPlaceholder
          className='w-full'
          iframeClassName='h-[260px] w-full rounded-[5px] sm:h-[300px] lg:h-[320px]'
        />
      </div>
    </div>
  )
}
