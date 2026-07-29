// Full-screen auth pages fill the viewport on their own, so the site header and
// footer are hidden on them instead of framing the panel.
const CHROMELESS_AUTH_ROUTES = ['/user-login', '/forgot-password']

// Matched by prefix because the route carries a token segment.
const CHROMELESS_AUTH_PREFIXES = ['/reset-password']

export function isChromelessAuthRoute(pathname) {
  if (!pathname) return false

  const path = pathname.replace(/\/+$/, '') || '/'

  return (
    CHROMELESS_AUTH_ROUTES.includes(path) ||
    CHROMELESS_AUTH_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    )
  )
}
