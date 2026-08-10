import {
  clearPublicTokenCache,
  getPublicApiHeaders,
} from '@/libs/publicApiClient'

// Simple in-memory cache
const cache = {}

/**
 * Generic API fetcher with caching
 * @param {string} url - API endpoint (e.g. /users)
 * @param {object} options - fetch options
 * @param {number} cacheTime - cache duration in ms (default 20s)
 */
export async function api(url, options = {}, cacheTime = 20000) {
  const now = Date.now()
  const apiURL = process.env.NEXT_PUBLIC_BASE_URL

  if (!apiURL) {
    console.error('NEXT_PUBLIC_BASE_URL is not defined')
    throw new Error('Base URL is missing')
  }

  const fullUrl = `${apiURL}${url}`

  // ✅ Serve from cache if valid
  if (cache[fullUrl] && now - cache[fullUrl].timestamp < cacheTime) {
    return cache[fullUrl].data
  }

  const doFetch = async (forceToken = false) => {
    const authHeaders = options.headers?.Authorization
      ? options.headers
      : await getPublicApiHeaders(options.headers || {}, { force: forceToken })

    return fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      // Detail/listing reads must not reuse expired public-token responses
      cache: 'no-store',
    })
  }

  try {
    let response = await doFetch(false)

    if (response.status === 401) {
      clearPublicTokenCache()
      response = await doFetch(true)
    }

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      )
    }

    const data = await response.json()

    if (cacheTime > 0) {
      cache[fullUrl] = {
        data,
        timestamp: now,
      }
    }

    return data
  } catch (error) {
    console.error('API fetch error:', error, 'URL:', fullUrl)
    throw error
  }
}
