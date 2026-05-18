'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import DropdownInput from '@/components/Inputs/DropdownInput'
import Modal from '@/components/Avator/Modal'
import DateOFBirthModal from '../../Modals/DateOFBirthModal'
import customAxios from '../../../utils/apis/apis'
import { useProfile } from '../../../context/UserContext'

function EditSubEvaluatorProfile({ countries }) {
  const [preview, setPreview] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [toggleCountry, setToggleCountry] = useState(false)
  const [searchQueryCountry, setSearchQueryCountry] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const router = useRouter()

  const { user, fetchProfile } = useProfile()
  useEffect(() => {
    fetchProfile()
  }, [])

  const initialValues = {
    name: user?.name || '',
    about: user?.about || '',
    role: user?.role || 'Sub Evaluator',
    country: user?.country || '',
    address: user?.address || '',
    phone: user?.phone || '',
    email: user?.email || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth
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
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['Male', 'Female', 'Other'], 'Invalid gender selection'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
  })

  const handleCloseModal = () => {
    setShowModal(false)
    if (selectedImage) {
      setPreview(selectedImage)
    }
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <div>
      <div className='custom-shadow rounded'>
        <div className='primary-gradient border border-black rounded px-12 overflow-x-auto'>
          <nav className='flex justify-between gap-3 w-full' aria-label='Tabs'>
            <button className='whitespace-nowrap py-4 cursor-pointer text-xl'>
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
          try {
            // ⚠️ Replace with actual endpoint when backend is ready
            const res = await customAxios.put(`/user/update/${user.uuid}`, {
              ...values,
            })

            if (res?.status === 200) {
              toast.success('Sub Evaluator updated successfully!')
              router.replace('/evaluator-profile')
            }
          } catch (error) {
            console.error(error.message)
            toast.error('Error updating profile')
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className='flex flex-col gap-5 mb-7'>
            <div className='flex'>
              <label className='w-[30%]'>Full Name</label>
              <Field
                type='text'
                name='name'
                placeholder='Full Name'
                className='shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity'
              />
              <ErrorMessage
                name='name'
                component='div'
                className='text-red-500'
              />
            </div>

            <div className='flex'>
              <label className='w-[30%]'>About</label>
              <Field
                type='text'
                name='about'
                as='textarea'
                placeholder='About'
                className='shadow-neons rounded resize-none w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity'
              />
              <ErrorMessage
                name='about'
                component='div'
                className='text-red-500'
              />
            </div>

            <div className='flex'>
              <label className='w-[30%]'>Role</label>
              <Field
                type='text'
                name='role'
                disabled
                className='bg-gray-100 text-gray-500 shadow-neons rounded w-full h-[48px] px-5'
              />
            </div>

            <div className='flex'>
              <label className='w-[30%]'>Country</label>
              <div className='w-full'>
                <DropdownInput
                  setToggle={setToggleCountry}
                  selectedValue={values.country}
                  dropdownOptions={countries.map((c) => c.country)}
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
              <Field
                type='text'
                name='address'
                placeholder='Address'
                className='shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity'
              />
              <ErrorMessage
                name='address'
                component='div'
                className='text-red-500'
              />
            </div>

            <div className='flex'>
              <label className='w-[30%]'>Phone</label>
              <Field
                type='text'
                name='phone'
                placeholder='Phone'
                className='shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity'
              />
              <ErrorMessage
                name='phone'
                component='div'
                className='text-red-500'
              />
            </div>

            <div className='flex'>
              <label className='w-[30%]'>Email</label>
              <Field
                type='text'
                name='email'
                placeholder='Email'
                className='shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity'
              />
              <ErrorMessage
                name='email'
                component='div'
                className='text-red-500'
              />
            </div>

            <div className='flex gap-2'>
              <label className='w-[30%]'>Gender</label>
              <div className='flex gap-6'>
                {['Male', 'Female', 'Other'].map((option, i) => (
                  <label key={i} className='flex items-center cursor-pointer'>
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
                component='div'
                className='text-red-500'
              />
            </div>

            <div className='flex'>
              <label className='w-[30%]'>Date of Birth</label>
              <div
                onClick={() => setIsOpen(true)}
                className='shadow-neons cursor-pointer flex items-center justify-between rounded w-full h-[48px] px-5 text-dark-grey outline-with-opacity'
              >
                <p>
                  {values.dateOfBirth
                    ? new Date(values.dateOfBirth).toLocaleDateString('en-US')
                    : 'Select Date of Birth'}
                </p>
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
                  <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
                  <line x1='16' y1='2' x2='16' y2='6' />
                  <line x1='8' y1='2' x2='8' y2='6' />
                  <line x1='3' y1='10' x2='21' y2='10' />
                </svg>
              </div>
            </div>

            <button
              type='submit'
              className='px-6 py-3 mx-auto block rounded primary-gradient text-white'
            >
              Save Changes
            </button>

            <Modal
              show={showModal}
              onClose={handleCloseModal}
              setSelectedImage={(avatarUrl) => {
                setSelectedImage(avatarUrl)
                setFieldValue('profileImage', avatarUrl)
              }}
              selectedImage={selectedImage}
            />

            {isOpen && (
              <DateOFBirthModal
                selectedDate={selectedDate}
                setDateAgain={setSelectedDate}
                setSelectedDate={(date) => {
                  setSelectedDate(date)
                  setFieldValue('dateOfBirth', date)
                }}
                closeModal={closeModal}
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditSubEvaluatorProfile
