import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ViewerDetails from '@/components/modules/SellerProfile/ViewerDetails'
import { EyeIcon } from '@/components/Icons'
import { getTokenFromCookie } from '../../../utils/helper'
import customAxios from '../../../utils/apis/apis'

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })?.format(date)
  } catch (error) {
    return ''
  }
}

export const AllViewingRequestsTab = () => {
  const [viewingRequests, setViewingRequests] = useState([])
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const token = getTokenFromCookie()

  const fetchBookings = async (token) => {
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/bookings`
      )
      setViewingRequests(response.data)
    } catch (error) {
      toast.error('Error fetching bookings.')
    }
  }

  useEffect(() => {
    if (token) {
      fetchBookings(token)
    }
  }, [token])

  const handleViewDetails = (bookingId) => {
    setSelectedBookingId(bookingId)
    setOpenDetails(true)
  }

  return (
    <div className='md:py-5 w-full bg-white text-prussianBlue/40 flex flex-col items-center border-b border-border'>
      <ToastContainer />
      <div className='w-full'>
        <div className='w-full primary-gradient flex items-center justify-between border border-black rounded py-3 px-4 overflow-x-auto'>
          <h2 className='text-white font-semibold sm:text-base text-sm lg:text-lg'>
            All Viewing Requests
          </h2>
        </div>
        <div className='relative w-full py-5'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-6 py-3 text-left text-sm whitespace-nowrap font-bold text-black tracking-wider'>
                    Full Name
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold whitespace-nowrap text-black tracking-wider'>
                    Appointment Date Time
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-bold text-black tracking-wider'></th>
                </tr>
              </thead>
              <tbody className='bg-transparent divide-y divide-gray-200'>
                {viewingRequests.length === 0 ? (
                  <tr>
                    <td colSpan='6' className='h-40'>
                      <div className='flex h-full items-center justify-center'>
                        <h1 className='sm:text-lg text-sm font-semibold'>
                          No Requests Found!
                        </h1>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {viewingRequests?.map((viewer, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {viewer?.brokerId?.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {viewer?.brokerId?.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatDate(viewer?.date)}
                          {viewer?.timeSlot?.time}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <button className='text-blue border rounded-full border-green px-4'>
                            Open
                          </button>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-xs flex items-center space-x-2'>
                          <span
                            onClick={() => handleViewDetails(viewer.uuid)}
                            className='cursor-pointer'
                          >
                            <EyeIcon className='h-5 w-5 text-gray-500' />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {openDetails && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
              <ViewerDetails
                bookingId={selectedBookingId}
                handleClose={() => setOpenDetails(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
