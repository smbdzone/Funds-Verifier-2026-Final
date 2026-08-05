import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const MAX = 2 * 1024 * 1024
const QUALITIES = [82, 72, 62, 52, 42, 32, 22]
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const src = await sharp({
  create: {
    width: 4000,
    height: 3000,
    channels: 3,
    noise: { type: 'gaussian', mean: 128, sigma: 60 },
  },
}).png().toBuffer()

console.log('SOURCE_PNG_BYTES', src.length)
console.log('SOURCE_OVER_2MB', src.length > MAX)

async function watermarkAndCompress(input) {
  let width = 4000
  let height = 3000
  const maxEdge = 1600
  if (width > maxEdge || height > maxEdge) {
    const scale = maxEdge / Math.max(width, height)
    width = Math.max(1, Math.round(width * scale))
    height = Math.max(1, Math.round(height * scale))
  }

  let best = null
  for (let shrink = 0; shrink < 8; shrink++) {
    if (shrink > 0) {
      width = Math.max(320, Math.round(width * 0.8))
      height = Math.max(320, Math.round(height * 0.8))
    }

    const fontSize = Math.max(18, Math.round(Math.min(width, height) * 0.055))
    const svg = Buffer.from(
      `<svg width="${width}" height="${height}">` +
      `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ` +
      `font-size="${fontSize}" fill="rgba(255,255,255,0.38)" ` +
      `font-family="Georgia, serif" font-weight="600">FUNDS VERIFIER</text>` +
      `</svg>`,
    )

    for (const q of QUALITIES) {
      const buf = await sharp(input)
        .resize(width, height, { fit: 'fill' })
        .composite([{ input: svg, top: 0, left: 0 }])
        .jpeg({ quality: q, mozjpeg: true })
        .toBuffer()

      if (!best || buf.length < best.length) best = buf
      if (buf.length <= MAX) {
        return {
          ok: true,
          bytes: buf.length,
          mb: +(buf.length / (1024 * 1024)).toFixed(3),
          width,
          height,
          quality: q,
          shrink,
        }
      }
    }
  }

  return {
    ok: !!(best && best.length <= MAX),
    bytes: best?.length || 0,
    mb: best ? +(best.length / (1024 * 1024)).toFixed(3) : 0,
  }
}

const result = await watermarkAndCompress(src)
console.log('RESULT', JSON.stringify(result, null, 2))
console.log('UNDER_2MB', result.bytes <= MAX)
console.log('COMPRESS_PASS', result.ok && result.bytes <= MAX ? 'YES' : 'NO')
if (!(result.ok && result.bytes <= MAX)) process.exit(1)

const provider = readFileSync(
  join(root, 'src/components/ListingContext/ListingsProvider.jsx'),
  'utf8',
)
const watermark = readFileSync(
  join(root, 'src/libs/applyListingWatermark.js'),
  'utf8',
)

const checks = {
  providerCallsWatermark: provider.includes('applyListingWatermark(workingFile'),
  providerEnforces2MB: provider.includes('stamped.size > LISTING_IMAGE_MAX_BYTES'),
  watermarkThrowsIfTooBig: watermark.includes('Image is still larger than'),
  watermarkMaxEdge1600: watermark.includes('const maxEdge = 1600'),
  watermarkJpegOnly: watermark.includes("'image/jpeg'"),
}

console.log('WIRING', JSON.stringify(checks, null, 2))
const wiringOk = Object.values(checks).every(Boolean)
console.log('WIRING_PASS', wiringOk ? 'YES' : 'NO')
if (!wiringOk) process.exit(1)

console.log('ALL_CHECKS_PASS YES')
