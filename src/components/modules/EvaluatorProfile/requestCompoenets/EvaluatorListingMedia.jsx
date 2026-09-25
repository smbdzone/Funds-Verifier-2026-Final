'use client'

import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { DownloadIcon } from '@/components/Icons'
import {
  downloadAllListingMedia,
  downloadListingMedia,
  isListingImageUrl,
  isListingVideoUrl,
} from '@/libs/downloadListingMedia'
import { getListingImageSrc, getListingVideoSrc } from '@/libs/listingCardMedia'

function buildListingMediaItems(property = {}) {
  const items = []

  const images = property?.pictures?.images?.length
    ? property.pictures.images
    : property?.thumbnailImg?.images?.[0]
      ? [property.thumbnailImg.images[0]]
      : []

  images.forEach((image, index) => {
    const src = getListingImageSrc(image)
    if (!src || src === '/listing/camera.svg') return
    items.push({
      type: 'image',
      id: image?.public_id || image?.s3Key || image?.originalName || `image-${index}`,
      src,
      filename:
        image?.name ||
        image?.public_id ||
        image?.s3Key?.split('/').pop() ||
        `listing-image-${index + 1}.jpg`,
    })
  })

    ; (property?.video?.videos || []).forEach((video, index) => {
      const src = getListingVideoSrc(video)
      if (!src) return
      items.push({
        type: 'video',
        id: video?.public_id || video?.s3Key || video?.originalName || `video-${index}`,
        src,
        filename:
          video?.name ||
          video?.public_id ||
          video?.s3Key?.split('/').pop() ||
          `listing-video-${index + 1}.mp4`,
        label: 'Video',
      })
    })

    // QR scan images
    ; (property?.qrScan?.images || []).forEach((image, index) => {
      const src = getListingImageSrc(image)
      if (!src || src === '/listing/camera.svg') return
      items.push({
        type: 'image',
        id: image?.public_id || image?.s3Key || image?.originalName || `qr-${index}`,
        src,
        filename:
          image?.name ||
          image?.public_id ||
          image?.s3Key?.split('/').pop() ||
          `listing-qr-${index + 1}.jpg`,
        label: 'QR Code',
      })
    })

  return items
}

function hasListingMedia(property = {}) {
  const hasGallery =
    (property?.pictures?.images?.length ?? 0) > 0 ||
    (property?.video?.videos?.length ?? 0) > 0 ||
    (property?.qrScan?.images?.length ?? 0) > 0
  const hasThumb = Boolean(
    property?.thumbnailImg?.images?.[0]?.url ||
    property?.thumbnailImg?.images?.[0]?.signedUrl,
  )
  const has3d = Boolean(property?.video3DWalkthrough?.link)
  return hasGallery || hasThumb || has3d
}

