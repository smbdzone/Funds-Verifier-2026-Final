import axios from 'axios'
import { deleteCookie } from 'cookies-next'
import { clearAccessToken } from './accessTokenStore'

/** Client-side keys tied to auth or checkout — not user prefs like filterData. */
const AUTH_LOCAL_STORAGE_KEYS = [
  'accessToken',
  'accesstoken',
  'role',
  'authToken',
  'token',
  'userUUID',
  'FormPayment',
  'checkoutSessionId',
  'checkoutSession',
  'servicePaymentReturnUrl',
  '3Dwalkthrough',
  'technicalReport',
]

const AUTH_COOKIE_NAMES = ['accessToken', 'refreshToken', 'role', 'userUUID']

/**
 * Clear in-memory token, legacy localStorage, and any non-HttpOnly cookies
 * the app may have set. HttpOnly cookies are cleared via /user/logout.
 */
export function clearClientAuthStorage() {
  if (typeof window === 'undefined') return

  clearAccessToken()

  for (const key of AUTH_LOCAL_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }

  for (const name of AUTH_COOKIE_NAMES) {
    try {
      deleteCookie(name, { path: '/' })
    } catch {
      /* ignore */
    }
  }
}

/** Ask backend to clear HttpOnly auth cookies (safe if session already expired). */
export async function clearServerAuthSession() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseURL) return

  try {
    await axios.get(`${baseURL}/user/logout`, { withCredentials: true })
  } catch {
    /* expired or offline — client cleanup still runs */
  }
}

/**
 * Full session reset: server cookies + client memory/storage.
 * @param {{ callBackend?: boolean }} options
 */
export async function endSession({ callBackend = true } = {}) {
  if (callBackend) {
    await clearServerAuthSession()
  }
  clearClientAuthStorage()
}

export const LOGIN_PATHS = ['/login', '/user-login']

export function isLoginPath(pathname) {
  return LOGIN_PATHS.includes(pathname)
}
