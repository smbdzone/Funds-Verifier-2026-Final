import customAxios from '@/utils/apis/apis'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import { getListingPropertyTypeLabel } from '@/libs/evaluatorListingsQuery'

const ASSET_ROUTES = ['property', 'boat', 'car', 'jewelry']

export function listingHasUploadedInvoice(listing) {
  if (!listing?.invoice) return false

  if (typeof listing.invoice === 'string') {
    return listing.invoice.trim().length > 0
  }

  if (typeof listing.invoice === 'object') {
    return Boolean(
      listing.invoice._id ||
        listing.invoice.uuid ||
        getListingDocumentSrc(listing.invoice),
    )
  }

  return false
}

export async function fetchAssetHolderUploadedInvoices() {
  const results = await Promise.all(
    ASSET_ROUTES.map(async (route) => {
      const res = await customAxios.get(`/${route}`, {
        params: {
          dashboard: true,
          limit: 200,
          page: 1,
        },
      })

      const products = Array.isArray(res?.data?.products) ? res.data.products : []

      return products
        .filter(listingHasUploadedInvoice)
        .map((item) => ({ ...item, assetRoute: route }))
    }),
  )

  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0),
    )
}

export function resolveListingEvaluatorName(listing) {
  const assignee = listing?.evaluator

  if (assignee && typeof assignee === 'object') {
    return assignee.displayName || assignee.name || 'Evaluator'
  }

  return 'Evaluator'
}

export function formatInvoiceDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export { getListingPropertyTypeLabel }
