import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import Image from 'next/image'
import { Loader2Icon } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import '../3dModal/calender.css'
import FocusLock from 'react-focus-lock'
import { toast } from 'react-toastify'
import customAxios from '../../utils/apis/apis'
import { NoSlotsAvailable } from '@/components/global/NoSlotsAvailable'

const getToday = () => {
  const today = new Date()
  return new Date(today.setHours(0, 0, 0, 0)) // Start of today
}

const formatLocalDate = (date) => {
  const correctedDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
  return correctedDate.toISOString().split('T')[0]
}

const EvaluationModal = ({ isOpen, onClose, setFormData }) => {
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [selectedTime, setSelectedTime] = useState(null)
  const [updatedSlot, setUpdatedSlot] = useState({
    time: '',
    isBooked: false,
  })
  const [data, setData] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [slots, setSlots] = useState([])
  const [id, setId] = useState()
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [evaluatorLoading, setEvaluatorLoading] = useState(true)

  useEffect(() => {
    if (isOpen && data?.uuid) {
      fetchSlots()
    }
  }, [isOpen, selectedDate, data?.uuid])

  const getIdByRole = async () => {
    setEvaluatorLoading(true)
    try {
      const response = await customAxios.get(
        `/user/service-providers/Evaluator`
      )

      const providers = Array.isArray(response?.data) ? response.data : []
      if (providers.length > 0) {
        setData(providers[0])
      } else {
        setData(null)
        toast.error('No evaluator is available for booking')
      }
    } catch (error) {
      console.error('Error loading user:', error)
      setData(null)
      toast.error('Could not load evaluator availability')
    } finally {
      setEvaluatorLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      getIdByRole()
    }
  }, [isOpen])

  const fetchSlots = async () => {
    if (!data?.uuid || !selectedDate) return

    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const date = `${year}-${month}-${day}`

    setSlotsLoading(true)
    setSelectedTime(null)

    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slot-by-date?userUUID=${data.uuid}&date=${date}`
      )

      setSlots(response?.data[0]?.times || [])
      setId(response?.data[0]?.uuid)
    } catch (error) {
      console.error('Error fetching slots:', error)
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
    setUpdatedSlot({ ...updatedSlot, time: time, isBooked: true })
  }

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked)
  }
  // console.log({ data })

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      const dateTime = new Date(
        `${selectedDate.toDateString()} ${selectedTime}`
      )

      const newUpdatedSlot = slots.map((slot) => {
        if (slot.time === selectedTime) {
          return { ...slot, isBooked: true }
        }
        return slot
      })

      try {
        setFormData((prevData) => ({
          ...prevData,
          evaluationDateTime: dateTime.toISOString(),
          evaluatorUUID: data.uuid,
          evaluationTimeslotId: id,
          evaluationSlotDate: formatLocalDate(selectedDate),
          evaluationSlotTime: selectedTime,
          evaluationSlotTimeslots: newUpdatedSlot,
        }))
        toast.success(
          'Evaluation slot selected. Complete payment to confirm your booking.',
        )
        onClose()
      } catch (error) {
        console.error('Error saving evaluation slot:', error)
      }
    } else {
      alert('Please select both date and time.')
    }
  }

  const availableSlots =
    slots?.filter((slot) => slot && !slot.isBooked) ?? []

  if (!isOpen) return null

  const isFormValid = selectedDate && selectedTime

  return (
    <FocusLock>
      <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
        <div className='max-h-[90vh] overflow-y-auto relative bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2 text-[#002D4F]'>
          <h2 className='text-3xl font-semibold mb-4'>Select Date and Time</h2>
          <p className='mb-8'>
            Choose available time & date slot for evaluation asset
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
                {evaluatorLoading || slotsLoading ? (
                  <div className='flex flex-col items-center justify-center h-32 text-gray-500 gap-2'>
                    <Loader2Icon className='w-8 h-8 animate-spin text-[#B7A55E]' />
                    <p className='text-center text-sm'>
                      {evaluatorLoading
                        ? 'Loading evaluator calendar...'
                        : 'Searching for available slots...'}
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
                        {time?.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <NoSlotsAvailable variant='evaluation' />
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
              onClick={handleSubmit}
              className={`btn-gradient text-white px-8 py-2 font-bold ${!isFormValid || !isChecked
                ? 'cursor-not-allowed opacity-50'
                : ''
                }`}
              disabled={!isFormValid || !isChecked}
            >
              Request
            </button>
          </div>

          <div className='absolute top-2 right-2 flex justify-end'>
            <button
              className='px-4 py-2 bg-blue-500 text-prussianBlue rounded'
              onClick={onClose}
            >
              X
            </button>
          </div>
        </div>
      </div>
    </FocusLock>
  )
}

export default EvaluationModal
