'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Download } from 'lucide-react'
import { getFileExtensionFromUrl } from '@/utils'
import {
  downloadPdfFile,
  getPdfOriginalSrc,
  getPdfProxyFetchUrl,
  isEvaluationCertificateStreamUrl,
  openPdfInNewTab,
  openUrlInNewTab,
} from '@/libs/certificatePdfViewer'

export function PdfDocumentActions({
  fileUrl,
  downloadFileName = 'document.pdf',
  onDone,
}) {
  const [downloading, setDownloading] = useState(false)
  const originalSrc = getPdfOriginalSrc(fileUrl)
  const safeName =
    typeof downloadFileName === 'string' && downloadFileName.trim()
      ? downloadFileName.trim()
      : 'document.pdf'

  const handleOpen = () => {
    const ok = openPdfInNewTab(fileUrl)
    onDone?.()
    if (!ok) {
      window.alert(
        'Could not open a new tab. Please allow pop-ups for this site, then try again.'
      )
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadPdfFile(fileUrl, safeName)
      onDone?.()
    } finally {
      setDownloading(false)
    }
  }

  if (!originalSrc) {
    return (
      <p className='px-6 py-10 text-center text-sm text-gray-600'>
        No document link is available.
      </p>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center gap-8 px-6 py-12 text-center'>
      <p className='max-w-sm text-sm text-gray-600'>
        Open this document in a new tab or download it to your device.
      </p>
      <div className='flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center'>
        <button
          type='button'
          onClick={handleOpen}
          disabled={downloading}
          className='btn-gradient flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white disabled:opacity-50'
        >
          <ExternalLink className='h-4 w-4' />
          Open in new tab
        </button>
        <button
          type='button'
          onClick={handleDownload}
          disabled={downloading}
          className='flex items-center justify-center gap-2 rounded-lg border-2 border-[#002d4f] bg-white px-8 py-3 text-sm font-semibold text-[#002d4f] hover:bg-gray-50 disabled:opacity-50'
        >
          <Download className='h-4 w-4' />
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  )
}

function PdfActionBar({ fileUrl, onDone, downloading, onDownload }) {
  const previewHref = getPdfProxyFetchUrl(fileUrl) || getPdfOriginalSrc(fileUrl)

  const handleOpen = () => {
    const ok = openPdfInNewTab(fileUrl)
    onDone?.()
    if (!ok) {
      window.alert(
        'Could not open a new tab. Please allow pop-ups for this site, then try again.'
      )
    }
  }

  return (
    <div className='flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-gray-100 py-2'>
      <button
        type='button'
        onClick={handleOpen}
        disabled={!previewHref || downloading}
        className='flex items-center gap-2 rounded bg-[#002d4f] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50'
      >
        <ExternalLink className='h-4 w-4' />
        Open in new tab
      </button>
      <button
        type='button'
        onClick={onDownload}
        disabled={!previewHref || downloading}
        className='flex items-center gap-2 rounded border border-[#002d4f] px-4 py-2 text-sm font-medium text-[#002d4f] hover:bg-gray-50 disabled:opacity-50'
      >
        <Download className='h-4 w-4' />
        {downloading ? 'Downloading...' : 'Download'}
      </button>
    </div>
  )
}

/** Same-origin proxy iframe (never load port 4000 directly in the modal). */
export function PdfCanvasPreview({ fileUrl, downloadFileName, onDone }) {
  const previewSrc = useMemo(() => getPdfProxyFetchUrl(fileUrl), [fileUrl])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const safeName =
    typeof downloadFileName === 'string' && downloadFileName.trim()
      ? downloadFileName.trim()
      : 'document.pdf'

  useEffect(() => {
    setLoading(true)
    setFailed(false)
    const t = setTimeout(() => setLoading(false), 8000)
    return () => clearTimeout(t)
  }, [previewSrc])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadPdfFile(fileUrl, safeName)
    } finally {
      setDownloading(false)
    }
  }

  if (!previewSrc) {
    return (
      <PdfDocumentActions
        fileUrl={fileUrl}
        downloadFileName={downloadFileName}
        onDone={onDone}
      />
    )
  }

  if (failed) {
    return (
      <PdfDocumentActions
        fileUrl={fileUrl}
        downloadFileName={downloadFileName}
        onDone={onDone}
      />
    )
  }

  return (
    <div className='relative flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/90 text-sm text-gray-600'>
          <span
            className='inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#B7A55E] border-t-transparent'
            aria-hidden
          />
          <span>Loading document...</span>
        </div>
      ) : null}
      <iframe
        key={previewSrc}
        src={previewSrc}
        title='Document preview'
        className='min-h-0 w-full flex-1 rounded-sm border border-gray-200 bg-neutral-100'
        style={{ minHeight: '52vh', maxHeight: '62vh' }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setFailed(true)
          setLoading(false)
        }}
      />
      <PdfActionBar
        fileUrl={fileUrl}
        onDone={onDone}
        downloading={downloading}
        onDownload={handleDownload}
      />
    </div>
  )
}

export const PdfIframePreview = PdfCanvasPreview

export function DocumentPreviewBody({
  fileUrl,
  alt = 'Document',
  downloadFileName,
  onDone,
}) {
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
      <p className='m-auto px-6 py-10 text-center text-sm text-gray-600'>
        No document link is available.
      </p>
    )
  }

  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt={alt}
        className='mx-auto max-h-[62vh] w-auto max-w-full object-contain p-4'
      />
    )
  }

  if (isPdf) {
    return (
      <PdfDocumentActions
        fileUrl={fileUrl}
        downloadFileName={downloadFileName}
        onDone={onDone}
      />
    )
  }

  if (['doc', 'docx', 'xlsx'].includes(ext)) {
    return (
      <PdfDocumentActions
        fileUrl={fileUrl}
        downloadFileName={downloadFileName}
        onDone={onDone}
      />
    )
  }

  return (
    <PdfDocumentActions
      fileUrl={fileUrl}
      downloadFileName={downloadFileName}
      onDone={onDone}
    />
  )
}

/** 3D walkthrough - open in new tab only (no iframe). */
export function ExternalLinkPreview({
  href,
  title = '3D Walkthrough',
  onDone,
}) {
  if (!href) {
    return (
      <p className='m-auto px-6 py-10 text-center text-sm text-gray-600'>
        No link available.
      </p>
    )
  }

  const handleOpen = () => {
    const ok = openUrlInNewTab(href)
    onDone?.()
    if (!ok) {
      window.alert(
        'Could not open a new tab. Please allow pop-ups for this site, then try again.'
      )
    }
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 px-5 py-6 text-center'>
      <p className='max-w-xs text-sm text-gray-600'>
        Opens in a new browser tab for the best experience.
      </p>
      <button
        type='button'
        onClick={handleOpen}
        className='btn-gradient flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white'
      >
        <ExternalLink className='h-4 w-4' />
        Open in new tab
      </button>
    </div>
  )
}
