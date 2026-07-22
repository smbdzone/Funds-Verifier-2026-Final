import Image from 'next/image'
import React, { useEffect, useState } from 'react'
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
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null)
      return undefined
    }

    if (image instanceof File || image instanceof Blob) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }

    setPreviewUrl(resolveThumbnailPreview(image))
    return undefined
  }, [image])

  const handleInputChange = (event) => {
    handleThumbImageChange?.(event)
    event.target.value = ''
  }

  return (
    <>
      <div className='flex h-full min-h-0 items-stretch gap-3'>
        <div className='min-w-0 flex-1 overflow-hidden'>
          {previewUrl ? (
            <div className='group relative h-[88px] w-[88px] overflow-hidden rounded-sm border border-dark-grey/15 bg-offwhite'>
              <Image
                width={88}
                height={88}
                src={previewUrl}
                alt='Uploaded thumbnail'
                unoptimized
                className='h-full w-full object-cover'
              />
              {!disabled && (
                <button
                  type='button'
                  onClick={() =>
                    handleImageRemove?.(image?.public_id || image?.s3Key)
                  }
                  className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-light-gold text-xs text-white opacity-0 transition-opacity group-hover:opacity-100'
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
          className='pointer-events-none absolute h-0 w-0 opacity-0'
          accept='image/*'
          disabled={disabled}
          onChange={handleInputChange}
        />

        <label
          htmlFor={!disabled ? inputId : undefined}
          className={`flex h-[88px] w-[120px] shrink-0 flex-col items-center justify-center shadow-neonsm ${disabled
            ? 'cursor-not-allowed opacity-50 pointer-events-none'
            : 'cursor-pointer'
            }`}
        >
          <Image
            width={32}
            height={32}
            src='/listing/camera.svg'
            alt='Upload Image'
          />
          <span className='pt-2 text-center text-[13px] font-normal text-dark-grey'>
            {uploadLabel}
          </span>
        </label>
      </div>

      {errors && (
        <span className='absolute left-0 top-[99%] text-xs font-medium text-red-500 lg:text-sm'>
          **{errorMessage}
        </span>
      )}
    </>
  )
}

export default React.memo(ListingsImageComponent)
