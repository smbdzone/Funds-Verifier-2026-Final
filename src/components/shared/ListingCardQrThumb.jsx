'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { getListingQrScanSrc } from '@/libs/listingCardMedia'
import { decodeQrFromImageSrc } from '@/libs/decodeQrImage'

function looksLikeUrl(value) {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return true
  if (trimmed.startsWith('/')) return true
  // Names / IDs with spaces are not URLs
  if (/\s/.test(trimmed)) return false
  return Boolean(trimmed.includes('.') && !trimmed.includes(' '))
}

function toHref(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed
  if (looksLikeUrl(trimmed)) return `https://${trimmed}`
  return ''
}

/**
 * QR thumb — hover only (not a link). Auto-scans and shows encoded text.
 * Clicks are blocked so parent card links do not navigate.
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

  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | scanning | ready | error
  const [payload, setPayload] = useState('')
  const scanReqRef = useRef(0)
  const closeTimerRef = useRef(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const setHovered = useCallback(
    (next) => {
      onHoverChange?.(Boolean(next))
    },
    [onHoverChange],
  )

  const openPanel = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
    setHovered(true)
  }, [clearCloseTimer, setHovered])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      setHovered(false)
    }, 160)
  }, [clearCloseTimer, setHovered])

  const blockCardNavigation = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  useEffect(() => {
    if (!open || !qrSrc) return
    if (status === 'ready' || status === 'scanning') return

    const reqId = ++scanReqRef.current
    setStatus('scanning')

    decodeQrFromImageSrc(qrSrc)
      .then((decoded) => {
        if (reqId !== scanReqRef.current) return
        if (decoded) {
          setPayload(decoded)
          setStatus('ready')
          return
        }
        setPayload('')
        setStatus('error')
      })
      .catch(() => {
        if (reqId !== scanReqRef.current) return
        setPayload('')
        setStatus('error')
      })
  }, [open, qrSrc, status])

  useEffect(() => {
    setStatus('idle')
    setPayload('')
    scanReqRef.current += 1
  }, [qrSrc])

  if (!qrSrc) return null

  const payloadHref = toHref(payload)
  const isLinkPayload = Boolean(payloadHref)

  const frameClass =
    'block cursor-default rounded bg-white/90 p-0.5 shadow-sm ring-1 ring-black/5 transition hover:ring-[#A2913E]/50'

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
    >
      <div
        className={frameClass}
        aria-describedby={open ? tooltipId : undefined}
        onClick={blockCardNavigation}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Image
          src={qrSrc}
          width={thumbPx}
          height={thumbPx}
          alt='QR code'
          className={thumbClass}
          unoptimized
          draggable={false}
        />
      </div>

      {open ? (
        <div
          id={tooltipId}
          role='tooltip'
          className='absolute right-0 top-full z-50 mt-2 w-[min(300px,75vw)] rounded-md border border-[#A2913E]/40 bg-white p-3 text-left shadow-lg'
          onMouseEnter={openPanel}
          onMouseLeave={scheduleClose}
          onClick={(e) => e.stopPropagation()}
        >
          <p className='mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#A2913E]'>
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
          {status === 'ready' && payload ? (
            isLinkPayload ? (
              <a
                href={payloadHref}
                target='_blank'
                rel='noopener noreferrer'
                className='block break-all whitespace-pre-wrap text-xs font-medium leading-relaxed text-[#1a1a1a] underline decoration-[#A2913E]/50 underline-offset-2 hover:text-[#A2913E]'
                onClick={(e) => e.stopPropagation()}
              >
                {payload}
              </a>
            ) : (
              <p className='break-all whitespace-pre-wrap text-xs font-medium leading-relaxed text-[#1a1a1a]'>
                {payload}
              </p>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
