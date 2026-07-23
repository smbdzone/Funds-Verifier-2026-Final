/**
 * Normalize a pasted Google Maps URL (share or embed) into an iframe-ready embed src.
 * Returns empty string when no usable URL is provided.
 */
export function toGoogleMapsEmbedUrl(url) {
  if (url == null) return ''
  const trimmed = String(url).trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    const isMapsHost =
      host === 'google.com' ||
      host.endsWith('.google.com') ||
      host === 'maps.google.com' ||
      host === 'goo.gl' ||
      host === 'maps.app.goo.gl'

    if (!isMapsHost && !trimmed.includes('google.com/maps')) {
      // Still allow raw embed-style URLs or q= wrappers
      if (!/maps/i.test(trimmed)) return ''
    }

    if (parsed.pathname.includes('/maps/embed') || parsed.searchParams.has('pb')) {
      return trimmed
    }

    if (parsed.searchParams.get('output') === 'embed') {
      return trimmed
    }

    // Share / place / search links → embed via q=
    return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`
  } catch {
    return ''
  }
}

export function hasListingMapUrl(url) {
  return Boolean(toGoogleMapsEmbedUrl(url))
}
