const ASSET_TYPE_ROUTE = {
  'property for sale': 'property',
  'property for lease': 'property',
  'property off plan for sale': 'property',
  'car for sale': 'car',
  'boats for sale': 'boat',
  'jewellery for sale': 'jewelry',
}

export function getListingRouteSegment(listing = {}) {
  if (listing.type) return String(listing.type).toLowerCase()
  const assetType = String(listing.assetType || '').toLowerCase()
  return ASSET_TYPE_ROUTE[assetType] || 'property'
}

export function getListingSharePath(listing = {}) {
  const segment = getListingRouteSegment(listing)
  const id = listing.uuid || listing.slug || listing._id
  if (!id) return '/'
  return `/${segment}/${id}`
}

/**
 * Prefer NEXT_PUBLIC_SITE_URL so Facebook/LinkedIn scrape the live site,
 * even when you are testing share from localhost.
 */
export function resolveShareOrigin(fallbackOrigin) {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : '')

  if (fromEnv) {
    return String(fromEnv).replace(/\/$/, '')
  }

  if (fallbackOrigin) {
    return String(fallbackOrigin).replace(/\/$/, '')
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return ''
}

/** @deprecated use resolveShareOrigin */
export function resolveSiteOrigin(explicitOrigin) {
  return resolveShareOrigin(explicitOrigin)
}

/** Convert a path or partial URL into a full https URL for social share dialogs. */
export function toAbsoluteShareUrl(urlOrPath, origin) {
  const value = String(urlOrPath || '').trim()
  if (!value) return ''

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  const base = resolveShareOrigin(origin)
  if (!base) return ''

  const path = value.startsWith('/') ? value : `/${value}`
  return `${base}${path}`
}

export function getListingShareUrl(listing = {}, origin) {
  const path = getListingSharePath(listing)
  return toAbsoluteShareUrl(path, origin)
}

export function getListingShareDescription(listing = {}) {
  const raw =
    listing.description ||
    listing.propertyDescription ||
    listing.additionalDescription ||
    ''

  const text = String(raw).replace(/\s+/g, ' ').trim()
  const price = Number(listing?.price)
  const priceLabel =
    Number.isFinite(price) && price > 0
      ? `AED ${price.toLocaleString('en-US')}`
      : ''

  return (
    [text, priceLabel].filter(Boolean).join(' — ') ||
    'View this listing on Funds Verifier.'
  )
}

export function buildListingShareMessage(listing = {}, title = '') {
  const shareTitle = title || listing?.title || 'Listing on Funds Verifier'
  const description = getListingShareDescription(listing)
  return `${shareTitle} — ${description}`
}

export function buildListingSocialShareLinks({
  url,
  title = '',
  description = '',
}) {
  const absoluteUrl = toAbsoluteShareUrl(url)
  if (!absoluteUrl) {
    return {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
    }
  }

  const encodedUrl = encodeURIComponent(absoluteUrl)
  const encodedTitle = encodeURIComponent(title || 'Funds Verifier listing')
  const encodedSummary = encodeURIComponent(
    description || title || 'View this listing on Funds Verifier.',
  )
  const encodedSource = encodeURIComponent('Funds Verifier')

  return {
    facebook: `https://www.facebook.com/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}&source=${encodedSource}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  }
}

export function openSocialShareWindow(shareUrl, platform = 'facebook') {
  if (!shareUrl || shareUrl === '#') return

  const width = platform === 'linkedin' ? 720 : 600
  const height = 640
  const left = Math.max(0, (window.screen.width - width) / 2)
  const top = Math.max(0, (window.screen.height - height) / 2)
  const features = `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`

  window.open(shareUrl, '_blank', features)
}
