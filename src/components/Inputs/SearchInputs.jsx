'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import vectorArrow from '@/assets/images/vector5.svg'
import axios from 'axios'
import SearchButton from '@/components/Buttons/SearchButton'
import { useRouter } from 'next/navigation'
import {
  boatPricesForFilter,
  defaultPricesForFilter,
  propertyPricesForFilter,
} from '@/constants/otherConstants'
import { ClipLoader } from 'react-spinners'
import customAxios from '@/utils/apis/apis'

const SearchInputs = ({ setIsOpen }) => {
  const [countries, setCountries] = useState([])
  const [totalCities, setTotalCities] = useState([])
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
  const handleSearch = () => {
    setIsLoading(true)
    const query = new URLSearchParams({
      minPrice,
      maxPrice,
      country: selectedCountry,
      city: selectedCity,
      roi: ROI,
    })

    let pathCategory = category.toLowerCase()
    if (category === 'Property For Sale') {
      pathCategory = 'property'
      query.append('assetType', `${category}`)
    }

    if (router) {
      const fullPath = `/${pathCategory}?${query.toString()}`
      router.push(fullPath)
      setIsOpen(false)
    } else {
      console.error('Router is undefined')
    }
  }

  // Fetch the countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setCountryLoading(true)
      try {
        let response
        if (category === 'Boat') {
          response = await customAxios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/boat`
          )
        } else if (category === 'Property For Sale') {
          response = await customAxios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/property`
          )
        } else if (category === 'Car') {
          response = await customAxios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/car`
          )
        } else if (category === 'Jewelry') {
          response = await customAxios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`
          )
        }

        const products = response?.data?.products || []

        // Build a mapping of { country: [cities] }
        const countryCityMap = {}

        products.forEach((item) => {
          const country = item.country
          const city = item.city

          if (
            country &&
            country !== 'Select Country' &&
            country !== 'required_country'
          ) {
            if (!countryCityMap[country]) {
              countryCityMap[country] = new Set()
            }

            if (city) {
              countryCityMap[country].add(city)
            }
          }
        })

        // Get unique country list
        const uniqueCountries = Object.keys(countryCityMap)

        // Convert each city set to an array
        const formattedMap = Object.fromEntries(
          Object.entries(countryCityMap).map(([country, cities]) => [
            country,
            Array.from(cities),
          ])
        )

        setCountries(uniqueCountries)
        setCountryCityMap(formattedMap) // store it in state
      } catch (error) {
        console.error('Error fetching countries data:', error)
      } finally {
        setCountryLoading(false)
      }
    }

    if (category) {
      fetchCountries()
      if (category === 'Property For Sale') {
        setPriceOptions(propertyPricesForFilter)
      } else if (category === 'Boat') {
        setPriceOptions(boatPricesForFilter)
      } else if (['Property For Lease', 'Car', 'Jewelry'].includes(category)) {
        setPriceOptions(defaultPricesForFilter)
      } else {
        setPriceOptions([])
      }
    }
  }, [category, selectedCountry])

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value
    setSelectedCountry(selectedCountry)
    setCities(countryCityMap[selectedCountry] || [])
  }

  const handleCategoryChange = (event) => {
    setSelectedCountry('')
    setSelectedCity('')
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
    <div className='xl:mt-14 flex xl:gap-x-5 lg:gap-x-3 gap-y-3 items-center lg:flex-row flex-col w-full h-16 text-xl text-darkslategray-200'>
      {/* Dropdown for Categories */}
      <h1 className='lg:hidden block md:text-lg text-base font-semibold'>
        Filter
      </h1>

      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none border-none xl:text-base text-sm'
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
          <Image src={vectorArrow} alt='Arrow' width={15} height={15} />
        </div>
      </div>

      {/* Dropdown for Country */}

      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none border-none xl:text-base text-sm'
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={!category}
        >
          <option value='' disabled hidden>
            Country
          </option>
          {countryLoading ? (
            <option className='flex items-center justify-center'>
              <ClipLoader color='#36d7b7' size={20} />
            </option>
          ) : (
            <>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </>
          )}
        </select>

        <div className='select-arrow'>
          <Image src={vectorArrow} alt='Arrow' width={15} height={15} />
        </div>
      </div>

      {/* Dropdown for City */}
      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none border-none xl:text-base text-sm'
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedCountry || cityLoading}
        >
          <option value='' disabled hidden>
            City
          </option>
          {cityLoading ? (
            <option className='flex items-center justify-center'>
              <ClipLoader color='#36d7b7' size={20} />
            </option>
          ) : (
            <>
              {cities.length > 0 ? (
                cities?.map((city, index) => (
                  <option key={index} value={city || city.formatted_address}>
                    {city || city.formatted_address}
                  </option>
                ))
              ) : (
                <option value='' disabled>
                  No cities available
                </option>
              )}
            </>
          )}
        </select>

        <div className='select-arrow'>
          <Image src={vectorArrow} alt='Arrow' width={15} height={15} />
        </div>
      </div>

      {/* Dropdown for Min Price */}
      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none border-none xl:text-base text-sm'
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
          <Image src={vectorArrow} alt='Arrow' width={15} height={15} />
        </div>
      </div>

      {/* Dropdown for Max Price */}
      <div className='select-wrapper relative'>
        <select
          className='select-custom outline-none border-none xl:text-base text-sm'
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
          <Image src={vectorArrow} alt='Arrow' width={15} height={15} />
        </div>
      </div>

      {/* Conditionally Render ROI */}
      {category === 'Property For Sale' && (
        <div className='select-wrapper outline-none border-none relative'>
          <select
            className='select-custom outline-none border-none xl:text-base text-sm'
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
            <Image src={vectorArrow} alt='Arrow' width={15} height={15} />
          </div>
        </div>
      )}
      {/* Search   button */}
      <div onClick={handleSearch}>
        <SearchButton isLoading={isLoading} />
      </div>
    </div>
  )
}

export default SearchInputs
