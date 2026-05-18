import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Disclosure } from '@headlessui/react'
import {
  OpenDisclosure,
  CloseDisclosure,
  DropIcon,
  Download3Icon,
  MessageIcon,
  GreenTickIcon,
  OrangecrossIcon,
  RedcrossIcon,
  Orng2EyeIcon,
  RightArrowIcon,
  LeftArrowIcon,
} from '@/components/Icons'
// import { propertyTypes, tabs } from '@/constants/otherConstants'
import { getTokenFromCookie } from '@/utils/helper'
import { getCookie } from 'cookies-next'
import customAxios from '../../../utils/apis/apis'
import { useProfile } from '../../../context/UserContext'

// API service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const apiService = {
  // Get all trackers for a user
  getAllTrackers: async (userUUID) => {
    try {
      const response = await customAxios.get(
        `${API_BASE_URL}/transactions/tracker/user/${userUUID}`,
        {
          headers: {
            Authorization: `Bearer ${getTokenFromCookie()}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data // axios returns data directly
    } catch (error) {
      throw new Error('Failed to fetch trackers')
    }
  },

  // Get specific tracker by ID
  getTrackerById: async (trackerId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/transaction-tracker/${trackerId}`,
      {
        headers: {
          Authorization: `Bearer ${getTokenFromCookie()}`,
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) throw new Error('Failed to fetch tracker')
    return response.json()
  },

  // Create new tracker
  createTracker: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/transaction-tracker`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getTokenFromCookie()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create tracker')
    return response.json()
  },

  // Update tracker
  updateTracker: async (trackerId, data) => {
    const response = await fetch(
      `${API_BASE_URL}/api/transaction-tracker/${trackerId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getTokenFromCookie()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) throw new Error('Failed to update tracker')
    return response.json()
  },

  // Delete tracker
  deleteTracker: async (trackerId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/transaction-tracker/${trackerId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getTokenFromCookie()}`,
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) throw new Error('Failed to delete tracker')
    return response.json()
  },
}

export const TransactionTrackerTab = () => {
  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false)
  const [selectedTabIdx, setSelectedTabIdx] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const {user}=useProfile()

  // API State
  const [trackers, setTrackers] = useState([])
  const [currentTracker, setCurrentTracker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTrackerIndex, setCurrentTrackerIndex] = useState(0)

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    assetType: '',
    assetDescription: '',
    customerReferenceNumber: '',
  })

  const [userUUID, setuserUUID] = useState(null)

  useEffect(() => {
    const uid = user?.uuid
    if (uid) {
      setuserUUID(uid)
    }
  }, [])

  // Load trackers on component mount
  useEffect(() => {
   
      loadTrackers()
  }, [])

  // Update current tracker when trackers change
  useEffect(() => {
    if (trackers.length > 0) {
      setCurrentTracker(trackers[currentTrackerIndex])
    }
  }, [trackers, currentTrackerIndex])

  const loadTrackers = async () => {
    try {
      setLoading(true)
      setError(null)
  
      // ✅ get logged-in user from token
      const meRes = await customAxios.get('/user/me')
      const userUUID = meRes.data?.uuid
  
      if (!userUUID) {
        throw new Error('User not authenticated')
      }
  
      const response = await apiService.getAllTrackers(userUUID)
  
      setTrackers(response.trackers || [])
  
      if (response.trackers?.length > 0) {
        setCurrentTracker(response.trackers[0])
        setCurrentTrackerIndex(0)
      }
    } catch (err) {
      console.error('Error loading trackers:', err)
      setError('Failed to load transaction trackers')
    } finally {
      setLoading(false)
    }
  }
  

  const handleCreateTracker = async () => {
    try {
      const newTrackerData = {
        userUUID,
        customerName: formData.customerName,
        assetType: formData.assetType,
        assetDescription: formData.assetDescription,
        customerReferenceNumber: formData.customerReferenceNumber,
      }

      const response = await apiService.createTracker(newTrackerData)
      setTrackers([...trackers, response.tracker])
      setCurrentTracker(response.tracker)
      setCurrentTrackerIndex(trackers.length)

      // Reset form
      setFormData({
        customerName: '',
        assetType: '',
        assetDescription: '',
        customerReferenceNumber: '',
      })

      setShowModal(false)
    } catch (err) {
      console.error('Error creating tracker:', err)
      setError('Failed to create tracker')
    }
  }

  const handleUpdateTracker = async (updateData) => {
    if (!currentTracker) return

    try {
      const response = await apiService.updateTracker(
        currentTracker.uuid,
        updateData
      )
      const updatedTrackers = trackers.map((tracker) =>
        tracker.uuid === currentTracker.uuid ? response.tracker : tracker
      )
      setTrackers(updatedTrackers)
      setCurrentTracker(response.tracker)
    } catch (err) {
      console.error('Error updating tracker:', err)
      setError('Failed to update tracker')
    }
  }

  const handleStageUpdate = async (stageName, value) => {
    const updateData = {
      stages: {
        ...currentTracker.stages,
        [stageName]: value,
      },
    }

    // Update current stage based on the progression
    if (value) {
      const stageOrder = [
        'evaluationDocumentPending',
        'evaluationComplete',
        '_3dRequestsent',
        '_3dDone',
        'technicalReportRequestsent',
        'technicalReportDone',
        'trusteeContacted',
        'assetTransferred',
      ]

      const currentStageIndex = stageOrder.indexOf(stageName)
      if (currentStageIndex >= 0) {
        updateData.currentStage = stageOrder[currentStageIndex]
      }
    }

    await handleUpdateTracker(updateData)
  }

  const handleDocumentUpdate = async (documentId, updates) => {
    const updatedDocuments = currentTracker.documents.map((doc) =>
      doc.uuid === documentId ? { ...doc, ...updates } : doc
    )

    await handleUpdateTracker({ documents: updatedDocuments })
  }

  const navigateTrackers = (direction) => {
    if (direction === 'next' && currentTrackerIndex < trackers.length - 1) {
      setCurrentTrackerIndex(currentTrackerIndex + 1)
    } else if (direction === 'prev' && currentTrackerIndex > 0) {
      setCurrentTrackerIndex(currentTrackerIndex - 1)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <GreenTickIcon />
      case 'received':
        return <OrangecrossIcon />
      case 'pending':
        return <RedcrossIcon />
      default:
        return <RedcrossIcon />
    }
  }

  const getStageProgress = () => {
    if (!currentTracker) return 0

    const stages = currentTracker.stages
    const completedStages = Object.values(stages).filter(Boolean).length
    const totalStages = Object.keys(stages).length

    return (completedStages / totalStages) * 100
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const togglePropertyDropdown = () => {
    setIsPropertyDropdownOpen(!isPropertyDropdownOpen)
  }

  const handleAssetTypeSelect = (assetType) => {
    setFormData({ ...formData, assetType })
    setIsDropdownOpen(false)
    setIsPropertyDropdownOpen(false)
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg'>Loading transaction trackers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64'>
        <div className='text-red-500 mb-4'>{error}</div>
        <button
          onClick={loadTrackers}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <Modal show={showModal} onClose={handleCloseModal}>
        <div className='p-6'>
          <h2 className='text-xl font-bold mb-4'>
            Create New Transaction Tracker
          </h2>

          <div className='space-y-4'>
            <input
              type='text'
              placeholder='Customer Name'
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className='w-full p-3 border rounded-md'
            />

            <select
              value={formData.assetType}
              onChange={(e) =>
                setFormData({ ...formData, assetType: e.target.value })
              }
              className='w-full p-3 border rounded-md'
            >
              <option value=''>Select Asset Type</option>
              <option value='Property'>Property</option>
              <option value='Car'>Car</option>
              <option value='Jewelry'>Jewelry</option>
              <option value='Boat'>Boat</option>
            </select>

            <textarea
              placeholder='Asset Description'
              value={formData.assetDescription}
              onChange={(e) =>
                setFormData({ ...formData, assetDescription: e.target.value })
              }
              className='w-full p-3 border rounded-md h-24'
            />

            <input
              type='text'
              placeholder='Customer Reference Number'
              value={formData.customerReferenceNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerReferenceNumber: e.target.value,
                })
              }
              className='w-full p-3 border rounded-md'
            />

            <div className='flex justify-end space-x-3'>
              <button
                onClick={handleCloseModal}
                className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTracker}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Create Tracker
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <div className='flex justify-between items-center mb-4'>
        <span className='lg:text-lg sm:text-base text-sm text-prussianBlue/40'>
          Transaction Tracker
        </span>
        <button
          onClick={() => setShowModal(true)}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          New Tracker
        </button>
      </div>

      {trackers.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500 mb-4'>No transaction trackers found</p>
          {/* <button
            onClick={() => setShowModal(true)}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Create Your First Tracker
          </button> */}
        </div>
      ) : (
        <section className=''>
          <div className='custom-shadow rounded flex flex-col mb-8'>
            <Disclosure as='div' className='disclosure' defaultOpen={true}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`w-full primary-gradient rounded px-7 py-4 justify-between items-center flex ${
                      open && 'mb-3'
                    }`}
                  >
                    <span className='whitespace-nowrap lg:text-lg sm:text-base text-sm font-medium text-white'>
                      {currentTracker?.assetReferenceNumber ||
                        'Asset Reference Number'}
                    </span>
                    <span className='flex-shrink-0'>
                      {open ? (
                        <OpenDisclosure className='text-white' />
                      ) : (
                        <CloseDisclosure className='text-white' />
                      )}
                    </span>
                  </Disclosure.Button>

                  <Disclosure.Panel
                    as='div'
                    className='gap-4 md:px-8 sm:px-4 px-2'
                  >
                    <div className='gap-2 md:px-8 px-0 py-4 w-full'>
                      <div className='w-full space-y-5 md:flex gap-3 mb-4'>
                        <div className='bg-whiteSmoke w-full flex justify-between py-3 pl-5 rounded-md items-center'>
                          <p className='lg:text-lg sm:text-base text-sm'>
                            {currentTracker?.customerName || 'Customer Name'}
                          </p>
                          <span className='pr-5'>
                            <DropIcon />
                          </span>
                        </div>

                        <div className='bg-whiteSmoke w-full flex justify-between py-3 pl-5 rounded-md items-center'>
                          <p className='text-sm'>
                            {currentTracker?.assetType || 'Asset Type'}
                          </p>
                          <span className='pr-5'>
                            <DropIcon />
                          </span>
                        </div>
                      </div>

                      <div className='bg-whiteSmoke w-full mb-3 pl-5 pt-4 rounded-md pb-4'>
                        <p className='lg:text-lg sm:text-base text-sm'>
                          {currentTracker?.assetDescription ||
                            'Asset description'}
                        </p>
                      </div>

                      <div className='bg-whiteSmoke w-full flex justify-between py-4 pl-5 rounded-md items-center'>
                        <p className='text-sm'>
                          {currentTracker?.customerReferenceNumber ||
                            'Customer Reference Number'}
                        </p>
                      </div>
                    </div>
                  </Disclosure.Panel>

                  <Disclosure.Panel
                    as='div'
                    className='gap-4 md:px-8 sm:px-4 px-2'
                  >
                    <Disclosure
                      as='div'
                      className='disclosure'
                      defaultOpen={true}
                    >
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full bg-whiteSmoke text-sm rounded py-3 mb-2.5 px-7 gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='whitespace-nowrap lg:text-xl sm:text-lg text-base font-medium text-black/80'>
                              {currentTracker?.assetType || 'Asset Type'}
                            </span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-black/80' />
                              ) : (
                                <CloseDisclosure className='text-black/30' />
                              )}
                            </span>
                          </Disclosure.Button>

                          <div className='flex items-center justify-between w-full mb-10'>
                            <Disclosure.Panel
                              as='div'
                              className='gap-2 md:px-8 sm:px-4 px-2 flex items-center mb-2.5 justify-between w-full'
                            >
                              <div className='w-full text-center mb-2'>
                                <h2 className='lg:text-lg sm:text-base text-sm font-semibold'>
                                  Documents Received
                                </h2>
                              </div>
                            </Disclosure.Panel>
                          </div>

                          {currentTracker?.documents?.map((doc, i) => (
                            <div
                              key={doc.uuid || i}
                              className='flex md:items-center items-start justify-between w-full'
                            >
                              <Disclosure.Panel
                                as='div'
                                className='gap-2 md:px-8 sm:px-4 px-2 flex md:items-center items-start mb-2.5 justify-between w-full'
                              >
                                <div className='flex md:items-center items-start'>
                                  <span>{getStatusIcon(doc.status)}</span>
                                  <span className='text-black pl-4 sm:text-base text-sm'>
                                    {doc.name}
                                  </span>
                                </div>
                                <div className='flex gap-3'>
                                  {doc.url && (
                                    <span
                                      className='cursor-pointer'
                                      onClick={() =>
                                        window.open(doc.url, '_blank')
                                      }
                                    >
                                      <Orng2EyeIcon />
                                    </span>
                                  )}
                                  {doc.url && (
                                    <span
                                      className='cursor-pointer'
                                      onClick={() => {
                                        const a = document.createElement('a')
                                        a.href = doc.url
                                        a.download = ''
                                        a.click()
                                      }}
                                    >
                                      <Download3Icon />
                                    </span>
                                  )}
                                  <span>
                                    <MessageIcon />
                                  </span>
                                </div>
                              </Disclosure.Panel>
                            </div>
                          ))}

                          <div className='px-3'>
                            <Disclosure.Panel className='gap-2 pt-8 pb-20 mb-5'>
                              <div className='xl:h-[10px] xl:bg-gray relative rounded-full'>
                                <div
                                  className='flex xl:absolute flex-wrap xl:flex-nowrap gap-5 pl-6 -top-4 xl:justify-center xl:px-7 w-full'
                                  aria-label='Tabs'
                                >
                                  {tabs.map((tab, i) => {
                                    const isCompleted =
                                      currentTracker?.stages?.[tab.stageKey] ||
                                      false
                                    return (
                                      <div
                                        key={tab.name}
                                        onClick={() => setSelectedTabIdx(i)}
                                        className={`
                                          ${
                                            i === selectedTabIdx
                                              ? 'text-white'
                                              : 'bg-white text-black'
                                          } xl:bg-transparent xl:text-black  
                                          text-sm flex flex-col items-center cursor-pointer custom-shadow xl:shadow-none px-4 py-2 rounded-full font-medium text-center
                                        `}
                                      >
                                        <button
                                          onClick={() => {
                                            setSelectedTabIdx(i)
                                            if (tab.stageKey) {
                                              handleStageUpdate(
                                                tab.stageKey,
                                                !isCompleted
                                              )
                                            }
                                          }}
                                          className={`
                                            ${
                                              isCompleted
                                                ? 'border-4 border-prussianBlue'
                                                : 'border-4 border-light-blue bg-darkGray'
                                            }
                                            h-[26px] w-[27px] rounded-full cursor-pointer xl:flex justify-center items-center hidden
                                          `}
                                        >
                                          {isCompleted && (
                                            <span className='bg-light-gold h-5 w-5 rounded-full'></span>
                                          )}
                                        </button>
                                        <span className='text-center text-black'>
                                          {tab.name}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </Disclosure.Panel>
                          </div>
                        </>
                      )}
                    </Disclosure>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>

          <div className='flex gap-2 justify-end'>
            <button
              onClick={() => navigateTrackers('prev')}
              disabled={currentTrackerIndex === 0}
              className='bg-whiteSmoke md:px-5 px-2 py-2 rounded-md disabled:opacity-50'
            >
              <span>
                <LeftArrowIcon />
              </span>
            </button>
            <button
              onClick={() => navigateTrackers('next')}
              disabled={currentTrackerIndex === trackers.length - 1}
              className='bg-dark-blue md:px-5 px-2 py-2 rounded-md disabled:opacity-50'
            >
              <span className='h-5 w-5'>
                <RightArrowIcon height={20} width={20} />
              </span>
            </button>
          </div>

          {trackers.length > 1 && (
            <div className='text-center mt-4 text-sm text-gray-500'>
              Tracker {currentTrackerIndex + 1} of {trackers.length}
            </div>
          )}
        </section>  
      )}
    </>
  )
}
