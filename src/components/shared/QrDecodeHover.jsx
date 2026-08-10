'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { decodeQrFromImageSrc } from '@/libs/decodeQrImage'

function looksLikeUrl(value) {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return true
  if (trimmed.startsWith('/')) return true
  // Plain names / IDs with spaces are not URLs
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
 * Wrap any QR image preview. On hover, auto-scans and shows the real
 * encoded text (name, ID, URL, etc.) — not listing/property details.
 */
export default function QrDecodeHover({
  src,
  children,
  className = '',
  disabled = false,
}) {
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const [payload, setPayload] = useState('')
  const scanReqRef = useRef(0)
  const closeTimerRef = useRef(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openPanel = useCallback(() => {
    if (disabled || !src) return
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer, disabled, src])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => setOpen(false), 160)
  }, [clearCloseTimer])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  useEffect(() => {
    if (!open || !src || disabled) return
    if (status === 'ready' || status === 'scanning') return

    const reqId = ++scanReqRef.current
    setStatus('scanning')

    decodeQrFromImageSrc(src)
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
  }, [open, src, status, disabled])

  useEffect(() => {
    setStatus('idle')
    setPayload('')
    scanReqRef.current += 1
  }, [src])

  if (!src || disabled) {
    return <div className={className}>{children}</div>
  }

  const payloadHref = toHref(payload)
  const isLinkPayload = Boolean(payloadHref)

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
      onFocus={openPanel}
      onBlur={scheduleClose}
    >
      <div aria-describedby={open ? tooltipId : undefined}>{children}</div>

      {open ? (
        <div
          id={tooltipId}
          role='tooltip'
          className='absolute left-0 top-full z-[60] mt-2 w-[min(300px,75vw)] rounded-md border border-[#A2913E]/40 bg-white p-3 text-left shadow-lg'
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
