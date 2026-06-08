export const LISTING_IMAGE_MAX_BYTES = 20 * 1024 * 1024
export const LISTING_VIDEO_MAX_BYTES = 100 * 1024 * 1024

export const LISTING_IMAGE_MAX_MB = LISTING_IMAGE_MAX_BYTES / (1024 * 1024)
export const LISTING_VIDEO_MAX_MB = LISTING_VIDEO_MAX_BYTES / (1024 * 1024)

export const LISTING_IMAGE_FORMATS_LABEL = `JPG, PNG, GIF. Maximum file size: ${LISTING_IMAGE_MAX_MB}MB`
export const LISTING_VIDEO_FORMATS_LABEL = `MP4, MOV. Maximum file size: ${LISTING_VIDEO_MAX_MB}MB`

export const getUploadErrorMessage = (error, fileType, maxMB) => {
  const status = error?.response?.status
  const serverMsg = error?.response?.data?.message

  if (status === 413) {
    return `${fileType} upload failed: file is too large. Maximum allowed size is ${maxMB}MB. Please compress or use a smaller file.`
  }

  if (serverMsg) return serverMsg

  if (error?.code === 'ERR_NETWORK') {
    return `${fileType} upload failed: network error. Please check your connection and try again.`
  }

  return `${fileType} upload failed. Please try again.`
}
