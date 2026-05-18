import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import Image from 'next/image'
import axios from 'axios'
import 'react-calendar/dist/Calendar.css'
import './calender.css'
import customAxios from '../../utils/apis/apis'

const initialAvailableTimes = [
  '09:00 AM',
  '07:00 PM',
  '03:00 AM',
  '08:00 PM',
  '05:00 PM',
]

const getTomorrow = () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  return new Date(tomorrow.setHours(0, 0, 0, 0)) // Start of tomorrow
}

const CalenderModal = ({ isOpen, onClose, setFormData, parent }) => {
  const [selectedDate, setSelectedDate] = useState(getTomorrow()) // Set default date to tomorrow
  const [selectedTime, setSelectedTime] = useState(null)
  const [existingBookings, setExistingBookings] = useState([])

  useEffect(() => {
    if (isOpen) {
      fetchBookingsForDate(selectedDate)
    }
  }, [isOpen, selectedDate])

  const fetchBookingsForDate = async (date) => {
    try {
      const response = await customAxios.get(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/request3d/walkthrough-requests?dateTime=${date.toISOString()}`
      )
      setExistingBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleSubmit = () => {
    if (selectedTime) {
      const dateTime = new Date(
        `${selectedDate.toDateString()} ${selectedTime}`
      )

      if (parent === 'evaluation') {
        setFormData(
          'evaluationDateTime',
          dateTime // Set evaluationDateTime if parent is 'evaluation'
        )
      } else {
        setFormData((prevData) => ({ ...prevData, dateTime })) // Set default dateTime
      }

      onClose() // Close the modal
    }
  }

  const getAvailableTimes = () => {
    const bookedTimes = existingBookings
      .map((booking) => {
        const bookingDate = new Date(booking.dateTime)
        if (bookingDate.toDateString() === selectedDate.toDateString()) {
          return bookingDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        }
        return null
      })
      .filter((time) => time !== null) // Filter out null values

    return initialAvailableTimes.filter((time) => !bookedTimes.includes(time))
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='relative bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2 text-[#002D4F]'>
        <div className='absolute top-2 right-2 flex justify-end'>
          <button
            className='px-4 py-2 bg-blue-500 text-prussianBlue rounded'
            onClick={onClose}
            type='button'
          >
            X
          </button>
        </div>
        <h2 className='text-3xl font-semibold mb-4'>Select Date and Time</h2>
        <p className='mb-8'>
          Choose available time & date slot for your appointment with SMB
        </p>
        <div className='flex flex-col xl:flex-row'>
          <div className='bg-white shadow-md rounded-lg p-2 mb-4 md:mb-0 md:mr-4'>
            <div className='w-full opacity-75'>
              <Calendar
                className={'w-full'}
                onChange={handleDateChange}
                value={selectedDate}
                minDate={getTomorrow()} // Disable today and past dates
              />
            </div>
          </div>
          <div className='flex-grow'>
            <div className='flex flex-col relative mb-4'>
              <input
                type='text'
                className='w-full p-3 border rounded text-[#B7A55E] border-3 border-[#B7A55E]'
                placeholder='Date & Time'
                value={`${selectedDate.toDateString()} ${selectedTime || ''}`}
                readOnly
              />
              <Image
                src='/assets/images/clock.png'
                alt='Clock Icon'
                width={20}
                height={20}
                className='absolute right-2 top-3'
              />
            </div>
            <div className='flex flex-wrap'>
              {getAvailableTimes()?.map((time) => (
                <button
                  type='button'
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`m-2 px-8 py-2 border border-[#B7A55E] text-[#B7A55E] rounded ${
                    selectedTime === time
                      ? 'bg-blue-500 text-white btn-gradient'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className='flex justify-center mt-4'>
          <button
            onClick={handleSubmit}
            className={`btn-gradient text-white px-8 py-2 font-bold ${
              !selectedTime ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={!selectedTime}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default CalenderModal
