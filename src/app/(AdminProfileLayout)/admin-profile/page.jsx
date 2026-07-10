'use client'
import Image from 'next/image'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Edit, DeleteIcon } from '@/components/Icons'
import { EvaluatorProfileTab } from '@/components/modules/Adminprofile/EvaluatorProfileTab'
import { PropertyEvaluationTab } from '@/components/modules/Adminprofile/PropertyEvaluationTab'
import { CarsEvaluationTab } from '@/components/modules/Adminprofile/CarsEvaluationTab'
import { BoatEvaluationTab } from '@/components/modules/Adminprofile/BoatEvaluationTab'
import { JewelleryEvaluationTab } from '@/components/modules/Adminprofile/JewelleryEvaluationTab'
import { EvaluationTab } from '@/components/modules/Adminprofile/EvaluationTab'
import { TransactionTrackerTab } from '@/components/modules/Adminprofile/TransactionTrackerTab'
import { ClosedCaseTab } from '@/components/modules/Adminprofile/ClosedCaseTab'
import { AssignRoleTab } from '@/components/modules/Adminprofile/AssignRoleTab'
import { ReviewsManagementTab } from '@/components/modules/Adminprofile/ReviewsManagementTab'
import {
  PrimaryLogout,
  PrimaryAssignIcon,
  PrimaryAssetDocument,
  DropIcon,
  PrimarySecurity,
  PrimaryProfile,
} from '@/components/Icons'
import Modal from '@/components/Avator/Modal'
import customAxios from '@/utils/apis/apis'

