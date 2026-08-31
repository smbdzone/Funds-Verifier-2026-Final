export function getEvaluationTimestamp(listing) {
  const raw =
    listing?.evaluationDateTime || listing?.updatedAt || listing?.createdAt
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfDay(isoDate) {
  if (!isoDate) return null
  const date = new Date(`${isoDate}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function endOfDay(isoDate) {
  if (!isoDate) return null
  const date = new Date(`${isoDate}T23:59:59.999`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function applyHistoryEvaluatedFilters(
  listings = [],
  { nameQuery = '', dateFrom = '', dateTo = '', sortOrder = 'newest' } = {},
) {
  const query = String(nameQuery || '').trim().toLowerCase()
  const from = startOfDay(dateFrom)
  const to = endOfDay(dateTo)

  const filtered = (Array.isArray(listings) ? listings : []).filter((item) => {
    if (Number(item?.status) !== 1) return false

    if (query) {
      const title = String(item?.title || '').toLowerCase()
      const evaluatorName = String(
        item?.evaluator?.name ||
          item?.evaluator?.displayName ||
          item?.assignedTo?.name ||
          '',
      ).toLowerCase()
      if (!title.includes(query) && !evaluatorName.includes(query)) {
        return false
      }
    }

    const when = getEvaluationTimestamp(item)
    if (from && (!when || when < from)) return false
    if (to && (!when || when > to)) return false
    return true
  })

  filtered.sort((a, b) => {
    const aTime = getEvaluationTimestamp(a)?.getTime() || 0
    const bTime = getEvaluationTimestamp(b)?.getTime() || 0
    return sortOrder === 'oldest' ? aTime - bTime : bTime - aTime
  })

  return filtered
}
