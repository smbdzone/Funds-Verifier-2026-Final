'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { EyeIcon, DeleteIcon } from '@/components/Icons'
import customAxios from '../../../utils/apis/apis'
import {
  formatViewingBookingStatus,
  isViewingBookingUnderProcess,
  viewingBookingStatusBadgeClass,
} from '@/libs/bookingViewingStatus'

const ViewerDetails = dynamic(
  () => import('@/components/modules/SellerProfile/ViewerDetails'),
  { ssr: false },
)

const ViewerDetailsErrorBoundary = dynamic(
  () =>
    import('@/components/modules/SellerProfile/ViewerDetailsErrorBoundary').then(
      (module) => ({ default: module.ViewerDetailsErrorBoundary }),
    ),
  { ssr: false },
)

const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
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

const UnderProcessToggle = ({ checked, disabled, onChange }) => (
  <button
    type='button'
    role='switch'
    aria-checked={checked}
    aria-label='Under process'
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a2913e]/50 ${
      checked ? 'bg-[#a2913e]' : 'bg-slate-300'
    } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
)

/** Same card columns as Super Admin, plus Under process for trustee. */
const CARD_COLS =
  'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,0.95fr)_110px]'

function TrusteeViewingRequest() {
  const [viewingRequests, setViewingRequests] = useState([])
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [bookingToDelete, setBookingToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const fetchBookings = async () => {
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/bookings`,
      )
      setViewingRequests(Array.isArray(response.data) ? response.data : [])
    } catch {
      toast.error('Could not load viewing requests.')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleViewDetails = (bookingId) => {
    setSelectedBookingId(bookingId)
    setOpenDetails(true)
  }

  const handleClose = () => {
    setOpenDetails(false)
    setSelectedBookingId(null)
  }

  const openDeleteDialog = (bookingId) => {
    setBookingToDelete(bookingId)
  }

  const closeDeleteDialog = () => {
    if (isDeleting) return
    setBookingToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return

    setIsDeleting(true)
    try {
      await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/bookings/${bookingToDelete}`,
      )
      setViewingRequests((prev) =>
        prev.filter((request) => request?.uuid !== bookingToDelete),
      )
      toast.success('Viewing request removed.')
      setBookingToDelete(null)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete this request.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleUnderProcess = async (viewer) => {
    const bookingId = viewer?.uuid
    if (!bookingId || togglingId) return

    const nextUnderProcess = !isViewingBookingUnderProcess(viewer?.status)
    setTogglingId(bookingId)

    try {
      const response = await customAxios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/bookings/${bookingId}/under-process`,
        { underProcess: nextUnderProcess },
      )

      const nextStatus =
        response?.data?.booking?.status ||
        (nextUnderProcess ? 'under_process' : 'open')

      setViewingRequests((prev) =>
        prev.map((item) =>
          item?.uuid === bookingId ? { ...item, status: nextStatus } : item,
        ),
      )

      toast.success(
        nextUnderProcess ? 'Marked as under process' : 'Marked as open',
      )
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Could not update status.',
      )
    } finally {
      setTogglingId(null)
    }
  }

  const pendingDeleteRequest = viewingRequests.find(
    (request) => request?.uuid === bookingToDelete,
  )

  return (
    <div className='mx-auto w-full max-w-7xl pb-10'>
      <ToastContainer position='top-right' theme='colored' />

      <div className='mb-6 md:mb-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#a2913e]'>
          Trustee
        </p>
        <h1 className='mt-1 text-2xl font-bold tracking-tight text-[#002d4f] md:text-3xl'>
          Viewing requests
        </h1>
      </div>

      <section className='overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5'>
        <div className='primary-gradient flex flex-col gap-1 border-b border-white/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <div>
            <h2 className='text-base font-semibold text-white sm:text-lg'>
              All requests
            </h2>
            <p className='mt-0.5 text-xs text-white/75 sm:text-sm'>
              {viewingRequests.length}{' '}
              {viewingRequests.length === 1 ? 'booking' : 'bookings'} total
            </p>
          </div>
        </div>

        <div className='space-y-3 p-4 sm:p-5'>
          {viewingRequests.length === 0 ? (
            <div className='px-2 py-16 text-center'>
              <p className='text-base font-medium text-slate-700'>
                No viewing requests yet
              </p>
              <p className='mx-auto mt-2 max-w-md text-sm text-slate-500'>
                When buyers book a slot, their requests will appear here.
              </p>
            </div>
          ) : (
            <>
              <div
                className={`hidden items-center gap-4 rounded-xl bg-gradient-to-r from-[#eef4fa] via-[#e2ecf6] to-[#eef4fa] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#002d4f] lg:grid ${CARD_COLS}`}
              >
                <span>Listing</span>
                <span>Buyer</span>
                <span>Seller</span>
                <span>Date</span>
                <span>Assignment</span>
                <span>Status</span>
                <span>Under process</span>
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
                    <div
                      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:items-center lg:gap-4 ${CARD_COLS}`}
                    >
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
                        {viewer?.buyerEmail || viewer?.brokerId?.email ? (
                          <p className='mt-0.5 break-all text-xs font-normal text-slate-500'>
                            {viewer?.buyerEmail || viewer?.brokerId?.email}
                          </p>
                        ) : null}
                      </Field>

                      <Field label='Seller'>
                        <p className='break-words whitespace-normal leading-snug'>
                          {sellerName}
                        </p>
                        {viewer?.sellerEmail || viewer?.assetHolder?.email ? (
                          <p className='mt-0.5 break-all text-xs font-normal text-slate-500'>
                            {viewer?.sellerEmail ||
                              viewer?.assetHolder?.email}
                          </p>
                        ) : null}
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
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            viewer?.viewAssignedTo === 'fv_admin'
                              ? 'primary-gradient text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {formatAssignment(viewer?.viewAssignedTo)}
                        </span>
                      </Field>

                      <Field label='Status'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${viewingBookingStatusBadgeClass(
                            viewer?.status,
                          )}`}
                        >
                          {formatViewingBookingStatus(viewer?.status)}
                        </span>
                      </Field>

                      <Field label='Under process'>
                        <UnderProcessToggle
                          checked={isViewingBookingUnderProcess(
                            viewer?.status,
                          )}
                          disabled={togglingId === viewer?.uuid}
                          onChange={() => handleToggleUnderProcess(viewer)}
                        />
                      </Field>

                      <div className='flex items-end justify-start gap-1 lg:items-center lg:justify-end'>
                        <button
                          type='button'
                          onClick={() => handleViewDetails(viewer?.uuid)}
                          className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#a2913e]/40 hover:bg-[#a2913e]/5 hover:text-[#002d4f]'
                          title='View details'
                          aria-label='View booking details'
                        >
                          <EyeIcon className='h-5 w-5' />
                        </button>
                        <button
                          type='button'
                          onClick={() => openDeleteDialog(viewer?.uuid)}
                          className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[#a2913e] transition hover:bg-[#a2913e]/10 hover:text-[#002d4f]'
                          title='Delete request'
                          aria-label='Delete viewing request'
                        >
                          <DeleteIcon className='h-5 w-5' />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </>
          )}
        </div>
      </section>

      {openDetails ? (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-3 backdrop-blur-md sm:p-6'
          role='presentation'
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='viewer-details-title'
            className='relative max-h-[min(85vh,841px)] w-full max-w-[595px] overflow-y-auto rounded-xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-slate-900/10'
          >
            <ViewerDetailsErrorBoundary onClose={handleClose}>
              <ViewerDetails
                bookingId={selectedBookingId}
                handleClose={handleClose}
              />
            </ViewerDetailsErrorBoundary>
          </div>
        </div>
      ) : null}

      {bookingToDelete ? (
        <div
          className='fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-md'
          role='presentation'
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteDialog()
          }}
        >
          <div
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='delete-viewing-title'
            aria-describedby='delete-viewing-description'
            className='w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-slate-900/10'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='border-b border-slate-100 px-6 py-5'>
              <h2
                id='delete-viewing-title'
                className='text-lg font-semibold text-[#002d4f]'
              >
                Delete viewing request?
              </h2>
              <p
                id='delete-viewing-description'
                className='mt-2 text-sm leading-relaxed text-slate-600'
              >
                This cannot be undone. The booking will be removed and the time
                slot will be available again.
              </p>
              {pendingDeleteRequest ? (
                <div className='mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm'>
                  <p className='font-medium text-slate-900'>
                    {pendingDeleteRequest?.listingTitle ||
                      pendingDeleteRequest?.productData?.title ||
                      'Listing'}
                  </p>
                  <p className='mt-1 text-slate-600'>
                    Buyer:{' '}
                    {pendingDeleteRequest?.buyerName ||
                      pendingDeleteRequest?.brokerId?.name ||
                      '—'}
                  </p>
                  <p className='mt-1 text-slate-600'>
                    {formatDate(
                      pendingDeleteRequest?.date ||
                        pendingDeleteRequest?.slotId?.date,
                    )}
                    {pendingDeleteRequest?.timeSlot?.time
                      ? ` · ${pendingDeleteRequest.timeSlot.time}`
                      : ''}
                  </p>
                </div>
              ) : null}
            </div>
            <div className='flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className='rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className='primary-gradient rounded-xl px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isDeleting ? 'Deleting…' : 'Delete request'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default TrusteeViewingRequest
