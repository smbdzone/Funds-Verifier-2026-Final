import customAxios from '../utils/apis/apis'
import { getTokenFromCookie } from '../utils/helper'
import {
  getUploadErrorMessage,
  LISTING_IMAGE_MAX_MB,
  LISTING_VIDEO_MAX_MB,
} from '../constants/listingUploadLimits'
import { listingMediaObjectKey } from './listingCardMedia'

const wrapUploadError = (error, fileType, maxMB) => {
  const message = getUploadErrorMessage(error, fileType, maxMB)
  console.error(`Error uploading ${fileType.toLowerCase()}:`, message, error?.response?.data)
  const wrapped = new Error(message)
  wrapped.cause = error
  throw wrapped
}

const isUploadableFile = (value) =>
  typeof File !== 'undefined' && value instanceof File

const galleryAssetId = (asset) => {
  if (!asset) return ''
  if (typeof asset === 'string') return asset.trim()
  return String(asset._id || asset.id || asset.uuid || '').trim()
}

const isRetryableImageUploadError = (error) => {
  const status = error?.response?.status
  if (status === 413 || status === 500 || status === 502 || status === 503 || status === 504) {
    return true
  }
  return !error?.response
}

const handleImageUpload = async (images, options = {}) => {
  const files = (Array.isArray(images) ? images : [images]).filter(isUploadableFile)
  if (!files.length) return null

  const appendToId =
    options.appendToId ||
    options.assetId ||
    (typeof options === 'string' ? options : null)

  const postBatch = async (batch, assetId) => {
    const formData = new FormData()
    batch.forEach((image) => {
      formData.append('images', image)
    })
    if (assetId) {
      formData.append('assetId', String(assetId))
    }
    const response = await customAxios.post(`/upload-imgs`, formData)
    return response.data
  }

  const uploadInChunks = async (startId) => {
    const chunkSize = 2
    let asset = null
    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize)
      asset = await postBatch(chunk, galleryAssetId(asset) || startId || null)
    }
    return asset
  }

  // Car / high-res batches routinely exceed proxy body limits. Chunk by default
  // so all additional pictures land on the same ImageAsset.
  if (files.length > 2) {
    try {
      return await uploadInChunks(appendToId)
    } catch (error) {
      wrapUploadError(error, 'Image', LISTING_IMAGE_MAX_MB)
    }
  }

  try {
    return await postBatch(files, appendToId)
  } catch (error) {
    if (!isRetryableImageUploadError(error) || files.length <= 1) {
      wrapUploadError(error, 'Image', LISTING_IMAGE_MAX_MB)
    }
    try {
      return await uploadInChunks(appendToId)
    } catch (chunkError) {
      wrapUploadError(chunkError, 'Image', LISTING_IMAGE_MAX_MB)
    }
  }
}

/**
 * Keep an already-uploaded gallery (handleImageChange uploads immediately) and
 * only POST leftover File objects, appending into that same ImageAsset.
 * Returning null used to wipe pictures on submit because callers assigned it.
 */
const resolveListingGalleryAsset = async (images = [], existingAsset = null) => {
  const files = (Array.isArray(images) ? images : []).filter(isUploadableFile)
  const existingId = galleryAssetId(existingAsset)
  if (!files.length) return existingAsset || null
  return handleImageUpload(files, { appendToId: existingId || undefined })
}

const handleVideoUpload = async (video) => {
  if (!video) return

  const files = (Array.isArray(video) ? video : [video]).filter(isUploadableFile)
  if (!files.length) return

  const formData = new FormData()
  files.forEach((file) => {
    formData.append('video', file)
  })

  try {
    const response = await customAxios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/upload-video`,
      formData,
    )
    return response.data
  } catch (error) {
    wrapUploadError(error, 'Video', LISTING_VIDEO_MAX_MB)
  }
}

/** Upload new video files; keep the existing asset when nothing changed. */
const resolveListingVideoAsset = async (videos = [], existingVideo = null) => {
  const list = Array.isArray(videos) ? videos : videos ? [videos] : []
  const files = list.filter(isUploadableFile)
  if (!list.length) return null
  if (!files.length) return existingVideo
  const uploaded = await handleVideoUpload(files)
  return uploaded ?? existingVideo
}

const handleFileUpload = async (file) => {
  if (!file) {
    return
  }

  const formData = new FormData()
  formData.append('pdf', file)

  try {
    const response = await customAxios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/upload-certificate`,
      formData,
    )
    return response.data
  } catch (error) {
    wrapUploadError(error, 'Certificate PDF', 10)
  }
}

