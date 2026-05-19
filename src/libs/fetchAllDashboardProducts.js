import customAxios from '@/utils/apis/apis'

/** First paint: 5 per asset type (~20 max) for instant All Listing + tab switch */
const INITIAL_PAGE_LIMIT = 5
/** Background pages */
const DASHBOARD_PAGE_LIMIT = 50

const DASHBOARD_ENDPOINTS = ['/property', '/boat', '/car', '/jewelry']

function mergeListingsByUuid(chunks) {
  const map = new Map()
  for (const list of chunks) {
    if (!Array.isArray(list)) continue
    for (const item of list) {
      if (item?.uuid) map.set(item.uuid, item)
    }
  }
  return Array.from(map.values()).sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime()
    const tb = new Date(b.createdAt || 0).getTime()
    return tb - ta
  })
}

/**
 * One dashboard page for an asset type.
 */
export async function fetchDashboardProductsPage(
  endpoint,
  page = 1,
  limit = INITIAL_PAGE_LIMIT,
) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const { data } = await customAxios.get(path, {
    params: {
      dashboard: true,
      page,
      limit,
    },
  })

  const products = Array.isArray(data?.products) ? data.products : []
  return {
    products,
    totalPages: Math.max(1, Number(data?.totalPages) || 1),
  }
}

/**
 * Fetches every page of one asset type (used for background fill).
 */
export async function fetchAllDashboardProducts(endpoint, extraParams = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  let page = 1
  let totalPages = 1
  const all = []

  while (page <= totalPages) {
    const { data } = await customAxios.get(path, {
      params: {
        dashboard: true,
        page,
        limit: DASHBOARD_PAGE_LIMIT,
        ...extraParams,
      },
    })

    const products = Array.isArray(data?.products) ? data.products : []
    all.push(...products)
    totalPages = Math.max(1, Number(data?.totalPages) || 1)

    if (products.length === 0) break
    page += 1
  }

  return all
}

/**
 * Fast load: page 1 of each type in parallel → callback → then remaining pages.
 * @param {(listings: object[]) => void} onFirstBatch - called as soon as first pages arrive
 */
export async function fetchAssetHolderListingsProgressive(onFirstBatch) {
  const firstResults = await Promise.allSettled(
    DASHBOARD_ENDPOINTS.map((endpoint) =>
      fetchDashboardProductsPage(endpoint, 1, INITIAL_PAGE_LIMIT),
    ),
  )

  const meta = []
  const firstChunks = []

  firstResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      firstChunks.push(result.value.products)
      meta.push({
        endpoint: DASHBOARD_ENDPOINTS[index],
        totalPages: result.value.totalPages,
      })
    } else {
      console.error(
        `Failed to fetch ${DASHBOARD_ENDPOINTS[index]} listings:`,
        result.reason,
      )
    }
  })

  let combined = mergeListingsByUuid(firstChunks)
  onFirstBatch?.(combined)

  const needsMore = meta.filter((m) => m.totalPages > 1)
  if (needsMore.length === 0) {
    return combined
  }

  const restResults = await Promise.allSettled(
    needsMore.map(async ({ endpoint, totalPages }) => {
      const extra = []
      for (let page = 2; page <= totalPages; page++) {
        const { products } = await fetchDashboardProductsPage(
          endpoint,
          page,
          DASHBOARD_PAGE_LIMIT,
        )
        extra.push(...products)
      }
      return extra
    }),
  )

  const restChunks = [...firstChunks]
  restResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      restChunks.push(result.value)
    }
  })

  combined = mergeListingsByUuid(restChunks)
  onFirstBatch?.(combined)
  return combined
}

/**
 * Loads all asset-holder listings (waits for everything — slower).
 */
export async function fetchAllAssetHolderListings() {
  const results = await Promise.allSettled(
    DASHBOARD_ENDPOINTS.map((endpoint) => fetchAllDashboardProducts(endpoint)),
  )

  const chunks = []
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      chunks.push(result.value)
    } else {
      console.error(
        `Failed to fetch ${DASHBOARD_ENDPOINTS[index]} listings:`,
        result.reason,
      )
    }
  })

  return mergeListingsByUuid(chunks)
}
