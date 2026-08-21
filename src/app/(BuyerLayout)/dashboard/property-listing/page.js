'use client'
import { Suspense, useState, useEffect, useContext, useMemo, useRef } from 'react'
import axios from 'axios'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'libphonenumber-js'
import adImage from '@/assets/images/advertisement.png'
import Listing from '@/components/global/Listing'
import Facilities from '../../../../components/property-listing/Facilities'
import ReadyMarketLayoutDocuments from '@/components/property-listing/ReadyMarketLayoutDocuments'
import GlobalLoader from '@/utils/GlobalLoader'
import PaymentModal from '@/components/payments/PaymentModal'
import {
  handleImageUpload,
  handleVideoUpload,
  handleFileUpload,
  handleThumbnailUpload,
  persistListingGalleryOrder,
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
  OFF_PLAN_MEDIA_KEYS,
  READY_MARKET_LAYOUT_MEDIA_KEYS,
  createDefaultOffPlanPaymentPlan,
  addOffPlanPaymentStep,
  removeOffPlanPaymentStep,
  reindexOffPlanPaymentPlan,
  sanitizeOffPlanPaymentPlan,
  normalizePaymentPlanType,
} from '@/constants/listing-data'
import { LISTING_IMAGE_MAX_BYTES, LISTING_IMAGE_MAX_MB } from '@/constants/listingUploadLimits'
import { ensureWithinSize } from '@/libs/imageCompression'
import { applyListingWatermark } from '@/libs/applyListingWatermark'
import { autoCapitalizeField } from '@/libs/autoCapitalizeText'
import { parseBedBathCount } from '@/libs/bedBathCount'
import { flagListingPendingApprovalNotice } from '@/libs/listingPendingApprovalNotice'
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
import {
  clearListingWorkspaceStorage,
  hasPendingListingDraft,
  isPendingDraftForListingRoute,
} from '@/libs/pendingListingDraft'
import customAxios from '../../../../utils/apis/apis'
import {
  applyPremiumServiceRefs,
  listingMediaRef,
  listingCertificateRef,
  premiumServiceRequestId,
  stripEmptyObjectIdRefs,
  sanitizeAssetHolderUpdatePayload,
  withParentAssetId,
} from '@/libs/listingMediaRef'
import {
  hasConfirmedEvaluationPayment,
  bookEvaluationTimeslotFromFormData,
  stripEvaluationBookingMeta,
} from '@/libs/evaluationBooking'
import { isListingEvaluatorApprovedLocked, buildApprovedAssetHolderUpdatePayload } from '@/libs/listingEditLock'

const dropdownData = {
  leaseNumberofCheques: false,
  bedrooms: false,
  bathrooms: false,
  isFurnished: false,
  occupancyStatus: false,
  assetType: false,
  sizeType: false,
  deliveryQuarter: false,
  deliveryYear: false,
  paymentPlanType: false,
  layout: false,
  numberOfFloors: false,
}

const emptyOffPlanMedia = () => {
  const keys = [
    ...new Set([...OFF_PLAN_MEDIA_KEYS, ...READY_MARKET_LAYOUT_MEDIA_KEYS]),
  ]
  return keys.reduce((acc, key) => {
    acc[key] = null
    return acc
  }, {})
}

const formatPriceDisplay = (rawValue) => {
  if (!rawValue) return ''
  return new Intl.NumberFormat('en-US').format(rawValue)
}

