import Image from 'next/image'
import React, { useMemo } from 'react'

const ListingsImageComponent = ({
  errors,
  image,
  errorMessage,
  handleImageRemove,
  handleThumbImageChange,
  disabled,
}) => {
  const imageUrl = useMemo(() => {
    if (!image) return null
    if (typeof image?.signedUrl === 'string' && image?.signedUrl.startsWith('http')) {
      return image?.signedUrl
    }
    if (typeof image?.url === 'string' && image?.url.startsWith('http')) {
      return image?.url
    } else if (typeof image === 'object') {
      return URL.createObjectURL(image)
    } else {
      return null
    }
  }, [image])

  return (
    <>
      <div className='flex flex-wrap mt-2 w-[80%]'>
        {image && (
          <div className='w-2/5 p-2 relative group'>
            <div className='h-[20px]'>
              <Image
                width={100}
                height={100}
                src={imageUrl}
                alt='uploaded-image'
                className='w-full bg-cover h-[100px] object-contain'
              />
            </div>
            {!disabled && (
              <button
                onClick={() => handleImageRemove(image?.public_id)}
                className='absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                title='Remove image'
              >
                &times;
              </button>
            )}
          </div>
        )}
      </div>

      <input
        type='file'
        id='thumbnail'
        className='opacity-0 absolute w-0 h-0'
        accept='image/*'
        disabled={disabled}
        onChange={handleThumbImageChange}
      />

      <div className='absolute right-[20px] xl:top-0 xxs:top-[55px]'>
        <label
          htmlFor={!disabled ? 'thumbnail' : undefined} // ✅ Prevent click when disabled
          className={`flex flex-col items-center justify-center w-[176px] xl:h-[154px] xxs:h-[110px] shadow-neonsm my-[19px] ${
            disabled
              ? 'cursor-not-allowed opacity-50 pointer-events-none' // ✅ disable interaction
              : 'cursor-pointer'
          }`}
        >
          <Image
            width={45}
            height={45}
            src='/listing/camera.svg'
            alt='Upload Image'
          />
          <span className='text-[17px] text-dark-grey font-normal pt-[18px]'>
            Add Thumbnail
          </span>
        </label>
      </div>

      {errors && (
        <span className='text-red-500 lg:text-sm text-xs font-medium left-0 absolute top-[99%]'>
          **{errorMessage}
        </span>
      )}
    </>
  )
}

export default React.memo(ListingsImageComponent)
