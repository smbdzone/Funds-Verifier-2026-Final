/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import Image from 'next/image'
import { CloseIcon } from '@/components/Icons'
import axios from 'axios'
import { Button } from '@mui/material'
import './style.css'
import customAxios from '../../utils/apis/apis'

const Modal2 = ({ show, onClose, onSave }) => {
  if (!show) {
    return null
  }

  const [selectedImage, setSelectedImage] = useState('')

  const handleImageSelect = (image) => {
    setSelectedImage(image)
  }

  const handleSave = async () => {
    if (selectedImage === '') {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/evaluator/get`
        )

        onSave(response.data.profileImage)
        onClose()
      } catch (error) {
        console.error('Error fetching profile image:', error)
      }
    } else {
      try {
        const response = await customAxios.patch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/evaluator/update`,
          {
            imageUrl: selectedImage,
          }
        )
        onSave(selectedImage) // Call the onSave callback with the selected image
        onClose() // Close the modal after successful update
      } catch (error) {
        console.error('Error updating profile image:', error)
      }
    }
  }

  const images = [
    '/avatar/Mask group (4).png',
    '/avatar/Mask group (5).png',
    '/avatar/Mask group (6).png',
    '/avatar/Mask group (7).png',
    '/avatar/Mask group (8).png',
    '/avatar/Mask group (9).png',
    '/avatar/Mask group (10).png',
    '/avatar/Mask group (11).png',
    '/avatar/Mask group (12).png',
    '/avatar/Mask group (13).png',
    '/avatar/Mask group (15).png',
    '/avatar/Mask group (16).png',
    '/avatar/Mask group (17).png',
    '/avatar/Mask group (18).png',
    '/avatar/Mask group (20).png',
    '/avatar/Mask group (21).png',
    '/avatar/Mask group (22).png',
    '/avatar/Avatars 2.png',
  ]

  return (
    <>
      <div className='fixed inset-0 justify-center items-center bg-black bg-opacity-50 z-10'></div>
      <div className='fixed inset-0 z-20 flex items-center justify-center'>
        <div className='bg-white rounded-lg w-[60%] h-[70%] max-h-full overflow-y-auto z-30 p-3'>
          <div className='flex items-center justify-end'>
            <span className='cursor-pointer' onClick={onClose}>
              <CloseIcon />
            </span>
          </div>
          <h2 className='text-black text-2xl font-bold text-center pt-2 mb-2'>
            Choose Avatar
          </h2>
          <div className='grid grid-cols-4 gap-3'>
            {images.map((image, index) => (
              <div key={index} className='relative overflow-hidden rounded-lg'>
                <Image
                  src={image}
                  alt={`Profile Image ${index + 1}`}
                  width={120}
                  height={120}
                />
                <input
                  type='checkbox'
                  checked={selectedImage === image}
                  onChange={() => handleImageSelect(image)}
                  className='absolute top-0 right-1 h-3 w-3 cursor-pointer accent-[#A2913E] checked:bg-[#A2913E]'
                />
              </div>
            ))}
          </div>
          <div className='justify-center flex gap-4 mt-4'>
            <button
              className='text-sm py-2.5 px-5 border-2 rounded-md text-white primary-gradient'
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal2
