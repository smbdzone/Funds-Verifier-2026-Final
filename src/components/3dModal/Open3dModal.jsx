import React from 'react'
import { ExternalLinkPreview } from '@/components/product-modal/DocumentPdfPreview'

const Open3dModal = ({ selectedMedia, setSelectedMedia, link }) => {
  return (
    <div>
      <div
        id='modalOverlay'
        className='fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center'
      >
        <div className='md:w-[50%] w-[90%] h-[70%] bg-white p-2 rounded-md relative'>
          <button
            className='absolute top-2 right-2 text-4xl'
            onClick={() => setSelectedMedia(false)}
          >
            &times;
          </button>
          {link?.includes('.mp4') ? (
            <video
              src={link}
              controls
              className='w-full h-full object-contain'
            />
          ) : link?.includes('.jpg') || link?.includes('.png') ? (
            <img
              src={link}
              alt='Selected'
              className='w-full h-full object-contain'
            />
          ) : (
            <ExternalLinkPreview href={link} title='3D Walkthrough' />
          )}
        </div>
      </div>
    </div>
  )
}

export default Open3dModal
