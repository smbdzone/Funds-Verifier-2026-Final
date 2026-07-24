/**
 * Normalize a pasted Google Maps URL (share, short link, or embed)
 * into an iframe-ready embed src.
 * Returns empty string when no usable URL is provided.
 */

const SHORT_MAP_HOSTS = new Set(['goo.gl', 'maps.app.goo.gl', 'g.co'])

function isMapsHost(hostname) {
  const host = hostname.replace(/^www\./, '').toLowerCase()
  return (
    host === 'google.com' ||
    host.endsWith('.google.com') ||
    host === 'maps.google.com' ||
    SHORT_MAP_HOSTS.has(host)
  )
}

export function isShortGoogleMapsUrl(url) {
  if (url == null) return false
  try {
    const parsed = new URL(String(url).trim())
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    return SHORT_MAP_HOSTS.has(host)
  } catch {
    return false
  }
}

/**
 * Prefer place pin coords (!3d!4d), then @viewport, then q/ll/query params.
 */
export function extractLatLngFromMapsUrl(url) {
  if (url == null) return null
  const raw = String(url).trim()
  if (!raw) return null

  const placePin = raw.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/)
  if (placePin) {
    return { lat: Number(placePin[1]), lng: Number(placePin[2]) }
  }

  const atMatch = raw.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (atMatch) {
    return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) }
  }

  try {
    const parsed = new URL(raw)
    for (const key of ['q', 'query', 'll', 'center']) {
      const value = parsed.searchParams.get(key)
      if (!value) continue
      const coords = value.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/)
      if (coords) {
        return { lat: Number(coords[1]), lng: Number(coords[2]) }
      }
    }
  } catch {
    // ignore
  }

  return null
}

function extractPlaceName(parsed) {
  const placeMatch = parsed.pathname.match(/\/maps\/place\/([^/]+)/)
  if (!placeMatch) return ''
  try {
    return decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).trim()
  } catch {
    return placeMatch[1].replace(/\+/g, ' ').trim()
  }
}

function buildEmbedFromCoords(lat, lng, zoom = 15) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=${zoom}&output=embed`
}

function buildEmbedFromQuery(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}

/**
 * Sync converter. Short links (maps.app.goo.gl) cannot be embedded directly —
 * resolve them via /api/resolve-maps-url first, then pass the expanded URL here.
 */
export function toGoogleMapsEmbedUrl(url) {
  if (url == null) return ''
  const trimmed = String(url).trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()

    if (!isMapsHost(host) && !trimmed.includes('google.com/maps')) {
      if (!/maps/i.test(trimmed)) return ''
    }

    // Already an embed URL
    if (parsed.pathname.includes('/maps/embed') || parsed.searchParams.has('pb')) {
      return trimmed
    }
    if (parsed.searchParams.get('output') === 'embed') {
      return trimmed
    }

    // Short links need server-side redirect expansion (CORS blocks client fetch)
    if (SHORT_MAP_HOSTS.has(host)) {
      return ''
    }

    const coords = extractLatLngFromMapsUrl(trimmed)
    if (coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng)) {
      return buildEmbedFromCoords(coords.lat, coords.lng)
    }

    const placeName = extractPlaceName(parsed)
    if (placeName) {
      return buildEmbedFromQuery(placeName)
    }

    const q = parsed.searchParams.get('q') || parsed.searchParams.get('query')
    if (q && !/^https?:\/\//i.test(q)) {
      return buildEmbedFromQuery(q)
    }

    // Last resort: never pass another maps URL as q= (that shows the world map)
    return ''
  } catch {
    return ''
  }
}

export function hasListingMapUrl(url) {
  if (isShortGoogleMapsUrl(url)) return true
  return Boolean(toGoogleMapsEmbedUrl(url))
}
