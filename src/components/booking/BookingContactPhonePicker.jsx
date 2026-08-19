'use client'

import { useEffect, useMemo, useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

function normalizePhone(value) {
  if (!value) return ''
  return String(value).replace(/\s+/g, '').trim()
}

function phonesEqual(a, b) {
  const left = normalizePhone(a)
  const right = normalizePhone(b)
  if (!left || !right) return false
  return left === right || left.replace(/^\+/, '') === right.replace(/^\+/, '')
}

/**
 * Choose which phone should receive booking/asset updates:
 * UAE Pass number vs listing mobile (no custom number).
 */
export default function BookingContactPhonePicker({
  uaePassPhone = '',
  listingPhone = '',
  value = '',
  onChange,
  idPrefix = 'booking-phone',
  assetLabel = 'this asset',
}) {
  const uae = normalizePhone(uaePassPhone)
  const listing = normalizePhone(listingPhone)
  const listingIsDistinct = Boolean(
    listing && (!uae || !phonesEqual(listing, uae)),
  )
  const hasKnownPhones = Boolean(uae || listingIsDistinct)

  const [source, setSource] = useState(() => {
    if (uae) return 'uae'
    if (listingIsDistinct) return 'listing'
    return 'fallback'
  })
  const [fallbackPhone, setFallbackPhone] = useState(() => {
    if (!hasKnownPhones && value) return value
    return ''
  })

  useEffect(() => {
    setSource((prev) => {
      if (prev === 'listing' && !listingIsDistinct) {
        return uae ? 'uae' : 'fallback'
      }
      if (prev === 'uae' && !uae) {
        return listingIsDistinct ? 'listing' : 'fallback'
      }
      if (prev === 'fallback' && hasKnownPhones) {
        return uae ? 'uae' : 'listing'
      }
      return prev
    })
  }, [uae, listingIsDistinct, hasKnownPhones])

  const selectedPhone = useMemo(() => {
    if (source === 'uae') return uae
    if (source === 'listing') return listing
    return normalizePhone(fallbackPhone)
  }, [source, uae, listing, fallbackPhone])

  useEffect(() => {
    onChange?.(selectedPhone || '')
    // Parent stores the chosen contact phone; do not depend on value/onChange identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPhone])

  return (
    <div className='flex w-full flex-col md:col-span-2'>
      <label className='mb-1 text-xl'>Phone Number</label>
      <p className='mb-3 text-sm text-[#002D4F]/80'>
        Which number do you want to receive information regarding {assetLabel}?
      </p>

      <div className='space-y-3 rounded border border-[#d0d5db] p-3'>
        {uae ? (
          <label
            className='flex cursor-pointer items-start gap-3'
            htmlFor={`${idPrefix}-uae`}
          >
            <input
              id={`${idPrefix}-uae`}
              type='radio'
              name={`${idPrefix}-source`}
              className='mt-1 h-4 w-4 accent-[#c4a35a]'
              checked={source === 'uae'}
              onChange={() => setSource('uae')}
            />
            <span>
              <span className='block font-medium'>UAE Pass number</span>
              <span className='mt-0.5 block text-sm opacity-80'>{uae}</span>
            </span>
          </label>
        ) : null}

        {listingIsDistinct ? (
          <label
            className='flex cursor-pointer items-start gap-3'
            htmlFor={`${idPrefix}-listing`}
          >
            <input
              id={`${idPrefix}-listing`}
              type='radio'
              name={`${idPrefix}-source`}
              className='mt-1 h-4 w-4 accent-[#c4a35a]'
              checked={source === 'listing'}
              onChange={() => setSource('listing')}
            />
            <span>
              <span className='block font-medium'>Listing mobile number</span>
              <span className='mt-0.5 block text-sm opacity-80'>{listing}</span>
            </span>
          </label>
        ) : null}

        {selectedPhone ? (
          <div className='mt-2 rounded bg-[#f5f0e8] px-3 py-2 text-sm text-[#002d4f]'>
            <span className='font-medium'>Selected: </span>
            <span className='font-semibold'>{selectedPhone}</span>
          </div>
        ) : null}

        {!hasKnownPhones ? (
          <div className='min-w-0 flex-1'>
            <label
              className='mb-2 block font-medium'
              htmlFor={`${idPrefix}-fallback`}
            >
              Enter mobile number
            </label>
            <PhoneInput
              id={`${idPrefix}-fallback`}
              international
              defaultCountry='AE'
              value={fallbackPhone || undefined}
              onChange={(phoneValue) => {
                setSource('fallback')
                setFallbackPhone(phoneValue || '')
              }}
              className='w-full rounded border p-2'
              placeholder='Enter phone number'
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
