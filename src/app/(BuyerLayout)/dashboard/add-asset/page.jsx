/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { routes } from '@/libs/api'
import { autoCapitalizeField } from '@/libs/autoCapitalizeText'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import NewListing from '@/components/global/NewListing'
import AddAssetOffPlanFields from '@/components/AddListing/AddAssetOffPlanFields'
import {
  boatCheckBoxFields,
  boatFormFields,
  carCheckBoxFields,
  carFormFields,
  globalFormInput,
  globalFormInputFields,
  offPlanGlobalFormInputFields,
  jewelleryCheckBoxFields,
  jewelleryFormFields,
  propertyCheckBoxFields,
  propertyFormFields,
  propertyLeaseFields,
  createDefaultOffPlanPaymentPlan,
  createEmptyOffPlanMedia,
  OFF_PLAN_MEDIA_KEYS,
  reindexOffPlanPaymentPlan,
  sanitizeOffPlanPaymentPlan,
  normalizePaymentPlanType,
  addOffPlanPaymentStep,
  removeOffPlanPaymentStep,
} from '@/constants/listing-data'
import TextInput from '@/components/AddListing/TextInput'
import FileUpload from '@/components/AddListing/FileUpload'
import DropdownInput from '@/components/AddListing/DropdownInput'
import PhoneInputField from '@/components/AddListing/PhoneInputField'
import CheckboxInput from '@/components/AddListing/CheckboxInput'
import BookingField from '@/components/AddListing/BookingField'
import ConfirmationModal from '@/components/AddListing/ConfirmationModal'
import ListingMapSection from '@/components/ListingsForm/ListingMapSection'
import FacilitiesChecklist from '@/components/property-listing/FacilitiesChecklist'
import { IoReload } from 'react-icons/io5'
import propertyAd from '@/assets/images/advertisement.png'
import { validateAsset, validateOffPlanAsset } from '../../../../utils/validateForms'
import {
  handleImageUpload,
  handleVideoUpload,
  handleFileUpload,
  handleThumbnailUpload,
} from '@/libs/uploadAsset'
import customAxios from '../../../../utils/apis/apis'
import {
  ensureWithinSize,
  isCompressionConfigured,
} from '@/libs/imageCompression'
import { listingMediaRef } from '@/libs/listingMediaRef'