export default function EvaluatorListingMedia({
  property,
  emptyImage = '/listing/camera.svg',
  label = 'Media',
}) {
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [downloadingSrc, setDownloadingSrc] = useState(null)
  const [isBulkDownloading, setIsBulkDownloading] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(null)

  const mediaItems = useMemo(() => buildListingMediaItems(property), [property])
  const noMediaFound = !hasListingMedia(property)

  const handleDownload = async (media, event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()
    if (!media?.src || media.type === 'walkthrough') return

    setDownloadingSrc(media.src)
    try {
      const success = await downloadListingMedia(media.src, media.filename)
      if (success) {
        toast.success('Download started')
      } else {
        toast.error('Failed to download media')
      }
    } catch {
      toast.error('Failed to download media')
    } finally {
      setDownloadingSrc(null)
    }
  }

  const getBulkDownloadLabel = () => {
    if (!bulkProgress) return 'Download all'

    if (bulkProgress.phase === 'packaging') {
      if (typeof bulkProgress.percent === 'number') {
        return `Processing... ${Math.round(bulkProgress.percent)}%`
      }
      return 'Processing...'
    }

    return `Downloading ${bulkProgress.current} of ${bulkProgress.total}...`
  }

  const handleBulkDownload = async () => {
    if (!mediaItems.length || isBulkDownloading) return

    setIsBulkDownloading(true)
    setBulkProgress(null)
    try {
      const { downloaded, failed, total } = await downloadAllListingMedia(
        mediaItems,
        {
          zipFilename: 'listing-media.zip',
          onProgress: setBulkProgress,
        },
      )

      if (downloaded === 0) {
        toast.error('Failed to download media files')
        return
      }

      if (failed > 0) {
        toast.warn(
          `Downloaded ${downloaded} of ${total} file${total === 1 ? '' : 's'} in listing-media.zip`,
        )
        return
      }

      toast.success(
        total === 1
          ? 'Download started'
          : `All ${downloaded} files downloaded as listing-media.zip`,
      )
    } catch {
      toast.error('Failed to download media files')
    } finally {
      setIsBulkDownloading(false)
      setBulkProgress(null)
    }
  }

  const handleCloseModal = () => setSelectedMedia(null)

  const handleClickOutside = (event) => {
    if (event.target.id === 'evaluatorMediaOverlay') {
      handleCloseModal()
    }
  }

  const walkthroughLink = property?.video3DWalkthrough?.link

  return (
    <div className='mb-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <label className='block text-sm font-medium text-[#969696] sm:text-base'>
          {label}
        </label>
        {mediaItems.length > 0 ? (
          <button
            type='button'
            onClick={handleBulkDownload}
            disabled={isBulkDownloading || Boolean(downloadingSrc)}
            className='inline-flex items-center gap-2 rounded-md border border-[#8d7c3b] bg-white px-3 py-1.5 text-xs font-medium text-[#002d4f] transition hover:bg-[#8d7c3b]/10 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm'
          >
            <DownloadIcon className='h-4 w-4' />
            {isBulkDownloading ? getBulkDownloadLabel() : 'Download all'}
          </button>
        ) : null}
      </div>
      <div className='mt-1 flex w-full flex-col rounded-md border border-[#969696] bg-white px-3 py-3 text-sm text-[#969696] sm:text-base'>
        {noMediaFound ? (
          <img
            src={emptyImage}
            alt='No listing media'
            className='max-h-48 w-full object-contain opacity-60'
          />
        ) : (
          <div className='flex h-full w-full gap-2'>
            {walkthroughLink ? (
              <div className='relative min-h-full w-64 flex-shrink-0 overflow-hidden rounded-sm'>
                <iframe
                  src={walkthroughLink}
                  className='h-full w-full object-cover'
                  frameBorder='0'
                  title='3D Walkthrough'
                  style={{ pointerEvents: 'none' }}
                />
                <button
                  type='button'
                  className='absolute inset-0 bg-transparent'
                  onClick={() =>
                    setSelectedMedia({
                      type: 'walkthrough',
                      src: walkthroughLink,
                    })
                  }
                  aria-label='View 3D walkthrough'
                />
              </div>
            ) : null}

            <div className='flex w-full flex-wrap gap-2'>
              {mediaItems.map((media) => (
                <div
                  key={`${media.type}-${media.id}`}
                  className='relative h-28 w-28 overflow-hidden rounded-sm'
                >
                  <button
                    type='button'
                    className='h-full w-full cursor-pointer'
                    onClick={() => setSelectedMedia(media)}
                    aria-label={`View ${media.type}`}
                  >
                    {media.type === 'video' ? (
                      <video
                        src={media.src}
                        className='h-full w-full object-cover'
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={media.src}
                        className='h-full w-full object-cover'
                        alt='Listing media'
                      />
                    )}
                  </button>
                  {media.label ? (
                    <span className='absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-center text-[10px] font-medium text-white'>
                      {media.label}
                    </span>
                  ) : null}
                  <button
                    type='button'
                    title='Download'
                    aria-label='Download media'
                    disabled={downloadingSrc === media.src}
                    onClick={(event) => handleDownload(media, event)}
                    onMouseDown={(event) => event.stopPropagation()}
                    className='absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80 disabled:opacity-60'
                  >
                    <DownloadIcon className='h-4 w-4 text-white opacity-100' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedMedia ? (
        <div
          id='evaluatorMediaOverlay'
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
          onClick={handleClickOutside}
        >
          <div className='relative w-[90%] max-w-3xl rounded-md bg-white p-2 lg:h-[70%] lg:w-[70%]'>
            <div className='absolute right-2 top-2 z-10 flex items-center gap-2'>
              {selectedMedia.type !== 'walkthrough' ? (
                <button
                  type='button'
                  title='Download'
                  aria-label='Download media'
                  disabled={downloadingSrc === selectedMedia.src}
                  onClick={(event) => handleDownload(selectedMedia, event)}
                  onMouseDown={(event) => event.stopPropagation()}
                  className='primary-gradient flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:opacity-90 disabled:opacity-60'
                >
                  <DownloadIcon className='h-5 w-5 text-white opacity-100' />
                </button>
              ) : null}
              <button
                type='button'
                className='primary-gradient flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-white transition hover:opacity-90'
                onClick={handleCloseModal}
                aria-label='Close preview'
              >
                &times;
              </button>
            </div>

            {isListingVideoUrl(selectedMedia.src) ? (
              <video
                src={selectedMedia.src}
                controls
                className='h-full w-full object-contain'
              />
            ) : isListingImageUrl(selectedMedia.src) ? (
              <img
                src={selectedMedia.src}
                alt='Selected media'
                className='h-full w-full object-contain'
              />
            ) : (
              <iframe
                src={selectedMedia.src}
                className='h-full w-full object-contain'
                frameBorder='0'
                allowFullScreen
                title='3D Walkthrough'
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
