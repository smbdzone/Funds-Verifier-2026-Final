/**
 * Persist intended post-login destination for email deep links and auth guards.
 * Used by login pages + login() so users land on the listing after auth.
 */

const STORAGE_KEY = 'postLoginRedirect'

const ALLOWED_PREFIXES = [
  '/seller-profile',
  '/dashboard',
  '/evaluator-profile',
  '/sub-evaluator-profile',
  '/survey-dashboard',
  '/3d-walkthrough',
  '/smb-details',
  '/trustee',
  '/profile',
  '/advertiser-dashboard',
  '/property',
  '/offplan',
  '/car',
  '/boat',
  '/jewelry',
  '/jewellery',
]

export function isSafePostLoginPath(path) {
  if (!path || typeof path !== 'string') return false
  const trimmed = path.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return false
  if (trimmed.includes('://')) return false
  return ALLOWED_PREFIXES.some(
    (prefix) => trimmed === prefix || trimmed.startsWith(`${prefix}/`) || trimmed.startsWith(`${prefix}?`),
  )
}

export function setPostLoginRedirect(path) {
  if (typeof window === 'undefined') return
  if (!isSafePostLoginPath(path)) return
  try {
    localStorage.setItem(STORAGE_KEY, path)
  } catch {
    // ignore quota / private mode
  }
}

export function consumePostLoginRedirect() {
  if (typeof window === 'undefined') return null
  try {
    const path = localStorage.getItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY)
    return isSafePostLoginPath(path) ? path : null
  } catch {
    return null
  }
}

export function peekPostLoginRedirect() {
  if (typeof window === 'undefined') return null
  try {
    const path = localStorage.getItem(STORAGE_KEY)
    return isSafePostLoginPath(path) ? path : null
  } catch {
    return null
  }
}

/** Capture `?redirect=` from the current URL into localStorage. */
export function captureRedirectQueryParam(searchParams) {
  if (!searchParams) return null
  const raw =
    typeof searchParams.get === 'function'
      ? searchParams.get('redirect')
      : null
  if (!raw) return null
  let decoded = raw
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    decoded = raw
  }
  if (!isSafePostLoginPath(decoded)) return null
  setPostLoginRedirect(decoded)
  return decoded
}