export const dynamic = 'force-dynamic'
const Page = () => {
  const [isClient, setIsClient] = useState(false)
  // True while oversized images are being compressed via the API — blocks submit.
  const [isCompressing, setIsCompressing] = useState(false)

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
  const [offPlanMedia, setOffPlanMedia] = useState(createEmptyOffPlanMedia)
  const [agencyAgreementFile, setAgencyAgreementFile] = useState(null)
  const [totalPriceFrom, setTotalPriceFrom] = useState('')
  const [totalPriceTo, setTotalPriceTo] = useState('')

  const isOffPlan = formData.assetType === 'Property Off Plan For Sale'

  useEffect(() => {
    setFormData((prev) => {
      const next = {
        ...globalFormInput,
        assetType: prev.assetType,
      }
      if (prev.assetType === 'Property Off Plan For Sale') {
        next.paymentPlan = createDefaultOffPlanPaymentPlan()
      }
      return next
    })
    if (formData.assetType === 'Property Off Plan For Sale') {
      setOffPlanMedia(createEmptyOffPlanMedia())
    }
  }, [formData.assetType])

  useEffect(() => {
    if (formData?.priceFrom != null && formData.priceFrom !== '') {
      setTotalPriceFrom(
        new Intl.NumberFormat('en-US').format(String(formData.priceFrom)),
      )
    } else {
      setTotalPriceFrom('')
    }
    if (formData?.priceTo != null && formData.priceTo !== '') {
      setTotalPriceTo(
        new Intl.NumberFormat('en-US').format(String(formData.priceTo)),
      )
    } else {
      setTotalPriceTo('')
    }
  }, [formData?.priceFrom, formData?.priceTo])

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

  const getFileFormKey = (mediaType) => {
    if (mediaType === 'thumbnail') return 'thumbnailImg'
    if (mediaType === 'qrScan') return 'qrScan'
    return mediaType
  }

  // General input change handler
  const handleInputChange = (name, value) => {
    if (name === 'price' || name === 'priceFrom' || name === 'priceTo') {
      const rawValue = value.replace(/[^\d]/g, '').slice(0, 9)
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
      setFormData({ ...formData, [name]: autoCapitalizeField(name, value) })
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

  const handleDropdownSelect = (name, value) => {
    handleInputChange(name, value)
    setDropdownOpen('')
  }

  const handleOffPlanImageChange = (key) => (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    setOffPlanMedia((prev) => ({ ...prev, [key]: selectedFile }))
    event.target.value = null
  }

  const handleOffPlanImageRemove = (key) => {
    setOffPlanMedia((prev) => ({ ...prev, [key]: null }))
    setFormData((prev) => ({ ...prev, [key]: null }))
  }

  const handlePaymentPlanStepChange = (index, field, value) => {
    setFormData((prev) => {
      const plan = reindexOffPlanPaymentPlan(
        prev.paymentPlan?.length
          ? [...prev.paymentPlan]
          : createDefaultOffPlanPaymentPlan(),
      )
      plan[index] = { ...plan[index], [field]: value }
      return { ...prev, paymentPlan: reindexOffPlanPaymentPlan(plan) }
    })
  }

  const handlePaymentPlanStepRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      paymentPlan: removeOffPlanPaymentStep(prev.paymentPlan || [], index),
    }))
  }

  const handlePaymentPlanStepAdd = () => {
    setFormData((prev) => ({
      ...prev,
      paymentPlan: addOffPlanPaymentStep(prev.paymentPlan || []),
    }))
  }

  const getValidationErrors = () => {
    if (isOffPlan) {
      return validateOffPlanAsset(formData, offPlanGlobalFormInputFields)
    }
    return validateAsset(formData, globalFormInputFields)
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

  const handleFileChange = async (e, mediaType, maxSize = 2) => {
    const files = Array.from(e.target.files)
    const maxSizeInBytes = maxSize * 1024 * 1024
    const hasOversized = files.some((file) => file.size > maxSizeInBytes)

    let processed = files
    if (hasOversized) {
      // Videos aren't compressed, and if the compression API isn't configured
      // yet, keep the original reject behaviour.
      if (mediaType === 'video' || !isCompressionConfigured()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [mediaType]: `File size exceeds ${maxSize}MB.`,
        }))
        return
      }
      setIsCompressing(true)
      try {
        // Oversized images are sent to the compression API; await the results
        // before the user can proceed.
        processed = await Promise.all(
          files.map((file) => ensureWithinSize(file, maxSizeInBytes)),
        )
      } catch (err) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [mediaType]: err?.message || 'Image compression failed.',
        }))
        return
      } finally {
        setIsCompressing(false)
      }
    }

    // Reset errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [mediaType]: null,
    }))

    if (mediaType === 'thumbnail') {
      setFormData((prev) => ({
        ...prev,
        [getFileFormKey(mediaType)]: processed[0],
      }))
    } else if (mediaType === 'qrScan') {
      setFormData((prev) => ({
        ...prev,
        qrScan: processed[0],
      }))
    } else if (mediaType === 'pictures') {
      setFormData((prev) => ({
        ...prev,
        pictures: [...(prev.pictures || []), ...processed],
      }))
    } else if (mediaType === 'video') {
      setFormData((prev) => ({ ...prev, video: processed[0] }))
    }
  }

  // File removal handler
  const handleFileRemove = (mediaType, index) => {
    const formKey = getFileFormKey(mediaType)
    setFormData((prevFormData) => {
      if (mediaType === 'pictures') {
        const updatedPictures = (prevFormData.pictures || []).filter(
          (_, i) => i !== index,
        )

        return { ...prevFormData, pictures: updatedPictures }
      }
      return { ...prevFormData, [formKey]: null }
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
            key={field.formDataKey || field.mediaType}
            type={field.mediaType}
            label={field.label}
            acceptedFormats={field.acceptedFormats}
            maxSize={field.maxSize}
            required={field.required}
            files={
              formData[field.formDataKey || getFileFormKey(field.mediaType)] ||
              (field.mediaType === 'pictures' ? [] : null)
            }
            errors={errors}
            onFileChange={(e) =>
              handleFileChange(
                e,
                field.mediaType,
                field.mediaType === 'video' ? 5 : 2,
              )
            }
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

  const submitConfirmation = async () => {
    const validationErrors = getValidationErrors()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }
    setConfirmationModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const validationErrors = getValidationErrors()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      let uploadedImages = null
      if (formData.pictures && formData.pictures.length > 0) {
        uploadedImages = await handleImageUpload(formData.pictures)
      }

      let uploadedVideoID = null
      if (formData.video) {
        const videoUploadResponse = await handleVideoUpload(formData.video)
        uploadedVideoID = videoUploadResponse
      }

      let uploadedThumbnailID = null
      const thumbnailFile = formData.thumbnailImg || formData.thumbnail
      if (thumbnailFile) {
        uploadedThumbnailID = await handleThumbnailUpload(thumbnailFile)
      }

      let uploadedQrScanID = null
      if (formData.qrScan) {
        uploadedQrScanID = await handleImageUpload(
          Array.isArray(formData.qrScan) ? formData.qrScan : [formData.qrScan],
        )
      }

      let uploadedCertificateID = null
      if (formData.evaluationCertificate) {
        uploadedCertificateID = await handleFileUpload(
          formData.evaluationCertificate,
        )
      }

      let uploadedAgencyAgreementID = null
      if (isOffPlan && agencyAgreementFile instanceof File) {
        uploadedAgencyAgreementID = await handleFileUpload(agencyAgreementFile)
      }

      const offPlanMediaRefs = {}
      if (isOffPlan) {
        for (const key of OFF_PLAN_MEDIA_KEYS) {
          const media = offPlanMedia[key]
          if (media instanceof File) {
            const uploaded = await handleImageUpload([media])
            offPlanMediaRefs[key] = listingMediaRef(uploaded)
          }
        }
      }

      const finalFormData = {
        ...formData,
        pictures: listingMediaRef(uploadedImages),
        ...(uploadedVideoID && { video: listingMediaRef(uploadedVideoID) }),
        ...(uploadedThumbnailID && {
          thumbnailImg: listingMediaRef(uploadedThumbnailID),
        }),
        ...(uploadedQrScanID && {
          qrScan: listingMediaRef(uploadedQrScanID),
        }),
        ...(uploadedCertificateID && {
          evaluationCertificate: listingMediaRef(uploadedCertificateID),
        }),
        ...(uploadedAgencyAgreementID && {
          agencyAgreement: listingMediaRef(uploadedAgencyAgreementID),
        }),
        ...(isOffPlan && {
          priceFrom: formData.priceFrom ? Number(formData.priceFrom) : undefined,
          priceTo: formData.priceTo ? Number(formData.priceTo) : undefined,
          price: Number(formData.priceFrom || 0),
          sizeSQFT: formData.sizeSQFTFrom
            ? Number(formData.sizeSQFTFrom)
            : formData.sizeSQFT
              ? Number(formData.sizeSQFT)
              : 0,
          sizeSQM: formData.sizeSQMFrom
            ? Number(formData.sizeSQMFrom)
            : formData.sizeSQM
              ? Number(formData.sizeSQM)
              : 0,
          sizeSQFTFrom: formData.sizeSQFTFrom
            ? Number(formData.sizeSQFTFrom)
            : formData.sizeSQFT
              ? Number(formData.sizeSQFT)
              : undefined,
          sizeSQFTTo: formData.sizeSQFTTo
            ? Number(formData.sizeSQFTTo)
            : undefined,
          sizeSQMFrom: formData.sizeSQMFrom
            ? Number(formData.sizeSQMFrom)
            : formData.sizeSQM
              ? Number(formData.sizeSQM)
              : undefined,
          sizeSQMTo: formData.sizeSQMTo
            ? Number(formData.sizeSQMTo)
            : undefined,
          sizeUnit: formData.sizeUnit || formData.sizeType || 'SQFT',
          propertyForSale: 'Yes',
          facilities: Array.isArray(formData.facilities)
            ? formData.facilities.filter(Boolean)
            : [],
          paymentPlan: sanitizeOffPlanPaymentPlan(
            Array.isArray(formData.paymentPlan) ? formData.paymentPlan : [],
          ),
          paymentPlanType: normalizePaymentPlanType(formData.paymentPlanType),
          ...offPlanMediaRefs,
        }),
      }

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
        case 'Property Off Plan For Sale':
          apiRoute = routes.propertyListing
          break
        default:
          throw new Error('Invalid asset type')
      }

      // Submit the form data to the API
      const response = await customAxios.post(apiRoute, finalFormData)

      if (response?.data?.property || response?.status === 200 || response?.status === 201) {
        toast.success(
          isOffPlan
            ? 'Off-plan listing submitted. It is now live on the site.'
            : 'Asset created successfully!',
        )
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
          Final Steps to Listing Your Asset
        </h2>
        <div className='w-full min-w-full shadow-neons bg-white rounded-[5px]'>
          <NewListing formData={formData} setFormData={setFormData} />

          <form className='w-full  min-w-full p-10 grid grid-cols-1 lg:grid-cols-2 gap-5'>
            {(isOffPlan ? offPlanGlobalFormInputFields : globalFormInputFields).map(
              (field) => renderField(field),
            )}

            {isOffPlan && (
              <AddAssetOffPlanFields
                formData={formData}
                errors={errors}
                dropdownOpen={dropdownOpen}
                onDropdownOpen={handleDropdownOpen}
                onInputChange={handleInputChange}
                onSelectOption={handleDropdownSelect}
                totalPriceFrom={totalPriceFrom}
                totalPriceTo={totalPriceTo}
                offPlanMedia={offPlanMedia}
                onOffPlanImageChange={handleOffPlanImageChange}
                onOffPlanImageRemove={handleOffPlanImageRemove}
                onPaymentPlanStepChange={handlePaymentPlanStepChange}
                onPaymentPlanStepRemove={handlePaymentPlanStepRemove}
                onPaymentPlanStepAdd={handlePaymentPlanStepAdd}
                agencyAgreementFile={agencyAgreementFile}
                onAgencyAgreementChange={(e) => {
                  const selected = e.target.files?.[0]
                  e.target.value = null
                  if (!selected) return
                  if (selected.type !== 'application/pdf') {
                    toast.error('Please upload a PDF file for the agency agreement.')
                    return
                  }
                  setAgencyAgreementFile(selected)
                }}
                onAgencyAgreementRemove={() => {
                  setAgencyAgreementFile(null)
                  setFormData((prev) => ({ ...prev, agencyAgreement: null }))
                }}
              />
            )}

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
            {isOffPlan && (
              <>
                {propertyCheckBoxFields
                  .filter((field) => field.name === 'facilities')
                  .map((field) => (
                    <div
                      className='w-full p-4 col-span-2 space-y-4'
                      key={field.id}
                    >
                      <FacilitiesChecklist
                        title={field.heading}
                        presetFacilities={field?.checkboxes || []}
                        selectedFacilities={formData.facilities}
                        customFacilities={formData.customFacilities}
                        onCheckboxChange={handleCheckboxChange}
                        setFormData={setFormData}
                        gridClassName='grid grid-cols-2 gap-3 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                      />
                    </div>
                  ))}
                <div className='grid col-span-2 place-items-center mt-[49px]'>
                  <Image
                    width={1500}
                    quality={90}
                    className='w-[98%]'
                    height={700}
                    src={propertyAd}
                    alt='off-plan property'
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
          <ListingMapSection
            mapUrl={formData.mapUrl}
            handleChange={(e) =>
              handleInputChange(e.target.name, e.target.value)
            }
            iframeClassName='max-w-[1064px] w-full mx-auto h-[351px] rounded-[5px] shadow-neons'
            className='mt-[20px]'
          />

          <div className='grid place-items-center mt-[30px] pb-[65px]'>
            <button
              className={`text-whitee flex justify-center items-center text-xl font-medium w-[205px] h-[50px] rounded-[3px] bg-light-gold shadow-neons`}
              onClick={submitConfirmation}
              disabled={loading || isCompressing}
            >
              {loading || isCompressing ? (
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
