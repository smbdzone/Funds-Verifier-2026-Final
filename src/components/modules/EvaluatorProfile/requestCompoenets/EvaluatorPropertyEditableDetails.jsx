'use client'

import { useMemo } from 'react'
import { IoCheckmarkSharp } from 'react-icons/io5'
import {
  facilities,
  bathroomsOptions,
  bedroomsOptions,
  occupancyStatusOptions,
} from '@/constants/listing-data'
import { formatBedBathCount, parseBedBathCount } from '@/libs/bedBathCount'
import { getListingAmenities } from '@/libs/listingAmenities'
import { getListingSizeUnitForEvaluator } from './evaluatorPriceHandlers'

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

/** Prefer non-empty draft values; empty string must fall through to property. */
const pickValue = (...candidates) => {
  for (const value of candidates) {
    if (value == null) continue
    if (typeof value === 'string' && value.trim() === '') continue
    return value
  }
  return ''
}

const isLeaseAsset = (property = {}) => {
  const assetType = String(property.assetType || '').toLowerCase()
  return (
    assetType.includes('lease') ||
    String(property.propertyForLease || '').toLowerCase() === 'yes'
  )
}

const isFurnishedValue = (draft, property) => {
  if (draft?.isFurnished != null) return Boolean(draft.isFurnished)
  const raw = property?.isFurnished
  if (raw === true || raw === 'Yes' || raw === 'yes') return true
  const text = String(raw || '').toLowerCase()
  return text.includes('furnished') && !text.includes('unfurnished')
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
    if (fromDraft?.length) return fromDraft
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

  const isLease = isLeaseAsset(property)
  const sizeUnit = getListingSizeUnitForEvaluator(
    draft?.sizeUnit || draft?.sizeType || property,
  )
  const sizeFieldKey = sizeUnit === 'SQM' ? 'sizeSQM' : 'sizeSQFT'
  const sizeValue = String(
    pickValue(
      draft?.[sizeFieldKey],
      sizeUnit === 'SQM' ? property.sizeSQM : property.sizeSQFT,
      sizeUnit === 'SQM' ? property.sizeSQMFrom : property.sizeSQFTFrom,
    ),
  )
  const bedroomValue = formatBedBathCount(
    pickValue(draft?.bedrooms, property.bedrooms),
  )
  const bedroomChoices = useMemo(() => {
    if (bedroomValue && !bedroomsOptions.includes(bedroomValue)) {
      return [bedroomValue, ...bedroomsOptions]
    }
    return bedroomsOptions
  }, [bedroomValue])

  const leaseValue = String(
    pickValue(
      draft?.leaseNumberofCheques,
      draft?.lease,
      property.leaseNumberofCheques,
      property.lease,
    ),
  )

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
          <label className={labelClass}>Property Type</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.propertyType, property.propertyType)}
            onChange={(e) => setField('propertyType', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Price</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={formatWithCommas(
              pickValue(draft?.price, property.price, property.priceFrom),
            )}
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
            onChange={(e) =>
              setField('bedrooms', parseBedBathCount(e.target.value))
            }
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
            value={String(pickValue(draft?.bathrooms, property.bathrooms))}
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
            value={pickValue(draft?.developer, property.developer)}
            onChange={(e) => setField('developer', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Is it furnished</label>
          <select
            className={editInputClass}
            value={isFurnishedValue(draft, property) ? 'Yes' : 'No'}
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
            value={pickValue(draft?.occupancyStatus, property.occupancyStatus)}
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
            value={pickValue(draft?.listing, property.listing)}
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
              value={leaseValue}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, '')
                onDraftChange?.({
                  ...(draft || {}),
                  lease: raw,
                  leaseNumberofCheques: raw,
                })
              }}
            />
          </div>
        ) : null}

        <div>
          <label className={labelClass}>Size ({sizeUnit})</label>
          <input
            type='text'
            inputMode='numeric'
            className={editInputClass}
            value={sizeValue}
            placeholder={sizeUnit === 'SQM' ? 'Size in SQM' : 'Size in SQFT'}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d.]/g, '')
              onDraftChange?.({
                ...(draft || {}),
                [sizeFieldKey]: raw,
                sizeUnit,
                sizeType: sizeUnit,
              })
            }}
          />
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

        <div>
          <label className={labelClass}>DLD Number</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.dldNumber, property.dldNumber)}
            onChange={(e) => setField('dldNumber', e.target.value)}
          />
        </div>

        <div className='sm:col-span-2'>
          <label className={labelClass}>Map URL</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.mapUrl, property.mapUrl)}
            onChange={(e) => setField('mapUrl', e.target.value)}
          />
        </div>
      </div>

      <div className='mt-4'>
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          className={editInputClass}
          value={pickValue(draft?.description, property.description)}
          onChange={(e) => setField('description', e.target.value)}
        />
      </div>

      <div className='mt-4'>
        <label className={labelClass}>Additional Description</label>
        <textarea
          rows={3}
          className={editInputClass}
          value={pickValue(
            draft?.additionalDescription,
            property.additionalDescription,
          )}
          onChange={(e) => setField('additionalDescription', e.target.value)}
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
