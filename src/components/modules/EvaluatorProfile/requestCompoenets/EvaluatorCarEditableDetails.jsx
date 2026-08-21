'use client'

import { useState } from 'react'
import {
  colors,
  technicalFeatures,
  extras as carExtras,
  warrantyOptions,
  bodyConditionOptions,
  mechanicalConditionOptions,
  transmissionTypeOptions,
  fuelTypeOptions,
  steeringSideOptions,
  seatingCapacityOptions,
  doorOptions,
  cylindersOptions,
  engineCapacityOptions,
  horsepowerOptions,
} from '@/constants/car-listings'
import EvaluatorMapUrlField from './EvaluatorMapUrlField'
import ColorTwoToneField from '@/components/ListingFormInput/ColorTwoToneField'

const editInputClass =
  'focus:outline-none mt-1 block w-full px-3 py-3 rounded-md bg-white text-gray-800 text-sm sm:text-base border border-[#8d7c3b]'
const labelClass = 'block text-sm sm:text-base font-medium text-gray-700'
const checkboxGridClass =
  'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 max-h-48 overflow-y-auto rounded-md border border-[#8d7c3b]/30 bg-white p-3'
const sectionHeadClass = 'mt-5 mb-2 text-sm sm:text-base font-semibold text-prussianBlue'

const LISTING_OPTIONS = ['Public', 'Private']

const formatWithCommas = (raw) => {
  if (raw == null || raw === '') return ''
  const digits = String(raw).replace(/[^\d]/g, '')
  if (!digits) return ''
  return new Intl.NumberFormat('en-US').format(digits)
}

const pickValue = (...candidates) => {
  for (const value of candidates) {
    if (value == null) continue
    if (typeof value === 'string' && value.trim() === '') continue
    return value
  }
  return ''
}

const toArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return value.split(/[,|]/).map((s) => s.trim()).filter(Boolean)
  return []
}

