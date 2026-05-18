"use client"

import React, { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import Modal from '@/components/Avator/Modal'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import ProfileInformation from '../SellerProfile/Profile/ProfileInformation'
import PersonalDetails from '../SellerProfile/Profile/PersonalDetails'
import BankForm from '../SellerProfile/Profile/BankForm'
import { useProfile } from '../../../context/UserContext'
import { FaSpinner } from 'react-icons/fa'
import {
  normalizeCountriesResponse,
  normalizeCitiesResponse,
} from '@/libs/normalizeCountriesResponse'

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
    try {
      const response = await fetch(
        `/api/country?name=${countryCode}&query=${searchQueryCity}`,
        { next: { revalidate: 10 } }
      )

      if (!response.ok) throw new Error('Failed to fetch cities')

      const data = await response.json()
      setCities(normalizeCitiesResponse(data))
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleCloseModal = () => setShowModal(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    fetchCities()
  }, [searchQueryCity])

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
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
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
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
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
                  user={user}
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Financial Info */}
        <Disclosure as='div'>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`w-full btn-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                  open && 'mb-3'
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
