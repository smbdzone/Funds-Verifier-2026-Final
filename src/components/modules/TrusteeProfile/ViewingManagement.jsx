import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import ConfirmationForm from './ConfirmationForm'
import Image from 'next/image'
import customAxios from '@/utils/apis/apis'

// Function to format the date
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

export const ViewingManagement = () => {
  const [viewingRequests, setViewingRequests] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/bookings`
      )
      setViewingRequests(response.data)
    } catch (error) {
      console.error('Error fetching bookings.')
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const toLocalDateString = (date) => {
    const d = new Date(date)
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    )
  }

  const allDate = viewingRequests
    .map((request) => {
      if (request.slotId?.date) {
        return toLocalDateString(request.slotId.date)
      }
      return null
    })
    .filter(Boolean)

  const dateTimeSlots = viewingRequests.reduce((acc, curr) => {
    const date = curr.slotId?.date
    const time = curr.timeSlot?.time
    const title = curr.productData?.title
    const id = curr.uuid
    const buyerAttended = curr.buyerAttended
    const sellerAttended = curr.sellerAttended
    const comment = curr.comment

    if (date) {
      const normalizedDate = toLocalDateString(date)
      if (!acc[normalizedDate]) {
        acc[normalizedDate] = { times: [], title: '', id: '' }
      }

      if (time) acc[normalizedDate].times.push(time)
      if (title) acc[normalizedDate].title = title
      if (id) acc[normalizedDate].id = id
      if (buyerAttended) acc[normalizedDate].buyerAttended = buyerAttended
      if (sellerAttended) acc[normalizedDate].sellerAttended = sellerAttended
      if (comment) acc[normalizedDate].comment = comment
    }

    return acc
  }, {})

  const onDateClick = (date) => {
    const dateString = toLocalDateString(date)
    setSelectedDate(dateString)
    setAvailableTimes(dateTimeSlots[dateString] || [])
  }

  const renderTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const selectedDateString = date.toISOString().split('T')[0] // Normalize calendar date
      return allDate.includes(selectedDateString) ? 'highlight' : null
    }
    return null
  }

  return (
    <>
      <div className='primary-gradient flex items-center justify-between border border-black rounded py-3 px-4 overflow-x-auto'>
        <h2 className='text-white font-semibold text-[18px]'>
          Viewing Management
        </h2>
      </div>

      <div className='mt-10'>
        <Calendar
          onClickDay={onDateClick}
          tileClassName={renderTileClassName}
          className='!w-full border !border-blue/90 rounded-[12px] calender_FV'
        />
        {selectedDate && (
          <div className='dropdown'>
            <h3>
              Available Time Slots for{' '}
              <span className='font-medium'>{formatDate(selectedDate)}</span>
              <span className='font-medium ml-1'> {availableTimes?.title}</span>
            </h3>
            <ul>
              {availableTimes?.times?.length > 0 ? (
                availableTimes.times.map((time, index) => (
                  <li className='' key={index}>
                    {time}
                  </li>
                ))
              ) : (
                <li>No times available</li>
              )}
            </ul>
          </div>
        )}
        <style>{`
          .highlight {
            background: linear-gradient(to right, #002d4f 0%, #5085ad 31%, #002d4f 64%, #5085ad 97%) !important;
            border-radius: 8px;
            color: white;
          }
          .dropdown {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
        `}</style>
      </div>

      {availableTimes.sellerAttended &&
      availableTimes.buyerAttended &&
      availableTimes.comment ? (
        <div className='space-y-3 mt-10'>
          <div className='primary-gradient flex items-center justify-between border border-black rounded py-3 px-4 overflow-x-auto'>
            <h2 className='text-white font-semibold text-[18px]'>Details</h2>
          </div>
          <p className='flex font-medium gap-x-10'>
            Seller Attended
            {availableTimes.sellerAttended === 'true' ? (
              <span className='ml-1'>
                <Image
                  src='/icons/tick.svg'
                  alt='tick'
                  height={20}
                  width={20}
                />
              </span>
            ) : (
              <span className='ml-1'>
                <Image
                  src='/icons/red-cross.png'
                  alt='tick'
                  height={20}
                  width={20}
                />
              </span>
            )}
          </p>
          <p className='flex font-medium gap-x-10'>
            Buyer Attended
            {availableTimes.buyerAttended === 'true' ? (
              <span className='ml-1'>
                <Image
                  src='/icons/tick.svg'
                  alt='tick'
                  height={20}
                  width={20}
                />
              </span>
            ) : (
              <span className='ml-1'>
                <Image
                  src='/icons/red-cross.png'
                  alt='tick'
                  height={20}
                  width={20}
                />
              </span>
            )}
          </p>
          <p className='flex font-medium gap-x-10'>Comment:</p>
          {availableTimes.comment ? (
            <p className='text-prussianBlue/60'>{availableTimes.comment}</p>
          ) : (
            <p>No comment</p>
          )}
        </div>
      ) : (
        availableTimes?.id && <ConfirmationForm id={availableTimes?.id} />
      )}
    </>
  )
}
