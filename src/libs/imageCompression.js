// Third-party image compression.
//
// When an uploaded image exceeds the allowed size, it is sent to an external
// compression API and the compressed image is awaited before the user may
// proceed. The API endpoint/key are provided via env (left empty for now):
//   NEXT_PUBLIC_IMAGE_COMPRESSION_API_URL
//   NEXT_PUBLIC_IMAGE_COMPRESSION_API_KEY
//
// Until the URL is set, isCompressionConfigured() returns false and callers
// keep their existing behaviour (reject oversized files).

const API_URL = process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_API_URL
const API_KEY = process.env.NEXT_PUBLIC_IMAGE_COMPRESSION_API_KEY

/** True once a compression API endpoint has been configured. */
export const isCompressionConfigured = () =>
  Boolean(API_URL && String(API_URL).trim())

/**
 * Send one file to the compression API and return the compressed File.
 * Throws if the API isn't configured or the request fails — callers must not
 * let the user proceed on a rejected promise.
 *
 * NOTE: the request/response shape below is a sensible default (multipart POST
 * with `file`, binary image back). Adjust to match the chosen provider once the
 * API is available.
 *
 * @param {File} file
 * @param {{ maxBytes?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<File>}
 */
export async function compressImage(file, opts = {}) {
  if (!isCompressionConfigured()) {
    throw new Error('Image compression API is not configured')
  }

  const formData = new FormData()
  formData.append('file', file)
  if (opts.maxBytes) formData.append('maxBytes', String(opts.maxBytes))

  const res = await fetch(String(API_URL).trim(), {
    method: 'POST',
    headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : undefined,
    body: formData,
    signal: opts.signal,
  })

  if (!res.ok) {
    throw new Error(`Image compression failed (HTTP ${res.status})`)
  }

  const blob = await res.blob()
  if (!blob || blob.size === 0) {
    throw new Error('Image compression returned an empty file')
  }

  return new File([blob], file.name, {
    type: blob.type || file.type || 'image/jpeg',
  })
}

/**
 * Ensure a file is within `maxBytes`. Returns the original if already within
 * the limit; otherwise compresses it and returns the compressed File. If the
 * compressed result is still too large, throws (caller must block progress).
 *
 * @param {File} file
 * @param {number} maxBytes
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<File>}
 */
export async function ensureWithinSize(file, maxBytes, opts = {}) {
  if (!maxBytes || file.size <= maxBytes) return file

  const compressed = await compressImage(file, { maxBytes, signal: opts.signal })

  if (compressed.size > maxBytes) {
    throw new Error(
      `Image is still larger than the ${(maxBytes / (1024 * 1024)).toFixed(
        1,
      )}MB limit after compression`,
    )
  }
  return compressed
}

/**
 * Ensure every file in a list is within `maxBytes` (compressing as needed).
 * Rejects if any file can't be brought within the limit.
 *
 * @param {File[]} files
 * @param {number} maxBytes
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<File[]>}
 */
export async function ensureAllWithinSize(files, maxBytes, opts = {}) {
  return Promise.all(
    Array.from(files || []).map((f) => ensureWithinSize(f, maxBytes, opts)),
  )
}
