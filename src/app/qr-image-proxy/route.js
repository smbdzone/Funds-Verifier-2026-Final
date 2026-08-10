import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getApiOrigin() {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim()
  if (!base) return null
  try {
    return new URL(base).origin
  } catch {
    return null
  }
}

/** Only proxy images from our API or known media hosts (CloudFront / S3). */
function isAllowedImageUrl(target) {
  let parsed
  try {
    parsed = new URL(target)
  } catch {
    return false
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return false
  }

  const apiOrigin = getApiOrigin()
  if (apiOrigin && parsed.origin === apiOrigin) {
    return true
  }

  const host = parsed.hostname.toLowerCase()
  if (host.endsWith('.cloudfront.net')) return true
  if (host.includes('amazonaws.com')) return true
  if (host === 'fundsverifier.com' || host.endsWith('.fundsverifier.com')) {
    return true
  }

  return false
}

export async function GET(request) {
  const target = new URL(request.url).searchParams.get('url')

  if (!target || !isAllowedImageUrl(target)) {
    return NextResponse.json(
      { message: 'Invalid or disallowed image URL' },
      { status: 400 },
    )
  }

  try {
    const upstream = await fetch(target, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { message: 'Could not load QR image' },
        { status: upstream.status },
      )
    }

    const contentType = String(
      upstream.headers.get('content-type') || 'image/png',
    ).toLowerCase()

    if (contentType.includes('json') || contentType.includes('text/html')) {
      return NextResponse.json(
        { message: 'Upstream did not return an image' },
        { status: 502 },
      )
    }

    const bytes = await upstream.arrayBuffer()
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': contentType.startsWith('image/')
          ? contentType
          : 'image/png',
        'Cache-Control': 'private, max-age=60',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error?.message || 'QR image proxy failed',
      },
      { status: 500 },
    )
  }
}
