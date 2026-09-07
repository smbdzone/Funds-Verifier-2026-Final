'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  MdiDownloadOutlineIcon,
  PixelarticonsScaleIcon,
} from '@/components/offplan/OffPlanLayoutActionIcons'
import { downloadListingMedia } from '@/libs/downloadListingMedia'

const GOLDEN_GRADIENT =
  'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)'

const getDownloadFilename = (src, fallbackName) => {
  const cleanSrc = String(src || '').split('?')[0]
  const extension = cleanSrc.split('.').pop() || 'jpg'
  return `${fallbackName}.${extension}`
}

const ActionIconButton = ({ onClick, disabled, ariaLabel, children }) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className='flex h-9 w-9 flex-none items-center justify-center rounded-full p-[3px] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
    style={{ background: GOLDEN_GRADIENT }}
  >
    {children}
  </button>
)

const PlanImagePanel = ({ title, src, downloadName, alt }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  if (!src) {
    return (
      <div className='rounded-sm border border-black/10 bg-white p-4 shadow-neons'>
        <h4 className='mb-3 text-base font-medium text-prussianBlue'>{title}</h4>
        <p className='py-16 text-center text-sm text-black/50'>
          No {title.toLowerCase()} uploaded for this property.
        </p>
      </div>
    )
  }

  const imageSrc = src

  const handleDownload = async (event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()

    setIsDownloading(true)
    try {
      const filename = getDownloadFilename(imageSrc, downloadName)
      const success = await downloadListingMedia(imageSrc, filename)
      if (success) {
        toast.success('Download started')
      } else {
        toast.error('Failed to download image')
      }
    } catch {
      toast.error('Failed to download image')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClosePreview = () => setIsPreviewOpen(false)

  const handleOverlayClick = (event) => {
    if (event.target.id === 'offPlanLayoutPreviewOverlay') {
      handleClosePreview()
    }
  }

  return (
    <>
      <div className='relative rounded-sm border border-black/10 bg-white p-4 shadow-neons'>
        <div className='absolute right-3 top-3 z-10 flex h-9 w-[84px] items-center gap-3'>
          <ActionIconButton
            onClick={() => setIsPreviewOpen(true)}
            ariaLabel={`View ${title}`}
          >
            <PixelarticonsScaleIcon className='text-white' size={18} />
          </ActionIconButton>

          <ActionIconButton
            onClick={handleDownload}
            disabled={isDownloading}
            ariaLabel={`Download ${title}`}
          >
            <MdiDownloadOutlineIcon className='text-white' size={17} />
          </ActionIconButton>
        </div>

        <h4 className='mb-3 pr-24 text-base font-medium text-prussianBlue'>
          {title}
        </h4>

        <div className='relative h-[280px] w-full overflow-hidden rounded-sm bg-[#f5f5f5]'>
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className='object-contain p-4'
          />
        </div>
      </div>

      {isPreviewOpen ? (
        <div
          id='offPlanLayoutPreviewOverlay'
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
          onClick={handleOverlayClick}
        >
          <div className='relative w-full max-w-4xl overflow-hidden rounded-sm border border-black/10 bg-white shadow-neons'>
            <div className='relative min-h-[240px] bg-[#f5f5f5]'>
              <img
                src={imageSrc}
                alt={alt}
                className='max-h-[85vh] w-full object-contain'
              />

              <div className='absolute right-3 top-3 z-10 flex h-9 items-center gap-3'>
                <ActionIconButton
                  onClick={handleDownload}
                  disabled={isDownloading}
                  ariaLabel={`Download ${title}`}
                >
                  <MdiDownloadOutlineIcon className='text-white' size={17} />
                </ActionIconButton>

                <ActionIconButton
                  onClick={handleClosePreview}
                  ariaLabel='Close preview'
                >
                  <X className='text-white' size={18} strokeWidth={2.5} />
                </ActionIconButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

const OffPlanLayoutFloorPlanDisplay = ({ unitLayout, floorPlan }) => {
  return (
    <div className='grid grid-cols-1 gap-6 px-2 py-4 md:grid-cols-2'>
      <PlanImagePanel
        title='Unit Layout'
        src={unitLayout}
        downloadName='unit-layout'
        alt='Unit layout'
      />
      <PlanImagePanel
        title='Floor Plan'
        src={floorPlan}
        downloadName='floor-plan'
        alt='Floor plan'
      />
    </div>
  )
}

export default OffPlanLayoutFloorPlanDisplay
