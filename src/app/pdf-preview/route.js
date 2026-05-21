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

/** Only proxy PDFs from our API or known document hosts (CloudFront / S3). */
function isAllowedPdfUrl(target) {
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

  if (!target || !isAllowedPdfUrl(target)) {
    return NextResponse.json(
      { message: 'Invalid or disallowed document URL' },
      { status: 400 },
    )
  }

  try {
    const upstream = await fetch(target, {
      method: 'GET',
      headers: { Accept: 'application/pdf,*/*' },
      cache: 'no-store',
    })

    const contentType = String(
      upstream.headers.get('content-type') || '',
    ).toLowerCase()

    if (!upstream.ok) {
      let message = 'Could not load PDF'
      try {
        if (contentType.includes('json')) {
          const body = await upstream.json()
          message = body.message || message
        }
      } catch {
        /* ignore */
      }
      return NextResponse.json({ message }, { status: upstream.status })
    }

    if (contentType.includes('json')) {
      return NextResponse.json(
        { message: 'Upstream did not return a PDF' },
        { status: 502 },
      )
    }

    const buffer = await upstream.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, max-age=120',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    })
  } catch (error) {
    const refused =
      error?.cause?.code === 'ECONNREFUSED' ||
      error?.code === 'ECONNREFUSED' ||
      String(error?.message || '').includes('ECONNREFUSED')

    return NextResponse.json(
      {
        message: refused
          ? 'API server is not running. Start the backend on port 4000, then try again.'
          : error?.message || 'PDF proxy failed',
      },
      { status: 502 },
    )
  }
}
