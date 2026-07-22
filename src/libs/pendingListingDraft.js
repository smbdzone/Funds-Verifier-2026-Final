import { LISTING_COUNTRY_UAE_LABEL } from '@/libs/dummyLocationData'
import { getListingImageSrc, PLACEHOLDER } from '@/libs/listingCardMedia'
import { clearEvaluationSlotFields } from '@/libs/evaluationBooking'

export const PENDING_LISTING_DRAFT_KEY = 'pendingListingDraft'

/** Which dashboard listing route an asset type belongs to. */
export const LISTING_ROUTE_ASSET_TYPES = {
  property: [
    'Property For Sale',
    'Property For Lease',
    'Property Off Plan For Sale',
  ],
  car: ['Car For Sale'],
  boat: ['Boats For Sale'],
  jewelry: ['Jewellery For Sale'],
}

export function getListingRouteForAssetType(assetType) {
  const value = String(assetType || '').trim()
  if (!value || value === 'Select Asset Type') return null
  for (const [route, types] of Object.entries(LISTING_ROUTE_ASSET_TYPES)) {
    if (types.includes(value)) return route
  }
  return null
}

export function getPendingDraftAssetType(draft = readPendingListingDraft()) {
  if (!draft) return ''
  return (
    draft.formData?.assetType ||
    draft.ui?.assetType ||
    ''
  )
}

/** True when local draft belongs to this listing route (property/car/boat/jewelry). */
export function isPendingDraftForListingRoute(routeKey) {
  const draft = readPendingListingDraft()
  if (!draft) return false
  const assetType = getPendingDraftAssetType(draft)
  const allowed = LISTING_ROUTE_ASSET_TYPES[routeKey] || []
  return allowed.includes(assetType)
}

/** Drop draft + checkout leftovers when leaving one listing type for another. */
export function clearListingWorkspaceStorage() {
  clearPendingListingDraft()
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem('checkoutSession')
    localStorage.removeItem('checkoutSessionId')
    localStorage.removeItem('clozerTransactionId')
    localStorage.removeItem('clozerReturnUrl')
    localStorage.removeItem('FormPayment')
    sessionStorage.removeItem('fv.autoFinalizeEvaluationPayment')
  } catch {
    /* ignore */
  }
}

function isUsableImageSrc(src) {
  return (
    typeof src === 'string' &&
    src.trim() &&
    src !== PLACEHOLDER &&
    !src.includes('camera.svg')
  )
}

