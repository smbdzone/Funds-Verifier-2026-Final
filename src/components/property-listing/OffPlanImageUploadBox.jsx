'use client'

import React from 'react'
import OffPlanSingleImageUpload from '@/components/property-listing/OffPlanSingleImageUpload'

const OffPlanImageUploadBox = ({
  formats,
  inputId,
  label,
  image,
  onChange,
  onRemove,
  disabled,
  errors,
  errorMessage,
}) => {
  return (
    <div
      className={`relative h-[191px] overflow-hidden px-5 pt-[13px] pb-4 shadow-neons ${
        errors ? 'border border-red-500' : ''
      }`}
    >
      <div className='flex h-full items-center gap-4'>
        <div className='max-w-[192px] shrink-0 self-start pt-1'>
          <h2 className='text-[15px] font-normal leading-[26px] text-dark-grey'>
            Accepted formats:
          </h2>
          <p className='text-[10px] font-normal leading-[177%] text-dark-grey'>
            {formats}
          </p>
        </div>

        <div className='flex min-h-0 min-w-0 flex-1 items-center justify-end'>
          <OffPlanSingleImageUpload
            inputId={inputId}
            label={label}
            image={image}
            onChange={onChange}
            onRemove={onRemove}
            disabled={disabled}
            errors={errors}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </div>
  )
}

export default OffPlanImageUploadBox
