'use client'

import React, { useMemo, useState } from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'
import {
  PROPERTY_SIZE_UNITS,
  formatPropertySizeNumber,
  parsePropertySizeInput,
} from '@/libs/propertySizeUnits'

const SizeInput = ({ label, name, value, onChange, onBlur, disabled, error }) => (
  <div className='flex items-center gap-1'>
    <span className='whitespace-nowrap text-[15px] text-dark-grey/60'>{label}</span>
    <input
      type='text'
      inputMode='decimal'
      name={name}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={`h-8 w-[92px] rounded-sm border border-dark-grey/40 px-3 text-[15px] text-dark-grey outline-none disabled:opacity-60 ${error ? 'border-red-500' : ''}`}
    />
  </div>
)

const OffPlanSizeRange = ({
  sizeSQFTFrom = '',
  sizeSQFTTo = '',
  sizeSQMFrom = '',
  sizeSQMTo = '',
  sizeUnit = 'SQFT',
  label = 'Property size',
  errors,
  errorsMessage,
  disabled,
  onSizeChange,
  onBlur,
}) => {
  const [unitOpen, setUnitOpen] = useState(false)

  const fromDisplay = useMemo(() => {
    const raw = sizeUnit === 'SQM' ? sizeSQMFrom : sizeSQFTFrom
    return formatPropertySizeNumber(raw)
  }, [sizeSQFTFrom, sizeSQMFrom, sizeUnit])

  const toDisplay = useMemo(() => {
    const raw = sizeUnit === 'SQM' ? sizeSQMTo : sizeSQFTTo
    return formatPropertySizeNumber(raw)
  }, [sizeSQFTTo, sizeSQMTo, sizeUnit])

  const emitChange = (patch) => {
    onSizeChange?.({
      sizeSQFTFrom,
      sizeSQFTTo,
      sizeSQMFrom,
      sizeSQMTo,
      sizeUnit,
      sizeType: sizeUnit,
      ...patch,
    })
  }

  const handleFromChange = (e) => {
    const next = parsePropertySizeInput(e.target.value)
    if (sizeUnit === 'SQM') {
      emitChange({ sizeSQMFrom: next })
      return
    }
    emitChange({ sizeSQFTFrom: next })
  }

  const handleToChange = (e) => {
    const next = parsePropertySizeInput(e.target.value)
    if (sizeUnit === 'SQM') {
      emitChange({ sizeSQMTo: next })
      return
    }
    emitChange({ sizeSQFTTo: next })
  }

  const handleUnitPick = (unit) => {
    setUnitOpen(false)
    if (unit !== sizeUnit) {
      emitChange({ sizeUnit: unit, sizeType: unit })
    }
  }

  return (
    <div className='relative w-full'>
      <ListingFieldLabel label={label} required />
      <div
        className={`flex h-[50px] w-full items-center justify-between px-[18px] shadow-neons ${errors ? 'input-field-error' : ''}`}
      >
        <span className='text-[16px] font-semibold text-dark-grey/60'>
          {label}
        </span>
        <div className='flex items-center gap-[10px]'>
          <div className='relative min-w-[72px] border-r border-dark-grey/20 pr-2'>
            <button
              type='button'
              disabled={disabled}
              onClick={() => setUnitOpen((open) => !open)}
              className='flex h-full w-full items-center justify-between gap-1 text-[15px] font-medium text-dark-grey disabled:cursor-not-allowed disabled:opacity-60'
            >
              {sizeUnit}
              <span className='text-xs text-dark-grey/70'>▾</span>
            </button>
            {unitOpen && !disabled ? (
              <ul className='absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md'>
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
            ) : null}
          </div>
          <SizeInput
            label='From:'
            name={sizeUnit === 'SQM' ? 'sizeSQMFrom' : 'sizeSQFTFrom'}
            value={fromDisplay}
            onChange={handleFromChange}
            onBlur={onBlur}
            disabled={disabled}
            error={errors}
          />
          <SizeInput
            label='To:'
            name={sizeUnit === 'SQM' ? 'sizeSQMTo' : 'sizeSQFTTo'}
            value={toDisplay}
            onChange={handleToChange}
            onBlur={onBlur}
            disabled={disabled}
            error={errors}
          />
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

export default OffPlanSizeRange
