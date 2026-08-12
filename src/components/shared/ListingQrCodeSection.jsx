'use client'

import { useEffect, useState } from 'react'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'
import { getListingQrScanSrc } from '@/libs/listingCardMedia'
import { decodeQrFromImageSrc } from '@/libs/decodeQrImage'

/**
 * QR block for listing detail pages (property / off-plan / car / boat / jewelry).
 * Desktop: hover popup. Mobile: tap QR + always show decoded text below so it
 * cannot be clipped by page overflow.
 */
export default function ListingQrCodeSection({
  listing,
  src,
  className = '',
}) {
  const qrSrc = src || getListingQrScanSrc(listing)
  const [decoded, setDecoded] = useState('')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!qrSrc) {
      setDecoded('')
      setStatus('idle')
      return
    }
    let cancelled = false
    setStatus('scanning')
    decodeQrFromImageSrc(qrSrc)
      .then((text) => {
        if (cancelled) return
        if (text) {
          setDecoded(text)
          setStatus('ready')
        } else {
          setDecoded('')
          setStatus('error')
        }
      })
      .catch(() => {
        if (cancelled) return
        setDecoded('')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [qrSrc])

  return (
    <div className={`mb-3 overflow-visible ${className}`}>
      <p className='mb-2 text-base font-medium md:text-lg'>QR Code</p>
      {qrSrc ? (
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4'>
          <ListingCardQrThumb
            listing={listing}
            src={qrSrc}
            size={96}
            className='inline-block shrink-0'
          />
          {/* Mobile: show decoded content inline so it never hides off-screen */}
          <div className='min-w-0 flex-1 rounded-md border border-[#A2913E]/30 bg-white p-3 sm:hidden'>
            <p className='mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#A2913E]'>
              Inside this QR
            </p>
            {status === 'scanning' ? (
              <p className='text-xs text-black/60'>Scanning QR…</p>
            ) : null}
            {status === 'error' ? (
              <p className='text-xs text-black/60'>
                Could not read the data encoded in this QR image
              </p>
            ) : null}
            {status === 'ready' && decoded ? (
              <p className='break-all whitespace-pre-wrap text-sm font-medium leading-relaxed text-[#1a1a1a]'>
                {decoded}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className='text-sm text-black/50'>Not uploaded yet</p>
      )}
    </div>
  )
}
