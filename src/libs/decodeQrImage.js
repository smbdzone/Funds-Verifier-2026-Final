'use client'

/**
 * Decode the actual payload from a QR image (browser only).
 * Prefers native BarcodeDetector, falls back to jsQR.
 * Uses same-origin proxy when remote images block canvas CORS.
 */

const decodeCache = new Map()

function isRemoteHttpUrl(src) {
  return typeof src === 'string' && /^https?:\/\//i.test(src.trim())
}

function proxyUrlFor(src) {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/api/qr-image-proxy?url=${encodeURIComponent(src)}`
}

function loadImageElement(src, { useCors = true } = {}) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    if (useCors && !src.startsWith('blob:') && !src.startsWith('data:')) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load QR image'))
    img.src = src
  })
}

async function fetchProxyBlob(src) {
  const proxyUrl = proxyUrlFor(src)
  if (!proxyUrl) throw new Error('Proxy unavailable')

  const res = await fetch(proxyUrl, { cache: 'no-store' })
  if (!res.ok) throw new Error('QR image proxy failed')

  const blob = await res.blob()
  if (!blob || blob.size === 0) throw new Error('Empty QR image')
  return blob
}

function getImageData(img) {
  const canvas = document.createElement('canvas')
  const width = img.naturalWidth || img.width
  const height = img.naturalHeight || img.height
  if (!width || !height) throw new Error('QR image has no dimensions')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(img, 0, 0, width, height)
  return ctx.getImageData(0, 0, width, height)
}

async function decodeWithBarcodeDetector(img) {
  if (typeof window === 'undefined' || typeof window.BarcodeDetector !== 'function') {
    return null
  }
  try {
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
    const codes = await detector.detect(img)
    const raw = codes?.[0]?.rawValue
    return typeof raw === 'string' && raw.trim() ? raw.trim() : null
  } catch {
    return null
  }
}

async function decodeWithJsQR(imageData) {
  const { default: jsQR } = await import('jsqr')
  const result = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  })
  const raw = result?.data
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null
}

async function decodeImageElement(img) {
  const fromNative = await decodeWithBarcodeDetector(img)
  if (fromNative) return fromNative

  const imageData = getImageData(img)
  return decodeWithJsQR(imageData)
}

/**
 * @param {string} src
 * @returns {Promise<string|null>} decoded QR text, or null if unreadable
 */
export async function decodeQrFromImageSrc(src) {
  if (!src || typeof window === 'undefined') return null

  if (decodeCache.has(src)) {
    return decodeCache.get(src)
  }

  const pending = (async () => {
    // Same-origin / blob / data — decode directly
    if (!isRemoteHttpUrl(src)) {
      try {
        const img = await loadImageElement(src, { useCors: false })
        return await decodeImageElement(img)
      } catch {
        return null
      }
    }

    // Remote URL — proxy first so canvas is not CORS-tainted
    let objectUrl = ''
    try {
      const blob = await fetchProxyBlob(src)
      objectUrl = URL.createObjectURL(blob)
      const img = await loadImageElement(objectUrl, { useCors: false })
      return await decodeImageElement(img)
    } catch {
      try {
        const img = await loadImageElement(src, { useCors: true })
        return await decodeImageElement(img)
      } catch {
        return null
      }
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  })()

  decodeCache.set(src, pending)
  const value = await pending
  decodeCache.set(src, Promise.resolve(value))
  return value
}
