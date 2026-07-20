const PLACEHOLDER = '/listing/camera.svg'

/**
 * Prefer `signedUrl` because the listing GET endpoints regenerate it fresh on
 * every read (see refreshAssetSignedUrls in the backend). Fall back to the
 * stored unsigned `url` if the response didn't include a signed one.
 */
export function getListingImageSrc(image) {
  if (!image) return PLACEHOLDER
  if (typeof image === 'string') {
    if (
      image.startsWith('http') ||
      image.startsWith('blob:') ||
      image.startsWith('data:') ||
      image.startsWith('/')
    ) {
      return image
    }
    return PLACEHOLDER
  }
  if (typeof image !== 'object') return PLACEHOLDER
  const signed = image.signedUrl
  if (typeof signed === 'string' && signed.startsWith('http')) return signed
  const url = image.url
  if (typeof url === 'string' && url.startsWith('http')) return url
  const path = image.path
  if (typeof path === 'string' && path.startsWith('http')) return path
  return PLACEHOLDER
}

/**
 * Same precedence for video assets: fresh `signedUrl` first, stored `url` fallback.
 */
export function getListingVideoSrc(video) {
  if (!video || typeof video !== 'object') return ''
  const signed = video.signedUrl
  if (typeof signed === 'string' && signed.startsWith('http')) return signed
  const url = video.url
  if (typeof url === 'string' && url.startsWith('http')) return url
  return ''
}

/**
 * Items for listing card carousel: thumbnail cover first (when set), then gallery
 * images, then videos. Falls back to placeholder only when nothing usable exists.
 */
export function getListingCarouselItems(listing) {
  const items = []
  const seen = new Set()

  const pushImage = (img) => {
    const src = getListingImageSrc(img)
    if (!src || src === PLACEHOLDER || seen.has(src)) return
    seen.add(src)
    items.push({ type: 'image', src })
  }

  // Card cover: uploaded Thumbnail must lead previews on dashboard + public cards.
  const thumbs = listing?.thumbnailImg?.images
  if (Array.isArray(thumbs) && thumbs.length) {
    for (const thumb of thumbs) pushImage(thumb)
  } else if (listing?.thumbnailImg && !listing.thumbnailImg.images) {
    pushImage(listing.thumbnailImg)
  }

  const pics = listing?.pictures?.images
  if (Array.isArray(pics)) {
    for (const img of pics) pushImage(img)
  }

  const vids = listing?.video?.videos
  if (Array.isArray(vids)) {
    for (const v of vids) {
      const src = getListingVideoSrc(v)
      if (src) {
        items.push({
          type: 'video',
          src,
          contentType: v?.contentType,
        })
      }
    }
  }

  if (items.length === 0) {
    items.push({ type: 'image', src: PLACEHOLDER, isPlaceholder: true })
  }

  return items
}

/** True when the slide should render the “no photo” camera fallback (not full-bleed). */
export function isListingCarouselPlaceholderSlide(slide) {
  if (!slide || slide.type !== 'image') return false
  if (slide.isPlaceholder) return true
  const s = slide.src
  if (s === PLACEHOLDER) return true
  if (typeof s !== 'string') return false
  try {
    const decoded = decodeURIComponent(s)
    if (decoded.includes('/listing/camera.svg')) return true
  } catch {
    /* ignore */
  }
  return (
    s.endsWith('/listing/camera.svg') || s.endsWith('listing/camera.svg')
  )
}

/**
 * Items for product detail page (e.g. /property/[slug]):
 * pictures + listing videos + thumbnail + 3D walkthrough link, in display order.
 * Always resolves the freshest URL (signedUrl > url) so previews don't break
 * after the original CloudFront signature expires.
 */
export function getListingDetailMediaItems(listing) {
  const items = []

  const pics = listing?.pictures?.images
  if (Array.isArray(pics)) {
    for (const img of pics) {
      const src = getListingImageSrc(img)
      if (src && src !== PLACEHOLDER) items.push({ type: 'image', src })
    }
  }

  const vids = listing?.video?.videos
  if (Array.isArray(vids)) {
    for (const v of vids) {
      const src = getListingVideoSrc(v)
      if (src) items.push({ type: 'video', src })
    }
  }

  const thumbs = listing?.thumbnailImg?.images
  if (Array.isArray(thumbs)) {
    for (const t of thumbs) {
      const src = getListingImageSrc(t)
      if (src && src !== PLACEHOLDER) items.push({ type: 'image', src })
    }
  }

  const walkthroughLink = listing?.video3DWalkthrough?.link
  if (
    typeof walkthroughLink === 'string' &&
    (walkthroughLink.startsWith('http://') ||
      walkthroughLink.startsWith('https://'))
  ) {
    items.push({ type: 'walkthrough', src: walkthroughLink })
  }

  return items
}

