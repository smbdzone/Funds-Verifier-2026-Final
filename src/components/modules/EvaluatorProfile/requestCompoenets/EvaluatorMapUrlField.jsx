'use client'

import ListingMapSection from '@/components/ListingsForm/ListingMapSection'

const labelClass = 'block text-sm sm:text-base font-medium text-gray-700'

const editInputClass =
  'focus:outline-none mt-1 block w-full px-3 py-3 rounded-md bg-white text-gray-800 text-sm sm:text-base border border-[#8d7c3b]'

/**
 * Map URL input + live embed preview for evaluator listing edit forms.
 * Matches asset-holder listing form behavior (short goo.gl links resolve via API).
 */
export default function EvaluatorMapUrlField({
  value = '',
  onChange,
  className = 'sm:col-span-2',
  disabled = false,
}) {
  return (
    <div className={className}>
      <label className={labelClass}>Map URL</label>
      <input
        type='url'
        className={editInputClass}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder='Google Maps URL (maps.app.goo.gl or share.google)'
        disabled={disabled}
        maxLength={2000}
      />
      <ListingMapSection
        mapUrl={value || ''}
        showInput={false}
        className='mt-3'
        iframeClassName='w-full h-[240px] sm:h-[280px] rounded-[5px]'
      />
    </div>
  )
}
