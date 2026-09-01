'use client'

import { useProfile } from '@/context/UserContext'
import {
  getPrivateListingLockCopy,
  goToDealHunterFinance,
  shouldLockPrivateListing,
} from '@/libs/privateListing'
import PrivateListingPreviewFacts from '@/components/shared/PrivateListingPreviewFacts'

export default function PrivateListingGate({ listing, children, className = '' }) {
  const { user, switchUserRole } = useProfile()
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
        onClick={() => goToDealHunterFinance(user, { switchUserRole })}
        className='absolute inset-0 z-40 flex flex-col bg-[#001627]/50 px-3 text-center transition-colors hover:bg-[#001627]/60 sm:px-4'
      >
        <span className='flex flex-1 flex-col items-center justify-center gap-2.5'>
          <span className='rounded-full border border-[#D7C590]/80 bg-[#002d4f]/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F3E6B8] shadow-[0_4px_16px_rgba(0,0,0,0.25)]'>
            Private listing
          </span>
          <span className='max-w-[17rem] text-sm font-medium leading-snug text-white/95 drop-shadow opacity-90 sm:opacity-0 sm:group-hover:opacity-100'>
            {message}
          </span>
          <span
            className='rounded-full px-4 py-2 text-xs font-semibold text-[#002d4f] shadow-[0_6px_18px_rgba(162,145,62,0.35)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
            style={{
              background:
                'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)',
            }}
          >
            {ctaLabel}
          </span>
        </span>
        <PrivateListingPreviewFacts listing={listing} className='mb-3 shrink-0' />
      </button>
    </div>
  )
}
