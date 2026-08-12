'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { getListingQrScanSrc } from '@/libs/listingCardMedia'
import { decodeQrFromImageSrc } from '@/libs/decodeQrImage'

const PANEL_WIDTH = 300
const PANEL_GAP = 8

function looksLikeUrl(value) {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return true
  if (trimmed.startsWith('/')) return true
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

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function isCoarsePointer() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

/**
 * Shared QR thumb — desktop: hover popup; mobile: tap to show/hide.
 * Popup is fixed/portaled so parent overflow cannot clip it.
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
  const rootRef = useRef(null)
  const frameRef = useRef(null)
  const panelRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [status, setStatus] = useState('idle')
  const [payload, setPayload] = useState('')
  const [panelStyle, setPanelStyle] = useState(null)
  const [mounted, setMounted] = useState(false)
  const scanReqRef = useRef(0)
  const closeTimerRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const updatePanelPosition = useCallback(() => {
    const frame = frameRef.current
    if (!frame || typeof window === 'undefined') return

    const rect = frame.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(PANEL_WIDTH, vw - 16)
    const panelHeight = panelRef.current?.offsetHeight || 160
    const spaceBelow = vh - rect.bottom
    const spaceAbove = rect.top
    // Prefer above on mobile / when near bottom so content is not off-screen
    const placeAbove =
      spaceBelow < panelHeight + PANEL_GAP + 24 ||
      (isCoarsePointer() && spaceAbove >= Math.min(panelHeight, 120))

    let top = placeAbove
      ? rect.top - panelHeight - PANEL_GAP
      : rect.bottom + PANEL_GAP
    top = clamp(top, 8, Math.max(8, vh - Math.min(panelHeight, vh - 16) - 8))

    let left = rect.left + rect.width / 2 - width / 2
    left = clamp(left, 8, Math.max(8, vw - width - 8))

    setPanelStyle({
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      width: `${Math.round(width)}px`,
      maxHeight: `${Math.round(vh - 16)}px`,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      zIndex: 99999,
    })
  }, [])

  const openPanel = useCallback(
    ({ pin = false } = {}) => {
      clearCloseTimer()
      setOpen(true)
      setHovered(true)
      if (pin) setPinned(true)
    },
    [clearCloseTimer, setHovered],
  )

  const closePanel = useCallback(() => {
    clearCloseTimer()
    setOpen(false)
    setPinned(false)
    setHovered(false)
    setPanelStyle(null)
  }, [clearCloseTimer, setHovered])

  const scheduleClose = useCallback(() => {
    if (pinned) return
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      setHovered(false)
      setPanelStyle(null)
    }, 160)
  }, [clearCloseTimer, pinned, setHovered])

  const handleFrameClick = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      // Mobile / touch: tap toggles the popup and keeps it open
      if (isCoarsePointer() || pinned) {
        if (open && pinned) {
          closePanel()
        } else {
          openPanel({ pin: true })
        }
        return
      }
    },
    [closePanel, open, openPanel, pinned],
  )

  useLayoutEffect(() => {
    if (!open) return
    updatePanelPosition()
    const id = requestAnimationFrame(updatePanelPosition)
    return () => cancelAnimationFrame(id)
  }, [open, status, payload, updatePanelPosition])

  useEffect(() => {
    if (!open) return
    const onScrollOrResize = () => updatePanelPosition()
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [open, updatePanelPosition])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  // Outside tap closes pinned mobile popup
  useEffect(() => {
    if (!pinned) return
    const onPointerDown = (event) => {
      const inRoot = rootRef.current?.contains(event.target)
      const inPanel = panelRef.current?.contains(event.target)
      if (!inRoot && !inPanel) closePanel()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [pinned, closePanel])

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
    'block cursor-pointer select-none rounded bg-white/90 p-0.5 shadow-sm ring-1 ring-black/5 transition hover:ring-[#A2913E]/50 touch-manipulation'

  const panelBody = (
    <>
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
    </>
  )

  const panel = open && mounted && panelStyle ? (
    <div
      ref={panelRef}
      id={tooltipId}
      role='tooltip'
      style={panelStyle}
      className='rounded-md border border-[#A2913E]/40 bg-white p-3 text-left shadow-lg'
      onMouseEnter={() => openPanel()}
      onMouseLeave={scheduleClose}
      onClick={(e) => e.stopPropagation()}
    >
      {panelBody}
    </div>
  ) : null

  return (
    <div
      ref={rootRef}
      className={`relative overflow-visible ${className}`}
      onMouseEnter={() => {
        if (!isCoarsePointer()) openPanel()
      }}
      onMouseLeave={scheduleClose}
    >
      <div
        ref={frameRef}
        className={frameClass}
        aria-describedby={open ? tooltipId : undefined}
        title='Tap or hover to see QR contents'
        onClick={handleFrameClick}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Image
          src={qrSrc}
          width={thumbPx}
          height={thumbPx}
          alt='QR code'
          className={`${thumbClass} pointer-events-none`}
          unoptimized
          draggable={false}
        />
      </div>

      {mounted ? createPortal(panel, document.body) : null}
    </div>
  )
}
