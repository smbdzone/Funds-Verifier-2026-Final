import { getCookie } from 'cookies-next'
import { getAccessToken } from '../auth/accessTokenStore'

// Get token from cookies (primary) with localStorage fallback for migration
export function getTokenFromLocalStorage() {
  if (typeof window === 'undefined') return null

  // Option 2: accessToken lives in memory (context/state)
  const memToken = getAccessToken()
  if (memToken) return memToken

  // Legacy fallback (if some older flow still sets it)
  const localToken = localStorage.getItem('accesstoken')
  return localToken || null
}

// New function: Get token from cookies only
export function getTokenFromCookie() {
  if (typeof window === 'undefined') return null
  // HttpOnly cookies are not readable by JS. Use in-memory token store.
  return getAccessToken() || null
}

export const saveToLocalStorage = (key, data) => {
  const stringifiedData = JSON.stringify(data)
  localStorage.setItem(key, stringifiedData)
}

export const getFromLocalStorage = (key) => {
  if (typeof window != 'undefined') {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
}
