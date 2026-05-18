import Image from 'next/image'
import React, { useMemo } from 'react'

const ListingsVideoComponent = ({
  video,
  handleVideoRemove,
  fileInputRef,
  handleVideoChange,
  disabled,
}) => {
  const videoUrl = useMemo(() => {
    return video ? URL.createObjectURL(video) : null
  }, [video])
  return (
    <>
      {video && (
        <div className='relative mt-2 h-28 w-28'>
          <div className='h-[100px]'>
            <video
              width='100%'
              controls
              src={videoUrl}
              className='bg-cover h-full object-contain'
            />
          </div>
          {!disabled && (
            <button
              onClick={handleVideoRemove}
              className='absolute h-5 w-5 flex justify-center items-center -top-2 -right-1 p-1 bg-red-500 text-white rounded-full'
              title='Remove video'
            >
              &times;
            </button>
          )}
        </div>
      )}

      <input
        type='file'
        id='video-upload'
        className='hidden'
        accept='video/*'
        ref={fileInputRef}
        disabled={disabled}
        onChange={handleVideoChange}
      />

      <div className='absolute right-[20px] h-[20px] xl:top-0 xxs:top-[55px]'>
        <label
          // htmlFor='video-upload'
          htmlFor={!disabled ? 'video-upload' : undefined}
          className='flex flex-col items-center justify-center w-[176px] xl:h-[144px] xxs:h-[110px]  shadow-neonsm cursor-pointer my-[19px]'
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