function CheckboxGroup({ title, options, selected, onChange, allowCustom = false }) {
  const [customInput, setCustomInput] = useState('')
  const [showInput, setShowInput] = useState(false)

  const toggle = (item) => {
    const current = toArray(selected)
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item]
    onChange(next)
  }

  const addCustom = () => {
    const val = customInput.trim()
    if (!val) return
    const current = toArray(selected)
    if (!current.includes(val)) {
      onChange([...current, val])
    }
    setCustomInput('')
    setShowInput(false)
  }

  // Merge preset options with any custom items already selected
  const allItems = [...new Set([...options, ...toArray(selected)])]

  return (
    <div className='sm:col-span-2'>
      <div className='flex items-center gap-2'>
        <p className={sectionHeadClass}>{title}</p>
        {allowCustom && (
          <button
            type='button'
            onClick={() => setShowInput((v) => !v)}
            className='mb-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#8d7c3b] text-[#8d7c3b] text-sm font-bold hover:bg-[#8d7c3b]/10'
            title={`Add custom ${title}`}
          >
            +
          </button>
        )}
      </div>
      {showInput && (
        <div className='mb-2 flex gap-2'>
          <input
            type='text'
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder={`Add custom ${title.toLowerCase()}...`}
            className='flex-1 rounded-md border border-[#8d7c3b] px-3 py-1.5 text-sm focus:outline-none'
          />
          <button
            type='button'
            onClick={addCustom}
            className='primary-gradient rounded-md px-3 py-1.5 text-sm text-white'
          >
            Add
          </button>
        </div>
      )}
      <div className={checkboxGridClass}>
        {allItems.map((item) => {
          const checked = toArray(selected).includes(item)
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
    </div>
  )
}

export default function EvaluatorCarEditableDetails({
  property = {},
  draft,
  onDraftChange,
  onSave,
  isSaving = false,
}) {
  const setField = (key, value) => {
    onDraftChange?.({ ...(draft || {}), [key]: value })
  }

  return (
    <section className='mb-6 rounded-lg border border-[#8d7c3b]/40 bg-[#faf8f3] p-4 sm:p-5'>
      <h2 className='text-base sm:text-lg font-semibold text-prussianBlue mb-4'>
        Edit listing details
      </h2>

      <div className='grid sm:grid-cols-2 gap-4'>
        {/* ── Basic fields ── */}
        <div className='sm:col-span-2'>
          <label className={labelClass}>Title</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.title, property.title)}
            onChange={(e) => setField('title', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Asset Type</label>
          <input
            type='text'
            className={`${editInputClass} bg-gray-50`}
            value={pickValue(draft?.assetType, property.assetType)}
            readOnly
          />
        </div>

        <div>
          <label className={labelClass}>Make</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.make, property.make)}
            onChange={(e) => setField('make', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Model</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.model, property.model)}
            onChange={(e) => setField('model', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Year</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={pickValue(draft?.year, property.year)}
            onChange={(e) => setField('year', e.target.value.replace(/[^\d]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                e.preventDefault()
              }
            }}
          />
        </div>

        <div>
          <label className={labelClass}>Fuel Type</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.fuelType, property.fuelType)}
            onChange={(e) => setField('fuelType', e.target.value)}
          >
            <option value=''>Select fuel type</option>
            {fuelTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>How much driven</label>
          <div className='mt-1 flex items-stretch gap-0'>
            <input
              type='text'
              inputMode='numeric'
              className={`${editInputClass} rounded-r-none`}
              value={formatWithCommas(pickValue(draft?.kilometers, property.kilometers))}
              onChange={(e) => setField('kilometers', e.target.value.replace(/[^\d]/g, ''))}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                  e.preventDefault()
                }
              }}
            />
            <select
              className={`${editInputClass} mt-0 w-[110px] shrink-0 rounded-l-none border-l-0`}
              value={pickValue(draft?.mileageUnit, property.mileageUnit) || 'km'}
              onChange={(e) => setField('mileageUnit', e.target.value)}
              aria-label='Distance unit'
            >
              <option value='km'>km</option>
              <option value='mile'>mile</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Price</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={formatWithCommas(pickValue(draft?.price, property.price))}
            onChange={(e) => setField('price', e.target.value.replace(/[^\d]/g, ''))}
            placeholder='0'
          />
        </div>

        <div>
          <label className={labelClass}>Body Condition</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.bodyCondition, property.bodyCondition)}
            onChange={(e) => setField('bodyCondition', e.target.value)}
          >
            <option value=''>Select condition</option>
            {bodyConditionOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Mechanical condition</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.mechanicalCondition, property.mechanicalCondition)}
            onChange={(e) => setField('mechanicalCondition', e.target.value)}
          >
            <option value=''>Select condition</option>
            {mechanicalConditionOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Transmission Type</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.transmissionType, property.transmissionType)}
            onChange={(e) => setField('transmissionType', e.target.value)}
          >
            <option value=''>Select transmission</option>
            {transmissionTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Steering Side</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.steeringSide, property.steeringSide)}
            onChange={(e) => setField('steeringSide', e.target.value)}
          >
            <option value=''>Select steering</option>
            {steeringSideOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Seats</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.seats, property.seats)}
            onChange={(e) => setField('seats', e.target.value)}
          >
            <option value=''>Select seats</option>
            {seatingCapacityOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Doors</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.doors, property.doors)}
            onChange={(e) => setField('doors', e.target.value)}
          >
            <option value=''>Select doors</option>
            {doorOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>No. of Cylinders</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.noofCylinders, property.noofCylinders)}
            onChange={(e) => setField('noofCylinders', e.target.value)}
          >
            <option value=''>Select cylinders</option>
            {cylindersOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Engine Capacity</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.engineCapacity, property.engineCapacity)}
            onChange={(e) => setField('engineCapacity', e.target.value)}
          >
            <option value=''>Select engine capacity</option>
            {engineCapacityOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Capacity/Weight</label>
          <div className='mt-1 flex items-stretch gap-0'>
            <input
              type='text'
              inputMode='decimal'
              className={`${editInputClass} rounded-r-none`}
              value={pickValue(draft?.capacityWeight, property.capacityWeight)}
              onChange={(e) => {
                const next = e.target.value.replace(/[^\d.]/g, '')
                const parts = next.split('.')
                const sanitized =
                  parts.length > 2
                    ? `${parts[0]}.${parts.slice(1).join('')}`
                    : next
                setField('capacityWeight', sanitized)
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                  e.preventDefault()
                }
              }}
            />
            <select
              className={`${editInputClass} mt-0 w-[90px] shrink-0 rounded-l-none border-l-0`}
              value={
                pickValue(draft?.capacityWeightUnit, property.capacityWeightUnit) ||
                'kg'
              }
              onChange={(e) => setField('capacityWeightUnit', e.target.value)}
              aria-label='Weight unit'
            >
              <option value='kg'>kg</option>
              <option value='lb'>lb</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Horsepower</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.horsepower, property.horsepower)}
            onChange={(e) => setField('horsepower', e.target.value)}
          >
            <option value=''>Select horsepower</option>
            {horsepowerOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Warranty</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.warranty, property.warranty)}
            onChange={(e) => setField('warranty', e.target.value)}
          >
            <option value=''>Select warranty</option>
            {warrantyOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>VIN</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={pickValue(draft?.VIN, property.VIN)}
            onChange={(e) => setField('VIN', e.target.value.replace(/[^\d]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                e.preventDefault()
              }
            }}
          />
        </div>

        <div>
          <label className={labelClass}>Project Number</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={pickValue(draft?.dldNumber, property.dldNumber)}
            onChange={(e) =>
              setField('dldNumber', e.target.value.replace(/[^\d]/g, ''))
            }
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                e.preventDefault()
              }
            }}
          />
        </div>

        {/* ── Colors ── */}
        <CheckboxGroup
          title='Exterior Color'
          options={colors}
          selected={draft?.exteriorColor ?? toArray(property.exteriorColor)}
          onChange={(val) => setField('exteriorColor', val)}
          allowCustom
        />

        <div className='sm:col-span-2'>
          <ColorTwoToneField
            title='Exterior Two Tone'
            values={draft?.exteriorTwoTone ?? toArray(property.exteriorTwoTone)}
            onChange={(val) => setField('exteriorTwoTone', val)}
            placeholder='e.g. red/black'
            className='mt-0'
          />
        </div>

        <CheckboxGroup
          title='Interior Color'
          options={colors}
          selected={draft?.interiorColor ?? toArray(property.interiorColor)}
          onChange={(val) => setField('interiorColor', val)}
          allowCustom
        />

        <div className='sm:col-span-2'>
          <ColorTwoToneField
            title='Interior Two Tone'
            values={draft?.interiorTwoTone ?? toArray(property.interiorTwoTone)}
            onChange={(val) => setField('interiorTwoTone', val)}
            placeholder='e.g. red/black'
            className='mt-0'
          />
        </div>

        <div>
          <label className={labelClass}>Listing</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.listing, property.listing)}
            onChange={(e) => setField('listing', e.target.value)}
          >
            <option value=''>Select listing</option>
            {LISTING_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Country</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.country, property.country)}
            onChange={(e) => setField('country', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>City</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.city, property.city)}
            onChange={(e) => setField('city', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Neighbourhood</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.neighbourhood, property.neighbourhood)}
            onChange={(e) => setField('neighbourhood', e.target.value)}
          />
        </div>

        <EvaluatorMapUrlField
          value={pickValue(draft?.mapUrl, property.mapUrl)}
          onChange={(val) => setField('mapUrl', val)}
        />

        {/* ── Checkboxes ── */}
        <CheckboxGroup
          title='Technical Features'
          options={technicalFeatures}
          selected={draft?.technicalFeatures ?? toArray(property.technicalFeatures)}
          onChange={(val) => setField('technicalFeatures', val)}
          allowCustom
        />

        <CheckboxGroup
          title='Extras'
          options={carExtras}
          selected={draft?.extras ?? toArray(property.extras)}
          onChange={(val) => setField('extras', val)}
          allowCustom
        />

        {/* ── Description ── */}
        <div className='sm:col-span-2 mt-2'>
          <label className={labelClass}>Description</label>
          <textarea
            rows={3}
            className={editInputClass}
            value={pickValue(draft?.description, property.description)}
            onChange={(e) => setField('description', e.target.value)}
          />
        </div>
      </div>

      <div className='mt-5 flex justify-end'>
        <button
          type='button'
          onClick={onSave}
          disabled={isSaving}
          className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md disabled:opacity-60'
        >
          {isSaving ? 'Saving…' : 'Save listing details'}
        </button>
      </div>
    </section>
  )
}
