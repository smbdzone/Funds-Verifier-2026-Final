'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import customAxios from '@/utils/apis/apis'
import { useRouter } from 'next/navigation'
import { SearchIcon } from '../../Icons'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import { SlArrowRight } from 'react-icons/sl'
import useDebounce from '../../../hooks/useDebounce'
import Modal from '../../documents/modal'
import { toast } from 'react-toastify'
import { getTokenFromCookie } from '../../../utils/helper'
import { useProfile } from '../../../context/UserContext'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import EvaluationActionDropdown, {
  evaluationMenuItemClass,
} from './requestCompoenets/EvaluationActionDropdown'
import { fetchEvaluatorListings } from '@/libs/evaluatorListingsQuery'
import {
  assignAssetToSubEvaluator,
  isAssetAssignedToSubEvaluator,
  unassignAssetFromSubEvaluator,
} from '@/libs/evaluatorAssign'
import HistoryEvaluatedFilters, {
  useHistoryEvaluatedFilters,
} from './HistoryEvaluatedFilters'
import { applyHistoryEvaluatedFilters } from '@/libs/filterHistoryEvaluatedListings'
import EvaluationTableStatusRow from './EvaluationTableStatusRow'

export const PropertyEvaluationTab = () => {
  const { user } = useProfile()
  const [propertyListings, setPropertyListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [subEvaluators, setSubEvaluators] = useState([])
  const [selected, setSelected] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [certificateUrl, setCertificateUrl] = useState('')
  const debouncedQuery = useDebounce(searchTerm, 500)
  const menuAnchorRef = useRef(null)
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

  const router = useRouter()
  const userRole = user?.role

  const closeActionMenu = () => {
    setOpenDropdown(null)
    setAssignDropdownOpen(null)
    menuAnchorRef.current = null
  }

  const toggleActionMenu = (event, propertyUuid) => {
    event.stopPropagation()
    if (openDropdown === propertyUuid) {
      closeActionMenu()
      return
    }
    menuAnchorRef.current = event.currentTarget
    setOpenDropdown(propertyUuid)
    setAssignDropdownOpen(null)
  }

  useEffect(() => {
    fetchListingsData()
  }, [selected, debouncedQuery])

  useEffect(() => {
    fetchSubEvaluators()
  }, [])

  const fetchListingsData = async () => {
    setListingsLoading(true)
    try {
      const products = await fetchEvaluatorListings('property', {
        sort: selected,
        title: debouncedQuery,
      })
      setPropertyListings(products.reverse())
    } catch (error) {
      console.error('Error fetching listing data:', error)
    } finally {
      setListingsLoading(false)
    }
  }

  const fetchSubEvaluators = async () => {
    try {
      const meRes = await customAxios.get('/user/me') // token-based
      const me = meRes.data || {}
      const parentIds = Array.from(new Set([me?._id, me?.uuid].filter(Boolean)))

      if (parentIds.length === 0) {
        toast.error('Unable to identify user. Please log in again.')
        return
      }

      const responses = await Promise.allSettled(
        parentIds.map((parentId) => customAxios.get(`/evaluator/parent/${parentId}`))
      )

      const merged = []
      const seen = new Set()

      responses.forEach((result) => {
        if (result.status !== 'fulfilled' || result.value?.status !== 200) return
        const evaluators = Array.isArray(result.value?.data)
          ? result.value.data
          : []

        evaluators.forEach((item) => {
          const key = item?.uuid || item?._id
          if (!key || seen.has(key)) return
          seen.add(key)
          merged.push(item)
        })
      })

      setSubEvaluators(merged)
    } catch (error) {
      console.error('Failed to fetch evaluators', error)
    }
  }

  const handleAssignEvaluator = async (propertyId, evaluatorId) => {
    try {
      await assignAssetToSubEvaluator({
        assetId: propertyId,
        assetType: 'property',
        assigneeId: evaluatorId,
      })
      toast.success('Evaluator assigned successfully')
      closeActionMenu()
      fetchListingsData()
    } catch (err) {
      console.error('Assignment failed:', err)
      toast.error(err?.response?.data?.message || 'Failed to assign evaluator')
    }
  }

  const handleUnassignEvaluator = async (propertyId) => {
    try {
      await unassignAssetFromSubEvaluator({
        assetId: propertyId,
        assetType: 'property',
      })
      toast.success('Evaluator unassigned successfully')
      closeActionMenu()
      fetchListingsData()
    } catch (err) {
      console.error('Unassign failed:', err)
      toast.error(err?.response?.data?.message || 'Failed to unassign evaluator')
    }
  }

  const handleShowCertificate = async (propertyId) => {
    try {
      const response = await customAxios.get(`/property/${propertyId}`)

      const certSrc = getListingDocumentSrc(
        response?.data?.evaluationCertificate,
      )
      if (certSrc) {
        setCertificateUrl(certSrc)
        setIsModalOpen(true)
      } else {
        toast.info('No evaluation certificate found for this property')
      }
    } catch (error) {
      console.error('Error fetching certificate:', error)
      toast.error('Failed to load evaluation certificate')
    }
    setOpenDropdown(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCertificateUrl('')
  }

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
              className='h-8 w-5 sm:h-10 sm:w-7'
            >
              <img src='/icons/up-arrow.svg' alt='Descending' />
            </button>
            <button
              onClick={() => setSelected('createdAt')}
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
                    <Disclosure.Panel className='overflow-visible'>
                      <div className='overflow-x-auto md:px-5 px-3 pb-2'>
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
                                <>
                                  <th className='py-2 px-4 text-left'>Status</th>
                                  <th className='py-2 px-4 text-left'>Action</th>
                                </>
                              ) : (
                                <>
                                  <th className='py-2 px-4 text-left'>
                                    Evaluated By
                                  </th>
                                  <th className='py-2 px-4 text-left'>
                                    Action
                                  </th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {!listingsLoading &&
                              (index === 0 ? pendingListings : historyListings).map((property) => {
                                const rawDateTime =
                                  property?.evaluationDateTime ||
                                  property?.updatedAt ||
                                  property?.createdAt
                                const date = rawDateTime
                                  ? new Date(rawDateTime)
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

                                let assignedTo = 'Super Admin'
                                const currentAssignee =
                                  property?.evaluator || property?.assignedTo
                                if (currentAssignee) {
                                  if (
                                    typeof currentAssignee === 'object' &&
                                    currentAssignee.name
                                  ) {
                                    assignedTo = currentAssignee.name
                                  } else if (typeof currentAssignee === 'string') {
                                    const found = subEvaluators.find(
                                      (ev) =>
                                        ev._id === currentAssignee ||
                                        ev.uuid === currentAssignee
                                    )
                                    if (found) assignedTo = found.name
                                  }
                                }

                                return (
                                  <tr key={property.uuid} className='border-t'>
                                    <td className='py-3 truncate px-4 capitalize'>
                                      {property.title}
                                    </td>
                                    <td className='py-3 truncate px-4'>
                                      {`${formattedDate} ${formattedTime}`}
                                    </td>
                                    {index === 0 ? (
                                      <>
                                        <td className='py-3 px-4'>
                                          <span className='inline-flex rounded bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-800'>
                                            Pending
                                          </span>
                                        </td>
                                        <td className='py-3 px-4'>
                                        <button
                                          type='button'
                                          aria-haspopup='menu'
                                          aria-expanded={
                                            openDropdown === property.uuid
                                          }
                                          onClick={(e) =>
                                            toggleActionMenu(e, property.uuid)
                                          }
                                          className='inline-flex h-9 w-9 items-center justify-center rounded-md text-blue-600 hover:bg-blue-50'
                                        >
                                          <SlArrowRight />
                                        </button>
                                        <EvaluationActionDropdown
                                          open={openDropdown === property.uuid}
                                          onClose={closeActionMenu}
                                          anchorRef={menuAnchorRef}
                                          className='w-44 min-w-[11rem]'
                                        >
                                          {isAssetAssignedToSubEvaluator(property) ? (
                                            <button
                                              type='button'
                                              onClick={() =>
                                                handleUnassignEvaluator(
                                                  property._id || property.uuid,
                                                )
                                              }
                                              className={evaluationMenuItemClass}
                                            >
                                              Unassign
                                            </button>
                                          ) : (
                                            <>
                                              <button
                                                type='button'
                                                onClick={() =>
                                                  setAssignDropdownOpen((prev) =>
                                                    prev === property.uuid
                                                      ? null
                                                      : property.uuid,
                                                  )
                                                }
                                                className={evaluationMenuItemClass}
                                              >
                                                Assign To
                                              </button>
                                              {assignDropdownOpen ===
                                                property.uuid && (
                                                  <div className='max-h-48 overflow-y-auto border-t border-gray-100'>
                                                    {subEvaluators.map(
                                                      (evaluator) => (
                                                        <button
                                                          key={
                                                            evaluator._id ||
                                                            evaluator.uuid
                                                          }
                                                          type='button'
                                                          onClick={() =>
                                                            handleAssignEvaluator(
                                                              property._id ||
                                                              property.uuid,
                                                              evaluator._id ||
                                                              evaluator.uuid,
                                                            )
                                                          }
                                                          className='flex justify-between items-center w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100'
                                                        >
                                                          <span>
                                                            {evaluator.name}
                                                          </span>
                                                        </button>
                                                      ),
                                                    )}
                                                  </div>
                                                )}
                                            </>
                                          )}
                                          <button
                                            type='button'
                                            onClick={() => {
                                              router.push(
                                                `/evaluator-profile/property-evaluation/${property.uuid}`,
                                              )
                                              closeActionMenu()
                                            }}
                                            className={evaluationMenuItemClass}
                                          >
                                            Evaluate
                                          </button>
                                        </EvaluationActionDropdown>
                                      </td>
                                      </>
                                    ) : (
                                      <>
                                        <td className='py-3 px-4'>
                                          {assignedTo}
                                        </td>
                                        <td className='py-3 px-4'>
                                          <button
                                            type='button'
                                            aria-haspopup='menu'
                                            aria-expanded={
                                              openDropdown === property.uuid
                                            }
                                            onClick={(e) =>
                                              toggleActionMenu(e, property.uuid)
                                            }
                                            className='inline-flex h-9 w-9 items-center justify-center rounded-md text-xl leading-none text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                                          >
                                            ⋯
                                          </button>
                                          <EvaluationActionDropdown
                                            open={openDropdown === property.uuid}
                                            onClose={closeActionMenu}
                                            anchorRef={menuAnchorRef}
                                          >
                                            <button
                                              type='button'
                                              onClick={() => {
                                                handleShowCertificate(
                                                  property?.uuid,
                                                )
                                                closeActionMenu()
                                              }}
                                              className={evaluationMenuItemClass}
                                            >
                                              Show Evaluation Certificate
                                            </button>
                                            <button
                                              type='button'
                                              onClick={() => {
                                                router.push(
                                                  userRole === 'Evaluator'
                                                    ? `/evaluator-profile/property-evaluation/${property?.uuid}`
                                                    : `/sub-evaluator-profile/property-evaluation/${property?.uuid}`,
                                                )
                                                closeActionMenu()
                                              }}
                                              className={evaluationMenuItemClass}
                                            >
                                              View Full Details
                                            </button>
                                          </EvaluationActionDropdown>
                                        </td>
                                      </>
                                    )}
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
                            />
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        fileUrl={certificateUrl}
      />
    </>
  )
}
