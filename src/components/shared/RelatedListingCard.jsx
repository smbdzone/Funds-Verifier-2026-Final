'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaStar } from 'react-icons/fa'
import location from '@/assets/vector2.svg'
import {
  formatCardPrice,
  formatListingCardPrice,
} from '@/libs/listingPriceDisplay'
import {
  getListingCardImageSrc,
  PLACEHOLDER,
} from '@/libs/listingCardMedia'
import { getListingDetailId } from '@/libs/listingSlug'
import { getListingRef } from '@/libs/listingRef'
import { getProfileImageSrc } from '@/utils/global-functions/global'
import { isOffPlanListing } from '@/libs/filterMyListingTab'
import ListingCardViewCount from '@/components/shared/ListingCardViewCount'
import ListingCardQrThumb from '@/components/shared/ListingCardQrThumb'

function truncateTitle(title) {
  const text = String(title || '').trim()
  if (!text) return 'Listing'
  const words = text.split(/\s+/)
  return words.length > 4 ? `${words.slice(0, 4).join(' ')}...` : text
}

function ucFirst(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getListingHref(listing) {
  const id = getListingDetailId(listing)
  if (!id) return '#'

  const assetType = String(listing?.assetType || '')
  if (isOffPlanListing(listing) || /off plan/i.test(assetType)) {
    return `/offplan/${id}`
  }
  if (/car/i.test(assetType)) return `/car/${id}`
  if (/boat/i.test(assetType)) return `/boat/${id}`
  if (/jewel/i.test(assetType)) return `/jewelry/${id}`
  return `/property/${id}`
}

function getTypeLabel(listing) {
  const assetType = String(listing?.assetType || '')
  if (isOffPlanListing(listing) || /off plan/i.test(assetType)) {
    return 'Off Plan'
  }
  if (/car/i.test(assetType)) {
    return listing?.carType ? ucFirst(listing.carType) : 'Car For Sale'
  }
  if (/boat/i.test(assetType)) {
    return listing?.condition
      ? String(listing.condition)
      : 'Boats For Sale'
  }
  if (/jewel/i.test(assetType)) {
    return listing?.category ? ucFirst(listing.category) : 'Jewellery For Sale'
  }
  if (listing?.propertyType) {
    const lease = /lease/i.test(assetType)
    return `${ucFirst(listing.propertyType)} ${lease ? 'For Lease' : 'For Sale'}`
  }
  return ucFirst(assetType) || 'Property'
}

function getLocationLabel(listing) {
  return (
    listing?.neighbourhood ||
    listing?.city ||
    listing?.locateBoat ||
    listing?.locateJewelry ||
    ''
  )
}

function getReviewCount(listing) {
  const count = listing?.reviewCount ?? listing?.reviewCounts ?? 0
  return Number(count) || 0
}

/** Card used in Related Cars / Boats / Jewellery grids (same style as bottom slider). */
export default function RelatedListingCard({ listing, className = '' }) {
  if (!listing) return null

  const imageSrc = getListingCardImageSrc(listing)
  const href = getListingHref(listing)
  const rating = Number(listing?.averageRating || 0)
  const reviewCount = getReviewCount(listing)

  return (
    <Link
      href={href}
      className={`listing-card flex h-full w-full flex-col overflow-hidden rounded-md bg-white transition-opacity hover:opacity-95 ${className}`}
    >
      {imageSrc ? (
        <div className='relative h-[190px] w-full shrink-0 overflow-hidden rounded-t-md sm:h-[220px] lg:h-[275px]'>
          <Image
            width={414}
            height={275}
            className='listing-card-photo h-full w-full object-cover object-center'
            alt={listing.title || 'Listing'}
            src={imageSrc}
          />
        </div>
      ) : (
        <div className='flex h-[190px] w-full shrink-0 items-center justify-center rounded-t-md bg-[#f0f4f8] sm:h-[220px] lg:h-[275px]'>
          <Image
            width={64}
            height={64}
            src={PLACEHOLDER}
            alt='No photo'
            className='opacity-40'
          />
        </div>
      )}

      <div className='listing-card-body flex w-full flex-1 flex-col'>
        <div className='flex flex-1 flex-col space-y-2 px-3 py-2 sm:space-y-3 sm:px-4'>
          <div className='flex w-full flex-row flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3'>
            <div className='flex flex-row items-center'>
              {Array.from({ length: 5 }, (_, starIndex) => (
                <FaStar
                  key={starIndex}
                  size={14}
                  className='sm:hidden'
                  color={starIndex < rating ? '#e1ba00' : '#D3D3D3'}
                />
              ))}
              {Array.from({ length: 5 }, (_, starIndex) => (
                <FaStar
                  key={`lg-${starIndex}`}
                  size={18}
                  className='hidden sm:inline'
                  color={starIndex < rating ? '#e1ba00' : '#D3D3D3'}
                />
              ))}
              <span className='ml-1.5 text-xs opacity-50 sm:ml-2 sm:text-sm'>
                {rating ? rating.toFixed(1) : '0.0'}
              </span>
            </div>
            <span className='text-xs opacity-50 sm:text-sm'>
              {reviewCount > 1
                ? `(${reviewCount} Reviews)`
                : `(${reviewCount || 0} Review)`}
            </span>
            <div className='ml-auto scale-90 origin-right sm:scale-100'>
              <ListingCardViewCount listing={listing} />
            </div>
          </div>

          <div className='listing-card-meta flex w-full items-start justify-between gap-2 sm:gap-3'>
            <div className='flex min-w-0 flex-1 flex-col items-start gap-1 text-left'>
              <span className='listing-card-title line-clamp-2 w-full break-words text-left text-sm font-medium capitalize text-[#002D4F] sm:text-base lg:text-xl'>
                {truncateTitle(listing.title) || getTypeLabel(listing)}
              </span>
              <p className='listing-card-type w-full text-left text-xs capitalize text-[#002D4F] opacity-70 sm:text-sm'>
                {getTypeLabel(listing)}
              </p>
              <div className='flex w-full flex-row items-start justify-start space-x-2 text-[#002D4F]'>
                <div className='inline-block w-3.5 shrink-0'>
                  <Image width={20} height={20} alt='' src={location.src} />
                </div>
                <div className='listing-card-location min-w-0 break-words text-xs sm:text-sm lg:text-base'>
                  {getLocationLabel(listing) || '—'}
                </div>
              </div>
            </div>
            <ListingCardQrThumb
              listing={listing}
              size={72}
              className='ml-auto shrink-0'
            />
          </div>
        </div>

        <div className='listing-card-footer mt-auto'>
          <div className='box-border my-2 h-0 w-full border-t border-[#969696] sm:my-3 sm:border-t-2' />
          <div className='flex flex-row items-center justify-between gap-2 px-3 pb-3 sm:px-5 sm:pb-4'>
            <div className='flex min-w-0 flex-row items-center gap-2 sm:gap-4'>
              <div className='relative h-10 w-10 shrink-0 overflow-hidden sm:h-[50px] sm:w-[50px]'>
                <Image
                  width={50}
                  height={50}
                  className='listing-card-photo h-full w-full object-cover object-center'
                  alt=''
                  src={getProfileImageSrc(
                    listing?.sellerAvatar || listing?.userId?.profileImage,
                  )}
                  unoptimized
                />
              </div>
              <div className='truncate text-xs font-medium text-[#000000] sm:text-sm lg:text-base'>
                Ref: {getListingRef(listing)}
              </div>
            </div>
            <div className='shrink-0 text-xs font-semibold text-[#000000] sm:text-sm lg:text-lg'>
              AED{' '}
              {isOffPlanListing(listing)
                ? formatListingCardPrice(listing)
                : formatCardPrice(listing.price)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
