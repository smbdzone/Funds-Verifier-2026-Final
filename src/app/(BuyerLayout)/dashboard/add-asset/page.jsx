/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { routes } from '@/libs/api'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import NewListing from '@/components/global/NewListing'
import {
  boatCheckBoxFields,
  boatFormFields,
  carCheckBoxFields,
  carFormFields,
  globalFormInput,
  globalFormInputFields,
  jewelleryCheckBoxFields,
  jewelleryFormFields,
  propertyCheckBoxFields,
  propertyFormFields,
  propertyLeaseFields,
} from '@/constants/listing-data'
import TextInput from '@/components/AddListing/TextInput'
import FileUpload from '@/components/AddListing/FileUpload'
import DropdownInput from '@/components/AddListing/DropdownInput'
import PhoneInputField from '@/components/AddListing/PhoneInputField'
import CheckboxInput from '@/components/AddListing/CheckboxInput'
import BookingField from '@/components/AddListing/BookingField'
import ConfirmationModal from '@/components/AddListing/ConfirmationModal'
import { IoReload } from 'react-icons/io5'
import propertyAd from '@/assets/images/advertisement.png'
import { validateAsset } from '../../../../utils/validateForms'
import {
  handleImageUpload,
  handleVideoUpload,
  handleFileUpload,
  handleThumbnailUpload,
} from '@/libs/uploadAsset'
import customAxios from '../../../../utils/apis/apis'

