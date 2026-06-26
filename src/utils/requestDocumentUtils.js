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
        return name ? { name, document: null } : null
      }
      if (entry && typeof entry === 'object') {
        const name = (entry.name || '').trim()
        return name ? { name, document: entry.document || null } : null
      }
      return null
    })
    .filter(Boolean)
}

export function serializeRequestDocuments(docs) {
  return normalizeRequestDocuments(docs).map(({ name, document }) => ({
    name,
    document: document?._id || document || null,
  }))
}

export function isRequestDocumentFulfilled(entry) {
  if (!entry || typeof entry !== 'object') return false
  return Boolean(entry.document)
}
