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
    return null // resolved via object URL in effect
  }
  return getListingVideoSrc(video) || ''
}

const ListingsVideoComponent = ({
  videos = [],
  handleVideoRemove,
  fileInputRef,
  handleVideoChange,
  disabled,
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

  const canAddMore = videoList.length < LISTING_VIDEO_MAX_COUNT

  return (
    <div className='flex h-full min-h-0 items-start gap-3 overflow-x-auto'>
      {videoList.map((file, index) => {
        const src = blobUrls[index]
        const key =
          typeof file === 'string'
            ? file
            : file?.name || file?.public_id || file?.s3Key || file?.url || file?.signedUrl || index
        return (
          <div className='relative h-28 w-28 shrink-0' key={`${key}-${index}`}>
            <div className='h-[100px] overflow-hidden rounded-sm bg-offwhite'>
              {src ? (
                <video
                  width='100%'
                  controls
                  src={src}
                  className='h-full w-full object-contain'
                />
              ) : null}
            </div>
            {!disabled && (
              <button
                type='button'
                onClick={() => handleVideoRemove(index)}
                className='absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-light-gold p-1 text-white'
                title='Remove video'
              >
                &times;
              </button>
            )}
          </div>
        )
      })}

      <input
        type='file'
        id='video-upload'
        className='hidden'
        accept='video/*'
        multiple
        ref={fileInputRef}
        disabled={disabled || !canAddMore}
        onChange={handleVideoChange}
      />

      {canAddMore ? (
        <label
          htmlFor={!disabled ? 'video-upload' : undefined}
          className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center shadow-neonsm ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            }`}
        >
          <Image
            width={20}
            height={20}
            src='/listing/video.svg'
            className='h-[30px] object-contain'
            alt='Upload Video'
          />
          <span className='pt-2 text-center text-[13px] font-normal text-dark-grey'>
            Add Video
          </span>
        </label>
      ) : null}
    </div>
  )
}

export default ListingsVideoComponent
