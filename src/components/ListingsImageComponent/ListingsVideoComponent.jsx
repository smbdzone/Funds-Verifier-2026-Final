import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { LISTING_VIDEO_MAX_COUNT } from '@/constants/listingUploadLimits'
import { getListingVideoSrc } from '@/libs/listingCardMedia'

function resolveVideoPreviewSrc(video) {
  if (!video) return ''
  if (typeof video === 'string') {
    if (
      video.startsWith('http') ||
      video.startsWith('blob:') ||
      video.startsWith('data:')
    ) {
      return video
    }
    return ''
  }
  if (video instanceof File || video instanceof Blob) {
    return null
  }
  return getListingVideoSrc(video) || ''
}

const ListingsVideoComponent = ({
  videos = [],
  handleVideoRemove,
  fileInputRef,
  handleVideoChange,
  disabled,
  inputId = 'listing-video-upload',
  uploadLabel = 'Add Video',
}) => {
  const [blobUrls, setBlobUrls] = useState([])

  const videoList = useMemo(
    () => (Array.isArray(videos) ? videos : videos ? [videos] : []),
    [videos],
  )

  useEffect(() => {
    const created = []
    const urls = videoList.map((video) => {
      if (video instanceof File || video instanceof Blob) {
        const url = URL.createObjectURL(video)
        created.push(url)
        return url
      }
      return resolveVideoPreviewSrc(video)
    })
    setBlobUrls(urls)
    return () => {
      created.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [videoList])

  const canAddMore = !disabled && videoList.length < LISTING_VIDEO_MAX_COUNT

  return (
    <div className='flex h-full min-h-0 items-stretch gap-3'>
      <div className='flex min-w-0 flex-1 items-start gap-2 overflow-x-auto'>
        {videoList.map((file, index) => {
          const src = blobUrls[index]
          const key =
            typeof file === 'string'
              ? file
              : file?.name ||
              file?.public_id ||
              file?.s3Key ||
              file?.url ||
              file?.signedUrl ||
              index
          return (
            <div
              className='group relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-sm border border-dark-grey/15 bg-offwhite'
              key={`${key}-${index}`}
            >
              {src ? (
                <video
                  src={src}
                  className='h-full w-full object-cover'
                  muted
                  playsInline
                  preload='metadata'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-[10px] text-dark-grey'>
                  Video
                </div>
              )}
              {!disabled && (
                <button
                  type='button'
                  onClick={() => handleVideoRemove?.(index)}
                  className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-light-gold text-xs text-white'
                  title='Remove video'
                >
                  &times;
                </button>
              )}
            </div>
          )
        })}
      </div>

      <input
        type='file'
        id={inputId}
        className='pointer-events-none absolute h-0 w-0 opacity-0'
        accept='video/mp4,video/quicktime,video/*'
        multiple
        ref={fileInputRef}
        disabled={!canAddMore}
        onChange={handleVideoChange}
      />

      <label
        htmlFor={canAddMore ? inputId : undefined}
        className={`flex h-[88px] w-[120px] shrink-0 flex-col items-center justify-center shadow-neonsm ${canAddMore
            ? 'cursor-pointer'
            : 'pointer-events-none cursor-not-allowed opacity-50'
          }`}
      >
        <Image
          width={32}
          height={32}
          src='/listing/camera.svg'
          alt='Upload Video'
        />
        <span className='pt-2 text-center text-[13px] font-normal text-dark-grey'>
          {uploadLabel}
        </span>
      </label>
    </div>
  )
}

export default ListingsVideoComponent
