'use client'
import Image from 'next/image'
import React from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

const ListingCustomPlaceholderDropdown = ({
  value,
  name,
  readOnly,
  disabled,
  handleToggleDropdown,
  dropdown,
  dropdownOptions,
  customPlaceholder,
  subPlaceholder,
  dropdownType,
  handleSelectOption,
}) => {
  const safeValue = value ?? ''
  const label = String(customPlaceholder || '').trim()
  const isOptional = String(subPlaceholder || '')
    .toLowerCase()
    .includes('optional')

  return (
    <div className='custom-container-dev'>
      {label ? <ListingFieldLabel label={label} /> : null}
      <div className='relative w-full'>
        <input
          type='text'
          className='w-full shadow-neons h-[50px] pl-5 pr-14 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal'
          name={name}
          value={safeValue}
          readOnly={readOnly}
          disabled={disabled}
          onClick={disabled ? undefined : handleToggleDropdown}
          placeholder={
            safeValue
              ? ''
              : isOptional
                ? `Select ${label || 'option'} (Optional)`
                : `Select ${label || 'option'}`
          }
        />
        <button
          type='button'
          aria-label={`Toggle ${label || name} dropdown`}
          className='absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center gap-0.5 cursor-pointer dropdown-toggle disabled:cursor-not-allowed'
          onClick={disabled ? undefined : handleToggleDropdown}
          disabled={disabled}
        >
          <Image
            width={12}
            height={12}
            src='/listing/Vector.svg'
            alt=''
            className='toggle-icon pointer-events-none'
          />
          <Image
            width={12}
            height={12}
            src='/listing/vector1.svg'
            alt=''
            className='toggle-icon rotate-180 pointer-events-none'
          />
        </button>

        {dropdown && !disabled ? (
          <div className='absolute left-0 right-0 top-[calc(100%+4px)] z-10 flex max-h-80 flex-col gap-2 overflow-auto rounded-md border border-gray-200 bg-white shadow-md cursor-pointer dropdown-toggle'>
            {(dropdownOptions || []).map((option, index) => (
              <div
                key={index}
                className='hover:bg-offwhite hover:text-reefGold p-3'
                onClick={() => handleSelectOption(dropdownType, option)}
              >
                {option}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ListingCustomPlaceholderDropdown
