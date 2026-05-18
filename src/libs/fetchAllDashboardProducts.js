import customAxios from '@/utils/apis/apis'

const DASHBOARD_PAGE_LIMIT = 50

/**
 * Fetches every page of the asset-holder dashboard listing for one asset type.
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

const DASHBOARD_ENDPOINTS = ['/property', '/boat', '/car', '/jewelry']

/**
 * Loads all asset-holder listings across property, boat, car, and jewelry.
 * Uses allSettled so one failed type does not hide the rest.
 */
export async function fetchAllAssetHolderListings() {
  const results = await Promise.allSettled(
    DASHBOARD_ENDPOINTS.map((endpoint) => fetchAllDashboardProducts(endpoint)),
  )

  const listings = []

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      listings.push(...result.value)
    } else {
      console.error(
        `Failed to fetch ${DASHBOARD_ENDPOINTS[index]} listings:`,
        result.reason,
      )
    }
  })

  return listings
}
