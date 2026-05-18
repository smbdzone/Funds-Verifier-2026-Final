'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter for navigation
import { SearchIcon } from '../../Icons'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import { SlArrowRight } from 'react-icons/sl'
import useDebounce from '../../../hooks/useDebounce'
import customAxios from '../../../utils/apis/apis'

export const CarsEvaluationTab = () => {
  const [propertyListings, setPropertyListings] = useState([])
  const [selected, setSelected] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedQuery = useDebounce(searchTerm, 500) // Adjust delay as desired
  const router = useRouter() // Initialize router

  const handleTabClick = async (propertyId) => {
    await router.push(`/sub-evaluator-profile/car-evaluation/${propertyId}`) // Navigate with propertyId
  }

  const fetchListingsData = async () => {
    try {
      const propertyResponse = await customAxios.get(
        `/car?sort=${selected}&title=${debouncedQuery}`
      )
      const reversedData = propertyResponse.data.products.reverse() // Reverse the order of items
      setPropertyListings(reversedData)
    } catch (error) {
      console.error('Error fetching listing data:', error)
    }
  }

  useEffect(() => {
    fetchListingsData()
  }, [selected, debouncedQuery])

  return (
    <>
      <div className='flex flex-wrap justify-between items-center mb-4'>
        <span className='text-lg sm:text-2xl font-bold text-black'>
          Evaluations
        </span>
        <div className='flex  gap-3 items-center'>
          <div className='flex items-center border border-gray-300 rounded-md overflow-hidden w-full sm:w-auto'>
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-1 px-3 py-2 text-sm sm:text-base text-gray-700 focus:outline-none'
            />
            <button className='bg-gray-200 px-3 py-2'>
              <SearchIcon />
            </button>
          </div>
          <div className='flex mt-3 sm:mt-0 sm:gap-2'>
            <button
              onClick={() => setSelected('-createdAt')}
              title='Descending Order'
              className='h-8 w-5 sm:h-10 sm:w-7'
            >
              <img src='/icons/up-arrow.svg' alt='Descending' />
            </button>
            <button
              onClick={() => setSelected('createdAt')}
              title='Ascending Order'
              className='h-8 w-5 sm:h-10 sm:w-7 rotate-180'
            >
              <img src='/icons/up-arrow.svg' alt='Ascending' />
            </button>
          </div>
        </div>
      </div>

      <section className='bg-white py-4'>
        {['Pending Evaluations', 'History Evaluated Assets'].map(
          (sectionTitle, index) => (
            <div
              className='custom-shadow rounded flex flex-col mb-4'
              key={index}
            >
              <Disclosure as='div' defaultOpen={true}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`w-full primary-gradient rounded px-5 py-3 sm:px-7 sm:py-4 flex justify-between items-center ${
                        open && 'mb-3'
                      }`}
                    >
                      <span className='text-base sm:text-lg font-medium text-white'>
                        {sectionTitle}
                      </span>
                      <span>
                        {open ? <OpenDisclosure /> : <CloseDisclosure />}
                      </span>
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className='overflow-x-auto md:px-5 px-3'>
                        <table className='w-full text-sm sm:text-base bg-white'>
                          <thead>
                            <tr>
                              <th className='py-2 px-4 text-left'>Title</th>
                              <th className='py-2 px-4 text-left'>
                                Evaluation Date & Time
                              </th>
                              <th className='py-2 px-4 text-left'>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {propertyListings
                              .filter((property) =>
                                index === 0
                                  ? property.status === 0 ||
                                    !property.hasOwnProperty('status')
                                  : property.status === 1
                              )
                              .map((property) => {
                                const date = property?.evaluationDateTime
                                  ? new Date(property.evaluationDateTime)
                                  : null
                                const isValidDate =
                                  date instanceof Date &&
                                  !Number.isNaN(date.getTime())
                                const formattedDate = isValidDate
                                  ? date.toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })
                                  : '--'
                                const formattedTime = isValidDate
                                  ? date.toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                    })
                                  : '--'

                                return (
                                  <tr key={property.uuid} className='border-t'>
                                    <td className='py-3 truncate px-4 capitalize'>
                                      {property.title}
                                    </td>
                                    <td className='py-3 truncate px-4'>{`${formattedDate} ${formattedTime}`}</td>
                                    <td className='py-3 px-4'>
                                      <button
                                        onClick={() =>
                                          handleTabClick(property.uuid)
                                        }
                                        className='flex items-center text-blue-600'
                                      >
                                        <SlArrowRight />
                                      </button>
                                    </td>
                                  </tr>
                                )
                              })}
                          </tbody>
                        </table>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          )
        )}
      </section>
    </>
  )
}
