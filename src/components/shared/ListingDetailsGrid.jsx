'use client'

import { GoDotFill } from 'react-icons/go'

/**
 * Renders listing detail rows; skips empty values unless showEmpty is true.
 */
export default function ListingDetailsGrid({
  rows = [],
  className = 'grid w-full grid-cols-1 gap-x-8 gap-y-2 rounded-md border border-black/10 bg-white px-4 py-4 shadow min-[700px]:grid-cols-2',
  itemClassName = 'flex min-w-0 items-start leading-normal text-xs sm:text-sm',
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
          className={`${itemClassName} ${row.fullWidth ? 'min-[700px]:col-span-2' : ''}`.trim()}
        >
          <GoDotFill className='mr-1.5 mt-0.5 flex shrink-0 text-gold-800' />
          <span className='min-w-0 break-words'>
            {row.label}: {row.value}
          </span>
        </span>
      ))}
    </div>
  )
}
