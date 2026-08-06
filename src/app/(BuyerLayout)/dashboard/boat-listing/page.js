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
  isListingEvaluatorApprovedLocked,
  buildApprovedAssetHolderUpdatePayload,
} from '@/libs/listingEditLock'
import {
  hasConfirmedEvaluationPayment,
  bookEvaluationTimeslotFromFormData,
  stripEvaluationBookingMeta,
} from '@/libs/evaluationBooking'
import axios from 'axios'
import { Suspense, useContext, useEffect, useMemo, useState } from 'react'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import { toast, ToastContainer } from 'react-toastify'
import { colors, extrasList } from '@/constants/boat-listings'
import { ListingContext } from '@/components/ListingContext/ListingsProvider'
import ListingsLowerComponent from '@/components/ListingsForm/ListingsLowerComponent'
import { categories } from '@/constants/listing-data'
import BoatListingForm from '@/components/ListingsForm/BoatListingForm'
import { useRouter } from 'next/navigation'
import PayModal from '../../../../components/Modals/PayModal'
import { useProfile } from '../../../../context/UserContext'
import PaymentModal from '@/components/payments/PaymentModal'
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
import customAxios from '../../../../utils/apis/apis'

function Page() {
  const [selectedExteriorColors, setSelectedExteriorColors] = useState([])
  const [otherExteriorColor, setOtherExteriorColor] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [selectedInteriorColors, setSelectedInteriorColors] = useState([])
  const [otherInteriorColor, setOtherInteriorColor] = useState('')
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Any')
  const [models, setModels] = useState(['1', '2', '3', '4'])
  const [boatListings, setBoatListings] = useState(['Private', 'Public'])
  const [selectedExtras, setSelectedExtras] = useState([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { user } = useProfile()

  const router = useRouter()
  const initialFormData = {
    assetType: 'Boats For Sale',
    country: '',
    city: '',
    neighbourhood: '',
    title: '',
    phoneNumber: '',
    condition: '',
    price: '',
    weight: '',
    sellerType: '',
    description: '',
    length: '',
    brands: '',
    age: '',
    usage: '',
    locateBoat: '',
    sportsOutdoorPrice: '',
    warrenty: '',
    seats: '',
    pictures: null,
    video: null,
    thumbnailImg: null,
    qrScan: null,
    evaluationCertificate: null,
    evaludationComponents: '',
    sportsOutdoorPrice: '',
    exteriorColor: [],
    interiorColor: [],
    extras: [],
    category: '',
    model: '',
    technicalReport: null,
    video3DWalkthrough: null,
    evaluationDateTime: '',
    mapUrl: '',
  }

  const dropdownData = {
    country: false,
    warrenty: false,
    condition: false,
    sellerType: false,
    length: false,
    age: false,
    usage: false,
    evaluationCompanies: '',
    assetType: '',
  }

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
    setVideo,
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
    totalprice,
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
    setSelectedModel,
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
      setSelectedCategory,
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
      fetchData('boat')
      return
    }

    // Keep draft only when it belongs to boat listing (not property/car/jewelry).
    if (hasPendingListingDraft() && isPendingDraftForListingRoute('boat')) {
      setLoading(false)
      return
    }

    if (hasPendingListingDraft()) {
      clearListingWorkspaceStorage()
    }

    resetForm()
    handleFormData(initialFormData, dropdownData)
    setLoading(false)
  }, [searchParams])

  useRefreshListingAfterServicePayment(id, 'boat', fetchData)
  useRestoreListingAfterClozerPayment(listingDraftRestoreApi)
  useRestorePendingListingDraft(id, listingDraftRestoreApi, 'boat')
  useRefetchListingOnReturn(id, 'boat', fetchData)

  const handleTechnicalModal = () => {
    setIsTechnicalModalOpen(!isTechnicalModalOpen)
  }

  const handleCloseTechnicalModal = () => {
    setIsTechnicalModalOpen(false)
  }

  const handleVideoRemove = () => {
    setVideo(null)
  }

  const validateForm = (data) => {
    const errors = {}

    if (images.length === 0) errors.pictures = 'Pictures are Required'
    if (!thumbnail) {
      errors.thumbnail = 'Thumbnail are Required'
    }
    if (!qrScan) {
      errors.qrScan = 'QR Scan is required'
    }
    if (!data.assetType.trim() || data.assetType === 'Select Asset Type') {
      errors.assetType = 'Asset Type is required'
    }
    if (!data.country.trim()) {
      errors.country = 'Country is required'
    }
    if (!data.city.trim()) {
      errors.city = 'City is required'
    }
    if (!data.neighbourhood.trim()) {
      errors.neighbourhood = 'Neighbourhood is required'
    }
    if (!data.category.trim()) {
      errors.category = 'Category is required'
    }
    if (!String(data.model || '').trim()) {
      errors.model = 'Model is required'
    }
    if (!data.title.trim()) {
      errors.title = 'Title is required'
    } else if (data.title.length > 30) {
      errors.title = 'Title must be less than 30 characters'
    }
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!isValidPhoneNumber(data.phoneNumber)) {
      errors.phoneNumber = 'Phone number is invalid'
    }

    if (!String(data.description || '').trim()) {
      errors.description = 'Description is required'
    } else if (data.description.length > 300) {
      errors.description = 'Description cannot exceed 300 characters.'
    }
    if (!String(data.price || '').trim() && !totalprice) {
      errors.price = 'Price is required'
    } else if (parseInt(totalprice) === 0) {
      errors.price = 'Price is invalid'
    }
    // if (!data.evaluationDateTime.trim()) {
    //   errors.evaluationDateTime = "Evaluation is required";
    // }
    if (!data.age.trim()) {
      errors.age = 'Age is required'
    }
    if (!data.usage.trim()) {
      errors.usage = 'Usage is required'
    }
    if (!data.condition.trim()) errors.condition = 'Condition is required'
    if (!data.seats.trim()) {
      errors.seats = 'Usage is required'
    }
    if (!data?.warrenty && !data?.warrenty?.trim()) {
      errors.warrenty = 'Warrenty is required'
    }
    if (!data.length.trim()) {
      errors.length = 'Length is required'
    }

    if (!data.model.trim()) errors.model = 'Model is required'
    return errors
  }

  const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber && phoneNumber.length >= 10
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required.'
        } else if (value.length > 30) {
          error = 'Title cannot exceed 30 characters.'
        }
        break
      case 'phoneNumber':
        if (!value.trim()) {
          error = 'Phone number is required'
        } else if (!isValidPhoneNumber(value)) {
          error = 'Phone number is invalid'
        }
        break
      case 'condition':
        if (!value.trim()) {
          error = 'Condition is required'
        }
        break
      case 'price':
        if (!value.trim()) {
          error = 'price is required'
        } else if (parseInt(value.trim()) === 0) {
          error = 'price is invalid'
        }
        break
      case 'weight':
        if (!value.trim()) {
          error = 'Weight is required'
        }
        break
      case 'sellerType':
        if (!value.trim()) {
          error = 'SellerType is required'
        }
        break
      case 'description':
        if (!value.trim()) {
          error = 'Description is required'
        } else if (value.length > 300) {
          error = 'Description cannot exceed 300 characters.'
        }
        break
      case 'length':
        if (!value.trim()) {
          error = 'Length is required'
        }
        break

      // case "evaluationDateTime":
      //   if (!value.trim()) {
      //     error = "Evaluation is required";
      //   }
      //   break;
      case 'age':
        if (!value.trim()) {
          error = 'Age is required'
        }
        break
      case 'usage':
        if (!value.trim()) {
          error = 'usage is required'
        }
        break
      case 'warrenty':
        if (!value.trim()) {
          error = 'Warrenty is required'
        }
        break
      case 'seats':
        if (!value.trim()) {
          error = 'Seats is required'
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

  const submitConfirmation = async (e) => {
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
      // Skip payment logic for edit flow (when id exists)
      if (id) {
        setLoading(true)
        setConfirmationModal(false)
        setShowPayment(false)
        setIsOpenModal(false)
        finalizeSubmission()
        return
      }

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
        setShowPayment(false)
        setIsOpenModal(false)
        setLoading(true)
        setConfirmationModal(false)
        finalizeSubmission()
      }
    } catch (error) {
      console.error('Error during form submission:', error)
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

      const validationErrors = validateForm(formData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        handleScroll()
        setLoading(false)
        return
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
      let qrScanID = formData?.qrScan
      // let fileID = formData?.evaluationCertificate
      // Upload new files only if creating a new property (no id)
      if (!id) {
        const [uploadedImages, uploadedVideo, uploadedThumbnail, uploadedQrScan] =
          await Promise.all([
            images.length > 0 ? handleImageUpload(images) : imageID,
            videos.length ? handleVideoUpload(videos) : videoID,
            // file ? handleFileUpload(file) : fileID,
            thumbnail instanceof File
              ? handleThumbnailUpload(thumbnail)
              : thumbnailID,
            qrScan ? handleImageUpload([qrScan]) : qrScanID,
          ])

        imageID = uploadedImages
        videoID = uploadedVideo
        // fileID = uploadedFile
        thumbnailID = uploadedThumbnail
        qrScanID = uploadedQrScan
      } else {
        if (thumbnail instanceof File) {
          thumbnailID = await handleThumbnailUpload(thumbnail)
        }
        if (qrScan instanceof File) {
          qrScanID = await handleImageUpload([qrScan])
        }
      }

      const updatedFormData = {
        ...formData,
        pictures:
          listingMediaRef(imageID) ?? listingMediaRef(formData?.pictures),
        video: listingMediaRef(videoID) ?? listingMediaRef(formData?.video),
        userUUID: user?.uuid,
        // evaluationCertificate: fileID,
        thumbnailImg:
          listingMediaRef(thumbnailID) ??
          listingMediaRef(formData?.thumbnailImg),
        qrScan: listingMediaRef(qrScanID) ?? listingMediaRef(formData?.qrScan),
        feedback: 'feedback',
      }

      applyPremiumServiceRefs(updatedFormData, formData, {
        video3DWalkthroughID,
        technicalReportID,
      })

      const listingPayload = stripEmptyObjectIdRefs(
        stripEvaluationBookingMeta(updatedFormData),
      )
      const payloadToSave =
        id && isListingEvaluatorApprovedLocked(formData)
          ? stripEmptyObjectIdRefs(
            buildApprovedAssetHolderUpdatePayload(listingPayload),
          )
          : listingPayload

      if (!id) {
        await bookEvaluationTimeslotFromFormData(formData)
      }

      if (id) {
        requests.push(
          customAxios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/boat/${id}`,
            payloadToSave
          )
        )
      } else {
        requests.push(
          customAxios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/boat`,
            listingPayload
          )
        )
      }
      const results = await Promise.all(requests)
      const response = results.find((res) => res?.data)
      if (response) {
        toast.success(
          id
            ? 'Updated successfully.'
            : 'Submitted successfully. Evaluator will evaluate it.'
        )
        if (!id) {
          flagListingPendingApprovalNotice({ assetKind: 'boat' })
          resetForm()
          setFormData(initialFormData)
          localStorage.removeItem('FormPayment')
          localStorage.removeItem('checkoutSessionId')
          localStorage.removeItem('checkoutSession')
          localStorage.removeItem('pendingListingDraft')
        }
      }
      router.push('/seller-profile/my-listing')
    } catch (error) {
      console.error('Error during form submission:', error)
      toast.error(
        error?.message || 'An error occurred during submission. Please try again.',
      )
    } finally {
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

  const handleExteriorCheckboxChange = (event) => {
    const { value, checked } = event.target
    let updatedColors

    if (checked) {
      updatedColors = [...selectedExteriorColors, value]
    } else {
      updatedColors = selectedExteriorColors.filter((color) => color !== value)
    }

    setSelectedExteriorColors(updatedColors)
  }

  const handleOtherExteriorColorChange = (event) => {
    setOtherExteriorColor(event.target.value)
  }

  const handleInteriorCheckboxChange = (event) => {
    const { value, checked } = event.target
    let updatedColors

    if (checked) {
      updatedColors = [...selectedInteriorColors, value]
    } else {
      updatedColors = selectedInteriorColors.filter((color) => color !== value)
    }

    setSelectedInteriorColors(updatedColors)
  }

  const handleOtherInteriorColorChange = (event) => {
    setOtherInteriorColor(event.target.value)
  }

  useEffect(() => {
    const allSelectedExteriorColors = otherExteriorColor
      ? [...selectedExteriorColors, otherExteriorColor]
      : selectedExteriorColors

    setFormData((prev) => ({
      ...prev,
      exteriorColor: allSelectedExteriorColors,
    }))
  }, [selectedExteriorColors, otherExteriorColor])

  useEffect(() => {
    const allSelectedInteriorColors = otherInteriorColor
      ? [...selectedInteriorColors, otherInteriorColor]
      : selectedInteriorColors

    setFormData((prev) => ({
      ...prev,
      interiorColor: allSelectedInteriorColors,
    }))
  }, [selectedInteriorColors, otherInteriorColor])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      extras: selectedExtras,
    }))
  }, [selectedExtras])

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setModels(categories[category])
    setDropdownVisible(false)
    setSelectedModel('All')
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: category,
      model: '',
    }))
  }

  const filteredCountries = countries.filter((country) =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      setErrors({ ...errors, [name]: '' })
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
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
        <section>
          <h2 className='text-dark-grey text-center xl:text-[40px] lg:text-4xl md:text-3xl sm:text-2xl xxs:text-xl font-medium leading-normal pt-[60px]'>
            Final Steps to Listing Your Asset
          </h2>
          <div className='mt-[50px]'>
            <Listing
              formData={formData}
              dropdowns={dropdowns}
              toggleCityDropdown={toggleCityDropdown}
              toggleDropdownn={toggleDropdownn}
              toggleModelDropdown={toggleModelDropdown}
              toggleNeighbourDropdown={toggleNeighbourDropdown}
              handleToggleDropdown={handleToggleDropdown}
              isOpen={isOpen}
              isCityDropdownOpen={isCityDropdownOpen}
              isNeighbourDropdownOpen={isNeighbourDropdownOpen}
              toggleDropdown={toggleDropdown}
              neighbourhoods={neighbourhoods}
              selectedCategory={selectedCategory}
              dropdownVisible={dropdownVisible}
              cities={cities}
              selectedModel={selectedModel}
              selectedNeighbourhood={selectedNeighbourhood}
              modelDropdownVisible={modelDropdownVisible}
              searchQuery={searchQuery}
              searchQueryCity={searchQueryCity}
              searchQueryNeighbourhood={searchQueryNeighbourhood}
              setSearchQueryNeighbourhood={setSearchQueryNeighbourhood}
              setSearchQuery={setSearchQuery}
              setSearchQueryCity={setSearchQueryCity}
              handleMouseLeave={handleMouseLeave}
              filteredCountries={filteredCountries}
              categories={categories}
              models={models}
              handleCitySelect={handleCitySelect}
              handleCategoryClick={handleCategoryClick}
              handleModelClick={handleModelClick}
              handleNeighbour={handleNeighbour}
              handleCountrySelect={handleCountrySelect}
              handleSelectOption={handleSelectOption}
              selectedCity={selectedCity}
              selectedCountry={selectedCountry}
              boat={true}
              errors={errors}
            />
            <div className='px-5 sm:mt-[150px] md:mt-0'>
              <main className='max-w-[1300px] mx-auto lg:px-[35px] md:px-10 xxs:px-5 shadow-neons bg-whitee rounded-[5px]'>
                <BoatListingForm
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
                  <div className='px-[19px]'>
                    {formData.price >= 1000000 ? (
                      <>
                        <h2 className='text-dark-black text-xl font-medium pt-5'>
                          Listing
                        </h2>
                        <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]'>
                          {boatListings.map((listing, index) => (
                            <div key={index} className='radio-container flex'>
                              <input
                                className='custom-radio visually-hidden custom-checkbox'
                                type='radio'
                                name='listing'
                                value={listing}
                                id={`listing-${index}`}
                                checked={formData.listing === listing}
                                onChange={(e) =>
                                  handleRadioChange(e, 'listing')
                                }
                              />
                              <label
                                className='custom-label'
                                htmlFor={`listing-${index}`}
                              >
                                {listing}
                              </label>
                            </div>
                          ))}
                        </form>
                        <br />
                      </>
                    ) : (
                      <></>
                    )}

                    <h2 className='text-dark-black text-xl font-medium'>
                      Exterior Color
                    </h2>
                    <form className='mt-[10px] grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xxs:grid-cols-2 justify-between gap-y-[10px]'>
                      {colors.map((color) => (
                        <div className='flex' key={color}>
                          <input
                            type='checkbox'
                            className='custom-checkbox'
                            value={color}
                            checked={selectedExteriorColors.includes(color)}
                            onChange={handleExteriorCheckboxChange}
                          />
                          <label className='custom-label'>{color}</label>
                        </div>
                      ))}
                      <div className='flex space-x-[7px] items-center'>
                        <div>
                          <input
                            type='checkbox'
                            className='custom-checkbox'
                            value='Other'
                            checked={!!otherExteriorColor}
                            onChange={() => setOtherExteriorColor('')}
                          />
                        </div>
                        <input
                          type='text'
                          className='shadow-neonsm w-[167px] h-[24px] placeholder:text-light-black
            placeholder:text-xs placeholder:font-normal pl-[10px]'
                          placeholder='Type Other Color'
                          value={otherExteriorColor}
                          onChange={handleOtherExteriorColorChange}
                        />
                      </div>
                    </form>

                    <h2 className='text-dark-black text-xl font-medium pt-5'>
                      Interior Color
                    </h2>
                    <form className='mt-[10px] grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xxs:grid-cols-2 justify-between gap-y-[10px]'>
                      {colors.map((color) => (
                        <div key={color}>
                          <input
                            type='checkbox'
                            className='custom-checkbox'
                            value={color}
                            checked={selectedInteriorColors.includes(color)}
                            onChange={handleInteriorCheckboxChange}
                          />
                          <label className='custom-label'>{color}</label>
                        </div>
                      ))}
                      <div className='flex space-x-[7px] items-center'>
                        <div>
                          <input
                            type='checkbox'
                            className='custom-checkbox'
                            value='Other'
                            checked={!!otherInteriorColor}
                            onChange={() => setOtherInteriorColor('')}
                          />
                        </div>
                        <input
                          type='text'
                          className='shadow-neonsm w-[167px] h-[24px] placeholder:text-light-black
            placeholder:text-xs placeholder:font-normal pl-[10px]'
                          placeholder='Type Other Color'
                          value={otherInteriorColor}
                          onChange={handleOtherInteriorColorChange}
                        />
                      </div>
                    </form>
                    <div>
                      <h2 className='text-dark-black text-xl font-medium pt-5'>
                        Extras
                      </h2>
                      <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1 justify-between gap-y-[10px]'>
                        {extrasList.map((extra, index) => (
                          <div className='flex items-center' key={index}>
                            <input
                              className='custom-checkbox'
                              type='checkbox'
                              value={extra}
                              checked={(formData.extras || []).includes(extra)}
                              onChange={(e) =>
                                handleCheckboxChange(e, 'extras')
                              }
                            />
                            <label className='custom-label'>{extra}</label>
                          </div>
                        ))}
                      </form>
                    </div>
                  </div>
                  <ListingsLowerComponent
                    image='/listing/boat.png'
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
          </div>
        </section>
      </div>
    </Suspense>
  )
}

export default Page
