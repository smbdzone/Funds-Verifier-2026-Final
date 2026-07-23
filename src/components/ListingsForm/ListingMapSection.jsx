'use client'

import ListingFormInput from '@/components/ListingFormInput/ListingFormInput'
import { toGoogleMapsEmbedUrl } from '@/libs/listingMapUrl'

/**
 * Optional Google Maps URL field + live embed preview below it.
 * When mapUrl is empty, no hardcoded map is shown unless showEmptyPlaceholder is true.
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
  const embedSrc = toGoogleMapsEmbedUrl(mapUrl)
  const showMapBox = Boolean(embedSrc) || showEmptyPlaceholder

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
            placeholder='Google Maps URL (optional)'
            fieldLabel='Google Maps URL'
            required={false}
            type='url'
            disabled={disabled}
            maxLength={2000}
          />
        </div>
      ) : null}

      {embedSrc ? (
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
