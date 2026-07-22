'use client'
import { handleImageUpload } from '@/libs/uploadAsset'
import axios from 'axios'
import customAxios from '@/utils/apis/apis'
import { getExampleNumber } from 'libphonenumber-js'
import metadata from 'libphonenumber-js/min/metadata'
import { useSearchParams } from 'next/navigation'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { handleDeleteImg } from '../../libs/uploadAsset'
import { useProfile } from '../../context/UserContext'
import {
  normalizeCountriesResponse,
  normalizeCitiesResponse,
} from '@/libs/normalizeCountriesResponse'
import { normalizeListingPremiumRefs, isPremiumServicePaid } from '@/libs/listingPremiumStatus'
import { clearServiceSlotFields } from '@/libs/slotBooking'
import {
  DUMMY_DUBAI_NEIGHBOURHOODS,
  DUMMY_FALLBACK_COUNTRIES,
  DUMMY_UAE_CITY_PREDICTIONS,
  filterDummyCitiesByQuery,
  isDummyUaeLocationsEnabled,
  isDubaiCitySelection,
  LISTING_COUNTRY_UAE_LABEL,
  toUnitedArabEmiratesListingCountryName,
  filterCountriesToUaeOnly,
} from '@/libs/dummyLocationData'
import {
  LISTING_IMAGE_MAX_BYTES,
  LISTING_VIDEO_MAX_BYTES,
  LISTING_IMAGE_MAX_MB,
  LISTING_VIDEO_MAX_MB,
  LISTING_IMAGE_MAX_COUNT,
  LISTING_VIDEO_MAX_COUNT,
} from '@/constants/listingUploadLimits'
import { createDefaultOffPlanPaymentPlan, reindexOffPlanPaymentPlan } from '@/constants/listing-data'
import {
  ensureWithinSize,
  isCompressionConfigured,
} from '@/libs/imageCompression'

const getMaxLengthForCountry = (country) => {
  const exampleNumber = getExampleNumber(country, metadata)
  return exampleNumber
    ? exampleNumber.formatNational().replace(/\D/g, '').length
    : Infinity
}

export const ListingContext = createContext()

const ListingsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  // True while oversized images are being sent to the compression API. Consuming
  // forms must block submission until this is false.
  const [isCompressing, setIsCompressing] = useState(false)
  const [cityLoading, setCityLoading] = useState(false)
  const [videos, setVideos] = useState([])
  const [errors, setErrors] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('Select Country')
  const [cities, setCities] = useState([])
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Select a City')
  const [searchQuery, setSearchQuery] = useState('')
  const [listings, setListings] = useState(['Private', 'Public'])
  const [searchQueryCity, setSearchQueryCity] = useState('')
  const [searchQueryNeighbourhood, setSearchQueryNeighbourhood] = useState('')
  const [modelDropdownVisible, setModelDropdownVisible] = useState(false)
  const [isNeighbourDropdownOpen, setIsNeighbourDropdownOpen] = useState(false)
  const [neighbourhoods, setNeighbourhoods] = useState([])
  const [selectedModel, setSelectedModel] = useState('All')
  const [selectType, setSelectType] = useState('Select Property Type')
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [isValid, setIsValid] = useState(true)
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState(
    'Select Neighbourhood',
  )
  const [countryCode, setCountryCode] = useState('')
  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false)
  const [maxLength, setMaxLength] = useState(Infinity)
  const [selectedCountryPhone, setSelectedCountryPhone] = useState('US')
  const fileInputRef = useRef(null)
  const [totalprice, setTotalPrice] = useState(null)
  const [totalSize, setTotalSize] = useState('Size in')
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [file, setFile] = useState(null)
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState(null)
  const [qrScan, setQrScan] = useState(null)
  const [isCity, setIsCity] = useState('')
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [land, setLand] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModal1Open, setModal1Open] = useState(false)
  const { user } = useProfile()
  const [modalData, setModalData] = useState({
    name: '',
    email: '',
    dateTime: '',
    phone: '',
    productId: '',
    productTitle: '',
    assetType: '',
    category: '',
    subCategory: '',
    value: '',
    payment_details: null,
    payment_method_status: '',
    price: null,
    userUUID: '',
  })
  const [technicalModalData, setTechnicalModalData] = useState({
    name: '',
    email: '',
    dateTime: '',
    phone: '',
    productId: '',
    productTitle: '',
    assetType: '',
    category: '',
    subCategory: '',
    value: '',
    payment_details: null,
    payment_method_status: '',
    price: null,
    userUUID: '',
  })

  const [selectedCategory, setSelectedCategory] = useState('Any')
  const [models, setModels] = useState(['2024', '2023', '2022', '2021', '2020'])

  const [dropdowns, setDropdowns] = useState({})
  const [formData, setFormData] = useState({})

  const handleFormData = (form, dropdownData) => {
    setFormData(form)
    setDropdowns(dropdownData)
  }

  const pendingPremiumStorageKey = (suffix) =>
    `fv.pending.${id || 'new'}.${suffix}`

  const restorePendingPremiumModals = (listing) => {
    if (typeof window === 'undefined') return
    try {
      if (!isPremiumServicePaid(listing?.video3DWalkthrough)) {
        const raw3d = sessionStorage.getItem(pendingPremiumStorageKey('3d'))
        if (raw3d) setModalData(JSON.parse(raw3d))
      }
      if (!isPremiumServicePaid(listing?.technicalReport)) {
        const rawTech = sessionStorage.getItem(
          pendingPremiumStorageKey('technical'),
        )
        if (rawTech) setTechnicalModalData(JSON.parse(rawTech))
      }
    } catch {
      /* ignore corrupt storage */
    }
  }

  const fetchData = async (routeName) => {
    try {
      const response = await customAxios.get(`/${routeName}/${id}`)
      if (response.status === 200) {
        const d = response.data
        const countryNorm =
          toUnitedArabEmiratesListingCountryName(d.country) ||
          d.country ||
          ''
        const normalized = {
          ...normalizeListingPremiumRefs(d),
          description: d.description || '',
          additionalDescription: d.additionalDescription || '',
          country: countryNorm,
          priceFrom: d.priceFrom ?? '',
          priceTo: d.priceTo ?? '',
          sizeSQFTFrom: d.sizeSQFTFrom ?? d.sizeSQFT ?? '',
          sizeSQFTTo: d.sizeSQFTTo ?? '',
          sizeSQMFrom: d.sizeSQMFrom ?? d.sizeSQM ?? '',
          sizeSQMTo: d.sizeSQMTo ?? '',
          agencyAgreement: d.agencyAgreement || null,
          advertisementId: d.advertisementId || '',
          dldNumber: d.dldNumber || '',
          deliveryQuarter: d.deliveryQuarter || '',
          deliveryYear: d.deliveryYear || '',
          sizeType: d.sizeType || d.sizeUnit || '',
          layout: d.layout || '',
          numberOfFloors: d.numberOfFloors || '',
          availableApartment: d.availableApartment || '',
          paymentPlan:
            Array.isArray(d.paymentPlan) && d.paymentPlan.length
              ? reindexOffPlanPaymentPlan(d.paymentPlan)
              : createDefaultOffPlanPaymentPlan(),
        }
        setFormData(normalized)
        restorePendingPremiumModals(normalized)
        if (countryNorm) {
          setSelectedCountry(countryNorm)
          if (countryNorm === LISTING_COUNTRY_UAE_LABEL) {
            setCountryCode('AE')
          }
        }
        if (d.city) setSelectedCity(d.city)
        if (d.neighbourhood) setSelectedNeighbourhood(d.neighbourhood)
        if (d.model) setSelectedModel(d.model)
        if (d.propertyType) setSelectType(d.propertyType)
        setTotalPrice(d.price != null ? String(d.price) : null)
        setPhoneNumber(d.phoneNumber ? `${d.phoneNumber}` : '')
        {
          const thumbAsset = d?.thumbnailImg
          const firstThumb = Array.isArray(thumbAsset?.images)
            ? thumbAsset.images[0]
            : null
          setThumbnail(
            firstThumb
              ? {
                ...firstThumb,
                signedUrl:
                  firstThumb.signedUrl ||
                  thumbAsset?.signedUrl ||
                  firstThumb.url,
                url:
                  firstThumb.url ||
                  thumbAsset?.signedUrl ||
                  firstThumb.signedUrl,
              }
              : thumbAsset || null,
          )
        }
        setQrScan(d?.qrScan?.images?.[0] ?? d?.qrScan ?? null)
        setImages(Array.isArray(d?.pictures?.images) ? d.pictures.images : [])
        if (Array.isArray(d?.video?.videos) && d.video.videos.length) {
          setVideos(
            d.video.videos.map((v) => ({
              ...v,
              signedUrl: v?.signedUrl || d.video.signedUrl || v?.url,
              url: v?.url || v?.signedUrl || d.video.signedUrl,
            })),
          )
        } else if (d?.video?.signedUrl || d?.video?.url) {
          setVideos([
            {
              url: d.video.url || d.video.signedUrl,
              signedUrl: d.video.signedUrl || d.video.url,
              _id: d.video._id,
            },
          ])
        } else if (Array.isArray(d?.video)) {
          setVideos(d.video)
        } else {
          setVideos([])
        }
      }
    } catch (error) {
      console.error('Error fetching property data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Retrieve legacy localStorage keys (older flows)
    const item = localStorage.getItem('3Dwalkthrough')
    if (item) {
      setModalData(JSON.parse(item))
    }
  }, [])

  useEffect(() => {
    const item = localStorage.getItem('technicalReport')
    if (item) {
      setTechnicalModalData(JSON.parse(item))
    }
  }, [])

  useEffect(() => {
    if (id) return
    try {
      const raw3d = sessionStorage.getItem(pendingPremiumStorageKey('3d'))
      if (raw3d) setModalData(JSON.parse(raw3d))
      const rawTech = sessionStorage.getItem(pendingPremiumStorageKey('technical'))
      if (rawTech) setTechnicalModalData(JSON.parse(rawTech))
    } catch {
      /* ignore */
    }
  }, [id])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries', {
          next: { revalidate: 10 },
        })
        const data = await response.json()

        let list = normalizeCountriesResponse(data)
        if (!list.length) {
          list = [...DUMMY_FALLBACK_COUNTRIES]
        }
        list = filterCountriesToUaeOnly(list)
        setCountries(list)
        // Keep "Select Country" until the user picks — do not auto-fill UAE.
      } catch (error) {
        console.error('Error fetching countries data:', error)
        setCountries([...DUMMY_FALLBACK_COUNTRIES])
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    fetchCities()
  }, [searchQueryCity, countryCode])

  useEffect(() => {
    fetchNeighbourhoods()
  }, [isCity])

  const fetchCities = async () => {
    if (!countryCode) {
      setCities([])
      setLoading(false)
      return
    }

    const applyDummyAeCities = () => {
      setCities(filterDummyCitiesByQuery(DUMMY_UAE_CITY_PREDICTIONS, searchQueryCity))
    }

    if (isDummyUaeLocationsEnabled && countryCode === 'AE') {
      applyDummyAeCities()
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `/api/country?name=${countryCode}&query=${searchQueryCity}`,
        {
          next: { revalidate: 10 },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch cities')
      }
      const data = await response.json()

      let normalized = normalizeCitiesResponse(data)
      if (countryCode === 'AE' && normalized.length === 0) {
        normalized = filterDummyCitiesByQuery(
          DUMMY_UAE_CITY_PREDICTIONS,
          searchQueryCity,
        )
      }
      setCities(normalized)
    } catch (error) {
      console.error('Error fetching cities:', error)
      if (countryCode === 'AE') {
        applyDummyAeCities()
      } else {
        setCities([])
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchNeighbourhoods = async () => {
    if (!isCity) return

    const applyDummyDubaiNeighbourhoods = () => {
      setNeighbourhoods([...DUMMY_DUBAI_NEIGHBOURHOODS])
    }

    if (isDummyUaeLocationsEnabled && isDubaiCitySelection(isCity)) {
      applyDummyDubaiNeighbourhoods()
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `/api/neighbourhoods?address=${encodeURIComponent(isCity)}`,
      )

      if (!response.ok) {
        throw new Error('Failed to fetch neighbourhoods')
      }
      const data = await response.json()
      let places = Array.isArray(data?.places) ? data.places : []
      if (isDubaiCitySelection(isCity) && places.length === 0) {
        places = [...DUMMY_DUBAI_NEIGHBOURHOODS]
      }
      setNeighbourhoods(places)
    } catch (error) {
      console.error('Error fetching neighbourhoods:', error)
      if (isDubaiCitySelection(isCity)) {
        applyDummyDubaiNeighbourhoods()
      } else {
        setNeighbourhoods([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCountrySelect = (country) => {
    const countryLabel =
      toUnitedArabEmiratesListingCountryName(country.country) ||
      country.country
    setSelectedCountry(countryLabel)
    setCountryCode(country.code)
    setIsOpen(false)
    fetchCities(country.code)
    setSelectedCountryPhone(countryLabel)
    setFormData((prevFormData) => ({
      ...prevFormData,
      country: countryLabel,
    }))
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setIsCity(city)
    setNeighbourhoods([])
    fetchNeighbourhoods(city)
    setFormData((prevFormData) => ({
      ...prevFormData,
      city: city,
    }))
    setIsCityDropdownOpen(false)
  }

  const handleNeighbour = (neighbour) => {
    const neighbourhoodName =
      typeof neighbour === 'object' ? neighbour.name : neighbour

    setFormData((prevFormData) => ({
      ...prevFormData,
      neighbourhood: neighbourhoodName,
    }))

    setSelectedNeighbourhood(neighbourhoodName)
    setNeighbourhoods(neighbourhoods)
    setIsNeighbourDropdownOpen(false)
  }

  const toggleDropdownn = () => {
    setIsOpen(!isOpen)
  }

  const handleMouseLeave = (field) => {
    setDropdowns((prevState) => ({
      ...prevState,
      [field]: false,
    }))
  }

  const handleRadioChange = (e, fieldName) => {
    const { value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }))
  }

  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleCityDropdown = () => {
    setIsCityDropdownOpen(!isCityDropdownOpen)
  }

  const toggleNeighbourDropdown = () => {
    setIsNeighbourDropdownOpen(!isNeighbourDropdownOpen)
  }

  const handleCountryChange = (value) => {
    setSelectedCountryPhone(value)

    const newMaxLength = getMaxLengthForCountry(value)
    setMaxLength(newMaxLength)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remainingSlots = LISTING_IMAGE_MAX_COUNT - images.length
    if (remainingSlots <= 0) {
      toast.error(
        `You can only upload a maximum of ${LISTING_IMAGE_MAX_COUNT} images`,
      )
      if (e?.target) e.target.value = ''
      return
    }

    const filesToProcess =
      files.length > remainingSlots ? files.slice(0, remainingSlots) : files

    if (files.length > remainingSlots) {
      toast.info(
        `Only ${remainingSlots} more image(s) allowed (max ${LISTING_IMAGE_MAX_COUNT} total).`,
      )
    }

    const validFiles = []
    const checkFile = async (file) => {
      let workingFile = file
      // Oversized images are compressed via the API before proceeding. If the
      // API isn't configured yet, keep the original reject-and-skip behaviour.
      if (file.size > LISTING_IMAGE_MAX_BYTES) {
        if (!isCompressionConfigured()) {
          toast.error(`The file ${file.name} exceeds the ${LISTING_IMAGE_MAX_MB}MB size limit`)
          return null
        }
        try {
          workingFile = await ensureWithinSize(file, LISTING_IMAGE_MAX_BYTES)
        } catch (err) {
          toast.error(
            `Could not compress ${file.name}: ${err?.message || 'try again'}`,
          )
          return null
        }
      }
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const img = new window.Image()
          img.onload = () => {
            resolve(workingFile) // File is valid (possibly compressed)
          }
          img.onerror = () => {
            toast.error(
              `The file ${workingFile.name} could not be loaded as an image`,
            )
            resolve(null) // Invalid file
          }
          img.src = event.target.result
        }
        reader.onerror = () => {
          alert(`The file ${workingFile.name} could not be read`)
          resolve(null) // Error reading file
        }
        reader.readAsDataURL(workingFile)
      })
    }

    const processFiles = async () => {
      setIsCompressing(true)
      try {
        for (const file of filesToProcess) {
          const validFile = await checkFile(file)
          if (validFile) {
            validFiles.push(validFile) // Add valid files to the array
          }
        }

        // Check if the number of images exceeds the limit
        if (images.length + validFiles.length > LISTING_IMAGE_MAX_COUNT) {
          toast.error(
            `You can only upload a maximum of ${LISTING_IMAGE_MAX_COUNT} images`,
          )
          return
        }

        // Update images state
        setImages((prevImages) => [...prevImages, ...validFiles])

        try {
          const imageIDs = await handleImageUpload(validFiles)

          setFormData((prevFormData) => ({
            ...prevFormData,
            pictures: imageIDs,
          }))
        } catch (error) {
          toast.error(error?.message || 'Image upload failed. Please try again.')
          setImages((prevImages) =>
            prevImages.filter((img) => !validFiles.includes(img)),
          )
        }

        if (e?.target) {
          e.target.value = ''
        }
      } finally {
        setIsCompressing(false)
      }
    }

    processFiles()
  }

  const handleImageRemove = (index, id) => {
    if (index && id) {
      handleDeleteImg(id)
      setImages((prevImages) => prevImages.filter((_, i) => i !== index))
      setFormData((prevFormData) => {
        const updatedImages =
          prevFormData.pictures?.images?.filter((_, i) => i !== index) || []
        return {
          ...prevFormData,
          pictures: {
            ...prevFormData.pictures,
            images: updatedImages,
          },
        }
      })
    } else {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index))
      setFormData((prevFormData) => {
        const updatedImages =
          prevFormData.pictures?.images?.filter((_, i) => i !== index) || []
        return {
          ...prevFormData,
          pictures: {
            ...prevFormData.pictures,
            images: updatedImages,
          },
        }
      })
    }
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const validFiles = []
    for (const file of files) {
      if (file.size > LISTING_VIDEO_MAX_BYTES) {
        toast.error(
          `${file.name} exceeds the ${LISTING_VIDEO_MAX_MB}MB video size limit`,
        )
        continue
      }
      validFiles.push(file)
    }

    if (!validFiles.length) {
      if (fileInputRef.current) fileInputRef.current.value = null
      return
    }

    if (videos.length + validFiles.length > LISTING_VIDEO_MAX_COUNT) {
      toast.error(
        `You can only upload a maximum of ${LISTING_VIDEO_MAX_COUNT} videos`,
      )
      if (fileInputRef.current) fileInputRef.current.value = null
      return
    }

    setVideos((prev) => [...prev, ...validFiles])
    if (fileInputRef.current) fileInputRef.current.value = null
  }

  const handleVideoRemove = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const validateImageFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => resolve(true)
        img.onerror = () => {
          toast.error(`The file ${file.name} could not be loaded as an image`)
          resolve(false)
        }
        img.src = e.target.result
      }
      reader.onerror = () => {
        toast.error(`The file ${file.name} could not be read`)
        resolve(false)
      }
      reader.readAsDataURL(file)
    })

  const handleThumbImageChange = async (event) => {
    const input = event.target
    let selectedFile = input.files?.[0]
    if (!selectedFile) return

    try {
      if (selectedFile.size > LISTING_IMAGE_MAX_BYTES) {
        if (!isCompressionConfigured()) {
          toast.error(
            `The file ${selectedFile.name} exceeds the ${LISTING_IMAGE_MAX_MB}MB size limit`,
          )
          return
        }
        setIsCompressing(true)
        try {
          selectedFile = await ensureWithinSize(
            selectedFile,
            LISTING_IMAGE_MAX_BYTES,
          )
        } catch (err) {
          toast.error(
            `Could not compress ${selectedFile.name}: ${err?.message || 'try again'}`,
          )
          return
        } finally {
          setIsCompressing(false)
        }
      }

      const isValid = await validateImageFile(selectedFile)
      if (!isValid) return

      setThumbnail(selectedFile)
    } finally {
      input.value = ''
    }
  }

  const handleThumbImageRemove = (id) => {
    if (id) {
      handleDeleteImg(id)
    }
    setThumbnail(null)
    setFormData((prevFormData) => ({
      ...prevFormData,
      thumbnailImg: null,
    }))
  }

  const handleQrScanChange = async (event) => {
    let selectedFile = event.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > LISTING_IMAGE_MAX_BYTES) {
        if (!isCompressionConfigured()) {
          toast.error(
            `The file ${selectedFile.name} exceeds the ${LISTING_IMAGE_MAX_MB}MB size limit`,
          )
          event.target.value = null
          return
        }
        setIsCompressing(true)
        try {
          selectedFile = await ensureWithinSize(
            selectedFile,
            LISTING_IMAGE_MAX_BYTES,
          )
        } catch (err) {
          toast.error(
            `Could not compress ${selectedFile.name}: ${err?.message || 'try again'}`,
          )
          event.target.value = null
          return
        } finally {
          setIsCompressing(false)
        }
      }
      setQrScan(selectedFile)
    }
  }

  const handleQrScanRemove = () => {
    setQrScan(null)
  }

  /** True when the user actually requested 3D or technical report (has a fee). */
  const isValidState = (state) => {
    if (!state || typeof state !== 'object') return false
    const price = Number(state.price)
    return Number.isFinite(price) && price > 0
  }

  const handleCheckboxChange = (e, key) => {
    const { checked, value } = e.target
    const updatedData = { ...formData }
    if (checked) {
      updatedData[key] = [...updatedData[key], value]
    } else {
      updatedData[key] = updatedData[key].filter((item) => item !== value)
    }
    setFormData(updatedData)
  }

  const handlePhoneNumberChange = (value) => {
    const cleanedValue = value?.replace(/\D/g, '')
    if (cleanedValue?.length <= maxLength) {
      setFormData({ ...formData, phoneNumber: value })
      setErrors({ ...errors, phoneNumber: '' })
      setPhoneNumber(value)
    }
  }

  const handleToggleDropdown = (dropdownName) => {
    setDropdowns((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }))
  }

  const handleSelectOption = (dropdownName, option) => {
    setFormData((prev) => ({ ...prev, [dropdownName]: option }))
    setDropdowns((prev) => ({ ...prev, [dropdownName]: false }))
  }

  const toggleModelDropdown = () => {
    setModelDropdownVisible(!modelDropdownVisible)
  }

  const handleModelClick = (model) => {
    setSelectedModel(model)
    setModelDropdownVisible(false)
    setFormData((prevFormData) => ({
      ...prevFormData,
      model: model,
    }))
  }

  const handleRequestModalData = (data) => {
    setModalData(data)
    try {
      sessionStorage.setItem(
        pendingPremiumStorageKey('3d'),
        JSON.stringify(data),
      )
    } catch {
      /* ignore quota errors */
    }
    setModalOpen(false)
  }

  const handleRequestTechnicalModalData = (data) => {
    setTechnicalModalData(data)
    try {
      sessionStorage.setItem(
        pendingPremiumStorageKey('technical'),
        JSON.stringify(data),
      )
    } catch {
      /* ignore quota errors */
    }
    if (data !== '') {
      toast.success('Successfully Request sent for technical report')
    }
    setIsTechnicalModalOpen(false)
  }

  const resetPremiumPaymentDrafts = () => {
    setModalData((prev) => clearServiceSlotFields(prev))
    setTechnicalModalData((prev) => clearServiceSlotFields(prev))
    try {
      sessionStorage.removeItem(pendingPremiumStorageKey('3d'))
      sessionStorage.removeItem(pendingPremiumStorageKey('technical'))
    } catch {
      /* ignore */
    }
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }
  const handleCloseModal = () => {
    if (modalData.dateTime !== '') {
      toast('Request submitted successfully')
    }
    setModalOpen(false)
  }
  const handleOpenModal1 = () => {
    setModal1Open(true)
  }
  const handleClose1Modal = () => {
    setModal1Open(false)
  }

  const resetForm = () => {
    setThumbnail(null)
    setQrScan(null)
    setErrors({})
    setVideos([])
    setImages([])
    setFile(null)
    setPhoneNumber('')
    setTotalSize('Size in')
    setTotalPrice(null)
    setSelectedCity('Select a City')
    setSelectedCountry('Select Country')
    setSelectedModel('All')
    setSelectedNeighbourhood('Select Neighbourhood')
    setSelectedCategory('Any')
    setSelectType('Select Property Type')
    setCountryCode('')
    setSelectedCountryPhone('US')
    setIsValid(true)
    setFormData({})
    setTechnicalModalData({
      name: '',
      email: '',
      dateTime: '',
      phone: '',
      productId: '',
      productTitle: '',
      assetType: '',
      category: '',
      subCategory: '',
      value: undefined,
      price: undefined,
    })
    setModalData({
      name: '',
      email: '',
      dateTime: '',
      phone: '',
      productId: '',
      productTitle: '',
      assetType: '',
      category: '',
      subCategory: '',
      value: undefined,
      price: undefined,
    })
  }

  return (
    <ListingContext.Provider
      value={{
        loading,
        isCompressing,
        cityLoading,
        videos,
        errors,
        isOpen,
        countries,
        selectedCountry,
        cities,
        searchParams,
        selectedCity,
        searchQuery,
        listings,
        dropdowns,
        neighbourhoods,
        handleCountrySelect,
        setIsOpen,
        toggleCityDropdown,
        toggleDropdownn,
        toggleModelDropdown,
        handleToggleDropdown,
        selectedNeighbourhood,
        isCityDropdownOpen,
        isNeighbourDropdownOpen,
        selectedModel,
        modelDropdownVisible,
        searchQueryCity,
        searchQueryNeighbourhood,
        formData,
        setFormData,
        setSearchQueryNeighbourhood,
        setSearchQuery,
        setSearchQueryCity,
        handleCitySelect,
        handleModelClick,
        handleNeighbour,
        handleSelectOption,
        selectType,
        handleMouseLeave,
        setThumbnail,
        setQrScan,
        setLand,
        phoneNumber,
        thumbnail,
        qrScan,
        handleOpenModal,
        handleThumbImageRemove,
        handleThumbImageChange,
        handleQrScanChange,
        handleQrScanRemove,
        handleCountryChange,
        isValidState,
        selectedCountryPhone,
        setDropdowns,
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
        setSelectType,
        setModalData,
        isModal1Open,
        technicalModalData,
        isTechnicalModalOpen,
        handleRequestTechnicalModalData,
        resetPremiumPaymentDrafts,
        totalprice,
        handleClose1Modal,
        modalData,
        totalSize,
        handleVideoChange,
        handlePhoneNumberChange,
        id,
        handleRadioChange,
        handleCheckboxChange,
        confirmationModal,
        setConfirmationModal,
        toggleNeighbourDropdown,
        fetchCities,
        handleFormData,
        setIsCityDropdownOpen,
        setErrors,
        file,
        handleScroll,
        setTotalSize,
        setTotalPrice,
        setPhoneNumber,
        setIsValid,
        setIsTechnicalModalOpen,
        fetchData,
        setImages,
        setSelectedModel,
        setFile,
        handleVideoRemove,
        setVideos,
        setTechnicalModalData,
        resetForm,
        setTotalPrice,
        selectedCategory,
        setSelectedCategory,
        setSelectedCountry,
        setSelectedCity,
        setSelectedNeighbourhood,
        setCountryCode,
      }}
    >
      {children}
    </ListingContext.Provider>
  )
}

export default ListingsProvider
