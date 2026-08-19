'use client'

import { useState } from 'react'
import { getListingAmenities } from '@/libs/listingAmenities'
import { getEvaluatorListingContact } from './getEvaluatorListingContact'
import InputField from './InputField'

/** Asset holder name (cleaned), email, and listing phone. */
export function EvaluatorAssetHolderFields({ listing }) {
  const { fullName, email, phoneNumber } = getEvaluatorListingContact(listing)

  return (
    <>
      <div className='mb-4 grid gap-4 sm:grid-cols-2'>
        <InputField label='Asset Holder Full Name' value={fullName} />
        <InputField label='Email Address' value={email} />
      </div>
      <div className='mb-4 grid gap-4 sm:grid-cols-2'>
        <InputField label='Phone Number' value={phoneNumber} />
      </div>
    </>
  )
}

/**
 * Editable amenities/extras checklist.
 * Shows ALL options from `allOptions`; pre-ticks whatever the asset holder selected.
 * If `allOptions` is not provided, falls back to read-only display of selected items only.
 */
export function EvaluatorAmenitiesList({
  listing,
  title = 'Amenities',
  allOptions = [],
  amenityField = null,
  onSave = null,
  isSaving = false,
}) {
  const initialSelected = getListingAmenities(listing)
  const [selected, setSelected] = useState(initialSelected)

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    )
  }

  const handleSave = () => {
    onSave?.(selected)
  }

  // If no full list provided, fall back to read-only display
  if (!allOptions.length) {
    if (!initialSelected.length) {
      return (
        <div className='mb-4'>
          <p className='text-sm font-medium text-[#969696]'>{title}</p>
          <p className='mt-2 text-sm text-[#969696]'>No amenities listed.</p>
        </div>
      )
    }
    return (
      <div className='mb-4'>
        <p className='mb-2 text-sm font-medium text-[#969696]'>{title}</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
          {initialSelected.map((item) => (
            <div key={item} className='col-span-1 flex items-center gap-2 p-2 text-sm text-[#969696]'>
              <input type='checkbox' checked readOnly className='accent-[#8d7c3b]' />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Full editable checklist
  const allItems = [...new Set([...allOptions, ...initialSelected])]

  return (
    <div className='mb-6 rounded-lg border border-[#8d7c3b]/40 bg-[#faf8f3] p-4 sm:p-5'>
      <p className='mb-3 text-base font-semibold text-prussianBlue'>{title}</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 max-h-64 overflow-y-auto rounded-md border border-[#8d7c3b]/30 bg-white p-3'>
        {allItems.map((item) => {
          const checked = selected.includes(item)
          return (
            <label
              key={item}
              className='flex cursor-pointer items-center gap-2 text-sm text-gray-700 p-1 rounded hover:bg-gray-50'
            >
              <input
                type='checkbox'
                checked={checked}
                onChange={() => toggle(item)}
                className='accent-[#8d7c3b] h-4 w-4 shrink-0'
              />
              <span>{item}</span>
            </label>
          )
        })}
      </div>
      {onSave ? (
        <div className='mt-4 flex justify-end'>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving}
            className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md disabled:opacity-60'
          >
            {isSaving ? 'Saving…' : 'Save amenities'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
