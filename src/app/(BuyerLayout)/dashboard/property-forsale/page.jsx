'use client'
import React, { Suspense } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { routes } from '@/libs/api'
import { useState, useEffect } from 'react'
import {
  DUMMY_FALLBACK_COUNTRIES,
  DUMMY_UAE_CITY_PREDICTIONS,
  filterDummyCitiesByQuery,
  getDummyNeighbourhoodsForCity,
  hasDummyNeighbourhoodsForCity,
  isDummyUaeLocationsEnabled,
  LISTING_COUNTRY_UAE_LABEL,
  isUnitedArabEmiratesListingCountry,
  toUnitedArabEmiratesListingCountryName,
  filterCountriesToUaeOnly,
  formatCityLabel,
} from '@/libs/dummyLocationData'
import { autoCapitalizeField } from '@/libs/autoCapitalizeText'
import { parseBedBathCount } from '@/libs/bedBathCount'
import {
  normalizeCountriesResponse,
  normalizeCitiesResponse,
} from '@/libs/normalizeCountriesResponse'
import {
  fetchCatalogCountries,
  fetchCatalogCities,
  mergeCountryOptions,
  mergeCityPredictions,
} from '@/libs/listingLocationCatalog'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import adImage from '@/assets/images/advertisement.png'
import {
  ensureWithinSize,
  isCompressionConfigured,
} from '@/libs/imageCompression'

import {
  handleImageUpload,
  handleVideoUpload,
  handleFileUpload,
  handleThumbnailUpload,
} from '@/libs/uploadAsset'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import customAxios from '../../../../utils/apis/apis'
import ListingMapSection from '@/components/ListingsForm/ListingMapSection'
import {
  LISTING_IMAGE_MAX_BYTES,
  LISTING_IMAGE_MAX_MB,
  LISTING_IMAGE_MAX_COUNT,
  LISTING_VIDEO_MAX_BYTES,
  LISTING_VIDEO_MAX_MB,
  LISTING_VIDEO_MAX_COUNT,
  LISTING_IMAGE_FORMATS_LABEL,
  LISTING_VIDEO_FORMATS_LABEL,
} from '@/constants/listingUploadLimits'

const initialFormData = {
  assetType: 'Property for lease',
  country: LISTING_COUNTRY_UAE_LABEL,
  city: 'Dubai',
  phoneNumber: '',
  neighbourhood: `Burj khalifa district, Dubai, ${LISTING_COUNTRY_UAE_LABEL}`,
  propertyType: 'Villa',
  // beds: "",
  propertyForSale: '',
  propertyForLease: '',
  leaseNumberofCheques: '',
  title: '',
  slug: '',
  pictures: null,
  video: null,
  thumbnailImg: null,
  evaluationCertificate: null,
  video3DWalkthrough: '',
  price: '',
  sizeSQFT: '',
  description: '',
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
  mapUrl: '',
  createdAt: new Date(),
  updatedAt: new Date(),
}

