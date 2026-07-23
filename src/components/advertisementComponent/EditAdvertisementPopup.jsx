/* eslint-disable react/no-unescaped-entities */
'use client'
import { useEffect, useState, useRef, useTransition } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CheckIcon, XCircleIcon, XIcon } from 'lucide-react'
import { getTokenFromCookie } from '../../utils/helper'
import { fetchCities, fetchCountries } from '../../libs/fetchCountriesAndCities'
import { useProfile } from '../../context/UserContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCityLabel } from '@/libs/dummyLocationData'

const EditAdvertisementPopup = ({ onClose, EditableData }) => {
  const startAt = EditableData?.ads?.targetedAudience?.startAt?.[0] || ''
  const endAt = EditableData?.ads?.targetedAudience?.endAt?.[0] || ''
  const DefaultLocations = EditableData?.ads?.targetedAudience || {}
  const transformed = (DefaultLocations?.country || [])?.map(
    (countryName, index) => ({
      countryName: countryName || '',
      countryCode: '',
      cities: DefaultLocations?.city?.[index] || [],
      cityOptions: [],
      citySearch: '',
      countrySearch: '',
      filteredCountries: [],
      showCountryDropdown: false,
    })
  )

  const router = useRouter()
  const [isPending, startTransition] = useTransition(false)
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [searchCityQuery, setSearchCityQuery] = useState('')
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [startDate, setStartDate] = useState(startAt || '')
  const [endDate, setEndDate] = useState(endAt || '')
  const [isSelect, setIsSelect] = useState(false)
  const dropdownRef = useRef()
  const token = getTokenFromCookie()
  const user = useProfile()

  const [locations, setLocations] = useState(
    transformed || [
      {
        countryCode: '',
        countryName: '',
        cities: [],
        cityOptions: [],
        citySearch: '',
        countrySearch: '',
        filteredCountries: [],
        showCountryDropdown: false,
      },
    ]
  )

  const [showCityDropdown, setShowCityDropdown] = useState({})
  const debounceTimers = useRef({}) // Refs to manage debounce timers per index

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const countriesData = await fetchCountries()
        setCountries(countriesData)
      } catch (error) {
        console.error('Error fetching countries data:', error)
      }
    }

    fetchCountriesData()
  }, [])

  const toggleCountryDropdown = (index) => {
    setLocations((prevLocations) => {
      return prevLocations.map((loc, i) => {
        if (i === index) {
          const isOpening = !loc.showCountryDropdown
          return {
            ...loc,
            showCountryDropdown: isOpening,
            countrySearch: isOpening ? '' : loc.countrySearch,
            filteredCountries: isOpening
              ? [...countries]
              : loc.filteredCountries,
          }
        }
        return loc
      })
    })
  }

  const handleCountrySearch = (index, value) => {
    const updated = [...locations]
    updated[index].countrySearch = value
    updated[index].filteredCountries = countries.filter((country) =>
      country.country.toLowerCase().includes(value.toLowerCase())
    )
    setLocations(updated)
  }

  const handleCountrySelect = (index, country) => {
    const updated = [...locations]
    updated[index].countryCode = country.code
    updated[index].countryName = country.country
    updated[index].countrySearch = ''
    updated[index].filteredCountries = [...countries]
    updated[index].showCountryDropdown = false
    setLocations(updated)
  }

  const handleCitySearch = (index, searchQuery) => {
    const selectedCountryCode = locations?.[index]?.countryCode
    if (!selectedCountryCode) return

    // Update the input instantly
    setLocations((prev) =>
      prev.map((loc, i) =>
        i === index
          ? {
              ...loc,
              citySearch: searchQuery,
            }
          : loc
      )
    )

    // Clear existing timer if exists
    if (debounceTimers.current[index]) {
      clearTimeout(debounceTimers.current[index])
    }

    // Set new debounce timer
    debounceTimers.current[index] = setTimeout(async () => {
      try {
        const cityData = await fetchCities(selectedCountryCode, searchQuery)
        setLocations((prev) =>
          prev.map((loc, i) =>
            i === index
              ? {
                  ...loc,
                  cityOptions: cityData,
                }
              : loc
          )
        )
      } catch (error) {
        console.error('Error fetching cities:', error)
      }
    }, 400)
  }

  const handleCitySelect = (index, cityName) => {
    setLocations((prev) =>
      prev.map((loc, i) => {
        if (i !== index) return loc

        const updatedCities = loc.cities ?? [] // fallback to empty array

        if (updatedCities.includes(cityName)) return loc

        return {
          ...loc,
          cities: [...updatedCities, cityName],
          cityOptions: [],
          citySearch: '',
        }
      })
    )
  }

  const handleRemoveCity = (index, cityName) => {
    setLocations((prev) =>
      prev.map((loc, i) =>
        i === index
          ? { ...loc, cities: loc.cities.filter((city) => city !== cityName) }
          : loc
      )
    )
  }

  const handleRemoveLocation = (indexToRemove) => {
    setLocations((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const selectCountry = async (code) => {
    try {
      const citiesData = await fetchCities(code, searchCityQuery)
      setCities(citiesData)
    } catch (error) {
      console.log({ error })
      console.error('Error fetching cities data:', error)
    }
  }

  useEffect(() => {
    if (selectedCountryCode && !isSelect) {
      selectCountry(selectedCountryCode)
    }
  }, [searchCityQuery, selectedCountryCode])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setCities([])
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAddLocation = () => {
    setLocations([
      ...locations,
      {
        countryCode: '',
        countryName: '',
        cities: [],
        cityOptions: [],
        citySearch: '',
      },
    ])
  }

  const handleSubmit = async () => {
    try {
      startTransition(async () => {
        if (!token) return toast.error('Please login to continue!')
        if (!startDate || !endDate)
          return toast.error('Please select start and end dates.')
        if (new Date(startDate) > new Date(endDate))
          return toast.error('Start date cannot be later than end date.')

        const data = {
          targetedAudience: {
            country: locations?.map((loc) => loc?.countryName || loc?.country),
            city: locations?.map((loc) => loc?.cities || loc?.city),
            startAt: [startDate],
            endAt: [endDate],
          },
        }

        try {
          const res = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/${EditableData?.ads?.['_id']}`,
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          if (res?.data) {
            router.refresh()
            onClose()
            return toast.success('Advertisement updated!')
          } else {
            toast.error('Something went wrong, please try later')
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Something went wrong!')
        }
      })
    } catch (error) {
      toast.error(
        'An error occurred while initiating payment. Please try again.'
      )
    }
  }

  return (
    <div className='popup-container overflow-auto fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/[.3] from-black to-transparent bg-blend-multiply z-50'>
      <div className='relative bg-white w-[90%] md:w-[50%] p-6 rounded-[15px] shadow-lg max-h-[90vh] overflow-y-auto'>
        {EditableData?.creative?.img && (
          <div className='flex justify-center items-center'>
            <Link href={EditableData?.creative?.adLink} target='_blank'>
              <img src={EditableData?.creative?.img} alt='Banner' />
            </Link>
          </div>
        )}

        <button
          onClick={onClose}
          type='button'
          className='absolute top-5 right-5'
        >
          <XCircleIcon className='text-[#A2913E]' />
        </button>

        <div className='mx-auto flex flex-col gap-3'>
          <div className='mt-5' />

          {(locations || [])?.map((loc, index) => (
            <div
              key={index}
              className='grid grid-cols-1 items-center sm:grid-cols-12 gap-4 w-full mb-4'
            >
              <div className='col-span-6'>
                <div className='col-span-6 relative'>
                  <div className='relative w-full'>
                    <div
                      onClick={() => toggleCountryDropdown(index)}
                      className='bg-[#002D4F]/10 text-[#8D7C3B] border border-[#8D7C3B] rounded-md px-4 py-2 cursor-pointer w-full'
                    >
                      {loc?.countryName || 'Select Country'}
                    </div>

                    {loc?.showCountryDropdown && (
                      <div className='absolute z-10 mt-1 w-full bg-white border border-[#A2913E] rounded-md max-h-[200px] overflow-y-auto'>
                        <input
                          type='text'
                          placeholder='Search country'
                          value={loc?.countrySearch}
                          onChange={(e) =>
                            handleCountrySearch(index, e.target.value)
                          }
                          className='w-full p-2 border-b border-[#A2913E] outline-none text-sm'
                        />
                        {loc?.filteredCountries?.length === 0 &&
                          loc?.countrySearch && (
                            <div className='p-2 text-sm text-gray-500'>
                              No countries found.
                            </div>
                          )}
                        {(loc?.filteredCountries
                          ? loc.filteredCountries
                          : []
                        ).map((country) => (
                          <div
                            key={country?.code}
                            onClick={() => handleCountrySelect(index, country)}
                            className='p-2 hover:bg-gray-200 cursor-pointer text-sm'
                          >
                            {country?.country}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={
                  (locations || [])?.length > 1 ? 'col-span-5' : 'col-span-6'
                }
              >
                <div className='relative w-full'>
                  <input
                    type='text'
                    onFocus={() =>
                      setShowCityDropdown((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                    onBlur={() =>
                      setTimeout(
                        () =>
                          setShowCityDropdown((prev) => ({
                            ...prev,
                            [index]: false,
                          })),
                        1000
                      )
                    }
                    placeholder={
                      loc?.cities && loc?.cities?.length
                        ? `${loc?.cities?.length} cities selected`
                        : 'Search city'
                    }
                    value={loc.citySearch || ''}
                    onChange={(e) => handleCitySearch(index, e.target.value)}
                    className='px-4 py-2 outline-none bg-[#002D4F]/10 shadow-neons text-[#8D7C3B] border border-[#8D7C3B] rounded-md w-full'
                  />

                  {/* City dropdown */}
                  {showCityDropdown[index] && (
                    <div
                      className={`${
                        (loc?.cities || [])?.length && showCityDropdown[index]
                          ? 'border border-[#A2913E]'
                          : ''
                      } absolute shadow-xl z-10 w-full bg-white rounded-[8px] mt-1 max-h-60 overflow-y-auto`}
                    >
                      {(loc?.cities || [])?.map((city, cityIdx) => (
                        <div
                          key={cityIdx}
                          onClick={() => handleRemoveCity(index, city)}
                          className='w-full flex justify-start items-center gap-2 p-2 cursor-pointer hover:opacity-90 transition-opacity'
                        >
                          <CheckIcon className='size-4 text-[#A2913E]' /> {city}
                        </div>
                      ))}
                    </div>
                  )}
                  {loc.cityOptions?.length > 0 && (
                    <div className='absolute z-10 w-full border border-[#A2913E] bg-white rounded-[8px] mt-1 max-h-60 overflow-y-auto'>
                      <>
                        {loc.cityOptions.map((city) => {
                          const label = formatCityLabel(city.description)
                          return (
                          <div
                            key={label}
                            onClick={() =>
                              handleCitySelect(index, label)
                            }
                            className='cursor-pointer p-2 hover:bg-gray-200'
                          >
                            {label}
                          </div>
                          )
                        })}
                      </>
                    </div>
                  )}
                </div>
              </div>
              <div className='col-span-1 flex justify-end items-center'>
                {locations?.length > 1 && (
                  <button
                    onClick={() => handleRemoveLocation(index)}
                    className='border border-[#A2913E] text-[#A2913E] rounded-sm px-2 py-2 flex items-center justify-center transition'
                    title='Remove this entry'
                  >
                    <XIcon className='size-4' />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handleAddLocation}
            className='justify-center w-full flex items-center rounded-l-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]  h-11 cursor-pointer hover:opacity-90 transition-opacity'
          >
            + Add Country & City
          </button>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 p-4'>
            <select
              defaultValue=''
              className='bg-[#002D4F]/10 text-[#8D7C3B] border border-[#8D7C3B] rounded-md px-4 py-2  w-full'
            >
              <option value=''>Targeted age</option>
              <option value='21-30'>21 - 30</option>
              <option value='31-40'>31 - 40</option>
              <option value='41-50'>41 - 50</option>
              <option value='51-60'>51 - 60</option>
              <option value='60+'>60+</option>
            </select>

            <select className='bg-[#002D4F]/10 text-[#8D7C3B] border border-[#8D7C3B] rounded-md px-4 py-2  w-full'>
              <option value={''}>Targeted gender</option>
              <option value={'male'}>Male</option>
              <option value={'female'}>Female</option>
            </select>

            <input
              type='date'
              placeholder='Start Date'
              value={startDate}
              title='Start Date'
              onChange={(e) => setStartDate(e.target.value)}
              className='bg-[#002D4F]/10 text-[#8D7C38] border border-[#A2913E] rounded-md w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
            />
            <input
              type='date'
              placeholder='End Date'
              value={endDate}
              title='End Date'
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='bg-[#002D4F]/10 text-[#8D7C38] border border-[#A2913E] rounded-md w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
            />
          </div>

          <div className='flex mx-auto justify-center items-center w-full max-w-full sm:max-w-[70%]'>
            <button
              onClick={handleSubmit}
              className='justify-center w-full flex items-center rounded-l-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]  h-11 cursor-pointer hover:opacity-90 transition-opacity'
            >
              Update Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditAdvertisementPopup
