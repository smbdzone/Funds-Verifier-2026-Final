'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'
import {
  PROPERTY_SIZE_UNITS,
  formatPropertySizeNumber,
  parsePropertySizeInput,
  sanitizePropertySizeTyping,
} from '@/libs/propertySizeUnits'

const blockNonPositiveKeys = (e) => {
  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
    e.preventDefault()
  }
}

const SizeInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  error,
}) => (
  <div className='flex items-center gap-1'>
    <span className='whitespace-nowrap text-[15px] text-dark-grey/60'>
      {label}
    </span>
    <input
      type='text'
      inputMode='decimal'
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={blockNonPositiveKeys}
      onBlur={onBlur}
      disabled={disabled}
      placeholder='0'
      className={`h-8 w-[110px] rounded-sm border border-dark-grey/40 px-3 text-[15px] text-dark-grey outline-none disabled:opacity-60 ${error ? 'border-red-500' : ''}`}
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
  const rootRef = useRef(null)

  useEffect(() => {
    if (!unitOpen) return
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setUnitOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [unitOpen])

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

  const handleBoundChange = (bound) => (e) => {
    const next = parsePropertySizeInput(
      sanitizePropertySizeTyping(e.target.value),
    )
    if (sizeUnit === 'SQM') {
      const patch =
        bound === 'from'
          ? {
              sizeSQMFrom: next,
              sizeSQM: next,
            }
          : { sizeSQMTo: next }
      emitChange(patch)
      return
    }
    const patch =
      bound === 'from'
        ? {
            sizeSQFTFrom: next,
            sizeSQFT: next,
          }
        : { sizeSQFTTo: next }
    emitChange(patch)
  }

  const handleUnitPick = (unit) => {
    setUnitOpen(false)
    if (unit !== sizeUnit) {
      emitChange({ sizeUnit: unit, sizeType: unit })
    }
  }

  return (
    <div
      className='relative w-full dropdown-container'
      data-dropdown-root
      ref={rootRef}
    >
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
              aria-expanded={unitOpen}
              onClick={() => setUnitOpen((open) => !open)}
              className='flex h-full w-full items-center justify-between gap-1 text-[15px] font-medium text-dark-grey disabled:cursor-not-allowed disabled:opacity-60'
            >
              {sizeUnit}
              <span className='text-xs text-dark-grey/70'>▾</span>
            </button>
            {unitOpen && !disabled ? (
              <ul className='absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md'>
                {PROPERTY_SIZE_UNITS.map((unit) => (
                  <li key={unit}>
                    <button
                      type='button'
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-offwhite hover:text-reefGold ${
                        unit === sizeUnit ? 'font-semibold text-reefGold' : ''
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
            onChange={handleBoundChange('from')}
            onBlur={onBlur}
            disabled={disabled}
            error={errors}
          />
          <SizeInput
            label='To:'
            name={sizeUnit === 'SQM' ? 'sizeSQMTo' : 'sizeSQFTTo'}
            value={toDisplay}
            onChange={handleBoundChange('to')}
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
