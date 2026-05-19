/** UAE Pass OAuth callback — `?code=` on home or login route. */
export function isUaePassCallback() {
  if (typeof window === 'undefined') return false
  if (!new URLSearchParams(window.location.search).has('code')) return false
  const path = window.location.pathname
  return path === '/' || path === '/login'
}

export const POST_LOGIN_BOOTSTRAP_KEY = 'fvPostLoginAccessToken'
