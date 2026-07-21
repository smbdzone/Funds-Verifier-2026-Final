import Image from 'next/image'
import React, { useMemo } from 'react'

import {
  LISTING_IMAGE_MAX_COUNT,
} from '@/constants/listingUploadLimits'

const ListingMultipleImageComponent = ({
  images,
  handleImageRemove,
  handleImageChange,
  errors,
  errorMessage,
  disabled,
}) => {
  const imagePreviews = useMemo(() => {
    if (!images || !Array.isArray(images)) {
      return []
    }

    return images
      .filter((image) => image) // Filter out null or undefined
      .map((image) => {
        if (
          typeof image?.signedUrl === 'string' &&
          image?.signedUrl.startsWith('http')
        ) {
          return {
            file: image?.s3Key || image?.public_id,
            preview: image?.signedUrl,
          }
        }
        if (typeof image?.url === 'string' && image?.url.startsWith('http')) {
          return {
            file: image?.s3Key || image?.public_id,
            preview: image?.url,
          }
        } else if (image instanceof File) {
          // Uploaded image file
          return {
            file: image, // For uploaded images, pass the File object
            preview: URL.createObjectURL(image),
          }
        } else {
          return null // Handle any unexpected data types
        }
      })
      .filter((preview) => preview !== null) // Filter out invalid entries
  }, [images])

  const atImageLimit = images?.length >= LISTING_IMAGE_MAX_COUNT

  return (
    <>
      <div className='flex flex-wrap mt-2 w-[80%]'>
        {imagePreviews?.length > 0 &&
          imagePreviews?.map((imageData, index) => (
            <div key={index} className='w-1/5 h-16 p-2 relative group'>
              <Image
                width={50}
                height={50}
                src={imageData.preview}
                alt={`upload-${index}`}
                className='w-full h-full object-cover'
              />
              {!disabled && (
                <button
                  onClick={() => {
                    // Only revoke URL for uploaded files
                    if (imageData.file instanceof File) {
                      URL.revokeObjectURL(imageData.preview)
                    }
                    handleImageRemove(index, imageData?.file)
                    // handleClick(imageData.file);
                  }}
                  className='absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-light-gold text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  title='Remove image'
                // type="button"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
      </div>

      <input
        type='file'
        id='image'
        className='opacity-0 absolute w-0 h-0'
        accept='image/*'
        multiple
        disabled={disabled || atImageLimit}
        onChange={(e) => {
          handleImageChange(e)
          e.target.value = ''
        }}
      />

      <div className='absolute right-[20px] xl:top-0 xxs:top-[55px]'>
        <label
          // htmlFor='image'
          htmlFor={!disabled && !atImageLimit ? 'image' : undefined}
          className={`flex flex-col items-center justify-center w-[176px] xl:h-[154px] xxs:h-[110px] shadow-neonsm my-[19px] ${atImageLimit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
        >
          <Image
            width={45}
            height={45}
            src='/listing/camera.svg'
            alt='Upload Image'
          />
          <span className='text-[17px] text-dark-grey font-normal pt-[18px]'>
            Add Pictures
          </span>
        </label>
      </div>
      {errors && (
        <span className='text-red-500 lg:text-sm text-xs left-0 font-medium absolute top-[99%]'>
          **{errorMessage}
        </span>
      )}
    </>
  )
}

export default React.memo(ListingMultipleImageComponent)
