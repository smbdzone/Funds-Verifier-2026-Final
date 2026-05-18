import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { disableFutureDates } from '../../utils/global-functions/global'

const DateOFBirthModal = ({
  closeModal,
  selectedDate,
  setSelectedDate,
  setDateAgain,
}) => {
  const handleDateSelect = (date) => {
    // Normalize the date by ensuring it uses local time (set hours to noon)
    const normalizedDate = new Date(date.setHours(12, 0, 0, 0))

    // Format the date to a readable string
    setDateAgain(normalizedDate)
    setSelectedDate(normalizedDate.toLocaleDateString('en-US'))

    closeModal()
  }

  return (
    <div className='fixed w-full inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[600px] flex flex-col gap-6'>
        <div className='flex justify-between'>
          <h2 className='text-2xl font-semibold'>Select Date of Birth</h2>
          <p className='text-base cursor-pointer' onClick={closeModal}>
            x
          </p>
        </div>
        <div>
          <div className='h-full flex flex-col gap-3 w-full'>
            <div className='flex flex-col'>
              <label className='block mb-1'>Date</label>
              <Calendar
                value={selectedDate}
                onChange={handleDateSelect} // Update selected date
                tileDisabled={({ date }) => disableFutureDates(date)}
                className='!w-full border !border-blue/90 rounded-[12px] calender_FV'
                defaultView='year' // Start with the year view
                showNavigation // Enable navigation between views
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateOFBirthModal
