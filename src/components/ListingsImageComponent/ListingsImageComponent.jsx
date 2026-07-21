import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { getListingImageSrc } from '@/libs/listingCardMedia'

const PLACEHOLDER = '/listing/camera.svg'

function resolveThumbnailPreview(image) {
  if (!image) return null

  if (typeof image === 'string') {
    if (image.startsWith('http') || image.startsWith('blob:') || image.startsWith('/')) {
      return image
    }
    return null
  }

  if (image instanceof File || image instanceof Blob) {
    return URL.createObjectURL(image)
  }

  const fromMedia = getListingImageSrc(image)
  if (fromMedia && fromMedia !== PLACEHOLDER) return fromMedia

  return null
}

const ListingsImageComponent = ({
  errors,
  image,
  errorMessage,
  handleImageRemove,
  handleThumbImageChange,
  disabled,
  inputId = 'thumbnail',
  uploadLabel = 'Upload Thumbnail',
}) => {
  const [objectUrl, setObjectUrl] = useState(null)

  const imageUrl = useMemo(() => {
    if (!image) return null
    if (image instanceof File || image instanceof Blob) {
      return objectUrl
    }
    return resolveThumbnailPreview(image)
  }, [image, objectUrl])

  useEffect(() => {
    if (!(image instanceof File || image instanceof Blob)) {
      setObjectUrl(null)
      return undefined
    }
    const url = URL.createObjectURL(image)
    setObjectUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [image])

  return (
    <>
      <div className='flex flex-wrap mt-2 w-[80%]'>
        {image && imageUrl ? (
          <div className='w-2/5 p-2 relative group'>
            <div className='h-[20px]'>
              <Image
                width={100}
                height={100}
                src={imageUrl}
                alt='Uploaded thumbnail'
                unoptimized
                className='w-full bg-cover h-[100px] object-contain'
              />
            </div>
            {!disabled && (
              <button
                type='button'
                onClick={() => handleImageRemove(image?.public_id)}
                className='absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-light-gold text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                title='Remove image'
              >
                &times;
              </button>
            )}
          </div>
        ) : null}
      </div>

      <input
        type='file'
        id={inputId}
        className='opacity-0 absolute w-0 h-0'
        accept='image/*'
        disabled={disabled}
        onChange={handleThumbImageChange}
      />

      <div className='absolute right-[20px] xl:top-0 xxs:top-[55px]'>
        <label
          htmlFor={!disabled ? inputId : undefined}
          className={`flex flex-col items-center justify-center w-[176px] xl:h-[154px] xxs:h-[110px] shadow-neonsm my-[19px] ${disabled
            ? 'cursor-not-allowed opacity-50 pointer-events-none'
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
            {uploadLabel}
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