/** Map /upload-certificate response to a URL the app can store and open later. */
const resolveCertificateUploadUrl = (data) => {
  if (!data || typeof data !== 'object') return ''

  const certUuid = data.certificate?.uuid || data.uuid
  if (typeof certUuid === 'string' && certUuid.trim()) {
    const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
    if (base) {
      return `${base}/evaluation-certificate/${encodeURIComponent(certUuid.trim())}/pdf`
    }
  }

  const signedUrl = data.signedUrl
  if (typeof signedUrl === 'string' && signedUrl.startsWith('http')) {
    return signedUrl.trim()
  }

  const legacyUrl = data.Certificate?.url || data.certificate?.url
  if (typeof legacyUrl === 'string' && legacyUrl.startsWith('http')) {
    return legacyUrl.trim()
  }

  return ''
}

const handleVerificationUpload = async (file) => {
  if (!file) return

  const formData = new FormData()
  formData.append('pdf', file)

  try {
    const response = await customAxios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verification-certificate`,
      formData,
    )
    return response.data
  } catch (error) {
    wrapUploadError(error, 'Verification certificate', 10)
  }
}

const handleThumbnailUpload = async (image) => {
  const formData = new FormData()
  formData.append('images', image)

  try {
    const response = await customAxios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail-imgs`,
      formData,
    )

    return response.data
  } catch (error) {
    wrapUploadError(error, 'Thumbnail image', LISTING_IMAGE_MAX_MB)
  }
}

const handleDeleteImg = async (id, options = {}) => {
  if (!id || typeof id !== 'string') return null
  const assetId =
    options.assetId && typeof options.assetId === 'object'
      ? options.assetId._id || options.assetId.id
      : options.assetId
  try {
    // s3Key often contains slashes — must go in the query string, not the path.
    const response = await customAxios.delete(`/delete-imgs`, {
      params: {
        id,
        ...(assetId ? { assetId: String(assetId) } : {}),
      },
    })

    return response.data
  } catch (error) {
    console.error('Error deleting image:', error)
    return null
  }
}

/** Persist additional-picture order (and removals) on the ImageAsset gallery. */
const persistListingGalleryOrder = async (assetId, images = []) => {
  const id = galleryAssetId(assetId)
  if (!id) return null
  const list = Array.isArray(images) ? images : []
  const order = list
    .filter(
      (img) =>
        img &&
        !img?.isDeleted &&
        !(typeof File !== 'undefined' && img instanceof File),
    )
    .map((img) => {
      const key = listingMediaObjectKey(img)
      return {
        s3Key: img.s3Key || key || '',
        public_id: img.public_id || '',
        originalName: img.originalName || '',
        size: img.size,
        uploadedAt: img.uploadedAt,
        signedUrl: String(img.signedUrl || img.url || '').split('?')[0],
      }
    })

  // Never wipe a saved gallery just because the caller only had local File blobs.
  const hadOnlyLocalFiles =
    list.length > 0 &&
    order.length === 0 &&
    list.every(
      (img) => typeof File !== 'undefined' && img instanceof File,
    )
  if (hadOnlyLocalFiles) return null

  try {
    const response = await customAxios.put(`/upload-imgs/${id}/order`, { order })
    return response.data
  } catch (error) {
    console.warn('Could not persist gallery order', error)
    return null
  }
}

const handleDownload = async (public_id) => {
  const url = await fetchCertificateUrlByPublicId(public_id)
  if (url) {
    window.open(url, '_blank')
  }
}

const fetchCertificateUrlByPublicId = async (publicId) => {
  if (!publicId) return ''

  const token = getTokenFromCookie()
  const base = (process.env.NEXT_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
  if (!base) return ''

  try {
    const res = await fetch(
      `${base}/get-certificate-url?public_id=${encodeURIComponent(publicId)}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    )
    const data = await res.json()
    return typeof data?.url === 'string' && data.url.startsWith('http')
      ? data.url.trim()
      : ''
  } catch (error) {
    console.error('Error fetching certificate URL:', error)
    return ''
  }
}

export {
  handleImageUpload,
  resolveListingGalleryAsset,
  handleVideoUpload,
  resolveListingVideoAsset,
  handleFileUpload,
  resolveCertificateUploadUrl,
  fetchCertificateUrlByPublicId,
  handleThumbnailUpload,
  handleVerificationUpload,
  handleDeleteImg,
  persistListingGalleryOrder,
  handleDownload,
}
