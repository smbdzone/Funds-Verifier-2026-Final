'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  FaceBookIcon,
  LinkdInIcon,
  TwitterIcon,
  WhiteLinkdInIcon,
} from '@/components/Icons'
import {
  buildListingSocialShareLinks,
  getListingShareDescription,
  getListingShareUrl,
  openSocialShareWindow,
  toAbsoluteShareUrl,
} from '@/libs/listingSocialShare'

const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'Share on Facebook', Icon: FaceBookIcon },
  { key: 'twitter', label: 'Share on X (Twitter)', Icon: TwitterIcon },
]

export default function ListingSocialShare({
  listing,
  url,
  title,
  description,
  label = 'Share:',
  className = '',
  labelClassName = 'md:text-lg text-base',
  iconClassName = 'h-[16px] w-[16px]',
  iconGapClassName = 'gap-2',
  linkedinIcon = 'default',
  stacked = false,
}) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    const resolved = url
      ? toAbsoluteShareUrl(url)
      : getListingShareUrl(listing || {})
    setShareUrl(resolved)
  }, [listing, url])

  const shareTitle =
    title || listing?.title || 'Check out this listing on Funds Verifier'

  const shareDescription =
    description || getListingShareDescription(listing || {})

  const links = useMemo(
    () =>
      buildListingSocialShareLinks({
        url: shareUrl,
        title: shareTitle,
        description: shareDescription,
      }),
    [shareUrl, shareTitle, shareDescription],
  )

  const LinkedInIconComponent =
    linkedinIcon === 'white' ? WhiteLinkdInIcon : LinkdInIcon

  const platforms = [
    SOCIAL_PLATFORMS[0],
    {
      key: 'linkedin',
      label: 'Share on LinkedIn',
      Icon: LinkedInIconComponent,
    },
    SOCIAL_PLATFORMS[1],
  ]

  const handleShareClick = (event, platform) => {
    if (!shareUrl) {
      event.preventDefault()
      return
    }

    if (platform === 'twitter') {
      return
    }

    event.preventDefault()
    openSocialShareWindow(links[platform], platform)
  }

  const iconLinks = (
    <div className={`flex ${iconGapClassName}`}>
      {platforms.map(({ key, label: ariaLabel, Icon }) => (
        <a
          key={key}
          href={shareUrl ? links[key] : undefined}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={ariaLabel}
          aria-disabled={!shareUrl}
          onClick={(event) => handleShareClick(event, key)}
          className={`inline-flex transition-opacity hover:opacity-80 ${!shareUrl ? 'pointer-events-none opacity-40' : ''
            }`}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  )

  if (stacked) {
    return (
      <div className={className}>
        {label ? <p className={labelClassName}>{label}</p> : null}
        {iconLinks}
      </div>
    )
  }

  return (
    <div className={`flex gap-5 font-medium items-center ${className}`}>
      {label ? <span className={labelClassName}>{label}</span> : null}
      {iconLinks}
    </div>
  )
}
