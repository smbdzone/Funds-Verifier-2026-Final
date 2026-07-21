'use client'

import React from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

const OffPlanAgencyAgreementUpload = ({
  file,
  existingDoc,
  onChange,
  onRemove,
  disabled,
}) => {
  const fileName =
    (file instanceof File && file.name) ||
    existingDoc?.Certificate?.name ||
    existingDoc?.name ||
    (existingDoc ? 'Agency agreement.pdf' : '')

  return (
    <div className='relative w-full'>
      <ListingFieldLabel label='Agency Agreement' required={false} />
      <div className='flex min-h-[50px] w-full flex-wrap items-center justify-between gap-3 px-[18px] py-3 shadow-neons'>
        <div className='min-w-0 flex-1'>
          <p className='text-[15px] font-medium text-dark-grey'>
            Agency Agreement
            <span className='ml-2 text-[12px] font-normal text-dark-grey/60'>
              (optional PDF)
            </span>
          </p>
          {fileName ? (
            <p className='mt-1 truncate text-[13px] text-dark-grey/70'>
              {fileName}
            </p>
          ) : (
            <p className='mt-1 text-[13px] text-dark-grey/50'>
              No file selected
            </p>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {(file || existingDoc) && !disabled ? (
            <button
              type='button'
              onClick={onRemove}
              className='rounded border border-red-600 px-3 py-1.5 text-sm text-red-600'
            >
              Remove
            </button>
          ) : null}
          <label
            className={`cursor-pointer rounded border border-light-gold px-3 py-1.5 text-sm text-light-gold ${
              disabled ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {file || existingDoc ? 'Replace' : 'Upload PDF'}
            <input
              type='file'
              accept='application/pdf'
              className='hidden'
              disabled={disabled}
              onChange={onChange}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default OffPlanAgencyAgreementUpload
