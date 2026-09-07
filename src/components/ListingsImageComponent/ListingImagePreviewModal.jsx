'use client'

import React, { useEffect } from 'react'

/**
 * Full-size image lightbox so users can see the Funds Verifier watermark clearly.
 */
const ListingImagePreviewModal = ({ src, alt = 'Preview', onClose }) => {
  useEffect(() => {
    if (!src) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4'
      role='dialog'
      aria-modal='true'
      aria-label='Image preview'
      onClick={onClose}
    >
      <div
        className='relative max-h-[90vh] max-w-[920px] overflow-hidden rounded-md bg-white shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          className='absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#002D4F] text-lg leading-none text-white'
          aria-label='Close preview'
        >
          &times;
        </button>
        <div className='max-h-[90vh] overflow-auto p-2 sm:p-3'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className='mx-auto max-h-[82vh] w-auto max-w-full object-contain'
          />
        </div>
        <p className='border-t border-slate-100 px-3 py-2 text-center text-xs text-slate-500'>
          A light white “FUNDS VERIFIER” watermark is centered on uploaded
          photos and stays on the file when downloaded
        </p>
      </div>
    </div>
  )
}

export default ListingImagePreviewModal
