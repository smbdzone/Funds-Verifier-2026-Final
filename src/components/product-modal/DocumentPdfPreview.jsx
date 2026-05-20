'use client'

import React, { useState } from 'react'
import { ExternalLink, Download } from 'lucide-react'
import { getFileExtensionFromUrl } from '@/utils'
import {
  downloadPdfFile,
  getPdfOriginalSrc,
  isEvaluationCertificateStreamUrl,
  openPdfInNewTab,
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
    const opened = openPdfInNewTab(fileUrl)
    if (opened) {
      onDone?.()
    } else {
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
        This document cannot be previewed here. Open it in a new tab or download
        it to your device.
      </p>
      <div className='flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center'>
        <button
          type='button'
          onClick={handleOpen}
          disabled={downloading}
          className='btn-gradient flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white disabled:opacity-50'
        >
          <ExternalLink className='h-4 w-4' />
          Open
        </button>
        <button
          type='button'
          onClick={handleDownload}
          disabled={downloading}
          className='flex items-center justify-center gap-2 rounded-lg border-2 border-[#002d4f] bg-white px-8 py-3 text-sm font-semibold text-[#002d4f] hover:bg-gray-50 disabled:opacity-50'
        >
          <Download className='h-4 w-4' />
          {downloading ? 'Downloading…' : 'Download'}
        </button>
      </div>
    </div>
  )
}

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

/** 3D walkthrough — open in new tab only. */
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
    const tab = window.open(href, '_blank', 'noopener,noreferrer')
    if (tab) onDone?.()
    else {
      window.alert(
        'Could not open a new tab. Please allow pop-ups for this site, then try again.'
      )
    }
  }

  return (
    <div className='flex flex-col items-center justify-center gap-8 px-6 py-12 text-center'>
      <p className='text-base font-semibold text-[#002d4f]'>{title}</p>
      <p className='max-w-sm text-sm text-gray-600'>
        3D walkthrough opens in a new browser tab for the best experience.
      </p>
      <button
        type='button'
        onClick={handleOpen}
        className='btn-gradient flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white'
      >
        <ExternalLink className='h-4 w-4' />
        Open
      </button>
    </div>
  )
}