function isUsableVideoSrc(src) {
  return (
    typeof src === 'string' &&
    (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:'))
  )
}

function normalizeThumbForDraft(thumbnail, parentSignedUrl) {
  if (!thumbnail || thumbnail instanceof File || thumbnail instanceof Blob) {
    return null
  }
  if (typeof thumbnail === 'string' && isUsableImageSrc(thumbnail)) {
    return { url: thumbnail, signedUrl: thumbnail }
  }
  if (typeof thumbnail === 'object') {
    const src =
      getListingImageSrc(thumbnail) ||
      parentSignedUrl ||
      thumbnail.signedUrl ||
      thumbnail.url
    if (!isUsableImageSrc(src) && !thumbnail?._id) return null
    return {
      ...thumbnail,
      url: thumbnail.url || src,
      signedUrl: thumbnail.signedUrl || parentSignedUrl || src,
    }
  }
  return null
}

function normalizeVideoForDraft(item) {
  if (!item || item instanceof File || item instanceof Blob) return null
  if (typeof item === 'string') {
    return isUsableVideoSrc(item) ? { url: item, signedUrl: item } : null
  }
  const src = item.signedUrl || item.url
  if (!isUsableVideoSrc(src) && !item?._id) return null
  return {
    ...item,
    url: item.url || src,
    signedUrl: item.signedUrl || src,
  }
}

function normalizeQrForDraft(qrScan) {
  if (!qrScan || qrScan instanceof File || qrScan instanceof Blob) return null
  if (typeof qrScan === 'string' && isUsableImageSrc(qrScan)) {
    return { url: qrScan, signedUrl: qrScan }
  }
  if (typeof qrScan === 'object') {
    const src = getListingImageSrc(qrScan)
    if (!isUsableImageSrc(src) && !qrScan?._id) return null
    return {
      ...qrScan,
      url: qrScan.url || src,
      signedUrl: qrScan.signedUrl || src,
    }
  }
  return null
}

/** Prefer uploaded/persisted media objects over File blobs for localStorage. */
export function serializeListingMediaForDraft(
  images = [],
  thumbnail = null,
  videos = [],
  qrScan = null,
) {
  const fromPics = (Array.isArray(images) ? images : [])
    .map((item) => {
      if (!item || item instanceof File || item instanceof Blob) return null
      if (typeof item === 'string') {
        return isUsableImageSrc(item) ? { url: item, signedUrl: item } : null
      }
      const src = getListingImageSrc(item)
      if (!isUsableImageSrc(src) && !item?._id) return null
      return {
        ...item,
        url: item.url || src,
        signedUrl: item.signedUrl || src,
      }
    })
    .filter(Boolean)

  const thumb = normalizeThumbForDraft(thumbnail)
  const vids = (Array.isArray(videos) ? videos : [])
    .map(normalizeVideoForDraft)
    .filter(Boolean)
  const qr = normalizeQrForDraft(qrScan)

  return { images: fromPics, thumbnail: thumb, videos: vids, qrScan: qr }
}

function mediaFromFormData(formData) {
  const pictures = formData?.pictures
  const pictureImages = Array.isArray(pictures?.images)
    ? pictures.images
    : Array.isArray(pictures)
      ? pictures
      : []

  const thumbAsset = formData?.thumbnailImg
  const thumbImage = Array.isArray(thumbAsset?.images)
    ? thumbAsset.images[0]
    : thumbAsset?.images && typeof thumbAsset.images === 'object'
      ? Object.values(thumbAsset.images)[0]
      : null
  const thumb = normalizeThumbForDraft(
    thumbImage || thumbAsset,
    thumbAsset?.signedUrl,
  )

  let videos = []
  if (Array.isArray(formData?.video?.videos) && formData.video.videos.length) {
    videos = formData.video.videos.map((v) =>
      normalizeVideoForDraft({
        ...v,
        signedUrl: v?.signedUrl || formData.video.signedUrl || v?.url,
        url: v?.url || v?.signedUrl || formData.video.signedUrl,
      }),
    )
  } else if (formData?.video?.signedUrl || formData?.video?.url) {
    videos = [
      normalizeVideoForDraft({
        url: formData.video.url || formData.video.signedUrl,
        signedUrl: formData.video.signedUrl || formData.video.url,
        _id: formData.video._id,
      }),
    ]
  } else if (typeof formData?.video === 'string') {
    videos = [normalizeVideoForDraft(formData.video)]
  }
  videos = videos.filter(Boolean)

  const qrRaw = formData?.qrScan?.images?.[0] || formData?.qrScan || null
  const qrScan = normalizeQrForDraft(qrRaw)

  return serializeListingMediaForDraft(pictureImages, thumb, videos, qrScan)
}

export function savePendingListingDraft({
  formData,
  images = [],
  thumbnail = null,
  videos = [],
  qrScan = null,
} = {}) {
  if (!formData || typeof window === 'undefined') return false

  const fromState = serializeListingMediaForDraft(
    images,
    thumbnail,
    videos,
    qrScan,
  )
  const fromForm = mediaFromFormData(formData)
  const media = {
    images: fromState.images.length ? fromState.images : fromForm.images,
    thumbnail: fromState.thumbnail || fromForm.thumbnail,
    videos: fromState.videos.length ? fromState.videos : fromForm.videos,
    qrScan: fromState.qrScan || fromForm.qrScan,
  }

  try {
    localStorage.setItem(
      PENDING_LISTING_DRAFT_KEY,
      JSON.stringify({
        formData,
        media,
        ui: {
          country: formData.country || '',
          city: formData.city || '',
          neighbourhood: formData.neighbourhood || '',
          propertyType: formData.propertyType || '',
          assetType: formData.assetType || '',
          phoneNumber: formData.phoneNumber || '',
          price: formData.price ?? '',
          make: formData.make || '',
          category: formData.category || '',
          model: formData.model || '',
        },
        savedAt: Date.now(),
      }),
    )
    return true
  } catch (error) {
    console.error('Failed to save listing draft:', error)
    return false
  }
}

export function readPendingListingDraft() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PENDING_LISTING_DRAFT_KEY)
    if (!raw) return null
    const draft = JSON.parse(raw)
    if (!draft?.formData) return null
    return draft
  } catch {
    return null
  }
}

