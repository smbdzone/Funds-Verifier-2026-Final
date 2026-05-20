import React from 'react'

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
            <div className='flex h-full min-h-0 w-full flex-col gap-2'>
              <iframe
                src={link}
                className='min-h-0 w-full flex-1 object-contain'
                frameBorder='0'
                allowFullScreen
                title='3D Walkthrough'
              />
              <a
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                className='shrink-0 text-center text-sm text-[#002d4f] underline'
              >
                Open 3D walkthrough in new tab
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Open3dModal
