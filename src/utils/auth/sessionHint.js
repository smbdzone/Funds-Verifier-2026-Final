import { getAccessToken } from './accessTokenStore'
import { POST_LOGIN_BOOTSTRAP_KEY } from './uaePass'

/** Non-HttpOnly cookie set by the API when a session exists. */
export const SESSION_HINT_COOKIE = 'fv_session'

/** One-time local flag so anonymous browsers stop probing /user/me after first 401. */
export const AUTH_CHECKED_KEY = 'fv_auth_checked'

export function hasSessionHintCookie() {
  if (typeof document === 'undefined') return false
  return new RegExp(`(?:^|;\\s*)${SESSION_HINT_COOKIE}=1(?:;|$)`).test(
    document.cookie,
  )
}

export function markAuthChecked() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(AUTH_CHECKED_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function clearAuthChecked() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(AUTH_CHECKED_KEY)
  } catch {
    /* ignore */
  }
}

export function clearSessionHintCookieClient() {
  if (typeof document === 'undefined') return
  const isProd = process.env.NODE_ENV === 'production'
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.fundsverifier.com'
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = `${SESSION_HINT_COOKIE}=; path=/; expires=${expires}`
  if (isProd) {
    document.cookie = `${SESSION_HINT_COOKIE}=; path=/; domain=${domain}; expires=${expires}`
  }
}

/**
 * Whether the SPA should call /user/me (± refresh) on boot.
 * Anonymous visitors skip after a one-time check (or immediately when
 * fv_session is absent and we've already checked this browser).
 */
export function shouldProbeUserSession() {
  if (typeof window === 'undefined') return false

  if (getAccessToken()) return true

  try {
    if (sessionStorage.getItem(POST_LOGIN_BOOTSTRAP_KEY)) return true
  } catch {
    /* ignore */
  }

  if (hasSessionHintCookie()) return true

  try {
    if (!localStorage.getItem(AUTH_CHECKED_KEY)) return true
  } catch {
    return true
  }

  return false
}
