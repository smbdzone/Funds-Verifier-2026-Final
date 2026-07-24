'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Compact glass/gold carousel controls for listing cards
 * (replaces the tall opaque white navigation bars).
 */
const ListingCarouselNavButton = ({
  direction = 'prev',
  onClick,
  className = '',
}) => {
  const isPrev = direction === 'prev'
  const Icon = isPrev ? ChevronLeft : ChevronRight

  return (
    <button
      type='button'
      aria-label={isPrev ? 'Previous image' : 'Next image'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.(e)
      }}
      className={[
        'absolute top-1/2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center',
        'rounded-full border border-white/70 bg-white/80 text-[#8D7C3B] shadow-[0_2px_12px_rgba(0,0,0,0.22)]',
        'backdrop-blur-[6px] transition-all duration-200',
        'hover:scale-105 hover:bg-white hover:text-[#6F6230] hover:shadow-[0_4px_16px_rgba(141,124,59,0.35)]',
        'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D7C3B]/50',
        isPrev ? 'left-2' : 'right-2',
        className,
      ].join(' ')}
    >
      <Icon className='h-4 w-4' strokeWidth={2.5} />
    </button>
  )
}

export default ListingCarouselNavButton
