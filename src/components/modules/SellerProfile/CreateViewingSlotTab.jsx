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
import { filterPastTimeLabelsForDate } from '@/libs/slotTimeFilters'

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
  const [slotIdsToDelete, setSlotIdsToDelete] = useState([])
  const [selectedSlotIds, setSelectedSlotIds] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useProfile()

  useEffect(() => {
    fetchSlots()
  }, [user, slotCategory])

  // Fetch all slots
  // console.log({ user })

  const slotDateKey = (slotDate) => {
    if (!slotDate) return ''
    if (typeof slotDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(slotDate)) {
      return slotDate.slice(0, 10)
    }
    const d = new Date(slotDate)
    if (Number.isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, 10)
  }

  const fetchSlots = async () => {
    if (!user?.uuid) return
    setLoading(true)
    try {
      const response = await customAxios.get(
        `/arrange-view/slots/all/${user.uuid}?slotCategory=${encodeURIComponent(slotCategory)}`
      )
      const nextSlots = Array.isArray(response.data) ? response.data : []
      setSlots(nextSlots)
      setSelectedSlotIds((prev) =>
        prev.filter((id) => nextSlots.some((slot) => slot.uuid === id)),
      )
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
    const existingSlot = slots.find(
      (slot) => slotDateKey(slot.date) === message.date
    )
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
        `/arrange-view/slots/add`,
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

  // Open delete modal (single or bulk)
  const openDeleteModal = (slotId) => {
    setSlotIdToDelete(slotId)
    setSlotIdsToDelete([])
    setIsDeleteModalOpen(true)
  }

  const openBulkDeleteModal = () => {
    if (!selectedSlotIds.length) {
      toast.error('Please select at least one slot to delete.')
      return
    }
    setSlotIdToDelete(null)
    setSlotIdsToDelete([...selectedSlotIds])
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setSlotIdToDelete(null)
    setSlotIdsToDelete([])
    setIsDeleteModalOpen(false)
  }

  const toggleSlotSelection = (slotId) => {
    setSelectedSlotIds((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId],
    )
  }

  const allSelected =
    slots.length > 0 && selectedSlotIds.length === slots.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedSlotIds([])
      return
    }
    setSelectedSlotIds(slots.map((slot) => slot.uuid).filter(Boolean))
  }

  // Handle deleting one or many slots
  const handleConfirmDelete = async () => {
    const ids =
      slotIdsToDelete.length > 0
        ? slotIdsToDelete
        : slotIdToDelete
          ? [slotIdToDelete]
          : []
    if (!ids.length || isDeleting) return

    setIsDeleting(true)
    try {
      const results = await Promise.allSettled(
        ids.map((id) =>
          customAxios.delete(`/arrange-view/slots/delete/${id}`),
        ),
      )

      const failed = results.filter((result) => {
        if (result.status === 'fulfilled') return false
        const message = result.reason?.response?.data?.message || ''
        return !/already deleted/i.test(message)
      })

      if (failed.length === ids.length) {
        toast.error(
          failed[0]?.reason?.response?.data?.message || 'Error deleting slots.',
        )
        return
      }

      const deletedCount = ids.length - failed.length
      toast.success(
        deletedCount === 1
          ? 'Slot deleted successfully.'
          : `${deletedCount} slots deleted successfully.`,
      )
      setSelectedSlotIds((prev) => prev.filter((id) => !ids.includes(id)))
      await fetchSlots()
      closeDeleteModal()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting slots.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Generate the time options
  const timeOptions = generateTimeOptions()
  const visiblePresetTimes = filterPastTimeLabelsForDate(times, message.date)
  const visibleTimeOptions = filterPastTimeLabelsForDate(
    timeOptions,
    message.date,
  )

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
      slots.some((slot) => slotDateKey(slot.date) === message.date)
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
                {slots.some((slot) => slotDateKey(slot.date) === message.date) && (
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
                    {visibleTimeOptions.map((time, index) => (
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
                  {visiblePresetTimes.map((time) => (
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
            <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
              <div className='flex flex-wrap items-center gap-3'>
                <h2 className='text-blue/90 lg:text-xl sm:text-base text-sm font-medium'>
                  Available Slots
                </h2>
                {slots.length > 0 ? (
                  <label className='flex cursor-pointer items-center gap-2 text-sm text-prussianBlue'>
                    <input
                      type='checkbox'
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className='h-4 w-4 accent-[#002d4f]'
                    />
                    <span>Select all</span>
                  </label>
                ) : null}
                {selectedSlotIds.length > 0 ? (
                  <span className='rounded-full bg-[#002d4f]/10 px-3 py-1 text-xs font-medium text-prussianBlue sm:text-sm'>
                    {selectedSlotIds.length} selected
                  </span>
                ) : null}
              </div>
              {selectedSlotIds.length > 0 ? (
                <button
                  type='button'
                  onClick={openBulkDeleteModal}
                  disabled={loading || isDeleting}
                  className='rounded-md border border-[#8D7C3B] px-3 py-1.5 text-sm font-medium text-[#8D7C3B] hover:bg-[#8D7C3B]/10 disabled:opacity-50'
                >
                  Delete selected ({selectedSlotIds.length})
                </button>
              ) : null}
            </div>
            {loading ? (
              <div className='flex justify-center'>
                <FaSpinner className='animate-spin text-2xl' />
              </div>
            ) : (
              <div className='flex flex-wrap gap-4 justify-start '>
                {slots.map((slot) => {
                  const isSelected = selectedSlotIds.includes(slot.uuid)
                  return (
                    <div
                      key={slot.uuid}
                      className={`relative border-2 w-[400px] shadow-md md:px-4 px-2 md:py-3 py-2 rounded-md ${isSelected
                          ? 'border-[#002d4f] bg-[#002d4f]/5'
                          : 'border-dune/10'
                        }`}
                    >
                      <label className='absolute left-2 top-2 z-10 flex cursor-pointer items-center'>
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() => toggleSlotSelection(slot.uuid)}
                          className='h-4 w-4 accent-[#002d4f]'
                          aria-label={`Select slot ${slotDateKey(slot.date)}`}
                        />
                      </label>
                      <div className='flex justify-between items-center pl-6'>
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
                  )
                })}
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
          loading={isDeleting}
          count={
            slotIdsToDelete.length > 0
              ? slotIdsToDelete.length
              : slotIdToDelete
                ? 1
                : 0
          }
        />
      )}
    </>
  )
}
