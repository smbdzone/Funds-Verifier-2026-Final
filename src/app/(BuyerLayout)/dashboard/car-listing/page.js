'use client'
import Listing from '@/components/global/Listing'
import {
  handleFileUpload,
  handleImageUpload,
  handleThumbnailUpload,
  handleVideoUpload,
} from '@/libs/uploadAsset'
import { autoCapitalizeField } from '@/libs/autoCapitalizeText'
import { flagListingPendingApprovalNotice } from '@/libs/listingPendingApprovalNotice'
import {
  applyPremiumServiceRefs,
  listingMediaRef,
  premiumServiceRequestId,
  stripEmptyObjectIdRefs,
} from '@/libs/listingMediaRef'
import {
  hasConfirmedEvaluationPayment,
  bookEvaluationTimeslotFromFormData,
  stripEvaluationBookingMeta,
} from '@/libs/evaluationBooking'
import { carBrands } from '@/utils'
import axios from 'axios'
import { Suspense, useContext, useEffect, useMemo, useState } from 'react'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ListingsLowerComponent from '@/components/ListingsForm/ListingsLowerComponent'
import ChecksLayoutComponent from '@/components/ListingFormInput/ChecksLayoutComponent'
import CarListingForm from '@/components/ListingsForm/CarListingForm'
import {
  fuelTypeOptions,
  colors,
  technicalFeatures,
  extras,
  // carForSaleDropdown,
} from '@/constants/car-listings'
import PaymentModal from '@/components/payments/PaymentModal'
import { ListingContext } from '@/components/ListingContext/ListingsProvider'
import { useRouter } from 'next/navigation'
import PayModal from '../../../../components/Modals/PayModal'
import { useProfile } from '../../../../context/UserContext'
import StripeElement from '../../../../components/Stripe/StripeElement'
import { useRefreshListingAfterServicePayment } from '@/hooks/useRefreshListingAfterServicePayment'
import { useRestoreListingAfterClozerPayment } from '@/hooks/useRestoreListingAfterClozerPayment'
import {
  useRestorePendingListingDraft,
  useRefetchListingOnReturn,
} from '@/hooks/useRestorePendingListingDraft'
import { useAutoFinalizeAfterEvaluationPayment } from '@/hooks/useAutoFinalizeAfterEvaluationPayment'
import {
  clearListingWorkspaceStorage,
  hasPendingListingDraft,
  isPendingDraftForListingRoute,
} from '@/libs/pendingListingDraft'
import {
  isListingEvaluatorApprovedLocked,
  buildApprovedAssetHolderUpdatePayload,
} from '@/libs/listingEditLock'
import customAxios from '../../../../utils/apis/apis'

const initialFormData = {
  assetType: 'Car For Sale',
  country: '',
  city: '',
  neighbourhood: '',
  make: '',
  model: '',
  type: '',
  size: '',
  title: '',
  price: '',
  phoneNumber: '',
  fuelType: '',
  description: '',
  kilometers: '',
  year: '',
  warranty: '',
  carType: '',
  sellerType: '',
  bodyType: '',
  bodyCondition: '',
  noofCylinders: '',
  mechanicalCondition: '',
  evaluationCompanies: '',
  seats: '',
  doors: '',
  horsepower: '',
  steeringSide: '',
  transmissionType: '',
  engineCapacity: '',
  capacityWeight: '',
  pictures: null,
  video: null,
  thumbnailImg: null,
  qrScan: null,
  VIN: '',
  exteriorColor: [String],
  interiorColor: [String],
  technicalFeatures: [String],
  extras: [String],
  technicalReport: '',
  evaluationDateTime: '',
  mapUrl: '',
}
const dropdownData = {
  warranty: false,
  bodyCondition: false,
  ies: false,
  doors: false,
  noofCylinders: false,
  horsepower: false,
  seats: false,
  steeringSide: false,
  transmissionType: false,
  engineCapacity: false,
  capacityWeight: false,
  VIN: false,
  bodyType: false,
  fuelType: false,
}

