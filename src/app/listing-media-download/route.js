import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getBackendApiBase() {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
  return base || null
}

function sanitizeFilename(name) {
  const trimmed = String(name || 'download').trim() || 'download'
  return trimmed.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 200)
}

function normalizeDownloadTarget(raw) {
  let target = String(raw || '').trim()
  if (!target) return ''

  for (let i = 0; i < 3; i += 1) {
    try {
      const decoded = decodeURIComponent(target)
      if (decoded === target) break
      target = decoded
    } catch {
      break
    }
  }

  return target
}

async function forwardToBackend(target, filename) {
  const apiBase = getBackendApiBase()
  if (!apiBase) return null

  const normalizedTarget = normalizeDownloadTarget(target)
  if (!normalizedTarget) return null

  try {
    const backendRes = await fetch(`${apiBase}/listing-media-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: normalizedTarget, filename }),
      cache: 'no-store',
    })

    const contentType =
      backendRes.headers.get('content-type') || 'application/octet-stream'

    if (!backendRes.ok) {
      let message = 'Could not download media'
      try {
        if (contentType.includes('json')) {
          const body = await backendRes.json()
          message = body.message || message
        }
      } catch {
        /* ignore */
      }
      return NextResponse.json({ message }, { status: backendRes.status })
    }

    if (contentType.includes('json')) {
      return NextResponse.json(
        { message: 'Upstream did not return media' },
        { status: 502 },
      )
    }

    const buffer = await backendRes.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition':
          backendRes.headers.get('content-disposition') ||
          `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'private, max-age=120',
        'X-Content-Type-Options': 'nosniff',
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
          : error?.message || 'Media download proxy failed',
      },
      { status: 502 },
    )
  }
}

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams
  const target = searchParams.get('url')
  const filename = sanitizeFilename(searchParams.get('filename'))
  return forwardToBackend(target, filename)
}

export async function POST(request) {
  let body = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }

  const target = body?.url
  const filename = sanitizeFilename(body?.filename)
  return forwardToBackend(target, filename)
}
