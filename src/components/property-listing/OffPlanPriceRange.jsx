'use client'

import React from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

const PriceInput = ({ label, name, value, onChange, onBlur, disabled, error }) => (
  <div className='flex items-center gap-1'>
    <span className='text-[15px] text-dark-grey/60 whitespace-nowrap'>{label}</span>
    <input
      type='text'
      inputMode='numeric'
      name={name}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      maxLength={11}
      className={`h-8 w-[148px] border border-dark-grey/40 rounded-sm px-3 text-[15px] text-dark-grey outline-none disabled:opacity-60 ${error ? 'border-red-500' : ''}`}
    />
  </div>
)

const OffPlanPriceRange = ({
  priceFrom,
  priceTo,
  handleChange,
  onBlur,
  disabled,
  errors,
  errorsMessage,
}) => {
  return (
    <div className='relative w-full'>
      <ListingFieldLabel label='Price' required />
      <div
        className={`flex h-[50px] w-full items-center justify-between px-[18px] shadow-neons ${errors ? 'input-field-error' : ''}`}
      >
        <span className='text-[16px] font-semibold text-dark-grey/60'>Price</span>
        <div className='flex items-center gap-[10px]'>
          <PriceInput
            label='From:'
            name='priceFrom'
            value={priceFrom}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            error={errors}
          />
          <PriceInput
            label='To:'
            name='priceTo'
            value={priceTo}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            error={errors}
          />
        </div>
      </div>
      {errors ? (
        <span className='absolute top-[calc(100%-4px)] text-xs font-medium text-red-500 lg:text-sm'>
          **{errorsMessage}
        </span>
      ) : null}
    </div>
  )
}

export default OffPlanPriceRange
