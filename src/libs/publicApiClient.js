const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')

let cached = { token: null, expMs: 0 }

function decodeJwtPayload(token) {
  const segment = token.split('.')[1]
  if (!segment) return null

  const json =
    typeof Buffer !== 'undefined'
      ? Buffer.from(segment, 'base64').toString('utf8')
      : atob(segment)

  return JSON.parse(json)
}

async function fetchPublicToken() {
  const now = Date.now()
  if (cached.token && cached.expMs > now + 30_000) {
    return cached.token
  }

  const res = await fetch(`${baseUrl}/public/get-public-token`, {
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

  try {
    const payload = decodeJwtPayload(token)
    cached = { token, expMs: (payload?.exp || 0) * 1000 }
  } catch {
    cached = { token, expMs: now + 4 * 60 * 1000 }
  }

  return token
}

export async function getPublicApiHeaders(extraHeaders = {}) {
  const token = await fetchPublicToken()
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

  return fetch(url, {
    ...rest,
    cache,
    headers,
  })
}
