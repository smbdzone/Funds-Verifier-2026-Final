import { Formik, Field, Form } from 'formik'
import Modal from '@/components/Avator/Modal'
import { useState } from 'react'
import { CloseDisclosure } from '@/components/Icons'
import Select from 'react-select'
import { toast } from 'react-toastify'
import customAxios from '../../../../utils/apis/apis'

const formatDateForInput = (date) => {
  if (!date) return ''
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return ''
  return parsed.toISOString().split('T')[0]
}

const PersonalInfoForm = ({ user, setUser, fetchData }) => {
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const maritalOptions = [
    { value: '', label: 'Select Marital Status' },
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
  ]

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      height: '48px',
      minHeight: '48px',
      borderRadius: '6px',
      paddingLeft: '10px',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      border: 'none',
      outline: state.isFocused ? '2px solid rgba(255,255,255,0.3)' : 'none',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#A0A0A0',
      fontSize: '14px',
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '14px',
      color: '#000',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingRight: '10px',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#fff',
      color: '#000',
      zIndex: 50,
    }),
  }

  return (
    <div className='sm:px-8 px-4 pb-3 sm:py-6'>
      <h2 className='sm:text-lg text-base lg:text-xl font-medium text-white mb-4'>
        Personal Information
      </h2>

      <Formik
        initialValues={{
          name: user?.name || '',
          lastname: user?.lastname || '',
          phone: user?.phone || '',
          email: user?.email || '',
          maritalStatus: user?.maritalStatus || 'le',
          dateOfBirth: formatDateForInput(user?.dateOfBirth),
          profileImage: user?.profileImage || '',
        }}
        enableReinitialize
        onSubmit={async (values) => {

          try {
            const res = await customAxios.put(
              `/user/update/${user?.uuid}`,
              values
            )
            if (res?.status === 200) {
              setUser(res?.data)
              toast.success('Personal Information Updated Successfully')
              fetchData()
            }
          } catch (error) {
            console.error(error.message)
            toast.error(error?.message)
          }
        }}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form className='sm:grid space-y-5 sm:space-y-0 sm:grid-cols-2 w-full gap-4'>
            {/* First Name */}
            <div>
              <Field
                type='text'
                name='name'
                readOnly={true}
                placeholder='First Name'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
              />
            </div>

            {/* Last Name */}
            <div>
              <Field
                type='text'
                name='lastname'
                readOnly={true}
                placeholder='Last Name'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
              />
            </div>

            {/* Phone */}
            <div>
              <Field
                type='text'
                name='phone'
                readOnly={true}
                placeholder='Phone Number'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
              />
            </div>

            {/* Email */}
            <div>
              <Field
                type='email'
                name='email'
                readOnly={true}
                placeholder='Email Address'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
              />
            </div>

            {/* ID Number — first 8 of uuid, display only */}
            <div>
              <label className='block text-sm font-medium mb-1 text-white'>
                ID Number
              </label>
              <input
                type='text'
                value={
                  typeof user?.uuid === 'string' && user.uuid
                    ? user.uuid.slice(0, 8).toUpperCase()
                    : ''
                }
                readOnly
                disabled
                placeholder='ID Number'
                aria-label='ID Number'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input cursor-not-allowed opacity-80'
              />
            </div>

            {/* Marital Status (react-select) */}
            <div className='shadow-neons rounded card-number-input'>
              <Select
                name='maritalStatus'
                options={maritalOptions}
                value={maritalOptions.find(
                  (option) => option.value === values.maritalStatus
                )}
                onChange={(option) =>
                  setFieldValue('maritalStatus', option.value)
                }
                styles={customSelectStyles}
                className='h-[48px]'
              />
              {errors.maritalStatus && touched.maritalStatus && (
                <div className='text-red-500 text-sm'>
                  {errors.maritalStatus}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Field
                type='date'
                name='dateOfBirth'
                placeholder='Date of Birth'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
              />
            </div>

            {/* Avatar */}
            <div>
              <div
                onClick={() => setShowModal(true)}
                className='flex justify-between items-center shadow-neons rounded w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input cursor-pointer'
              >
                Avatar
                <CloseDisclosure className='text-black h-3 w-3' />
              </div>
            </div>

            {/* Submit button */}
            <div className='flex col-span-2 justify-end items-center mt-10'>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`btn-gradient px-5 rounded py-2 mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Save
              </button>
            </div>

            {/* Modal */}
            <Modal
              show={showModal}
              onClose={handleCloseModal}
              setSelectedImage={(avatarUrl) => {
                setSelectedImage(avatarUrl)
                setFieldValue('profileImage', avatarUrl)
              }}
              selectedImage={selectedImage}
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PersonalInfoForm