function Page() {
  const [videos, setVideos] = useState([])
  const [errors, setErrors] = useState({})

  const [images, setImages] = useState([])
  // True while oversized images are being compressed via the API — blocks submit.
  const [isCompressing, setIsCompressing] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = []
    const aspectRatioTolerance = 0.05

    const checkFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (event) => {
          const img = new window.Image()

          img.onload = () => {
            const aspectRatio = img.width / img.height
            const isCloseToSquare =
              Math.abs(aspectRatio - 1) <= aspectRatioTolerance

            if (isCloseToSquare) {
              resolve(file)
            } else {
              toast.error(
                `The file ${file.name} does not have a close to 1:1 aspect ratio`
              )
              resolve(null)
            }
          }

          img.onerror = () => {
            toast.error(`The file ${file.name} could not be loaded as an image`)
            resolve(null)
          }

          img.src = event.target.result
        }

        reader.onerror = () => {
          alert(`The file ${file.name} could not be read`)
          resolve(null)
        }

        reader.readAsDataURL(file)
      })
    }

    const processFiles = async () => {
      setIsCompressing(true)
      try {
        for (const file of files) {
          let working = file
          // Oversized images are compressed via the API before proceeding;
          // otherwise keep the original reject behaviour until the API is set.
          if (file.size > LISTING_IMAGE_MAX_BYTES) {
            if (!isCompressionConfigured()) {
              toast.error(`The file ${file.name} exceeds the ${LISTING_IMAGE_MAX_MB}MB size limit`)
              continue
            }
            try {
              working = await ensureWithinSize(file, LISTING_IMAGE_MAX_BYTES)
            } catch (err) {
              toast.error(
                `Could not compress ${file.name}: ${err?.message || 'try again'}`,
              )
              continue
            }
          }
          const validFile = await checkFile(working)
          if (validFile) {
            validFiles.push(validFile)
          }
        }

        if (images.length + validFiles.length > LISTING_IMAGE_MAX_COUNT) {
          toast.error(
            `You can only upload a maximum of ${LISTING_IMAGE_MAX_COUNT} images`,
          )
          return
        }

        setImages((prevImages) => [...prevImages, ...validFiles])
      } finally {
        setIsCompressing(false)
      }
    }

    processFiles()
  }

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const [file, setFile] = useState(null)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleFileRemove = () => {
    setFile(null)
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = []

    for (const file of files) {
      if (file.size > LISTING_VIDEO_MAX_BYTES) {
        toast.error(`Maximum file size for videos is ${LISTING_VIDEO_MAX_MB}MB`)
        continue
      }
      validFiles.push(file)
    }

    if (!validFiles.length) return

    if (videos.length + validFiles.length > LISTING_VIDEO_MAX_COUNT) {
      toast.error(
        `You can only upload a maximum of ${LISTING_VIDEO_MAX_COUNT} videos`,
      )
      return
    }

    setVideos((prev) => [...prev, ...validFiles])
  }

  const handleVideoRemove = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }
  const [thumbnail, setThumbnail] = useState(null)
  const aspectRatioTarget = 1.45
  const aspectRatioTolerance = 0.05 // Allow a 5% deviation

  const handleThumbImageChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new window.Image()

        img.onload = () => {
          const aspectRatio = img.width / img.height
          const isCloseToTargetAspectRatio =
            Math.abs(aspectRatio - aspectRatioTarget) <= aspectRatioTolerance

          if (isCloseToTargetAspectRatio) {
            setThumbnail(selectedFile)
          } else {
            toast.error(
              `The file ${selectedFile.name} does not have a close to 1.45:1 aspect ratio`
            )
          }
        }

        img.onerror = () => {
          toast.error(
            `The file ${selectedFile.name} could not be loaded as an image`
          )
        }

        img.src = e.target.result
      }

      reader.onerror = () => {
        toast.error(`The file ${selectedFile.name} could not be read`)
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  const handleThumbImageRemove = () => {
    setThumbnail(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let video3DWalkthroughID = ''
    let technicalReportID = ''

    try {
      // Check and store video3DWalkthrough ID
      if (isValidState(modalData)) {
        const request3DResponse = await customAxios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/request3d/walkthrough-request`,
          modalData
        )
        video3DWalkthroughID = request3DResponse?.data?.request?.uuid || ''
      }
      // Check and store technicalReport ID
      if (isValidState(technicalModalData)) {
        const technicalReportResponse = await customAxios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/report/technical-report`,
          technicalModalData
        )
        technicalReportID = technicalReportResponse?.data?.report?.uuid
      }
      const imageID = await handleImageUpload(images)
      const videoID = await handleVideoUpload(videos)
      const fileID = await handleFileUpload(file)
      const thumbnailID = await handleThumbnailUpload(thumbnail)

      const updatedFormData = {
        ...formData,
        bedrooms: parseBedBathCount(formData.bedrooms),
        bathrooms: parseBedBathCount(formData.bathrooms),
        video3DWalkthrough: video3DWalkthroughID,
        technicalReport: technicalReportID,
        pictures: imageID,
        video: videoID,
        evaluationCertificate: fileID,
        thumbnailImg: thumbnailID,
      }

      const validationErrors = validateForm(updatedFormData)
      if (Object.keys(validationErrors).length === 0) {
        setFormData(updatedFormData)

        // Add your form submission logic here
        try {
          const response = await customAxios.post(
            routes.propertyListing,
            updatedFormData
          )
        } catch (error) {
          console.error('Error submitting form:', error)
        }
      } else {
        setErrors(validationErrors)
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      // Handle error (e.g., show error message)
    }
  }

  const [formData, setFormData] = useState(initialFormData)
  const [countryOptions, setCountryOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [neighbourhoodOptions, setNeighbourhoodOptions] = useState([])
  const [dropdowns, setDropdowns] = useState({
    leaseNumberofCheques: false,
    bedrooms: false,
    bathrooms: false,
    isFurnished: false,
    occupancyStatus: false,
    bedrooms: false,
    country: false,
    city: false,
    neighbourhood: false,
  })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        const list = normalizeCountriesResponse(data)
        const catalogCountries = await fetchCatalogCountries()
        if (!cancelled) {
          setCountryOptions(
            mergeCountryOptions(
              filterCountriesToUaeOnly(
                list.length > 0 ? list : [...DUMMY_FALLBACK_COUNTRIES],
              ),
              catalogCountries,
            ),
          )
        }
      } catch {
        if (!cancelled) {
          const catalogCountries = await fetchCatalogCountries()
          setCountryOptions(
            mergeCountryOptions(
              filterCountriesToUaeOnly([...DUMMY_FALLBACK_COUNTRIES]),
              catalogCountries,
            ),
          )
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const resolveCode = () => {
      const match = countryOptions.find(
        (c) =>
          c.country === formData.country ||
          (isUnitedArabEmiratesListingCountry(formData.country) &&
            c.code === 'AE'),
      )
      return (
        match?.code ??
        (isUnitedArabEmiratesListingCountry(formData.country) ? 'AE' : '')
      )
    }

    const load = async () => {
      const code = resolveCode()
      const catalogCities = formData.country
        ? await fetchCatalogCities(formData.country)
        : []
      const apply = (base) => {
        if (!cancelled) {
          setCityOptions(mergeCityPredictions(base, catalogCities, ''))
        }
      }

      if (!code && !formData.country) {
        if (!cancelled) setCityOptions([])
        return
      }
      if (isDummyUaeLocationsEnabled && code === 'AE') {
        apply(filterDummyCitiesByQuery(DUMMY_UAE_CITY_PREDICTIONS, ''))
        return
      }
      if (!/^[A-Z]{2}$/.test(String(code || '').toUpperCase())) {
        apply([])
        return
      }
      try {
        const response = await fetch(`/api/country?name=${code}&query=`)
        if (!response.ok) throw new Error('cities')
        const data = await response.json()
        let normalized = normalizeCitiesResponse(data)
        if (code === 'AE' && normalized.length === 0) {
          normalized = filterDummyCitiesByQuery(DUMMY_UAE_CITY_PREDICTIONS, '')
        }
        apply(normalized)
      } catch {
        if (code === 'AE') {
          apply(filterDummyCitiesByQuery(DUMMY_UAE_CITY_PREDICTIONS, ''))
        } else {
          apply([])
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [formData.country, countryOptions])

  useEffect(() => {
    let cancelled = false
    const city = formData.city?.trim()
    const load = async () => {
      if (!city) {
        if (!cancelled) setNeighbourhoodOptions([])
        return
      }
      if (hasDummyNeighbourhoodsForCity(city)) {
        if (!cancelled) setNeighbourhoodOptions(getDummyNeighbourhoodsForCity(city))
        return
      }
      try {
        const response = await fetch(
          `/api/neighbourhoods?address=${encodeURIComponent(city)}`,
        )
        if (!response.ok) throw new Error('neighbourhoods')
        const data = await response.json()
        const places = Array.isArray(data?.places) ? data.places : []
        if (!cancelled) setNeighbourhoodOptions(places)
      } catch {
        if (!cancelled) setNeighbourhoodOptions([])
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [formData.city])

  const toggleLocationDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      country: key === 'country' ? !prev.country : false,
      city: key === 'city' ? !prev.city : false,
      neighbourhood: key === 'neighbourhood' ? !prev.neighbourhood : false,
    }))
  }

  const handleLocationCountryPick = (country) => {
    setFormData((prev) => ({
      ...prev,
      country:
        toUnitedArabEmiratesListingCountryName(country.country) ||
        country.country,
      city: '',
      neighbourhood: '',
    }))
    setNeighbourhoodOptions([])
    setDropdowns((d) => ({ ...d, country: false }))
  }

  const handleLocationCityPick = (cityRow) => {
    const cityName = formatCityLabel(
      typeof cityRow === 'object' && cityRow?.description
        ? cityRow.description
        : String(cityRow),
    )
    setFormData((prev) => ({
      ...prev,
      city: cityName,
      neighbourhood: '',
    }))
    setDropdowns((d) => ({ ...d, city: false }))
  }

  const handleLocationNeighbourhoodPick = (n) => {
    const name = typeof n === 'object' && n?.name != null ? n.name : String(n)
    setFormData((prev) => ({ ...prev, neighbourhood: name }))
    setDropdowns((d) => ({ ...d, neighbourhood: false }))
  }

  // Define static options
  const leaseNumberofChequesOptions = ['1', '2', '3', '4', '5', '6']
  const bathroomsOptions = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12+',
  ]

  const bedroomsOptions = [
    'Studio',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12+',
  ]

  const companiesOptions = ['Land Sterling Property Consultants LLC']

  const occupancyStatusOptions = ['Vacant', 'Occupied']
  const isFurnishedOptions = ['Furnished', 'Unfurnished']

  const listings = ['Private', 'Public']

  const facilities = [
    'Maids Room',
    'Private Garden',
    'Private Pool',
    'Concierge Service',
    'Built in Kitchen Appliances',
    'Balcony',
    'Study',
    'Shared Spa',
    'Private Gym',
    'Retail Outlets',
    'Private Jacuzzi',
    'Shared Pool',
    'Covered Parking',
    'Shared Gym',
    'Reception / Waiting Room',
    'Security',
    'Maid Service',
    'View of Landmark',
    'Laundry Room',
    'First Aid Medical Center',
    'Walk-in Closet',
    'View of Water',
    'Day Care Center',
    'Intercom',
    'Double Glazed Windows',
    'Pets Allowed',
    'Service Elevators',
    'Prayer Room',
    'Facilities for Disabled',
    'Built in Wardrobes',
    'Business Center',
    'Satellite / Cable TV',
    'Central heating',
    'Lobby in Building',
    'Recycling Facilities',
    'CCTV Security',
    'Kids Play Area',
    'Central A/C',
    'Barbeque Area',
    'Sport Courts',
    'Storage Areas',
    'Maintenance Staff',
    'Chiller A/C',
    'Cleaning Services',
  ]

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
    setFormData({ ...formData, phoneNumber: value })
    setErrors({ ...errors, phoneNumber: '' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    const next =
      name === 'country'
        ? toUnitedArabEmiratesListingCountryName(value) || value
        : autoCapitalizeField(name, value)
    setFormData({ ...formData, [name]: next })
    setErrors({ ...errors, [name]: '' })
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

  const truncateFileName = (fileName) => {
    return fileName.length > 30 ? `${fileName.substring(0, 30)}...` : fileName
  }

  const validateForm = (data) => {
    const errors = {}

    if (!data.assetType.trim()) errors.assetType = 'Asset type is required'
    if (!data.country.trim()) errors.country = 'Country is required'
    if (!data.city.trim()) errors.city = 'City is required'
    if (!data.neighbourhood.trim())
      errors.neighbourhood = 'Neighbourhood is required'

    if (!data.sizeSQFT.trim()) errors.sizeSQFT = 'Size is required'
    if (!data.title.trim()) {
      errors.title = 'Title is required'
    } else if (data.title.length > 60) {
      errors.title = 'Title must be less than 60 characters'
    }
    if (!data.price.trim()) errors.price = 'Price is required'
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!isValidPhoneNumber(data.phoneNumber)) {
      errors.phoneNumber = 'Phone number is invalid'
    }

    if (!data.description.trim()) errors.description = 'Description is required'

    if (!data.leaseNumberofCheques.trim())
      errors.leaseNumberofCheques = 'leaseNumberofCheques is required'
    if (!data.bathrooms.trim()) errors.bathrooms = 'Bathrooms is required'
    if (
      data.bedrooms == null ||
      data.bedrooms === '' ||
      (typeof data.bedrooms === 'string' && !String(data.bedrooms).trim())
    ) {
      if (data.bedrooms !== 0) errors.bedrooms = 'Bedrooms is required'
    }
    if (!data.occupancyStatus.trim())
      errors.occupancyStatus = 'Occupancy Status is required'
    if (!data.evaluationCompanies.trim())
      errors.evaluationCompanies = 'Evaluation companies is required'
    if (!data.sellerTransferFee.trim())
      errors.sellerTransferFee = 'Seller TransferFee is required'

    return errors
  }

  const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber && phoneNumber.length >= 10 // Example validation
  }

  const handleRadioChange = (e, fieldName) => {
    const { value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }))
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
        }
        break
      case 'description':
        if (!value.trim()) {
          error = 'Description is required'
        }
        break
      case 'sizeSQFT':
        if (!value.trim()) {
          error = 'Size SQFT is required'
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
      // Add more cases for other fields if needed
      default:
        break
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const [isModalOpen, setModalOpen] = useState(false)

  const handleInputClick = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }
  const [description, setDescription] = useState('')

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <section>
          <ToastContainer />
          <h2
            className='text-dark-grey text-center xl:text-[40px] lg:text-4xl md:text-3xl sm:text-2xl
      xxs:text-xl font-medium leading-normal pt-[60px]'
          >
            Final Steps to Listing Your Asset
          </h2>
          {/* assest type  */}
          <div className='px-5'>
            <div
              className='mt-[51px] flex md:flex md:flex-row sm:grid sm:grid-cols-3 xxs:grid xxs:grid-cols-2 md:justify-between
       xxs:justify-center md:gap-[11px] xxs:gap-5 max-w-[1300px] mx-auto shadow-neons bg-whitee rounded-[5px] py-[14px]
      pl-[10px] md:pr-[32px] xxs:pr-[10px] md:h-[70px] sm:h-[215px] xxs:h-[280px]'
            >
              {/* one  */}
              <div>
                <div className='relative'>
                  <button
                    className='dropdownButton flex items-center text-light-blue'
                    type='button'
                  >
                    <div className>
                      <p className=' xl:text-lg lg:text-base md:text-[12px] xxs:text-sm font-medium text-dark-black'>
                        Asset Type
                      </p>
                      <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                        Asset Holder
                      </p>
                    </div>
                    <Image
                      width={12}
                      height={12}
                      src='/listing/arrowgold.svg'
                      alt='arrowblue'
                      className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                    />
                    <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
                  </button>
                  {/* Dropdown menu */}
                  <div
                    className='dropdownMenu hidden absolute mt-2 w-[106px] bg-whitee divide-y
                  divide-gray-100 rounded-lg shadow-neon z-10'
                  >
                    <ul className='text-xs'>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white  px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Earnings
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* two  */}
              <div>
                <div className='relative'>
                  <button
                    className='dropdownButton flex items-center text-light-blue'
                    type='button'
                    onClick={() => toggleLocationDropdown('country')}
                  >
                    <div className>
                      <p className=' xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                        Country
                      </p>
                      <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey truncate max-w-[140px]'>
                        {toUnitedArabEmiratesListingCountryName(
                          formData.country,
                        ) ||
                          formData.country ||
                          'Select country'}
                      </p>
                    </div>
                    <Image
                      width={12}
                      height={12}
                      src='/listing/arrowgold.svg'
                      alt='arrowblue'
                      className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                    />
                    <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
                  </button>
                  {dropdowns.country && (
                    <div className='absolute z-20 mt-2 left-0 min-w-[200px] max-h-[240px] overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow-neon border border-gray-100'>
                      {countryOptions.length === 0 ? (
                        <p className='px-3 py-2 text-xs text-gray-500'>
                          Loading countries…
                        </p>
                      ) : (
                        countryOptions.map((c) => (
                          <button
                            key={`${c.code}-${c.country}`}
                            type='button'
                            className='block w-full text-left border-b border-b-light-white px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs font-normal'
                            onClick={() => handleLocationCountryPick(c)}
                          >
                            {toUnitedArabEmiratesListingCountryName(c.country) ||
                              c.country}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* three  */}
              <div>
                <div className='relative'>
                  <button
                    className='dropdownButton flex items-center text-light-blue'
                    type='button'
                    onClick={() => toggleLocationDropdown('city')}
                  >
                    <div className>
                      <p className=' xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                        City
                      </p>
                      <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey truncate max-w-[140px]'>
                        {formatCityLabel(formData.city) || 'Select city'}
                      </p>
                    </div>
                    <Image
                      width={12}
                      height={12}
                      src='/listing/arrowgold.svg'
                      alt='arrowblue'
                      className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                    />
                    <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
                  </button>
                  {dropdowns.city && (
                    <div className='absolute z-20 mt-2 left-0 min-w-[220px] max-h-[240px] overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow-neon border border-gray-100'>
                      {cityOptions.length === 0 ? (
                        <p className='px-3 py-2 text-xs text-gray-500'>
                          Select a country first, or enable dummy United Arab
                          Emirates location data if the city API is unavailable.
                        </p>
                      ) : (
                        cityOptions.map((row, idx) => {
                          const label = formatCityLabel(
                            typeof row === 'object' && row?.description
                              ? row.description
                              : String(row),
                          )
                          return (
                            <button
                              key={`${label}-${idx}`}
                              type='button'
                              className='block w-full text-left border-b border-b-light-white px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs font-normal'
                              onClick={() => handleLocationCityPick(row)}
                            >
                              {label}
                            </button>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* four  */}
              <div>
                <div className='relative'>
                  <button
                    className='dropdownButton flex items-center text-light-blue'
                    type='button'
                    onClick={() => toggleLocationDropdown('neighbourhood')}
                  >
                    <span className='sr-only'>Neighbourhood menu</span>
                    <div className>
                      <p className=' xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                        Neighbourhood
                      </p>
                      <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey truncate max-w-[140px]'>
                        {formData.neighbourhood || 'Select neighbourhood'}
                      </p>
                    </div>
                    <Image
                      width={12}
                      height={12}
                      src='/listing/arrowgold.svg'
                      alt='arrowblue'
                      className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                    />
                    <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
                  </button>
                  {dropdowns.neighbourhood && (
                    <div className='absolute z-20 mt-2 left-0 min-w-[200px] max-h-[240px] overflow-y-auto bg-white divide-y divide-gray-100 rounded-lg shadow-neon border border-gray-100'>
                      {neighbourhoodOptions.length === 0 ? (
                        <p className='px-3 py-2 text-xs text-gray-500'>
                          Select a city first. Dubai areas use dummy data if the
                          API returns nothing.
                        </p>
                      ) : (
                        neighbourhoodOptions.map((row, idx) => {
                          const label =
                            typeof row === 'object' && row?.name != null
                              ? row.name
                              : String(row)
                          return (
                            <button
                              key={`${label}-${idx}`}
                              type='button'
                              className='block w-full text-left border-b border-b-light-white px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs font-normal'
                              onClick={() =>
                                handleLocationNeighbourhoodPick(row)
                              }
                            >
                              {label}
                            </button>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* five  */}
              <div>
                <div className='relative'>
                  <button
                    className='dropdownButton flex items-center text-light-blue'
                    type='button'
                  >
                    <span className='sr-only'>Open user menu</span>
                    <div className>
                      <p className=' xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                        Property
                      </p>
                      <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                        Apartment
                      </p>
                    </div>
                    <Image
                      width={12}
                      height={12}
                      src='/listing/arrowgold.svg'
                      alt='arrowblue'
                      className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                    />
                    <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px] top-[-14px]' />
                  </button>
                  {/* Dropdown menu */}
                  <div
                    className='dropdownMenu hidden absolute mt-2 w-[106px] bg-whitee divide-y
                  divide-gray-100 rounded-lg shadow-neon z-10'
                  >
                    <ul className='text-xs'>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white  px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Earnings
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* six  */}
              <div>
                <div className='relative'>
                  <button
                    className='dropdownButton flex items-center text-light-blue'
                    type='button'
                  >
                    <span className='sr-only'>Open user menu</span>
                    <div className>
                      <p className=' xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                        Price Range
                      </p>
                      <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                        All
                      </p>
                    </div>
                    <Image
                      width={12}
                      height={12}
                      src='/listing/arrowgold.svg'
                      alt='arrowblue'
                      className='xl:ml-[30px] lg:ml-[20px] xxs:ml-[10px]'
                    />
                    <div className='md:block xxs:hidden w-[1px] h-[70px] bg-dark-grey absolute xl:right-[-30px] md:right-[-10px] xxs:right-[-10px]] top-[-14px]' />
                  </button>
                  {/* Dropdown menu */}
                  <div
                    className='dropdownMenu hidden absolute mt-2 w-[106px] bg-whitee divide-y
                  divide-gray-100 rounded-lg shadow-neon z-10'
                  >
                    <ul className='text-xs'>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white  px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Earnings
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* seven  */}
              <div>
                <div className='relative'>
                  <button
                    className='dropdownButton flex items-center text-light-blue'
                    type='button'
                  >
                    <span className='sr-only'>Open user menu</span>
                    <div className>
                      <p className=' xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black'>
                        Beds
                      </p>
                      <p className=' lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey'>
                        Any
                      </p>
                    </div>
                    <Image
                      width={12}
                      height={12}
                      src='/listing/arrowgold.svg'
                      alt='arrowblue'
                      className='xl:ml-[30px] lg:ml-[10px] md:ml-[6px] xxs:ml-[10px]'
                    />
                  </button>
                  {/* Dropdown menu */}
                  <div
                    className='dropdownMenu hidden absolute mt-2 w-[106px] bg-whitee divide-y
                  divide-gray-100 rounded-lg shadow-neon z-10'
                  >
                    <ul className='text-xs'>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block border-b border-b-light-white  px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='block px-[10px] py-[7px] hover:bg-gray-100 text-light-blue text-xs 
                              font-normal'
                        >
                          Earnings
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end  */}
          <div className='px-5'>
            <main className='max-w-[1300px] mx-auto lg:px-[35px] md:px-10 xxs:px-5 shadow-neons bg-whitee rounded-[5px]'>
              {/* input one  */}
              <form className='pt-[50px]'>
                <div className='grid gap-6 md:grid-cols-2 xxs:grid-cols-1'>
                  <div className='relative flex flex-col justify-start'>
                    <input
                      type='text'
                      maxLength={60}
                      className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.title ? '   ' : ''
                        }`}
                      required
                      placeholder='Title your property (max. 60 characters)'
                      name='title'
                      value={formData.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {/* 2  */}

                  <div className='relative w-full '>
                    <PhoneInput
                      flags={flags}
                      className={`shadow-neons w-full h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal outline-none ${errors.phoneNumber ? 'border-red-500 border' : ''
                        }`}
                      placeholder='Enter phone number'
                      value={formData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />

                    {errors.phoneNumber && !formData.phoneNumber ? (
                      <span className='text-red-500 text-sm font-medium absolute top-[50px]'>
                        **{errors.phoneNumber}
                      </span>
                    ) : (
                      <div className='absolute inset-y-0 right-0 top-[9px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer'>
                        {errors.phoneNumber ? (
                          <span className='text-red-500 text-3xl font-medium z-9999'>
                            {' '}
                            &times;
                          </span>
                        ) : (
                          <div className='required'>
                            <Image
                              className='absolute top-3 right-3'
                              width={14}
                              height={14}
                              src='/listing/tick.svg'
                              alt='cross'
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='shadow-neons h-[191px] relative px-[20px] pt-[13px]'>
                    <h2 className='text-dark-grey text-[15px] font-normal leading-[26px]'>
                      Accepted formats:
                    </h2>
                    <p className='text-dark-grey text-[10px] font-normal leading-[177%]'>
                      {LISTING_IMAGE_FORMATS_LABEL}
                    </p>

                    <div className='flex flex-wrap mt-2 w-[80%]'>
                      {thumbnail && (
                        <div className='w-2/5 p-2 relative group'>
                          <Image
                            width={20}
                            height={20}
                            src={URL.createObjectURL(thumbnail)}
                            alt='uploaded-image'
                            className='w-full h-auto'
                          />
                          <button
                            onClick={handleThumbImageRemove}
                            className='absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-light-gold text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                            title='Remove image'
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </div>

                    <input
                      type='file'
                      id='car-thumbnail'
                      className='hidden'
                      accept='image/*'
                      required
                      onChange={handleThumbImageChange}
                    />

                    <div className='absolute right-[20px] xl:top-0 xxs:top-[55px]'>
                      <label
                        htmlFor='car-thumbnail'
                        className='flex flex-col items-center justify-center w-[176px] xl:h-[154px] xxs:h-[110px] shadow-neonsm cursor-pointer my-[19px]'
                      >
                        <Image
                          width={45}
                          height={45}
                          src='/listing/camera.svg'
                          alt='Upload Image'
                        />
                        <span className='text-[17px] text-dark-grey font-normal pt-[18px]'>
                          Add Thumbnail
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 3  */}
                  <div className='shadow-neons h-[191px] relative px-[20px] pt-[13px]'>
                    <h2 className='text-dark-grey text-[15px] font-normal leading-[26px]'>
                      Accepted formats:
                    </h2>
                    <p className='text-dark-grey text-[10px] font-normal leading-[177%]'>
                      {LISTING_IMAGE_FORMATS_LABEL}
                    </p>

                    <div className='flex flex-wrap mt-4 w-[60%]'>
                      {images.map((image, index) => (
                        <div key={index} className='w-1/5 p-2 relative group'>
                          <Image
                            width={20}
                            height={20}
                            src={URL.createObjectURL(image)}
                            alt={`upload-${index}`}
                            className='w-full h-auto'
                          />

                          <button
                            onClick={() => handleImageRemove(index)}
                            className='absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-light-gold text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                            title='Remove image'
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>

                    <input
                      type='file'
                      id='car-image'
                      className='hidden'
                      accept='image/*'
                      multiple
                      required
                      onChange={handleImageChange}
                    />

                    <div className='absolute right-[20px] xl:top-0 xxs:top-[55px]'>
                      <label
                        htmlFor='car-image'
                        className='flex flex-col items-center justify-center w-[176px] 
          xl:h-[154px] xxs:h-[110px] 
          shadow-neonsm cursor-pointer my-[19px]'
                      >
                        <Image
                          width={45}
                          height={45}
                          src='/listing/camera.svg'
                          alt='Upload Image'
                          onChange={handleImageChange}
                        />

                        <span className='text-[17px] text-dark-grey font-normal pt-[18px]'>
                          Add Pictures
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 4 */}

                  <div className='shadow-neons h-[190px] relative px-[20px] pt-[13px]'>
                    <h2 className='text-dark-grey text-[15px] font-normal leading-[26px]'>
                      Accepted formats:
                    </h2>
                    <p className='text-dark-grey text-[10px] font-normal leading-[177%]'>
                      {LISTING_VIDEO_FORMATS_LABEL}
                    </p>

                    {videos.map((file, index) => (
                      <div className='relative mt-2 h-28 w-28' key={`${file.name}-${index}`}>
                        <video
                          width='100%'
                          controls
                          src={URL.createObjectURL(file)}
                          className='w-full h-auto'
                        />
                        <button
                          type='button'
                          onClick={() => handleVideoRemove(index)}
                          className='absolute top-0 right-0 p-1 bg-light-gold text-white rounded-full'
                          title='Remove video'
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    <input
                      type='file'
                      id='video-upload'
                      className='hidden'
                      accept='video/*'
                      multiple
                      disabled={videos.length >= LISTING_VIDEO_MAX_COUNT}
                      onChange={handleVideoChange}
                    />

                    <div className='absolute right-[20px] xl:top-0 xxs:top-[55px]'>
                      <label
                        htmlFor={
                          videos.length < LISTING_VIDEO_MAX_COUNT
                            ? 'video-upload'
                            : undefined
                        }
                        className={`flex flex-col items-center justify-center w-[176px] 
            xl:h-[144px] xxs:h-[110px] 
            shadow-neonsm my-[19px] ${videos.length < LISTING_VIDEO_MAX_COUNT
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed opacity-60'
                          }`}
                      >
                        <Image
                          width={40}
                          height={40}
                          src='/listing/video.svg'
                          alt='Upload Video'
                        />
                        <span className='text-[17px] text-dark-grey font-normal pt-[17px]'>
                          Add Video
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 5  */}

                  <div className='relative w-full dropdown-container space-y-6'>
                    <div className='custom-container-dev'>
                      <textarea
                        className={`shadow-neons p-2 h-[116px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.description ? 'input-field-error' : ''
                          }`}
                        required
                        placeholder='Tell us about your Car (max. 300 characters)'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      {errors.description && (
                        <span className='text-red-500 text-sm font-medium absolute top-[99%]'>
                          **{errors.description}
                        </span>
                      )}
                    </div>

                    <div className='relative w-full dropdown-container'>
                      <div className='custom-container-dev'>
                        <input
                          type='text'
                          className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.price && !formData.price
                            ? 'input-field-error'
                            : ''
                            }`}
                          placeholder='Price'
                          // pattern="^4[0-9]{12}(?:[0-9]{3})?$"
                          name='price'
                          value={formData.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                      </div>
                      {errors.price && !formData.price && (
                        <span className='text-red-500 text-sm font-medium absolute top-[50px]'>
                          **{errors.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-span-2'>
                    <div className='w-full  '>
                      <textarea
                        id='description'
                        name='description'
                        rows={5}
                        className='mt-1 block w-full outline-none  p-3 border-2 border-black/10  rounded-md shadow-sm  sm:text-sm'
                        placeholder='Description'
                        value={description}
                        onChange={handleDescriptionChange}
                      />
                    </div>
                  </div>
                  <div className='relative w-full dropdown-container'>
                    <div className='relative-placeholder w-full'>
                      <input
                        type='text'
                        maxLength={50}
                        className='shadow-neons w-full h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal'
                        name='video3DWalkthrough'
                        value={formData.video3DWalkthrough}
                        onChange={handleChange}
                      />

                      {formData.video3DWalkthrough === '' && (
                        <div
                          className={`custom-placeholder text-sm absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ease-in-out
                      ${errors.video3DWalkthrough ? '   ' : ''}
                      `}
                        >
                          <span className='text-gray-400'>
                            3D Walkthrough Embedded Link
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='relative flex flex-col justify-start'>
                      <input
                        type='text'
                        maxLength={50}
                        className={`shadow-neons mt-[16px] w-full h-[50px] pl-5 outline-1 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.sizeSQFT ? '   ' : ''
                          }`}
                        required
                        placeholder='Size in SQFT
                    '
                        name='sizeSQFT'
                        value={formData.sizeSQFT}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>

                  <div className='relative w-full dropdown-container space-y-5'>
                    <div className='relative w-full dropdown-container'>
                      <div className='custom-container-dev'>
                        <input
                          type='text'
                          className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.evaluationCompanies &&
                            !formData.evaluationCompanies
                            ? '    '
                            : ''
                            }`}
                          placeholder='Evaluation Companies'
                          name='evaluationCompanies'
                          value={formData.evaluationCompanies}
                          readOnly // Ensure input is read-only
                          onClick={() =>
                            handleToggleDropdown('evaluationCompanies')
                          }
                        />

                        {/* {errors.evaluationCompanies && !formData.evaluationCompanies && (
                        <span className="text-red-500 text-sm font-medium absolute top-[50px]">
                          **{errors.evaluationCompanies}
                        </span>
                      )} */}
                      </div>
                      <div className='absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                        <Image
                          width={12}
                          height={12}
                          src='/listing/Vector.svg'
                          alt='Dropdown'
                          className='toggle-icon'
                          onClick={() =>
                            handleToggleDropdown('evaluationCompanies')
                          }
                        />
                        <Image
                          width={12}
                          height={12}
                          src='/listing/vector1.svg'
                          alt='Dropdown'
                          className='toggle-icon rotate-180'
                          onClick={() =>
                            handleToggleDropdown('evaluationCompanies')
                          }
                        />
                      </div>
                      {dropdowns.evaluationCompanies && (
                        <div className='absolute z-10 p-4 inset-y-0 right-0 w-full h-fit bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                          {companiesOptions.map((option, index) => (
                            <div
                              key={index}
                              className='dropdown-option'
                              onClick={() =>
                                handleSelectOption(
                                  'evaluationCompanies',
                                  option
                                )
                              }
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className='relative w-full dropdown-container'>
                      {/* <input
                      type="text"
                      readOnly
                      className={`shadow-neons w-full h-[50px] pl-5 pr-14 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input ${
                        errors.evaluationCertificate
                          ? "border-red-500 border outline-none focus:outline-none"
                          : ""
                      }`}
                      placeholder="Evaluation Certificate"
                      pattern="^4[0-9]{12}(?:[0-9]{3})?$"
                      required
                    /> */}

                      {/* <Modal show={isModalOpen} onClose={handleCloseModal} /> */}

                      {/* {errors.evaluationCompanies &&
                      !formData.evaluationCompanies && (
                        <span className="text-red-500 text-sm font-medium absolute top-[50px]">
                          **{errors.evaluationCompanies}
                        </span>
                      )} */}
                      <div className='absolute inset-y-0 left-[260px] flex items-center pr-4'>
                        <label
                          htmlFor='file-upload'
                          className='cursor-pointer grid grid-cols-2 place-content-between'
                        >
                          <Image
                            width={20}
                            height={20}
                            src='/listing/lastarrow.svg'
                            alt='Upload Icon'
                          />
                        </label>
                        <input
                          type='file'
                          id='file-upload'
                          className='hidden'
                          accept='application/pdf'
                          onChange={handleFileChange}
                        />
                      </div>
                      {file === null ? (
                        <Image
                          width={23}
                          height={23}
                          src='/listing/infoicon.svg'
                          alt='infoicon'
                          onClick={handleInputClick}
                          className='absolute right-[15px] top-[15px]'
                        />
                      ) : (
                        <div className='absolute right-[15px] top-[15px] text-dark-grey'>
                          {truncateFileName(file.name)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 13  */}
                  <div className='relative w-full dropdown-container'>
                    <div className='custom-container-dev'>
                      <input
                        type='text'
                        className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.leaseNumberofCheques &&
                          !formData.leaseNumberofCheques
                          ? '    '
                          : ''
                          }`}
                        placeholder='Lease Number of Cheques'
                        required
                        name='leaseNumberofCheques'
                        value={formData.leaseNumberofCheques}
                        readOnly
                        onClick={() =>
                          handleToggleDropdown('leaseNumberofCheques')
                        }
                      />
                      {errors.leaseNumberofCheques &&
                        !formData.leaseNumberofCheques && (
                          <span className='text-red-500 text-sm font-medium absolute top-[50px]'>
                            **{errors.leaseNumberofCheques}
                          </span>
                        )}

                      <div className='absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                        <Image
                          width={12}
                          height={12}
                          src='/listing/Vector.svg'
                          alt='Dropdown'
                          className='toggle-icon'
                          onClick={() =>
                            handleToggleDropdown('leaseNumberofCheques')
                          }
                        />
                        <Image
                          width={12}
                          height={12}
                          src='/listing/vector1.svg'
                          alt='Dropdown'
                          className='toggle-icon rotate-180'
                          onClick={() =>
                            handleToggleDropdown('leaseNumberofCheques')
                          }
                        />
                      </div>
                      {dropdowns.leaseNumberofCheques && (
                        <div className='absolute z-10 p-4 inset-y-0 right-0 w-full h-fit bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                          {leaseNumberofChequesOptions.map((option, index) => (
                            <div
                              key={index}
                              className='dropdown-option'
                              onClick={() =>
                                handleSelectOption(
                                  'leaseNumberofCheques',
                                  option
                                )
                              }
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 14  */}

                  <div className='relative w-full dropdown-container'>
                    <div className='custom-container-dev'>
                      <input
                        type='text'
                        className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.bedrooms && !formData.bedrooms ? '    ' : ''
                          }`}
                        placeholder='Bedrooms'
                        name='bedrooms'
                        value={formData.bedrooms}
                        readOnly // Ensure input is read-only
                        onClick={() => handleToggleDropdown('bedrooms')}
                      />

                      {errors.bedrooms && !formData.bedrooms && (
                        <span className='text-red-500 text-sm font-medium absolute top-[50px]'>
                          **{errors.bedrooms}
                        </span>
                      )}
                      <div className='absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                        <Image
                          width={12}
                          height={12}
                          src='/listing/Vector.svg'
                          alt='Dropdown'
                          className='toggle-icon'
                          onClick={() => handleToggleDropdown('bedrooms')}
                        />
                        <Image
                          width={12}
                          height={12}
                          src='/listing/vector1.svg'
                          alt='Dropdown'
                          className='toggle-icon rotate-180'
                          onClick={() => handleToggleDropdown('bedrooms')}
                        />
                      </div>
                      {dropdowns.bedrooms && (
                        <div className='absolute z-10 p-4 inset-y-0 right-0 w-full h-fit bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                          {bedroomsOptions.map((option, index) => (
                            <div
                              key={index}
                              className='dropdown-option'
                              onClick={() =>
                                handleSelectOption('bedrooms', option)
                              }
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 15  */}

                  <div className='relative w-full dropdown-container'>
                    <div className='custom-container-dev'>
                      <input
                        type='text'
                        className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.bathrooms && !formData.bathrooms ? '    ' : ''
                          }`}
                        placeholder='Bathrooms'
                        name='bathrooms'
                        value={formData.bathrooms}
                        readOnly // Ensure input is read-only
                        onClick={() => handleToggleDropdown('bathrooms')}
                      />

                      {errors.bathrooms && !formData.bathrooms && (
                        <span className='text-red-500 text-sm font-medium absolute top-[50px]'>
                          **{errors.bathrooms}
                        </span>
                      )}
                      <div className='absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                        <Image
                          width={12}
                          height={12}
                          src='/listing/Vector.svg'
                          alt='Dropdown'
                          className='toggle-icon'
                          onClick={() => handleToggleDropdown('bathrooms')}
                        />
                        <Image
                          width={12}
                          height={12}
                          src='/listing/vector1.svg'
                          alt='Dropdown'
                          className='toggle-icon rotate-180'
                          onClick={() => handleToggleDropdown('bathrooms')}
                        />
                      </div>
                      {dropdowns.bathrooms && (
                        <div className='absolute z-10 p-4 inset-y-0 right-0 w-full h-fit bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                          {bathroomsOptions.map((option, index) => (
                            <div
                              key={index}
                              className='dropdown-option'
                              onClick={() =>
                                handleSelectOption('bathrooms', option)
                              }
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 16  */}

                  <div className='relative-placeholder w-full'>
                    <div className='custom-container-dev'>
                      <input
                        type='text'
                        maxLength={50}
                        className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors.occupancyStatus && !formData.occupancyStatus
                          ? '    '
                          : ''
                          }`}
                        required
                        placeholder='Occupancy Status'
                        name='occupancyStatus'
                        value={formData.occupancyStatus}
                        readOnly={true}
                        onClick={() => handleToggleDropdown('occupancyStatus')}
                      />
                      {errors.occupancyStatus && !formData.occupancyStatus && (
                        <span className='text-red-500 text-sm font-medium absolute top-[50px]'>
                          **{errors.occupancyStatus}
                        </span>
                      )}
                    </div>

                    <div className='absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                      <Image
                        width={12}
                        height={12}
                        src='/listing/Vector.svg'
                        alt='Dropdown'
                        className='toggle-icon'
                        onClick={() => handleToggleDropdown('occupancyStatus')}
                      />
                      <Image
                        width={12}
                        height={12}
                        src='/listing/vector1.svg'
                        alt='Dropdown'
                        className='toggle-icon rotate-180'
                        onClick={() => handleToggleDropdown('occupancyStatus')}
                      />
                    </div>
                    {dropdowns.occupancyStatus && (
                      <div className='absolute z-10 p-4 inset-y-0 right-0 w-full h-fit bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                        {occupancyStatusOptions.map((option, index) => (
                          <div
                            key={index}
                            className='dropdown-option'
                            onClick={() =>
                              handleSelectOption('occupancyStatus', option)
                            }
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 17  */}
                  <div className='relative w-full dropdown-container'>
                    <div className='relative-placeholder w-full'>
                      <input
                        type='text'
                        className='input-with-placeholder form-input
                  shadow-neons w-full h-[50px] pl-5 pr-14 
                  placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                        name='developer'
                        value={formData.developer}
                        onChange={handleChange}
                      />

                      {formData.developer === '' && (
                        <div className='custom-placeholder text-sm text-gray-400'>
                          Developer
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 18  */}
                  <div className='relative w-full dropdown-container'>
                    <div className='relative-placeholder w-full'>
                      <input
                        type='text'
                        className='input-with-placeholder form-input
                  shadow-neons w-full h-[50px] pl-5 pr-14 
                  placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                        name='isFurnished'
                        value={formData.isFurnished}
                        onClick={() => handleToggleDropdown('isFurnished')}
                        onChange={handleChange}
                        readOnly
                      />
                      <br />

                      {formData.isFurnished === '' && (
                        <div className='custom-placeholder text-sm text-gray-400'>
                          Is it furnished?
                        </div>
                      )}

                      <div className='absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                        <Image
                          width={12}
                          height={12}
                          src='/listing/Vector.svg'
                          alt='Dropdown'
                          className='toggle-icon'
                          onClick={() => handleToggleDropdown('isFurnished')}
                        />
                        <Image
                          width={12}
                          height={12}
                          src='/listing/vector1.svg'
                          alt='Dropdown'
                          className='toggle-icon rotate-180'
                          onClick={() => handleToggleDropdown('isFurnished')}
                        />
                      </div>
                      {dropdowns.isFurnished && (
                        <div className='absolute z-10 p-4 inset-y-0 right-0 w-full h-fit bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
                          {isFurnishedOptions.map((option, index) => (
                            <div
                              key={index}
                              className='dropdown-option'
                              onClick={() =>
                                handleSelectOption('isFurnished', option)
                              }
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 19  buyer*/}
                  <div className='relative w-full dropdown-container'>
                    <div className='relative-placeholder w-full'>
                      <input
                        type='text'
                        className='input-with-placeholder form-input
                  shadow-neons w-full h-[50px] pl-5 pr-14 
                  placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                        name='buyerTransferFee'
                        value={formData.buyerTransferFee}
                        onChange={handleChange}
                      />

                      {formData.buyerTransferFee === '' && (
                        <div className='custom-placeholder text-sm text-gray-400'>
                          Buyer Transfer Fee
                        </div>
                      )}
                    </div>
                  </div>

                  {/*  seller transfer*/}
                  <div className='relative w-full dropdown-container'>
                    <div className='relative-placeholder w-full'>
                      <input
                        type='text'
                        className='input-with-placeholder form-input
                  shadow-neons w-full h-[50px] pl-5 pr-14 
                  placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                        name='sellerTransferFee'
                        value={formData.sellerTransferFee}
                        onChange={handleChange}
                      />

                      {formData.sellerTransferFee === '' && (
                        <div className='custom-placeholder text-sm text-gray-400'>
                          Seller Transfer Fee
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              {/* input two  */}
              <div className='pt-[30px]'>
                <div className='px-[19px] space-y-3'>
                  <h2 className='text-dark-black text-xl font-medium pt-5'>
                    Listing
                  </h2>
                  <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]'>
                    {listings.map((listing, index) => (
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

                  {/* 4 */}

                  <h2 className='text-dark-black text-xl font-medium'>
                    Facilities
                  </h2>
                  <form className='mt-[10px] grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xxs:grid-cols-1  justify-between gap-y-[10px]'>
                    {facilities.map((facilitie, index) => (
                      <div className='flex' key={index}>
                        <input
                          className='custom-checkbox'
                          type='checkbox'
                          value={facilitie}
                          checked={formData.facilities.includes(facilitie)}
                          onChange={(e) =>
                            handleCheckboxChange(e, 'facilities')
                          }
                        />
                        <label className='custom-label'>{facilitie}</label>
                      </div>
                    ))}
                  </form>
                </div>
                {/* 4 end  */}
                <div className='grid place-items-center mt-[49px]'>
                  <Image
                    width={1500}
                    quality={90}
                    className='w-[98%]'
                    height={700}
                    src={adImage}
                    alt='car'
                  />
                </div>
                {/* map  */}
                <ListingMapSection
                  mapUrl={formData.mapUrl}
                  handleChange={handleChange}
                  iframeClassName='max-w-[1064px] w-full mx-auto h-[351px] rounded-[5px] shadow-neons'
                />
                <div className='grid place-items-center mt-[30px] pb-[65px]'>
                  <button
                    className='text-whitee text-xl font-medium w-[205px] h-[50px] rounded-[3px] bg-light-gold shadow-neons disabled:opacity-60 disabled:cursor-not-allowed'
                    onClick={handleSubmit}
                    disabled={isCompressing}
                  >
                    {isCompressing ? 'Compressing…' : 'Submit'}
                  </button>
                </div>
              </div>
            </main>
          </div>
        </section>
      </div>
    </Suspense>
  )
}

export default Page
