/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import Image from 'next/image'
import Modal2 from './Modal2'
import 'react-toastify/dist/ReactToastify.css'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import DropDown from '../DropdownComponent/DropDown'
import { toast } from 'react-toastify'

import customAxios from '../../utils/apis/apis'
import {

  getTokenFromCookie,
} from '../../utils/helper'
import { useProfile } from '../../context/UserContext'

const Modal = ({
  isOpen,
  onClose,
  onSave,
  type,
  dropdown3D,
  dropdown,
  bedroomsDropDown,
  title,
  userUUID,
  productId,
  productTitle,
}) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [showCheckboxError, setShowCheckboxError] = useState(false)
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [bedroomCount, setBedroomCount] = useState(1)
  const [price, setPrice] = useState()
  const [value, setValue] = useState()
  const { user } = useProfile()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateTime: '',
    phone: '',
    productId,
    productTitle,
    assetType: type,
    category: category,
    subCategory: subCategory,
    value: value,
    price: 0,
  })

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.dateTime &&
    formData.phone &&
    formData.assetType &&
    isChecked

  const handleSave = async () => {
    if (!isChecked) {
      setShowCheckboxError(true)
      return
    }
    setShowCheckboxError(false)
    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_UAE_PASS_REDIRECT_URI || ''
      const returnPath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/dashboard/property-listing'
      localStorage.setItem('servicePaymentReturnUrl', returnPath)

      const currentUrl = `${origin}/service-payment-success`
      const cancelUrl =
        typeof window !== 'undefined'
          ? window.location.href
          : `${origin}/dashboard/property-listing`
      const currentuserUUID = user?.uuid
      const token = getTokenFromCookie()
      if (!currentuserUUID) return toast.error('User not found. Please login.')

      const APiRequestedData = {
        userUUID: currentuserUUID,
        service: '_3dwalkthrough',
        price: formData?.price,
        productTitle: productTitle,
        productId: productId,
        dateTime: formData?.dateTime,
        phone: formData?.phone,
        success_url: currentUrl,
        cancel_url: cancelUrl,
        assetType: type,
        category: category,
        subCategory: subCategory,
        value: value,
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(APiRequestedData),
        }
      )
      const data = await response.json()

      onSave(APiRequestedData)

      if (response.status === 201 && data.url) {
        if (data.sessionId) {
          localStorage.setItem('checkoutSessionId', data.sessionId)
        }
        window.location.href = data.url
      } else {
        toast.error(data?.message || 'Payment initiation failed.')
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong!')
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
          setPrice(res?.data[0]?.price || 0)
          setFormData({
            ...formData,
            price: res?.data[0]?.price,
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
    isOpen && (
      <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
        <div className='relative bg-white p-5 rounded shadow-lg w-11/12 md:w-1/2 text-[#002D4F]'>
          <h2 className='text-3xl font-semibold mb-4'>
            Request a 3D Walkthrough
          </h2>
          <p className='mb-8 md:w-[70%]'>
            If you don't have one and you need one, please request to have one
            created for you.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <label className='mb-1 text-3dxl'>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                className='w-full p-2 border rounded'
                placeholder='Full Name'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Email</label>
              <input
                type='text'
                name='email'
                value={formData.email}
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
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
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Phone Number</label>
              <PhoneInput
                international
                defaultCountry='AE'
                name='phone'
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                className='w-full p-2 border rounded'
                placeholder='Enter phone number'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 text-xl'>Asset Type</label>
              <input
                type='text'
                name='assetType'
                value={formData.assetType}
                readOnly
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                className='w-full p-2 border rounded'
                placeholder='Email'
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
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
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
            />
            <label>
              We authorize you to access the building and / or the community
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
              className='px-4 py-2 bg-blue-500 text-prussianBlue rounded'
              onClick={onClose}
              type='button'
            >
              X
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default Modal
