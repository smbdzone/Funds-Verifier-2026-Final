'use client'
import {
  getTodayDate,
  generateTimeOptions,
  disablePastDates,
} from '@/utils/global-functions/global'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { FaSpinner } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { times } from '@/constants/otherConstants'
import SlotTabEditModal from '@/components/Modals/SlotTabEditModal'
import SlotTabDeleteModal from '@/components/Modals/SlotTabDeleteModal'
import { useProfile } from '../../../context/UserContext'
import customAxios from '../../../utils/apis/apis'

export const CreateViewingSlotTab = ({
  panelTitle = 'Create Viewing Slots',
  slotTypeLabel = 'viewing',
  slotCategory = 'viewing',
}) => {
  const [message, setMessage] = useState({
    Full_name: '',
    Phone_Number: '',
    email: '',
    Services: '',
    message: '',
    date: getTodayDate().toISOString().split('T')[0],
    slots: [],
    time: [],
  })

  const [customTime, setCustomTime] = useState('')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [slotToEdit, setSlotToEdit] = useState(null)
  const [editTimes, setEditTimes] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [slotIdToDelete, setSlotIdToDelete] = useState(null)
  const { user } = useProfile()

  useEffect(() => {
    fetchSlots()
  }, [user])

  // Fetch all slots
  // console.log({ user })

  const fetchSlots = async () => {
    setLoading(true)
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slots/all/${user?.uuid}`
      )
      setSlots(response.data)
      // setItems(response?.data?.times);
    } catch (error) {
      toast.error('Error fetching slots.')
    } finally {
      setLoading(false)
    }
  }

  // Handle calendar date selection
  const handleChangeCalendar = (value) => {
    const date = value instanceof Date ? value : new Date()
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
    const formattedDate = localDate.toISOString().split('T')[0]

    setMessage((prevMessage) => ({ ...prevMessage, date: formattedDate }))
  }

  const handleClickButton = (time) => {
    setMessage((prevMessage) => ({
      ...prevMessage,
      time: prevMessage.time.includes(time)
        ? prevMessage.time.filter((t) => t !== time)
        : [...prevMessage.time, time],
    }))
  }

  // Validation function to check if slot creation is allowed
  const validateSlotCreation = () => {
    // Check if date is selected
    if (!message.date) {
      toast.error('Please select a date.')
      return false
    }

    // Check if at least one time slot is selected
    if (message.time.length === 0) {
      toast.error('Please select at least one time slot.')
      return false
    }

    // Check if the selected date already has slots
    const existingSlot = slots.find((slot) => slot.date === message.date)
    if (existingSlot) {
      toast.error(
        'Slots already exist for this date. Please edit the existing slot or choose a different date.'
      )
      return false
    }

    return true
  }

  // Save new slots
  const handleSaveSlots = async () => {
    // Validate before proceeding
    if (!validateSlotCreation()) {
      return
    }

    setLoading(true)
    try {
      await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slots/add`,
        {
          userUUID: user?.uuid,
          date: message.date,
          timeSlots: message.time,
          slotCategory,
        }
      )
      toast.success('Slots saved successfully.')
      fetchSlots()
      setMessage((prevMessage) => ({
        ...prevMessage,
        time: [],
      }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving slots.')
    } finally {
      setLoading(false)
    }
  }

  // Open edit modal
  const openEditModal = (slot) => {
    setSlotToEdit(slot)
    setEditTimes(slot.times.map((timeSlot) => timeSlot.time))
    setIsEditModalOpen(true)
  }

  // Handle editing time slots
  const handleEditChangeTime = (time) => {
    setEditTimes((prevTimes) =>
      prevTimes.includes(time)
        ? prevTimes.filter((t) => t !== time)
        : [...prevTimes, time]
    )
  }

  const closeModal = () => {
    setIsEditModalOpen(false)
    setSlotToEdit(null)
    setEditTimes([])
  }

  // Open delete modal
  const openDeleteModal = (slotId) => {
    setSlotIdToDelete(slotId)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setSlotIdToDelete(null)
    setIsDeleteModalOpen(false)
  }

  // Handle deleting a slot
  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      // console.log({ slotIdToDelete })

      await customAxios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slots/delete/${slotIdToDelete}`
      )
      toast.success('Slot deleted successfully.')
      fetchSlots()
      closeDeleteModal()
    } catch (error) {
      toast.error('Error deleting slot.')
    } finally {
      setLoading(false)
    }
  }

  // Generate the time options
  const timeOptions = generateTimeOptions()

  const handleAddCustomTime = () => {
    if (customTime) {
      setMessage((prevMessage) => ({
        ...prevMessage,
        time: [...prevMessage.time, customTime],
      }))
      setCustomTime('')
    }
  }

  // Remove time from the time array
  const removeTimeSlot = (timeToRemove) => {
    setMessage((prevMessage) => ({
      ...prevMessage,
      time: prevMessage.time.filter((time) => time !== timeToRemove),
    }))
  }

  // Check if the save button should be disabled
  const isSaveDisabled = () => {
    return (
      loading ||
      !message.date ||
      message.time.length === 0 ||
      slots.some((slot) => slot.date === message.date)
    )
  }

  return (
    <>
      <div className='md:py-5 w-full bg-white text-prussianBlue/40 flex flex-col items-center border-b border-border'>
        <ToastContainer />
        <div className='w-full'>
          <div className='primary-gradient flex items-center justify-between border border-black rounded py-3 px-4 overflow-x-auto'>
            <h2 className='text-white font-semibold sm:text-base text-sm lg:text-lg'>
              {panelTitle}
            </h2>
          </div>
          <div className='w-full py-5 flex flex-col md:flex-row gap-5'>
            <div className='w-full md:w-[50%] rounded-2xl sm:py-5 md:px-5'>
              <div className='w-full flex flex-col gap-5'>
                <h2 className='text-blue/90 lg:text-xl sm:text-base text-sm font-medium mb-2'>
                  Select a Date for Slot
                </h2>
                <div className='rounded-xl shadow-glow border-none w-full min-w-[320px]'>
                  <Calendar
                    onChange={handleChangeCalendar}
                    value={new Date(message.date)}
                    tileDisabled={({ date }) => disablePastDates(date)}
                    className='!w-full border !border-blue/90 rounded-[12px] calender_FV'
                    style={{
                      background:
                        'linear-gradient(to right, #002d4f 0%, #5085ad 31%, #002d4f 64%, #5085ad 97%) !important',
                    }}
                  />
                </div>
                {/* Display warning if date already has slots */}
                {slots.some((slot) => slot.date === message.date) && (
                  <div className='text-red-500 text-sm mt-2 p-2 bg-red-50 border border-red-200 rounded'>
                    <strong>Warning:</strong> This date already has slots.
                    Please select a different date or edit the existing slot.
                  </div>
                )}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className='w-full flex justify-end items-center'>
              <div className='w-full flex flex-col h-full p-5 rounded-lg'>
                <h2 className='text-blue/90 lg:text-xl text-base font-medium mb-2'>
                  Add Time Slot
                </h2>
                {/* Time Slot Selection */}
                <div className='flex items-center gap-3 my-2'>
                  <select
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className='primary-gradient border text-white border-border rounded-lg py-2 px-5 text-sm sm:text-base focus:outline-none'
                  >
                    <option value='' disabled>
                      Select Time
                    </option>
                    {timeOptions.map((time, index) => (
                      <option
                        key={index}
                        className='text-blue/90'
                        value={time}
                        disabled={message.time.includes(time)}
                      >
                        {time}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddCustomTime}
                    className='primary-gradient text-white text-sm sm:text-base rounded-lg py-2 px-5'
                    disabled={!customTime}
                  >
                    Add Time
                  </button>
                </div>

                {/* Display selected times */}
                <div className='text-dune/70 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                  {message.time.map((time) => (
                    <div key={time} className='relative flex items-center'>
                      <span className='border py-1 flex items-center justify-center whitespace-nowrap px-6 text-sm lg:text-base rounded-md w-full'>
                        {time}
                      </span>
                      <button
                        onClick={() => removeTimeSlot(time)}
                        className='absolute top-0 right-0 bg-prussianBlue text-white rounded-full w-6 h-6 flex items-center justify-center transform -translate-y-2 translate-x-2 opacity-0 hover:opacity-100 transition-opacity'
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <h2 className='text-blue/90 lg:text-xl sm:text-base text-sm font-medium my-3'>
                  Select Time Slots
                </h2>
                <div className='text-dune/70 grid grid-cols-3 lg:grid-cols-4 gap-3'>
                  {times.map((time) => (
                    <button
                      key={time}
                      value={time}
                      onClick={() => handleClickButton(time)}
                      className={`border py-2 flex items-center justify-center whitespace-nowrap md:px-6 px-3 text-xs sm:text-sm lg:text-base rounded-md w-full ${message.time.includes(time)
                        ? 'primary-gradient text-prussianBlue/40 border-primaryBtn'
                        : 'border-dune/10'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {message.time.length === 0 && (
                  <div className='text-amber-600 text-sm mt-2 p-2 bg-amber-50 border border-amber-200 rounded'>
                    <strong>Note:</strong> Please select at least one time slot
                    to create {slotTypeLabel} slots.
                  </div>
                )}
                <div className='w-full mt-5 md:mt-10'>
                  <button
                    type='button'
                    className={`sm:text-base text-sm text-white rounded-lg py-2 px-3 md:px-5 ${isSaveDisabled()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'primary-gradient hover:opacity-90'
                      }`}
                    onClick={handleSaveSlots}
                    disabled={isSaveDisabled()}
                  >
                    {loading ? (
                      <div className='flex items-center gap-2'>
                        <FaSpinner className='animate-spin' />
                        Saving...
                      </div>
                    ) : (
                      'Save Slots'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View Available Slots */}
          <div className='w-full py-3 md:py-5'>
            <h2 className='text-blue/90 lg:text-xl sm:text-base text-sm font-medium mb-2'>
              Available Slots
            </h2>
            {loading ? (
              <div className='flex justify-center'>
                <FaSpinner className='animate-spin text-2xl' />
              </div>
            ) : (
              <div className='flex flex-wrap gap-4 justify-start '>
                {slots.map((slot) => (
                  <div
                    key={slot.uuid}
                    className='border-2 w-[400px] border-dune/10 shadow-md md:px-4 px-2 md:py-3 py-2 rounded-md'
                  >
                    <div className='flex justify-between items-center'>
                      <h3 className='text-dune/80 sm:text-base text-sm lg:text-lg'>
                        {new Date(slot.date).toLocaleDateString('en-GB')}
                      </h3>
                      <div className='flex gap-2'>
                        <button
                          className='text-blue-500 sm:text-base text-sm lg:text-lg'
                          onClick={() => {
                            openEditModal(slot)
                          }}
                        >
                          Update
                        </button>
                        <button
                          className='text-prussianBlue sm:text-base text-sm lg:text-lg'
                          onClick={() => openDeleteModal(slot.uuid)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 md:gap-2 sm:gap-x-5 gap-x-8 gap-y-2 mt-2'>
                      {slot.times.map((timeSlot) => (
                        <span
                          key={timeSlot.uuid}
                          className={`${timeSlot.isBooked
                            ? 'bg-black/50 cursor-not-allowed'
                            : 'primary-gradient'
                            } text-white py-2 sm:text-base text-sm lg:text-lg flex items-center justify-center px-2 rounded-lg`}
                        >
                          {timeSlot.time}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <SlotTabEditModal
          handleChangeCalendar={handleChangeCalendar}
          disablePastDates={disablePastDates}
          handleEditChangeTime={handleEditChangeTime}
          editTimes={editTimes}
          id={slotToEdit.uuid}
          closeModal={closeModal}
          fetchSlots={fetchSlots}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <SlotTabDeleteModal
          handleConfirmDelete={handleConfirmDelete}
          closeDeleteModal={closeDeleteModal}
        />
      )}
    </>
  )
}
