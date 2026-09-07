import customAxios from '@/utils/apis/apis'

/** Query string for evaluator evaluation tables. */
export function buildEvaluatorListingsQuery({
  sort = '',
  title = '',
  pendingOnly = false,
  completedOnly = false,
} = {}) {
  const params = new URLSearchParams()
  if (sort) params.set('sort', sort)
  if (title) params.set('title', title)
  params.set('limit', '200')
  if (pendingOnly) params.set('evaluatorPending', 'true')
  else if (completedOnly) params.set('status', '1')
  return params.toString()
}

/** Pending (booked slot) and completed evaluations for evaluator dashboards. */
export async function fetchEvaluatorListings(route, { sort = '', title = '' } = {}) {
  const [pendingRes, completedRes] = await Promise.all([
    customAxios.get(
      `/${route}?${buildEvaluatorListingsQuery({ sort, title, pendingOnly: true })}`,
    ),
    customAxios.get(
      `/${route}?${buildEvaluatorListingsQuery({ sort, title, completedOnly: true })}`,
    ),
  ])

  const byUuid = new Map()
  for (const product of [
    ...(pendingRes?.data?.products || []),
    ...(completedRes?.data?.products || []),
  ]) {
    if (product?.uuid) byUuid.set(product.uuid, product)
  }

  return Array.from(byUuid.values())
}

const PAID_EVALUATION_ASSET_ROUTES = ['property', 'boat', 'car', 'jewelry']

/** Listings where the asset holder paid the evaluation fee (booked slot). */
export async function fetchPaidEvaluationListings() {
  const results = await Promise.all(
    PAID_EVALUATION_ASSET_ROUTES.map(async (route) => {
      const products = await fetchEvaluatorListings(route, { sort: '-createdAt' })
      return products
        .filter((item) => item?.evaluationDateTime)
        .map((item) => ({ ...item, assetRoute: route }))
    }),
  )

  return results
    .flat()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

export function getListingPropertyTypeLabel(listing, assetRoute) {
  switch (assetRoute) {
    case 'property':
      return listing?.propertyType || listing?.assetType || 'Property'
    case 'car':
      return (
        [listing?.make, listing?.model].filter(Boolean).join(' ') ||
        listing?.carType ||
        'Car'
      )
    case 'boat':
      return listing?.assetType || listing?.boatType || 'Boat'
    case 'jewelry':
      return listing?.assetType || listing?.brands || 'Jewelry'
    default:
      return listing?.assetType || '—'
  }
}

export function getEvaluationFeeStatus(listing) {
  if (listing?.status === 1) return 'Evaluated'
  if (listing?.evaluationStatus === 'approved') return 'Approved'
  if (listing?.evaluationDateTime) return 'Fee Paid'
  return 'Pending'
}
