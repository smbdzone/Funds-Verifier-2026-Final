// Image size helpers for listing uploads.
// Local canvas JPEG compression keeps files under the API 2MB limit.

const API_URL = process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_API_URL
const API_KEY = process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_API_KEY

/** True once a compression API endpoint has been configured. */
export const isCompressionConfigured = () =>
  Boolean(API_URL && String(API_URL).trim())

/**
 * Send one file to the compression API and return the compressed File.
 * @param {File} file
 * @param {{ maxBytes?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<File>}
 */
export async function compressImage(file, opts = {}) {
  if (!isCompressionConfigured()) {
    throw new Error('Image compression API is not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  if (opts.maxBytes) formData.append('maxBytes', String(opts.maxBytes))

  const res = await fetch(String(API_URL).trim(), {
    method: 'POST',
    headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : undefined,
    body: formData,
    signal: opts.signal,
  })

  if (!res.ok) {
    throw new Error(`Image compression failed (HTTP ${res.status})`)
  }

  const blob = await res.blob()
  if (!blob || blob.size === 0) {
    throw new Error('Image compression returned an empty file')
  }

  return new File([blob], file.name, {
    type: blob.type || file.type || 'image/jpeg',
  })
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image for compression'))
    }
    img.src = url
  })
}

function canvasToJpeg(canvas, name, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Compression produced an empty image'))
          return
        }
        const baseName = String(name || 'image.jpg').replace(/\.[^.]+$/, '')
        resolve(
          new File([blob], `${baseName}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }),
        )
      },
      'image/jpeg',
      quality,
    )
  })
}

const QUALITIES = [0.82, 0.72, 0.62, 0.52, 0.42, 0.32, 0.22]

/**
 * Browser-side resize + JPEG compression until under maxBytes.
 * Always returns a file <= maxBytes or throws.
 *
 * @param {File} file
 * @param {number} maxBytes
 * @returns {Promise<File>}
 */
export async function compressImageLocally(file, maxBytes) {
  if (typeof window === 'undefined') return file
  if (!maxBytes || file.size <= maxBytes) return file

  const photo = await loadImage(file)
  let width = photo.naturalWidth || photo.width
  let height = photo.naturalHeight || photo.height
  if (!width || !height) {
    throw new Error('Could not read image dimensions for compression')
  }

  const maxEdge = 1600
  if (width > maxEdge || height > maxEdge) {
    const scale = maxEdge / Math.max(width, height)
    width = Math.max(1, Math.round(width * scale))
    height = Math.max(1, Math.round(height * scale))
  }

  let best = null

  const draw = (w, h) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(photo, 0, 0, w, h)
    return canvas
  }

  for (let shrink = 0; shrink < 8; shrink += 1) {
    if (shrink > 0) {
      width = Math.max(320, Math.round(width * 0.8))
      height = Math.max(320, Math.round(height * 0.8))
    }

    for (const quality of QUALITIES) {
      const canvas = draw(width, height)
      if (!canvas) break
      const next = await canvasToJpeg(canvas, file.name, quality)
      if (!best || next.size < best.size) best = next
      if (next.size <= maxBytes) return next
    }
  }

  if (best && best.size <= maxBytes) return best

  throw new Error(
    `Image is still larger than the ${(maxBytes / (1024 * 1024)).toFixed(0)}MB limit after compression`,
  )
}

/**
 * Ensure a file is within `maxBytes`. Uses remote API when configured, otherwise
 * local canvas compression. Never returns an oversized file.
 *
 * @param {File} file
 * @param {number} maxBytes
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<File>}
 */
export async function ensureWithinSize(file, maxBytes, opts = {}) {
  if (!maxBytes || file.size <= maxBytes) return file

  if (isCompressionConfigured()) {
    try {
      const compressed = await compressImage(file, {
        maxBytes,
        signal: opts.signal,
      })
      if (compressed.size <= maxBytes) return compressed
    } catch {
      // Fall through to local compression.
    }
  }

  return compressImageLocally(file, maxBytes)
}

/**
 * Ensure every file in a list is within `maxBytes` (compressing as needed).
 *
 * @param {File[]} files
 * @param {number} maxBytes
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<File[]>}
 */
export async function ensureAllWithinSize(files, maxBytes, opts = {}) {
  return Promise.all(
    Array.from(files || []).map((f) => ensureWithinSize(f, maxBytes, opts)),
  )
}
