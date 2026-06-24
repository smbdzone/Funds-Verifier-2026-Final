import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import Image from 'next/image'
import { Loader2Icon } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import './calender.css'
import { toast } from 'react-toastify'
import customAxios from '../../utils/apis/apis'
import { NoSlotsAvailable } from '@/components/global/NoSlotsAvailable'

const getToday = () => {
  const today = new Date()
  return new Date(today.setHours(0, 0, 0, 0))
}

const formatLocalDate = (date) => {
  const correctedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return correctedDate.toISOString().split('T')[0]
}

const Modal2 = ({ isOpen, onClose, formData, setFormData, userUUID }) => {
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [selectedTime, setSelectedTime] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [slots, setSlots] = useState([])
  const [id, setId] = useState()
  const [slotsLoading, setSlotsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && userUUID) {
      fetchBookingsForDate(selectedDate)
    }
  }, [isOpen, selectedDate, userUUID])

  const fetchBookingsForDate = async (date) => {
    if (!userUUID || !date) return

    setSlotsLoading(true)
    setSelectedTime(null)

    try {
      const response = await customAxios.get(
        `/arrange-view/slot-by-date?userUUID=${userUUID}&date=${formatLocalDate(date)}&slotCategory=service`
      )

      setSlots(response?.data[0]?.times || [])
      setId(response?.data[0]?.uuid)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setSlots([])
      toast.error('Could not load available slots')
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleSubmit = () => {
    if (selectedTime) {
      const dateTime = new Date(
        `${selectedDate.toDateString()} ${selectedTime}`
      )

      const newUpdatedSlot = slots.map((slot) => {
        if (slot.time === selectedTime) {
          return { ...slot, isBooked: true }
        }
        return slot
      })

      setFormData((prevData) => ({
        ...prevData,
        dateTime,
        slotTimeslotId: id,
        slotDate: formatLocalDate(selectedDate),
        slotTime: selectedTime,
        slotTimeslots: newUpdatedSlot,
      }))

      try {
        customAxios
          .put(`/arrange-view/timeslot/update/${id}`, { timeSlots: newUpdatedSlot })
          .then(() => {
            toast.success('Time updated successfully!')
            fetchBookingsForDate(selectedDate)
          })
          .catch((error) => {
            console.error('Error updating times:', error)
          })
        onClose()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const availableSlots =
    slots?.filter((slot) => slot && !slot.isBooked) ?? []

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='relative max-h-[90vh] overflow-auto bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2 text-[#002D4F]'>
        <button
          onClick={onClose}
          className='absolute top-2 text-base right-2 bg-blue-500 text-black w-8 h-8 flex justify-center items-center'
        >
          x
        </button>
        <h2 className='text-3xl font-semibold mb-4'>Select Date and Time</h2>
        <p className='mb-8'>
          Choose available time & date slot for your appointment
        </p>
        <div className='flex flex-col xl:flex-row gap-4'>
          <div className='bg-white shadow-md rounded-lg p-2 mb-4 md:mb-0 md:mr-4 flex-shrink-0'>
            <div className='w-full opacity-75'>
              <Calendar
                className={'w-full'}
                onChange={handleDateChange}
                value={selectedDate}
                minDate={getToday()}
              />
            </div>
          </div>
          <div className='flex-grow min-w-0'>
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

            <div className='max-h-60 overflow-y-auto rounded-lg p-2'>
              {!userUUID ? (
                <div className='flex items-center justify-center h-32 text-gray-500'>
                  <p className='text-center text-sm'>
                    Service provider calendar is not available
                  </p>
                </div>
              ) : slotsLoading ? (
                <div className='flex flex-col items-center justify-center h-32 text-gray-500 gap-2'>
                  <Loader2Icon className='w-8 h-8 animate-spin text-[#B7A55E]' />
                  <p className='text-center text-sm'>
                    Searching for available slots...
                  </p>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                  {availableSlots.map((time) => (
                    <button
                      key={time.uuid}
                      type='button'
                      onClick={() => handleTimeSelect(time.time)}
                      className={`px-6 py-2 border border-[#B7A55E] text-[#B7A55E] rounded whitespace-nowrap ${selectedTime === time.time
                        ? 'bg-blue-500 text-white btn-gradient'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                    >
                      {time.time}
                    </button>
                  ))}
                </div>
              ) : (
                <NoSlotsAvailable variant='viewing' />
              )}
            </div>
          </div>
        </div>
        <div className='flex items-center my-2 gap-2'>
          <input
            type='checkbox'
            className='custom-checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            style={{ zIndex: 0 }}
          />
          <label>
            We authorise you to access the building and / or the community
          </label>
        </div>
        <div className='flex justify-center mt-4'>
          <button
            type='button'
            onClick={handleSubmit}
            className={`btn-gradient text-white px-8 py-2 font-bold ${!selectedTime || !isChecked ? 'cursor-not-allowed opacity-50' : ''
              }`}
            disabled={!selectedTime || !isChecked}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal2
