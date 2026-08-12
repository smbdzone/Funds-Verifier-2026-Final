'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

/**
 * Wrap any QR image preview. On hover, auto-scans and shows encoded text.
 * Popup is fixed/portaled so mobile overflow does not hide it.
 */
export default function QrDecodeHover({
  src,
  children,
  className = '',
  disabled = false,
}) {
  const tooltipId = useId()
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const [open, setOpen] = useState(false)
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

  const updatePanelPosition = useCallback(() => {
    const root = rootRef.current
    if (!root || typeof window === 'undefined') return

    const rect = root.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(PANEL_WIDTH, vw - 16)
    const panelHeight = panelRef.current?.offsetHeight || 140
    const spaceBelow = vh - rect.bottom
    const spaceAbove = rect.top
    const placeAbove =
      spaceBelow < panelHeight + PANEL_GAP + 12 && spaceAbove > spaceBelow

    let top = placeAbove
      ? rect.top - panelHeight - PANEL_GAP
      : rect.bottom + PANEL_GAP
    top = clamp(top, 8, Math.max(8, vh - panelHeight - 8))

    let left = rect.left
    left = clamp(left, 8, Math.max(8, vw - width - 8))

    setPanelStyle({
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      width: `${Math.round(width)}px`,
      zIndex: 99999,
    })
  }, [])

  const openPanel = useCallback(() => {
    if (disabled || !src) return
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer, disabled, src])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
      setPanelStyle(null)
    }, 160)
  }, [clearCloseTimer])

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

  const panel = open && mounted && panelStyle ? (
    <div
      ref={panelRef}
      id={tooltipId}
      role='tooltip'
      style={panelStyle}
      className='rounded-md border border-[#A2913E]/40 bg-white p-3 text-left shadow-lg'
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
  ) : null

  return (
    <div
      ref={rootRef}
      className={`relative overflow-visible ${className}`}
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
      onFocus={openPanel}
      onBlur={scheduleClose}
    >
      <div
        aria-describedby={open ? tooltipId : undefined}
        title='Hover to see QR contents'
      >
        {children}
      </div>

      {mounted ? createPortal(panel, document.body) : null}
    </div>
  )
}
