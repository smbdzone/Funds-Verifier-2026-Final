'use client'

import React from 'react'
import { CloseIcon } from '@/components/Icons'

/**
 * Golden-styled notice shown after a listing is submitted for review.
 */
const ListingPendingApprovalModal = ({ show, onClose }) => {
  if (!show) return null

  return (
    <>
      <div className='fixed inset-0 z-[100] bg-black/45' onClick={onClose} />
      <div className='fixed inset-0 z-[110] flex items-center justify-center p-4'>
        <div
          className='relative w-full max-w-[420px] overflow-hidden rounded-tl-3xl rounded-bl-3xl rounded-br-3xl rounded-tr-sm border border-[#8D7C3B]/50 bg-white shadow-[0_12px_40px_rgba(141,124,59,0.25)]'
          role='dialog'
          aria-modal='true'
          aria-labelledby='listing-pending-title'
        >
          <div className='h-1.5 w-full bg-[linear-gradient(90deg,#A2913E_0%,#D7C590_35%,#A2913E_70%,#D7C58F_100%)]' />

          <div className='flex justify-end px-5 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='cursor-pointer pr-1'
              aria-label='Close'
            >
              <CloseIcon />
            </button>
          </div>

          <div className='px-6 pb-8 pt-1 sm:px-8'>
            <h2
              id='listing-pending-title'
              className='mb-3 text-center font-montserrat text-[22px] font-medium leading-7 text-[#8D7C3B] sm:text-[25px]'
            >
              Listing Submitted
            </h2>

            <p className='mb-3 text-center text-[15px] leading-6 text-black/80'>
              Your listing has been submitted successfully. It will be evaluated
              by an evaluator or Super Admin.
            </p>
            <p className='mb-3 text-center text-[15px] leading-6 text-black/80'>
              After approval, it will be shown on the site and you will be
              notified.
            </p>
            <p className='mb-6 text-center text-[15px] font-medium leading-6 text-[#8D7C3B]'>
              Review time is typically 24 to 72 hours.
            </p>

            <div className='flex justify-center'>
              <button
                type='button'
                onClick={onClose}
                className='rounded-tl-sm rounded-bl-sm bg-[#8D7C3B] px-10 py-3 text-[15px] font-medium text-white transition hover:bg-[#A2913E]'
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListingPendingApprovalModal
