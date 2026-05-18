/* eslint-disable react/no-unescaped-entities */
'use client'
import { useEffect, useState, useRef, useTransition } from 'react'
import { UploadIcon } from '@/components/Icons'
import {
  fetchCities,
  fetchCountries,
} from '../../../libs/fetchCountriesAndCities'
import axios from 'axios'
import { useProfile } from '../../../context/UserContext'
import { handleThumbnailUpload } from '../../../libs/uploadAsset'
import { getTokenFromCookie } from '../../../utils/helper'
import { toast } from 'react-toastify'
import AdvertisementList from '../../../components/advertisementComponent/AdvertisementList'
import Image from 'next/image'
import { CheckIcon, XCircleIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  const [isPending, startTransition] = useTransition(false)
  const [email, setEmail] = useState('')
  const [format, setFormat] = useState('')
  const [file, setFile] = useState(null)
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [searchCityQuery, setSearchCityQuery] = useState('')
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isSelect, setIsSelect] = useState(false)
  const [price, setPrice] = useState(0)
  const [isPaid, setIsPaid] = useState(false)
  const [adLink, setAddLink] = useState('')
  const [rended, setIsRended] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isAdvertisementLoaded, setIsAdvertisementLoaded] = useState(true)
  const dropdownRef = useRef()
  const user = useProfile()
  const token = getTokenFromCookie() || user?.accessToken
  const [getUserAdvertisement, setGetUserAdvertisement] = useState()
  const [locations, setLocations] = useState([
    { countryCode: '', country: '', city: '', cityOptions: [] },
  ])
  const [showCityDropdown, setShowCityDropdown] = useState({})
  const debounceTimers = useRef({}) // Refs to manage debounce timers per index

  const userUUID = user?.user?.['uuid']

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
      country.country.toLowerCase().includes(value.toLowerCase()),
    )
    setLocations(updated)
  }

  const handleCountrySelect = (index, country) => {
    const updated = [...locations]
    updated[index].countryCode = country.code
    updated[index].countryName = country.country
    updated[index].countrySearch = ''
    // updated[index].filteredCountries = [];
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
          : loc,
      ),
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
              : loc,
          ),
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
      }),
    )
  }

  const handleRemoveCity = (index, cityName) => {
    setLocations((prev) =>
      prev.map((loc, i) =>
        i === index
          ? { ...loc, cities: loc.cities.filter((city) => city !== cityName) }
          : loc,
      ),
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

  const handleRemoveFile = () => {
    setFile(null)
  }

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
        cities: [], // <= important
        cityOptions: [],
        citySearch: '',
      },
    ])
  }

  const handleSubmit = async () => {
    if (!file) return toast.error('Please upload an image.')
    if (!token) return toast.error('Please login to continue')
    if (!startDate || !endDate)
      return toast.error('Please select start and end dates.')
    if (new Date(startDate) > new Date(endDate))
      return toast.error('Start date cannot be later than end date.')
    return setShowPaymentModal(true)
  }

  const handleSelectCountry = (countryCode) => {
    const filtered_country = countries.find((data) => data.code === countryCode)

    setSelectedCountryCode(countryCode)
    setSelectedCountry(filtered_country.country)
  }

  const handlePayAdvertise = async () => {
    startTransition(async () => {
      if (!file) return toast.error('Please upload an advertisement image.')
      if (!token) return toast.error('Please login to continue')
      if (!startDate || !endDate)
        return toast.error('Please select start and end dates.')
      if (new Date(startDate) > new Date(endDate))
        return toast.error('Start date cannot be later than end date.')

      const fileId = await handleThumbnailUpload(file)
      const data = {
        email,
        creatives: [
          { img: fileId?.images?.[0]?.url, adLink, format, formatError: false },
        ],
        targetedAudience: {
          country: locations?.map((loc) => loc?.countryName || loc?.country),
          city: locations?.map((loc) => loc?.cities || loc?.city),
          startAt: [startDate],
          endAt: [endDate],
        },
        country: selectedCountryCode,
        city: selectedCity,
        budget: price,
        startDate,
        endDate,
      }
      const AdData = {
        price,
        data: data,
        pathName: `${process.env.NEXT_PUBLIC_UAE_PASS_REDIRECT_URI}`,
      }

      // return
      try {
        const res = await axios.post('/api/stripe-advertisement', AdData, {
          headers: { Token: `${token}` },
        })
        window.location.href = res?.data?.url
        setShowPaymentModal(false)
      } catch (error) {
        toast.error(
          'An error occurred while initiating payment. Please try again.',
        )
      }
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return // skip server build
    if (token) {
      handleGetAdvertisementUser(token)
    }
  }, [token, rended])

  const handleGetAdvertisementUser = async (token) => {
    setIsAdvertisementLoaded(true)
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/getUserAdvertisement`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setGetUserAdvertisement(res?.data?.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsAdvertisementLoaded(false)
    }
  }

  const handleEditAdvertisementPopup = async (id) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const response = res?.data?.data
      const audience = res?.data?.data?.targetedAudience
      setTargettedCountries(audience?.country)
      setSelectedStates(audience?.states)
      setTargettedCities(audience?.city)
      setFormValues({
        creatives: response?.creatives,
        gender: audience?.gender,
        age: audience?.age,
        fromDate: audience?.startAt[0],
        toDate: audience?.endAt[0],
        unwantedDays: audience?.unwantedDays,
        unwantedSlots: audience?.unwantedTimeSlots,
        totalDays: response?.totalDays,
        id: id,
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  const TextUnderlineIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='96'
      height='4'
      viewBox='0 0 96 4'
      fill='none'
    >
      <rect width='95' height='4' transform='translate(0.5)' fill='white' />
      <rect x='0.5' width='20' height='4' rx='2' fill='#002D4F' />
      <rect x='25.5' width='70' height='4' rx='2' fill='#8D7C3B' />
    </svg>
  )
  return (
    <div>
      {showPaymentModal && (
        <div
          className={`fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black bg-opacity-50`}
        >
          <div className='relative bg-white p-6 rounded-[6px] shadow-lg w-full max-w-[500px]'>
            <button
              type='button'
              disabled={isPending}
              onClick={() => setShowPaymentModal(false)}
              className='disabled:cursor-not-allowed cursor-pointer absolute top-3 right-3'
            >
              <XCircleIcon className='size-5 text-[#A2913E]' />
            </button>
            <h1 className='text-center text-[#002D4F] mb-3 text-[25px] font-bold'>
              Budget
            </h1>
            <div className='flex justify-center items-center text-center mb-4'>
              {TextUnderlineIcon}
            </div>
            <div className='mx-auto flex flex-col items-end gap-3'>
              <input
                type='number'
                placeholder='0.00'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='shadow-neons border border-[#A2913E] rounded-[8px] w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
              />
              <div className='flex justify-center items-center w-full max-w-[70%] mx-auto'>
                <button
                  onClick={handlePayAdvertise}
                  disabled={price < 5 || isPending}
                  className='disabled:opacity-50 disabled:cursor-not-allowed justify-center w-full flex items-center rounded-l-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]  h-11 cursor-pointer hover:opacity-90 transition-opacity'
                >
                  {isPending ? 'Submiting...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='w-full valuesBg flex py-24 md:px-20 flex-col'>
        <div className='container mx-auto text-[#ffffff]'>
          <h1 className='heading text-white md:text-[70px] text-xl fs-60 font-semibold'>
            Advertise with Us
          </h1>
          <p className=' mt-6'>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
      </div>
      <div className='p-6 sm:p-12'>
        <div className='bg-white pt-16 px-2 md:px-20'>
          <div className='text-center mb-12'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12'>
              <div className='border border-[#A2913E] p-6 rounded-md shadow-sm flex flex-col items-center'>
                <Image src='/pricing1.svg' alt='' width={100} height={100} />
                <div className='text-2xl font-semibold mb-2'>
                  Impression Fees
                </div>
                <p className='text-gray-600'>
                  Cost for every 1000 unique views of your ad within a 24-hour
                  period.
                </p>
              </div>
              <div className='border border-[#A2913E] p-6 rounded-md shadow-sm flex flex-col items-center'>
                <Image src='/pricing2.svg' alt='' width={100} height={100} />
                <div className='text-2xl font-semibold mb-2'>Click Fees</div>
                <p className='text-gray-600'>
                  The charge incurred each time a user clicks on your ad.
                </p>
              </div>
              <div className='border border-[#A2913E] p-6 rounded-md shadow-sm flex flex-col items-center'>
                <Image src='/pricing3.svg' alt='' width={100} height={100} />
                <div className='text-2xl font-semibold mb-2'>Ad Formats</div>
                <p className='text-gray-600'>
                  Select the ad format that suits your campaign—options include
                  ¼ (Quarter-Page), and Bottom.
                </p>
              </div>
            </div>
            <div className=' max-w-2xl mx-auto flex items-center flex-col'>
              <div className='flex w-full  items-center'>
                <div className='flex md:text-4xl justify-center w-full text-xl font-semibold text-[#002D4F] mt-2'>
                  Pricing
                </div>
              </div>
              <div className='flex flex-row gap-2 my-5'>
                <div className='rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]' />
                <div className='rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]' />
              </div>
            </div>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              We believe in transparency, and our flexible pricing options allow
              you to tailor your advertising campaign to your specific needs.
              Additionally, take note of special considerations:
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
            <div className='bg-gray-100 p-6 rounded-md text-center'>
              <h3 className='text-xl font-semibold mb-2'>Impression Fees</h3>
              <p className='text-gray-600'>
                An additional $0.050 is applied to the fees for each click on
                Sundays.
              </p>
            </div>
            <div className='bg-gray-100 p-6 rounded-md text-center'>
              <h3 className='text-xl font-semibold mb-2'>Click Fee</h3>
              <p className='text-gray-600'>
                An additional $0.035 is applied to the fees for each click on
                Sundays.
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
            <div className='border-2 border-[#A2913E] p-6 rounded-lg'>
              <h4 className='text-xl font-bold mb-2'>
                Large Quarter-Page Banner
              </h4>
              <ul className='text-gray-700 list-disc list-inside'>
                <li>Impression Fee: $0.002 (per 1000)</li>
                <li>Image Size: 1080 x 395</li>
              </ul>
            </div>
            <div className='border-2 border-[#A2913E] p-6 rounded-lg'>
              <h4 className='text-xl font-bold mb-2'>Footer Banner</h4>
              <ul className='text-gray-700 list-disc list-inside'>
                <li>Impression Fee: $0.0015 (per 1000)</li>
                <li>Image Size: 1080 x 220</li>
              </ul>
            </div>
          </div>
        </div>
        {userUUID ? (
          <>
            <div className='mb-10 max-w-2xl mx-auto flex items-center flex-col'>
              <div className='flex w-full  items-center'>
                <div className='flex md:text-4xl justify-center w-full text-xl font-semibold text-[#002D4F] mt-2'>
                  List of Advertisments
                </div>
              </div>
              <div className='flex flex-row gap-2 mt-5'>
                <div className='rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]' />
                <div className='rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]' />
              </div>
            </div>
            <AdvertisementList
              getUserAdvertisement={getUserAdvertisement}
              token={token}
              locations={locations}
              handleEditAdvertisementPopup={handleEditAdvertisementPopup}
              setIsRended={setIsRended}
            />
            <div className='lg:w-[60%] mx-auto'>
              <h1 className='text-center my-12 text-[40px] font-bold text-[#002D4F]'>
                Upload Creatives
              </h1>
              <div className='mx-auto flex flex-col gap-3'>
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='shadow-neons border border-[#A2913E] rounded-[8px] w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                />
                <input
                  type='text'
                  placeholder='https://example.com'
                  value={adLink}
                  onChange={(e) => setAddLink(e.target.value)}
                  className='shadow-neons border border-[#A2913E] rounded-[8px] w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                />
                <select
                  name='format'
                  id=''
                  onChange={(e) => setFormat(e.target.value)}
                  className='shadow-neons border border-[#A2913E] rounded-[8px] w-full h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                >
                  <option value=''>Select Format</option>
                  <option value={'Footer Banner'}>Footer Banner</option>
                </select>
                <label
                  className='flex cursor-pointer border border-[#A2913E] rounded-[8px] flex-col py-11 justify-center items-center'
                  htmlFor='upload'
                >
                  <input
                    type='file'
                    id='upload'
                    className='hidden'
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <span
                    title='upload document'
                    className='flex flex-col text-black/50 justify-center items-center text-xs py-3 px-7 font-medium mb-3'
                  >
                    <UploadIcon className='mb-2 h-7 w-7' />
                    Upload Image
                  </span>
                  <span className='text-black/30'>
                    Make sure Image Size: 1080 x 220
                  </span>

                  {file && (
                    <div className='flex relative items-center gap-4 px-4 mt-4'>
                      <button
                        onClick={handleRemoveFile}
                        className='absolute -top-2 right-2  bg-red-600 text-white rounded-full h-[20px] w-[20px] flex items-center justify-center text-xl hover:bg-red-700 transition'
                      >
                        &times;
                      </button>
                      <img
                        src={URL.createObjectURL(file)}
                        alt='Uploaded file preview'
                        className='w-full h-32 object-cover'
                      />
                    </div>
                  )}
                </label>
                <div className=' max-w-2xl mx-auto flex items-center flex-col'>
                  <div className='flex w-full  items-center'>
                    <div className='flex md:text-4xl justify-center w-full text-xl font-semibold text-[#002D4F] mt-2'>
                      Target Audience
                    </div>
                  </div>
                  <div className='flex flex-row gap-2 my-5'>
                    <div className='rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]' />
                    <div className='rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]' />
                  </div>
                </div>

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
                                  onClick={() =>
                                    handleCountrySelect(index, country)
                                  }
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
                        (locations || [])?.length > 1
                          ? 'col-span-5'
                          : 'col-span-6'
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
                              1000,
                            )
                          }
                          placeholder={
                            loc?.cities && loc?.cities?.length
                              ? `${loc?.cities?.length} cities selected`
                              : 'Search city'
                          }
                          value={loc.citySearch || ''}
                          onChange={(e) =>
                            handleCitySearch(index, e.target.value)
                          }
                          className='px-4 py-2 outline-none bg-[#002D4F]/10 shadow-neons text-[#8D7C3B] border border-[#8D7C3B] rounded-md w-full'
                        />

                        {/* City dropdown */}
                        {showCityDropdown[index] && (
                          <div
                            className={`${
                              (loc?.cities || [])?.length &&
                              showCityDropdown[index]
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
                                <CheckIcon className='size-4 text-[#A2913E]' />{' '}
                                {city}
                              </div>
                            ))}
                          </div>
                        )}
                        {loc.cityOptions?.length > 0 && (
                          <div className='absolute z-10 w-full border border-[#A2913E] bg-white rounded-[8px] mt-1 max-h-60 overflow-y-auto'>
                            <>
                              {loc.cityOptions.map((city) => (
                                <div
                                  key={city.description}
                                  onClick={() =>
                                    handleCitySelect(index, city.description)
                                  }
                                  className='cursor-pointer p-2 hover:bg-gray-200'
                                >
                                  {city.description}
                                </div>
                              ))}
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
                  <select className='bg-[#002D4F]/10 text-[#8D7C3B] border border-[#8D7C3B] rounded-md px-4 py-2  w-full'>
                    <option value={''}>Targeted age</option>
                    <option value={[21, 30]}>21 - 30</option>
                    <option value={[31, 40]}>31 - 40</option>
                    <option value={[41, 50]}>41 - 50</option>
                    <option value={[60]}>60+</option>
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
                    Create Ad
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='mx-auto flex flex-col items-center justify-center'>
            <Link
              href={'/login'}
              type='button'
              className='max-w-[560px] justify-center w-full flex items-center rounded-l-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]  h-11 cursor-pointer hover:opacity-90 transition-opacity'
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
