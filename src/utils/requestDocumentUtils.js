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

/** Upload timestamp for evaluator "Uploaded documents" (asset-holder uploads). */
export function getUploadedDocumentDate(doc) {
  if (!doc || typeof doc !== 'object') return ''
  const raw =
    doc.uploadedAt || doc.createdAt || doc.updatedAt || doc.Certificate?.uploadedAt
  return formatRequestDocumentDate(raw)
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
            uploadedAt: entry.uploadedAt || null,
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

/** True when the listing has at least one unfulfilled document request. */
export function hasPendingDocumentRequests(listingOrDocs) {
  const docs = Array.isArray(listingOrDocs)
    ? listingOrDocs
    : listingOrDocs?.requestDocument
  return normalizeRequestDocuments(docs).some(
    (entry) => !isRequestDocumentFulfilled(entry),
  )
}

/**
 * Evaluator "Uploaded documents" list: fulfilled request docs first,
 * then other uploadDocument files not already represented.
 */
export function getDocumentRefId(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    return String(value._id || value.id || value.uuid || '')
  }
  return ''
}

export function buildEvaluatorUploadedDocuments(
  requestDocument = [],
  uploadDocument = [],
) {
  const fromRequests = normalizeRequestDocuments(requestDocument)
    .filter(isRequestDocumentFulfilled)
    .map((req) => {
      const rawDoc = req.document
      if (typeof rawDoc === 'string' && rawDoc) {
        return {
          _id: rawDoc,
          Certificate: {
            name: req.name || 'Document',
          },
          uploadedAt: req.uploadedAt || req.date,
        }
      }

      const doc = rawDoc && typeof rawDoc === 'object' ? rawDoc : {}
      return {
        ...doc,
        Certificate: {
          ...(doc.Certificate || {}),
          name: req.name || doc.Certificate?.name || 'Document',
        },
        uploadedAt: req.uploadedAt || req.date || doc.uploadedAt,
      }
    })

  const seen = new Set(
    fromRequests
      .map((doc) => String(doc?._id || doc?.uuid || ''))
      .filter(Boolean),
  )

  const extras = (Array.isArray(uploadDocument) ? uploadDocument : []).filter(
    (doc) => {
      const id = String(doc?._id || doc?.uuid || '')
      return id ? !seen.has(id) : true
    },
  )

  return [...fromRequests, ...extras]
}

export function requestDocumentsMissingDate(docs) {
  return normalizeRequestDocuments(docs).some((doc) => !doc.date)
}

/** Open a document URL in a new tab; fall back to download if popup blocked. */
export function openListingDocumentInNewTab(url, fileName = 'document.pdf') {
  if (!url) return false
  const opened = window.open(url, '_blank', 'noopener,noreferrer')
  if (opened) return true

  try {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
    return true
  } catch {
    return false
  }
}
