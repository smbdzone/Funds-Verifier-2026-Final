'use client'

import React from 'react'
import Image from 'next/image'
import { ExternalLinkPreview } from '@/components/product-modal/DocumentPdfPreview'

const Open3dModal = ({ setSelectedMedia, link }) => {
  const close = () => setSelectedMedia(false)

  const isVideo = link?.includes('.mp4')
  const isImage =
    link?.includes('.jpg') ||
    link?.includes('.jpeg') ||
    link?.includes('.png') ||
    link?.includes('.webp')

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3'>
      <div className='relative w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg'>
        <button
          type='button'
          onClick={close}
          className='absolute right-3 top-3 z-10 text-xl leading-none text-gray-600 hover:text-gray-900'
          aria-label='Close'
        >
          ×
        </button>

        {!isVideo && !isImage ? (
          <div className='border-b border-gray-100 px-5 pb-3 pt-5'>
            <div className='flex items-center gap-2 pr-8'>
              <Image
                src='/assets/images/logo.svg'
                alt='Funds Verifier'
                height={32}
                width={32}
                className='h-8 w-8'
              />
              <div>
                <p className='text-xs text-gray-500'>Funds Verifier</p>
                <h3 className='text-sm font-bold text-[#002d4f]'>3D Walkthrough</h3>
              </div>
            </div>
          </div>
        ) : null}

        {isVideo ? (
          <video
            src={link}
            controls
            className='mx-auto max-h-[50vh] w-full object-contain p-3'
          />
        ) : isImage ? (
          <img
            src={link}
            alt='3D preview'
            className='mx-auto max-h-[50vh] w-full object-contain p-3'
          />
        ) : (
          <ExternalLinkPreview href={link} title='3D Walkthrough' onDone={close} />
        )}
      </div>
    </div>
  )
}

export default Open3dModal
