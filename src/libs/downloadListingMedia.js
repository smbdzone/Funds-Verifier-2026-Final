function getFilenameFromUrl(url, fallback = 'download') {
  if (!url) return fallback
  try {
    const pathname = new URL(url).pathname
    const base = pathname.split('/').pop()
    if (base) return decodeURIComponent(base)
  } catch {
    // ignore invalid URLs
  }
  return fallback
}

function sanitizeFilename(name) {
  const trimmed = String(name || 'download').trim() || 'download'
  return trimmed.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 200)
}

/** Same-origin proxy so downloads work without opening a preview tab. */
function getListingMediaDownloadEndpoint() {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/api/listing-media-download`
}

async function tryDirectMediaFetch(url) {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      credentials: 'omit',
    })
    if (!response.ok) return null

    const contentType = String(
      response.headers.get('content-type') || '',
    ).toLowerCase()
    if (contentType.includes('json')) return null

    const blob = await response.blob()
    return blob?.size ? blob : null
  } catch {
    return null
  }
}

async function fetchListingMediaViaProxy(url, filename) {
  const endpoint = getListingMediaDownloadEndpoint()
  if (!endpoint) throw new Error('Invalid URL')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, filename }),
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Download failed')

  const contentType = String(
    response.headers.get('content-type') || '',
  ).toLowerCase()
  if (contentType.includes('json')) {
    throw new Error('Download failed')
  }

  const blob = await response.blob()
  if (!blob?.size) throw new Error('Empty file')

  return blob
}

async function fetchListingMediaBlob(url, filename) {
  const name = sanitizeFilename(filename || getFilenameFromUrl(url))
  if (!url) throw new Error('Invalid URL')

  const directBlob = await tryDirectMediaFetch(url)
  if (directBlob) {
    return { blob: directBlob, filename: name }
  }

  const blob = await fetchListingMediaViaProxy(url, name)
  return { blob, filename: name }
}

function triggerBlobDownload(blob, filename) {
  const blobUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = blobUrl
  anchor.download = sanitizeFilename(filename)
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(blobUrl)
}

function openMediaInNewTab(url) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.target = '_blank'
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
export async function downloadListingMedia(url, filename) {
  if (!url) return false

  try {
    const { blob, filename: name } = await fetchListingMediaBlob(url, filename)
    triggerBlobDownload(blob, name)
    return true
  } catch {
    try {
      openMediaInNewTab(url)
      return true
    } catch {
      return false
    }
  }
}

export function isListingVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url || '')
}

export function isListingImageUrl(url) {
  return /\.(jpe?g|png|gif|webp|jfif|svg|bmp)(\?|$)/i.test(url || '')
}

function uniqueFilename(name, usedNames) {
  if (!usedNames.has(name)) {
    usedNames.add(name)
    return name
  }

  const dotIndex = name.lastIndexOf('.')
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name
  const ext = dotIndex > 0 ? name.slice(dotIndex) : ''
  let counter = 2
  let candidate = `${base}-${counter}${ext}`

  while (usedNames.has(candidate)) {
    counter += 1
    candidate = `${base}-${counter}${ext}`
  }

  usedNames.add(candidate)
  return candidate
}

/**
 * Download all listing media as a single ZIP (browsers block multiple separate downloads).
 * @param {Array} items
 * @param {{ onProgress?: (info: { phase: 'fetching' | 'packaging', current?: number, total?: number, percent?: number }) => void, zipFilename?: string }} options
 */
export async function downloadAllListingMedia(items = [], options = {}) {
  const { onProgress, zipFilename = 'listing-media.zip' } = options

  const downloadable = items.filter(
    (item) => item?.src && item.type !== 'walkthrough',
  )

  if (!downloadable.length) {
    return { downloaded: 0, failed: 0, total: 0 }
  }

  const usedNames = new Set()
  const total = downloadable.length

  if (total === 1) {
    const item = downloadable[0]
    const filename = uniqueFilename(item.filename || 'download', usedNames)
    onProgress?.({ phase: 'fetching', current: 1, total: 1 })

    try {
      const success = await downloadListingMedia(item.src, filename)
      return {
        downloaded: success ? 1 : 0,
        failed: success ? 0 : 1,
        total: 1,
      }
    } catch {
      return { downloaded: 0, failed: 1, total: 1 }
    }
  }

  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  let downloaded = 0
  let failed = 0

  for (let index = 0; index < downloadable.length; index += 1) {
    const item = downloadable[index]
    const filename = uniqueFilename(item.filename || 'download', usedNames)

    onProgress?.({ phase: 'fetching', current: index + 1, total })

    try {
      const { blob } = await fetchListingMediaBlob(item.src, filename)
      zip.file(filename, blob)
      downloaded += 1
    } catch {
      failed += 1
    }
  }

  if (downloaded === 0) {
    return { downloaded: 0, failed, total }
  }

  onProgress?.({ phase: 'packaging', current: downloaded, total })

  const zipBlob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      onProgress?.({
        phase: 'packaging',
        current: downloaded,
        total,
        percent: metadata.percent,
      })
    },
  )

  triggerBlobDownload(zipBlob, zipFilename)
  return { downloaded, failed, total }
}
