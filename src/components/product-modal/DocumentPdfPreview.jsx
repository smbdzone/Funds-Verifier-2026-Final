'use client'

import React, { useEffect, useState } from 'react'
import { getFileExtensionFromUrl } from '@/utils'
import {
  isEvaluationCertificateStreamUrl,
  loadPdfBlobUrlForViewer,
} from '@/libs/certificatePdfViewer'

/**
 * Load PDF via fetch → blob URL for iframe preview (avoids X-Frame-Options on S3/CloudFront).
 */
export function PdfIframePreview({ fileUrl }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [directUrl, setDirectUrl] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let objectUrl = null

    const run = async () => {
      setLoading(true)
      setBlobUrl(null)
      setDirectUrl(null)
      setLoadError(null)

      const result = await loadPdfBlobUrlForViewer(fileUrl)

      if (cancelled) {
        if (result.blobUrl) URL.revokeObjectURL(result.blobUrl)
        return
      }

      objectUrl = result.blobUrl
      setBlobUrl(result.blobUrl)
      setDirectUrl(result.directUrl)
      setLoadError(result.error)
      setLoading(false)
    }

    run()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [fileUrl])

  const iframeSrc = blobUrl || directUrl

  if (loading) {
    return (
      <div className='flex min-h-[52vh] flex-1 items-center justify-center text-sm text-gray-600'>
        Loading PDF…
      </div>
    )
  }

  if (loadError && !iframeSrc) {
    return (
      <div className='flex min-h-[52vh] flex-1 flex-col items-center justify-center gap-3 px-4 text-center'>
        <p className='text-sm text-red-600'>{loadError}</p>
        <a
          href={fileUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded bg-[#002d4f] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90'
        >
          Open PDF in new tab
        </a>
      </div>
    )
  }

  if (!iframeSrc) {
    return (
      <div className='flex min-h-[52vh] flex-1 items-center justify-center text-sm text-gray-600'>
        No preview available.
      </div>
    )
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-2'>
      <iframe
        title='Document preview'
        src={iframeSrc}
        className='min-h-0 w-full flex-1 rounded-sm border border-gray-200 bg-neutral-100'
        style={{ minHeight: '52vh' }}
      />
      <div className='flex shrink-0 flex-wrap items-center justify-center gap-3 text-xs text-gray-600'>
        <a
          href={fileUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded bg-[#002d4f] px-3 py-1.5 font-medium text-white hover:opacity-90'
        >
          Open PDF in new tab
        </a>
        {directUrl && !blobUrl ? (
          <span className='text-center text-gray-500'>
            Using direct link preview.
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function DocumentPreviewBody({ fileUrl, alt = 'Document' }) {
  const ext = getFileExtensionFromUrl(fileUrl || '')
  const pathBeforeQuery = (fileUrl || '').split('?')[0] || ''
  const hasPdfInPath = /\.pdf$/i.test(pathBeforeQuery)
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
  const isPdf =
    ext === 'pdf' ||
    hasPdfInPath ||
    isEvaluationCertificateStreamUrl(fileUrl) ||
    (ext === '' && /^https?:\/\//i.test(fileUrl || ''))

  if (!fileUrl) {
    return (
      <p className='m-auto text-center text-sm text-gray-600'>
        No document link is available.
      </p>
    )
  }

  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt={alt}
        className='mx-auto max-h-[62vh] w-auto max-w-full object-contain'
      />
    )
  }

  if (isPdf) {
    return <PdfIframePreview fileUrl={fileUrl} />
  }

  if (['doc', 'docx', 'xlsx'].includes(ext)) {
    return (
      <a
        href={fileUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 underline'
      >
        Open document in new tab
      </a>
    )
  }

  return (
    <p className='text-center text-sm text-gray-600'>
      Preview is not available for this file type. Open the link in a new tab.
    </p>
  )
}
