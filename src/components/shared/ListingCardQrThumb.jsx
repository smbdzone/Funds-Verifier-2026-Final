'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getListingQrScanSrc } from '@/libs/listingCardMedia'
import { getListingSharePath } from '@/libs/listingSocialShare'

/**
 * QR thumb for listing cards.
 * Hover notifies parent so card details (price, location, share) can be revealed.
 */
export default function ListingCardQrThumb({
  listing,
  src,
  className = '',
  size = 72,
  onHoverChange,
}) {
  const qrSrc = src || getListingQrScanSrc(listing)
  const thumbPx =
    Number(size) === 96 ? 96 : Number(size) === 48 ? 48 : 72
  const thumbClass =
    thumbPx === 96
      ? 'listing-qr-thumb listing-qr-thumb-lg h-24 w-24 shrink-0 object-contain'
      : thumbPx === 48
        ? 'listing-qr-thumb h-12 w-12 shrink-0 object-contain'
        : 'listing-qr-thumb h-[72px] w-[72px] shrink-0 object-contain'

  const listingPath = useMemo(
    () => (listing ? getListingSharePath(listing) : ''),
    [listing],
  )

  if (!qrSrc) return null

  const setHovered = (next) => {
    onHoverChange?.(Boolean(next))
  }

  const qrImage = (
    <Image
      src={qrSrc}
      width={thumbPx}
      height={thumbPx}
      alt='QR code'
      className={thumbClass}
      unoptimized
    />
  )

  const frameClass =
    'block rounded bg-white/90 p-0.5 shadow-sm ring-1 ring-black/5 transition hover:ring-[#A2913E]/50 focus:outline-none focus:ring-2 focus:ring-[#A2913E]/40'

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {listingPath ? (
        <Link
          href={listingPath}
          onClick={(e) => e.stopPropagation()}
          className={frameClass}
          aria-label='Open listing'
        >
          {qrImage}
        </Link>
      ) : (
        <div className={frameClass}>{qrImage}</div>
      )}
    </div>
  )
}
