import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import customAxios from '../../utils/apis/apis'

const times = [
  { time: '08:00 AM', isBooked: false },
  { time: '09:00 AM', isBooked: false },
  { time: '10:00 AM', isBooked: false },
  { time: '11:00 AM', isBooked: false },
  { time: '12:00 PM', isBooked: false },
  { time: '01:00 PM', isBooked: false },
  { time: '02:00 PM', isBooked: false },
  { time: '03:00 PM', isBooked: false },
  { time: '04:00 PM', isBooked: false },
  { time: '05:00 PM', isBooked: false },
  { time: '06:00 PM', isBooked: false },
  { time: '07:00 PM', isBooked: false },
  { time: '08:00 PM', isBooked: false },
  { time: '09:00 PM', isBooked: false },
]

const SlotTabEditModal = ({ disablePastDates, closeModal, id, fetchSlots }) => {
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedTimes, setSelectedTimes] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date()) // Manage selected date

  useEffect(() => {
    // Fetch slots and initial date from backend
    customAxios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slot/${id}`)
      .then((response) => {
        const backendTimes = response?.data?.times || []
        const backendDate = response?.data?.date // Assuming `date` comes from backend

        setTimeSlots(backendTimes)

        if (backendDate) {
          setSelectedDate(new Date(backendDate)) // Initialize calendar with backend date
        }

        // Pre-select non-booked slots
        const preSelected = backendTimes
          .filter((slot) => !slot.isBooked)
          .map((slot) => slot.time)
        setSelectedTimes(preSelected)
      })
  }, [id])

  const handleTimeClick = (time) => {
    // Toggle slot selection
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    )
  }

  const handleSave = () => {
    const newTimeSlots = selectedTimes
      .filter((time) => !timeSlots.some((slot) => slot.time === time)) // New slots
      .map((time) => ({
        time,
        isBooked: false,
      }))

    const updatedExistingSlots = timeSlots
      .map((slot) => {
        if (selectedTimes.includes(slot.time)) {
          return { ...slot, isBooked: false } // Keep selected
        }
        return slot.isBooked === false ? null : slot // Remove deselected `false`
      })
      .filter(Boolean) // Remove null entries

    const finalUpdatedSlots = [...updatedExistingSlots, ...newTimeSlots]

    customAxios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/timeslot/update/${id}`,
        { timeSlots: finalUpdatedSlots, date: selectedDate } // Include updated date
      )
      .then(() => {
        toast.success('Time updated successfully!')
        setTimeSlots(finalUpdatedSlots)
        fetchSlots()
        setSelectedTimes([])
        closeModal()
      })
      .catch((error) => {
        console.error('Error updating times:', error)
        alert('Failed to update times.')
      })
  }

  return (
    <div className='fixed w-full inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-fit flex flex-col gap-6'>
        <h2 className='text-2xl font-semibold'>Edit Slot</h2>
        <div className='h-full w-full flex gap-4 justify-between'>
          <div className='h-full flex flex-col gap-3 w-full max-w-[40%]'>
            <div className='flex flex-col'>
              <label className='block mb-1'>Date</label>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate} // Update selected date
                tileDisabled={({ date }) => disablePastDates(date)}
                className='!w-full border !border-blue/90 rounded-[12px] calender_FV'
              />
            </div>
          </div>
          <div className='flex flex-col h-full gap-14'>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium mb-1'>Available Times</h3>
              <div className='grid grid-cols-3 gap-3'>
                {times.map((time) => {
                  const isBooked =
                    timeSlots.find((slot) => slot.time === time.time)
                      ?.isBooked || false
                  return (
                    <button
                      key={time.time}
                      onClick={() => handleTimeClick(time.time)}
                      className={`border-2 py-2.5 px-6 text-sm lg:text-base rounded-md w-full ${
                        selectedTimes.includes(time.time)
                          ? 'primary-gradient text-white'
                          : 'border-dune/10'
                      } ${
                        isBooked && !selectedTimes.includes(time.time)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={isBooked && !selectedTimes.includes(time.time)}
                    >
                      {time.time}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className='h-full w-full flex justify-between gap-2'>
              <button
                className='w-full primary-gradient text-white p-2 rounded-md'
                onClick={handleSave}
              >
                Update
              </button>
              <button
                className='w-full border-gray-300 border text-black p-2 rounded-md'
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlotTabEditModal
