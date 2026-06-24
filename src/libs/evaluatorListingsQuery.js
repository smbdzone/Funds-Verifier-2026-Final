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
