'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { CloseIcon } from '@/components/Icons'
import { getCsrfHeaders } from '@/utils/csrf'
import { useProfile } from '@/context/UserContext'

const GOLD =
  'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)'

const inputClass =
  'w-full rounded-md border border-[#A2913E]/70 px-3 py-2 text-sm text-[#002d4f] outline-none focus:border-[#A2913E]'

export default function PrivateListingRequestModal({ listing, onClose }) {
  const { user } = useProfile()
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!listing) return
    setName(user?.name || user?.displayName || '')
    setEmail(user?.email || '')
    setPhone(user?.phone || user?.phoneNumber || '')
  }, [listing, user])

  if (!listing || !mounted) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const csrfHeaders = await getCsrfHeaders()
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/listings/private-view-request`,
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          listingUuid: listing.uuid || listing.slug || listing.id,
          assetType: listing.assetType || '',
        },
        { headers: csrfHeaders, withCredentials: true },
      )
      toast.success(
        res.data?.message ||
          'We have received your request and will be in touch.',
      )
      onClose?.()
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          'Could not send your request. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return createPortal(
    <div
      className='fixed inset-0 z-[90] flex items-center justify-center px-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='private-listing-request-title'
    >
      <button
        type='button'
        aria-label='Close'
        className='absolute inset-0 bg-[#002d4f]/55 backdrop-blur-[2px]'
        onClick={onClose}
      />
      <div className='relative w-full max-w-[440px] overflow-hidden rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-sm bg-white shadow-[0_24px_60px_rgba(0,45,79,0.28)]'>
        <div className='h-1.5 w-full bg-gradient-to-r from-[#002d4f] via-[#A2913E] to-[#d4c07a]' />
        <div className='flex justify-end px-5 pt-4'>
          <button
            type='button'
            onClick={onClose}
            className='cursor-pointer p-1 text-[#002d4f]/70 transition hover:text-[#002d4f]'
            aria-label='Close dialog'
          >
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='px-6 pb-6 pt-1'>
          <h2
            id='private-listing-request-title'
            className='mb-1 text-lg font-semibold text-[#002d4f]'
          >
            This listing is private
          </h2>
          <p className='mb-4 text-sm leading-5 text-[#002d4f]/75'>
            Request to see{' '}
            <span className='font-medium'>
              {listing.title || 'this listing'}
            </span>
            . We’ll send your details to the seller and Funds Verifier.
          </p>
          <div className='space-y-3'>
            <input
              type='text'
              name='name'
              required
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <input
              type='email'
              name='email'
              required
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type='tel'
              name='phone'
              required
              placeholder='Phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type='submit'
            disabled={submitting}
            className='mt-5 w-full rounded-md px-4 py-2.5 text-sm font-semibold text-[#002d4f] disabled:opacity-60'
            style={{ background: GOLD }}
          >
            {submitting ? 'Sending…' : 'Submit request'}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}
