'use client'

import { useState } from 'react'
import { materials as jewelryMaterials } from '@/constants/listing-data'
import EvaluatorMapUrlField from './EvaluatorMapUrlField'

const editInputClass =
  'focus:outline-none mt-1 block w-full px-3 py-3 rounded-md bg-white text-gray-800 text-sm sm:text-base border border-[#8d7c3b]'
const labelClass = 'block text-sm sm:text-base font-medium text-gray-700'
const checkboxGridClass =
  'grid grid-cols-2 sm:grid-cols-3 gap-1 max-h-56 overflow-y-auto rounded-md border border-[#8d7c3b]/30 bg-white p-3'
const sectionHeadClass = 'mt-5 mb-2 text-sm sm:text-base font-semibold text-prussianBlue'

const LISTING_OPTIONS = ['Public', 'Private']
const conditionOptions = ['Flawless', 'Excellent', 'Average', 'Poor']
const usageOptions = [
  'Still with the dealer',
  'Only used once since it was purchased new',
  'Used only a few times since it was purchased new',
  'Used only once or twice a month since purchased',
  'Used numerous times per week since purchased',
]
const ageOptions = [
  'Brand New', '0-1 months', '1-6 months', '6-12 months',
  '1-2 years', '2-5 years', '5-10 years', '10+ years',
]
const warrantyOptions = ['Yes', 'No', 'Does not apply']

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
    if (!current.includes(val)) onChange([...current, val])
    setCustomInput('')
    setShowInput(false)
  }

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

export default function EvaluatorJewelryEditableDetails({
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
          <label className={labelClass}>Category</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.category, property.category)}
            onChange={(e) => setField('category', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Sub Category (Model)</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.model, property.model)}
            onChange={(e) => setField('model', e.target.value)}
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
          <label className={labelClass}>Weight</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.weight, property.weight)}
            onChange={(e) => setField('weight', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Grams</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.grams, property.grams)}
            onChange={(e) => setField('grams', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Condition</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.condition, property.condition)}
            onChange={(e) => setField('condition', e.target.value)}
          >
            <option value=''>Select condition</option>
            {conditionOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Usage</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.usage, property.usage)}
            onChange={(e) => setField('usage', e.target.value)}
          >
            <option value=''>Select usage</option>
            {usageOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Age</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.age, property.age)}
            onChange={(e) => setField('age', e.target.value)}
          >
            <option value=''>Select age</option>
            {ageOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Warranty</label>
          <select
            className={editInputClass}
            value={pickValue(draft?.warranty, draft?.warrenty, property.warranty, property.warrenty)}
            onChange={(e) => setField('warranty', e.target.value)}
          >
            <option value=''>Select warranty</option>
            {warrantyOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Project Number</label>
          <input
            type='text'
            className={editInputClass}
            value={pickValue(draft?.dldNumber, property.dldNumber)}
            onChange={(e) => setField('dldNumber', e.target.value)}
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

        {/* ── Materials checklist ── */}
        <CheckboxGroup
          title='Materials'
          options={jewelryMaterials}
          selected={draft?.materials ?? toArray(property.materials)}
          onChange={(val) => setField('materials', val)}
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