const Page = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [totalPriceFrom, setTotalPriceFrom] = useState('')
  const [totalPriceTo, setTotalPriceTo] = useState('')
  const [offPlanMedia, setOffPlanMedia] = useState(emptyOffPlanMedia)
  const [agencyAgreementFile, setAgencyAgreementFile] = useState(null)
  const [titleDeedFile, setTitleDeedFile] = useState(null)
  // Keys the user explicitly removed — only those are cleared on save.
  const clearedLayoutKeysRef = useRef(new Set())
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
    setImages,
    setThumbnail,
    setVideos,
    setQrScan,
    setSelectedCountry,
    setSelectedCity,
    setSelectedNeighbourhood,
    setCountryCode,
    resetForm,
  } = useContext(ListingContext)

  const initialFormData = {
    assetType: 'Select Asset Type',
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
    sizeSQFTFrom: '',
    sizeSQFTTo: '',
    sizeSQMFrom: '',
    sizeSQMTo: '',
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
    priceFrom: '',
    priceTo: '',
    advertisementId: '',
    dldNumber: '',
    mapUrl: '',
    deliveryQuarter: '',
    deliveryYear: '',
    paymentPlanType: '',
    sizeType: '',
    layout: '',
    numberOfFloors: '',
    availableApartment: '',
    paymentPlan: createDefaultOffPlanPaymentPlan(),
    listings: [],
    facilities: [],
    customFacilities: [],
    qrScan: null,
    agencyAgreement: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const assetTypeParam = searchParams.get('assetType')

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
      setSelectType,
      setCountryCode,
      setPhoneNumber,
      setTotalPrice,
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
      setSelectType,
      setCountryCode,
      setPhoneNumber,
      setTotalPrice,
    ],
  )

  useEffect(() => {
    if (id) {
      fetchData('property')
      return
    }

    // Keep draft only when it belongs to property listing (not car/boat/jewelry).
    if (hasPendingListingDraft() && isPendingDraftForListingRoute('property')) {
      setLoading(false)
      return
    }

    if (hasPendingListingDraft()) {
      clearListingWorkspaceStorage()
    }

    resetForm()
    handleFormData(
      {
        ...initialFormData,
        ...(assetTypeParam ? { assetType: assetTypeParam } : {}),
      },
      dropdownData,
    )
    setLoading(false)
  }, [id, assetTypeParam])

  useRefreshListingAfterServicePayment(id, 'property', fetchData)
  useRestoreListingAfterClozerPayment(listingDraftRestoreApi)
  useRestorePendingListingDraft(id, listingDraftRestoreApi, 'property')
  useRefetchListingOnReturn(id, 'property', fetchData)

  const isOffPlan = formData?.assetType === 'Property Off Plan For Sale'

  // After Clozer evaluation payment: restore draft then create listing automatically.
  useEffect(() => {
    if (id || isOffPlan) return
    try {
      if (sessionStorage.getItem('fv.autoFinalizeEvaluationPayment') !== '1') {
        return
      }
      const sessionRaw = localStorage.getItem('checkoutSession')
      const session = sessionRaw ? JSON.parse(sessionRaw) : null
      if (
        !hasConfirmedEvaluationPayment(session) &&
        !hasConfirmedEvaluationPayment(formData)
      ) {
        return
      }
      if (!formData?.title || !formData?.evaluationDateTime) return
      if (!images?.length || !thumbnail) return

      sessionStorage.removeItem('fv.autoFinalizeEvaluationPayment')
      setLoading(true)
      setShowPayment(false)
      setConfirmationModal(false)
      finalizeSubmission()
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when restored form is ready
  }, [
    id,
    isOffPlan,
    formData?.title,
    formData?.evaluationDateTime,
    formData?.EvaluationPaymentStatus,
    images?.length,
    thumbnail,
  ])

  useEffect(() => {
    if (
      isOffPlan &&
      (!Array.isArray(formData.paymentPlan) || formData.paymentPlan.length === 0)
    ) {
      setFormData((prev) => ({
        ...prev,
        paymentPlan: createDefaultOffPlanPaymentPlan(),
      }))
    }
  }, [isOffPlan, formData.paymentPlan?.length, setFormData])

  useEffect(() => {
    if (formData?.priceFrom != null && formData.priceFrom !== '') {
      setTotalPriceFrom(formatPriceDisplay(String(formData.priceFrom)))
    }
    if (formData?.priceTo != null && formData.priceTo !== '') {
      setTotalPriceTo(formatPriceDisplay(String(formData.priceTo)))
    }
  }, [formData?.priceFrom, formData?.priceTo])

  useEffect(() => {
    if (!id) return
    // Sync each layout field independently so clearing unitLayout never
    // wipes floorPlan (and vice versa), and local File picks are kept.
    setOffPlanMedia((prev) => {
      const next = { ...prev }
      for (const key of READY_MARKET_LAYOUT_MEDIA_KEYS) {
        if (prev[key] instanceof File) continue
        const asset = formData?.[key]
        if (asset == null) {
          next[key] = null
          continue
        }
        const preview = asset?.images?.[0] ?? asset
        next[key] = withParentAssetId(preview, asset)
      }
      return next
    })
    if (formData?.agencyAgreement && !(agencyAgreementFile instanceof File)) {
      setAgencyAgreementFile(null)
    }
    if (formData?.titleDeed && !(titleDeedFile instanceof File)) {
      setTitleDeedFile(null)
    }
    // Intentionally omit agencyAgreementFile / titleDeedFile from deps so
    // picking a PDF does not reset layout image previews.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from server media only
  }, [id, isOffPlan, formData?.unitLayout, formData?.floorPlan])

  const handleAgencyAgreementChange = (event) => {
    const selectedFile = event.target.files?.[0]
    event.target.value = null
    if (!selectedFile) return
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file for the agency agreement.')
      return
    }
    setAgencyAgreementFile(selectedFile)
  }

  const handleAgencyAgreementRemove = () => {
    setAgencyAgreementFile(null)
    setFormData((prev) => ({ ...prev, agencyAgreement: null }))
  }

  const handleTitleDeedChange = (event) => {
    const selectedFile = event.target.files?.[0]
    event.target.value = null
    if (!selectedFile) return
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file for the title deed.')
      return
    }
    setTitleDeedFile(selectedFile)
  }

  const handleTitleDeedRemove = () => {
    setTitleDeedFile(null)
    setFormData((prev) => ({ ...prev, titleDeed: null }))
  }

  const handleOffPlanImageRemove = (key) => {
    if (!key || !READY_MARKET_LAYOUT_MEDIA_KEYS.includes(key)) return
    // Clear ONLY this layout field — never touch the other.
    clearedLayoutKeysRef.current.add(key)
    setOffPlanMedia((prev) => ({ ...prev, [key]: null }))
    setFormData((prev) => ({ ...prev, [key]: null }))
  }

  const handleOffPlanImageChange = (key) => async (event) => {
    let selectedFile = event.target.files?.[0]
    event.target.value = null
    if (!selectedFile) return
    clearedLayoutKeysRef.current.delete(key)

    try {
      if (selectedFile.size > LISTING_IMAGE_MAX_BYTES) {
        selectedFile = await ensureWithinSize(
          selectedFile,
          LISTING_IMAGE_MAX_BYTES,
        )
      }
      // Layout/floor plans get the listing watermark; never burn it onto QR.
      if (key !== 'qrScan') {
        selectedFile = await applyListingWatermark(selectedFile, {
          position: 'center',
          maxBytes: LISTING_IMAGE_MAX_BYTES,
        })
        if (selectedFile.size > LISTING_IMAGE_MAX_BYTES) {
          selectedFile = await ensureWithinSize(
            selectedFile,
            LISTING_IMAGE_MAX_BYTES,
          )
        }
      }
      setOffPlanMedia((prev) => ({ ...prev, [key]: selectedFile }))
    } catch (err) {
      toast.error(
        err?.message ||
        `Could not prepare ${selectedFile?.name || 'image'} (max ${LISTING_IMAGE_MAX_MB}MB)`,
      )
    }
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

  const handleListingSelectOption = (dropdownName, option) => {
    if (dropdownName === 'sizeType') {
      setFormData((prev) => ({
        ...prev,
        sizeType: option,
        sizeUnit: option,
      }))
      setDropdowns({ ...dropdowns, sizeType: false })
      return
    }
    handleSelectOption(dropdownName, option)
  }

  const router = useRouter()

  const handlePropertyTypeSelect = (type) => {
    setSelectType(type)
    setFormData((prevFormData) => ({
      ...prevFormData,
      propertyType: type,
    }))
    setDropdowns((prev) => ({ ...prev, propertyType: false }))
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
      setLoading(true)
      finalizeSubmission()
      return
    }

    if (isOffPlan) {
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setLoading(false)
        handleScroll()
        return
      }
      if (!images?.length) {
        toast.error('At least one image is required.')
        return
      }
      if (!thumbnail) {
        toast.error('Thumbnail image is required.')
        return
      }
      setLoading(true)
      setConfirmationModal(false)
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
      if (!isOffPlan && !formData?.evaluationDateTime) {
        toast.error('Evalaution required.')
        setLoading(false)
        throw new Error('Evalaution required')
      }

      if (!thumbnail) {
        toast.error('Thumbnail image is required.')
        setLoading(false)
        throw new Error('Thumbnail is required')
      }

      if (isOffPlan) {
        setLoading(true)
        setConfirmationModal(false)
        finalizeSubmission()
        return
      }

      // Already paid for evaluation (Stripe or Clozer) — create listing, don't ask to pay again.
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
        /* ignore corrupt session */
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

      // ✅ Require payment only when first submitting (no `id`) and not off-plan
      if (!id && !isOffPlan) {
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
      let qrScanID = formData?.qrScan
      let agencyAgreementID = formData?.agencyAgreement
      let titleDeedID = formData?.titleDeed

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

        if (agencyAgreementFile instanceof File) {
          agencyAgreementID = await handleFileUpload(agencyAgreementFile)
        }
        if (!isOffPlan && titleDeedFile instanceof File) {
          titleDeedID = await handleFileUpload(titleDeedFile)
        }
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
        if (agencyAgreementFile instanceof File) {
          agencyAgreementID = await handleFileUpload(agencyAgreementFile)
        }
        if (!isOffPlan && titleDeedFile instanceof File) {
          titleDeedID = await handleFileUpload(titleDeedFile)
        }
      }

      const layoutMediaRefs = {}
      const layoutMediaKeys = isOffPlan
        ? OFF_PLAN_MEDIA_KEYS
        : READY_MARKET_LAYOUT_MEDIA_KEYS
      for (const key of layoutMediaKeys) {
        const media = offPlanMedia[key]
        if (media instanceof File) {
          const uploaded = await handleImageUpload([media])
          layoutMediaRefs[key] =
            listingMediaRef(uploaded) ?? listingMediaRef(formData?.[key])
          clearedLayoutKeysRef.current.delete(key)
        } else if (media == null) {
          // Only clear if the user explicitly removed THIS field.
          if (clearedLayoutKeysRef.current.has(key)) {
            layoutMediaRefs[key] = null
          }
        } else {
          // Keep existing asset for this key only (preview may carry parent id).
          const kept =
            listingMediaRef(media) ?? listingMediaRef(formData?.[key])
          if (kept) layoutMediaRefs[key] = kept
        }
      }

      const checkoutSessionRaw = localStorage.getItem('checkoutSession')
      const checkoutSession = checkoutSessionRaw
        ? JSON.parse(checkoutSessionRaw)
        : {}

      const updatedFormData = {
        ...formData,
        bedrooms: parseBedBathCount(formData.bedrooms),
        bathrooms: parseBedBathCount(formData.bathrooms),
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
        sizeUnit: formData.sizeType || formData.sizeUnit || 'SQFT',
        priceFrom: formData.priceFrom ? Number(formData.priceFrom) : undefined,
        priceTo: formData.priceTo ? Number(formData.priceTo) : undefined,
        price: isOffPlan
          ? Number(formData.priceFrom || 0)
          : Number(formData.price || 0),
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
          listingMediaRef(thumbnail) ??
          listingMediaRef(formData?.thumbnailImg),
        qrScan:
          listingMediaRef(qrScanID) ??
          listingMediaRef(qrScan) ??
          listingMediaRef(formData?.qrScan),
        agencyAgreement: isOffPlan
          ? listingCertificateRef(agencyAgreementID) ??
          listingCertificateRef(formData?.agencyAgreement)
          : undefined,
        titleDeed: !isOffPlan
          ? listingCertificateRef(titleDeedID) ??
          listingCertificateRef(formData?.titleDeed)
          : undefined,
        propertyForSale:
          formData.assetType === 'Property For Sale' ||
            formData.assetType === 'Property Off Plan For Sale'
            ? 'Yes'
            : '',
        propertyForLease:
          formData.assetType === 'Property For Lease' ? 'Yes' : '',
        ...(layoutMediaRefs),
        paymentPlan: sanitizeOffPlanPaymentPlan(
          Array.isArray(formData.paymentPlan) ? formData.paymentPlan : [],
        ),
        paymentPlanType: normalizePaymentPlanType(formData.paymentPlanType),
        facilities: Array.isArray(formData.facilities)
          ? formData.facilities.filter(Boolean)
          : [],
      }

      applyPremiumServiceRefs(updatedFormData, formData, {
        video3DWalkthroughID,
        technicalReportID,
      })

      // Validate form
      const validationErrors = validateForm(updatedFormData)

      if (Object.keys(validationErrors).length === 0) {
        if (!isOffPlan && formData?.evaluationSlotTimeslots) {
          await bookEvaluationTimeslotFromFormData(formData)
        }

        const listingPayload = sanitizeAssetHolderUpdatePayload(
          stripEmptyObjectIdRefs(
            stripEvaluationBookingMeta(updatedFormData),
          ),
          formData,
        )

        // After evaluator approval, only send fields the asset holder may
        // still change — keeps evaluator-finalized details intact.
        const approvedLocked = isListingEvaluatorApprovedLocked(formData)
        const payloadToSave =
          id && approvedLocked
            ? stripEmptyObjectIdRefs(
              buildApprovedAssetHolderUpdatePayload(listingPayload),
            )
            : listingPayload

        if (id) {
          const galleryForPersist = (Array.isArray(images) ? images : []).filter(
            (img) =>
              img &&
              !img?.isDeleted &&
              !(typeof File !== 'undefined' && img instanceof File),
          )
          await persistListingGalleryOrder(
            formData?.pictures,
            galleryForPersist.length
              ? galleryForPersist
              : formData?.pictures?.images,
          )
          requests.push(
            customAxios.put(
              `${process.env.NEXT_PUBLIC_BASE_URL}/property/${id}`,
              payloadToSave
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
            : isOffPlan
              ? 'Submitted successfully. Your off-plan listing is pending Super Admin approval.'
              : 'Submitted successfully. Evaluator will evaluate it.',
        )

        // After update (ready market + off-plan), go to My Listing
        if (id) {
          if (typeof window !== 'undefined') {
            window.location.assign('/seller-profile/my-listing')
          } else {
            router.push('/seller-profile/my-listing')
          }
          return
        }

        flagListingPendingApprovalNotice({
          assetKind: isOffPlan ? 'offplan' : 'property',
        })

        // Reset everything (create flow only)
        setDropdowns(dropdownData)
        setOffPlanMedia(emptyOffPlanMedia())
        setTitleDeedFile(null)
        setAgencyAgreementFile(null)
        router.push('/seller-profile/my-listing')
        resetForm()
        setFormData(initialFormData)
        localStorage.removeItem('FormPayment')
        localStorage.removeItem('checkoutSessionId')
        localStorage.removeItem('checkoutSession')
        localStorage.removeItem('pendingListingDraft')
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

    if (name === 'price' || name === 'priceFrom' || name === 'priceTo') {
      const rawValue = value.replace(/[^\d]/g, '').slice(0, 9)

      if (/^\d*$/.test(rawValue)) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: rawValue,
        }))

        const formattedValue = formatPriceDisplay(rawValue)
        if (name === 'price') {
          setTotalPrice(formattedValue)
        } else if (name === 'priceFrom') {
          setTotalPriceFrom(formattedValue)
        } else if (name === 'priceTo') {
          setTotalPriceTo(formattedValue)
        }
      }
    } else if (name === 'sizeSQFT' || name === 'sizeSQM') {
      // Handled by PropertySizeField via handleSizeChange
    } else if (name === 'dldNumber') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.replace(/[^\d]/g, ''),
      }))
    } else {
      setFormData({
        ...formData,
        [name]: autoCapitalizeField(name, value),
      })
    }
  }

  const handleSizeChange = ({
    sizeSQFT,
    sizeSQM,
    sizeSQFTFrom,
    sizeSQFTTo,
    sizeSQMFrom,
    sizeSQMTo,
    sizeUnit,
    sizeType,
  }) => {
    setFormData((prev) => {
      const nextUnit = sizeUnit || prev.sizeUnit || 'SQFT'
      const next = {
        ...prev,
        ...(sizeSQFT !== undefined ? { sizeSQFT } : {}),
        ...(sizeSQM !== undefined ? { sizeSQM } : {}),
        ...(sizeSQFTFrom !== undefined ? { sizeSQFTFrom } : {}),
        ...(sizeSQFTTo !== undefined ? { sizeSQFTTo } : {}),
        ...(sizeSQMFrom !== undefined ? { sizeSQMFrom } : {}),
        ...(sizeSQMTo !== undefined ? { sizeSQMTo } : {}),
        sizeUnit: nextUnit,
        ...(sizeType !== undefined
          ? { sizeType }
          : sizeUnit
            ? { sizeType: sizeUnit }
            : {}),
      }

      // Keep single-size fields in sync with range "from" for filters/search.
      if (sizeSQFTFrom !== undefined) next.sizeSQFT = sizeSQFTFrom
      if (sizeSQMFrom !== undefined) next.sizeSQM = sizeSQMFrom

      return next
    })
  }

  const validateForm = (data) => {
    const errors = {}
    const offPlan = data.assetType === 'Property Off Plan For Sale'
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
    if (!id && images.length === 0) errors.pictures = 'Pictures are Required'
    if (!id && !thumbnail) {
      errors.thumbnail = 'Thumbnail is required'
    }
    if (!id && !qrScan) {
      errors.qrScan = 'QR Scan is required'
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

    const sizeUnit = data.sizeUnit || data.sizeType || 'SQFT'
    if (offPlan) {
      const sizeFrom =
        sizeUnit === 'SQM'
          ? data.sizeSQMFrom || data.sizeSQM
          : data.sizeSQFTFrom || data.sizeSQFT
      const sizeTo = sizeUnit === 'SQM' ? data.sizeSQMTo : data.sizeSQFTTo

      if (!String(sizeFrom || '').trim()) {
        errors.sizeSQFT = 'Size from is required'
      } else if (!String(sizeTo || '').trim()) {
        errors.sizeSQFT = 'Size to is required'
      } else if (Number(sizeTo) < Number(sizeFrom)) {
        errors.sizeSQFT = 'Size to must be greater than or equal to size from'
      }
    } else {
      const sizeValue =
        sizeUnit === 'SQM' ? data.sizeSQM : data.sizeSQFT
      if (sizeValue == null || String(sizeValue).trim() === '') {
        errors.sizeSQFT = 'Size is required'
      }
    }

    if (!String(data.title || '').trim()) {
      errors.title = 'Title is required'
    } else if (data.title.length > 60) {
      errors.title = 'Title must be less than 60 characters'
    }

    if (offPlan) {
      if (!String(data.priceFrom || '').trim()) {
        errors.price = 'Price from is required'
      } else if (parseInt(data.priceFrom) === 0) {
        errors.price = 'Price from is invalid'
      } else if (!String(data.priceTo || '').trim()) {
        errors.price = 'Price to is required'
      } else if (parseInt(data.priceTo) === 0) {
        errors.price = 'Price to is invalid'
      } else if (Number(data.priceTo) < Number(data.priceFrom)) {
        errors.price = 'Price to must be greater than or equal to price from'
      }

      if (!String(data.deliveryQuarter || '').trim() || !String(data.deliveryYear || '').trim()) {
        errors.deliveryTime = 'Delivery time is required'
      }

      if (!String(data.developer || '').trim()) {
        errors.developer = 'Developer is required'
      }

      const plan = Array.isArray(data.paymentPlan) ? data.paymentPlan : []
      const filledPlan = plan.filter(
        (step) =>
          String(step?.sharePercent ?? '').trim() !== '' ||
          String(step?.milestone ?? '').trim() !== '',
      )
      const downPayment = filledPlan[0]?.sharePercent
      if (!String(downPayment || '').trim()) {
        errors.paymentPlan = 'Down payment share is required'
      } else {
        const totalShare = filledPlan.reduce(
          (sum, step) => sum + Number(step?.sharePercent || 0),
          0,
        )
        if (totalShare > 100) {
          errors.paymentPlan = 'Payment plan shares cannot exceed 100%'
        }
      }
    } else if (!String(data.price || '').trim() && !totalprice) {
      errors.price = 'Price is required'
    } else if (parseInt(totalprice) === 0) {
      errors.price = 'Price is invalid'
    }

    if (!offPlan) {
      if (!String(data.additionalDescription || '').trim()) {
        errors.additionalDescription = 'Additional description is required'
      } else if (data.additionalDescription.length > 1000) {
        errors.additionalDescription =
          'Additional Description must be less than 1000 characters'
      }
    } else if (data.additionalDescription?.length > 1000) {
      errors.additionalDescription =
        'Additional Properties must be less than 1000 characters'
    }

    if (!String(data.bathrooms || '').trim()) {
      errors.bathrooms = 'Bathrooms are required'
    }

    // Studio is stored as 0 after parseBedBathCount — only empty/null are invalid.
    if (data.bedrooms == null || data.bedrooms === '') {
      errors.bedrooms = 'Bedrooms are required'
    }

    if (!offPlan && !String(data.occupancyStatus || '').trim()) {
      errors.occupancyStatus = 'Occupancy Status is required'
    }

    return errors
  }

  const isValidNumber = (value) => {
    setPhoneNumber(value)
    if (!value) {
      setIsValid(true)
      return true
    }
    const ok = isValidPhoneNumber(value)
    setIsValid(ok)
    return ok
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
            handleSelectOption={handleListingSelectOption}
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
                qrScan={qrScan}
                handleOpenModal={handleOpenModal}
                handleThumbImageRemove={handleThumbImageRemove}
                handleThumbImageChange={handleThumbImageChange}
                handleQrScanChange={handleQrScanChange}
                handleQrScanRemove={handleQrScanRemove}
                handleCountryChange={handleCountryChange}
                selectedCountryPhone={selectedCountryPhone}
                maxLength={maxLength}
                handleImageChange={handleImageChange}
                images={images}
                handleImageRemove={handleImageRemove}
                handleImageReorder={handleImageReorder}
                fileInputRef={fileInputRef}
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                handleRequestModalData={handleRequestModalData}
                handleToggleDropdown={handleToggleDropdown}
                id={id}
                totalprice={totalprice}
                totalPriceFrom={totalPriceFrom}
                totalPriceTo={totalPriceTo}
                handleVideoRemove={handleVideoRemove}
                handleSelectOption={handleListingSelectOption}
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
                offPlanMedia={offPlanMedia}
                onOffPlanImageChange={handleOffPlanImageChange}
                onOffPlanImageRemove={handleOffPlanImageRemove}
                onPaymentPlanStepChange={handlePaymentPlanStepChange}
                onPaymentPlanStepRemove={handlePaymentPlanStepRemove}
                onPaymentPlanStepAdd={handlePaymentPlanStepAdd}
                agencyAgreementFile={agencyAgreementFile}
                onAgencyAgreementChange={handleAgencyAgreementChange}
                onAgencyAgreementRemove={handleAgencyAgreementRemove}
                listings={listings}
                handleRadioChange={handleRadioChange}
              />
              {!isOffPlan ? (
                <ReadyMarketLayoutDocuments
                  media={offPlanMedia}
                  titleDeedFile={titleDeedFile}
                  existingTitleDeed={formData?.titleDeed}
                  onTitleDeedChange={handleTitleDeedChange}
                  onTitleDeedRemove={handleTitleDeedRemove}
                  onImageChange={handleOffPlanImageChange}
                  onImageRemove={handleOffPlanImageRemove}
                  errors={errors}
                  disabled={isListingEvaluatorApprovedLocked(formData)}
                />
              ) : null}
              {/* input two  */}
              <Facilities
                formData={formData}
                handleCheckboxChange={handleCheckboxChange}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loading={loading}
                facilities={facilities}
                setFormData={setFormData}
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
