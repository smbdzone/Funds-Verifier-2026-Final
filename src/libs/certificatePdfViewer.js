'use client'

/** Backend decrypt stream: GET /evaluation-certificate/:uuid/pdf */
export function isEvaluationCertificateStreamUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false
  return /\/evaluation-certificate\/[^/]+\/pdf(?:\?|$)/i.test(url.trim())
}

function resolveApiRequestUrl(url) {
  const trimmed = url.trim()
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
  if (base && trimmed.startsWith(base)) {
    const path = trimmed.slice(base.length)
    return path.startsWith('/') ? path : `/${path}`
  }
  return trimmed
}

function absoluteApiUrl(url) {
  const trimmed = (url || '').trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
  if (!base) return trimmed
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${base}${path}`
}

function isPdfBlob(blob, contentType = '') {
  const type = String(contentType).toLowerCase()
  if (type.includes('pdf') || type.includes('octet-stream')) return true
  if (blob?.type?.includes('pdf') || blob?.type?.includes('octet-stream')) return true
  return !type || type === 'application/x-unknown'
}

async function loadStreamPdfBlob(url) {
  const fullUrl = absoluteApiUrl(resolveApiRequestUrl(url))

  const res = await fetch(fullUrl, {
    method: 'GET',
    credentials: 'omit',
    cache: 'no-store',
  })

  const contentType = String(res.headers.get('content-type') || '').toLowerCase()

  if (!res.ok || contentType.includes('json')) {
    let message = 'Failed to load PDF document.'
    try {
      const parsed = await res.json()
      message = parsed.message || message
    } catch {
      try {
        const text = await res.text()
        const parsed = JSON.parse(text)
        message = parsed.message || message
      } catch {
        /* ignore */
      }
    }
    return { blobUrl: null, error: message, directUrl: fullUrl }
  }

  const data = await res.blob()

  if (!isPdfBlob(data, contentType)) {
    return {
      blobUrl: null,
      error: 'The server did not return a valid PDF.',
      directUrl: fullUrl,
    }
  }

  return {
    blobUrl: URL.createObjectURL(
      data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' }),
    ),
    error: null,
    directUrl: null,
  }
}

async function loadRemotePdfBlob(url) {
  try {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' })
    if (!res.ok) {
      return { blobUrl: null, error: null, directUrl: url }
    }
    const blob = await res.blob()
    if (blob.type && blob.type.includes('json')) {
      return { blobUrl: null, error: null, directUrl: url }
    }
    return {
      blobUrl: URL.createObjectURL(blob),
      error: null,
      directUrl: null,
    }
  } catch {
    return { blobUrl: null, error: null, directUrl: url }
  }
}

/**
 * Load a PDF for in-app preview.
 * - API stream URLs → public decrypt stream + blob
 * - Signed S3 / CloudFront → fetch blob, or direct iframe URL as fallback
 */
export async function loadPdfBlobUrlForViewer(url) {
  if (!url || typeof url !== 'string') {
    return {
      blobUrl: null,
      error: 'No document link is available.',
      directUrl: null,
    }
  }

  try {
    if (isEvaluationCertificateStreamUrl(url)) {
      return await loadStreamPdfBlob(url)
    }
    return await loadRemotePdfBlob(url)
  } catch (err) {
    if (isEvaluationCertificateStreamUrl(url)) {
      return {
        blobUrl: null,
        error: err?.message || 'Failed to load PDF document.',
        directUrl: null,
      }
    }
    return { blobUrl: null, error: null, directUrl: url }
  }
}
