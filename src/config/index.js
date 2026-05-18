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

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      // Optional: only if using App Router
      next: { revalidate: 10 },
    })

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    // ✅ Save to cache
    cache[fullUrl] = {
      data,
      timestamp: now,
    }

    return data
  } catch (error) {
    console.error('API fetch error:', error, 'URL:', fullUrl)
    throw error
  }
}