/** @deprecated use getListingCarouselItems — kept for any older imports */
export function getListingGalleryImages(listing) {
  const thumb = listing?.thumbnailImg?.images?.[0]
  if (thumb) return [thumb]
  const pics = listing?.pictures?.images
  if (Array.isArray(pics) && pics.length > 0) return pics
  return []
}

/**
 * Best-effort single-image source for a listing card / slider cell.


/** First uploaded gallery/thumbnail image for listing cards — never a static asset. */
export function getListingCardImageSrc(listing) {
  const items = getListingCarouselItems(listing)
  const slide = items.find(
    (item) => item.type === 'image' && !isListingCarouselPlaceholderSlide(item),
  )
  return slide?.src || ''
}

function certificatePdfStreamUrl(uuid) {
  const certUuid = typeof uuid === 'string' ? uuid.trim() : ''
  if (!certUuid) return ''
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '')
    .trim()
    .replace(/\/$/, '')
  if (!base) return ''
  return `${base}/evaluation-certificate/${encodeURIComponent(certUuid)}/pdf`
}

/**
 * Document (PDF) source resolver. Backend sets a fresh `signedUrl` directly on
 * fields like `evaluationCertificate`, `technicalReport`, `uploadDocument`,
 * `invoice` (see getDocumentSignedUrl in propertyCtrl). Fall back to the
 * stored `Certificate.url` for legacy/public records.
 */
function isUsableDocumentUrl(url) {
  if (typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true
  return trimmed.includes('/evaluation-certificate/')
}

export function getListingDocumentSrc(doc) {
  if (!doc || typeof doc !== 'object') return ''

  const certUuid = typeof doc?.uuid === 'string' ? doc.uuid.trim() : ''
  const certEncrypted = doc?.Certificate?.encrypted === true

  // Encrypted PDFs on S3 are ciphertext — public/authenticated clients must use decrypt stream.
  if (certEncrypted && certUuid) {
    const streamUrl = certificatePdfStreamUrl(certUuid)
    if (streamUrl) return streamUrl
  }

  // Technical report on listings: { reportFile: { Certificate, signedUrl } }
  if (doc.reportFile && typeof doc.reportFile === 'object') {
    const fromReportFile = getListingDocumentSrc(doc.reportFile)
    if (fromReportFile) return fromReportFile
  }

  if (isUsableDocumentUrl(doc.signedUrl)) {
    return doc.signedUrl.trim()
  }
  // Backend may attach signedUrl on populated technicalReport.reportFile only
  if (
    typeof doc?.reportFile?.signedUrl === 'string' &&
    doc.reportFile.signedUrl.startsWith('http')
  ) {
    return doc.reportFile.signedUrl
  }
  const certSigned = doc?.Certificate?.signedUrl
  if (typeof certSigned === 'string' && certSigned.startsWith('http')) {
    return certSigned
  }
  const certUrl = doc?.Certificate?.url
  if (typeof certUrl === 'string' && certUrl.startsWith('http')) {
    return certUrl
  }
  if (typeof doc?.reportFile?.signedUrl === 'string' && doc.reportFile.signedUrl.startsWith('http')) {
    return doc.reportFile.signedUrl
  }
  const reportSigned = doc?.reportFile?.Certificate?.signedUrl
  if (typeof reportSigned === 'string' && reportSigned.startsWith('http')) {
    return reportSigned
  }
  const reportUrl = doc?.reportFile?.Certificate?.url
  if (typeof reportUrl === 'string' && reportUrl.startsWith('http')) {
    return reportUrl
  }

  const hasCertificateFile =
    doc?.Certificate &&
    (doc.Certificate.name || doc.Certificate.encrypted === true)
  if (certUuid && hasCertificateFile) {
    const streamUrl = certificatePdfStreamUrl(certUuid)
    if (streamUrl) return streamUrl
  }

  return ''
}

export function getTechnicalReportSrc(technicalReport) {
  if (!technicalReport || typeof technicalReport !== 'object') return ''

  const fromReport = getListingDocumentSrc(technicalReport)
  if (fromReport) return fromReport

  // Populated reportFile id only — backend may still expose parent signedUrl
  if (isUsableDocumentUrl(technicalReport.signedUrl)) {
    return technicalReport.signedUrl.trim()
  }

  return ''
}

export function hasDeliveredTechnicalReport(technicalReport) {
  return !!getTechnicalReportSrc(technicalReport)
}

export { PLACEHOLDER }
