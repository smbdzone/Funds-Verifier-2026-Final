/** Backend decrypt stream: GET /evaluation-certificate/:uuid/pdf */
export function isEvaluationCertificateStreamUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false
  return /\/evaluation-certificate\/[^/]+\/pdf(?:\?|$)/i.test(url.trim())
}

/** Absolute URL for open in new tab or download proxy. */
export function getPdfOriginalSrc(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
  if (!base) return trimmed
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${base}${path}`
}

/** Same-origin proxy URL (download only; allowlist enforced server-side). */
export function getPdfProxyFetchUrl(url) {
  const original = getPdfOriginalSrc(url)
  if (!original) return ''
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/api/pdf-preview?url=${encodeURIComponent(original)}`
}

/**
 * Open any URL in a new tab. Do not rely on window.open's return value with
 * noopener — browsers return null even when the tab opened successfully.
 */
export function openUrlInNewTab(href) {
  if (!href || typeof href !== 'string') return false

  let url
  try {
    url = new URL(href.trim()).href
  } catch {
    return false
  }

  const newWin = window.open(url, '_blank')
  if (newWin) {
    newWin.opener = null
    return true
  }

  try {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    return true
  } catch {
    return false
  }
}

export function openPdfInNewTab(url) {
  const src = getPdfOriginalSrc(url)
  if (!src) return false
  // Decrypt stream is already a public API PDF — open it directly.
  // Routing through /api/pdf-preview can fail when origins/env differ.
  if (isEvaluationCertificateStreamUrl(src)) {
    return openUrlInNewTab(src)
  }
  const openUrl = getPdfProxyFetchUrl(url) || src
  return openUrlInNewTab(openUrl)
}

export async function downloadPdfFile(url, filename = 'document.pdf') {
  const original = getPdfOriginalSrc(url)
  if (!original) return false

  const safeName =
    typeof filename === 'string' && filename.trim() ? filename.trim() : 'document.pdf'

  const fetchUrl = isEvaluationCertificateStreamUrl(original)
    ? original
    : getPdfProxyFetchUrl(url) || original

  try {
    const res = await fetch(fetchUrl, {
      cache: 'no-store',
      credentials: 'include',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const blob = await res.blob()
    if (!blob?.size || blob.type?.includes('json')) {
      throw new Error('Not a PDF response')
    }

    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = safeName.endsWith('.pdf') ? safeName : `${safeName}.pdf`
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(href)
    return true
  } catch {
    return openPdfInNewTab(url)
  }
}
