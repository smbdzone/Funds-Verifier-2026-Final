'use client'

import React from 'react'
import Image from 'next/image'
import { DocumentPreviewBody } from '@/components/product-modal/DocumentPdfPreview'

const Modal = ({ isOpen, onClose, fileUrl }) => {
  if (!isOpen) return null

  const downloadName =
    fileUrl?.split('/')?.pop()?.split('?')[0] || 'technical-report.pdf'

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3'>
      <div className='w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-lg'>
        <div className='relative border-b border-gray-100 px-5 pb-4 pt-5'>
          <button
            type='button'
            onClick={onClose}
            className='absolute right-3 top-3 text-xl leading-none text-gray-600 hover:text-gray-900'
            aria-label='Close'
          >
            ×
          </button>
          <div className='flex items-center gap-2 pr-8'>
            <Image
              src='/assets/images/logo.svg'
              alt='Funds Verifier'
              height={36}
              width={36}
              className='h-9 w-9'
            />
            <div>
              <p className='text-xs text-gray-500'>Funds Verifier</p>
              <h3 className='text-base font-bold text-[#002d4f]'>Technical Report</h3>
            </div>
          </div>
        </div>

        <DocumentPreviewBody
          fileUrl={fileUrl}
          alt='Technical report'
          downloadFileName={downloadName}
          onDone={onClose}
        />
      </div>
    </div>
  )
}

export default Modal
