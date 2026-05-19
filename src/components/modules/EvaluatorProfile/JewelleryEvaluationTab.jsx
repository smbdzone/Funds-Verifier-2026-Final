'use client'
import { useState, useEffect, useRef } from 'react'
import customAxios from '@/utils/apis/apis'
import { useRouter } from 'next/navigation'
import { SlArrowRight } from 'react-icons/sl'
import { SearchIcon } from '../../../components/Icons'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import useDebounce from '../../../hooks/useDebounce'
import Modal from '../../documents/modal'
import { toast } from 'react-toastify'
import { getTokenFromCookie } from '@/utils/helper'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import EvaluationActionDropdown, {
  evaluationMenuItemClass,
} from './requestCompoenets/EvaluationActionDropdown'

export const JewelleryEvaluationTab = () => {
  const [propertyListings, setPropertyListings] = useState([])
  const [subEvaluators, setSubEvaluators] = useState([])
  const [selected, setSelected] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [certificateUrl, setCertificateUrl] = useState('')
  const debouncedQuery = useDebounce(searchTerm, 500)
  const menuAnchorRef = useRef(null)
  const router = useRouter()

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
    try {
      const res = await customAxios.get(
        `/jewelry?sort=${selected}&title=${debouncedQuery}`
      );
      setPropertyListings(res.data.products.reverse());
    } catch (error) {
      console.error('Error fetching listings:', error)
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
      console.error('Error fetching evaluators:', error)
      alert('Failed to fetch evaluators')
    }
  }

  const handleAssignEvaluator = async (jewelleryId, evaluatorId) => {
    try {
      const meRes = await customAxios.get('/user/me') // token-based
      const parentId = meRes.data?._id

      if (!parentId) {
        toast.error('Unable to identify user. Please log in again.')
        return
      }
      const token = getTokenFromCookie()


      if (!token) {
        alert('Authentication token not found. Please log in again.')
        return
      }

      const requestData = {
        assetId: jewelleryId,
        assetType: 'jewelry',
        assigneeId: evaluatorId,
      }

      const response = await customAxios.post(
        `/assets/assign?userId=${parentId}`,
        requestData
      );

      alert('Evaluator assigned successfully')
      closeActionMenu()
      fetchListingsData()
    } catch (err) {
      console.error('Assignment error:', err.response?.data || err.message)
      alert(
        `Assignment failed: ${err.response?.data?.message || 'Unknown error'}`
      )
    }
  }

  const handleShowCertificate = async (jewelleryId) => {
    try {
      const res = await customAxios.get(`/jewelry/${jewelleryId}`);
      const cert = getListingDocumentSrc(res.data?.evaluationCertificate);
      if (cert) {
        setCertificateUrl(cert)
        setIsModalOpen(true)
      } else {
        alert('No evaluation certificate found for this jewellery.')
      }
    } catch (err) {
      console.error('Certificate fetch error:', err)
      alert('Failed to load evaluation certificate.')
    }
    closeActionMenu()
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCertificateUrl('')
  }

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
            >
              <img
                src='/icons/up-arrow.svg'
                className='h-8 w-5 sm:h-10 sm:w-7'
                alt='Descending'
              />
            </button>
            <button
              onClick={() => setSelected('createdAt')}
              title='Ascending Order'
            >
              <img
                src='/icons/up-arrow.svg'
                className='h-8 w-5 sm:h-10 sm:w-7 rotate-180'
                alt='Ascending'
              />
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
                        <table className='w-full text-sm sm:text-base bg-white'>
                          <thead>
                            <tr>
                              <th className='py-2 px-4 text-left'>Title</th>
                              <th className='py-2 px-4 text-left'>
                                Evaluation Date & Time
                              </th>
                              {index === 0 ? (
                                <th className='py-2 px-4 text-left'>Action</th>
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
                            {propertyListings
                              .filter((property) =>
                                index === 0
                                  ? property.status === 0 ||
                                  !('status' in property)
                                  : property.status === 1
                              )
                              .map((property) => {
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
                                    <td className='py-3 px-4 capitalize truncate'>
                                      {property.title}
                                    </td>
                                    <td className='py-3 px-4'>{`${formattedDate} ${formattedTime}`}</td>
                                    {index === 0 ? (
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
                                                  (evaluator) => {
                                                    const isAssigned =
                                                      property?.evaluator ===
                                                      evaluator.uuid ||
                                                      property?.evaluator ===
                                                      evaluator._id ||
                                                      property?.assignedTo ===
                                                      evaluator.uuid ||
                                                      property?.assignedTo ===
                                                      evaluator._id
                                                    return (
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
                                                        className='flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100'
                                                      >
                                                        <span>
                                                          {evaluator.name}
                                                        </span>
                                                        {isAssigned && (
                                                          <span className='text-green-500'>
                                                            ✔
                                                          </span>
                                                        )}
                                                      </button>
                                                    )
                                                  },
                                                )}
                                              </div>
                                            )}
                                          <button
                                            type='button'
                                            onClick={() => {
                                              router.push(
                                                `/evaluator-profile/jewellery-evaluation/${property.uuid}`,
                                              )
                                              closeActionMenu()
                                            }}
                                            className={evaluationMenuItemClass}
                                          >
                                            Evaluate
                                          </button>
                                        </EvaluationActionDropdown>
                                      </td>
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
                                              toggleActionMenu(
                                                e,
                                                property.uuid,
                                              )
                                            }
                                            className='inline-flex h-9 w-9 items-center justify-center rounded-md text-xl leading-none text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                                          >
                                            ⋯
                                          </button>
                                          <EvaluationActionDropdown
                                            open={
                                              openDropdown === property.uuid
                                            }
                                            onClose={closeActionMenu}
                                            anchorRef={menuAnchorRef}
                                          >
                                            <button
                                              type='button'
                                              onClick={() =>
                                                handleShowCertificate(
                                                  property.uuid,
                                                )
                                              }
                                              className={evaluationMenuItemClass}
                                            >
                                              Show Evaluation Certificate
                                            </button>
                                            <button
                                              type='button'
                                              onClick={() => {
                                                router.push(
                                                  `/evaluator-profile/jewellery-evaluation/${property.uuid}`,
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
