export function formatDateForInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function formatRequestDocumentDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function getRequestDocumentName(entry) {
  if (!entry) return ''
  if (typeof entry === 'string') return entry
  return entry.name || ''
}

export function normalizeRequestDocuments(docs) {
  if (!Array.isArray(docs)) return []
  return docs
    .map((entry) => {
      if (typeof entry === 'string') {
        const name = entry.trim()
        return name ? { name, document: null, date: '' } : null
      }
      if (entry && typeof entry === 'object') {
        const name = (entry.name || '').trim()
        return name
          ? {
              name,
              document: entry.document || null,
              date: formatDateForInput(entry.date),
            }
          : null
      }
      return null
    })
    .filter(Boolean)
}

export function serializeRequestDocuments(docs) {
  return normalizeRequestDocuments(docs).map(({ name, document, date }) => ({
    name,
    document: document?._id || document || null,
    ...(date ? { date: new Date(date).toISOString() } : {}),
  }))
}

export function isRequestDocumentFulfilled(entry) {
  if (!entry || typeof entry !== 'object') return false
  return Boolean(entry.document)
}

export function requestDocumentsMissingDate(docs) {
  return normalizeRequestDocuments(docs).some((doc) => !doc.date)
}
