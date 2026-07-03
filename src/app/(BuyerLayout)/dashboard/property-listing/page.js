'use client'
import { Suspense, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'libphonenumber-js'
import adImage from '@/assets/images/advertisement.png'
import Listing from '@/components/global/Listing'
import Facilities from '../../../../components/property-listing/Facilities'
import GlobalLoader from '@/utils/GlobalLoader'
import PaymentModal from '@/components/payments/PaymentModal'
import {
  handleImageUpload,
  handleVideoUpload,
  handleFileUpload,
  handleThumbnailUpload,
} from '@/libs/uploadAsset'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { ImageUploadComponent } from '@/components/property-listing/ImageUpload'
import {
  leaseNumberofChequesOptions,
  bathroomsOptions,
  bedroomsOptions,
  occupancyStatusOptions,
  isFurnishedOptions,
  facilities,
} from '@/constants/listing-data'
import { ListingContext } from '@/components/ListingContext/ListingsProvider'
import { propertyType } from '../../../../constants/listing-data'
import PayModal from '../../../../components/Modals/PayModal'
import { useProfile } from '../../../../context/UserContext'
import StripeElement from '../../../../components/Stripe/StripeElement'
import { useRefreshListingAfterServicePayment } from '@/hooks/useRefreshListingAfterServicePayment'
import { useRestoreListingAfterClozerPayment } from '@/hooks/useRestoreListingAfterClozerPayment'
import {
  useRestorePendingListingDraft,
  useRefetchListingOnReturn,
} from '@/hooks/useRestorePendingListingDraft'
import customAxios from '../../../../utils/apis/apis'
import {
  applyPremiumServiceRefs,
  listingMediaRef,
  premiumServiceRequestId,
} from '@/libs/listingMediaRef'
import {
  hasConfirmedEvaluationPayment,
  bookEvaluationTimeslotFromFormData,
  stripEvaluationBookingMeta,
} from '@/libs/evaluationBooking'

const dropdownData = {
  leaseNumberofCheques: false,
  bedrooms: false,
  bathrooms: false,
  isFurnished: false,
  occupancyStatus: false,
  bedrooms: false,
  assetType: false,
}

const Page = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const { user } = useProfile()

  const {
    countries,
    selectedCountry,
    handleCountrySelect,
    isOpen,
    searchParams,
    cities,
    dropdowns,
    neighbourhoods,
    // setIsOpen,
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
    selectType,
    handleMouseLeave,
    setLand,
    loading,
    cityLoading,
    errors,
    phoneNumber,
    thumbnail,
    handleOpenModal,
    handleThumbImageRemove,
    handleThumbImageChange,
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
    // setTechnicalModalData,
    isTechnicalModalOpen,
    handleRequestTechnicalModalData,
    totalprice,
    handleClose1Modal,
    modalData,
    totalSize,
    handleVideoChange,
    handlePhoneNumberChange,
    id,
    listings,
    handleRadioChange,
    handleCheckboxChange,
    confirmationModal,
    setConfirmationModal,
    formData,
    setFormData,
    isValidState,
    setDropdowns,
    handleFormData,
    setSelectType,
    setIsCityDropdownOpen,
    setErrors,
    // setThumbnail,
    videos,
    file,
    handleScroll,
    setTotalSize,
    setTotalPrice,
    setPhoneNumber,
    setIsValid,
    setIsTechnicalModalOpen,
    fetchData,
    handleVideoRemove,
    setModalData,
    resetPremiumPaymentDrafts,
    // setImages,
    // setVideo,
    resetForm,
  } = useContext(ListingContext)

  const initialFormData = {
    assetType: 'Property For Sale',
    country: '',
    city: '',
    phoneNumber: '',
    neighbourhood: '',
    propertyType: '',
    beds: '',
    propertyForSale: '',
    propertyForLease: '',
    leaseNumberofCheques: '',
    title: '',
    slug: '',
    pictures: null,
    video: null,
    thumbnailImg: null,
    evaluationCertificate: null,
    video3DWalkthrough: null,
    technicalReport: null,
    evaluationDateTime: '',
    price: formData?.price || '',
    sizeSQFT: '',
    sizeSQM: '',
    sizeUnit: 'SQFT',
    description: '',
    additionalDescription: '',
    bedrooms: '',
    evaluationCompanies: '',
    developer: '',
    bathrooms: '',
    isFurnished: '',
    sellerTransferFee: '',
    buyerTransferFee: '',
    occupancyStatus: '',
    listings: [],
    facilities: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  useEffect(() => {
    if (id) {
      fetchData('property')
    } else {
      resetForm()
      handleFormData(initialFormData, dropdownData)
      setLoading(false)
    }
  }, [searchParams])

  useRefreshListingAfterServicePayment(id, 'property', fetchData)
  useRestoreListingAfterClozerPayment(setFormData)
  useRestorePendingListingDraft(id, setFormData)
  useRefetchListingOnReturn(id, 'property', fetchData)

  const router = useRouter()

  const handlePropertyTypeSelect = (type) => {
    setSelectType(type)
    setFormData((prevFormData) => ({
      ...prevFormData,
      propertyType: type,
    }))
    setIsCityDropdownOpen(false)
  }

  const filteredCountries = countries?.filter((country) =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCities = cities?.filter((city) =>
    city?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

      // Only call 3D and technical report APIs if payment was successful
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

      // ✅ Require payment only when first submitting (no `id`)
      if (!id) {
        const checkoutSessionRaw = localStorage.getItem('checkoutSession')
        const checkoutSession = checkoutSessionRaw
          ? JSON.parse(checkoutSessionRaw)
          : null

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

      // Upload new files only if creating a new property (no id)
      if (!id) {
        const [uploadedImages, uploadedVideo, uploadedFile, uploadedThumbnail] =
          await Promise.all([
            images.length > 0 ? handleImageUpload(images) : imageID,
            videos.length ? handleVideoUpload(videos) : videoID,
            file ? handleFileUpload(file) : fileID,
            thumbnail ? handleThumbnailUpload(thumbnail) : thumbnailID,
          ])

        imageID = uploadedImages
        videoID = uploadedVideo
        fileID = uploadedFile
        thumbnailID = uploadedThumbnail
      } else {
        // ✅ For updates: only re-upload video or file if changed
        if (videos.length) videoID = await handleVideoUpload(videos)
        if (file) fileID = await handleFileUpload(file)
        // thumbnail and images will remain unchanged
      }

      const checkoutSessionRaw = localStorage.getItem('checkoutSession')
      const checkoutSession = checkoutSessionRaw
        ? JSON.parse(checkoutSessionRaw)
        : {}

      const updatedFormData = {
        ...formData,
        sizeSQFT: formData.sizeSQFT ? Number(formData.sizeSQFT) : 0,
        sizeSQM: formData.sizeSQM ? Number(formData.sizeSQM) : 0,
        sizeUnit: formData.sizeUnit || 'SQFT',
        userUUID: user?.uuid,
        pictures:
          listingMediaRef(imageID) ?? listingMediaRef(formData?.pictures),
        video: listingMediaRef(videoID) ?? listingMediaRef(formData?.video),
        ...checkoutSession,
        evaluationCertificate:
          listingMediaRef(fileID) ??
          listingMediaRef(formData?.evaluationCertificate),
        thumbnailImg:
          listingMediaRef(thumbnailID) ??
          listingMediaRef(formData?.thumbnailImg),
        propertyForSale:
          formData.assetType === 'Property For Sale' ? 'Yes' : '',
        propertyForLease:
          formData.assetType === 'Property For Lease' ? 'Yes' : '',
      }

      applyPremiumServiceRefs(updatedFormData, formData, {
        video3DWalkthroughID,
        technicalReportID,
      })

      // Validate form
      const validationErrors = validateForm(updatedFormData)

      if (Object.keys(validationErrors).length === 0) {
        if (!id) {
          await bookEvaluationTimeslotFromFormData(formData)
        }

        const listingPayload = stripEvaluationBookingMeta(updatedFormData)

        if (id) {
          requests.push(
            customAxios.put(
              `${process.env.NEXT_PUBLIC_BASE_URL}/property/${id}`,
              listingPayload
            )
          )
        } else {
          requests.push(
            customAxios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/property`,
              listingPayload
            )
          )
        }

        await Promise.all(requests)
        setLoading(false)

        toast.success(
          id
            ? 'Updated successfully'
            : 'Submitted successfully. Evaluator will evaluate it.'
        )

        // Reset everything
        setDropdowns(dropdownData)
        if (!id) {
          resetForm()
          setFormData(initialFormData)
          localStorage.removeItem('FormPayment')
          localStorage.removeItem('checkoutSessionId')
          localStorage.removeItem('checkoutSession')
          localStorage.removeItem('pendingListingDraft')
        }
        resetForm()
        router.push('/seller-profile/my-listing')
      } else {
        setErrors(validationErrors)
        handleScroll()
        setLoading(false)
      }
    } catch (error) {
      console.error('Error during submission:', error)
      toast.error(
        error?.message || 'An error occurred during submission. Please try again.',
      )
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'price') {
      // Remove non-digit characters from the price input
      const rawValue = value.replace(/[^\d]/g, '') // Remove commas, dots, etc.

      // Check if input is a valid number and update the state
      if (/^\d*$/.test(rawValue)) {
        // Store the raw numeric value in formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: rawValue, // Update the raw value in formData
        }))

        // Optionally, format the number for display with commas
        const formattedValue = new Intl.NumberFormat('en-US').format(rawValue)
        setTotalPrice(formattedValue)
      }
    } else if (name === 'sizeSQFT' || name === 'sizeSQM') {
      // Handled by PropertySizeField via handleSizeChange
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSizeChange = ({ sizeSQFT, sizeSQM, sizeUnit }) => {
    setFormData((prev) => ({
      ...prev,
      ...(sizeSQFT !== undefined ? { sizeSQFT } : {}),
      ...(sizeSQM !== undefined ? { sizeSQM } : {}),
      sizeUnit: sizeUnit || prev.sizeUnit || 'SQFT',
    }))
  }

  const validateForm = (data) => {
    const errors = {}
    // Convert all values to string safely using String() and provide fallback if undefined
    const phoneNumber = String(data.phoneNumber || '')
    // Check for phoneNumber validation
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!isValidNumber(phoneNumber)) {
      errors.phoneNumber = 'Phone number is invalid'
    }

    if (
      !String(data.assetType || '').trim() ||
      data.assetType === 'Select Asset Type'
    ) {
      errors.assetType = 'Asset Type is required'
    }

    if (!String(data.propertyType || '').trim()) {
      errors.propertyType = 'Property type is required'
    }

    if (!String(data.description || '').trim()) {
      errors.description = 'Description is required'
    } else if (data.description.length > 300) {
      errors.description = 'Description cannot exceed 300 characters.'
    }
    if (images.length === 0) errors.pictures = 'Pictures are Required'
    if (!thumbnail) {
      errors.thumbnail = 'Thumbnail is required'
    }

    if (!String(data.country || '').trim()) {
      errors.country = 'Country is required'
    }

    if (!String(data.city || '').trim()) {
      errors.city = 'City is required'
    }

    if (!String(data.neighbourhood || '').trim()) {
      errors.neighbourhood = 'Neighbourhood is required'
    }

    const sizeUnit = data.sizeUnit || 'SQFT'
    const activeSize =
      sizeUnit === 'SQM' ? data.sizeSQM : data.sizeSQFT

    if (!String(activeSize || '').trim()) {
      errors.sizeSQFT = 'Size is required'
    }

    // if (!String(data.evaluationDateTime || "").trim()) {
    //   errors.evaluationDateTime = "Evaluation is required";
    // }

    if (!String(data.title || '').trim()) {
      errors.title = 'Title is required'
    } else if (data.title.length > 30) {
      errors.title = 'Title must be less than 30 characters'
    }

    if (!String(data.price || '').trim() && !totalprice) {
      errors.price = 'Price is required'
    } else if (parseInt(totalprice) === 0) {
      errors.price = 'Price is invalid'
    }

    if (!String(data.additionalDescription || '').trim()) {
      errors.additionalDescription = 'Additional description is required'
    } else if (data.additionalDescription.length > 1000) {
      errors.additionalDescription =
        'Additional Description must be less than 1000 characters'
    }

    if (!String(data.bathrooms || '').trim()) {
      errors.bathrooms = 'Bathrooms are required'
    }

    if (!String(data.bedrooms || '').trim()) {
      errors.bedrooms = 'Bedrooms are required'
    }

    if (!String(data.occupancyStatus || '').trim()) {
      errors.occupancyStatus = 'Occupancy Status is required'
    }

    return errors
  }

  const isValidNumber = (value) => {
    setPhoneNumber(value)
    if (value) {
      setIsValid(isValidPhoneNumber(value))
    } else {
      setIsValid(true)
    }
    return phoneNumber
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'title':
        if (!value) {
          error = 'Title is required.'
        } else if (value.length > 30) {
          error = 'Title cannot exceed 30 characters.'
        }
        break
      case 'phoneNumber':
        if (!value.trim()) {
          error = 'Phone number is required'
        } else if (!isValidNumber(value)) {
          error = 'Phone number is invalid'
        }
        break
      case 'thumbnail':
        if (!value.trim()) {
          error = 'Thumbnail is required'
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
      case 'additionalDescription':
        if (value.trim().length > 1000) {
          error = 'Additional Description cannot exceed 1000 characters.'
        }
        break
      case 'sizeSQFT':
      case 'sizeSQM':
        if (!String(value || '').trim()) {
          error = 'Property size is required'
        }
        break
      // case "evaluationDateTime":
      //   if (!value.trim()) {
      //     error = "Evaluation is required";
      //   }
      //   break;

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

  const handleTechnicalModal = () => {
    setIsTechnicalModalOpen(true)
  }

  const handleCloseTechnicalModal = () => {
    setIsTechnicalModalOpen(false)
  }
  return (
    <Suspense fallback={<GlobalLoader />}>
      <div>
        <section>
          {isOpenModal && (
            <PayModal
              modalData={modalData}
              technicalModalData={technicalModalData}
              setIsOpenModal={setIsOpenModal}
              isValidState={isValidState}
              userUUID={user?.uuid}
              onPaymentAbandoned={resetPremiumPaymentDrafts}
            />
          )}
          <ToastContainer />
          <h2 className='text-dark-grey text-center xl:text-[40px] lg:text-4xl md:text-3xl sm:text-2xl xxs:text-xl font-medium leading-normal pt-[60px]'>
            Final Steps to Listing Your Asset
          </h2>
          {/* assest type  */}
          <Listing
            formData={formData}
            dropdowns={dropdowns}
            toggleCityDropdown={toggleCityDropdown}
            toggleDropdownn={toggleDropdownn}
            toggleModelDropdown={toggleModelDropdown}
            toggleNeighbourDropdown={toggleNeighbourDropdown}
            handleToggleDropdown={handleToggleDropdown}
            isOpen={isOpen}
            neighbourhoods={neighbourhoods}
            setModalData={setModalData}
            selectedNeighbourhood={selectedNeighbourhood}
            isCityDropdownOpen={isCityDropdownOpen}
            isNeighbourDropdownOpen={isNeighbourDropdownOpen}
            cities={cities}
            selectedModel={selectedModel}
            modelDropdownVisible={modelDropdownVisible}
            searchQuery={searchQuery}
            searchQueryCity={searchQueryCity}
            searchQueryNeighbourhood={searchQueryNeighbourhood}
            setSearchQueryNeighbourhood={setSearchQueryNeighbourhood}
            setSearchQuery={setSearchQuery}
            setSearchQueryCity={setSearchQueryCity}
            filteredCountries={filteredCountries}
            filteredCities={filteredCities}
            handlePropertyTypeSelect={handlePropertyTypeSelect}
            handleCitySelect={handleCitySelect}
            handleModelClick={handleModelClick}
            handleNeighbour={handleNeighbour}
            handleCountrySelect={handleCountrySelect}
            handleSelectOption={handleSelectOption}
            selectedCity={selectedCity}
            selectedCountry={selectedCountry}
            selectType={selectType}
            property={true}
            handleMouseLeave={handleMouseLeave}
            setLand={setLand}
            loading={cityLoading}
            errors={errors}
          />
          <div className='px-5 sm:mt-[150px] md:mt-0'>
            <main className='max-w-[1300px] mx-auto lg:px-[35px] md:px-10 xxs:px-5 shadow-neons bg-whitee rounded-[5px]'>
              {/* input one  */}
              <ImageUploadComponent
                formData={formData}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                type={'Property For Sale'}
                dropdown3D={propertyType}
                phoneNumber={phoneNumber}
                thumbnail={thumbnail}
                handleOpenModal={handleOpenModal}
                handleThumbImageRemove={handleThumbImageRemove}
                handleThumbImageChange={handleThumbImageChange}
                handleCountryChange={handleCountryChange}
                selectedCountryPhone={selectedCountryPhone}
                maxLength={maxLength}
                handleImageChange={handleImageChange}
                images={images}
                handleImageRemove={handleImageRemove}
                fileInputRef={fileInputRef}
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                handleRequestModalData={handleRequestModalData}
                handleToggleDropdown={handleToggleDropdown}
                id={id}
                totalprice={totalprice}
                handleVideoRemove={handleVideoRemove}
                handleSelectOption={handleSelectOption}
                handleOpenModal1={handleOpenModal1}
                isModal1Open={isModal1Open}
                setFormData={setFormData}
                technicalModalData={technicalModalData}
                handleTechnicalModal={handleTechnicalModal}
                isTechnicalModalOpen={isTechnicalModalOpen}
                handleCloseTechnicalModal={handleCloseTechnicalModal}
                handleRequestTechnicalModalData={
                  handleRequestTechnicalModalData
                }
                handleClose1Modal={handleClose1Modal}
                modalData={modalData}
                totalSize={totalSize}
                occupancyStatusOptions={occupancyStatusOptions}
                dropdowns={dropdowns}
                bedroomsOptions={bedroomsOptions}
                bathroomsOptions={bathroomsOptions}
                handleVideoChange={handleVideoChange}
                videos={videos}
                handlePhoneNumberChange={handlePhoneNumberChange}
                handleSizeChange={handleSizeChange}
                leaseNumberofChequesOptions={leaseNumberofChequesOptions}
                isFurnishedOptions={isFurnishedOptions}
              />
              {/* input two  */}
              <Facilities
                formData={formData}
                listings={listings}
                handleRadioChange={handleRadioChange}
                handleCheckboxChange={handleCheckboxChange}
                handleSubmit={handleSubmit}
                loading={loading}
                facilities={facilities}
                adImage={adImage}
                id={id}
                submitConfirmation={submitConfirmation}
                confirmationModal={confirmationModal}
                setConfirmationModal={setConfirmationModal}
              />
              <StripeElement>
                <PaymentModal
                  formData={formData}
                  setFormData={setFormData}
                  show={showPayment}
                  onClose={() => setShowPayment(false)}
                  HandleFormSubmit={() => HandleFormSubmit()}
                />
              </StripeElement>
            </main>
          </div>
        </section>
      </div>
    </Suspense>
  )
}

export default Page
