import { NextResponse } from 'next/server'
import {
  extractLatLngFromMapsUrl,
  extractMapsUrlFromHtml,
  isShareGoogleUrl,
  isShortGoogleMapsUrl,
  toGoogleMapsEmbedUrl,
} from '@/libs/listingMapUrl'

export const dynamic = 'force-dynamic'

const ALLOWED_SHORT_HOSTS = new Set([
  'goo.gl',
  'maps.app.goo.gl',
  'g.co',
  'share.google',
])
const ALLOWED_EXPAND_HOSTS = new Set([
  'google.com',
  'maps.google.com',
  'goo.gl',
  'maps.app.goo.gl',
  'g.co',
  'share.google',
])

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

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

async function fetchFollow(url, { method = 'GET', redirect = 'follow' } = {}) {
  return fetch(url, {
    method,
    redirect,
    headers: {
      'User-Agent': BROWSER_UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })
}

/**
 * Follow redirects for Google Maps / share.google short links and return
 * an iframe-ready embed URL.
 * GET /api/resolve-maps-url?url=https://share.google/...
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get('url')?.trim()

  if (!rawUrl) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  if (!isAllowedMapsUrl(rawUrl)) {
    return NextResponse.json(
      { error: 'Only Google Maps / share.google URLs are allowed' },
      { status: 400 },
    )
  }

  let resolvedUrl = rawUrl
  let html = ''

  try {
    if (isShortGoogleMapsUrl(rawUrl) || isShareGoogleUrl(rawUrl)) {
      const host = new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase()
      if (!ALLOWED_SHORT_HOSTS.has(host)) {
        return NextResponse.json(
          { error: 'Unsupported short URL host' },
          { status: 400 },
        )
      }

      const res = await fetchFollow(rawUrl)
      resolvedUrl = res.url || rawUrl
      if (res.ok) {
        html = await res.text().catch(() => '')
      }

      // Manual Location hop if still on a short host
      if (isShortGoogleMapsUrl(resolvedUrl) || isShareGoogleUrl(resolvedUrl)) {
        const head = await fetchFollow(rawUrl, {
          method: 'HEAD',
          redirect: 'manual',
        })
        const location = head.headers.get('location')
        if (location) {
          resolvedUrl = new URL(location, rawUrl).toString()
        }
      }

      // share.google often lands on google.com/share.google?q=TOKEN (JS page).
      // Scan HTML for an embedded maps URL / coordinates.
      if (!toGoogleMapsEmbedUrl(resolvedUrl) && html) {
        const fromHtml = extractMapsUrlFromHtml(html)
        if (fromHtml) resolvedUrl = fromHtml
      }

      // Second fetch when we only got the share landing page
      if (
        !toGoogleMapsEmbedUrl(resolvedUrl) &&
        /share\.google/i.test(resolvedUrl)
      ) {
        const second = await fetchFollow(resolvedUrl)
        const secondHtml = second.ok ? await second.text().catch(() => '') : ''
        const fromSecond = extractMapsUrlFromHtml(secondHtml)
        if (fromSecond) resolvedUrl = fromSecond
        else if (second.url) resolvedUrl = second.url
      }
    }

    if (!isAllowedMapsUrl(resolvedUrl)) {
      return NextResponse.json(
        { error: 'Resolved URL is not a Google Maps link' },
        { status: 400 },
      )
    }

    const embedUrl = toGoogleMapsEmbedUrl(resolvedUrl)
    const coords = extractLatLngFromMapsUrl(resolvedUrl)

    if (!embedUrl) {
      const shareHint = isShareGoogleUrl(rawUrl)
        ? ' This share.google link did not contain a map location (often it is a Search share). Open Google Maps → Share → copy the Maps link (maps.app.goo.gl or google.com/maps/...).'
        : ' Paste the full Google Maps URL or a maps.app.goo.gl short link instead.'

      return NextResponse.json(
        {
          error: `Could not build map embed from this URL.${shareHint}`,
          resolvedUrl,
        },
        { status: 422 },
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
      { status: 502 },
    )
  }
}
