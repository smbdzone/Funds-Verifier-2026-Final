/** UAE Pass OAuth callback — `?code=` on home or login route. */
export function isUaePassCallback() {
  if (typeof window === 'undefined') return false
  if (!new URLSearchParams(window.location.search).has('code')) return false
  const path = window.location.pathname
  return path === '/' || path === '/login'
}

export const POST_LOGIN_BOOTSTRAP_KEY = 'fvPostLoginAccessToken'

/** Authorize URL for resident UAE Pass sign-in / register. */
export function buildUaePassAuthorizeUrl() {
  const redirectUri = process.env.NEXT_PUBLIC_UAE_PASS_REDIRECT_URI
  const clientId = process.env.NEXT_PUBLIC_UAE_PASS_CLIENT_ID
  return `https://id.uaepass.ae/idshub/authorize?redirect_uri=${redirectUri}/&client_id=${clientId}&response_type=code&scope=urn:uae:digitalid:profile:general&acr_values=urn:safelayer:tws:policies:authentication:level:low;`
}
