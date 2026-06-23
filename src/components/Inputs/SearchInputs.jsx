'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import vectorArrow from '@/assets/images/vector5.svg'
import SearchButton from '@/components/Buttons/SearchButton'
import { useRouter } from 'next/navigation'
import {
  boatPricesForFilter,
  defaultPricesForFilter,
  propertyPricesForFilter,
} from '@/constants/otherConstants'
import customAxios from '@/utils/apis/apis'
import {
  LISTING_COUNTRY_UAE_LABEL,
  toUnitedArabEmiratesListingCountryName,
} from '@/libs/dummyLocationData'

const CATEGORY_ENDPOINTS = {
  Boat: '/boat',
  'Property For Sale': '/property',
  Car: '/car',
  Jewelry: '/jewelry',
}

const normalizeCountryKey = (country) => {
  if (
    !country ||
    country === 'Select Country' ||
    country === 'required_country'
  ) {
    return null
  }
  return toUnitedArabEmiratesListingCountryName(country) || country
}

const SearchInputs = ({ setIsOpen }) => {
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

  // Fetch countries/cities when category changes (not when country is picked).
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
      setCountries(cached.countries)
      setCountryCityMap(cached.map)
      return
    }

    // Show UAE immediately so the country field is usable while cities load.
    setCountries([LISTING_COUNTRY_UAE_LABEL])

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
        const nextMap = {}

        products.forEach((item) => {
          const countryKey = normalizeCountryKey(item.country)
          const city = item.city

          if (!countryKey) return

          if (!nextMap[countryKey]) {
            nextMap[countryKey] = new Set()
          }

          if (city) {
            nextMap[countryKey].add(city)
          }
        })

        const formattedMap = Object.fromEntries(
          Object.entries(nextMap).map(([country, citySet]) => [
            country,
            Array.from(citySet).sort((a, b) => a.localeCompare(b)),
          ]),
        )

        const uniqueCountries = Object.keys(formattedMap)
        const countryList =
          uniqueCountries.length > 0
            ? uniqueCountries
            : [LISTING_COUNTRY_UAE_LABEL]

        locationCacheRef.current[category] = {
          countries: countryList,
          map: formattedMap,
        }

        setCountries(countryList)
        setCountryCityMap(formattedMap)
      } catch (error) {
        console.error('Error fetching countries data:', error)
        if (!cancelled) {
          setCountries([LISTING_COUNTRY_UAE_LABEL])
          setCountryCityMap({})
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

  // Update cities instantly when country changes — no API refetch.
  useEffect(() => {
    if (!selectedCountry) {
      setCities([])
      prevCountryRef.current = ''
      return
    }

    if (prevCountryRef.current !== selectedCountry) {
      setSelectedCity('')
      prevCountryRef.current = selectedCountry
    }

    setCities(countryCityMap[selectedCountry] || [])
  }, [selectedCountry, countryCityMap])

  const handleCountryChange = useCallback((event) => {
    setSelectedCountry(event.target.value)
  }, [])

  const handleCategoryChange = (event) => {
    setSelectedCountry('')
    setSelectedCity('')
    prevCountryRef.current = ''
    setROI('')
    setMinPrice('')
    setMaxPrice('')
    setCategory(event.target.value)
  }

  // Handle minimum price change
  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value)
  }

  // Handle maximum price change
  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value)
  }

  // Handle ROI change
  const handleROIChange = (event) => {
    setROI(event.target.value)
  }

  return (
    <div className='hero-search-bar xl:mt-10 mt-6'>
      <h1 className='lg:hidden block w-full md:text-lg text-base font-semibold text-white mb-1'>
        Filter
      </h1>

      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none'
          value={category}
          onChange={handleCategoryChange}
        >
          <option className='xl:text-base text-xs ' value='' disabled hidden>
            Categories
          </option>
          <option value='Property For Sale'>Properties For Sale</option>
          {/* <option value='Property For Lease'>Properties For Lease</option> */}
          <option value='Jewelry'>Jewellery</option>
          <option value='Car'>Cars</option>
          <option value='Boat'>Boats</option>
        </select>
        <div className='select-arrow'>
          <Image src={vectorArrow} alt='' width={12} height={12} />
        </div>
      </div>

      {/* Dropdown for Country */}

      <div className='select-wrapper select-wrapper-country relative'>
        <select
          className='select-custom outline-none'
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={!category}
          title={selectedCountry || 'Country'}
        >
          <option value='' disabled hidden>
            {countryLoading && !countries.length ? 'Loading…' : 'Country'}
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {countryLoading && (
          <span
            className='absolute right-9 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-reefGold/30 border-t-reefGold rounded-full animate-spin pointer-events-none'
            aria-hidden
          />
        )}

        <div className='select-arrow'>
          <Image src={vectorArrow} alt='' width={12} height={12} />
        </div>
      </div>

      {/* Dropdown for City */}
      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none'
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedCountry}
          title={selectedCity || 'City'}
        >
          <option value='' disabled hidden>
            City
          </option>
          {cities.length > 0 ? (
            cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))
          ) : (
            <option value='' disabled>
              {countryLoading ? 'Loading cities…' : 'No cities available'}
            </option>
          )}
        </select>

        <div className='select-arrow'>
          <Image src={vectorArrow} alt='' width={12} height={12} />
        </div>
      </div>

      {/* Dropdown for Min Price */}
      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none'
          value={minPrice}
          onChange={handleMinPriceChange}
        >
          <option value='' disabled hidden>
            Min Price
          </option>
          {priceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className='select-arrow'>
          <Image src={vectorArrow} alt='' width={12} height={12} />
        </div>
      </div>

      {/* Dropdown for Max Price */}
      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none'
          value={maxPrice}
          onChange={handleMaxPriceChange}
        >
          <option value='' disabled hidden>
            Max Price
          </option>
          {priceOptions.slice(1, 10).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className='select-arrow'>
          <Image src={vectorArrow} alt='' width={12} height={12} />
        </div>
      </div>

      {/* Conditionally Render ROI */}
      {category === 'Property For Sale' && (
        <div className='select-wrapper outline-none relative'>
          <select
            className='select-custom outline-none'
            value={ROI}
            onChange={handleROIChange}
          >
            <option value='' disabled hidden>
              ROI
            </option>
            <option value='5'>5%</option>
            <option value='10'>10%</option>
            <option value='20'>20%</option>
          </select>
          <div className='select-arrow'>
            <Image src={vectorArrow} alt='' width={12} height={12} />
          </div>
        </div>
      )}
      <div className='shrink-0' onClick={handleSearch}>
        <SearchButton isLoading={isLoading} />
      </div>
    </div>
  )
}

export default SearchInputs
