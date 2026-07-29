'use client'

import { useEffect, useState } from 'react'
import ListingFormInput from '@/components/ListingFormInput/ListingFormInput'
import {
  isShortGoogleMapsUrl,
  toGoogleMapsEmbedUrl,
} from '@/libs/listingMapUrl'

/**
 * Optional Google Maps URL field + live embed preview below it.
 * Short links (maps.app.goo.gl) are expanded via /api/resolve-maps-url
 * so the iframe gets real coordinates instead of a world map.
 */
const ListingMapSection = ({
  mapUrl = '',
  handleChange,
  disabled = false,
  showInput = true,
  title = '',
  showEmptyPlaceholder = false,
  className = 'mt-[30px]',
  iframeClassName = 'w-full h-[300px] sm:h-[351px] rounded-[5px]',
}) => {
  const [embedSrc, setEmbedSrc] = useState(() => toGoogleMapsEmbedUrl(mapUrl))
  const [resolving, setResolving] = useState(false)
  const [resolveError, setResolveError] = useState('')

  useEffect(() => {
    const trimmed = String(mapUrl || '').trim()
    setResolveError('')

    if (!trimmed) {
      setEmbedSrc('')
      setResolving(false)
      return
    }

    const syncEmbed = toGoogleMapsEmbedUrl(trimmed)
    if (syncEmbed) {
      setEmbedSrc(syncEmbed)
      setResolving(false)
      return
    }

    if (!isShortGoogleMapsUrl(trimmed)) {
      setEmbedSrc('')
      setResolving(false)
      setResolveError('Could not read a location from this Maps URL')
      return
    }

    let cancelled = false
    const controller = new AbortController()

    const resolveShortUrl = async () => {
      setResolving(true)
      setEmbedSrc('')
      try {
        const res = await fetch(
          `/api/resolve-maps-url?url=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        )
        const data = await res.json().catch(() => ({}))
        if (cancelled) return

        if (!res.ok || !data?.embedUrl) {
          setEmbedSrc('')
          setResolveError(
            data?.error ||
            'Could not open this short Maps link. Paste the full Google Maps URL instead.'
          )
          return
        }

        setEmbedSrc(data.embedUrl)
        setResolveError('')
      } catch (err) {
        if (cancelled || err?.name === 'AbortError') return
        setEmbedSrc('')
        setResolveError('Could not resolve this Maps link. Try the full Google Maps URL.')
      } finally {
        if (!cancelled) setResolving(false)
      }
    }

    resolveShortUrl()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [mapUrl])

  const showMapBox = Boolean(embedSrc) || showEmptyPlaceholder || resolving || resolveError

  if (!showInput && !showMapBox && !title) return null

  return (
    <div className={className}>
      {title ? (
        <h2 className='mb-3 text-sm font-medium text-prussianBlue md:text-base'>
          {title}
        </h2>
      ) : null}

      {showInput && typeof handleChange === 'function' ? (
        <div className='relative mb-4 w-full max-w-[1064px] px-[19px] sm:mx-auto sm:px-0'>
          <ListingFormInput
            name='mapUrl'
            value={mapUrl || ''}
            handleChange={handleChange}
            placeholder='Google Maps URL (maps.app.goo.gl or share.google)'
            fieldLabel='Google Maps URL'
            required={false}
            type='url'
            disabled={disabled}
            maxLength={2000}
          />
        </div>
      ) : null}

      {resolving ? (
        <div
          className={`flex items-center justify-center rounded-[5px] border border-dashed border-black/20 bg-[#F7F7F7] text-sm text-black/50 ${iframeClassName}`}
        >
          Loading map location…
        </div>
      ) : embedSrc ? (
        <div className='overflow-hidden rounded-[5px] border border-black/10 bg-white shadow-neons'>
          <iframe
            className={iframeClassName}
            src={embedSrc}
            title={title ? `${title} map` : 'Listing location map'}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
        </div>
      ) : resolveError ? (
        <div
          className={`flex items-center justify-center rounded-[5px] border border-dashed border-amber-300 bg-amber-50 px-4 text-center text-sm text-amber-900 ${iframeClassName}`}
        >
          {resolveError}
        </div>
      ) : showEmptyPlaceholder ? (
        <div
          className={`flex items-center justify-center rounded-[5px] border border-dashed border-black/20 bg-[#F7F7F7] text-sm text-black/50 ${iframeClassName}`}
        >
          Map will appear here when a Google Maps URL is added
        </div>
      ) : null}
    </div>
  )
}

export default ListingMapSection
