'use client'

import React from 'react'
import { FaDownload } from 'react-icons/fa6'
import Image from 'next/image'
import { DocumentPreviewBody } from '@/components/product-modal/DocumentPdfPreview'
import { loadPdfBlobUrlForViewer } from '@/libs/certificatePdfViewer'

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

const Modal2 = ({
  isOpen,
  onClose,
  file2Url,
  downloadFileName,
  modalTitle = 'Evaluation Certificate',
}) => {
  if (!isOpen) return null

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
            <DocumentPreviewBody
              fileUrl={file2Url}
              alt='Evaluation certificate'
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal2
