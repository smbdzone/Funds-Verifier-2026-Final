'use client'

import React, { useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa6'
import Image from 'next/image'
import { getFileExtensionFromUrl } from '@/utils'
import {
  isEvaluationCertificateStreamUrl,
  loadPdfBlobUrlForViewer,
} from '@/libs/certificatePdfViewer'

/** Try CORS blob download; if that fails, open the URL in a new tab. */
async function downloadFromUrl(url, filename = 'evaluation-certificate.pdf') {
  if (!url || typeof url !== 'string') return
  try {
    const { blobUrl, error } = await loadPdfBlobUrlForViewer(url)
    if (!blobUrl) throw new Error(error || 'fetch failed')
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/**
 * Load PDF via fetch → blob URL so the iframe is same-origin to the tab.
 * Many S3/CloudFront URLs forbid embedding the remote URL directly (blank iframe).
 */
function PdfIframePreview({ file2Url }) {
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

      const result = await loadPdfBlobUrlForViewer(file2Url)

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
  }, [file2Url])

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
          href={file2Url}
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
          href={file2Url}
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

function CertificateBody({ file2Url, ext }) {
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
  const pathBeforeQuery = (file2Url || '').split('?')[0] || ''
  const hasPdfInPath = /\.pdf$/i.test(pathBeforeQuery)
  const isPdf =
    ext === 'pdf' ||
    hasPdfInPath ||
    isEvaluationCertificateStreamUrl(file2Url) ||
    (ext === '' && /^https?:\/\//i.test(file2Url))

  if (isImage) {
    return (
      <img
        src={file2Url}
        alt='Evaluation certificate'
        className='mx-auto max-h-[62vh] w-auto max-w-full object-contain'
      />
    )
  }

  if (isPdf) {
    return <PdfIframePreview file2Url={file2Url} />
  }

  if (['doc', 'docx', 'xlsx'].includes(ext)) {
    return (
      <a
        href={file2Url}
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
      Preview is not available for this file type. Use Download or open the link
      in a new tab.
    </p>
  )
}

const Modal2 = ({
  isOpen,
  onClose,
  file2Url,
  downloadFileName,
  modalTitle = 'Evaluation Certificate',
}) => {
  if (!isOpen) return null

  const ext = getFileExtensionFromUrl(file2Url || '')
  const safeName =
    typeof downloadFileName === 'string' && downloadFileName.trim()
      ? downloadFileName.trim()
      : 'evaluation-certificate.pdf'

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3'>
      <div className='flex h-[85vh] max-h-[900px] w-full max-w-4xl flex-col overflow-hidden rounded-md bg-white shadow-md'>
        <div className='relative shrink-0 border-b border-gray-100 px-4 pb-3 pt-4 md:px-6'>
          <button
            type='button'
            onClick={onClose}
            className='absolute right-3 top-3 text-gray-600 hover:text-gray-800 md:right-4 md:top-4'
            aria-label='Close'
          >
            X
          </button>
          <div className='flex flex-col gap-3 pr-8 sm:flex-row sm:items-center sm:justify-between sm:pr-10'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/images/logo.svg'
                alt='Funds Verifier'
                height={40}
                width={40}
                className='h-9 w-9 md:h-12 md:w-12'
              />
              <span className='text-sm font-medium text-blue md:text-base'>
                Funds Verifier
              </span>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='text-sm font-bold text-blue md:text-lg'>
                {modalTitle}
              </h3>
              <button
                type='button'
                className='rounded-md p-1.5 hover:bg-gray-100'
                onClick={() => downloadFromUrl(file2Url, safeName)}
                disabled={!file2Url}
                title='Download'
                aria-label='Download evaluation certificate'
              >
                <FaDownload color='#002d4f' size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className='flex min-h-0 flex-1 flex-col overflow-hidden bg-white px-3 pb-4 pt-2 md:px-6'>
          {!file2Url ? (
            <p className='m-auto text-center text-sm text-gray-600'>
              No document link is available.
            </p>
          ) : (
            <CertificateBody file2Url={file2Url} ext={ext} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal2
