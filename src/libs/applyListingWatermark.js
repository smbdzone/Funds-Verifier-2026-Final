/**
 * Burn a Funds Verifier logo watermark onto listing photos (logo only, no text).
 * Applied client-side on upload so the saved asset already includes branding.
 */

const LOGO_CANDIDATES = [
  // Exact navbar asset (usually already transparent)
  '/assets/images/fv-navbar-logo.png',
  '/assets/images/fv-navbar-icon.png',
  '/assets/images/logo.svg',
]

let logoLoadPromise = null

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

function loadImageFromUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.crossOrigin = 'anonymous'
    img.src = `${src}${src.includes('?') ? '&' : '?'}v=wm3`
  })
}

/** Knock out white / near-white logo backgrounds so only the mark shows. */
function punchOutWhiteBackground(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // Treat near-white / light-gray plate pixels as transparent
    if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = 0
    } else if (r > 210 && g > 210 && b > 210) {
      // Soft edge fade for anti-aliased white fringe
      const whiteness = (r + g + b) / 3
      data[i + 3] = Math.round(data[i + 3] * ((255 - whiteness) / 45))
    }
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

/**
 * @returns {Promise<HTMLCanvasElement|null>}
 */
async function getWatermarkLogo() {
  if (!logoLoadPromise) {
    logoLoadPromise = (async () => {
      for (const src of LOGO_CANDIDATES) {
        try {
          const img = await loadImageFromUrl(src)
          const iw = img.naturalWidth || img.width
          const ih = img.naturalHeight || img.height
          if (!iw || !ih) continue

          const targetH = 160
          const targetW = Math.max(48, Math.round((iw / ih) * targetH))
          const off = document.createElement('canvas')
          off.width = targetW
          off.height = targetH
          const octx = off.getContext('2d')
          if (!octx) continue
          octx.drawImage(img, 0, 0, targetW, targetH)
          return punchOutWhiteBackground(off)
        } catch {
          // try next candidate
        }
      }
      return null
    })()
  }
  return logoLoadPromise
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

/** Draw navbar logo only — transparent background, no bar/plate. */
function drawLogoWatermark(ctx, width, height, position, logo) {
  if (!logo) return

  const pad = Math.max(14, Math.round(Math.min(width, height) * 0.03))
  const logoH = Math.max(42, Math.round(Math.min(width, height) * 0.12))
  const logoW = Math.round(
    ((logo.width || logo.naturalWidth) /
      (logo.height || logo.naturalHeight || 1)) *
    logoH,
  )

  const x = position === 'top-right' ? width - pad - logoW : pad
  const y = position === 'top-right' ? pad : height - pad - logoH

  ctx.drawImage(logo, x, y, logoW, logoH)
}

/**
 * @param {File|Blob} file
 * @param {{ position?: 'bottom-left' | 'top-right' }} [options]
 * @returns {Promise<File>}
 */
export async function applyListingWatermark(file, options = {}) {
  if (!file || typeof window === 'undefined') return file

  const position = options.position === 'top-right' ? 'top-right' : 'bottom-left'
  const [photo, logo] = await Promise.all([
    loadImageFromFile(file),
    getWatermarkLogo(),
  ])

  if (!logo) return file

  const width = photo.naturalWidth || photo.width
  const height = photo.naturalHeight || photo.height
  if (!width || !height) return file

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file

  ctx.drawImage(photo, 0, 0, width, height)
  drawLogoWatermark(ctx, width, height, position, logo)

  try {
    return await canvasToFile(canvas, file)
  } catch {
    return file
  }
}

/**
 * @param {File[]} files
 * @param {{ position?: 'bottom-left' | 'top-right' }} [options]
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
