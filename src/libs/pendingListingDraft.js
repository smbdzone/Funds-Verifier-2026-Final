import { LISTING_COUNTRY_UAE_LABEL } from '@/libs/dummyLocationData'
import { getListingImageSrc, PLACEHOLDER } from '@/libs/listingCardMedia'
import { clearEvaluationSlotFields } from '@/libs/evaluationBooking'

export const PENDING_LISTING_DRAFT_KEY = 'pendingListingDraft'

function isUsableImageSrc(src) {
  return (
    typeof src === 'string' &&
    src.trim() &&
    src !== PLACEHOLDER &&
    !src.includes('camera.svg')
  )
}

/** Prefer uploaded/persisted media objects over File blobs for localStorage. */
export function serializeListingMediaForDraft(images = [], thumbnail = null, videos = []) {
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

  let thumb = null
  if (thumbnail && !(thumbnail instanceof File) && !(thumbnail instanceof Blob)) {
    if (typeof thumbnail === 'string' && isUsableImageSrc(thumbnail)) {
      thumb = { url: thumbnail, signedUrl: thumbnail }
    } else if (typeof thumbnail === 'object') {
      const src = getListingImageSrc(thumbnail)
      if (isUsableImageSrc(src) || thumbnail?._id) {
        thumb = {
          ...thumbnail,
          url: thumbnail.url || src,
          signedUrl: thumbnail.signedUrl || src,
        }
      }
    }
  }

  const vids = (Array.isArray(videos) ? videos : [])
    .map((item) => {
      if (!item || item instanceof File || item instanceof Blob) return null
      if (typeof item === 'string') return item
      return item?.url || item?.signedUrl || null
    })
    .filter(Boolean)

  return { images: fromPics, thumbnail: thumb, videos: vids }
}

function mediaFromFormData(formData) {
  const pictures = formData?.pictures
  const pictureImages = Array.isArray(pictures?.images)
    ? pictures.images
    : Array.isArray(pictures)
      ? pictures
      : []

  const thumb =
    formData?.thumbnailImg?.images?.[0] ||
    formData?.thumbnailImg ||
    null

  let videos = []
  if (formData?.video?.url) videos = [formData.video.url]
  else if (Array.isArray(formData?.video?.videos)) {
    videos = formData.video.videos
      .map((v) => v?.url || v?.signedUrl)
      .filter(Boolean)
  } else if (typeof formData?.video === 'string') {
    videos = [formData.video]
  }

  return serializeListingMediaForDraft(pictureImages, thumb, videos)
}

export function savePendingListingDraft({
  formData,
  images = [],
  thumbnail = null,
  videos = [],
} = {}) {
  if (!formData || typeof window === 'undefined') return false

  const fromState = serializeListingMediaForDraft(images, thumbnail, videos)
  const fromForm = mediaFromFormData(formData)
  const media = {
    images: fromState.images.length ? fromState.images : fromForm.images,
    thumbnail: fromState.thumbnail || fromForm.thumbnail,
    videos: fromState.videos.length ? fromState.videos : fromForm.videos,
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
