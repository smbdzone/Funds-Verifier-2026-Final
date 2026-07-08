'use client'
import { handleImageUpload } from '@/libs/uploadAsset'
import axios from 'axios'
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
import {
  DUMMY_DUBAI_NEIGHBOURHOODS,
  DUMMY_FALLBACK_COUNTRIES,
  DUMMY_UAE_CITY_PREDICTIONS,
  filterDummyCitiesByQuery,
  isDummyUaeLocationsEnabled,
  isDubaiCitySelection,
  LISTING_COUNTRY_UAE_LABEL,
  toUnitedArabEmiratesListingCountryName,
} from '@/libs/dummyLocationData'
import {
  LISTING_IMAGE_MAX_BYTES,
  LISTING_VIDEO_MAX_BYTES,
} from '@/constants/listingUploadLimits'
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
  const [video, setVideo] = useState(null)
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
    payment_details: {},
    payment_method_status: '',
    price: null,
    userUUID: user?.uuid,
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
    payment_details: {},
    payment_method_status: '',
    price: null,
    userUUID: user?.uuid,
  })

  const [selectedCategory, setSelectedCategory] = useState('Any')
  const [models, setModels] = useState(['2024', '2023', '2022', '2021', '2020'])

  const [dropdowns, setDropdowns] = useState({})
  const [formData, setFormData] = useState({})

  const handleFormData = (form, dropdownData) => {
    setFormData(form)
    setDropdowns(dropdownData)
  }

  const fetchData = async (routeName) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${routeName}/${id}`,
      )
      if (response.status === 200) {
        const d = response.data
        const countryNorm =
          toUnitedArabEmiratesListingCountryName(d.country) ||
          d.country ||
          ''
        setFormData({
          ...d,
          description: d.description || '',
          additionalDescription: d.additionalDescription || '',
          country: countryNorm,
        })
        if (countryNorm) {
          setSelectedCountry(countryNorm)
          if (countryNorm === LISTING_COUNTRY_UAE_LABEL) {
            setCountryCode('AE')
          }
        }
        setTotalPrice(response?.data?.price)
        setPhoneNumber(`${response?.data?.phoneNumber}`)
        setThumbnail(response?.data?.thumbnailImg?.images[0])
        setImages(response?.data?.pictures?.images)
        // setModalData(response.data);
      }
    } catch (error) {
      console.error('Error fetching property data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Retrieve the data from localStorage
    const item = localStorage.getItem('3Dwalkthrough')
    if (item) {
      setModalData(JSON.parse(item)) // Parse the JSON string into an object
    }
  }, []) // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // Retrieve the data from localStorage
    const item = localStorage.getItem('technicalReport')
    if (item) {
      setTechnicalModalData(JSON.parse(item)) // Parse the JSON string into an object
    }
  }, []) // Empty dependency array ensures this runs once on mount

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
        list = list.map((c) =>
          String(c.code || '').toUpperCase() === 'AE'
            ? { ...c, country: LISTING_COUNTRY_UAE_LABEL }
            : c,
        )
        setCountries(list)
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
    const files = Array.from(e.target.files)
    const validFiles = []
    const checkFile = async (file) => {
      let workingFile = file
      // Oversized images are compressed via the API before proceeding. If the
      // API isn't configured yet, keep the original reject-and-skip behaviour.
      if (file.size > LISTING_IMAGE_MAX_BYTES) {
        if (!isCompressionConfigured()) {
          toast.error(`The file ${file.name} exceeds the 5MB size limit`)
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
        for (const file of files) {
          const validFile = await checkFile(file)
          if (validFile) {
            validFiles.push(validFile) // Add valid files to the array
          }
        }

        // Check if the number of images exceeds the limit
        if (images.length + validFiles.length > 7) {
          toast.error('You can only upload a maximum of 7 images')
          return
        }

        // Update images state
        setImages((prevImages) => [...prevImages, ...validFiles])

        // Update formData with the new images
        const imageIDs = await handleImageUpload(validFiles) // Ensure this returns the correct IDs

        setFormData((prevFormData) => ({
          ...prevFormData,
          pictures: imageIDs, // Update the pictures field in formData
        }))
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
    const file = e.target.files[0]
    if (file.size > LISTING_VIDEO_MAX_BYTES) {
      toast.error('Maximum file size for videos is 10MB')
      fileInputRef.current.value = null
      return
    }

    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      setVideo(file)
      fileInputRef.current.value = null
    }

    video.src = URL.createObjectURL(file)
  }

  const handleThumbImageChange = async (event) => {
    let selectedFile = event.target.files[0]
    if (selectedFile) {
      // Oversized thumbnails are compressed via the API before proceeding;
      // otherwise keep the original reject behaviour until the API is set.
      if (selectedFile.size > LISTING_IMAGE_MAX_BYTES) {
        if (!isCompressionConfigured()) {
          toast.error(
            `The file ${selectedFile.name} exceeds the 5MB size limit`,
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
            `Could not compress ${selectedFile.name}: ${
              err?.message || 'try again'
            }`,
          )
          event.target.value = null
          return
        } finally {
          setIsCompressing(false)
        }
      }
      const finalFile = selectedFile
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          setThumbnail(finalFile)
        }
        img.onerror = () => {
          toast.error(
            `The file ${finalFile.name} could not be loaded as an image`,
          )
        }
        img.src = e.target.result
      }
      reader.onerror = () => {
        toast.error(`The file ${finalFile.name} could not be read`)
      }
      reader.readAsDataURL(finalFile)
    }
  }

  const handleVideoRemove = () => {
    setVideo(null)
  }

  const handleThumbImageRemove = (id) => {
    if (id) {
      handleDeleteImg(id)
    } else setThumbnail(null)
  }

  const isValidState = (state) => {
    return (
      state !== null &&
      state !== undefined &&
      Object.keys(state).length > 0 &&
      Object.values(state).some(
        (value) => value !== null && value !== undefined && value !== '',
      )
    )
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
    setFormData({ ...formData, [dropdownName]: option })
    setDropdowns({ ...dropdowns, [dropdownName]: false })
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
    if (data !== '' && modalData.dateTime === '') {
    }
    setModalOpen(false)
  }

  const handleRequestTechnicalModalData = (data) => {
    setTechnicalModalData(data)
    if (data !== '') {
      toast.success('Successfully Request sent for technical report')
    }
    setIsTechnicalModalOpen(false)
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
    setErrors({})
    setVideo(null)
    setImages([])
    setPhoneNumber('')
    setTotalSize('Size in')
    setTotalPrice(null)
    setSelectedCity('Select a City')
    setSelectedCountry('Select Country')
    setSelectedModel('All')
    setSelectedNeighbourhood('Select Neighbourhood')
    setSelectedCategory('Any')
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
        video,
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
        setLand,
        phoneNumber,
        thumbnail,
        handleOpenModal,
        handleThumbImageRemove,
        handleThumbImageChange,
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
        setVideo,
        setTechnicalModalData,
        resetForm,
        setTotalPrice,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ListingContext.Provider>
  )
}

export default ListingsProvider
