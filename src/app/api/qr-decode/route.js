import { NextResponse } from 'next/server'
import sharp from 'sharp'
import jsQR from 'jsqr'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getApiOrigin() {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim()
  if (!base) return null
  try {
    return new URL(base).origin
  } catch {
    return null
  }
}

function isAllowedQrImageUrl(target) {
  let parsed
  try {
    parsed = new URL(target)
  } catch {
    return false
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false
  const apiOrigin = getApiOrigin()
  if (apiOrigin && parsed.origin === apiOrigin) return true
  const host = parsed.hostname.toLowerCase()
  if (host.endsWith('.cloudfront.net')) return true
  if (host.includes('amazonaws.com')) return true
  if (host === 'fundsverifier.com' || host.endsWith('.fundsverifier.com')) return true
  return false
}

function extractTargetUrl(requestUrl) {
  try {
    const direct = new URL(requestUrl).searchParams.get('url')
    if (direct) return direct.trim()
  } catch {
    /* ignore */
  }
  const marker = 'url='
  const idx = String(requestUrl || '').indexOf(marker)
  if (idx === -1) return ''
  return decodeURIComponent(String(requestUrl).slice(idx + marker.length).trim())
}

async function rgbaFromSharp(pipeline) {
  const { data, info } = await pipeline
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  if (!info?.width || !info?.height || info.channels < 4) return null
  return {
    data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength),
    width: info.width,
    height: info.height,
  }
}

function tryJsQR(imageData) {
  if (!imageData) return null
  try {
    const result = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    })
    const raw = result?.data
    return typeof raw === 'string' && raw.trim() ? raw.trim() : null
  } catch {
    return null
  }
}

async function decodeQrPayloadFromUrl(target) {
  const upstream = await fetch(target, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
    headers: {
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
  })

  if (!upstream.ok) {
    const err = new Error(`Upstream image HTTP ${upstream.status}`)
    err.status = upstream.status
    throw err
  }

  const buffer = Buffer.from(await upstream.arrayBuffer())
  const pipelines = [
    () => sharp(buffer).rotate(),
    () => sharp(buffer).rotate().normalize(),
    () => sharp(buffer).rotate().greyscale().normalize(),
    () =>
      sharp(buffer)
        .rotate()
        .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: false }),
    () =>
      sharp(buffer)
        .rotate()
        .normalize()
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: false }),
    () =>
      sharp(buffer)
        .rotate()
        .greyscale()
        .normalize()
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: false }),
  ]

  for (const build of pipelines) {
    try {
      const rgba = await rgbaFromSharp(build())
      const payload = tryJsQR(rgba)
      if (payload) return payload
    } catch {
      /* next */
    }
  }
  return null
}

export async function GET(request) {
  const target = extractTargetUrl(request.url)
  if (!target || !isAllowedQrImageUrl(target)) {
    return NextResponse.json(
      { message: 'Invalid or disallowed image URL', payload: null },
      { status: 400 },
    )
  }

  try {
    const payload = await decodeQrPayloadFromUrl(target)
    if (!payload) {
      return NextResponse.json({
        payload: null,
        message: 'Could not read the data encoded in this QR image',
      })
    }
    return NextResponse.json({ payload, message: 'ok' })
  } catch (error) {
    return NextResponse.json(
      { payload: null, message: error?.message || 'QR decode failed' },
      { status: error?.status && Number(error.status) < 500 ? error.status : 500 },
    )
  }
}
