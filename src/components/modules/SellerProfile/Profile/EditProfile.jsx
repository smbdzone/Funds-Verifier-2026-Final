'use client'
import React, { useEffect, useState } from 'react'
import Modal from '@/components/Avator/Modal'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import 'react-calendar/dist/Calendar.css'
import { useProfile } from '../../../../context/UserContext'
import { toast } from 'react-toastify'
import DropdownInput from '@/components/Inputs/DropdownInput'
import DateOFBirthModal from '../../../Modals/DateOFBirthModal'
import customAxios from '../../../../utils/apis/apis'
import EmiratesIdSection from './EmiratesIdSection'

function EditProfile({ countries }) {
  const [preview, setPreview] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const { user, fetchProfile } = useProfile()
  const [toggleCountry, setToggleCountry] = useState(false)
  const [searchQueryCountry, setSearchQueryCountry] = useState('')
  const [isOpen, setIsOPen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date()) // Manage selected date



  const handleCloseModal = () => {
    setShowModal(false)
    if (selectedImage) {
      setPreview(selectedImage)
    }
  }
  const closeModal = () => {
    setIsOPen(false)
  }

  const initialValues = {
    name: user?.name || '',
    about: user?.about || '',
    role: user?.role || '',
    country: user?.country || '',
    address: user?.address || '',
    phone: user?.phone || '',
    email: user?.email || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth && !isNaN(new Date(user.dateOfBirth))
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    profileImage: user?.profileImage || '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['Male', 'Female', 'Other'], 'Invalid gender selection'),
  })

  return (
    <div className=''>
      <>
        <div className='custom-shadow rounded'>
          <div className='primary-gradient border border-black rounded lg:px-12 sm:px-6 px-4 overflow-x-auto'>
            <nav
              className='flex justify-between gap-3 w-full'
              aria-label='Tabs'
            >
              <button
                className={`whitespace-nowrap py-4 cursor-pointer sm:text-base text-sm lg:text-xl `}
              >
                My Profile
              </button>
            </nav>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {
            // console.log({ values })

            try {
              const res = await customAxios.put(
                `/user/update/${user?.uuid}`,
                values
              )

              if (res?.status === 200) {
                toast.success('User updated successfully!')
                fetchProfile()
              }
            } catch (error) {
              console.error(error.message)
              toast.error(error?.message)
            }
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className='flex flex-col gap-5 mb-7 mt-5'>
                <div className='flex'>
                  <label className='w-[30%]'>Name</label>
                  <div className='w-full flex-col flex'>
                    <Field
                      type='text'
                      name='name'
                      readOnly
                      placeholder='Full Name'
                      className='shadow-neons capitalize rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                    />
                    <ErrorMessage
                      name='name'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>
                </div>

                <div className='flex'>
                  <label className='w-[30%]'>About</label>
                  <div className='w-full flex-col flex'>
                    <Field
                      type='text'
                      name='about'
                      as='textarea'
                      row={20}
                      placeholder='About'
                      className='shadow-neons rounded resize-none w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                    />
                    <ErrorMessage
                      name='about'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>
                </div>

                <div className='flex'>
                  <label className='w-[30%]'>Role</label>
                  <div className='w-full flex-col flex'>
                    <Field
                      type='text'
                      name='role'
                      placeholder='Role'
                      readOnly
                      className='shadow-neons rounded resize-none w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                    />
                    <ErrorMessage
                      name='role'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>
                </div>

                <div className='flex'>
                  <label className='w-[30%]'>Country</label>
                  <div className='w-full'>
                    <DropdownInput
                      setToggle={setToggleCountry}
                      selectedValue={
                        values.country || user?.personalDetails?.country
                      }
                      dropdownOptions={countries.map(
                        (country) => country.country
                      )}
                      onChange={(value) => {
                        setFieldValue('country', value)
                        setToggleCountry(false)
                      }}
                      toggle={toggleCountry}
                      searchQuery={searchQueryCountry}
                      setSearchQuery={setSearchQueryCountry}
                      placeholder='Country'
                    />
                  </div>
                </div>

                <div className='flex'>
                  <label className='w-[30%]'>Address</label>
                  <div className='w-full flex-col flex'>
                    <Field
                      type='text'
                      name='address'
                      placeholder='Address'
                      className='shadow-neons rounded resize-none w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                    />
                    <ErrorMessage
                      name='address'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>
                </div>

                <div className='flex'>
                  <label className='w-[30%]'>Phone</label>
                  <div className='w-full flex-col flex'>
                    <Field
                      type='text'
                      name='phone'
                      placeholder='Phone'
                      readOnly
                      className='shadow-neons rounded resize-none w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                    />
                    <ErrorMessage
                      name='phone'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>
                </div>

                <div className='flex'>
                  <label className='w-[30%]'>Email</label>
                  <div className='w-full flex-col flex'>
                    <Field
                      type='text'
                      name='email'
                      placeholder='Email'
                      readOnly
                      className='shadow-neons rounded resize-none w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                    />
                    <ErrorMessage
                      name='email'
                      component='div'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>
                </div>

                <div className='flex gap-2'>
                  <label className='w-[30%]'>Gender</label>
                  <div className='w-full flex flex-col'>
                    <div className='flex gap-6 items-center h-[48px]'>
                      {['Male', 'Female', 'Other'].map((option, i) => (
                        <label
                          key={option + i}
                          className='flex items-center cursor-pointer'
                        >
                          <Field
                            type='radio'
                            name='gender'
                            value={option}
                            className='mr-2'
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    <ErrorMessage
                      name='gender'
                      component='p'
                      className='text-red-500 text-sm mt-1'
                    />
                  </div>
                </div>

                <div className='flex'>
                  <label className='w-[30%]'>Date Of Birth</label>
                  <div
                    onClick={() => setIsOPen(true)}
                    className='shadow-neons cursor-pointer items-center rounded resize-none w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input flex justify-between'
                  >
                    <p>
                      {user?.dateOfBirth || selectedDate
                        ? !isNaN(new Date(user?.dateOfBirth || selectedDate)) 
                          ? new Date(user?.dateOfBirth || selectedDate).toLocaleDateString('en-US')
                          : 'Invalid Date'
                        : 'Select Date of Birth'}
                    </p>
                    <p>
                      <>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='w-6 h-6 text-gray-600'
                        >
                          <rect
                            x='3'
                            y='4'
                            width='18'
                            height='18'
                            rx='2'
                            ry='2'
                          ></rect>
                          <line x1='16' y1='2' x2='16' y2='6'></line>
                          <line x1='8' y1='2' x2='8' y2='6'></line>
                          <line x1='3' y1='10' x2='21' y2='10'></line>
                        </svg>
                      </>
                    </p>
                  </div>
                </div>

                <button
                  type='submit'
                  className='lg:px-6 lg:py-3 sm:px-3 sm:py-3 p-2 mx-auto block rounded primary-gradient text-white'
                >
                  Save Changes
                </button>
              </div>
              <Modal
                show={showModal}
                onClose={handleCloseModal}
                setSelectedImage={(avatarUrl) => {
                  setSelectedImage(avatarUrl)
                  setFieldValue('profileImage', avatarUrl) // Sync with Formik
                }}
                selectedImage={selectedImage}
              />
              {isOpen && (
                <DateOFBirthModal
                  selectedDate={selectedDate}
                  setDateAgain={setSelectedDate}
                  setSelectedDate={(date) => {
                    setSelectedDate(date)
                    setFieldValue('dateOfBirth', date) // Sync with Formik
                  }}
                  closeModal={closeModal}
                />
              )}
            </Form>
          )}
        </Formik>

        <div className='mt-10 border-t pt-8'>
          <h3 className='text-lg font-medium text-prussianBlue mb-4'>
            Emirates ID (required for Clozer installments)
          </h3>
          <EmiratesIdSection
            user={user}
            fetchData={fetchProfile}
            variant='light'
          />
        </div>
      </>
    </div>
  )
}

export default EditProfile
