"use client";
import { useState, useEffect } from "react";
import customAxios from "@/utils/apis/apis";
import { useRouter } from "next/navigation";
import { SlArrowRight } from "react-icons/sl";
import { SearchIcon } from "../../../components/Icons";
import { Disclosure } from "@headlessui/react";
import { OpenDisclosure, CloseDisclosure } from "@/components/Icons";
import useDebounce from "../../../hooks/useDebounce";
import Modal from "../../documents/modal";
import { toast } from "react-toastify";
import { getTokenFromCookie } from "@/utils/helper";
import { getListingDocumentSrc } from "@/libs/listingCardMedia";

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
  const router = useRouter()

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
      const token =  getTokenFromCookie()    
        

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
      setAssignDropdownOpen(null)
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
    setOpenDropdown(null)
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
                                        <div className='relative inline-block text-left'>
                                          <button
                                            onClick={() =>
                                              setOpenDropdown((prev) =>
                                                prev === property.uuid
                                                  ? null
                                                  : property.uuid
                                              )
                                            }
                                            className='flex items-center text-blue-600'
                                          >
                                            <SlArrowRight />
                                          </button>
                                          {openDropdown === property.uuid && (
                                            <div className='absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg'>
                                              <button
                                                onClick={() =>
                                                  setAssignDropdownOpen(
                                                    (prev) =>
                                                      prev === property.uuid
                                                        ? null
                                                        : property.uuid
                                                  )
                                                }
                                                className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                                              >
                                                Assign To
                                              </button>
                                              {assignDropdownOpen ===
                                                property.uuid && (
                                                <div className='absolute left-full top-0 ml-2 w-44 rounded-md h-80 bg-white border border-gray-300 shadow-md z-20'>
                                                  <div className='max-h-80 overflow-y-auto'>
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
                                                            key={evaluator._id || evaluator.uuid}
                                                            onClick={() =>
                                                              handleAssignEvaluator(
                                                                property._id || property.uuid,
                                                                evaluator._id || evaluator.uuid
                                                              )
                                                            }
                                                            className='flex justify-between items-center w-full px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100'
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
                                                      }
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                              <button
                                                onClick={() => {
                                                  router.push(
                                                    `/evaluator-profile/jewellery-evaluation/${property.uuid}`
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
                                    ) : (
                                      <>
                                        <td className='py-3 px-4'>
                                          {assignedTo}
                                        </td>
                                        <td className='py-3 px-4'>
                                          <div className='relative inline-block text-left'>
                                            <button
                                              onClick={() =>
                                                setOpenDropdown((prev) =>
                                                  prev === property.uuid
                                                    ? null
                                                    : property.uuid
                                                )
                                              }
                                              className='text-2xl text-gray-600 hover:text-gray-800'
                                            >
                                              ⋯
                                            </button>
                                            {openDropdown === property.uuid && (
                                              <div className='absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg'>
                                                <button
                                                  onClick={() =>
                                                    handleShowCertificate(
                                                      property.uuid
                                                    )
                                                  }
                                                  className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                                                >
                                                  Show Evaluation Certificate
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    router.push(
                                                      `/evaluator-profile/jewellery-evaluation/${property.uuid}`
                                                    )
                                                    setOpenDropdown(null)
                                                  }}
                                                  className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                                                >
                                                  View Full Details
                                                </button>
                                              </div>
                                            )}
                                          </div>
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
