export const CSRF_HEADER_NAME = 'x-csrf-token'

let cachedCsrfToken = null

export function getCsrfTokenFromCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function ensureCsrfToken() {
  const fromCookie = getCsrfTokenFromCookie()
  if (fromCookie) {
    cachedCsrfToken = fromCookie
    return fromCookie
  }

  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  if (!base) return null

  const res = await fetch(`${base}/csrf-token`, {
    credentials: 'include',
    cache: 'no-store',
  })

  if (!res.ok) return null

  const data = await res.json()
  cachedCsrfToken = data?.csrfToken || getCsrfTokenFromCookie()
  return cachedCsrfToken
}

/** Attach CSRF header for unsafe methods. Uses cookie when present (no network). */
export async function getCsrfHeaders(extraHeaders = {}) {
  const fromCookie = getCsrfTokenFromCookie()
  if (fromCookie) {
    cachedCsrfToken = fromCookie
    return {
      ...extraHeaders,
      [CSRF_HEADER_NAME]: fromCookie,
    }
  }

  const token = cachedCsrfToken || (await ensureCsrfToken())
  if (!token) return extraHeaders
  return {
    ...extraHeaders,
    [CSRF_HEADER_NAME]: token,
  }
}
