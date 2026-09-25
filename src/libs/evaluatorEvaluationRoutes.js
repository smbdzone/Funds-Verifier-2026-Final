export function getEvaluatorEvaluationListPath(pathname = '') {
  const parts = String(pathname || '')
    .split('/')
    .filter(Boolean)
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}`
  }
  return '/evaluator-profile'
}