export function hasPendingListingDraft() {
  return Boolean(readPendingListingDraft())
}

export function clearPendingListingDraft() {
  try {
    localStorage.removeItem(PENDING_LISTING_DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Restore formData + media previews + top dropdown UI after payment cancel / return.
 */
export function applyPendingListingDraft(draft, api = {}) {
  if (!draft?.formData) return false

  const {
    setFormData,
    setImages,
    setThumbnail,
    setVideos,
    setQrScan,
    setSelectedCountry,
    setSelectedCity,
    setSelectedNeighbourhood,
    setSelectType,
    setCountryCode,
    setPhoneNumber,
    setTotalPrice,
    setSelectedMake,
    setSelectedCategory,
    setSelectedModel,
    clearEvalSlots = true,
  } = api

  const nextForm = clearEvalSlots
    ? clearEvaluationSlotFields(draft.formData)
    : draft.formData

  if (typeof setFormData === 'function') {
    setFormData((prev) => ({
      ...prev,
      ...nextForm,
    }))
  }

  const media = draft.media || mediaFromFormData(nextForm)
  if (typeof setImages === 'function' && media.images?.length) {
    setImages(media.images)
  }
  if (typeof setThumbnail === 'function' && media.thumbnail) {
    setThumbnail(media.thumbnail)
  }
  if (typeof setVideos === 'function' && media.videos?.length) {
    setVideos(media.videos)
  }
  if (typeof setQrScan === 'function' && media.qrScan) {
    setQrScan(media.qrScan)
  }

  const country = nextForm.country || draft.ui?.country || ''
  const city = nextForm.city || draft.ui?.city || ''
  const neighbourhood =
    nextForm.neighbourhood || draft.ui?.neighbourhood || ''
  const propertyType =
    nextForm.propertyType || draft.ui?.propertyType || ''
  const make = nextForm.make || draft.ui?.make || ''
  const category = nextForm.category || draft.ui?.category || ''
  const model = nextForm.model || draft.ui?.model || ''

  if (country && typeof setSelectedCountry === 'function') {
    setSelectedCountry(country)
    if (
      country === LISTING_COUNTRY_UAE_LABEL &&
      typeof setCountryCode === 'function'
    ) {
      setCountryCode('AE')
    }
  }
  if (city && typeof setSelectedCity === 'function') {
    setSelectedCity(city)
  }
  if (neighbourhood && typeof setSelectedNeighbourhood === 'function') {
    setSelectedNeighbourhood(neighbourhood)
  }
  if (propertyType && typeof setSelectType === 'function') {
    setSelectType(propertyType)
  }
  if (make && typeof setSelectedMake === 'function') {
    setSelectedMake(make)
  }
  if (category && typeof setSelectedCategory === 'function') {
    setSelectedCategory(category)
  }
  if (model && typeof setSelectedModel === 'function') {
    setSelectedModel(model)
  }
  if (nextForm.phoneNumber && typeof setPhoneNumber === 'function') {
    setPhoneNumber(String(nextForm.phoneNumber))
  }
  if (
    nextForm.price != null &&
    nextForm.price !== '' &&
    typeof setTotalPrice === 'function'
  ) {
    setTotalPrice(String(nextForm.price))
  }

  return true
}
