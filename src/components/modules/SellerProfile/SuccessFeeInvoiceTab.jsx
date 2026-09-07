'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { EyeIcon } from '@/components/Icons'
import ViewerDetails from '@/components/modules/SellerProfile/ViewerDetails'
import customAxios from '@/utils/apis/apis'

const formatDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString))
  } catch {
    return '—'
  }
}

export const SuccessFeeInvoiceTab = () => {
  const [bookings, setBookings] = useState([])
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  const fetchBookings = async () => {
    try {
      const response = await customAxios.get('/arrange-view/bookings')
      const list = Array.isArray(response.data) ? response.data : []
      setBookings(list)
    } catch {
      toast.error('Could not load your transactions.')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const feeBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const details = booking?.productData?.transferDocuments
        return Boolean(details?.assetTransferDocument)
      }),
    [bookings],
  )

  const handleView = (bookingId) => {
    setSelectedBookingId(bookingId)
    setOpenDetails(true)
  }

  return (
    <div className='md:py-5 w-full bg-white text-prussianBlue/40 flex flex-col items-center border-b border-border'>
      <div className='w-full'>
        <div className='w-full primary-gradient flex items-center justify-between border border-black rounded py-3 px-4'>
          <h2 className='text-white font-semibold sm:text-base text-sm lg:text-lg'>
            Success Fee Invoice
          </h2>
        </div>
        <p className='mt-3 text-sm text-slate-600'>
          Pay the success fee from your email link, then upload your payment
          invoice here for the trustee.
        </p>
        <div className='relative w-full py-5'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black'>
                    Asset
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black'>
                    Success fee
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black'>
                    Viewing
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black'>
                    Invoice status
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black' />
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {feeBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-8 text-center text-sm text-gray-500'
                    >
                      No success fee due yet. You will see items here after the
                      trustee sends transfer documents.
                    </td>
                  </tr>
                ) : (
                  feeBookings.map((booking) => {
                    const td = booking?.productData?.transferDocuments || {}
                    const hasInvoice = Boolean(td.PaymentProof)
                    return (
                      <tr key={booking.uuid}>
                        <td className='px-6 py-4 text-sm text-prussianBlue'>
                          {booking.listingTitle || booking?.productData?.title || '—'}
                        </td>
                        <td className='px-6 py-4 text-sm text-prussianBlue'>
                          {td.successFee
                            ? `AED ${Number(td.successFee).toLocaleString()}`
                            : '—'}
                        </td>
                        <td className='px-6 py-4 text-sm text-prussianBlue'>
                          {booking.date
                            ? `${formatDate(booking.date)}${booking.timeSlot?.time ? ` · ${booking.timeSlot.time}` : ''}`
                            : '—'}
                        </td>
                        <td className='px-6 py-4 text-sm text-prussianBlue'>
                          {hasInvoice ? 'Submitted' : 'Upload required'}
                        </td>
                        <td className='px-6 py-4'>
                          <button
                            type='button'
                            onClick={() => handleView(booking.uuid)}
                            className='text-gray-500 hover:text-gray-700'
                            aria-label='Open details'
                          >
                            <EyeIcon className='h-5 w-5' />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {openDetails && selectedBookingId ? (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
              <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white'>
                <ViewerDetails
                  bookingId={selectedBookingId}
                  handleClose={() => {
                    setOpenDetails(false)
                    setSelectedBookingId(null)
                    fetchBookings()
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default SuccessFeeInvoiceTab