export const dynamic = 'force-dynamic'
const Page = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  const [formData, setFormData] = useState(globalFormInput)
  const [dropdownOpen, setDropdownOpen] = useState('')
  const [selectedCountryPhone, setSelectedCountryPhone] = useState('AE')
  const [maxLength, setMaxLength] = useState(15)
  const [errors, setErrors] = useState({})
  const [modalData, setModalData] = useState([])
  const [activeModal, setActiveModal] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData((prev) => ({
      ...globalFormInput,
      assetType: prev.assetType,
    }))
  }, [formData.assetType])

  // Function to generate a slug
  const generateSlug = (title) => {
    if (typeof title === 'string') {
      return title
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]+/g, '')
    }
    return ''
  }

  useEffect(() => {
    if (formData.title) {
      const slug = generateSlug(formData.title)
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title])

  // Modal handling
  const openModal = (modalType) => {
    setActiveModal(modalType)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setActiveModal('')
  }

  // Phone number change handler
  const handlePhoneNumberChange = (phone) => {
    setFormData({ ...formData, phoneNumber: phone })
  }

  // Country change handler for phone input
  const handleCountryChange = (countryCode) => {
    setSelectedCountryPhone(countryCode)
  }

  // General input change handler
  const handleInputChange = (name, value) => {
    if (name === 'price') {
      const rawValue = value.replace(/[^\d]/g, '')
      if (/^\d*$/.test(rawValue)) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: rawValue,
        }))
      }
    } else if (name === 'sizeSQFT') {
      const numericValue = value.replace(/\D/g, '')
      setFormData({ ...formData, [name]: numericValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Checkbox change handling
  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target

    setFormData((prevFormData) => {
      const updatedField = prevFormData[fieldName] || []

      if (checked) {
        return {
          ...prevFormData,
          [fieldName]: [...updatedField, value],
        }
      } else {
        return {
          ...prevFormData,
          [fieldName]: updatedField.filter((item) => item !== value),
        }
      }
    })
  }

  // Dropdown open handling
  const handleDropdownOpen = (name) => {
    setDropdownOpen((prevOpen) => (prevOpen === name ? '' : name))
  }

  // Booking request handler
  const handleBookingRequest = (bookingData) => {
    setModalData((prevModalData) => {
      const modalIndex = prevModalData.findIndex(
        (modal) => modal.modalName === bookingData.modalName
      )
      if (modalIndex !== -1) {
        const updatedModalData = [...prevModalData]
        updatedModalData[modalIndex] = bookingData
        return updatedModalData
      } else {
        return [...prevModalData, bookingData]
      }
    })
  }

  const handleFileChange = (e, mediaType, maxSize) => {
    const files = Array.from(e.target.files)
    const maxSizeInBytes = maxSize * 1024 * 1024

    if (files.some((file) => file.size > maxSizeInBytes)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [mediaType]: `File size exceeds ${maxSize}MB.`,
      }))
      return
    }

    // Reset errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [mediaType]: null,
    }))

    if (mediaType === 'thumbnail') {
      setFormData((prev) => ({ ...prev, [mediaType]: files[0] }))
    } else if (mediaType === 'pictures') {
      setFormData((prev) => ({
        ...prev,
        pictures: [...(prev.pictures || []), ...files],
      }))
    } else if (mediaType === 'video') {
      setFormData((prev) => ({ ...prev, video: files[0] }))
    }
  }

  // File removal handler
  const handleFileRemove = (mediaType, index) => {
    setFormData((prevFormData) => {
      if (mediaType === 'pictures') {
        const updatedPictures = prevFormData.pictures.filter(
          (_, i) => i !== index
        )

        return { ...prevFormData, pictures: updatedPictures }
      } else {
        return { ...prevFormData, [mediaType]: null }
      }
    })
  }

  // Render form fields based on the type
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            type='text'
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            maxLength={field.maxLength}
            required={field.required}
            errors={errors}
          />
        )
      case 'number':
        return (
          <TextInput
            type='number'
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            maxLength={field.maxLength}
            required={field.required}
            unit={field?.unit}
            errors={errors}
          />
        )
      case 'textarea':
        return (
          <TextInput
            type='textarea'
            key={field.name}
            name={field.name}
            className={field?.className}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            maxLength={field.maxLength}
            required={field.required}
            errors={errors}
          />
        )
      case 'file':
        return (
          <FileUpload
            key={field.mediaType}
            type={field.mediaType}
            label={field.label}
            acceptedFormats={field.acceptedFormats}
            maxSize={field.maxSize}
            files={formData[field.mediaType] || []}
            errors={errors}
            onFileChange={(e) => handleFileChange(e, field.mediaType)}
            onFileRemove={handleFileRemove}
            formData={formData}
          />
        )
      case 'dropdown':
        return (
          <DropdownInput
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            options={field.options}
            onSelect={(value) => handleInputChange(field.name, value)}
            dropdownOpen={dropdownOpen}
            onDropdownOpen={handleDropdownOpen}
            required={field.required}
            errors={errors}
          />
        )
      case 'phoneNumber':
        return (
          <PhoneInputField
            value={formData[field.name] || ''}
            onChange={handlePhoneNumberChange}
            onCountryChange={handleCountryChange}
            defaultCountry='AE'
            country={selectedCountryPhone}
            maxLength={maxLength}
            errors={errors}
            formData={formData}
          />
        )
      case 'booking':
        return (
          <BookingField
            name={field.name}
            label={field.label}
            iconSrc={field.icon}
            formData={formData}
            modalData={modalData}
            setModalData={setModalData}
            handleChange={handleInputChange}
            handleOpenModal={() => openModal(field.name)}
            isModalOpen={activeModal === field.name}
            handleCloseModal={closeModal}
            placeholderText={field.placeholder}
            required={field.required}
            handleRequestModalData={handleBookingRequest}
            errors={errors}
          />
        )
      default:
        return null
    }
  }

  const submitConfirmation = async (e) => {
    {
      const validationErrors = validateAsset(formData, globalFormInputFields)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setLoading(false)
        return
      } else setConfirmationModal(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate form data before creating FormData object
    const validationErrors = validateAsset(formData, globalFormInputFields)

    // If there are validation errors, display them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      // Handle image uploads
      let uploadedImageIDs = []
      if (formData.pictures && formData.pictures.length > 0) {
        const imageUploadResponse = await handleImageUpload(formData.pictures)
        uploadedImageIDs.push(imageUploadResponse.uuid)
      }

      // Handle video upload
      let uploadedVideoID = null
      if (formData.video) {
        const videoUploadResponse = await handleVideoUpload(formData.video)
        uploadedVideoID = videoUploadResponse.uuid
      }

      // Handle thumbnail image upload
      let uploadedThumbnailID = null
      if (formData.thumbnailImg) {
        const thumbnailUploadResponse = await handleThumbnailUpload(
          formData.thumbnailImg
        )
        uploadedThumbnailID = thumbnailUploadResponse.uuid
      }

      // Handle evaluation certificate upload
      let uploadedCertificateID = null
      if (formData.evaluationCertificate) {
        const certificateUploadResponse = await handleFileUpload(
          formData.evaluationCertificate
        )
        uploadedCertificateID = certificateUploadResponse.uuid
      }

      // Prepare the final form data object
      const finalFormData = {
        ...formData,
        pictures: uploadedImageIDs,
        ...(uploadedVideoID && { video: uploadedVideoID }),
        ...(uploadedThumbnailID && { thumbnailImg: uploadedThumbnailID }),
        ...(uploadedCertificateID && {
          evaluationCertificate: uploadedCertificateID,
        }),
      }

      // Determine which API route to call based on asset type
      let apiRoute = ''
      switch (formData.assetType) {
        case 'Car For Sale':
          apiRoute = routes.carListing
          break
        case 'Boats For Sale':
          apiRoute = routes.boatListing
          break
        case 'Jewellery For Sale':
          apiRoute = routes.jewelryListing
          break
        case 'Property For Sale':
        case 'Property For Lease':
          apiRoute = routes.propertyListing
          break
        default:
          throw new Error('Invalid asset type')
      }

      // Submit the form data to the API
      const response = await customAxios.post(apiRoute, finalFormData)

      // Handle success response
      if (response.data.success) {
        toast.success('Asset created successfully!')
      } else {
        throw new Error('Error creating asset')
      }
    } catch (error) {
      // Handle error response
      toast.error('Error creating asset. Please try again.')
      console.error('API error:', error.response ? error.response.data : error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='py-10 px-20 flex flex-col items-center justify-center w-full'>
      <section className='w-full flex flex-col items-center justify-center gap-10'>
        <ToastContainer />
        <h2 className='w-full text-dark-grey text-center xl:text-[40px] lg:text-4xl md:text-3xl sm:text-2xl xxs:text-xl font-medium leading-normal '>
          Final Steps to / Listing Your Asset
        </h2>
        <div className='w-full min-w-full shadow-neons bg-white rounded-[5px]'>
          <NewListing formData={formData} setFormData={setFormData} />

          <form className='w-full  min-w-full p-10 grid grid-cols-1 lg:grid-cols-2 gap-5'>
            {globalFormInputFields.map((field) => renderField(field))}

            {formData.assetType === 'Property For Lease' &&
              propertyLeaseFields.map((field) => renderField(field))}
            {(formData.assetType === 'Property For Sale' ||
              formData.assetType === 'Property For Lease') && (
              <>
                {propertyFormFields.map((field) => renderField(field))}
                {propertyCheckBoxFields.map((field) => (
                  <div
                    className='w-full  p-4 col-span-2 space-y-4'
                    key={field.id}
                  >
                    <h2 className='text-dark-black text-xl font-medium'>
                      {field.heading}
                    </h2>
                    <div className='grid grid-cols-6 gap-3 w-full'>
                      {field?.checkboxes?.map((opt, index) => (
                        <CheckboxInput
                          key={index}
                          label={opt}
                          value={opt}
                          checked={formData[field.name]?.includes(opt) || false}
                          onChange={(e) => handleCheckboxChange(e, field.name)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className='grid col-span-2 place-items-center mt-[49px]'>
                  <Image
                    width={1500}
                    quality={90}
                    className='w-[98%]'
                    height={700}
                    src={propertyAd}
                    alt='property'
                  />
                </div>
              </>
            )}
            {formData.assetType === 'Car For Sale' && (
              <>
                {carFormFields.map((field) => renderField(field))}
                {carCheckBoxFields.map((field) => (
                  <div
                    className='w-full p-4 col-span-2 space-y-4'
                    key={field.id}
                  >
                    <h2 className='text-dark-black text-xl font-medium'>
                      {field.heading}
                    </h2>
                    <div className='grid grid-cols-6 gap-3 w-full'>
                      {field?.checkboxes?.map((opt, index) => (
                        <CheckboxInput
                          key={index}
                          label={opt}
                          value={opt}
                          checked={formData[field.name]?.includes(opt) || false}
                          onChange={(e) => handleCheckboxChange(e, field.name)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className='grid col-span-2 place-items-center mt-[49px]'>
                  <Image
                    width={1500}
                    quality={90}
                    className='w-[98%]'
                    height={700}
                    src='/listing/car.png'
                    alt='car'
                  />
                </div>
              </>
            )}
            {formData.assetType === 'Boats For Sale' && (
              <>
                {boatFormFields.map((field) => renderField(field))}
                {boatCheckBoxFields.map((field) => (
                  <div
                    className='w-full p-4 col-span-2 space-y-4'
                    key={field.id}
                  >
                    <h2 className='text-dark-black text-xl font-medium'>
                      {field.heading}
                    </h2>
                    <div className='grid grid-cols-6 gap-3 w-full'>
                      {field?.checkboxes?.map((opt, index) => (
                        <CheckboxInput
                          key={index}
                          label={opt}
                          value={opt}
                          checked={formData[field.name]?.includes(opt) || false}
                          onChange={(e) => handleCheckboxChange(e, field.name)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className='grid col-span-2 place-items-center mt-[30px]'>
                  <Image
                    width={1500}
                    quality={90}
                    className='w-[98%]'
                    height={700}
                    src='/listing/boat.png'
                    alt='boat'
                  />
                </div>
              </>
            )}
            {formData.assetType === 'Jewellery For Sale' && (
              <>
                {jewelleryFormFields.map((field) => renderField(field))}
                {jewelleryCheckBoxFields.map((field) => (
                  <div
                    className='w-full p-4 col-span-2 space-y-4'
                    key={field.id}
                  >
                    <h2 className='text-dark-black text-xl font-medium'>
                      {field.heading}
                    </h2>
                    <div className='grid grid-cols-6 gap-3 w-full'>
                      {field?.checkboxes?.map((opt, index) => (
                        <CheckboxInput
                          key={index}
                          label={opt}
                          value={opt}
                          checked={formData[field.name]?.includes(opt) || false}
                          onChange={(e) => handleCheckboxChange(e, field.name)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className='grid col-span-2 place-items-center mt-[30px]'>
                  <Image
                    width={1500}
                    quality={90}
                    className='w-[98%]'
                    height={700}
                    src='/listing/jewelery.png'
                    alt='jewelery'
                  />
                </div>
              </>
            )}
          </form>

          {/* map  */}
          <div className=' mt-[20px]'>
            <iframe
              className='max-w-[1064px] w-full mx-auto h-[351px] rounded-[5px] shadow-neons'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231280.4131872353!2d55.06267954491565!3d25.0762424478002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1716351024030!5m2!1sen!2s'
              allowFullScreen
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            />
          </div>

          <div className='grid place-items-center mt-[30px] pb-[65px]'>
            <button
              className={`text-whitee flex justify-center items-center text-xl font-medium w-[205px] h-[50px] rounded-[3px] bg-light-gold shadow-neons`}
              onClick={submitConfirmation}
              disabled={loading}
            >
              {loading ? (
                <IoReload size={24} className='animate-spin' />
              ) : (
                'Submit'
              )}
            </button>
            {confirmationModal && (
              <ConfirmationModal
                show={confirmationModal}
                onSubmit={handleSubmit}
                onClose={() => setConfirmationModal(false)}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page
