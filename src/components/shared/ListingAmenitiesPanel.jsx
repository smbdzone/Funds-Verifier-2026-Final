'use client'

import { IoCheckmarkSharp } from 'react-icons/io5'

export default function ListingAmenitiesPanel({
  amenities = [],
  emptyMessage = 'No amenities listed for this listing.',
}) {
  if (!amenities.length) {
    return (
      <p className='px-4 py-6 text-sm text-black/60'>{emptyMessage}</p>
    )
  }

  return (
    <div className='px-2 sm:px-4'>
      <h3 className='mb-3 text-sm font-medium text-prussianBlue md:text-base'>
        Amenities
      </h3>
      <div className='grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3'>
        {amenities.map((item) => (
          <div
            key={item}
            className='flex items-center gap-2 p-2 text-base font-normal'
          >
            <IoCheckmarkSharp
              className='shrink-0 border border-reefGold'
              color='#A2913E'
            />
            <span className='text-xs md:text-base'>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