function Page() {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [carListings, setCarListings] = useState(['Private', 'Public'])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { user } = useProfile()
  const [showPayment, setShowPayment] = useState(false)

  const [models, setModels] = useState(['2024', '2023', '2022', '2021', '2020'])
  const [makeDropdownVisible, setMakeDropdownVisible] = useState(false)
  const [selectedMake, setSelectedMake] = useState('All')
  const [makes, setMakes] = useState([...carBrands])
  const router = useRouter()
  const {
    countries,
    selectedCountry,
    handleCountrySelect,
    isOpen,
    searchParams,
    cities,
    dropdowns,
    neighbourhoods,
    toggleCityDropdown,
    toggleDropdownn,
    toggleModelDropdown,
    toggleNeighbourDropdown,
    totalprice,
    totalSize,
    handleToggleDropdown,
    selectedNeighbourhood,
    isCityDropdownOpen,
    isNeighbourDropdownOpen,
    selectedModel,
    modelDropdownVisible,
    searchQuery,
    searchQueryCity,
    searchQueryNeighbourhood,
    setSearchQueryNeighbourhood,
    setSearchQuery,
    setSearchQueryCity,
    handleCitySelect,
    handleModelClick,
    handleNeighbour,
    handleSelectOption,
    selectedCity,
    handleMouseLeave,
    loading,
    errors,
    phoneNumber,
    thumbnail,
    qrScan,
    handleOpenModal,
    handleThumbImageRemove,
    handleThumbImageChange,
    handleQrScanChange,
    handleQrScanRemove,
    handleCountryChange,
    selectedCountryPhone,
    maxLength,
    handleImageChange,
    images,
    handleImageRemove,
    fileInputRef,
    isModalOpen,
    handleCloseModal,
    handleRequestModalData,
    handleOpenModal1,
    setLoading,
    isModal1Open,
    technicalModalData,
    isTechnicalModalOpen,
    handleRequestTechnicalModalData,
    handleClose1Modal,
    modalData,
    resetPremiumPaymentDrafts,
    handleVideoChange,
    handlePhoneNumberChange,
    id,
    handleRadioChange,
    handleCheckboxChange,
    confirmationModal,
    setConfirmationModal,
    formData,
    setFormData,
    isValidState,
    handleFormData,
    setErrors,
    videos,
    file,
    handleScroll,
    setTotalPrice,
    setIsTechnicalModalOpen,
    fetchData,
    setVideo,
    resetForm,
    setImages,
    setThumbnail,
    setVideos,
    setQrScan,
    setSelectedCountry,
    setSelectedCity,
    setSelectedNeighbourhood,
    setCountryCode,
    setPhoneNumber,
    setSelectedModel,
  } = useContext(ListingContext)

  const listingDraftRestoreApi = useMemo(
    () => ({
      setFormData,
      setImages,
      setThumbnail,
      setVideos,
      setQrScan,
      setSelectedCountry,
      setSelectedCity,
      setSelectedNeighbourhood,
      setCountryCode,
      setPhoneNumber,
      setTotalPrice,
      setSelectedMake,
      setSelectedModel,
    }),
    [
      setFormData,
      setImages,
      setThumbnail,
      setVideos,
      setQrScan,
      setSelectedCountry,
      setSelectedCity,
      setSelectedNeighbourhood,
      setCountryCode,
      setPhoneNumber,
      setTotalPrice,
      setSelectedModel,
    ],
  )

  useEffect(() => {
    if (id) {
      fetchData('car')
      return
    }

    // Keep draft only when it belongs to car listing (not property/boat/jewelry).
    if (hasPendingListingDraft() && isPendingDraftForListingRoute('car')) {
      setLoading(false)
      return
    }

    if (hasPendingListingDraft()) {
      clearListingWorkspaceStorage()
    }

    resetForm()
    setFormData(initialFormData)
    handleFormData(initialFormData, dropdownData)
    setLoading(false)
  }, [searchParams])

  useEffect(() => {
    if (id && formData?.make) {
      setSelectedMake(formData.make)
    }
  }, [id, formData?.make])

  useRefreshListingAfterServicePayment(id, 'car', fetchData)
  useRestoreListingAfterClozerPayment(listingDraftRestoreApi)
  useRestorePendingListingDraft(id, listingDraftRestoreApi, 'car')
  useRefetchListingOnReturn(id, 'car', fetchData)

  const handleTechnicalModal = () => {
    setIsTechnicalModalOpen(!isTechnicalModalOpen)
  }

  const handleCloseTechnicalModal = () => {
    setIsTechnicalModalOpen(false)
  }

  const filteredCountries = countries.filter((country) =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVideoRemove = () => {
    setVideo(null)
  }

  const submitConfirmation = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm(formData)

    if (id) {
      finalizeSubmission()
      return
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      handleScroll()
      return
    }
    if (!formData?.evaluationDateTime) {
      toast.error('Evaluation Date and time is required!')
      return
    }
    setConfirmationModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsOpenModal(false)
    if (!id) {
      if (!images?.length) {
        toast.error('At least one image is required.')
        setLoading(false)
        throw new Error('Image is required')
      }
      if (!formData?.evaluationDateTime) {
        toast.error('Evalaution required.')
        setLoading(false)
        throw new Error('Evalaution required')
      }

      if (!thumbnail) {
        toast.error('Thumbnail image is required.')
        setLoading(false)
        throw new Error('Thumbnail is required')
      }

      try {
        const sessionRaw = localStorage.getItem('checkoutSession')
        const session = sessionRaw ? JSON.parse(sessionRaw) : null
        if (
          hasConfirmedEvaluationPayment(formData) ||
          hasConfirmedEvaluationPayment(session)
        ) {
          setLoading(true)
          setConfirmationModal(false)
          setShowPayment(false)
          finalizeSubmission()
          return
        }
      } catch {
        /* ignore */
      }

      return setShowPayment(true)
    }
  }

  const HandleFormSubmit = async () => {
    try {
      if (isValidState(technicalModalData) || isValidState(modalData)) {
        const paymentItem = JSON.parse(localStorage.getItem('FormPayment'))
        const sessionId = JSON.stringify(
          localStorage.getItem('checkoutSessionId')
        )
        if (!JSON.parse(sessionId) || JSON.parse(sessionId) === null) {
          setIsOpenModal(true)
        } else {
          const sessionData = await fetchTransactionData(sessionId)
          setIsOpenModal(false)
          if (sessionData.payment_status === 'paid') {
            setLoading(true)
            finalizeSubmission(
              paymentItem.payment_method_status === 'paid' ||
              paymentItem.payment_method_status === 'succeeded',
            )
          } else {
            setIsOpenModal(true)
          }
        }
      } else {
        setLoading(true)
        setConfirmationModal(false)
        setShowPayment(false)
        setIsOpenModal(false)
        finalizeSubmission()
      }
    } catch (error) {
      console.error('Error during form submission:', error?.message)
      toast.error(error?.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const finalizeSubmission = async (isPaymentSuccessful) => {
    try {
      const requests = []
      let video3DWalkthroughID = null
      let technicalReportID = null

      // Only call request3D and technicalReport APIs if payment is successful
      if (isPaymentSuccessful) {
        const paymentItem = JSON.parse(localStorage.getItem('FormPayment') || '{}')
        const paidPayload = {
          payment_method_status:
            paymentItem.payment_method_status === 'paid' ||
              paymentItem.payment_method_status === 'succeeded'
              ? 'paid'
              : paymentItem.payment_method_status || 'paid',
          payment_details: paymentItem.payment_details,
          productUUID: id || formData?.uuid,
          assetType: formData?.assetType,
        }

        if (isValidState(modalData)) {
          const request3DResponse = await customAxios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/request3d/walkthrough-request`,
            { ...modalData, ...paidPayload }
          )
          video3DWalkthroughID = premiumServiceRequestId(
            request3DResponse?.data?.request,
          )
        }

        if (isValidState(technicalModalData)) {
          const technicalReportResponse = await customAxios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report`,
            { ...technicalModalData, ...paidPayload }
          )
          technicalReportID = premiumServiceRequestId(
            technicalReportResponse?.data?.report,
          )
        }
      }

      if (!id) {
        const checkoutSession = JSON.parse(
          localStorage.getItem('checkoutSession') || 'null'
        )
        if (!hasConfirmedEvaluationPayment(checkoutSession)) {
          return toast.error('Evaluation payment is required before submitting.')
        }
      }
      setConfirmationModal(false)

      // ✅ Upload files only for NEW listings (no `id`)
      let imageID = formData?.pictures
      let thumbnailID = formData?.thumbnailImg
      let videoID = formData?.video
      let fileID = formData?.evaluationCertificate
      let qrScanID = formData?.qrScan
      // Upload new files only if creating a new property (no id)
      if (!id) {
        const [
          uploadedImages,
          uploadedVideo,
          uploadedFile,
          uploadedThumbnail,
          uploadedQrScan,
        ] = await Promise.all([
          images.length > 0 ? handleImageUpload(images) : imageID,
          videos.length ? handleVideoUpload(videos) : videoID,
          file ? handleFileUpload(file) : fileID,
          thumbnail instanceof File
            ? handleThumbnailUpload(thumbnail)
            : thumbnailID,
          qrScan instanceof File ? handleImageUpload([qrScan]) : qrScanID,
        ])

        imageID = uploadedImages
        videoID = uploadedVideo
        fileID = uploadedFile
        thumbnailID = uploadedThumbnail
        qrScanID = uploadedQrScan
      } else {
        // For updates: only re-upload media that changed
        const newVideos = videos.filter((v) => v instanceof File)
        if (newVideos.length) videoID = await handleVideoUpload(newVideos)
        if (file) fileID = await handleFileUpload(file)
        if (thumbnail instanceof File) {
          thumbnailID = await handleThumbnailUpload(thumbnail)
        }
        if (qrScan instanceof File) {
          qrScanID = await handleImageUpload([qrScan])
        }
      }

      // Prepare form data
      const updatedFormData = {
        ...formData,
        userUUID: user?.uuid,
        pictures:
          listingMediaRef(imageID) ?? listingMediaRef(formData?.pictures),
        video: listingMediaRef(videoID) ?? listingMediaRef(formData?.video),
        evaluationCertificate:
          listingMediaRef(fileID) ??
          listingMediaRef(formData?.evaluationCertificate),
        thumbnailImg:
          listingMediaRef(thumbnailID) ??
          listingMediaRef(thumbnail) ??
          listingMediaRef(formData?.thumbnailImg),
        qrScan: listingMediaRef(qrScanID) ?? listingMediaRef(qrScan) ?? listingMediaRef(formData?.qrScan),
        feedback: 'feedback',
      }

      applyPremiumServiceRefs(updatedFormData, formData, {
        video3DWalkthroughID,
        technicalReportID,
      })

      // Validate form data
      const validationErrors = validateForm(updatedFormData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        handleScroll()
        setLoading(false)
        return
      }

      // Submit data
      const listingPayload = stripEmptyObjectIdRefs(
        stripEvaluationBookingMeta(updatedFormData),
      )
      const payloadToSave =
        id && isListingEvaluatorApprovedLocked(formData)
          ? stripEmptyObjectIdRefs(
            buildApprovedAssetHolderUpdatePayload(listingPayload),
          )
          : listingPayload

      if (id) {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/car/${id}`,
          payloadToSave
        )
        toast.success('Updated successfully.')
      } else {
        await bookEvaluationTimeslotFromFormData(formData)
        await Promise.all([
          customAxios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/car`,
            listingPayload
          ),
        ])
        toast.success('Submitted successfully. Evaluator will evaluate it.')
        flagListingPendingApprovalNotice({ assetKind: 'car' })
        resetForm()
        setFormData(initialFormData)
        localStorage.removeItem('FormPayment')
        localStorage.removeItem('checkoutSessionId')
        localStorage.removeItem('checkoutSession')
        localStorage.removeItem('pendingListingDraft')
      }

      setLoading(false)
      router.push('/seller-profile/my-listing')
      // router.push("/");
    } catch (error) {
      console.error('Error during final form submission:', error)
      toast.error(
        error?.message || 'An error occurred during submission. Please try again.',
      )
      setLoading(false)
    }
  }

  useAutoFinalizeAfterEvaluationPayment({
    listingId: id,
    formData,
    images,
    thumbnail,
    finalizeSubmission,
    setLoading,
    setShowPayment,
    setConfirmationModal,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'price') {
      const rawValue = value.replace(/,/g, '')
      if (/^\d*$/.test(rawValue)) {
        setFormData({ ...formData, [name]: rawValue })
        const formattedValue = new Intl.NumberFormat('en-US').format(rawValue)
        setTotalPrice(formattedValue) // This will format the displayed price
      }
    } else {
      setFormData({ ...formData, [name]: autoCapitalizeField(name, value) })
    }
  }

  const validateForm = (data) => {
    const errors = {}
    if (images?.length === 0) errors.pictures = 'Pictures are Required'
    // if (!data.evaluationDateTime) {
    //   errors.evaluationDateTime = "Please select a date and time.";
    // }
    if (!thumbnail) errors.thumbnail = 'Thumbnail are Required'
    if (!qrScan) errors.qrScan = 'QR Scan is required'
    if (!data?.assetType || data?.assetType === 'Select Asset Type')
      errors.assetType = 'Asset Type is required'
    if (!data?.country) errors.country = 'Country is required'
    if (!data?.city) errors.city = 'City is required'
    if (!data?.neighbourhood) errors.neighbourhood = 'Neighbourhood is required'
    if (!data?.make) errors.make = 'Make is required'
    if (!data?.model) errors.model = 'Model is required'
    if (!data?.size) errors.size = 'Size is required'
    if (!String(data?.title || '').trim()) {
      errors.title = 'Title is required'
    } else if (data?.title?.length > 60) {
      errors.title = 'Title must be less than 60 characters'
    }
    if (!String(data?.price || '') && !totalprice) {
      errors.price = 'Price is required'
    } else if (parseInt(totalprice) === 0) {
      errors.price = 'Price is invalid'
    }
    if (!data?.phoneNumber) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!isValidPhoneNumber(data?.phoneNumber)) {
      errors.phoneNumber = 'Phone number is invalid'
    }
    if (!data?.fuelType) errors.fuelType = 'Fuel type is required'
    if (!String(data.description || '')) {
      errors.description = 'Description is required'
    } else if (data?.description?.length > 300) {
      errors.description = 'Description cannot exceed 300 characters.'
    }
    if (!data?.kilometers) errors.kilometers = 'Kilometers is required'
    if (!data?.size) errors.size = 'Size is required'
    if (!data?.year) errors.year = 'Year is required'
    if (!data?.warranty) errors.warranty = 'Warranty is required'
    // if (!data?.bodyType) errors.bodyType = "Body type is required";
    if (!data?.bodyCondition)
      errors.bodyCondition = 'Body condition is required'
    if (!data?.noofCylinders)
      errors.noofCylinders = 'Number of cylinders is required'
    if (!data?.carType) errors.carType = 'Car Type is required'
    if (!data?.seats) errors.seats = 'Seats are required'
    if (!data?.doors) errors.doors = 'Doors is required'
    if (!data?.steeringSide) errors.steeringSide = 'Steering side is required'
    if (!data?.transmissionType)
      errors.transmissionType = 'Transmission type is required'
    if (!data?.VIN) errors.VIN = 'VIN is required'

    return errors
  }

  const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber && phoneNumber.length >= 10
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'title':
        if (!value) {
          error = 'Title is required.'
        } else if (value.length > 60) {
          error = 'Title cannot exceed 60 characters.'
        }
        break
      case 'phoneNumber':
        if (!value.trim()) {
          error = 'Phone number is required'
        } else if (!isValidPhoneNumber(value)) {
          error = 'Phone number is invalid'
        }
        break
      case 'price':
        if (!value.trim()) {
          error = 'Price is required'
        } else if (parseInt(value.trim()) === 0) {
          error = 'price is invalid'
        }
        break
      case 'description':
        if (!value.trim()) {
          error = 'Description is required'
        } else if (value.length > 300) {
          error = 'Description cannot exceed 300 characters.'
        }
        break
      case 'kilometers':
        if (!value.trim()) {
          error = 'kilometers is required'
        }
        break
      case 'size':
        if (!value.trim()) {
          error = 'Size is required'
        }
        break
      case 'year':
        if (!value.trim()) {
          error = 'year is required'
        }
        break
      case 'VIN':
        if (!value.trim()) {
          error = 'VIN is required'
        }
        break
      default:
        break
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const toggleMakeDropdown = () => {
    setMakeDropdownVisible(!makeDropdownVisible)
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  const handleMakeClick = (make) => {
    setSelectedMake(make)
    setMakeDropdownVisible(false)
    setFormData((prevFormData) => ({
      ...prevFormData,
      make: make,
    }))
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <section>
          {isOpenModal && !id && (
            <PayModal
              modalData={modalData}
              technicalModalData={technicalModalData}
              setIsOpenModal={setIsOpenModal}
              isValidState={isValidState}
              onPaymentAbandoned={resetPremiumPaymentDrafts}
            />
          )}
          <ToastContainer />
          <h2 className='text-dark-grey text-center xl:text-[40px] lg:text-4xl md:text-3xl sm:text-2xl xxs:text-xl font-medium leading-normal pt-[60px]'>
            Final Steps to Listing Your Asset
          </h2>
          <Listing
            formData={formData}
            dropdowns={dropdowns}
            toggleCityDropdown={toggleCityDropdown}
            toggleDropdownn={toggleDropdownn}
            toggleModelDropdown={toggleModelDropdown}
            toggleNeighbourDropdown={toggleNeighbourDropdown}
            handleToggleDropdown={handleToggleDropdown}
            isOpen={isOpen}
            errors={errors}
            isCityDropdownOpen={isCityDropdownOpen}
            isNeighbourDropdownOpen={isNeighbourDropdownOpen}
            toggleDropdown={toggleDropdown}
            dropdownVisible={dropdownVisible}
            selectedModel={selectedModel}
            toggleMakeDropdown={toggleMakeDropdown}
            selectedMake={selectedMake}
            modelDropdownVisible={modelDropdownVisible}
            makeDropdownVisible={makeDropdownVisible}
            makes={makes}
            setModels={setModels}
            handleMakeClick={handleMakeClick}
            searchQuery={searchQuery}
            searchQueryCity={searchQueryCity}
            searchQueryNeighbourhood={searchQueryNeighbourhood}
            setSearchQueryNeighbourhood={setSearchQueryNeighbourhood}
            setSearchQuery={setSearchQuery}
            setSearchQueryCity={setSearchQueryCity}
            handleMouseLeave={handleMouseLeave}
            filteredCountries={filteredCountries}
            models={models}
            handleCitySelect={handleCitySelect}
            neighbourhoods={neighbourhoods}
            cities={cities}
            countries={countries}
            handleModelClick={handleModelClick}
            handleNeighbour={handleNeighbour}
            handleCountrySelect={handleCountrySelect}
            handleSelectOption={handleSelectOption}
            selectedCity={selectedCity}
            selectedCountry={selectedCountry}
            selectedNeighbourhood={selectedNeighbourhood}
            car={true}
          />
          <div className='px-5'>
            <main className='max-w-[1300px] mx-auto lg:px-[35px] md:px-10 xxs:px-5 shadow-neons bg-whitee rounded-[5px]'>
              <CarListingForm
                formData={formData}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                flags={flags}
                phoneNumber={phoneNumber}
                thumbnail={thumbnail}
                qrScan={qrScan}
                handlePhoneNumberChange={handlePhoneNumberChange}
                handleCountryChange={handleCountryChange}
                selectedCountryPhone={selectedCountryPhone}
                maxLength={maxLength}
                handleThumbImageChange={handleThumbImageChange}
                handleThumbImageRemove={handleThumbImageRemove}
                handleQrScanChange={handleQrScanChange}
                handleQrScanRemove={handleQrScanRemove}
                images={images}
                videos={videos}
                type={'Car For Sale'}
                // dropdown3D={carForSaleDropdown}
                handleImageRemove={handleImageRemove}
                handleImageChange={handleImageChange}
                handleVideoRemove={handleVideoRemove}
                handleVideoChange={handleVideoChange}
                fileInputRef={fileInputRef}
                totalprice={totalprice}
                handleTechnicalModal={handleTechnicalModal}
                technicalModalData={technicalModalData}
                isTechnicalModalOpen={isTechnicalModalOpen}
                handleCloseTechnicalModal={handleCloseTechnicalModal}
                handleRequestTechnicalModalData={
                  handleRequestTechnicalModalData
                }
                handleToggleDropdown={handleToggleDropdown}
                fuelTypeOptions={fuelTypeOptions}
                handleSelectOption={handleSelectOption}
                modalData={modalData}
                handleOpenModal1={handleOpenModal1}
                handleOpenModal={handleOpenModal}
                handleCloseModal={handleCloseModal}
                handleRequestModalData={handleRequestModalData}
                isModal1Open={isModal1Open}
                handleClose1Modal={handleClose1Modal}
                isModalOpen={isModalOpen}
                setFormData={setFormData}
                dropdowns={dropdowns}
              />
              <div className='pt-[30px]'>
                <ChecksLayoutComponent
                  carListings={carListings}
                  colors={colors}
                  technicalFeatures={technicalFeatures}
                  extras={extras}
                  handleRadioChange={handleRadioChange}
                  handleCheckboxChange={handleCheckboxChange}
                  formData={formData}
                />
                <ListingsLowerComponent
                  image='/listing/car.png'
                  submitConfirmation={submitConfirmation}
                  loading={loading}
                  confirmationModal={confirmationModal}
                  handleSubmit={handleSubmit}
                  setConfirmationModal={setConfirmationModal}
                  id={id}
                  formData={formData}
                  handleChange={handleChange}
                  mapUrl={formData.mapUrl}
                />
              </div>
              {!id && (
                <StripeElement>
                  <PaymentModal
                    show={showPayment}
                    onClose={() => setShowPayment(false)}
                    formData={formData}
                    setFormData={setFormData}
                    HandleFormSubmit={() => HandleFormSubmit()}
                  />
                </StripeElement>
              )}
            </main>
          </div>
        </section>
      </div>
    </Suspense>
  )
}
export default Page
