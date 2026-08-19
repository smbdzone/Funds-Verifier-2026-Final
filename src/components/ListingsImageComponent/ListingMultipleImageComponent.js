'use client'
import Image from 'next/image'
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { LISTING_IMAGE_MAX_COUNT } from '@/constants/listingUploadLimits'
import ListingImagePreviewModal from '@/components/ListingsImageComponent/ListingImagePreviewModal'

const DRAG_THRESHOLD = 6 // px before we treat it as a drag

const ListingMultipleImageComponent = ({
  images,
  handleImageRemove,
  handleImageReorder,
  handleImageChange,
  errors,
  errorMessage,
  disabled,
  inputId = 'additional-pictures',
  uploadLabel = 'Add Pictures',
}) => {
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  // refs so event listeners always see latest values
  const draggingIndexRef = useRef(null)
  const overIndexRef = useRef(null)
  const startPos = useRef(null)
  const isDragging = useRef(false)

  const imagePreviews = useMemo(() => {
    if (!images || !Array.isArray(images)) return []
    return images
      .filter(Boolean)
      .map((image) => {
        if (typeof image?.signedUrl === 'string' && image.signedUrl.startsWith('http'))
          return { file: image?.s3Key || image?.public_id, preview: image.signedUrl }
        if (typeof image?.url === 'string' && image.url.startsWith('http'))
          return { file: image?.s3Key || image?.public_id, preview: image.url }
        if (image instanceof File)
          return { file: image, preview: URL.createObjectURL(image) }
        return null
      })
      .filter(Boolean)
  }, [images])

  const atImageLimit = images?.length >= LISTING_IMAGE_MAX_COUNT

  // find which tile the pointer is over by element hit-test
  const getTileIndexFromPoint = useCallback((x, y) => {
    const els = document.querySelectorAll('[data-tile-index]')
    for (const el of els) {
      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return Number(el.dataset.tileIndex)
      }
    }
    return null
  }, [])

  const onMouseDown = useCallback((e, index) => {
    if (disabled) return
    if (e.button !== 0) return // left click only
    startPos.current = { x: e.clientX, y: e.clientY }
    draggingIndexRef.current = index
    isDragging.current = false

    const onMouseMove = (e) => {
      const dx = e.clientX - startPos.current.x
      const dy = e.clientY - startPos.current.y
      if (!isDragging.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        isDragging.current = true
        setDraggingIndex(draggingIndexRef.current)
      }
      if (isDragging.current) {
        const idx = getTileIndexFromPoint(e.clientX, e.clientY)
        overIndexRef.current = idx
        setOverIndex(idx)
      }
    }

    const onMouseUp = (e) => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)

      if (isDragging.current) {
        const from = draggingIndexRef.current
        const to = overIndexRef.current
        if (to !== null && to !== from) {
          handleImageReorder?.(from, to)
        }
      } else {
        // It was just a click — open lightbox
        // find preview for clicked index
        const preview = imagePreviews[draggingIndexRef.current]?.preview
        if (preview) setLightboxSrc(preview)
      }

      isDragging.current = false
      draggingIndexRef.current = null
      overIndexRef.current = null
      setDraggingIndex(null)
      setOverIndex(null)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [disabled, getTileIndexFromPoint, handleImageReorder, imagePreviews])

  // prevent native drag on images
  const noDrag = (e) => e.preventDefault()

  return (
    <>
      <div className='flex h-full min-h-0 items-stretch gap-3'>
        <div className='min-h-0 min-w-0 flex-1 overflow-x-hidden pr-1'>
          <div className='flex flex-wrap content-start gap-2'>
            {imagePreviews.map((imageData, index) => (
              <div
                key={index}
                data-tile-index={index}
                onMouseDown={(e) => onMouseDown(e, index)}
                onDragStart={noDrag}
                className={`group relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-sm border bg-offwhite transition-all select-none
                  ${overIndex === index && draggingIndex !== index
                    ? 'border-light-gold ring-2 ring-light-gold scale-105'
                    : 'border-dark-grey/15'}
                  ${draggingIndex === index ? 'opacity-40' : ''}
                  ${!disabled ? 'cursor-grab' : ''}
                `}
                title={!disabled ? 'Drag to reorder • Click to preview' : 'Click to preview'}
              >
                <Image
                  width={52}
                  height={52}
                  src={imageData.preview}
                  alt={`upload-${index}`}
                  className='h-full w-full object-cover pointer-events-none'
                  draggable={false}
                />
                {/* Order badge — thumbnail is #1 so these start at 2 */}
                <span className='pointer-events-none absolute bottom-0 left-0 min-w-[14px] rounded-tr bg-black/50 px-1 py-px text-center text-[9px] font-bold leading-none text-white'>
                  {index + 2}
                </span>

                {!disabled && (
                  <button
                    type='button'
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (imageData.file instanceof File) URL.revokeObjectURL(imageData.preview)
                      handleImageRemove(index, imageData?.file)
                    }}
                    className='absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-light-gold text-[10px] leading-none text-white opacity-0 transition-opacity group-hover:opacity-100'
                    title='Remove image'
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          {imagePreviews.length > 1 && !disabled && (
            <p className='mt-1.5 text-[10px] text-dark-grey/60'>
              Drag to reorder images
            </p>
          )}
        </div>

        <input
          type='file'
          id={inputId}
          className='pointer-events-none absolute h-0 w-0 opacity-0'
          accept='image/*'
          multiple
          disabled={disabled || atImageLimit}
          onChange={(e) => {
            handleImageChange(e)
            e.target.value = ''
          }}
        />

        <label
          htmlFor={!disabled && !atImageLimit ? inputId : undefined}
          className={`flex h-[88px] w-[120px] shrink-0 flex-col items-center justify-center shadow-neonsm ${atImageLimit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
        >
          <Image
            width={32}
            height={32}
            src='/listing/camera.svg'
            alt='Upload Image'
          />
          <span className='pt-2 text-center text-[13px] font-normal text-dark-grey'>
            {uploadLabel}
          </span>
        </label>
      </div>

      {errors && (
        <span className='absolute left-0 top-[99%] text-xs font-medium text-red-500 lg:text-sm'>
          **{errorMessage}
        </span>
      )}

      {lightboxSrc ? (
        <ListingImagePreviewModal
          src={lightboxSrc}
          alt='Picture preview'
          onClose={() => setLightboxSrc(null)}
        />
      ) : null}
    </>
  )
}

export default React.memo(ListingMultipleImageComponent)
