"use client"

import React, { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import Modal from '@/components/Avator/Modal'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import ProfileInformation from '../SellerProfile/Profile/ProfileInformation'
import PersonalDetails from '../SellerProfile/Profile/PersonalDetails'
import BankForm from '../SellerProfile/Profile/BankForm'
import EmiratesIdSection from '../SellerProfile/Profile/EmiratesIdSection'
import { useProfile } from '../../../context/UserContext'
import { FaSpinner } from 'react-icons/fa'
import {
  normalizeCountriesResponse,
  normalizeCitiesResponse,
} from '@/libs/normalizeCountriesResponse'
import {
  DUMMY_UAE_CITY_PREDICTIONS,
  filterDummyCitiesByQuery,
  isDummyUaeLocationsEnabled,
} from '@/libs/dummyLocationData'

const Loader = () => (
  <div className='w-full flex justify-center py-10'>
    <div className='w-full h-40 flex justify-center items-center'>
      <FaSpinner className='animate-spin' />
    </div>
  </div>
)

export const ProfileTab = () => {
  const [showModal, setShowModal] = useState(false)
  const { user, setUser, fetchProfile } = useProfile()
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [searchQueryCity, setSearchQueryCity] = useState('')
  const [countryCode, setCountryCode] = useState('')

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries', {
          next: { revalidate: 10 },
        })
        const data = await response.json()

        setCountries(normalizeCountriesResponse(data))
      } catch (error) {
        console.error('Error fetching countries data:', error)
      }
    }

    fetchCountries()
  }, [])

  const fetchCities = async () => {
    if (!countryCode) {
      setCities([])
      return
    }

    const applyDummyAeCities = () => {
      setCities(filterDummyCitiesByQuery(DUMMY_UAE_CITY_PREDICTIONS, searchQueryCity))
    }

    if (isDummyUaeLocationsEnabled && countryCode === 'AE') {
      applyDummyAeCities()
      return
    }

    try {
      const response = await fetch(
        `/api/country?name=${countryCode}&query=${searchQueryCity}`,
        { next: { revalidate: 10 } }
      )

      if (!response.ok) throw new Error('Failed to fetch cities')

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
    }
  }

  const handleCloseModal = () => setShowModal(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    const savedCountry = user?.financialInfo?.country
    if (!savedCountry || countryCode || countries.length === 0) return

    const match = countries.find(
      (c) =>
        c.country === savedCountry ||
        c.country?.toLowerCase() === savedCountry?.toLowerCase(),
    )

    if (match?.code) {
      setCountryCode(match.code)
    }
  }, [user, countries, countryCode])

  useEffect(() => {
    fetchCities()
  }, [searchQueryCity, countryCode])

  // ⏳ Loader Condition — wait for user & countries
  if (!user || countries.length === 0) {
    return <Loader />
  }

  return (
    <>
      <Modal show={showModal} onClose={handleCloseModal} />
      <span className='text-lg text-prussianBlue/40 mb-4 block'>Profile</span>

      <div className='custom-shadow rounded flex flex-col gap-2'>
        {/* Personal Information */}
        <Disclosure as='div' className='disclosure' defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${open && 'mb-3'
                  }`}
              >
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                  Personal Informations
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>

              <Disclosure.Panel>
                <ProfileInformation
                  fetchData={fetchProfile}
                  user={user}
                  setUser={setUser}
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Personal Details */}
        <Disclosure as='div' className='disclosure'>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${open && 'mb-3'
                  }`}
              >
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                  Personal Details
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>

              <Disclosure.Panel>
                <PersonalDetails
                  countries={countries}
                  fetchData={fetchProfile}
                  setUser={setUser}
                  user={user}
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Emirates ID for Clozer */}
        <Disclosure as='div' className='disclosure'>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${open && 'mb-3'
                  }`}
              >
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                  Emirates ID (Clozer)
                </span>
                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <EmiratesIdSection user={user} fetchData={fetchProfile} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Financial Info */}
        <Disclosure as='div'>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${open && 'mb-3'
                  }`}
              >
                <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                  Financial Information
                </span>

                <span className='flex-shrink-0'>
                  {open ? (
                    <OpenDisclosure className='text-white' />
                  ) : (
                    <CloseDisclosure className='text-white' />
                  )}
                </span>
              </Disclosure.Button>

              <Disclosure.Panel>
                <BankForm
                  user={user}
                  countries={countries}
                  cities={cities}
                  fetchCities={fetchCities}
                  fetchData={fetchProfile}
                  setUser={setUser}
                  setSearchQueryCity={setSearchQueryCity}
                  searchQueryCity={searchQueryCity}
                  setCountryCode={setCountryCode}
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}
