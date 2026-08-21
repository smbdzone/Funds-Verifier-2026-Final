'use client'
import { handleImageUpload } from '@/libs/uploadAsset'
import axios from 'axios'
import customAxios from '@/utils/apis/apis'
import { getExampleNumber, parsePhoneNumber } from 'libphonenumber-js'
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
  DUMMY_FALLBACK_COUNTRIES,
  DUMMY_UAE_CITY_PREDICTIONS,
  filterDummyCitiesByQuery,
  getDummyNeighbourhoodsForCity,
  hasDummyNeighbourhoodsForCity,
  isDummyUaeLocationsEnabled,
  LISTING_COUNTRY_UAE_LABEL,
  toUnitedArabEmiratesListingCountryName,
  filterCountriesToUaeOnly,
  formatCityLabel,
} from '@/libs/dummyLocationData'
import {
  LISTING_IMAGE_MAX_BYTES,
  LISTING_VIDEO_MAX_BYTES,
  LISTING_VIDEO_MAX_MB,
  LISTING_IMAGE_MAX_COUNT,
  LISTING_VIDEO_MAX_COUNT,
} from '@/constants/listingUploadLimits'
import { createDefaultOffPlanPaymentPlan, sanitizeOffPlanPaymentPlan, facilities, getExtraFacilities, materials } from '@/constants/listing-data'
import { extrasList } from '@/constants/boat-listings'
import { extras as carExtrasList, colors as carColorOptions } from '@/constants/car-listings'
import { formatBedBathCount } from '@/libs/bedBathCount'
import {
  ensureWithinSize,
} from '@/libs/imageCompression'
import { applyListingWatermark } from '@/libs/applyListingWatermark'

const getMaxLengthForCountry = (country) => {
  const exampleNumber = getExampleNumber(country, metadata)
  return exampleNumber
    ? exampleNumber.formatNational().replace(/\D/g, '').length
    : Infinity
}

const isActiveListingImage = (img) => Boolean(img) && !img?.isDeleted

const getListingImageKey = (img) => {
  if (!img) return ''
  if (typeof File !== 'undefined' && img instanceof File) return ''
  return String(img.s3Key || img.public_id || '').trim()
}

