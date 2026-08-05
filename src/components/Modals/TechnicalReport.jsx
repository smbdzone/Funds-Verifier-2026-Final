/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Modal2 from '../3dModal/Modal2'
import 'react-toastify/dist/ReactToastify.css'
import DropDown from '../DropdownComponent/DropDown'
import { toast } from 'react-toastify'
import customAxios from '../../utils/apis/apis'
import { initiateServiceSubscription } from '@/libs/initiateServiceSubscription'
import { initiateClozerPayment, getClozerErrorMessage } from '@/libs/initiateClozerPayment'
import PaymentChoiceModal from '@/components/payments/PaymentChoiceModal'
import { applyFullPayDiscount } from '@/libs/paymentDiscount'
import { useProfile } from '../../context/UserContext'
import { clearServiceAppointmentSelection } from '@/libs/slotBooking'
import BookingContactPhonePicker from '@/components/booking/BookingContactPhonePicker'

const TechnicalReport = ({
  isOpen,
  onClose,
  onSave,
  type,
  dropdown3D,
  dropdown,
  bedroomsDropDown,
  title,
  userUUID,
  productTitle,
  productId,
  listingPhone = '',
}) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [showCheckboxError, setShowCheckboxError] = useState(false)
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [bedroomCount, setBedroomCount] = useState(1)
  const [value, setValue] = useState()
  const [price, setPrice] = useState()
  const { user } = useProfile()
  const [showPaymentChoice, setShowPaymentChoice] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateTime: '',
    phone: '',
    productId: '',
    productTitle: '',
    assetType: type,
    category: category,
    subCategory: subCategory,
    value: value,
    price: 0,
  })

  useEffect(() => {
    if (!isOpen) return
    const uaePhone = user?.phone || ''
    setFormData((prev) => ({
      ...prev,
      name: user?.displayName || user?.name || prev.name || '',
      email: user?.email || prev.email || '',
      phone: uaePhone || listingPhone || '',
      productId,
      productTitle,
      assetType: type,
    }))
  }, [isOpen, user, listingPhone, productId, productTitle, type])

  if (!isOpen) return null

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.dateTime &&
    formData.phone &&
    formData.assetType &&
    isChecked

  const buildPaymentPayload = () => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_UAE_PASS_REDIRECT_URI || ''
    const returnPath =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '/dashboard/property-listing'
    localStorage.setItem('servicePaymentReturnUrl', returnPath)

    return {
      userUUID: user?.uuid,
      service: 'surveyor',
      price: formData?.price,
      productTitle,
      productId,
      dateTime: formData?.dateTime,
      phone: formData?.phone,
      success_url: `${origin}/service-payment-success`,
      cancel_url:
        typeof window !== 'undefined'
          ? window.location.href
          : `${origin}/dashboard/property-listing`,
      assetType: type,
      category,
      subCategory,
      value,
    }
  }

  const handleSave = () => {
    if (!isChecked) {
      setShowCheckboxError(true)
      return
    }
    setShowCheckboxError(false)
    if (!user?.uuid) {
      toast.error('User not found. Please login.')
      return
    }
    setShowPaymentChoice(true)
  }

  const handlePaymentAbandoned = async () => {
    await clearServiceAppointmentSelection(formData, setFormData)
    setShowPaymentChoice(false)
  }

  const handleStripePay = async () => {
    try {
      setPaymentLoading(true)
      const APiRequestedData = buildPaymentPayload()
      const data = await initiateServiceSubscription({
        ...APiRequestedData,
        price: applyFullPayDiscount(formData?.price).discounted,
      })
      onSave(APiRequestedData)
      if (data?.url) {
        if (data.sessionId) {
          localStorage.setItem('checkoutSessionId', data.sessionId)
        }
        window.location.href = data.url
      } else {
        toast.error(data?.message || 'Payment initiation failed.')
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong!')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleClozerPay = async () => {
    try {
      setPaymentLoading(true)
      const origin =
        typeof window !== 'undefined' ? window.location.origin : ''
      const APiRequestedData = {
        ...buildPaymentPayload(),
        success_url: `${origin}/clozer-return`,
      }
      const data = await initiateClozerPayment(APiRequestedData)
      onSave(APiRequestedData)
      if (data?.redirectUrl) {
        localStorage.setItem('clozerTransactionId', data.transaction_id)
        window.location.href = data.redirectUrl
      } else {
        toast.error(data?.message || 'Installment payment could not be started.')
      }
    } catch (error) {
      toast.error(getClozerErrorMessage(error))
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const fetchPrice = async (value1) => {
    if (subCategory && value1) {
      try {
        const res = await customAxios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?userUUID=${userUUID}&subCategory=${subCategory}&value=${value1}`
        )
        if (res?.data) {
          setPrice(res?.data[0].price)
          setFormData({
            ...formData,
            price: res?.data[0].price,
            subCategory: subCategory,
            value: value1,
          })
        }
      } catch (error) {
        console.error('Error fetching price data:', error?.message)
      }
    } else {
      try {
        const res = await customAxios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?userUUID=${userUUID}&category=${value1}`
        )
        if (res?.data && res?.data.length > 0) {
          setPrice(res?.data[0].price)
          setFormData({ ...formData, price: res?.data[0].price })
        } else {
          setPrice(0)
        }
      } catch (error) {
        console.error('Error fetching price data:', error?.message)
      }
    }
  }
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='relative bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2 text-[#002D4F]'>
        <h2 className='text-3xl font-semibold mb-4 flex gap-2'>
          Request a technical report
        </h2>
        <p className='mb-8 md:w-[70%]'>
          If you don't have one and you need one, please request to have one
          created for you.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <label className='mb-1 text-xl'>Full Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Full Name'
            />
          </div>
          <div className='flex flex-col'>
            <label className='mb-1 text-xl'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Email'
            />
          </div>
          <div className='flex flex-col relative'>
            <label className='mb-1 text-xl'>Date & Time</label>
            <input
              type='text'
              name='dateTime'
              value={formData.dateTime}
              readOnly
              className='w-full p-2 border rounded'
              placeholder='Date & Time'
            />
            <Image
              src='/assets/images/clock.png'
              alt='Clock Icon'
              width={20}
              height={20}
              onClick={handleOpenModal}
              className='absolute right-2 top-10 cursor-pointer'
            />
            <Modal2
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              formData={formData}
              setFormData={setFormData}
              userUUID={userUUID}
            />
          </div>
          <BookingContactPhonePicker
            idPrefix='technical-phone'
            uaePassPhone={user?.phone || ''}
            listingPhone={listingPhone || ''}
            value={formData.phone}
            onChange={(phone) => handleInputChange('phone', phone)}
            assetLabel={type || 'this asset'}
          />
          <div className='flex flex-col'>
            <label className='mb-1 text-xl'>Asset Type</label>
            <input
              type='text'
              name='assetType'
              value={formData.assetType}
              readOnly
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Asset Type'
            />
          </div>

          {type === 'Property For Sale' ? (
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
                    setFormData={setFormData}
                    formData={formData}
                    fetchPrice={fetchPrice}
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <label className='mb-1 text-xl'>{title}</label>
                <div className='w-full p-2 border rounded'>
                  <DropDown
                    bedroomsDropDown={bedroomsDropDown}
                    setBedroomCount={(count) => {
                      setBedroomCount(count)
                    }}
                    bedroomCount={bedroomCount}
                    setFormData={setFormData}
                    formData={formData}
                    setValue={setValue}
                    value={value}
                    fetchPrice={fetchPrice}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>{title}</label>
              <div className='w-full p-2 border rounded'>
                <DropDown
                  dropdown={dropdown}
                  setCategory={setCategory}
                  subCategory={subCategory}
                  category={category}
                  setSubCategory={setSubCategory}
                  setFormData={setFormData}
                  formData={formData}
                  fetchPrice={fetchPrice}
                />
              </div>
            </div>
          )}

          <div className='flex flex-col'>
            <label className='mb-1 text-xl'>Price</label>
            <input
              type='text'
              name='price'
              value={price}
              readOnly
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='price'
            />
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
        {showCheckboxError && (
          <p className='text-red-500 mt-2'>
            You must accept the conditions to proceed.
          </p>
        )}
        <div className='mt-8 mx-auto flex justify-center'>
          <button
            className={`btn-gradient font-medium text-xl px-8 py-2 ${!isFormValid ? 'cursor-not-allowed opacity-50' : ''
              }`}
            onClick={handleSave}
            type='button'
            disabled={!isFormValid}
          >
            Submit
          </button>
        </div>
        <div className='absolute top-2 right-2 flex justify-end'>
          <button
            type='button'
            className='flex h-8 w-8 items-center justify-center rounded border-2 border-light-gold text-light-gold font-semibold hover:bg-light-gold/10'
            onClick={onClose}
            aria-label='Close'
          >
            X
          </button>
        </div>

        <PaymentChoiceModal
          show={showPaymentChoice}
          onClose={handlePaymentAbandoned}
          amount={price}
          loading={paymentLoading}
          onPayFull={handleStripePay}
          onPayInstallments={handleClozerPay}
        />
      </div>
    </div>
  )
}

export default TechnicalReport
