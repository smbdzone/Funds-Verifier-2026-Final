'use client'

import { useMemo } from 'react'
import { IoCheckmarkSharp } from 'react-icons/io5'
import {
  facilities,
  bathroomsOptions,
  bedroomsOptions,
  occupancyStatusOptions,
} from '@/constants/listing-data'
import { getListingAmenities } from '@/libs/listingAmenities'

const editInputClass =
  'focus:outline-none mt-1 block w-full px-3 py-3 rounded-md bg-white text-gray-800 text-sm sm:text-base border border-[#8d7c3b]'

const labelClass = 'block text-sm sm:text-base font-medium text-gray-700'

const FURNISHED_OPTIONS = ['Yes', 'No']
const LISTING_OPTIONS = ['Public', 'Private']

const formatWithCommas = (raw) => {
  if (raw == null || raw === '') return ''
  const digits = String(raw).replace(/[^\d]/g, '')
  if (!digits) return ''
  return new Intl.NumberFormat('en-US').format(digits)
}

/**
 * Editable property fields for evaluation (amenities included).
 * Locked contact fields (full name, email, phone) stay outside this component.
 */
export default function EvaluatorPropertyEditableDetails({
  property = {},
  draft,
  onDraftChange,
  onSave,
  isSaving = false,
}) {
  const selectedAmenities = useMemo(() => {
    const fromDraft = Array.isArray(draft?.facilities) ? draft.facilities : null
    if (fromDraft) return fromDraft
    return getListingAmenities(property)
  }, [draft?.facilities, property])

  const setField = (key, value) => {
    onDraftChange?.({ ...(draft || {}), [key]: value })
  }

  const toggleAmenity = (name) => {
    const current = Array.isArray(draft?.facilities)
      ? [...draft.facilities]
      : [...selectedAmenities]
    const next = current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name]
    setField('facilities', next)
  }

  const isLease = property.assetType === 'Property for lease'
  const bedroomValue = String(draft?.bedrooms ?? property.bedrooms ?? '')
  const bedroomChoices = useMemo(() => {
    if (bedroomValue && !bedroomsOptions.includes(bedroomValue)) {
      return [bedroomValue, ...bedroomsOptions]
    }
    return bedroomsOptions
  }, [bedroomValue])

  return (
    <section className='mb-6 rounded-lg border border-[#8d7c3b]/40 bg-[#faf8f3] p-4 sm:p-5'>
      <h2 className='text-base sm:text-lg font-semibold text-prussianBlue mb-4'>
        Edit listing details
      </h2>

      <div className='grid sm:grid-cols-2 gap-4'>
        <div className='sm:col-span-2'>
          <label className={labelClass}>Title</label>
          <input
            type='text'
            className={editInputClass}
            value={draft?.title ?? property.title ?? ''}
            onChange={(e) => setField('title', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Price</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={formatWithCommas(draft?.price ?? property.price ?? '')}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '')
              setField('price', raw)
            }}
            placeholder='0'
          />
        </div>

        <div>
          <label className={labelClass}>Bedrooms</label>
          <select
            className={editInputClass}
            value={bedroomValue}
            onChange={(e) => setField('bedrooms', e.target.value)}
          >
            <option value=''>Select bedrooms</option>
            {bedroomChoices.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Bathrooms</label>
          <select
            className={editInputClass}
            value={String(draft?.bathrooms ?? property.bathrooms ?? '')}
            onChange={(e) => setField('bathrooms', e.target.value)}
          >
            <option value=''>Select bathrooms</option>
            {bathroomsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Developer</label>
          <input
            type='text'
            className={editInputClass}
            value={draft?.developer ?? property.developer ?? ''}
            onChange={(e) => setField('developer', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Is it furnished</label>
          <select
            className={editInputClass}
            value={
              draft?.isFurnished != null
                ? draft.isFurnished
                  ? 'Yes'
                  : 'No'
                : property.isFurnished === true ||
                    property.isFurnished === 'Yes' ||
                    property.isFurnished === 'yes'
                  ? 'Yes'
                  : 'No'
            }
            onChange={(e) =>
              setField('isFurnished', e.target.value === 'Yes')
            }
          >
            {FURNISHED_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Occupancy Status</label>
          <select
            className={editInputClass}
            value={
              draft?.occupancyStatus ?? property.occupancyStatus ?? ''
            }
            onChange={(e) => setField('occupancyStatus', e.target.value)}
          >
            <option value=''>Select status</option>
            {occupancyStatusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Listing</label>
          <select
            className={editInputClass}
            value={draft?.listing ?? property.listing ?? ''}
            onChange={(e) => setField('listing', e.target.value)}
          >
            <option value=''>Select listing</option>
            {LISTING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {isLease ? (
          <div>
            <label className={labelClass}>Lease Number of cheques</label>
            <input
              type='text'
              className={editInputClass}
              value={draft?.lease ?? property.lease ?? ''}
              onChange={(e) => setField('lease', e.target.value)}
            />
          </div>
        ) : null}

        <div>
          <label className={labelClass}>Size (SQFT)</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={draft?.sizeSQFT ?? property.sizeSQFT ?? ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d.]/g, '')
              setField('sizeSQFT', raw)
            }}
          />
        </div>
      </div>

      <div className='mt-4'>
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          className={editInputClass}
          value={draft?.description ?? property.description ?? ''}
          onChange={(e) => setField('description', e.target.value)}
        />
      </div>

      <div className='mt-5'>
        <p className='mb-2 text-sm sm:text-base font-medium text-gray-700'>
          Amenities
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto rounded-md border border-[#8d7c3b]/30 bg-white p-3'>
          {facilities.map((item) => {
            const checked = selectedAmenities.includes(item)
            return (
              <label
                key={item}
                className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={() => toggleAmenity(item)}
                  className='accent-[#8d7c3b]'
                />
                <span className='inline-flex items-center gap-1'>
                  {checked ? (
                    <IoCheckmarkSharp className='text-[#8d7c3b] shrink-0' />
                  ) : null}
                  {item}
                </span>
              </label>
            )
          })}
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
