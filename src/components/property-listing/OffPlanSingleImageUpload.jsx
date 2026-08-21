'use client'

import Image from 'next/image'
import React, { useMemo } from 'react'

const OffPlanSingleImageUpload = ({
  inputId,
  label,
  image,
  onChange,
  onRemove,
  disabled,
  compact = false,
  errors,
  errorMessage,
}) => {
  const imageUrl = useMemo(() => {
    if (!image) return null
    if (typeof image?.signedUrl === 'string' && image.signedUrl.startsWith('http')) {
      return image.signedUrl
    }
    if (typeof image?.url === 'string' && image.url.startsWith('http')) {
      return image.url
    }
    if (image instanceof File || image instanceof Blob) {
      return URL.createObjectURL(image)
    }
    return null
  }, [image])

  if (compact) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <input
          type='file'
          id={inputId}
          className='absolute h-0 w-0 opacity-0'
          accept='image/*'
          disabled={disabled}
          onChange={onChange}
        />

        {image ? (
          <div className='relative mb-2'>
            <Image
              width={72}
              height={72}
              src={imageUrl}
              alt={label}
              className='h-[72px] w-[72px] object-contain'
            />
            {!disabled && (
              <button
                type='button'
                onClick={onRemove}
                className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-light-gold text-xs text-white'
                title='Remove image'
              >
                &times;
              </button>
            )}
          </div>
        ) : null}

        <label
          htmlFor={!disabled ? inputId : undefined}
          className={`flex flex-col items-center justify-center text-center ${disabled
            ? 'cursor-not-allowed opacity-50 pointer-events-none'
            : 'cursor-pointer'
            }`}
        >
          {!image ? (
            <Image
              width={40}
              height={40}
              src='/listing/camera.svg'
              alt='Upload'
              className='mb-2'
            />
          ) : null}
          <span className='max-w-[110px] text-[13px] leading-[18px] text-dark-grey'>
            {image ? 'Change' : label}
          </span>
        </label>

        {errors && errorMessage ? (
          <span className='mt-1 text-center text-[9px] text-red-500'>
            **{errorMessage}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <div className='relative flex max-h-full items-center justify-center gap-3'>
      {image ? (
        <div className='relative shrink-0'>
          <Image
            width={88}
            height={88}
            src={imageUrl}
            alt={label}
            className='h-[88px] w-[88px] object-contain'
          />
          {!disabled && (
            <button
              type='button'
              onClick={onRemove}
              className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-light-gold text-xs text-white'
              title='Remove image'
            >
              &times;
            </button>
          )}
        </div>
      ) : null}

      <input
        type='file'
        id={inputId}
        className='absolute h-0 w-0 opacity-0'
        accept='image/*'
        disabled={disabled}
        onChange={onChange}
      />

      <label
        htmlFor={!disabled ? inputId : undefined}
        className={`flex h-[130px] w-[176px] shrink-0 flex-col items-center justify-center shadow-neonsm ${disabled
          ? 'cursor-not-allowed opacity-50 pointer-events-none'
          : 'cursor-pointer'
          }`}
      >
        <Image width={45} height={45} src='/listing/camera.svg' alt='Upload' />
        <span className='max-w-[150px] px-2 pt-3 text-center text-[17px] font-normal leading-[21px] text-dark-grey'>
          {label}
        </span>
      </label>

      {errors && errorMessage ? (
        <span className='absolute -bottom-4 left-0 text-xs font-medium text-red-500 lg:text-sm'>
          **{errorMessage}
        </span>
      ) : null}
    </div>
  )
}

export default OffPlanSingleImageUpload
