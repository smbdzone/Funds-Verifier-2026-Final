'use client'

import { useProfile } from '@/context/UserContext'
import {
  getPrivateListingLockCopy,
  goToDealHunterFinance,
  shouldLockPrivateListing,
} from '@/libs/privateListing'

export default function PrivateListingGate({ listing, children, className = '' }) {
  const { user } = useProfile()
  const locked = shouldLockPrivateListing(listing, user, { staffUnlock: false })

  if (!locked) return children

  const { message, ctaLabel } = getPrivateListingLockCopy(user, listing)

  return (
    <div className={`group relative isolate h-full w-full overflow-hidden ${className}`}>
      <div className='pointer-events-none relative z-0 h-full select-none blur-[8px] brightness-[0.85]'>
        {children}
      </div>
      <button
        type='button'
        onClick={() => goToDealHunterFinance(user)}
        className='absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-[#002d4f]/45 px-3 text-center transition-colors hover:bg-[#002d4f]/55'
      >
        <span className='rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#002d4f]'>
          Private listing
        </span>
        <span className='max-w-[16rem] text-sm font-medium text-white drop-shadow opacity-90 sm:opacity-0 sm:group-hover:opacity-100'>
          {message}
        </span>
        <span
          className='rounded-md px-3 py-1.5 text-xs font-semibold text-[#002d4f] opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
          style={{
            background:
              'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)',
          }}
        >
          {ctaLabel}
        </span>
      </button>
    </div>
  )
}
