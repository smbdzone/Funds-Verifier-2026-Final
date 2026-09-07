/**
 * Burn a centered "FUNDS VERIFIER / VERIFIED LISTING" text watermark onto listing photos.
 * Always outputs JPEG and aggressively compresses until the file is under maxBytes (2MB).
 */

import { LISTING_IMAGE_MAX_BYTES } from '@/constants/listingUploadLimits'

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Could not load image ${file?.name || ''}`))
    }
    img.src = url
  })
}

function canvasToJpegFile(canvas, sourceFile, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create watermarked image'))
          return
        }
        const baseName = String(sourceFile?.name || 'listing-image.jpg').replace(
          /\.[^.]+$/,
          '',
        )
        resolve(
          new File([blob], `${baseName}-fv.jpg`, {
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

/**
 * Centered translucent white text — similar to agency listing watermarks.
 * Two lines: "FUNDS VERIFIER" over "VERIFIED LISTING".
 */
export function drawFundsVerifierTextWatermark(ctx, width, height, opts = {}) {
  const title = String(opts.title || 'FUNDS VERIFIER').toUpperCase()
  const subtitle = String(
    opts.subtitle == null ? 'VERIFIED LISTING' : opts.subtitle,
  ).toUpperCase()
  const opacity = Number.isFinite(opts.opacity) ? opts.opacity : 0.62

  const minSide = Math.min(width, height)
  const titleSize = Math.max(18, Math.round(minSide * 0.055))
  const subtitleSize = Math.max(10, Math.round(titleSize * 0.42))
  const gap = Math.round(titleSize * 0.45)
  const blockHeight = titleSize + (subtitle ? gap + subtitleSize : 0)
  const cx = width / 2
  const top = height / 2 - blockHeight / 2

  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
  ctx.shadowBlur = Math.max(3, Math.round(minSide * 0.012))
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = Math.max(1, Math.round(minSide * 0.002))

  ctx.font = `600 ${titleSize}px Georgia, "Times New Roman", Times, serif`
  ctx.fillText(title, cx, top + titleSize / 2)

  if (subtitle) {
    ctx.font = `500 ${subtitleSize}px Georgia, "Times New Roman", Times, serif`
    ctx.fillText(subtitle, cx, top + titleSize + gap + subtitleSize / 2)
  }

  ctx.restore()
}

function drawWatermarkedCanvas(photo, width, height, options = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  // White fill avoids transparent PNG edges bloating JPEG size oddly.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(photo, 0, 0, width, height)
  drawFundsVerifierTextWatermark(ctx, width, height, {
    opacity: options.opacity,
    title: options.title,
    subtitle: options.subtitle,
  })
  return canvas
}

const QUALITIES = [0.82, 0.72, 0.62, 0.52, 0.42, 0.32, 0.22]

/**
 * Watermark + compress until under maxBytes. Throws if it cannot fit under the limit.
 *
 * @param {File|Blob} file
 * @param {{ position?: string, opacity?: number, maxBytes?: number }} [options]
 * @returns {Promise<File>}
 */
export async function applyListingWatermark(file, options = {}) {
  if (!file || typeof window === 'undefined') return file

  const maxBytes = options.maxBytes || LISTING_IMAGE_MAX_BYTES
  const photo = await loadImageFromFile(file)
  let width = photo.naturalWidth || photo.width
  let height = photo.naturalHeight || photo.height
  if (!width || !height) {
    throw new Error('Could not read image dimensions for watermarking')
  }

  // Start smaller so phone photos compress reliably under 2MB.
  const maxEdge = 1600
  if (width > maxEdge || height > maxEdge) {
    const scale = maxEdge / Math.max(width, height)
    width = Math.max(1, Math.round(width * scale))
    height = Math.max(1, Math.round(height * scale))
  }

  let best = null

  for (let shrink = 0; shrink < 8; shrink += 1) {
    if (shrink > 0) {
      width = Math.max(320, Math.round(width * 0.8))
      height = Math.max(320, Math.round(height * 0.8))
    }

    const canvas = drawWatermarkedCanvas(photo, width, height, options)
    if (!canvas) continue

    for (const quality of QUALITIES) {
      try {
        const next = await canvasToJpegFile(canvas, file, quality)
        if (!best || next.size < best.size) best = next
        if (next.size <= maxBytes) return next
      } catch {
        // try next quality
      }
    }
  }

  if (best && best.size <= maxBytes) return best

  throw new Error(
    `Image is still larger than ${(maxBytes / (1024 * 1024)).toFixed(0)}MB after watermark compression`,
  )
}

/**
 * @param {File[]} files
 * @param {{ position?: string, opacity?: number, maxBytes?: number }} [options]
 * @returns {Promise<File[]>}
 */
export async function applyListingWatermarkToFiles(files, options = {}) {
  const list = Array.from(files || [])
  const out = []
  for (const file of list) {
    out.push(await applyListingWatermark(file, options))
  }
  return out
}
