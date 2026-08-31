import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { UploadIcon } from '@/components/Icons'
import axios from 'axios'
import { toast } from 'react-toastify'
import { handleVerificationUpload } from '@/libs/uploadAsset'
import DropdownInput from '@/components/Inputs/DropdownInput'
import Loader from '../../EvaluatorProfile/requestCompoenets/Loader'
import { formatNumberWithCommas } from '../../../../utils/global-functions/global'
import customAxios from '../../../../utils/apis/apis'
import { formatCityLabel } from '@/libs/dummyLocationData'

const BankForm = ({
  user,
  countries,
  cities,
  fetchCities,
  fetchData,
  setUser,
  searchQueryCity,
  setSearchQueryCity,
  setCountryCode,
}) => {
  const [fileName, setFileName] = useState('')
  const [toggleCity, setToggleCity] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toggleCountry, setToggleCountry] = useState(false)
  const [searchQueryCountry, setSearchQueryCountry] = useState('')

  const validationSchema = Yup.object({
    verificationCertificate: Yup.string().required('Pdf is required'),
    fundsVerification: Yup.string().required('Funds verification is required'),
    bankName: Yup.string().required('Bank name is required'),
    bankBranch: Yup.string().required('Bank branch is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
  })

  // Handle file selection and validation
  const handleFilechange = async (setFieldValue, e) => {
    const file = e.target.files[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF or Word document.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB.')
      return
    }

    try {
      setIsLoading(true)
      const fileUpload = await handleVerificationUpload(file)
      const certificateId = fileUpload?.certificate?._id

      if (certificateId) {
        setFieldValue('verificationCertificate', certificateId)
        toast.success('File uploaded successfully!')
        setFileName(file.name)
      } else {
        toast.error('Failed to upload document.')
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error(error?.message || 'Failed to upload document.')
    } finally {
      setIsLoading(false)
    }
  }
  // Set the initial file name for display
  useEffect(() => {
    if (user?.financialInfo?.verificationCertificate?.Certificate?.name) {
      setFileName(user.financialInfo.verificationCertificate.Certificate.name)
    }
  }, [user])

  useEffect(() => {
    if (user?.financialInfo?.country) {
      setSearchQueryCountry(user.financialInfo.country)
    }
  }, [user?.financialInfo?.country])

  useEffect(() => {
    if (user?.financialInfo?.city) {
      setSearchQueryCity(user.financialInfo.city)
    }
  }, [user?.financialInfo?.city, setSearchQueryCity])

  return (
    <div className='sm:px-8 px-4 pb-3 sm:py-6'>
      <h2 className='sm:text-lg text-base lg:text-xl font-medium text-white mb-4'>
        Bank Verification Details
      </h2>
      <Formik
        initialValues={{
          verificationCertificate:
            user?.financialInfo?.verificationCertificate?._id?.toString() ||
            user?.financialInfo?.verificationCertificate?.toString?.() ||
            '',
          fundsVerification: user?.financialInfo?.fundsVerification || null,
          bankName: user?.financialInfo?.bankName || '',
          bankBranch: user?.financialInfo?.bankBranch || '',
          city: user?.financialInfo?.city || '',
          country: user?.financialInfo?.country || '',
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            const financialInfo = {
              ...values,
              fundsVerification: String(values.fundsVerification || '').replace(
                /,/g,
                '',
              ),
            }
            const res = await customAxios.put(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/update/${user?.uuid}`,
              { financialInfo }
            )
            if (res?.status === 200) {
              toast.success(
                'Submitted for Super Admin approval. After approval you can see private listings.',
              )
              if (setUser && res.data) {
                setUser((prev) => ({ ...prev, ...res.data }))
              }
              fetchData()
            }
          } catch (error) {
            console.error(error.message)
            toast.error(error?.message)
          }
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className='sm:grid space-y-5 sm:space-y-0 sm:grid-cols-2 w-full gap-4'>
            {/* Bank Name */}
            <div>
              <Field
                type='text'
                name='bankName'
                placeholder='Bank Name'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
              />
              <ErrorMessage
                name='bankName'
                component='p'
                className='text-red-500 text-xs mt-1'
              />
            </div>

            {/* Bank Branch */}
            <div>
              <Field
                type='text'
                name='bankBranch'
                placeholder='Bank Branch'
                className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
              />
              <ErrorMessage
                name='bankBranch'
                component='p'
                className='text-red-500 text-xs mt-1'
              />
            </div>

            <DropdownInput
              setToggle={setToggleCountry}
              selectedValue={values.country || user?.financialInfo?.country}
              dropdownOptions={countries} // Pass full country objects
              onChange={(selectedCountry) => {
                setFieldValue('country', selectedCountry.country)
                setFieldValue('city', '')
                setSearchQueryCity('')
                setCountryCode(selectedCountry.code)
                setToggleCountry(false)
              }}
              toggle={toggleCountry}
              searchQuery={searchQueryCountry}
              setSearchQuery={setSearchQueryCountry}
              placeholder='Select a Country'
            />

            <DropdownInput
              setToggle={setToggleCity}
              selectedValue={values.city || user?.financialInfo?.city}
              dropdownOptions={cities?.map((city) =>
                formatCityLabel(city?.description || city),
              )}
              onChange={(selectedCity) => {
                setFieldValue('city', selectedCity)
                setSearchQueryCity(selectedCity)
                setToggleCity(false)
              }}
              toggle={toggleCity}
              searchQuery={searchQueryCity}
              setSearchQuery={setSearchQueryCity}
              placeholder='Select a City'
            />

            {/* Funds Verification */}
            <div>
              <Field name='fundsVerification'>
                {({ field, form }) => (
                  <input
                    type='text'
                    {...field} // Spread Formik's field props
                    placeholder='Funds Verification'
                    className='shadow-neons rounded w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity sm:placeholder:text-[15px] placeholder:text-xs sm:text-base text-sm placeholder:font-normal card-number-input'
                    value={formatNumberWithCommas(field.value)} // Format the displayed value
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, '') // Remove commas
                      form.setFieldValue('fundsVerification', rawValue) // Update the raw value in Formik
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name='fundsVerification'
                component='p'
                className='text-red-500 text-xs mt-1'
              />
            </div>

            {/* Verification Certificate */}
            <div className='flex flex-col w-full'>
              <div className='relative flex items-center'>
                {/* Hidden File Input */}
                <input
                  type='file'
                  id='verificationCertificate'
                  name='verificationCertificate'
                  accept='.pdf'
                  className='hidden'
                  onChange={(e) => handleFilechange(setFieldValue, e)}
                />
                {/* Custom Input */}
                <label
                  htmlFor='verificationCertificate'
                  className='shadow-neons w-full flex items-center justify-between py-3 px-4 rounded cursor-pointer text-sm border-0.5  outline-with-opacity placeholder:text-dark-grey'
                >
                  <span className='text-dark-grey'>
                    {fileName || 'Upload verification certificate'}
                  </span>
                  <UploadIcon className='h-8 w-6' />
                </label>
              </div>
              <ErrorMessage
                name='verificationCertificate'
                component='p'
                className='text-red-500 text-xs mt-1'
              />
            </div>

            <div className='flex col-span-2 justify-end items-center mt-10'>
              <button
                type='submit'
                disabled={isSubmitting || isLoading} // Disable if the form is submitting or loading
                className={`btn-gradient px-5 rounded py-2 mt-4 ${isSubmitting || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                  }`}
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <Loader isOpen={isLoading} />
    </div>
  )
}

export default BankForm
