export const CONSUMER_ROLES = new Set(['AssetHolder', 'DealHunter'])

/** Separate Developer portal (Funds-Verifier-2026-developer-Final). */
export function getDeveloperAppUrl() {
  return (
    process.env.NEXT_PUBLIC_DEVELOPER_APP_URL || 'http://localhost:3012'
  ).replace(/\/$/, '')
}

export function getRoleHomeRoute(role) {
  switch (role) {
    case 'AssetHolder':
      return '/seller-profile'
    case 'DealHunter':
      return '/profile'
    case 'Evaluator':
      return '/evaluator-profile'
    case 'SubEvaluator':
      return '/sub-evaluator-profile'
    case 'Trustee':
      return '/trustee'
    case '3dWalkthrough':
      return '/3d-walkthrough'
    case 'TechnicalReport':
      return '/survey-dashboard'
    case 'Advertiser':
      return '/advertiser-dashboard'
    case 'Developer':
      return getDeveloperAppUrl()
    default:
      return '/'
  }
}
