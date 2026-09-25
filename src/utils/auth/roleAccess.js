import { getRoleHomeRoute } from '@/utils/auth/roleHome'

/**
 * Path prefixes each role may access (edge proxy + post-login checks).
 * A path is allowed when it equals a prefix or starts with `${prefix}/` or `${prefix}?`.
 */
export const ROLE_ROUTE_PREFIXES = {
  AssetHolder: [
    '/seller-profile',
    '/dashboard',
    '/advertise-with-us',
  ],
  DealHunter: [
    '/profile',
    '/seller-profile/all-slot',
    '/seller-profile/my-listing',
    '/dashboard',
    '/advertise-with-us',
  ],
  Trustee: ['/trustee'],
  Evaluator: ['/evaluator-profile', '/advertise-with-us'],
  SubEvaluator: ['/sub-evaluator-profile'],
  '3dWalkthrough': ['/3d-walkthrough', '/smb-details'],
  TechnicalReport: ['/survey-dashboard'],
  Advertiser: ['/advertiser-dashboard'],
}

export function isPathAllowedForRole(path, role) {
  if (!path || !role) return false
  const pathname = String(path).split('?')[0]
  const prefixes = ROLE_ROUTE_PREFIXES[role]
  if (!prefixes?.length) return false
  return prefixes.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`) ||
      String(path).startsWith(`${prefix}?`),
  )
}

/** Prefer a saved deep-link only when the signed-in role can open it. */
export function resolveRoleSafeRedirect(intendedPath, role) {
  if (intendedPath && isPathAllowedForRole(intendedPath, role)) {
    return intendedPath
  }
  return getRoleHomeRoute(role)
}
