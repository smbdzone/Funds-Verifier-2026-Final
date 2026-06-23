'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getProfileImageSrc } from '@/utils/global-functions/global'

const FALLBACK = '/assets/images/dummy-profile.png'

export default function ProfileImage({ src, alt = 'Profile', height, width, className }) {
  const [imgSrc, setImgSrc] = useState(() => getProfileImageSrc(src))

  useEffect(() => {
    setImgSrc(getProfileImageSrc(src))
  }, [src])

  return (
    <Image
      src={imgSrc}
      alt={alt}
      height={height}
      width={width}
      className={className}
      onError={() => setImgSrc(FALLBACK)}
    />
  )
}
