/**
 * Burn a light white centered "FUNDS VERIFIER" text watermark onto listing photos.
 * Applied client-side on upload so saved assets (and downloads) include branding.
 * Style matches agency-style centered translucent white typography.
 */

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

function canvasToFile(canvas, sourceFile, quality = 0.92) {
  const preferPng =
    String(sourceFile?.type || '').toLowerCase().includes('png') ||
    /\.png$/i.test(sourceFile?.name || '')

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
        const ext = preferPng ? 'png' : 'jpg'
        const type = preferPng ? 'image/png' : 'image/jpeg'
        resolve(
          new File([blob], `${baseName}-fv.${ext}`, {
            type,
            lastModified: Date.now(),
          }),
        )
      },
      preferPng ? 'image/png' : 'image/jpeg',
      quality,
    )
  })
}

/**
 * Centered translucent white text — similar to agency listing watermarks.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {{ title?: string, subtitle?: string, opacity?: number }} [opts]
 */
export function drawFundsVerifierTextWatermark(ctx, width, height, opts = {}) {
  const title = String(opts.title || 'FUNDS VERIFIER').toUpperCase()
  const subtitle = String(opts.subtitle || 'VERIFIED LISTING').toUpperCase()
  const opacity = Number.isFinite(opts.opacity) ? opts.opacity : 0.42

  const minSide = Math.min(width, height)
  const titleSize = Math.max(18, Math.round(minSide * 0.055))
  const subtitleSize = Math.max(11, Math.round(minSide * 0.028))
  const gap = Math.round(titleSize * 0.35)
  const cx = width / 2
  const cy = height / 2

  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
  // Soft shadow so light text stays readable on bright skies
  ctx.shadowColor = 'rgba(0, 0, 0, 0.18)'
  ctx.shadowBlur = Math.max(2, Math.round(minSide * 0.008))
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = Math.max(1, Math.round(minSide * 0.002))

  ctx.font = `600 ${titleSize}px Georgia, "Times New Roman", Times, serif`
  ctx.fillText(title, cx, cy - gap * 0.35)

  ctx.font = `500 ${subtitleSize}px Georgia, "Times New Roman", Times, serif`
  ctx.letterSpacing = '0.12em'
  ctx.fillText(subtitle, cx, cy + titleSize * 0.55)

  ctx.restore()
}

/**
 * @param {File|Blob} file
 * @param {{ position?: 'center' | 'bottom-left' | 'top-right', opacity?: number }} [options]
 * @returns {Promise<File>}
 */
export async function applyListingWatermark(file, options = {}) {
  if (!file || typeof window === 'undefined') return file

  const photo = await loadImageFromFile(file)
  const width = photo.naturalWidth || photo.width
  const height = photo.naturalHeight || photo.height
  if (!width || !height) return file

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(photo, 0, 0, width, height)
  drawFundsVerifierTextWatermark(ctx, width, height, {
    opacity: options.opacity,
  })

  try {
    return await canvasToFile(canvas, file)
  } catch {
    return file
  }
}

/**
 * @param {File[]} files
 * @param {{ position?: 'center' | 'bottom-left' | 'top-right', opacity?: number }} [options]
 * @returns {Promise<File[]>}
 */
export async function applyListingWatermarkToFiles(files, options = {}) {
  const list = Array.from(files || [])
  const out = []
  for (const file of list) {
    try {
      out.push(await applyListingWatermark(file, options))
    } catch {
      out.push(file)
    }
  }
  return out
}
