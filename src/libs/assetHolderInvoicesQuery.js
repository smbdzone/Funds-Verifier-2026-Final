import customAxios from '@/utils/apis/apis'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import { getListingPropertyTypeLabel } from '@/libs/evaluatorListingsQuery'
import { isOffPlanListing } from '@/libs/filterMyListingTab'

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

export function listingHasOffPlanApprovalFee(listing) {
  const status = String(listing?.offPlanApprovalFeeStatus || 'none')
  return status === 'requested' || status === 'paid'
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
        .map((item) => ({
          ...item,
          assetRoute: route,
          invoiceKind: 'evaluation',
        }))
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

/** Off-plan approval fee rows (requested or paid). */
export async function fetchAssetHolderOffPlanFeeInvoices() {
  const res = await customAxios.get('/property', {
    params: {
      dashboard: true,
      limit: 200,
      page: 1,
    },
  })

  const products = Array.isArray(res?.data?.products) ? res.data.products : []

  return products
    .filter(
      (item) => isOffPlanListing(item) && listingHasOffPlanApprovalFee(item),
    )
    .map((item) => ({
      ...item,
      assetRoute: 'property',
      invoiceKind: 'off_plan_approval_fee',
    }))
    .sort(
      (a, b) =>
        new Date(b.offPlanApprovalFeePaidAt || b.updatedAt || b.createdAt || 0) -
        new Date(a.offPlanApprovalFeePaidAt || a.updatedAt || a.createdAt || 0),
    )
}

export async function fetchAssetHolderAllInvoices() {
  const [evaluationInvoices, offPlanFees] = await Promise.all([
    fetchAssetHolderUploadedInvoices(),
    fetchAssetHolderOffPlanFeeInvoices(),
  ])

  return [...offPlanFees, ...evaluationInvoices].sort(
    (a, b) =>
      new Date(
        b.offPlanApprovalFeePaidAt || b.updatedAt || b.createdAt || 0,
      ) -
      new Date(
        a.offPlanApprovalFeePaidAt || a.updatedAt || a.createdAt || 0,
      ),
  )
}

export function resolveListingEvaluatorName(listing) {
  if (listing?.invoiceKind === 'off_plan_approval_fee') {
    return 'Super Admin'
  }

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