export default function Admin({
  initialTabIdx = 0,
  initialDropdownTab = null,
}) {
  const [selectedTabIdx, setSelectedTabIdx] = useState(initialTabIdx)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedDropdownTab, setSelectedDropdownTab] =
    useState(initialDropdownTab)
  const [showModal, setShowModal] = useState(false)
  const [profileImage, setProfileImage] = useState('')
  const [propertyListings, setPropertyListings] = useState([])

  const handleDropdownToggle = (index) => {
    setIsDropdownOpen((prevIndex) => (prevIndex === index ? null : index))
  }
  const handleDropdownTabClick = (index) => {
    setSelectedDropdownTab(index)
    setIsDropdownOpen(false)
  }

  // Get profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/get`
        )
        setProfileImage(response.data.profileImage)
      } catch (error) {
        console.error('Error fetching profile image:', error)
      }
    }

    fetchProfileImage()
  }, [])

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSaveImage = (newImage) => {
    if (newImage) {
      setProfileImage(newImage)
    }
  }

  const fetchListingsData = async () => {
    try {
      const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
        await Promise.all([
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/boat`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/property`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/car`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`),
        ])

      setPropertyListings(propertyResponse.data)
    } catch (error) {
      console.error('Error fetching listing data:', error)
    }
  }

  const handleApprove = async (itemId) => {
    try {
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${itemId}`,
        { status: 1 }
      )
      setPropertyListings((prevListings) =>
        prevListings.map((item) =>
          item.uuid === itemId ? { ...item, status: 1 } : item
        )
      )
    } catch (error) {
      console.error('Error approving item:', error)
    }
  }

  useEffect(() => {
    fetchListingsData()
  }, [])

  const tabs = [
    {
      icon: <PrimaryProfile />,
      name: 'Evaluator Profile',
      index: 0,
    },
    {
      icon: <PrimaryAssignIcon />,
      name: 'Assign Role',
      index: 1,
    },
    {
      icon: <PrimaryAssetDocument />,
      name: 'Closed Case',
      index: 2,
    },
    {
      icon: <PrimaryAssetDocument />,
      name: 'Transaction Tracker',
      index: 3,
    },
    {
      icon: <PrimaryAssetDocument />,
      name: 'Asset Evaluation',
      index: 4,
      dropdown: [
        {
          name: 'Property Evaluation',
          index: 5,
        },
        {
          name: 'Cars Evaluation',
          index: 6,
        },
        {
          name: 'Boat Evaluation',
          index: 7,
        },
        {
          name: 'Jewellery Evaluation',
          index: 8,
        },
      ],
    },
    {
      icon: <PrimaryAssetDocument />,
      name: 'Reviews',
      index: 11,
    },
    {
      icon: <PrimarySecurity />,
      name: 'Security',
      index: 9,
    },
    {
      icon: <PrimaryLogout />,
      name: 'Sign Out',
      index: 10,
    },
  ]

  return (
    <>
      <div className='theme-container !py-8 flex flex-col md:flex-row gap-7'>
        <div className='flex flex-col gap-7 m:min-w-[385px]'>
          <div className='custom-shadow flex justify-center items-center flex-col py-6 rounded cursor-pointer relative'>
            <figure className='bg-whiteSmoke rounded-full h-[130px] w-[130px] relative'>
              {profileImage && (
                <Image
                  src={profileImage}
                  alt='Profile'
                  height={184}
                  width={184}
                  className='mb-5 rounded-full bottom-0'
                />
              )}
            </figure>
            <div
              className='absolute flex pt-2 pb-1 bg-white/60 gap-6 justify-center w-full bottom-1'
              style={{ marginBottom: '120.5px' }}
            >
              <button className='pb-3' onClick={openModal}>
                <Edit />
              </button>
              <button className='pb-3'>
                <DeleteIcon />
              </button>
            </div>
            <h1 className='text-prussianBlue font-semibold text-3xl'>
              Evaluator
            </h1>
            <h2 className='text-2xl text-prussianBlue mb-3'>
              Super Admin Bilal
            </h2>
          </div>
          <div className='flex flex-col custom-shadow rounded py-5'>
            <div>
              <nav className='flex flex-col' aria-label='Tabs'>
                {tabs.map((tab, i) =>
                  tab.dropdown ? (
                    <div key={tab.name} className='relative'>
                      <div
                        className={`${i === selectedTabIdx
                            ? 'bg-whiteSmoke font-medium focus:outline-none'
                            : 'border-transparent'
                          } whitespace-nowrap flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-xl`}
                        onClick={() => {
                          setSelectedTabIdx(i)
                          handleDropdownToggle()
                        }}
                      >
                        {tab.icon}
                        {tab.name}
                        <span className='ml-auto'>
                          <DropIcon />
                        </span>
                      </div>
                      {isDropdownOpen && (
                        <div className='bg-whiteSmoke rounded-md'>
                          {tab.dropdown.map((item, idx) => (
                            <div
                              key={idx}
                              className='block py-2 px-14 text-black hover:bg-white cursor-pointer'
                              onClick={() => handleDropdownTabClick(item.index)}
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      key={tab.name}
                      className={`${i === selectedTabIdx
                          ? 'bg-whiteSmoke text-prussianBlue font-medium focus:outline-none'
                          : 'border-transparent'
                        } whitespace-nowrap flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-xl`}
                      onClick={() => {
                        setSelectedTabIdx(i)
                        setSelectedDropdownTab(null)
                      }}
                    >
                      {tab.icon}
                      {tab.name}
                    </div>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className='grow'>
          {selectedTabIdx === 0 && <EvaluatorProfileTab />}
          {selectedTabIdx === 1 && <AssignRoleTab />}
          {selectedTabIdx === 2 && <ClosedCaseTab />}
          {selectedTabIdx === 3 && <TransactionTrackerTab />}
          {selectedTabIdx === 4 && <EvaluationTab />}
          {selectedDropdownTab === 5 && <PropertyEvaluationTab />}
          {selectedDropdownTab === 6 && <CarsEvaluationTab />}
          {selectedDropdownTab === 7 && <BoatEvaluationTab />}
          {selectedDropdownTab === 8 && <JewelleryEvaluationTab />}
          {selectedTabIdx === 5 && <ReviewsManagementTab />}
        </div>
        <Modal show={showModal} onClose={closeModal} onSave={handleSaveImage} />
      </div>
    </>
  )
}
