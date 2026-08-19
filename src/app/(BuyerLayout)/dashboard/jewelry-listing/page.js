'use client'
import { useState, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'
import { Suspense } from 'react'
import {
  handleImageUpload,
  handleVideoUpload,
  handleFileUpload,
  handleThumbnailUpload,
  persistListingGalleryOrder,
} from '@/libs/uploadAsset'
import { autoCapitalizeField } from '@/libs/autoCapitalizeText'
import { flagListingPendingApprovalNotice } from '@/libs/listingPendingApprovalNotice'
import {
  applyPremiumServiceRefs,
  listingMediaRef,
  premiumServiceRequestId,
  stripEmptyObjectIdRefs,
  sanitizeAssetHolderUpdatePayload,
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
import 'react-phone-number-input/style.css'
import PaymentModal from '@/components/payments/PaymentModal'
import flags from 'react-phone-number-input/flags'
import { toast, ToastContainer } from 'react-toastify'
import Listing from '@/components/global/Listing'
import { ListingContext } from '@/components/ListingContext/ListingsProvider'
import ListingsLowerComponent from '@/components/ListingsForm/ListingsLowerComponent'
import { materials } from '@/constants/listing-data'
import JewelryListingForm from '@/components/ListingsForm/JewelryListingForm'
import FacilitiesChecklist from '@/components/property-listing/FacilitiesChecklist'
import { useRouter } from 'next/navigation'
import PayModal from '../../../../components/Modals/PayModal'
import { useProfile } from '../../../../context/UserContext'
import StripeElement from '../../../../components/Stripe/StripeElement'
import customAxios from '../../../../utils/apis/apis'
import { generateListingSlug } from '@/libs/listingSlug'
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

function Page() {
  const [neighbourhood, setNeighbourhood] = useState('Select Neighbourhood')
  const { user } = useProfile()
  const [showPayment, setShowPayment] = useState(false)

  const [jeweleryListings, setJeweleryListings] = useState([
    'Private',
    'Public',
  ])
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [models, setModels] = useState([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const router = useRouter()
  const categories = {
    "Men's Jewelry": [
      'Belt Buckles',
      'Bracelets',
      'Chains & Necklaces',
      'Cufflinks',
      'Pins & Tie Clips',
      'Rings',
      'Studs',
      'Other',
    ],
    "Women's Jewelry": [
      'Body Jewelry',
      'Bracelets',
      'Earrings',
      'Ethnic & Artisan Jewelry',
      'Hair Jewelry',
      'Pins & Brooches',
      'Rings',
      'Other',
    ],
  }
  const initialFormData = {
    assetType: 'Jewellery For Sale',
    country: '',
    city: '',
    category: '',
    model: '',
    neighbourhood: '',
    make: '',
    grams: '',
    title: '',
    slug: '',
    phoneNumber: '',
    condition: '',
    price: '',
    weight: '',
    sellerType: '',
    description: '',
    age: '',
    usage: '',
    pictures: null,
    video: null,
    thumbnailImg: null,
    evaluationCertificate: null,
    evaluationCompanies: '',
    ratings: [],
    materials: [],
    customMaterials: [],
    totalrating: '',
    warrenty: '',
    technicalReport: null,
    evaluationDateTime: '',
    video3DWalkthrough: null,
    qrScan: null,
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
    totalprice,
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
    handleImageReorder,
    fileInputRef,
    isModalOpen,
    handleCloseModal,
    handleRequestModalData,
    handleOpenModal1,
    setVideo,
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
    setSelectType,
    setIsCityDropdownOpen,
    setErrors,
    videos,
    file,
    handleScroll,
    setTotalSize,
    setTotalPrice,
    setIsTechnicalModalOpen,
    fetchData,
    setSelectedModel,
    resetForm,
    selectedCategory,
    setSelectedCategory,
    setPhoneNumber,
    setIsValid,
    setImages,
    setThumbnail,
    setVideos,
    setQrScan,
    setSelectedCountry,
    setSelectedCity,
    setSelectedNeighbourhood,
    setCountryCode,
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
      setSelectedCategory,
      setSelectedModel,
    ],
  )

  useEffect(() => {
    if (id) {
      fetchData('jewelry')
      return
    }

    // Keep draft only when it belongs to jewelry listing (not property/car/boat).
    if (hasPendingListingDraft() && isPendingDraftForListingRoute('jewelry')) {
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

  useEffect(() => {
    if (!formData?.title) return

    const nextSlug = generateListingSlug(formData.title)
    if (formData.slug === nextSlug) return

    setFormData((prev) => ({ ...prev, slug: nextSlug }))
  }, [formData?.title, formData?.slug, setFormData])

  useRefreshListingAfterServicePayment(id, 'jewelry', fetchData)
  useRestoreListingAfterClozerPayment(listingDraftRestoreApi)
  useRestorePendingListingDraft(id, listingDraftRestoreApi, 'jewelry')
  useRefetchListingOnReturn(id, 'jewelry', fetchData)

  const handleTechnicalModal = () => {
    setIsTechnicalModalOpen(!isTechnicalModalOpen)
  }

  const handleCloseTechnicalModal = () => {
    setIsTechnicalModalOpen(false)
  }

  const handlePropertyTypeSelect = (type) => {
    setSelectType(type)
    setFormData((prevFormData) => ({
      ...prevFormData,
      propertyType: type,
    }))
    setIsCityDropdownOpen(false)
  }
  const handleVideoRemove = () => {
    setVideo(null)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const isValidNumber = (value) => {
    setPhoneNumber(value)
    if (value) {
      setIsValid(isValidPhoneNumber(value))
    } else {
      setIsValid(true)
    }
    return isValidPhoneNumber(value)
  }

  const validateForm = (data) => {
    const errors = {}
    const safeTrim = (value) => {
      return typeof value === 'string' ? value.trim() : ''
    }
    if (!id && images.length === 0) errors.pictures = 'Pictures are Required'
    if (!id && !thumbnail) errors.thumbnail = 'Thumbnail is Required'
    if (!id && !qrScan) errors.qrScan = 'QR Scan is required'
    if (!safeTrim(data.assetType) || data.assetType === 'Select Asset Type')
      errors.assetType = 'Asset Type is required'
    if (!safeTrim(data.country)) errors.country = 'Country is required'
    if (!safeTrim(data.city)) errors.city = 'City is required'
    if (!safeTrim(data.neighbourhood))
      errors.neighbourhood = 'Neighbourhood is required'
    if (!safeTrim(data.category)) errors.category = 'Category is required'
    if (!safeTrim(data.model)) errors.model = 'SubCategory is required'
    if (!safeTrim(data.grams)) errors.grams = 'Grams is required'
    if (!safeTrim(data.title)) {
      errors.title = 'Title is required'
    } else if (data.title.length > 60) {
      errors.title = 'Title must be less than 60 characters'
    }
    // Convert all values to string safely using String() and provide fallback if undefined
    const phoneNumber = String(data.phoneNumber || '')
    // Check for phoneNumber validation
    if (!phoneNumber?.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!isValidNumber(phoneNumber)) {
      errors.phoneNumber = 'Phone number is invalid'
    }
    if (!String(data.description || '').trim()) {
      errors.description = 'Description is required'
    } else if (data.description.length > 300) {
      errors.description = 'Description cannot exceed 300 characters.'
    }
    if (!safeTrim(data.condition)) errors.condition = 'Condition is required'
    if (!String(data.price || '').trim() && !totalprice) {
      errors.price = 'Price is required'
    } else if (parseInt(totalprice) === 0) {
      errors.price = 'Price is invalid'
    }

    if (!data?.warrenty && !data?.warranty) {
      errors.warrenty = 'Warrenty is required'
    }
    // if (!data.evaluationDateTime.trim())
    //   errors.evaluationDateTime = "Evaluation is required";
    if (!safeTrim(data.age)) errors.age = 'Age is required'
    if (!safeTrim(data.usage)) errors.usage = 'Usage is required'

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
      case 'condition':
        if (!value.trim()) {
          error = 'condition is required'
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
          error = 'weight is required'
        }
        break
      case 'sellerType':
        if (!value.trim()) {
          error = 'sellerType is required'
        }
        break
      case 'description':
        if (!value.trim()) {
          error = 'Description is required'
        } else if (value.length > 300) {
          error = 'Description cannot exceed 300 characters.'
        }
        break
      case 'age':
        if (!value.trim()) {
          error = 'age is required'
        }
        break

      case 'usage':
        if (!value.trim()) {
          error = 'usage is required'
        }
        break

      case 'warrenty':
        if (!value.trim()) {
          error = 'warrenty is required'
        }
        break
      default:
        break
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
  }

  const submitConfirmation = async (e) => {
    const validationErrors = validateForm(formData, thumbnail, images)

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

    // Skip payment modal for edit flow (when id exists)
    if (id) {
      setLoading(true)
      setConfirmationModal(false)
      setShowPayment(false)
      setIsOpenModal(false)
      finalizeSubmission()
      return
    }

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
            qrScan instanceof File ? handleImageUpload([qrScan]) : qrScanID,
          ])

        imageID = uploadedImages
        videoID = uploadedVideo
        // fileID = uploadedFile
        thumbnailID = uploadedThumbnail
        qrScanID = uploadedQrScan
      } else {
        const newVideos = videos.filter((v) => v instanceof File)
        if (newVideos.length) videoID = await handleVideoUpload(newVideos)
        if (thumbnail instanceof File) {
          thumbnailID = await handleThumbnailUpload(thumbnail)
        }
        if (qrScan instanceof File) {
          qrScanID = await handleImageUpload([qrScan])
        }
      }

      const updatedFormData = {
        ...formData,
        userUUID: user?.uuid,
        pictures:
          listingMediaRef(imageID) ?? listingMediaRef(formData?.pictures),
        video: listingMediaRef(videoID) ?? listingMediaRef(formData?.video),
        // evaluationCertificate: fileID,
        thumbnailImg:
          listingMediaRef(thumbnailID) ??
          listingMediaRef(thumbnail) ??
          listingMediaRef(formData?.thumbnailImg),
        qrScan: listingMediaRef(qrScanID) ?? listingMediaRef(qrScan) ?? listingMediaRef(formData?.qrScan),
      }

      applyPremiumServiceRefs(updatedFormData, formData, {
        video3DWalkthroughID,
        technicalReportID,
      })

      const validationErrors = validateForm(updatedFormData, thumbnail)
      if (Object.keys(validationErrors).length === 0) {
        setFormData(updatedFormData)

        const listingPayload = sanitizeAssetHolderUpdatePayload(
          stripEmptyObjectIdRefs(
            stripEvaluationBookingMeta(updatedFormData),
          ),
          formData,
        )
        const payloadToSave =
          id && isListingEvaluatorApprovedLocked(formData)
            ? stripEmptyObjectIdRefs(
              buildApprovedAssetHolderUpdatePayload(listingPayload),
            )
            : listingPayload

        if (formData?.evaluationSlotTimeslots) {
          await bookEvaluationTimeslotFromFormData(formData)
        }

        if (id) {
          await persistListingGalleryOrder(formData?.pictures, images)
          requests.push(
            customAxios.put(
              `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry/${id}`,
              payloadToSave
            )
          )
        } else {
          requests.push(
            customAxios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`,
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
          if (id) {
            fetchData('jewelry')
          }
          if (!id) {
            flagListingPendingApprovalNotice({ assetKind: 'jewelry' })
            router.push('/seller-profile/my-listing')
            resetForm()
            setFormData(initialFormData)
            localStorage.removeItem('FormPayment')
            localStorage.removeItem('checkoutSessionId')
            localStorage.removeItem('checkoutSession')
            localStorage.removeItem('pendingListingDraft')
          }
        }
        setLoading(false)

      } else {
        setErrors(validationErrors)
        handleScroll()
        setLoading(false)
        toast.error('Please fix the highlighted fields before saving.')
      }
    } catch (error) {
      console.error('Error during submission:', error)
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setModels(categories[category] || [])
    setDropdownVisible(false)
    setSelectedModel('All')
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: category,
      model: '',
    }))
  }

  const filteredCountries = (countries ?? []).filter((country) =>
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
      setErrors({ ...errors, [name]: '' })
    } else if (name === 'sizeSQFT') {
      const numericValue = value.replace(/\D/g, '')
      setTotalSize(numericValue)
      setFormData({ ...formData, [name]: numericValue })
    } else {
      setFormData({ ...formData, [name]: autoCapitalizeField(name, value) })
      setErrors({ ...errors, [name]: '' })
    }
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
            selectedNeighbourhood={selectedNeighbourhood}
            isCityDropdownOpen={isCityDropdownOpen}
            isNeighbourDropdownOpen={isNeighbourDropdownOpen}
            neighbourhoods={neighbourhoods}
            toggleDropdown={toggleDropdown}
            cities={cities}
            dropdownVisible={dropdownVisible}
            selectedModel={selectedModel}
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
            handlePropertyTypeSelect={handlePropertyTypeSelect}
            handleModelClick={handleModelClick}
            handleNeighbour={handleNeighbour}
            handleCountrySelect={handleCountrySelect}
            handleSelectOption={handleSelectOption}
            selectedCity={selectedCity}
            selectedCountry={selectedCountry}
            neighbourhood={neighbourhood}
            selectedCategory={selectedCategory}
            jewelry={true}
            errors={errors}
          />

          <div className='px-5'>
            <main className='max-w-[1300px] mx-auto lg:px-[35px] md:px-10 xxs:px-5 shadow-neons bg-whitee rounded-[5px]'>
              <JewelryListingForm
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
                handleImageReorder={handleImageReorder}
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
                  {formData.price >= 100000 ? (
                    <>
                      <h2 className='text-dark-black text-xl font-medium pt-5'>
                        Listing
                      </h2>
                      <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]'>
                        {jeweleryListings.map((listing, index) => (
                          <div key={index} className='radio-container flex'>
                            <input
                              className='custom-radio visually-hidden custom-checkbox'
                              type='radio'
                              name='listing'
                              value={listing}
                              id={`listing-${index}`}
                              checked={formData.listing === listing}
                              onChange={(e) => handleRadioChange(e, 'listing')}
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
                    </>
                  ) : (
                    <></>
                  )}
                  <div className='pt-5'>
                    <FacilitiesChecklist
                      title='Materials'
                      presetFacilities={materials}
                      selectedFacilities={formData.materials || []}
                      customFacilities={formData.customMaterials || []}
                      onCheckboxChange={(e) => handleCheckboxChange(e, 'materials')}
                      setFormData={(updater) => {
                        setFormData((prev) => {
                          const next = typeof updater === 'function' ? updater({
                            ...prev,
                            facilities: prev.materials || [],
                            customFacilities: prev.customMaterials || [],
                          }) : updater
                          return {
                            ...prev,
                            materials: next.facilities ?? prev.materials,
                            customMaterials: next.customFacilities ?? prev.customMaterials,
                          }
                        })
                      }}
                      gridClassName='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xxs:grid-cols-2 justify-between gap-y-[10px]'
                    />
                  </div>
                </div>
                <ListingsLowerComponent
                  image='/listing/jewelery.png'
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
