'use client'

import React from 'react'
import { Trash2 } from 'lucide-react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

/**
 * Ready-market Title Deed — PDF only (same pattern as off-plan Agency Agreement).
 */
const TitleDeedPdfUpload = ({
  file,
  existingDoc,
  onChange,
  onRemove,
  disabled,
  errors,
  errorMessage,
}) => {
  const fileName =
    (file instanceof File && file.name) ||
    existingDoc?.Certificate?.name ||
    existingDoc?.name ||
    existingDoc?.certificate?.Certificate?.name ||
    (existingDoc ? 'Title deed.pdf' : '')

  return (
    <div className='relative w-full'>
      <ListingFieldLabel label='Title Deed' required={false} />
      <div
        className={`flex min-h-[50px] w-full flex-wrap items-center justify-between gap-3 px-[18px] py-3 shadow-neons ${errors ? 'outline outline-1 outline-red-400' : ''
          }`}
      >
        <div className='min-w-0 flex-1'>
          <p className='text-[15px] font-medium text-dark-grey'>
            Title Deed
            <span className='ml-2 text-[12px] font-normal text-dark-grey/60'>
              (PDF only)
            </span>
          </p>
          {fileName ? (
            <p className='mt-1 truncate text-[13px] text-dark-grey/70'>
              {fileName}
            </p>
          ) : (
            <p className='mt-1 text-[13px] text-dark-grey/50'>No file selected</p>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {(file || existingDoc) && !disabled ? (
            <button
              type='button'
              onClick={onRemove}
              aria-label='Delete title deed'
              title='Delete'
              className='flex h-9 w-9 items-center justify-center rounded border border-light-gold text-light-gold transition-colors hover:bg-offwhite'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          ) : null}
          <label
            className={`cursor-pointer rounded border border-light-gold px-3 py-1.5 text-sm text-light-gold ${disabled ? 'pointer-events-none opacity-50' : ''
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
      {errors && errorMessage ? (
        <span className='mt-1 block text-xs font-medium text-red-500'>
          **{errorMessage}
        </span>
      ) : null}
    </div>
  )
}

export default TitleDeedPdfUpload
