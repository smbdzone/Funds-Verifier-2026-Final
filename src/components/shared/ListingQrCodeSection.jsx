'use client'

import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'
import { getListingQrScanSrc } from '@/libs/listingCardMedia'

/**
 * QR block for listing detail pages — click opens the listing.
 */
export default function ListingQrCodeSection({
  listing,
  src,
  className = '',
}) {
  const qrSrc = src || getListingQrScanSrc(listing)

  return (
    <div className={`mb-3 ${className}`}>
      <p className='mb-2 text-base font-medium md:text-lg'>QR Code</p>
      {qrSrc ? (
        <ListingCardQrThumb
          listing={listing}
          src={qrSrc}
          size={96}
          className='inline-block'
        />
      ) : (
        <p className='text-sm text-black/50'>Not uploaded yet</p>
      )}
    </div>
  )
}
