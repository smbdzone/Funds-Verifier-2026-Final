'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from '../../Icons'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import { SlArrowRight } from 'react-icons/sl'
import useDebounce from '../../../hooks/useDebounce'
import customAxios from '../../../utils/apis/apis'
import HistoryEvaluatedFilters, {
  useHistoryEvaluatedFilters,
} from '../EvaluatorProfile/HistoryEvaluatedFilters'
import { applyHistoryEvaluatedFilters } from '@/libs/filterHistoryEvaluatedListings'
import EvaluationTableStatusRow from '../EvaluatorProfile/EvaluationTableStatusRow'

export const PropertyEvaluationTab = () => {
  const [propertyListings, setPropertyListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [selected, setSelected] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)
  const debouncedQuery = useDebounce(searchTerm, 500)

  const router = useRouter()
  const {
    nameQuery,
    setNameQuery,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortOrder,
    setSortOrder,
    historyFilters,
    historyFiltersActive,
    resetHistoryFilters,
  } = useHistoryEvaluatedFilters()

  const fetchListingsData = async () => {
    setListingsLoading(true)
    try {
      const propertyResponse = await customAxios.get(
        `/property?sort=${selected}&title=${debouncedQuery}`,
      )
      const reversedData = propertyResponse.data.products.reverse()
      setPropertyListings(reversedData)
    } catch (error) {
      console.error('Error fetching listing data:', error)
    } finally {
      setListingsLoading(false)
    }
  }

  useEffect(() => {
    fetchListingsData()
  }, [selected, debouncedQuery])

  const pendingListings = useMemo(
    () =>
      (propertyListings || []).filter(
        (property) =>
          property.status === 0 || !property.hasOwnProperty('status'),
      ),
    [propertyListings],
  )
  const historyListings = useMemo(
    () => applyHistoryEvaluatedFilters(propertyListings, historyFilters),
    [propertyListings, historyFilters],
  )

  return (
    <>
      <div className='flex flex-wrap justify-between items-center mb-4'>
        <span className='text-lg sm:text-2xl font-bold text-black'>
          Evaluations
        </span>
        <div className='flex gap-3 items-center'>
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
                      className={`w-full primary-gradient rounded px-5 py-3 sm:px-7 sm:py-4 flex justify-between items-center ${open && 'mb-3'
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
                        {index === 1 ? (
                          <HistoryEvaluatedFilters
                            nameQuery={nameQuery}
                            onNameQueryChange={setNameQuery}
                            dateFrom={dateFrom}
                            onDateFromChange={setDateFrom}
                            dateTo={dateTo}
                            onDateToChange={setDateTo}
                            sortOrder={sortOrder}
                            onSortOrderChange={setSortOrder}
                            onReset={resetHistoryFilters}
                            showReset={historyFiltersActive}
                          />
                        ) : null}
                        <table className='w-full text-sm sm:text-base bg-white'>
                          <thead>
                            <tr>
                              <th className='py-2 px-4 text-left'>Title</th>
                              <th className='py-2 px-4 text-left'>
                                Evaluation Date & Time
                              </th>
                              {index === 0 ? (
                                <th className='py-2 px-4 text-left'>Status</th>
                              ) : null}
                              <th className='py-2 px-4 text-left'>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!listingsLoading &&
                              (index === 0 ? pendingListings : historyListings).map((property) => {
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
                                    {index === 0 ? (
                                      <td className='py-3 px-4'>
                                        <span className='inline-flex rounded bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-800'>
                                          Pending
                                        </span>
                                      </td>
                                    ) : null}
                                    <td className='py-3 px-4'>
                                      <div className='relative inline-block text-left'>
                                        <button
                                          onClick={() =>
                                            setOpenDropdown((prev) =>
                                              prev === property.uuid
                                                ? null
                                                : property.uuid,
                                            )
                                          }
                                          className='flex items-center text-blue-600'
                                        >
                                          <SlArrowRight />
                                        </button>

                                        {openDropdown === property.uuid && (
                                          <div className='absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg'>
                                            <button
                                              onClick={() => {
                                                setOpenDropdown(null)
                                              }}
                                              className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                                            >
                                              Assign To
                                            </button>
                                            <button
                                              onClick={() => {
                                                router.push(
                                                  `/sub-evaluator-profile/property-evaluation/${property.uuid}`,
                                                )
                                                setOpenDropdown(null)
                                              }}
                                              className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                                            >
                                              Evaluate
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            <EvaluationTableStatusRow
                              loading={listingsLoading}
                              isEmpty={
                                (index === 0
                                  ? pendingListings
                                  : historyListings
                                ).length === 0
                              }
                              emptyMessage={
                                index === 1
                                  ? 'No evaluated assets match these filters.'
                                  : 'No pending evaluations.'
                              }
                              colSpan={index === 0 ? 4 : 3}
                            />
                          </tbody>
                        </table>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ),
        )}
      </section>
    </>
  )
}
