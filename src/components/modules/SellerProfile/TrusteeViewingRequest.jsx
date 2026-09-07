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

const UnderProcessToggle = ({ checked, disabled, onChange }) => (
  <button
    type='button'
    role='switch'
    aria-checked={checked}
    aria-label='Under process'
    disabled={disabled}
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a2913e]/50 ${checked ? 'bg-[#a2913e]' : 'bg-slate-300'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-6' : 'translate-x-1'
        }`}
    />
  </button>
)

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
      setViewingRequests(response.data)
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
    <div className='w-full max-w-7xl mx-auto pb-10'>
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

        {/* Desktop table */}
        <div className='hidden md:block'>
          <div className='overflow-x-auto'>
            <table className='min-w-full border-collapse text-left text-sm'>
              <thead>
                <tr className='border-b border-[#002d4f]/15 bg-gradient-to-r from-[#eef4fa] via-[#e2ecf6] to-[#eef4fa]'>
                  <th
                    scope='col'
                    className='whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#002d4f]'
                  >
                    Broker
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#002d4f]'
                  >
                    Email
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#002d4f]'
                  >
                    Appointment
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#002d4f]'
                  >
                    Status
                  </th>
                  <th
                    scope='col'
                    className='whitespace-nowrap px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#002d4f]'
                  >
                    Under process
                  </th>
                  <th
                    scope='col'
                    className='w-[120px] px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[#002d4f]'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {viewingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='px-6 py-16 text-center'>
                      <p className='text-base font-medium text-slate-700'>
                        No viewing requests yet
                      </p>
                      <p className='mx-auto mt-2 max-w-md text-sm text-slate-500'>
                        When brokers book a slot, their requests will appear
                        here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  viewingRequests.map((viewer) => (
                    <tr
                      key={viewer?.uuid}
                      className='transition-colors hover:bg-slate-50/80'
                    >
                      <td className='whitespace-nowrap px-6 py-4'>
                        <span className='font-medium text-slate-900'>
                          {viewer?.brokerId?.name || '—'}
                        </span>
                      </td>
                      <td className='max-w-[220px] truncate px-6 py-4 text-slate-600'>
                        {viewer?.brokerId?.email || '—'}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-slate-600'>
                        <span className='block font-medium text-slate-800'>
                          {formatDate(viewer?.slotId?.date)}
                        </span>
                        <span className='text-xs text-slate-500'>
                          {viewer?.timeSlot?.time || ''}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${viewingBookingStatusBadgeClass(viewer?.status)}`}
                        >
                          {formatViewingBookingStatus(viewer?.status)}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <UnderProcessToggle
                          checked={isViewingBookingUnderProcess(viewer?.status)}
                          disabled={togglingId === viewer?.uuid}
                          onChange={() => handleToggleUnderProcess(viewer)}
                        />
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right'>
                        <div className='inline-flex items-center justify-end gap-1'>
                          <button
                            type='button'
                            onClick={() => handleViewDetails(viewer?.uuid)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#a2913e]/40 hover:bg-[#a2913e]/5 hover:text-[#002d4f]'
                            title='View details'
                            aria-label='View booking details'
                          >
                            <EyeIcon className='h-5 w-5' />
                          </button>
                          <button
                            type='button'
                            onClick={() => openDeleteDialog(viewer?.uuid)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[#a2913e] transition hover:bg-[#a2913e]/10 hover:text-[#002d4f]'
                            title='Delete request'
                            aria-label='Delete viewing request'
                          >
                            <DeleteIcon className='h-5 w-5' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className='divide-y divide-slate-100 md:hidden'>
          {viewingRequests.length === 0 ? (
            <div className='px-5 py-14 text-center'>
              <p className='text-base font-medium text-slate-700'>
                No viewing requests yet
              </p>
              <p className='mx-auto mt-2 max-w-xs text-sm text-slate-500'>
                Bookings from brokers will show up here.
              </p>
            </div>
          ) : (
            viewingRequests.map((viewer) => (
              <article
                key={viewer?.uuid}
                className='space-y-3 px-5 py-4 active:bg-slate-50/50'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-base font-semibold text-[#002d4f]'>
                      {viewer?.brokerId?.name || '—'}
                    </p>
                    <p className='truncate text-sm text-slate-600'>
                      {viewer?.brokerId?.email || '—'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${viewingBookingStatusBadgeClass(viewer?.status)}`}
                  >
                    {formatViewingBookingStatus(viewer?.status)}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                      Under process
                    </p>
                    <p className='mt-0.5 text-sm text-slate-700'>
                      {isViewingBookingUnderProcess(viewer?.status)
                        ? 'Seller price locked'
                        : 'Off'}
                    </p>
                  </div>
                  <UnderProcessToggle
                    checked={isViewingBookingUnderProcess(viewer?.status)}
                    disabled={togglingId === viewer?.uuid}
                    onChange={() => handleToggleUnderProcess(viewer)}
                  />
                </div>
                <dl className='grid grid-cols-2 gap-2 text-sm'>
                  <div className='rounded-lg bg-slate-50 px-3 py-2'>
                    <dt className='text-[11px] font-medium uppercase tracking-wide text-slate-500'>
                      Date
                    </dt>
                    <dd className='mt-0.5 font-medium text-slate-800'>
                      {formatDate(viewer?.slotId?.date)}
                    </dd>
                  </div>
                  <div className='rounded-lg bg-slate-50 px-3 py-2'>
                    <dt className='text-[11px] font-medium uppercase tracking-wide text-slate-500'>
                      Time
                    </dt>
                    <dd className='mt-0.5 font-medium text-slate-800'>
                      {viewer?.timeSlot?.time || '—'}
                    </dd>
                  </div>
                </dl>
                <div className='flex gap-2 pt-1'>
                  <button
                    type='button'
                    onClick={() => handleViewDetails(viewer?.uuid)}
                    className='flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-[#002d4f] shadow-sm transition hover:border-[#a2913e]/50 hover:bg-slate-50'
                  >
                    <EyeIcon className='h-4 w-4' />
                    Details
                  </button>
                  <button
                    type='button'
                    onClick={() => openDeleteDialog(viewer?.uuid)}
                    className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#002d4f] transition hover:border-[#a2913e]/50 hover:bg-[#a2913e]/5'
                    aria-label='Delete'
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
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
            className='relative w-full max-w-[595px] max-h-[min(85vh,841px)] overflow-y-auto rounded-xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-slate-900/10'
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
                    {pendingDeleteRequest?.brokerId?.name || 'Broker'}
                  </p>
                  <p className='mt-1 text-slate-600'>
                    {formatDate(pendingDeleteRequest?.slotId?.date)}
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
