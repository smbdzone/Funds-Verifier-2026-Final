'use client'

import { useProfile } from '@/context/UserContext'
import {
  getPrivateListingLockCopy,
  goToDealHunterFinance,
  shouldLockPrivateListing,
} from '@/libs/privateListing'
import { getListingCardImageSrc, PLACEHOLDER } from '@/libs/listingCardMedia'
import PrivateListingPreviewFacts from '@/components/shared/PrivateListingPreviewFacts'

const GOLD =
  'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)'

export default function PrivateListingLockedView({ listing }) {
  const { user, switchUserRole } = useProfile()
  const locked = shouldLockPrivateListing(listing, user)
  if (!locked) return null

  const imageSrc = getListingCardImageSrc(listing) || PLACEHOLDER
  const { detail, ctaLabel } = getPrivateListingLockCopy(user, listing)

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14'>
      <div className='overflow-hidden rounded-2xl bg-white shadow-xl'>
        <div className='relative h-[220px] w-full overflow-hidden sm:h-[280px]'>
          <img
            src={imageSrc}
            alt=''
            className='h-full w-full object-cover blur-md brightness-75'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#001627]/50 px-4 text-center'>
            <span className='rounded-full border border-[#D7C590]/80 bg-[#002d4f]/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#F3E6B8]'>
              Private listing
            </span>
            <h1 className='text-xl font-semibold text-white sm:text-2xl'>
              {listing?.title || 'This listing is private'}
            </h1>
            <p className='max-w-md text-sm text-white/90'>{detail}</p>
            <PrivateListingPreviewFacts listing={listing} className='w-full max-w-lg' />
            <button
              type='button'
              onClick={() => goToDealHunterFinance(user, { switchUserRole })}
              className='rounded-full px-5 py-2.5 text-sm font-semibold text-[#002d4f] shadow-[0_6px_18px_rgba(162,145,62,0.35)]'
              style={{ background: GOLD }}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
