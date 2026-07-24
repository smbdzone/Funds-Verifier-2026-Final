'use client'

import React, { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { getExtraFacilities } from '@/constants/listing-data'
import { autoCapitalizeTitle } from '@/libs/autoCapitalizeText'

/**
 * Preset facilities checklist + golden plus to add custom ones (with golden x to remove).
 */
const FacilitiesChecklist = ({
  presetFacilities = [],
  selectedFacilities = [],
  customFacilities = [],
  onCheckboxChange,
  setFormData,
  disabled = false,
  gridClassName = 'mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1 justify-between gap-y-[10px]',
  title = 'Facilities',
  showTitle = true,
}) => {
  const [addingCustom, setAddingCustom] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [customError, setCustomError] = useState('')

  const extraFacilities = useMemo(
    () =>
      getExtraFacilities(selectedFacilities, customFacilities, presetFacilities),
    [selectedFacilities, customFacilities, presetFacilities]
  )

  const allFacilities = useMemo(
    () => [...(presetFacilities || []), ...extraFacilities],
    [presetFacilities, extraFacilities]
  )

  const addCustomFacility = () => {
    if (disabled || typeof setFormData !== 'function') return

    const name = autoCapitalizeTitle(String(customInput || '').trim())
    if (!name) {
      setCustomError('Enter a facility name')
      return
    }

    const exists = allFacilities.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    )
    if (exists) {
      setCustomError('This facility is already listed')
      return
    }

    setFormData((prev) => {
      const selected = Array.isArray(prev.facilities) ? prev.facilities : []
      const customs = Array.isArray(prev.customFacilities)
        ? prev.customFacilities
        : []
      return {
        ...prev,
        customFacilities: [...customs, name],
        facilities: selected.includes(name) ? selected : [...selected, name],
      }
    })
    setCustomInput('')
    setCustomError('')
    setAddingCustom(false)
  }

  const removeCustomFacility = (name) => {
    if (disabled || typeof setFormData !== 'function') return
    setFormData((prev) => ({
      ...prev,
      customFacilities: (prev.customFacilities || []).filter(
        (item) => item !== name
      ),
      facilities: (prev.facilities || []).filter((item) => item !== name),
    }))
  }

  return (
    <div className='space-y-3'>
      {showTitle ? (
        <div className='flex items-center gap-2'>
          <h2 className='text-dark-black text-xl font-medium'>{title}</h2>
          {!disabled ? (
            <button
              type='button'
              onClick={() => {
                setAddingCustom((open) => !open)
                setCustomError('')
              }}
              className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#8D7C3B]/40 text-[#8D7C3B] transition hover:bg-[#8D7C3B]/10'
              aria-label='Add custom facility'
              title='Add custom facility'
            >
              <Plus className='h-3.5 w-3.5' strokeWidth={2.5} />
            </button>
          ) : null}
        </div>
      ) : null}

      {addingCustom && !disabled ? (
        <div className='flex max-w-md flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value)
                if (customError) setCustomError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomFacility()
                }
                if (e.key === 'Escape') {
                  setAddingCustom(false)
                  setCustomInput('')
                  setCustomError('')
                }
              }}
              placeholder='Add custom facility'
              maxLength={60}
              className='h-10 flex-1 rounded-[3px] border border-[#8D7C3B]/35 px-3 text-sm text-dark-grey outline-none shadow-neons focus:border-[#8D7C3B]'
              autoFocus
            />
            <button
              type='button'
              onClick={addCustomFacility}
              className='h-10 shrink-0 rounded-[3px] bg-light-gold px-4 text-sm font-medium text-whitee shadow-neons'
            >
              Add
            </button>
          </div>
          {customError ? (
            <span className='text-xs font-medium text-red-500'>
              **{customError}
            </span>
          ) : null}
        </div>
      ) : null}

      <form className={gridClassName}>
        {allFacilities.map((facilitie, index) => {
          const isCustom = extraFacilities.includes(facilitie)
          return (
            <div
              className='flex items-center gap-1 pr-1'
              key={`${facilitie}-${index}`}
            >
              <input
                className='custom-checkbox'
                type='checkbox'
                value={facilitie || ''}
                checked={selectedFacilities?.includes(facilitie)}
                onChange={(e) => onCheckboxChange?.(e, 'facilities')}
                disabled={disabled}
              />
              <label className='custom-label'>{facilitie}</label>
              {isCustom && !disabled ? (
                <button
                  type='button'
                  onClick={() => removeCustomFacility(facilitie)}
                  className='ml-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[#8D7C3B] hover:opacity-80'
                  aria-label={`Remove ${facilitie}`}
                  title='Remove custom facility'
                >
                  <X className='h-3 w-3' strokeWidth={2.5} />
                </button>
              ) : null}
            </div>
          )
        })}
      </form>
    </div>
  )
}

export default FacilitiesChecklist
