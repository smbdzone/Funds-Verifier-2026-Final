import { getListingCarouselItems } from '@/libs/listingCardMedia'
import { toAbsoluteShareUrl } from '@/libs/listingSocialShare'

function pickListingDescription(listing = {}) {
  const raw =
    listing.description ||
    listing.propertyDescription ||
    listing.additionalDescription ||
    ''

  return String(raw).replace(/\s+/g, ' ').trim()
}

function formatListingPrice(listing = {}) {
  const price = Number(listing.price)
  if (!Number.isFinite(price) || price <= 0) return ''
  return `AED ${price.toLocaleString('en-US')}`
}

export function getListingOgImageUrl(listing = {}) {
  const carousel = getListingCarouselItems(listing)
  const imageSlide = carousel.find(
    (item) =>
      item.type === 'image' &&
      !item.isPlaceholder &&
      typeof item.src === 'string' &&
      item.src.startsWith('http'),
  )

  return imageSlide?.src || ''
}

export function buildListingPageMetadata(listing, { routeSegment, listingId } = {}) {
  const title = listing?.title?.trim() || 'Listing on Funds Verifier'
  const descriptionText = pickListingDescription(listing)
  const priceLabel = formatListingPrice(listing)
  const assetLabel = listing?.assetType || 'Asset'

  const description =
    [descriptionText, priceLabel].filter(Boolean).join(' — ') ||
    `View this ${assetLabel} listing on Funds Verifier.`

  const id = listingId || listing?.uuid || listing?.slug
  const pagePath = id ? `/${routeSegment}/${id}` : `/${routeSegment}`
  const pageUrl = toAbsoluteShareUrl(pagePath)
  const imageUrl = getListingOgImageUrl(listing)

  const openGraph = {
    title,
    description,
    siteName: 'Funds Verifier',
    type: 'website',
    locale: 'en_US',
  }

  if (pageUrl) {
    openGraph.url = pageUrl
  }

  if (imageUrl) {
    openGraph.images = [
      {
        url: imageUrl,
        alt: title,
      },
    ]
  }

  return {
    title: `${title} | Funds Verifier`,
    description,
    openGraph,
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}
