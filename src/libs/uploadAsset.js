import customAxios from '../utils/apis/apis'
import { getTokenFromCookie } from '../utils/helper'
import {
  getUploadErrorMessage,
  LISTING_IMAGE_MAX_MB,
  LISTING_VIDEO_MAX_MB,
} from '../constants/listingUploadLimits'

const wrapUploadError = (error, fileType, maxMB) => {
  const message = getUploadErrorMessage(error, fileType, maxMB)
  console.error(`Error uploading ${fileType.toLowerCase()}:`, message, error?.response?.data)
  const wrapped = new Error(message)
  wrapped.cause = error
  throw wrapped
}

const isUploadableFile = (value) =>
  typeof File !== 'undefined' && value instanceof File

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

  try {
    // One request → one ImageAsset (listing stores a single pictures ObjectId).
    return await postBatch(files, appendToId)
  } catch (error) {
    // If the combined payload is too large, upload in small chunks and append
    // into the same ImageAsset so all pictures stay on one gallery document.
    if (error?.response?.status !== 413 || files.length <= 1) {
      wrapUploadError(error, 'Image', LISTING_IMAGE_MAX_MB)
    }

    const chunkSize = 2
    let asset = null
    try {
      for (let i = 0; i < files.length; i += chunkSize) {
        const chunk = files.slice(i, i + chunkSize)
        asset = await postBatch(chunk, asset?._id || appendToId || null)
      }
      return asset
    } catch (chunkError) {
      wrapUploadError(chunkError, 'Image', LISTING_IMAGE_MAX_MB)
    }
  }
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
  const id =
    assetId && typeof assetId === 'object' ? assetId._id || assetId.id : assetId
  if (!id) return null
  const list = Array.isArray(images) ? images : []
  const order = list
    .filter(
      (img) =>
        img &&
        !img?.isDeleted &&
        !(typeof File !== 'undefined' && img instanceof File),
    )
    .map((img) => ({
      s3Key: img.s3Key || '',
      public_id: img.public_id || '',
      originalName: img.originalName || '',
      size: img.size,
      uploadedAt: img.uploadedAt,
      signedUrl: String(img.signedUrl || img.url || '').split('?')[0],
    }))

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
  handleVideoUpload,
  handleFileUpload,
  resolveCertificateUploadUrl,
  fetchCertificateUrlByPublicId,
  handleThumbnailUpload,
  handleVerificationUpload,
  handleDeleteImg,
  persistListingGalleryOrder,
  handleDownload,
}
