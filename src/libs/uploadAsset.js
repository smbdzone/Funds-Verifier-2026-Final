import axios from 'axios'
import customAxios from '../utils/apis/apis'
import { getTokenFromCookie } from '../utils/helper'

const handleImageUpload = async (images) => {
  const formData = new FormData()
  images.forEach((image) => {
    formData.append('images', image)
  })

  try {
    // Do not set Content-Type manually — FormData needs the multipart boundary.
    const response = await customAxios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/upload-imgs`,
      formData,
    )
    return response.data
  } catch (error) {
    console.error('Error uploading images:', error)
    throw error
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
    console.error('Error uploading video:', error)
    throw error
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
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      'Upload failed'
    console.error('Error uploading file', msg, error?.response?.data)
    const wrapped = new Error(msg)
    wrapped.cause = error
    throw wrapped
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
    console.error('Error uploading verification certificate:', error)
    throw error
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
    console.error('Error uploading image:', error)
    throw error
  }
}

const handleDeleteImg = async (id) => {
  try {
    const response = await customAxios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/delete-imgs/${id}`
    )

    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    // Handle error (e.g., show error message)
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
