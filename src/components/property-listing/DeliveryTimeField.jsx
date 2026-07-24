'use client'

import React from 'react'
import Image from 'next/image'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

const DeliveryTimeField = ({
  deliveryQuarter,
  deliveryYear,
  quarterDropdownOpen,
  yearDropdownOpen,
  quarterOptions,
  yearOptions,
  onToggleQuarter,
  onToggleYear,
  onSelectQuarter,
  onSelectYear,
  disabled,
  errors,
  errorsMessage,
}) => {
  return (
    <div className='relative w-full custom-container-dev'>
      <ListingFieldLabel label='Delivery Time' required />
      <div
        className={`flex h-[50px] w-full items-center justify-between px-[18px] shadow-neons ${errors ? 'input-field-error' : ''}`}
      >
        <span className='text-[16px] font-semibold text-dark-grey/60'>
          Delivery Time
        </span>
        <div className='flex items-center gap-4'>
          <div className='relative flex items-center gap-2'>
            <span className='text-[15px] text-dark-grey/60'>Quarter</span>
            <button
              type='button'
              disabled={disabled}
              onClick={onToggleQuarter}
              className='flex min-w-[56px] items-center justify-between gap-2 border-b border-dark-grey/40 pb-1 text-[15px] text-dark-grey disabled:opacity-60'
            >
              <span>{deliveryQuarter || '—'}</span>
              <Image
                width={12}
                height={12}
                src='/listing/arrowgold.svg'
                alt=''
                className='shrink-0'
              />
            </button>
            {quarterDropdownOpen && !disabled && (
              <ul className='absolute right-0 top-[calc(100%+6px)] z-20 max-h-40 w-24 overflow-auto rounded-md border border-gray-200 bg-white shadow-md'>
                {quarterOptions.map((option) => (
                  <li key={option}>
                    <button
                      type='button'
                      className='w-full px-3 py-2 text-left text-sm hover:bg-offwhite hover:text-reefGold'
                      onClick={() => onSelectQuarter(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className='relative flex items-center gap-2'>
            <span className='text-[15px] text-dark-grey/60'>Year</span>
            <button
              type='button'
              disabled={disabled}
              onClick={onToggleYear}
              className='flex min-w-[56px] items-center justify-between gap-2 border-b border-dark-grey/40 pb-1 text-[15px] text-dark-grey disabled:opacity-60'
            >
              <span>{deliveryYear || '—'}</span>
              <Image
                width={12}
                height={12}
                src='/listing/arrowgold.svg'
                alt=''
                className='shrink-0'
              />
            </button>
            {yearDropdownOpen && !disabled && (
              <ul className='absolute right-0 top-[calc(100%+6px)] z-20 max-h-40 w-24 overflow-auto rounded-md border border-gray-200 bg-white shadow-md'>
                {yearOptions.map((option) => (
                  <li key={option}>
                    <button
                      type='button'
                      className='w-full px-3 py-2 text-left text-sm hover:bg-offwhite hover:text-reefGold'
                      onClick={() => onSelectYear(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {errors ? (
        <span className='mt-1 text-xs font-medium text-red-500 lg:text-sm'>
          **{errorsMessage}
        </span>
      ) : null}
    </div>
  )
}

export default DeliveryTimeField
