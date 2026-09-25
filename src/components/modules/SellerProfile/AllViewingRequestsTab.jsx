'use client'

import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ViewerDetails from '@/components/modules/SellerProfile/ViewerDetails'
import { EyeIcon } from '@/components/Icons'
import { getTokenFromCookie } from '../../../utils/helper'
import customAxios from '../../../utils/apis/apis'
import {
  formatViewingBookingStatus,
  viewingBookingStatusBadgeClass,
} from '@/libs/bookingViewingStatus'

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return '—'
  }
}

const formatAssignment = (value) => {
  if (value === 'fv_admin') return 'FV Admin'
  return 'Trustee'
}

const Field = ({ label, children }) => (
  <div className='min-w-0'>
    <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
      {label}
    </p>
    <div className='mt-1 text-sm font-medium text-[#002d4f]'>{children}</div>
  </div>
)

export const AllViewingRequestsTab = () => {
  const [viewingRequests, setViewingRequests] = useState([])
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = getTokenFromCookie()

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/bookings`,
      )
      setViewingRequests(Array.isArray(response.data) ? response.data : [])
    } catch {
      setViewingRequests([])
      toast.error('Error fetching bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchBookings()
    } else {
      setLoading(false)
      setViewingRequests([])
    }
  }, [token])

  useEffect(() => {
    if (!openDetails) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [openDetails])

  const handleViewDetails = (bookingId) => {
    setSelectedBookingId(bookingId)
    setOpenDetails(true)
  }

  const handleClose = () => {
    setOpenDetails(false)
    setSelectedBookingId(null)
  }

  return (
    <div className='flex w-full flex-col items-center border-b border-border bg-white text-[#002d4f] md:py-5'>
      <ToastContainer />
      <div className='w-full'>
        <div className='primary-gradient flex items-center justify-between rounded border border-black px-4 py-3'>
          <h2 className='text-sm font-semibold text-white sm:text-base lg:text-lg'>
            All Viewing Requests
          </h2>
        </div>

        <div className='relative w-full py-5'>
          {loading ? (
            <div className='flex h-40 items-center justify-center rounded-xl border border-slate-200'>
              <p className='text-sm font-semibold text-slate-500 sm:text-lg'>
                Loading viewing requests...
              </p>
            </div>
          ) : viewingRequests.length === 0 ? (
            <div className='flex h-40 items-center justify-center rounded-xl border border-slate-200'>
              <h1 className='text-sm font-semibold sm:text-lg'>
                No Requests Found!
              </h1>
            </div>
          ) : (
            <div className='space-y-3'>
              <div className='hidden items-center gap-4 rounded-xl bg-gradient-to-r from-[#eef4fa] via-[#e2ecf6] to-[#eef4fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#002d4f] lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_88px]'>
                <span>Listing</span>
                <span>Buyer</span>
                <span>Seller</span>
                <span>Date</span>
                <span>Assignment</span>
                <span>Status</span>
                <span className='text-right'>Action</span>
              </div>

              {viewingRequests.map((viewer) => {
                const listingName =
                  viewer?.listingTitle ||
                  viewer?.productData?.title ||
                  '—'
                const buyerName =
                  viewer?.buyerName || viewer?.brokerId?.name || '—'
                const sellerName =
                  viewer?.sellerName || viewer?.assetHolder?.name || '—'
                const dateLabel = formatDate(
                  viewer?.date || viewer?.slotId?.date,
                )
                const timeLabel = viewer?.timeSlot?.time || ''

                return (
                  <article
                    key={viewer?.uuid}
                    className='rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#a2913e]/40 hover:shadow-md sm:px-5'
                  >
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_88px] lg:items-center lg:gap-4'>
                      <Field label='Listing'>
                        <p className='break-words whitespace-normal leading-snug'>
                          {listingName}
                        </p>
                        {viewer?.assetType ? (
                          <p className='mt-0.5 break-words text-xs font-normal text-slate-500'>
                            {viewer.assetType}
                          </p>
                        ) : null}
                      </Field>

                      <Field label='Buyer'>
                        <p className='break-words whitespace-normal leading-snug'>
                          {buyerName}
                        </p>
                      </Field>

                      <Field label='Seller'>
                        <p className='break-words whitespace-normal leading-snug'>
                          {sellerName}
                        </p>
                      </Field>

                      <Field label='Date'>
                        <p className='whitespace-normal'>{dateLabel}</p>
                        {timeLabel ? (
                          <p className='mt-0.5 text-xs font-normal text-slate-500'>
                            {timeLabel}
                          </p>
                        ) : null}
                      </Field>

                      <Field label='Assignment'>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${viewer?.viewAssignedTo === 'fv_admin'
                            ? 'primary-gradient text-white'
                            : 'bg-slate-100 text-slate-700'
                            }`}
                        >
                          {formatAssignment(viewer?.viewAssignedTo)}
                        </span>
                      </Field>

                      <Field label='Status'>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${viewingBookingStatusBadgeClass(
                            viewer?.status,
                          )}`}
                        >
                          {formatViewingBookingStatus(viewer?.status)}
                        </span>
                      </Field>

                      <div className='flex items-end justify-start lg:items-center lg:justify-end'>
                        <button
                          type='button'
                          onClick={() => handleViewDetails(viewer?.uuid)}
                          className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#a2913e]/50 hover:bg-[#a2913e]/5 hover:text-[#002d4f]'
                          aria-label='View details'
                        >
                          <EyeIcon className='h-5 w-5' />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {openDetails ? (
            <div
              className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-6'
              role='presentation'
              onClick={(e) => {
                if (e.target === e.currentTarget) handleClose()
              }}
            >
              <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='viewer-details-title'
                className='relative max-h-[min(90vh,920px)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-slate-900/10'
              >
                <ViewerDetails
                  bookingId={selectedBookingId}
                  handleClose={handleClose}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
