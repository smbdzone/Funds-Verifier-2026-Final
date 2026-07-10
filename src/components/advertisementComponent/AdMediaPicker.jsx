'use client'
import { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { UploadIcon } from '@/components/Icons'
import {
  AD_MEDIA_WIDTH,
  AD_MEDIA_HEIGHT,
  AD_MEDIA_ASPECT,
  getCroppedImageFile,
} from '@/libs/cropImage'

/**
 * Ad media picker with preview + adjustable crop.
 *
 * On upload the image is opened in a cropper locked to the ad's aspect ratio
 * (1080x395). The user can drag/zoom to frame it, and the result is auto-cropped
 * to exactly 1080x395. Calls onChange(File | null) with the cropped file.
 */
const AdMediaPicker = ({ onChange }) => {
  const inputRef = useRef(null)
  const [rawImage, setRawImage] = useState(null) // original image data URL
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const openFilePicker = () => inputRef.current?.click()

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setRawImage(reader.result)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
    e.target.value = '' // let the user re-select the same file later
  }

  const onCropComplete = useCallback((_area, areaPixels) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const applyCrop = async () => {
    if (!rawImage || !croppedAreaPixels) return
    try {
      const { file, url } = await getCroppedImageFile(rawImage, croppedAreaPixels)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(url)
      onChange?.(file)
      setShowCropper(false)
    } catch (err) {
      console.error('Crop failed:', err)
    }
  }

  const removeMedia = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setRawImage(null)
    setCroppedAreaPixels(null)
    onChange?.(null)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onFile}
      />

      {!previewUrl ? (
        <button
          type='button'
          onClick={openFilePicker}
          className='flex w-full cursor-pointer border border-[#A2913E] rounded-[8px] flex-col py-11 justify-center items-center hover:bg-[#A2913E]/5 transition-colors'
        >
          <span className='flex flex-col text-black/50 justify-center items-center text-xs py-3 px-7 font-medium mb-1'>
            <UploadIcon className='mb-2 h-7 w-7' />
            Upload Ad Media
          </span>
          <span className='text-black/30 text-sm'>
            Recommended size: {AD_MEDIA_WIDTH} x {AD_MEDIA_HEIGHT} — you can crop
            after uploading
          </span>
        </button>
      ) : (
        <div className='border border-[#A2913E] rounded-[8px] p-4'>
          <img
            src={previewUrl}
            alt='Ad media preview'
            className='w-full rounded-[6px] object-cover'
            style={{ aspectRatio: `${AD_MEDIA_WIDTH} / ${AD_MEDIA_HEIGHT}` }}
          />
          <div className='flex flex-wrap gap-3 mt-3'>
            <button
              type='button'
              onClick={() => setShowCropper(true)}
              className='px-4 py-2 rounded-md text-sm font-medium border border-[#A2913E] text-[#A2913E] hover:bg-[#A2913E]/10 transition-colors'
            >
              Adjust crop
            </button>
            <button
              type='button'
              onClick={openFilePicker}
              className='px-4 py-2 rounded-md text-sm font-medium border border-[#002D4F] text-[#002D4F] hover:bg-[#002D4F]/10 transition-colors'
            >
              Change image
            </button>
            <button
              type='button'
              onClick={removeMedia}
              className='px-4 py-2 rounded-md text-sm font-medium border border-red-400 text-red-500 hover:bg-red-50 transition-colors'
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Cropper modal */}
      {showCropper && rawImage && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-[720px] p-4 sm:p-6'>
            <h3 className='text-lg font-semibold text-[#002D4F] mb-1'>
              Adjust your ad media
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              Drag to reposition and use the slider to zoom. The image is
              auto-cropped to {AD_MEDIA_WIDTH} x {AD_MEDIA_HEIGHT}.
            </p>

            <div className='relative w-full h-[300px] sm:h-[340px] bg-black rounded-md overflow-hidden'>
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={AD_MEDIA_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className='flex items-center gap-3 mt-4'>
              <span className='text-sm text-gray-600'>Zoom</span>
              <input
                type='range'
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className='flex-1 accent-[#A2913E]'
              />
            </div>

            <div className='flex justify-end gap-3 mt-5'>
              <button
                type='button'
                onClick={() => setShowCropper(false)}
                className='px-5 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={applyCrop}
                className='px-5 py-2 rounded-md text-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] hover:opacity-90'
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdMediaPicker
