import { isOffPlanListing } from '@/libs/filterMyListingTab'
import {
  getListingCarouselItems,
  getListingImageSrc,
} from '@/libs/listingCardMedia'
import { getListingDetailId } from '@/libs/listingSlug'
import { publicApiFetch } from '@/libs/publicApiClient'

const OFF_PLAN_PLACEHOLDER = '/offplan/image1.svg'
const OFF_PLAN_ASSET_TYPE = 'Property Off Plan For Sale'

function resolveLayoutImageSrc(field) {
  if (!field) return null
  if (typeof field === 'string') {
    return field.startsWith('http') || field.startsWith('/')
      ? field
      : null
  }
  if (Array.isArray(field?.images) && field.images[0]) {
    const src = getListingImageSrc(field.images[0])
    return src && src !== '/listing/camera.svg' ? src : null
  }
  const src = getListingImageSrc(field)
  return src && src !== '/listing/camera.svg' ? src : null
}

function getOffPlanImageUrls(listing) {
  const slides = getListingCarouselItems(listing)
    .filter((item) => item.type === 'image' && !item.isPlaceholder)
    .map((item) => item.src)

  return slides.length ? slides : [OFF_PLAN_PLACEHOLDER]
}

export function getOffPlanPaymentPlanLabel(paymentPlan) {
  const plan = Array.isArray(paymentPlan) ? paymentPlan : []
  const down = Number(plan[0]?.sharePercent)
  if (!Number.isFinite(down) || down <= 0) return 'Flexible Payment Plan'
  const remainder = Math.max(0, 100 - down)
  return `${down}/${remainder} Payment Plan`
}

function buildLocation(listing) {
  return [listing?.neighbourhood, listing?.city, listing?.country]
    .filter(Boolean)
    .join(', ')
}

function buildDeliveryLabel(listing) {
  const quarter = listing?.deliveryQuarter
  const year = listing?.deliveryYear
  if (quarter && year) return `${quarter}, ${year}`
  return listing?.deliveryLabel || 'TBA'
}

/** Map API property document to off-plan card props. */
export function mapApiListingToOffPlanCard(listing) {
  const id = listing?.uuid || listing?._id || listing?.slug
  const slug = getListingDetailId(listing)

  return {
    id,
    uuid: listing?.uuid,
    slug,
    assetType: listing?.assetType || OFF_PLAN_ASSET_TYPE,
    title: listing?.title || 'Off-plan property',
    location: buildLocation(listing),
    neighbourhood: listing?.neighbourhood,
    city: listing?.city,
    country: listing?.country,
    deliveryLabel: buildDeliveryLabel(listing),
    deliveryQuarter: listing?.deliveryQuarter,
    deliveryYear: listing?.deliveryYear,
    paymentPlanLabel: getOffPlanPaymentPlanLabel(listing?.paymentPlan),
    rating: 0,
    reviewCount: Array.isArray(listing?.reviews) ? listing.reviews.length : 0,
    ref: listing?.uuid
      ? String(listing.uuid).slice(0, 8)
      : listing?.ref || '—',
    priceFrom: listing?.priceFrom ?? listing?.price,
    priceTo: listing?.priceTo ?? listing?.price,
    images: getOffPlanImageUrls(listing),
    developerAvatar: '/avatar/Avatars 2.png',
    developer: listing?.developer,
    propertyType: listing?.propertyType,
    bedrooms: listing?.bedrooms,
    bathrooms: listing?.bathrooms,
    sizeUnit: listing?.sizeUnit || listing?.sizeType || 'SQFT',
    sizeSQFT: listing?.sizeSQFT,
    description: listing?.description,
    additionalDescription: listing?.additionalDescription,
    facilities: listing?.facilities || [],
    paymentPlan: listing?.paymentPlan || [],
    unitLayout: resolveLayoutImageSrc(listing?.unitLayout),
    floorPlan: resolveLayoutImageSrc(listing?.floorPlan),
    status: listing?.status,
  }
}

export function mapApiListingToOffPlanDetail(listing) {
  return mapApiListingToOffPlanCard(listing)
}

export function isApprovedOffPlanListing(listing) {
  return isOffPlanListing(listing) && Number(listing?.status) === 1
}

export async function fetchApprovedOffPlanListings({
  page = 1,
  limit = 100,
  country = '',
  city = '',
  minPrice = '',
  maxPrice = '',
} = {}) {
  const params = new URLSearchParams({
    statusFilter: '1',
    assetType: OFF_PLAN_ASSET_TYPE,
    page: String(page),
    limit: String(limit),
    sort: '-createdAt',
  })

  if (country) params.set('country', country)
  if (city) params.set('city', city)
  if (minPrice) params.set('minPrice', String(minPrice))
  if (maxPrice) params.set('maxPrice', String(maxPrice))

  const res = await publicApiFetch(`/property?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Failed to load off-plan listings (${res.status})`)
  }

  const data = await res.json()
  const products = Array.isArray(data?.products) ? data.products : []

  return products
    .filter(isApprovedOffPlanListing)
    .map(mapApiListingToOffPlanCard)
}

export async function fetchOffPlanListingBySlug(slug) {
  if (!slug) return null

  const res = await publicApiFetch(`/property/${encodeURIComponent(slug)}`)
  if (!res.ok) return null

  const listing = await res.json()
  if (!isApprovedOffPlanListing(listing)) return null

  return mapApiListingToOffPlanDetail(listing)
}
