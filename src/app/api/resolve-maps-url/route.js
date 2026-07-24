import { NextResponse } from 'next/server'
import {
  extractLatLngFromMapsUrl,
  isShortGoogleMapsUrl,
  toGoogleMapsEmbedUrl,
} from '@/libs/listingMapUrl'

export const dynamic = 'force-dynamic'

const ALLOWED_SHORT_HOSTS = new Set(['goo.gl', 'maps.app.goo.gl', 'g.co'])
const ALLOWED_EXPAND_HOSTS = new Set([
  'google.com',
  'maps.google.com',
  'goo.gl',
  'maps.app.goo.gl',
  'g.co',
])

function isAllowedMapsUrl(urlString) {
  try {
    const parsed = new URL(urlString)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    return (
      ALLOWED_EXPAND_HOSTS.has(host) ||
      host.endsWith('.google.com') ||
      host.endsWith('.goo.gl')
    )
  } catch {
    return false
  }
}

/**
 * Follow redirects for Google Maps short links and return an iframe-ready embed URL.
 * GET /api/resolve-maps-url?url=https://maps.app.goo.gl/...
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get('url')?.trim()

  if (!rawUrl) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  if (!isAllowedMapsUrl(rawUrl)) {
    return NextResponse.json({ error: 'Only Google Maps URLs are allowed' }, { status: 400 })
  }

  let resolvedUrl = rawUrl

  try {
    if (isShortGoogleMapsUrl(rawUrl)) {
      const host = new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase()
      if (!ALLOWED_SHORT_HOSTS.has(host)) {
        return NextResponse.json({ error: 'Unsupported short URL host' }, { status: 400 })
      }

      const res = await fetch(rawUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; FundsVerifier/1.0; +https://fundsverifier.com)',
          Accept: 'text/html',
        },
      })

      resolvedUrl = res.url || rawUrl

      // Some environments may not expose final URL; fall back to Location chain via HEAD
      if (isShortGoogleMapsUrl(resolvedUrl)) {
        const head = await fetch(rawUrl, {
          method: 'HEAD',
          redirect: 'manual',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; FundsVerifier/1.0; +https://fundsverifier.com)',
          },
        })
        const location = head.headers.get('location')
        if (location) {
          resolvedUrl = new URL(location, rawUrl).toString()
        }
      }
    }

    if (!isAllowedMapsUrl(resolvedUrl)) {
      return NextResponse.json({ error: 'Resolved URL is not a Google Maps link' }, { status: 400 })
    }

    const embedUrl = toGoogleMapsEmbedUrl(resolvedUrl)
    const coords = extractLatLngFromMapsUrl(resolvedUrl)

    if (!embedUrl) {
      return NextResponse.json(
        {
          error: 'Could not build map embed from this URL',
          resolvedUrl,
        },
        { status: 422 }
      )
    }

    return NextResponse.json({
      resolvedUrl,
      embedUrl,
      coords,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to resolve Maps URL',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    )
  }
}
