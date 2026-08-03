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

const handleImageUpload = async (images) => {
  const files = Array.isArray(images) ? images.filter(Boolean) : []
  if (!files.length) return null

  // Upload one file at a time so a multi-image batch cannot trip proxy 413 limits.
  const mergedImages = []
  let lastResponse = null

  for (const image of files) {
    const formData = new FormData()
    formData.append('images', image)

    try {
      const response = await customAxios.post(`/upload-imgs`, formData)
      lastResponse = response.data
      if (Array.isArray(response?.data?.images)) {
        mergedImages.push(...response.data.images)
      }
    } catch (error) {
      wrapUploadError(error, 'Image', LISTING_IMAGE_MAX_MB)
    }
  }

  if (!lastResponse) return null
  return { ...lastResponse, images: mergedImages }
}

const handleVideoUpload = async (video) => {
  if (!video) return

  const files = Array.isArray(video) ? video : [video]
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

const handleDeleteImg = async (id) => {
  try {
    const response = await customAxios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/delete-imgs/${id}`
    )

    return response.data
  } catch (error) {
    console.error('Error deleting image:', error)
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
  handleDownload,
}
