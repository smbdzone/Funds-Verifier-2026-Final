'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import SearchButton from '@/components/Buttons/SearchButton'
import HeroFilterSelect, { formatCityLabel } from '@/components/Inputs/HeroFilterSelect'
import { useRouter } from 'next/navigation'
import {
  boatPricesForFilter,
  defaultPricesForFilter,
  propertyPricesForFilter,
} from '@/constants/otherConstants'
import customAxios from '@/utils/apis/apis'
import { LISTING_COUNTRY_UAE_LABEL } from '@/libs/dummyLocationData'
import {
  buildCountryToCitiesMap,
  getListingCitiesForCountry,
  UAE_ONLY_COUNTRY_OPTIONS,
} from '@/libs/listingLocationUtils'

const CATEGORY_ENDPOINTS = {
  Boat: '/boat',
  'Property For Sale': '/property',
  Car: '/car',
  Jewelry: '/jewelry',
}

const CATEGORY_OPTIONS = [
  { value: 'Property For Sale', label: 'Properties For Sale' },
  { value: 'Jewelry', label: 'Jewellery' },
  { value: 'Car', label: 'Cars' },
  { value: 'Boat', label: 'Boats' },
]

const SearchInputs = ({ setIsOpen, variant = 'hero' }) => {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [ROI, setROI] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [priceOptions, setPriceOptions] = useState([])
  const [countryLoading, setCountryLoading] = useState(false)
  const [cityLoading, setCityLoading] = useState(false)
  const [countryCityMap, setCountryCityMap] = useState({})
  const locationCacheRef = useRef({})
  const prevCountryRef = useRef('')
  const handleSearch = () => {
    setIsLoading(true)
    const query = new URLSearchParams()
    if (minPrice) query.set('minPrice', minPrice)
    if (maxPrice) query.set('maxPrice', maxPrice)
    if (selectedCountry) query.set('country', selectedCountry)
    if (selectedCity) query.set('city', selectedCity)
    if (ROI) query.set('roi', ROI)

    let pathCategory = category.toLowerCase()
    if (category === 'Property For Sale') {
      pathCategory = 'property'
      query.append('assetType', `${category}`)
    }

    if (router) {
      const fullPath = `/${pathCategory}?${query.toString()}`
      router.push(fullPath)
      setIsOpen?.(false)
    } else {
      console.error('Router is undefined')
    }
    setIsLoading(false)
  }

  // Fetch listing cities from backend when category changes (UAE only).
  useEffect(() => {
    if (!category) return

    if (category === 'Property For Sale') {
      setPriceOptions(propertyPricesForFilter)
    } else if (category === 'Boat') {
      setPriceOptions(boatPricesForFilter)
    } else if (['Property For Lease', 'Car', 'Jewelry'].includes(category)) {
      setPriceOptions(defaultPricesForFilter)
    } else {
      setPriceOptions([])
    }

    const cached = locationCacheRef.current[category]
    if (cached) {
      setCountries(UAE_ONLY_COUNTRY_OPTIONS)
      setCountryCityMap(cached.map)
      setSelectedCountry(LISTING_COUNTRY_UAE_LABEL)
      return
    }

    setCountries(UAE_ONLY_COUNTRY_OPTIONS)
    setSelectedCountry(LISTING_COUNTRY_UAE_LABEL)

    const endpoint = CATEGORY_ENDPOINTS[category]
    if (!endpoint) return

    let cancelled = false

    const fetchLocations = async () => {
      setCountryLoading(true)
      try {
        const response = await customAxios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
          { params: { limit: 500, statusFilter: 1 } },
        )

        if (cancelled) return

        const products = response?.data?.products || []
        const formattedMap = buildCountryToCitiesMap(products)

        locationCacheRef.current[category] = {
          countries: UAE_ONLY_COUNTRY_OPTIONS,
          map: formattedMap,
        }

        setCountries(UAE_ONLY_COUNTRY_OPTIONS)
        setCountryCityMap(formattedMap)
        setSelectedCountry(LISTING_COUNTRY_UAE_LABEL)
      } catch (error) {
        console.error('Error fetching listing locations:', error)
        if (!cancelled) {
          setCountries(UAE_ONLY_COUNTRY_OPTIONS)
          setCountryCityMap({})
          setSelectedCountry(LISTING_COUNTRY_UAE_LABEL)
        }
      } finally {
        if (!cancelled) setCountryLoading(false)
      }
    }

    fetchLocations()

    return () => {
      cancelled = true
    }
  }, [category])

  // Cities come only from backend listings for the selected country.
  useEffect(() => {
    if (!selectedCountry) {
      setCities([])
      setCityLoading(false)
      prevCountryRef.current = ''
      return
    }

    if (prevCountryRef.current !== selectedCountry) {
      setSelectedCity('')
      prevCountryRef.current = selectedCountry
    }

    setCityLoading(true)
    setCities(getListingCitiesForCountry(countryCityMap, selectedCountry))
    setCityLoading(false)
  }, [selectedCountry, countryCityMap])

  const handleRoiChange = (e) => {
    const next = e.target.value
    if (next === '' || /^\d*\.?\d*$/.test(next)) {
      setROI(next)
    }
  }

  const handleCategoryChange = (nextCategory) => {
    setSelectedCountry(LISTING_COUNTRY_UAE_LABEL)
    setSelectedCity('')
    prevCountryRef.current = LISTING_COUNTRY_UAE_LABEL
    setROI('')
    setMinPrice('')
    setMaxPrice('')
    setCategory(nextCategory)
  }

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        value: city,
        label: formatCityLabel(city),
      })),
    [cities],
  )

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country,
        label: country,
      })),
    [countries],
  )

  const minPriceOptions = useMemo(
    () =>
      priceOptions.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    [priceOptions],
  )

  const maxPriceOptions = useMemo(
    () =>
      priceOptions.slice(1, 10).map((option) => ({
        value: option.value,
        label: option.label,
      })),
    [priceOptions],
  )

  const barClassName =
    variant === 'modal'
      ? 'hero-search-bar hero-search-bar--modal xl:mt-0 mt-0'
      : 'hero-search-bar xl:mt-10 mt-6'

  return (
    <div className={barClassName}>
      <h1
        className={`mb-1 block w-full text-base font-semibold md:text-lg lg:hidden ${variant === 'modal' ? 'text-prussianBlue' : 'text-white'}`}
      >
        Filter
      </h1>

      <HeroFilterSelect
        value={category}
        onChange={handleCategoryChange}
        options={CATEGORY_OPTIONS}
        placeholder='Categories'
        emptyLabel='No categories available'
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        title={category || 'Categories'}
      />

      <HeroFilterSelect
        className='select-wrapper-country'
        value={selectedCountry}
        onChange={setSelectedCountry}
        options={countryOptions}
        placeholder='Country'
        disabled={!category}
        loading={countryLoading}
        emptyLabel='No countries available'
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        title={selectedCountry || 'Country'}
      />

      <HeroFilterSelect
        className='select-wrapper-city'
        value={selectedCity}
        onChange={setSelectedCity}
        options={cityOptions}
        placeholder='City'
        disabled={!selectedCountry}
        loading={cityLoading}
        emptyLabel='No cities available'
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        title={selectedCity || 'City'}
      />

      <HeroFilterSelect
        value={minPrice}
        onChange={setMinPrice}
        options={minPriceOptions}
        placeholder='Min Price'
        disabled={!category}
        emptyLabel='No price options'
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        title={minPrice ? `Min ${minPriceOptions.find((o) => o.value === minPrice)?.label}` : 'Min Price'}
      />

      <HeroFilterSelect
        value={maxPrice}
        onChange={setMaxPrice}
        options={maxPriceOptions}
        placeholder='Max Price'
        disabled={!category}
        emptyLabel='No price options'
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        title={maxPrice ? `Max ${maxPriceOptions.find((o) => o.value === maxPrice)?.label}` : 'Max Price'}
      />

      {category === 'Property For Sale' && (
        <div className='select-wrapper select-wrapper-roi relative'>
          <div className='hero-roi-input-wrap'>
            <input
              type='text'
              inputMode='decimal'
              className='select-custom hero-filter-input hero-roi-input'
              placeholder='ROI'
              value={ROI}
              onChange={handleRoiChange}
              title={ROI ? `ROI ${ROI}%` : 'ROI'}
              aria-label='ROI percentage'
            />
            <span className='hero-roi-suffix' aria-hidden='true'>
              %
            </span>
          </div>
        </div>
      )}
      <div className='hero-search-bar__action shrink-0' onClick={handleSearch}>
        <SearchButton isLoading={isLoading} />
      </div>
    </div>
  )
}

export default SearchInputs
