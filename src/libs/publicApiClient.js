const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')

let cached = { token: null, expMs: 0 }
let inflight = null

function decodeJwtPayload(token) {
  const segment = token.split('.')[1]
  if (!segment) return null

  // JWT uses base64url — normalize before decoding
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

  const json =
    typeof Buffer !== 'undefined'
      ? Buffer.from(padded, 'base64').toString('utf8')
      : atob(padded)

  return JSON.parse(json)
}

function tokenStillValid(token, expMs, now = Date.now()) {
  return Boolean(token) && Number(expMs) > now + 30_000
}

async function fetchPublicTokenFresh() {
  const res = await fetch(`${baseUrl}/public/get-public-token`, {
    // Never cache — JWT expires in 5m; Next revalidate was serving expired tokens → 401 "not found"
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to obtain public token')
  }

  const data = await res.json()
  const token = data?.token
  if (!token) {
    throw new Error('Invalid public token response')
  }

  const now = Date.now()
  try {
    const payload = decodeJwtPayload(token)
    const expMs = Number(payload?.exp) > 0 ? Number(payload.exp) * 1000 : now + 4 * 60 * 1000
    cached = { token, expMs }
  } catch {
    cached = { token, expMs: now + 4 * 60 * 1000 }
  }

  return token
}

async function fetchPublicToken({ force = false } = {}) {
  const now = Date.now()
  if (!force && tokenStillValid(cached.token, cached.expMs, now)) {
    return cached.token
  }

  if (!force && inflight) {
    return inflight
  }

  inflight = fetchPublicTokenFresh()
    .catch((err) => {
      cached = { token: null, expMs: 0 }
      throw err
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

/** Shared public-token fetch (in-memory cache). Used by SSR + client providers. */
export async function getPublicToken(options = {}) {
  return fetchPublicToken(options)
}

/** Drop cached token (e.g. after API 401 from expired JWT). */
export function clearPublicTokenCache() {
  cached = { token: null, expMs: 0 }
}

export async function getPublicApiHeaders(extraHeaders = {}, options = {}) {
  const token = await fetchPublicToken(options)
  return {
    ...extraHeaders,
    'x-public-token': token,
  }
}

export async function publicApiFetch(path, options = {}) {
  const headers = await getPublicApiHeaders(options.headers || {})
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = path.startsWith('http') ? path : `${baseUrl}${normalizedPath}`

  // Listing analytics (views) must stay fresh — Next fetch cache would freeze counts at 0.
  const { cache = 'no-store', ...rest } = options

  const res = await fetch(url, {
    ...rest,
    cache,
    headers,
  })

  // One retry with a fresh public token if auth failed
  if (res.status === 401) {
    clearPublicTokenCache()
    const retryHeaders = await getPublicApiHeaders(options.headers || {}, {
      force: true,
    })
    return fetch(url, {
      ...rest,
      cache,
      headers: retryHeaders,
    })
  }

  return res
}

/**
 * Run an axios/API request with public headers; refresh token once on 401.
 * Use on SSR listing detail pages that call axios.get with getPublicApiHeaders.
 */
export async function withPublicApiRetry(requestFn) {
  try {
    return await requestFn(await getPublicApiHeaders())
  } catch (err) {
    const status = err?.response?.status
    if (status !== 401) throw err
    clearPublicTokenCache()
    return await requestFn(await getPublicApiHeaders({}, { force: true }))
  }
}
