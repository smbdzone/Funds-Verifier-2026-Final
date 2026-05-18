'use client'

import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ViewerDetails from '@/components/modules/SellerProfile/ViewerDetails'
import { EyeIcon, DeleteIcon } from '@/components/Icons'
import customAxios from '../../../utils/apis/apis'

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

const statusBadge = (status) => {
  const s = (status || 'open').toString().toLowerCase()
  if (s.includes('confirm') || s.includes('accept'))
    return 'bg-sky-50 text-sky-800 ring-sky-700/15'
  if (s.includes('cancel') || s.includes('reject'))
    return 'bg-rose-50 text-rose-800 ring-rose-600/15'
  if (s.includes('complete') || s.includes('done'))
    return 'bg-slate-100 text-slate-700 ring-slate-600/10'
  return 'bg-emerald-50 text-emerald-800 ring-emerald-600/15'
}

export const TrusteeViewingRequest = () => {
  const [viewingRequests, setViewingRequests] = useState([])
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

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

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      'Delete this viewing request? This cannot be undone.',
    )
    if (!confirmDelete) return

    try {
      await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/bookings/${bookingId}`,
      )
      setViewingRequests((prev) =>
        prev.filter((request) => request?.uuid !== bookingId),
      )
      toast.success('Viewing request removed.')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete this request.',
      )
    }
  }

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
        <p className='mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base'>
          Review broker bookings, open details, and manage your viewing
          calendar from one place.
        </p>
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
                    className='w-[120px] px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[#002d4f]'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {viewingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='px-6 py-16 text-center'>
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
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusBadge(viewer?.status)}`}
                        >
                          {viewer?.status
                            ? String(viewer.status)
                            : 'Open'}
                        </span>
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
                            onClick={() => handleDeleteBooking(viewer?.uuid)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[#a2913e] transition hover:bg-rose-50 hover:text-rose-700'
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
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${statusBadge(viewer?.status)}`}
                  >
                    {viewer?.status ? String(viewer.status) : 'Open'}
                  </span>
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
                    onClick={() => handleDeleteBooking(viewer?.uuid)}
                    className='rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50'
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
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='viewer-details-title'
            className='relative flex max-h-[min(85vh,841px)] w-full max-w-[595px] flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-slate-900/10'
            onClick={(e) => e.stopPropagation()}
          >
            <ViewerDetails
              bookingId={selectedBookingId}
              handleClose={handleClose}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
