import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import Image from 'next/image'
import { Loader2Icon } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import '../3dModal/calender.css'
import FocusLock from 'react-focus-lock'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { toast } from 'react-toastify'
import DropDown from '../DropdownComponent/DropDown'
import customAxios from '../../utils/apis/apis'
import { useProfile } from '../../context/UserContext'
import { NoSlotsAvailable } from '@/components/global/NoSlotsAvailable'
import { getBookableSlotsForDate } from '@/libs/slotTimeFilters'

const getToday = () => {
  const today = new Date()
  return new Date(today.setHours(0, 0, 0, 0))
}

const formatLocalDate = (date) => {
  const correctedDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  )
  return correctedDate.toISOString().split('T')[0]
}

const EvaluationModal = ({
  isOpen,
  onClose,
  setFormData,
  formData: parentFormData,
  assetType = 'Property For Sale',
  dropdown3D,
  dropdown,
  bedroomsDropDown,
  title = 'Bedrooms',
}) => {
  const { user } = useProfile()
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [selectedTime, setSelectedTime] = useState(null)
  const [evaluator, setEvaluator] = useState(null)
  const [slots, setSlots] = useState([])
  const [timeslotId, setTimeslotId] = useState()
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [evaluatorLoading, setEvaluatorLoading] = useState(true)
  const [isChecked, setIsChecked] = useState(false)
  const [showCheckboxError, setShowCheckboxError] = useState(false)
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [value, setValue] = useState('')
  const [price, setPrice] = useState(0)
  const [modalForm, setModalForm] = useState({
    name: '',
    email: '',
    phone: '',
    assetType,
    category: '',
    subCategory: '',
    value: '',
    price: 0,
  })

  const isProperty = assetType === 'Property For Sale'
  const hasCategorySelection = isProperty
    ? category && subCategory && value
    : category

  const isFormValid =
    modalForm.name &&
    modalForm.email &&
    modalForm.phone &&
    selectedDate &&
    selectedTime &&
    hasCategorySelection &&
    price > 0 &&
    isChecked

  useEffect(() => {
    if (!isOpen) return
    setModalForm((prev) => ({
      ...prev,
      name: user?.displayName || user?.name || '',
      email: user?.email || '',
      phone: parentFormData?.phoneNumber || user?.phone || '',
      assetType,
    }))
    setSelectedDate(getToday())
    setSelectedTime(null)
    setIsChecked(false)
    setShowCheckboxError(false)
    getEvaluatorProvider()
  }, [isOpen, user, parentFormData?.phoneNumber, assetType])

  useEffect(() => {
    if (isOpen && evaluator?.uuid) {
      fetchSlots()
    }
  }, [isOpen, selectedDate, evaluator?.uuid])

  const getEvaluatorProvider = async () => {
    setEvaluatorLoading(true)
    try {
      const response = await customAxios.get(`/user/service-providers/Evaluator`)
      const providers = Array.isArray(response?.data) ? response.data : []
      if (providers.length > 0) {
        setEvaluator(providers[0])
      } else {
        setEvaluator(null)
        toast.error('No evaluator is available for booking')
      }
    } catch (error) {
      console.error('Error loading evaluator:', error)
      setEvaluator(null)
      toast.error('Could not load evaluator availability')
    } finally {
      setEvaluatorLoading(false)
    }
  }

  const fetchSlots = async () => {
    if (!evaluator?.uuid || !selectedDate) return

    const date = formatLocalDate(selectedDate)
    setSlotsLoading(true)
    setSelectedTime(null)

    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slot-by-date?userUUID=${evaluator.uuid}&date=${date}&slotCategory=service`,
      )
      setSlots(response?.data[0]?.times || [])
      setTimeslotId(response?.data[0]?.uuid)
    } catch (error) {
      console.error('Error fetching slots:', error)
      setSlots([])
      toast.error('Could not load available slots')
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleInputChange = (name, fieldValue) => {
    setModalForm((prev) => ({ ...prev, [name]: fieldValue }))
  }

  const fetchPrice = async (value1) => {
    if (!evaluator?.uuid) return

    try {
      if (isProperty && subCategory && value1) {
        const res = await customAxios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?userUUID=${evaluator.uuid}&assetType=${encodeURIComponent(assetType)}&subCategory=${encodeURIComponent(subCategory)}&value=${encodeURIComponent(value1)}`,
        )
        const matched = res?.data?.[0]
        const nextPrice = Number(matched?.price) || 0
        setPrice(nextPrice)
        setValue(value1)
        setModalForm((prev) => ({
          ...prev,
          price: nextPrice,
          subCategory,
          value: value1,
        }))
        return
      }

      const res = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?userUUID=${evaluator.uuid}&assetType=${encodeURIComponent(assetType)}&category=${encodeURIComponent(value1)}`,
      )
      const matched = res?.data?.[0]
      const nextPrice = Number(matched?.price) || 0
      setPrice(nextPrice)
      setCategory(value1)
      setModalForm((prev) => ({
        ...prev,
        price: nextPrice,
        category: value1,
      }))
    } catch (error) {
      console.error('Error fetching evaluation price:', error?.message)
      setPrice(0)
    }
  }

  const handleSubmit = () => {
    if (!isChecked) {
      setShowCheckboxError(true)
      return
    }
    if (!isFormValid || !evaluator?.uuid || !timeslotId) {
      toast.error('Please complete all fields and select an available slot.')
      return
    }

    const dateTime = new Date(`${selectedDate.toDateString()} ${selectedTime}`)
    const newUpdatedSlot = slots.map((slot) =>
      slot.time === selectedTime ? { ...slot, isBooked: true } : slot,
    )

    setFormData((prevData) => ({
      ...prevData,
      evaluationDateTime: dateTime.toISOString(),
      evaluatorUUID: evaluator.uuid,
      evaluationTimeslotId: timeslotId,
      evaluationSlotDate: formatLocalDate(selectedDate),
      evaluationSlotTime: selectedTime,
      evaluationSlotTimeslots: newUpdatedSlot,
      evaluationFeePrice: price,
      evaluationFeeCategory: category,
      evaluationFeeSubCategory: subCategory,
      evaluationFeeBedrooms: value,
      evaluationContactName: modalForm.name,
      evaluationContactEmail: modalForm.email,
      evaluationContactPhone: modalForm.phone,
    }))

    toast.success(
      'Evaluation slot selected. Complete payment to confirm your booking.',
    )
    onClose()
  }

  const availableSlots = getBookableSlotsForDate(slots, selectedDate)

  if (!isOpen) return null

  return (
    <FocusLock>
      <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
        <div className='max-h-[90vh] overflow-y-auto relative bg-white p-5 rounded shadow-lg w-11/12 md:w-3/4 lg:w-2/3 text-[#002D4F]'>
          <h2 className='text-3xl font-semibold mb-2'>Request Evaluation</h2>
          <p className='mb-6 md:w-[80%]'>
            Enter your details, choose property type and bedrooms, then pick an
            available evaluation slot. The fee is based on your evaluator&apos;s
            price list.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Full Name</label>
              <input
                type='text'
                name='name'
                value={modalForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className='w-full p-2 border rounded'
                placeholder='Full Name'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Email</label>
              <input
                type='email'
                name='email'
                value={modalForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className='w-full p-2 border rounded'
                placeholder='Email'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Phone Number</label>
              <PhoneInput
                international
                defaultCountry='AE'
                value={modalForm.phone}
                onChange={(phoneValue) => handleInputChange('phone', phoneValue)}
                className='w-full p-2 border rounded'
                placeholder='Enter phone number'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Asset Type</label>
              <input
                type='text'
                value={assetType}
                readOnly
                className='w-full p-2 border rounded bg-gray-50'
              />
            </div>

            {isProperty ? (
              <>
                <div className='flex flex-col'>
                  <label className='mb-1 text-xl'>Property Type</label>
                  <div className='w-full p-2 border rounded'>
                    <DropDown
                      dropdown3D={dropdown3D}
                      setCategory={setCategory}
                      subCategory={subCategory}
                      category={category}
                      setSubCategory={setSubCategory}
                      setFormData={setModalForm}
                      formData={modalForm}
                      fetchPrice={fetchPrice}
                    />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label className='mb-1 text-xl'>{title}</label>
                  <div className='w-full p-2 border rounded'>
                    <DropDown
                      bedroomsDropDown={bedroomsDropDown}
                      setFormData={setModalForm}
                      formData={modalForm}
                      setValue={setValue}
                      value={value}
                      fetchPrice={fetchPrice}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className='flex flex-col md:col-span-2'>
                <label className='mb-1 text-xl'>{title}</label>
                <div className='w-full p-2 border rounded'>
                  <DropDown
                    dropdown={dropdown}
                    setCategory={setCategory}
                    subCategory={subCategory}
                    category={category}
                    setSubCategory={setSubCategory}
                    setFormData={setModalForm}
                    formData={modalForm}
                    fetchPrice={fetchPrice}
                  />
                </div>
              </div>
            )}

            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Evaluation Fee (AED)</label>
              <input
                type='text'
                value={price > 0 ? price : ''}
                readOnly
                className='w-full p-2 border rounded bg-gray-50'
                placeholder='Select category to load price'
              />
            </div>
          </div>

          <h3 className='text-xl font-semibold mb-3'>Select Date and Time</h3>
          <div className='flex flex-col xl:flex-row gap-4'>
            <div className='bg-white shadow-md rounded-lg p-2 flex-shrink-0'>
              <Calendar
                className='w-full'
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={getToday()}
              />
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
                        key={time.uuid || time.time}
                        type='button'
                        onClick={() => setSelectedTime(time.time)}
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

          <div className='flex items-center my-4 gap-2'>
            <input
              type='checkbox'
              className='custom-checkbox'
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              style={{ zIndex: 0 }}
            />
            <label>
              We authorise you to access the building and / or the community
            </label>
          </div>
          {showCheckboxError && (
            <p className='text-red-500 mb-2'>
              You must accept the conditions to proceed.
            </p>
          )}

          <div className='flex justify-center mt-4'>
            <button
              type='button'
              onClick={handleSubmit}
              className={`btn-gradient text-white px-8 py-2 font-bold ${!isFormValid ? 'cursor-not-allowed opacity-50' : ''
                }`}
              disabled={!isFormValid}
            >
              Request
            </button>
          </div>

          <div className='absolute top-2 right-2 flex justify-end'>
            <button
              type='button'
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
