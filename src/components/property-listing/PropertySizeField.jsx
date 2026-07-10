'use client'

import React, { useMemo, useState } from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'
import {
  PROPERTY_SIZE_UNITS,
  formatPropertySizeNumber,
  parsePropertySizeInput,
} from '@/libs/propertySizeUnits'

const PropertySizeField = ({
  sizeSQFT = '',
  sizeSQM = '',
  sizeUnit = 'SQFT',
  label = 'Property size',
  errors,
  errorsMessage,
  disabled,
  onSizeChange,
  onBlur,
}) => {
  const [unitOpen, setUnitOpen] = useState(false)

  const displayValue = useMemo(() => {
    const raw = sizeUnit === 'SQM' ? sizeSQM : sizeSQFT
    return formatPropertySizeNumber(raw)
  }, [sizeSQFT, sizeSQM, sizeUnit])

  const handleInputChange = (e) => {
    const next = parsePropertySizeInput(e.target.value)
    if (sizeUnit === 'SQM') {
      onSizeChange?.({ sizeSQM: next, sizeUnit })
      return
    }
    onSizeChange?.({ sizeSQFT: next, sizeUnit })
  }

  const handleUnitPick = (unit) => {
    setUnitOpen(false)
    if (unit !== sizeUnit) {
      onSizeChange?.({ sizeSQFT, sizeSQM, sizeUnit: unit, sizeType: unit })
    }
  }

  return (
    <div className='relative w-full'>
      <ListingFieldLabel label={label} required />
      <div
        className={`flex w-full items-stretch shadow-neons ${errors ? 'input-field-error' : ''}`}
      >
        <div className='relative min-w-[96px] border-r border-dark-grey/20'>
          <button
            type='button'
            disabled={disabled}
            onClick={() => setUnitOpen((open) => !open)}
            className='flex h-[50px] w-full items-center justify-between px-3 text-[15px] font-medium text-dark-grey disabled:cursor-not-allowed disabled:opacity-60'
          >
            {sizeUnit}
            <span className='text-xs text-dark-grey/70'>▾</span>
          </button>
          {unitOpen && !disabled && (
            <ul className='absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md'>
              {PROPERTY_SIZE_UNITS.map((unit) => (
                <li key={unit}>
                  <button
                    type='button'
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-offwhite hover:text-reefGold ${unit === sizeUnit ? 'font-semibold text-reefGold' : ''
                      }`}
                    onClick={() => handleUnitPick(unit)}
                  >
                    {unit}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type='text'
          inputMode='decimal'
          name={sizeUnit === 'SQM' ? 'sizeSQM' : 'sizeSQFT'}
          disabled={disabled}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          placeholder={sizeUnit === 'SQM' ? 'Size in SQM' : 'Size in SQFT'}
          className='h-[50px] w-full border-0 pl-4 pr-3 placeholder:text-dark-grey outline-none placeholder:text-[15px] placeholder:font-normal'
        />
      </div>
      {errors ? (
        <span className='mt-1 text-xs font-medium text-red-500 lg:text-sm'>
          **{errorsMessage}
        </span>
      ) : null}
    </div>
  )
}

export default PropertySizeField
