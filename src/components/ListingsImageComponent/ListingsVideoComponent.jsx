import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { LISTING_VIDEO_MAX_COUNT } from '@/constants/listingUploadLimits'

const ListingsVideoComponent = ({
  videos = [],
  handleVideoRemove,
  fileInputRef,
  handleVideoChange,
  disabled,
}) => {
  const [previewUrls, setPreviewUrls] = useState([])

  const videoList = useMemo(
    () => (Array.isArray(videos) ? videos : videos ? [videos] : []),
    [videos],
  )

  useEffect(() => {
    const urls = videoList.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [videoList])

  const canAddMore = videoList.length < LISTING_VIDEO_MAX_COUNT

  return (
    <>
      {videoList.map((file, index) => (
        <div className='relative mt-2 h-28 w-28' key={`${file.name}-${index}`}>
          <div className='h-[100px]'>
            <video
              width='100%'
              controls
              src={previewUrls[index]}
              className='bg-cover h-full object-contain'
            />
          </div>
          {!disabled && (
            <button
              type='button'
              onClick={() => handleVideoRemove(index)}
              className='absolute h-5 w-5 flex justify-center items-center -top-2 -right-1 p-1 bg-light-gold text-white rounded-full'
              title='Remove video'
            >
              &times;
            </button>
          )}
        </div>
      ))}

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

      <div className='absolute right-[20px] h-[20px] xl:top-0 xxs:top-[55px]'>
        <label
          htmlFor={!disabled && canAddMore ? 'video-upload' : undefined}
          className={`flex flex-col items-center justify-center w-[176px] xl:h-[144px] xxs:h-[110px] shadow-neonsm my-[19px] ${!disabled && canAddMore ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            }`}
        >
          <div className='h-[20px]'>
            <Image
              width={20}
              height={20}
              src='/listing/video.svg'
              className='bg-cover h-[30px] object-contain'
              alt='Upload Video'
            />
            <span className='text-[17px] text-dark-grey font-normal pt-[17px]'>
              Add Video
            </span>
          </div>
        </label>
      </div>
    </>
  )
}

export default ListingsVideoComponent
