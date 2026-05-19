export const CONSUMER_ROLES = new Set(['AssetHolder', 'DealHunter'])

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
    default:
      return '/'
  }
}
