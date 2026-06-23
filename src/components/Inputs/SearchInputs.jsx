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
import {
  DUMMY_UAE_CITY_PREDICTIONS,
  filterCountriesToUaeOnly,
  isDummyUaeLocationsEnabled,
  isUnitedArabEmiratesListingCountry,
  LISTING_COUNTRY_UAE_LABEL,
  toUnitedArabEmiratesListingCountryName,
} from '@/libs/dummyLocationData'
import {
  normalizeCountriesResponse,
  normalizeCitiesResponse,
} from '@/libs/normalizeCountriesResponse'

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

const ROI_OPTIONS = [
  { value: '5', label: '5%' },
  { value: '10', label: '10%' },
  { value: '20', label: '20%' },
]

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

const resolveCountryCode = (countryName, countryCodeMap) => {
  if (!countryName) return ''
  if (countryCodeMap[countryName]) return countryCodeMap[countryName]
  if (isUnitedArabEmiratesListingCountry(countryName)) return 'AE'
  return ''
}

const mergeCityLists = (...lists) => {
  const seen = new Set()
  const merged = []
  lists.flat().forEach((city) => {
    const value = String(city || '').trim()
    if (!value || seen.has(value)) return
    seen.add(value)
    merged.push(value)
  })
  return merged.sort((a, b) => a.localeCompare(b))
}

const fetchCitiesForCountry = async (countryName, countryCodeMap) => {
  const listingCountry = normalizeCountryKey(countryName)
  const code = resolveCountryCode(listingCountry, countryCodeMap)

  if (isDummyUaeLocationsEnabled && code === 'AE') {
    return DUMMY_UAE_CITY_PREDICTIONS.map((p) => p.description)
  }

  if (!code) return []

  const response = await fetch(
    `/api/country?name=${encodeURIComponent(code)}&query=`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch cities')
  }

  const data = await response.json()
  let apiCities = normalizeCitiesResponse(data)
    .map((item) => item.description)
    .filter(Boolean)

  if (code === 'AE' && apiCities.length === 0) {
    apiCities = DUMMY_UAE_CITY_PREDICTIONS.map((p) => p.description)
  }

  return apiCities
}

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
  const [countryCodeMap, setCountryCodeMap] = useState({})
  const locationCacheRef = useRef({})
  const countryMetaLoadedRef = useRef(false)
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

  // Load country name → ISO code map from backend (same as listing forms).
  useEffect(() => {
    if (countryMetaLoadedRef.current) return

    let cancelled = false

    const loadCountryMeta = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        if (cancelled) return

        const list = filterCountriesToUaeOnly(normalizeCountriesResponse(data))
        const codes = {}
        list.forEach((entry) => {
          if (entry.country && entry.code) {
            codes[entry.country] = String(entry.code).toUpperCase()
          }
        })
        codes[LISTING_COUNTRY_UAE_LABEL] = 'AE'
        setCountryCodeMap(codes)
        countryMetaLoadedRef.current = true
      } catch (error) {
        console.error('Error fetching country metadata:', error)
        if (!cancelled) {
          setCountryCodeMap({ [LISTING_COUNTRY_UAE_LABEL]: 'AE' })
        }
      }
    }

    loadCountryMeta()

    return () => {
      cancelled = true
    }
  }, [])

  // Fetch listing locations when category changes; cities load when country is picked.
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
        const countryList = mergeCityLists(
          [LISTING_COUNTRY_UAE_LABEL],
          uniqueCountries,
        )

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

  // Fetch cities from /api/country when country changes; merge with listing cities.
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

    const listingCities = countryCityMap[selectedCountry] || []
    let cancelled = false

    const loadCities = async () => {
      setCityLoading(true)
      try {
        const apiCities = await fetchCitiesForCountry(
          selectedCountry,
          countryCodeMap,
        )
        if (cancelled) return
        setCities(mergeCityLists(apiCities, listingCities))
      } catch (error) {
        console.error('Error fetching cities:', error)
        if (!cancelled) {
          if (isUnitedArabEmiratesListingCountry(selectedCountry)) {
            setCities(
              mergeCityLists(
                DUMMY_UAE_CITY_PREDICTIONS.map((p) => p.description),
                listingCities,
              ),
            )
          } else {
            setCities(listingCities)
          }
        }
      } finally {
        if (!cancelled) setCityLoading(false)
      }
    }

    loadCities()

    return () => {
      cancelled = true
    }
  }, [selectedCountry, countryCityMap, countryCodeMap])

  const handleCategoryChange = (nextCategory) => {
    setSelectedCountry('')
    setSelectedCity('')
    prevCountryRef.current = ''
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
        <HeroFilterSelect
          value={ROI}
          onChange={setROI}
          options={ROI_OPTIONS}
          placeholder='ROI'
          getOptionLabel={(opt) => opt.label}
          getOptionValue={(opt) => opt.value}
          title={ROI ? `${ROI}% ROI` : 'ROI'}
        />
      )}
      <div className='hero-search-bar__action shrink-0' onClick={handleSearch}>
        <SearchButton isLoading={isLoading} />
      </div>
    </div>
  )
}

export default SearchInputs
