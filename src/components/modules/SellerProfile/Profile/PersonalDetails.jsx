"use client"

import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import DropdownInput from '@/components/Inputs/DropdownInput'
import customAxios from '../../../../utils/apis/apis'

const PersonalDetails = ({ user, fetchData, setUser, countries }) => {
  // Dropdown toggles
  const [toggleCountry, setToggleCountry] = useState(false)
  const [searchQueryCountry, setSearchQueryCountry] = useState('')

  const [toggleResidence, setToggleResidence] = useState(false)
  const [searchQueryResidence, setSearchQueryResidence] = useState('')

  const [toggleEmployer, setToggleEmployer] = useState(false)
  const [searchQueryEmployer, setSearchQueryEmployer] = useState('')

  const [toggleIndustry, setToggleIndustry] = useState(false)
  const [searchQueryIndustry, setSearchQueryIndustry] = useState('')

  useEffect(() => {
    if (user?.personalDetails?.citizenship) {
      setSearchQueryCountry(user.personalDetails.citizenship)
    }
  }, [user?.personalDetails?.citizenship])

  useEffect(() => {
    if (user?.personalDetails?.residenceStatus) {
      setSearchQueryResidence(user.personalDetails.residenceStatus)
    }
  }, [user?.personalDetails?.residenceStatus])

  useEffect(() => {
    if (user?.personalDetails?.employerName) {
      setSearchQueryEmployer(user.personalDetails.employerName)
    }
  }, [user?.personalDetails?.employerName])

  useEffect(() => {
    if (user?.personalDetails?.industry) {
      setSearchQueryIndustry(user.personalDetails.industry)
    }
  }, [user?.personalDetails?.industry])

  return (
    <div className='sm:px-8 px-4 pb-3 sm:py-6'>
      <h2 className='sm:text-lg text-base lg:text-xl font-medium text-white mb-4'>
        Personal Details
      </h2>
      <Formik
        initialValues={{
          residenceStatus: user?.personalDetails?.residenceStatus || '',
          citizenship: user?.personalDetails?.citizenship || '',
          employerName: user?.personalDetails?.employerName || '',
          industry: user?.personalDetails?.industry || '',
        }}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            const res = await customAxios.put(
              `/user/update/${user?.uuid}`,
              { personalDetails: values }
            )
            if (res?.status === 200) {
              toast.success('Personal Information Updated Successfully')
              if (setUser && res.data) {
                setUser((prev) => ({ ...prev, ...res.data }))
              }
              fetchData()
            }
          } catch (error) {
            console.error(error.message)
            toast.error(error?.message)
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className='sm:grid space-y-5 sm:space-y-0 sm:grid-cols-2 w-full gap-4'>
            {/* Country of Citizenship */}
            <div>
              <DropdownInput
                setToggle={setToggleCountry}
                selectedValue={
                  values.citizenship || user?.personalDetails?.citizenship
                }
                dropdownOptions={countries.map((country) => country.country)}
                onChange={(value) => {
                  setFieldValue('citizenship', value)
                  setToggleCountry(false)
                }}
                toggle={toggleCountry}
                searchQuery={searchQueryCountry}
                setSearchQuery={setSearchQueryCountry}
                placeholder='Country of Citizenship'
              />
            </div>

            {/* Residence Status */}
            <div>
              <DropdownInput
                setToggle={setToggleResidence}
                selectedValue={
                  values.residenceStatus ||
                  user?.personalDetails?.residenceStatus
                }
                dropdownOptions={['Resident', 'Non-Resident']}
                onChange={(value) => {
                  setFieldValue('residenceStatus', value)
                  setToggleResidence(false)
                }}
                toggle={toggleResidence}
                searchQuery={searchQueryResidence}
                setSearchQuery={setSearchQueryResidence}
                placeholder='Residence Status'
              />
            </div>

            {/* Employer Name */}
            <div>
              <DropdownInput
                setToggle={setToggleEmployer}
                selectedValue={
                  values.employerName || user?.personalDetails?.employerName
                }
                dropdownOptions={['Employer A', 'Employer B', 'Employer C']}
                onChange={(value) => {
                  setFieldValue('employerName', value)
                  setToggleEmployer(false)
                }}
                toggle={toggleEmployer}
                searchQuery={searchQueryEmployer}
                setSearchQuery={setSearchQueryEmployer}
                placeholder='Name of Employer'
              />
            </div>

            {/* Industry */}
            <div>
              <DropdownInput
                setToggle={setToggleIndustry}
                selectedValue={
                  values.industry || user?.personalDetails?.industry
                }
                dropdownOptions={['IT', 'Finance', 'Education', 'Healthcare']}
                onChange={(value) => {
                  setFieldValue('industry', value)
                  setToggleIndustry(false)
                }}
                toggle={toggleIndustry}
                searchQuery={searchQueryIndustry}
                setSearchQuery={setSearchQueryIndustry}
                placeholder='Select Industry'
              />
            </div>

            {/* Save Button */}
            <div className='flex col-span-2 justify-end items-center mt-10'>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`btn-gradient px-5 rounded py-2 mt-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PersonalDetails
