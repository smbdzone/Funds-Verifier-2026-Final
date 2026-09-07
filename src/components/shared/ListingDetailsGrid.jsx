'use client'

import { GoDotFill } from 'react-icons/go'

/**
 * Renders listing detail rows; skips empty values unless showEmpty is true.
 */
export default function ListingDetailsGrid({
  rows = [],
  className = 'grid w-full grid-cols-1 gap-3 rounded-md border border-black/10 bg-white p-4 shadow sm:grid-cols-2 sm:gap-4 sm:p-5',
  itemClassName = 'flex items-start text-xs md:text-sm',
  showEmpty = false,
}) {
  const visible = (rows || []).filter((row) => {
    if (!row || !row.label) return false
    if (showEmpty) return true
    const value = row.value
    if (value == null) return false
    const text = String(value).trim()
    return text !== '' && text !== '—' && text.toLowerCase() !== 'undefined'
  })

  if (!visible.length) return null

  return (
    <div className={className}>
      {visible.map((row) => (
        <span
          key={row.label}
          className={`${itemClassName} ${row.fullWidth ? 'sm:col-span-2' : ''}`.trim()}
        >
          <GoDotFill className='mr-2 mt-0.5 flex shrink-0 text-gold-800' />
          <span>
            {row.label}: {row.value}
          </span>
        </span>
      ))}
    </div>
  )
}
