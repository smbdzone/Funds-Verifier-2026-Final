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
  const formData = new FormData()
  images.forEach((image) => {
    formData.append('images', image)
  })

  try {
    const response = await customAxios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/upload-imgs`,
      formData,
    )
    return response.data
  } catch (error) {
    wrapUploadError(error, 'Image', LISTING_IMAGE_MAX_MB)
  }
}

const handleVideoUpload = async (video) => {
  if (!video) return

  const formData = new FormData()
  formData.append('video', video)

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
  const token = getTokenFromCookie()

  const res = await fetch(
    `${BASE_URL}/get-certificate-url?public_id=${public_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  const data = await res.json()

  if (data?.url) {
    window.open(data.url, '_blank')
  }
}
export {
  handleImageUpload,
  handleVideoUpload,
  handleFileUpload,
  handleThumbnailUpload,
  handleVerificationUpload,
  handleDeleteImg,
  handleDownload,
}
