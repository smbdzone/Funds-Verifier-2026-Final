import Image from 'next/image'
import React, { useMemo, useState } from 'react'

import {
  LISTING_IMAGE_MAX_COUNT,
} from '@/constants/listingUploadLimits'
import ListingImagePreviewModal from '@/components/ListingsImageComponent/ListingImagePreviewModal'

const ListingMultipleImageComponent = ({
  images,
  handleImageRemove,
  handleImageChange,
  errors,
  errorMessage,
  disabled,
  inputId = 'additional-pictures',
  uploadLabel = 'Add Pictures',
}) => {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const imagePreviews = useMemo(() => {
    if (!images || !Array.isArray(images)) {
      return []
    }

    return images
      .filter((image) => image)
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
          return {
            file: image,
            preview: URL.createObjectURL(image),
          }
        }
        return null
      })
      .filter((preview) => preview !== null)
  }, [images])

  const atImageLimit = images?.length >= LISTING_IMAGE_MAX_COUNT

  return (
    <>
      <div className='flex h-full min-h-0 items-stretch gap-3'>
        <div className='min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pr-1'>
          <div className='flex flex-wrap content-start gap-2'>
            {imagePreviews.map((imageData, index) => (
              <div
                key={index}
                className='group relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-sm border border-dark-grey/15 bg-offwhite'
              >
                <button
                  type='button'
                  onClick={() => setLightboxSrc(imageData.preview)}
                  className='block h-full w-full cursor-zoom-in'
                  title='Click to preview watermark'
                >
                  <Image
                    width={52}
                    height={52}
                    src={imageData.preview}
                    alt={`upload-${index}`}
                    className='h-full w-full object-cover'
                  />
                </button>
                {!disabled && (
                  <button
                    type='button'
                    onClick={() => {
                      if (imageData.file instanceof File) {
                        URL.revokeObjectURL(imageData.preview)
                      }
                      handleImageRemove(index, imageData?.file)
                    }}
                    className='absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-light-gold text-[10px] leading-none text-white opacity-0 transition-opacity group-hover:opacity-100'
                    title='Remove image'
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <input
          type='file'
          id={inputId}
          className='pointer-events-none absolute h-0 w-0 opacity-0'
          accept='image/*'
          multiple
          disabled={disabled || atImageLimit}
          onChange={(e) => {
            handleImageChange(e)
            e.target.value = ''
          }}
        />

        <label
          htmlFor={!disabled && !atImageLimit ? inputId : undefined}
          className={`flex h-[88px] w-[120px] shrink-0 flex-col items-center justify-center shadow-neonsm ${atImageLimit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
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

      {lightboxSrc ? (
        <ListingImagePreviewModal
          src={lightboxSrc}
          alt='Picture preview'
          onClose={() => setLightboxSrc(null)}
        />
      ) : null}
    </>
  )
}

export default React.memo(ListingMultipleImageComponent)
