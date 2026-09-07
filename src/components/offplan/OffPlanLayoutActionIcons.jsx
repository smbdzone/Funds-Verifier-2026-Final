'use client'

import React from 'react'
import { MdOutlineDownload } from 'react-icons/md'

/**
 * pixelarticons:scale — https://pixelarticons.com/icon/scale/
 * Official SVG from pixelarticons (24×24 grid).
 */
export function PixelarticonsScaleIcon({ className = '', size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        d='M21 3h-8v2h4v2h2v4h2V3zm-4 4h-2v2h-2v2h2V9h2V7zm-8 8h2v-2H9v2H7v2h2v-2zm-4-2v4h2v2H5h6v2H3v-8h2z'
        fill='currentColor'
      />
    </svg>
  )
}

/**
 * mdi:download-outline — Material Design Icons
 * https://pictogrammers.com/library/mdi/icon/download-outline/
 */
export function MdiDownloadOutlineIcon({ className = '', size = 17 }) {
  return (
    <MdOutlineDownload
      className={className}
      size={size}
      aria-hidden='true'
    />
  )
}
