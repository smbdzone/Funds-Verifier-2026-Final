'use client'

import { useProfile } from '@/context/UserContext'
import {
  goToDealHunterFinance,
  isDealHunterRole,
  shouldLockPrivateListing,
} from '@/libs/privateListing'
import { getListingCardImageSrc, PLACEHOLDER } from '@/libs/listingCardMedia'

const GOLD =
  'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)'

export default function PrivateListingLockedView({ listing }) {
  const { user } = useProfile()
  const locked = shouldLockPrivateListing(listing, user)
  if (!locked) return null

  const imageSrc = getListingCardImageSrc(listing) || PLACEHOLDER
  const ctaLabel = isDealHunterRole(user)
    ? 'Put your finance information'
    : 'Login and put your finance information'

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14'>
      <div className='overflow-hidden rounded-2xl bg-white shadow-xl'>
        <div className='relative h-[220px] w-full overflow-hidden sm:h-[280px]'>
          <img
            src={imageSrc}
            alt=''
            className='h-full w-full object-cover blur-md brightness-75'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#002d4f]/45 px-4 text-center'>
            <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#002d4f]'>
              Private listing
            </span>
            <h1 className='text-xl font-semibold text-white sm:text-2xl'>
              {listing?.title || 'This listing is private'}
            </h1>
            <p className='max-w-md text-sm text-white/90'>
              Login with UAE Pass and add your finance information. If your
              funds verification covers this listing price, you can view it.
            </p>
            <button
              type='button'
              onClick={() => goToDealHunterFinance(user)}
              className='rounded-md px-5 py-2.5 text-sm font-semibold text-[#002d4f]'
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