const filterActiveListingImages = (images = []) =>
  (Array.isArray(images) ? images : []).filter(isActiveListingImage)

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
        // Compute E.164 phone here so it can be stored in both formData AND phone state
        const rawPhone = d.phoneNumber ? `${d.phoneNumber}` : ''
        const e164Phone = rawPhone && !rawPhone.startsWith('+') ? `+${rawPhone}` : rawPhone
        const normalized = {
          ...normalizeListingPremiumRefs(d),
          description: d.description || '',
          additionalDescription: d.additionalDescription || '',
          country: countryNorm,
          bedrooms: formatBedBathCount(d.bedrooms),
          bathrooms: formatBedBathCount(d.bathrooms),
          priceFrom: d.priceFrom ?? '',
          priceTo: d.priceTo ?? '',
          sizeSQFTFrom: d.sizeSQFTFrom ?? d.sizeSQFT ?? '',
          sizeSQFTTo: d.sizeSQFTTo ?? '',
          sizeSQMFrom: d.sizeSQMFrom ?? d.sizeSQM ?? '',
          sizeSQMTo: d.sizeSQMTo ?? '',
          agencyAgreement: d.agencyAgreement || null,
          advertisementId: d.advertisementId || '',
          dldNumber: d.dldNumber || '',
          mapUrl: d.mapUrl || '',
          deliveryQuarter: d.deliveryQuarter || '',
          deliveryYear: d.deliveryYear || '',
          paymentPlanType: d.paymentPlanType || '',
          sizeType: d.sizeType || d.sizeUnit || '',
          layout: d.layout || '',
          numberOfFloors: d.numberOfFloors || '',
          availableApartment: d.availableApartment || '',
          facilities: Array.isArray(d.facilities)
            ? d.facilities.filter(Boolean)
            : [],
          customFacilities: Array.isArray(d.facilities)
            ? getExtraFacilities(d.facilities, [], facilities)
            : [],
          customMaterials: Array.isArray(d.materials)
            ? getExtraFacilities(d.materials, [], materials)
            : [],
          customExtras: Array.isArray(d.extras)
            ? getExtraFacilities(d.extras, [], [...extrasList, ...carExtrasList])
            : [],
          customExteriorColors: Array.isArray(d.exteriorColor)
            ? getExtraFacilities(d.exteriorColor, [], carColorOptions)
            : [],
          customInteriorColors: Array.isArray(d.interiorColor)
            ? getExtraFacilities(d.interiorColor, [], carColorOptions)
            : [],
          paymentPlan: (() => {
            const cleaned = sanitizeOffPlanPaymentPlan(d.paymentPlan)
            return cleaned.length
              ? cleaned
              : createDefaultOffPlanPaymentPlan()
          })(),
          warranty: d.warranty || d.warrenty || '',
          warrenty: d.warranty || d.warrenty || '',
          transmissionType: (() => {
            const raw = String(d.transmissionType || '').trim()
            if (/^manual(\s+transmission)?$/i.test(raw)) return 'Manual'
            if (/^automatic(\s+transmission)?$/i.test(raw)) return 'Automatic'
            return d.transmissionType || ''
          })(),
          mileageUnit:
            d.mileageUnit === 'mile' || d.mileageUnit === 'km'
              ? d.mileageUnit
              : 'km',
          capacityWeight: d.capacityWeight ?? '',
          capacityWeightUnit:
            d.capacityWeightUnit === 'lb' || d.capacityWeightUnit === 'kg'
              ? d.capacityWeightUnit
              : 'kg',
          weightUnit: (() => {
            const unit = String(d.weightUnit || '')
              .trim()
              .toLowerCase()
            if (unit === 'pound' || unit === 'pounds') return 'lb'
            if (['gm', 'kg', 'lb', 'oz'].includes(unit)) return unit
            return 'gm'
          })(),
          // Store E.164 phone in formData so PhoneInputField (which reads formData.phoneNumber in edit mode) shows the correct flag
          phoneNumber: e164Phone,
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
        // PhoneInput and parsePhoneNumber both require E.164 (leading +)
        setPhoneNumber(e164Phone)
        if (e164Phone) {
          try {
            const parsed = parsePhoneNumber(e164Phone)
            if (parsed?.country) {
              setSelectedCountryPhone(parsed.country)
            }
          } catch {
            // leave flag at default if phone can't be parsed
          }
        }
        {
          const thumbAsset = d?.thumbnailImg
          const firstThumb = Array.isArray(thumbAsset?.images)
            ? thumbAsset.images[0]
            : null
          setThumbnail(
            firstThumb
              ? {
                ...firstThumb,
                _id: thumbAsset?._id || firstThumb._id,
                assetId: thumbAsset?._id || firstThumb._id,
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
        {
          const qrAsset = d?.qrScan
          const firstQr = Array.isArray(qrAsset?.images)
            ? qrAsset.images[0]
            : null
          setQrScan(
            firstQr
              ? {
                ...firstQr,
                _id: qrAsset?._id || firstQr._id,
                assetId: qrAsset?._id || firstQr._id,
                signedUrl:
                  firstQr.signedUrl || qrAsset?.signedUrl || firstQr.url,
                url:
                  firstQr.url || qrAsset?.signedUrl || firstQr.signedUrl,
              }
              : qrAsset || null,
          )
        }
        setImages(
          filterActiveListingImages(d?.pictures?.images),
        )
        // Keep parent ImageAsset ids on formData even if UI peels previews
        setFormData((prev) => ({
          ...prev,
          thumbnailImg: d?.thumbnailImg ?? prev?.thumbnailImg ?? null,
          qrScan: d?.qrScan ?? prev?.qrScan ?? null,
          pictures: d?.pictures ?? prev?.pictures ?? null,
          video: d?.video ?? prev?.video ?? null,
        }))
        if (Array.isArray(d?.video?.videos) && d.video.videos.length) {
          setVideos(
            d.video.videos.map((v) => ({
              ...v,
              _id: d.video?._id || v?._id,
              assetId: d.video?._id || v?._id,
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
              assetId: d.video._id,
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

    if (hasDummyNeighbourhoodsForCity(isCity)) {
      setNeighbourhoods(getDummyNeighbourhoodsForCity(isCity))
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
      const places = Array.isArray(data?.places) ? data.places : []
      setNeighbourhoods(places)
    } catch (error) {
      console.error('Error fetching neighbourhoods:', error)
      setNeighbourhoods([])
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
    const cityName = formatCityLabel(city)
    setSelectedCity(cityName)
    setIsCity(cityName)
    setNeighbourhoods([])
    fetchNeighbourhoods(cityName)
    setFormData((prevFormData) => ({
      ...prevFormData,
      city: cityName,
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

  const closeAllListingDropdowns = () => {
    setDropdowns((prev) => {
      const hasOpen = Object.values(prev || {}).some(Boolean)
      return hasOpen ? {} : prev
    })
    setIsOpen((open) => (open ? false : open))
    setIsCityDropdownOpen((open) => (open ? false : open))
    setIsNeighbourDropdownOpen((open) => (open ? false : open))
    setModelDropdownVisible((open) => (open ? false : open))
  }

  const toggleDropdownn = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (next) {
        setDropdowns({})
        setIsCityDropdownOpen(false)
        setIsNeighbourDropdownOpen(false)
        setModelDropdownVisible(false)
      }
      return next
    })
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
    setIsCityDropdownOpen((prev) => {
      const next = !prev
      if (next) {
        setDropdowns({})
        setIsOpen(false)
        setIsNeighbourDropdownOpen(false)
        setModelDropdownVisible(false)
      }
      return next
    })
  }

  const toggleNeighbourDropdown = () => {
    setIsNeighbourDropdownOpen((prev) => {
      const next = !prev
      if (next) {
        setDropdowns({})
        setIsOpen(false)
        setIsCityDropdownOpen(false)
        setModelDropdownVisible(false)
      }
      return next
    })
  }

  const handleCountryChange = (value) => {
    setSelectedCountryPhone(value)

    const newMaxLength = getMaxLengthForCountry(value)
    setMaxLength(newMaxLength)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const visibleCount = images.filter((img) => img && !img?.isDeleted && (
      (typeof img?.signedUrl === 'string' && img.signedUrl.startsWith('http')) ||
      (typeof img?.url === 'string' && img.url.startsWith('http')) ||
      (typeof File !== 'undefined' && img instanceof File)
    )).length
    const remainingSlots = LISTING_IMAGE_MAX_COUNT - visibleCount
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
      // Pre-compress oversized originals before watermarking.
      if (file.size > LISTING_IMAGE_MAX_BYTES) {
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
          img.onload = async () => {
            try {
              // Watermark + hard compress to <= 2MB (JPEG).
              let stamped = await applyListingWatermark(workingFile, {
                position: 'center',
                maxBytes: LISTING_IMAGE_MAX_BYTES,
              })
              if (stamped.size > LISTING_IMAGE_MAX_BYTES) {
                stamped = await ensureWithinSize(
                  stamped,
                  LISTING_IMAGE_MAX_BYTES,
                )
              }
              if (stamped.size > LISTING_IMAGE_MAX_BYTES) {
                throw new Error(
                  `Image must be under ${LISTING_IMAGE_MAX_BYTES / (1024 * 1024)}MB after watermark`,
                )
              }
              resolve(stamped)
            } catch (err) {
              toast.error(
                err?.message ||
                `Could not prepare ${workingFile.name} for upload`,
              )
              resolve(null)
            }
          }
          img.onerror = () => {
            toast.error(
              `The file ${workingFile.name} could not be loaded as an image`,
            )
            resolve(null)
          }
          img.src = event.target.result
        }
        reader.onerror = () => {
          alert(`The file ${workingFile.name} could not be read`)
          resolve(null)
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
        if (visibleCount + validFiles.length > LISTING_IMAGE_MAX_COUNT) {
          toast.error(
            `You can only upload a maximum of ${LISTING_IMAGE_MAX_COUNT} images`,
          )
          return
        }

        // Update images state
        setImages((prevImages) => [...prevImages, ...validFiles])

        try {
          const existingAssetId =
            formData?.pictures?._id ||
            (typeof formData?.pictures === 'string' ? formData.pictures : null)

          const imageIDs = await handleImageUpload(validFiles, {
            appendToId: existingAssetId || undefined,
          })

          setFormData((prevFormData) => ({
            ...prevFormData,
            // Always keep the full ImageAsset from the API (includes every image).
            pictures: imageIDs,
          }))
          if (Array.isArray(imageIDs?.images) && imageIDs.images.length) {
            // Never put soft-deleted images back into the UI gallery.
            setImages(filterActiveListingImages(imageIDs.images))
          }
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

  const handleImageReorder = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return
    setImages((prev) => {
      const visible = filterActiveListingImages(prev)
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= visible.length ||
        toIndex >= visible.length
      ) {
        return prev
      }
      const nextVisible = [...visible]
      const [moved] = nextVisible.splice(fromIndex, 1)
      nextVisible.splice(toIndex, 0, moved)
      return nextVisible
    })
    setFormData((prev) => {
      const imgs = filterActiveListingImages(prev.pictures?.images)
      if (!imgs.length) return prev
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= imgs.length ||
        toIndex >= imgs.length
      ) {
        return prev
      }
      const next = [...imgs]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return { ...prev, pictures: { ...prev.pictures, images: next } }
    })
  }

  const handleImageRemove = (index, idOrFile) => {
    const matchesTarget = (img) => {
      if (!img) return false
      if (typeof File !== 'undefined' && idOrFile instanceof File) {
        return img === idOrFile
      }
      if (typeof idOrFile === 'string' && idOrFile) {
        return getListingImageKey(img) === idOrFile
      }
      return false
    }

    setImages((prevImages) => {
      const visible = filterActiveListingImages(prevImages)
      const target =
        (typeof idOrFile === 'string' && idOrFile) ||
        (typeof File !== 'undefined' && idOrFile instanceof File)
          ? visible.find(matchesTarget) || prevImages.find(matchesTarget)
          : visible[index]

      if (!target) return filterActiveListingImages(prevImages)

      return prevImages.filter((img) => {
        if (img === target) return false
        if (typeof File !== 'undefined' && target instanceof File) {
          return img !== target
        }
        const targetKey = getListingImageKey(target)
        if (targetKey && getListingImageKey(img) === targetKey) return false
        return true
      })
    })

    setFormData((prevFormData) => {
      const currentImages = Array.isArray(prevFormData.pictures?.images)
        ? prevFormData.pictures.images
        : []
      const visible = filterActiveListingImages(currentImages)
      const target =
        (typeof idOrFile === 'string' && idOrFile) ||
        (typeof File !== 'undefined' && idOrFile instanceof File)
          ? visible.find(matchesTarget) || currentImages.find(matchesTarget)
          : visible[index]

      const updatedImages = target
        ? currentImages.filter((img) => {
            if (img === target) return false
            const targetKey = getListingImageKey(target)
            if (targetKey && getListingImageKey(img) === targetKey) return false
            return true
          })
        : currentImages

      return {
        ...prevFormData,
        pictures: {
          ...prevFormData.pictures,
          images: updatedImages,
        },
      }
    })

    if (typeof idOrFile === 'string' && idOrFile) {
      handleDeleteImg(idOrFile)
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

      try {
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
      } catch (err) {
        toast.error(
          err?.message || 'Could not prepare thumbnail for upload',
        )
        return
      }

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
    // Do not watermark QR images — text overlays break scanability.
    let selectedFile = event.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > LISTING_IMAGE_MAX_BYTES) {
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
    setFormData((prev) => ({ ...prev, qrScan: null }))
  }

  /** True when the user actually requested 3D or technical report (has a fee). */
  const isValidState = (state) => {
    if (!state || typeof state !== 'object') return false
    const price = Number(state.price)
    return Number.isFinite(price) && price > 0
  }

  const handleCheckboxChange = (e, key) => {
    const { checked, value } = e.target
    setFormData((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : []
      return {
        ...prev,
        [key]: checked
          ? [...current, value]
          : current.filter((item) => item !== value),
      }
    })
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
    setDropdowns((prevState) => {
      const willOpen = !prevState[dropdownName]
      return willOpen ? { [dropdownName]: true } : {}
    })
    setIsOpen(false)
    setIsCityDropdownOpen(false)
    setIsNeighbourDropdownOpen(false)
    setModelDropdownVisible(false)
  }

  useEffect(() => {
    const isInsideDropdown = (target) =>
      target instanceof Element &&
      Boolean(
        target.closest('.dropdown-container') ||
        target.closest('[data-dropdown-root]'),
      )

    const onPointerDown = (event) => {
      if (isInsideDropdown(event.target)) return
      closeAllListingDropdowns()
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeAllListingDropdowns()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const handleSelectOption = (dropdownName, option) => {
    setFormData((prev) => ({ ...prev, [dropdownName]: option }))
    setDropdowns((prev) => ({ ...prev, [dropdownName]: false }))
  }

  const toggleModelDropdown = () => {
    setModelDropdownVisible((prev) => {
      const next = !prev
      if (next) {
        setDropdowns({})
        setIsOpen(false)
        setIsCityDropdownOpen(false)
        setIsNeighbourDropdownOpen(false)
      }
      return next
    })
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
        closeAllListingDropdowns,
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
        handleImageReorder,
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
