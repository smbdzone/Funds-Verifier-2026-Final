'use client'
import Image from 'next/image'
import React, { Fragment, useState, useEffect } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { NotificationIcon, ProfileDropDownIcon } from '../Icons'
import Link from 'next/link'
import axios from 'axios' // Make sure axios is imported
import { usePathname } from 'next/navigation'
import customAxios from '@/utils/apis/apis'

const AdminHeader = () => {
  const router = usePathname()
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false)
  const [propertyListings, setPropertyListings] = useState([])

  const handleNotificationClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
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

  useEffect(() => {
    fetchListingsData()
  }, [])

  const renderPropertyListings = () => {
    return propertyListings.map((item) => {
      const createdAt = new Date(item.createdAt)
      const currentTime = new Date()
      const timeDifference = Math.abs(currentTime - createdAt) / 36e5 // Difference in hours

      return (
        <div key={item.uuid} className='property-item'>
          {timeDifference <= 5 && item.status === 0 && (
            <div>
              <p>Property Add request: {item.title}</p>
              <button
                className='text-sm py-2.5 px-5 border-2 rounded-md text-white primary-gradient'
                onClick={() => handleApprove(item.uuid)}
              >
                Approve
              </button>
            </div>
          )}
        </div>
      )
    })
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

  return (
    <div className='border-b bg-white border-gray-600'>
      <header className='!p-2 sm:!p-3 theme-container flex justify-between items-center sm:gap-4'>
        <Link href='/'>
          <div className='flex items-center '>
            <figure className='cursor-pointer'>
              <Image
                src='/assets/images/logo.svg'
                height={75}
                width={78}
                alt='Logo'
              />
            </figure>
            <h2 className='text-lg md:text-xl lg:text-2xl font-medium pl-2 text-dark-blue'>
              Funds Verifier
            </h2>
          </div>
        </Link>
        <h2 className='text-lg md:text-xl lg:text-2xl font-medium pl-2 text-dark-blue'>
          Admin Evaluator Dashboard
        </h2>
        <div className='flex items-center gap-4 sm:gap-8'>
          <Menu as='div' className='relative text-left z-100'>
            <Menu.Button
              onClick={handleNotificationClick}
              className='btn !min-w-max flex items-center gap-2'
            >
              <NotificationIcon className='text-dark-blue' />
            </Menu.Button>
            <Transition
              as={Fragment}
              show={isNotificationDropdownOpen}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute cursor-pointer z-50 right-0 w-[300px] bg-white custom-shadow rounded-lg'>
                <div className='py-4 px-6'>
                  <h3 className='text-xl font-semibold mb-4'>
                    Property Listings+++
                  </h3>
                  <div>{renderPropertyListings()}</div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu as='div' className='relative text-left z-100'>
            <Menu.Button className='btn !min-w-max flex items-center gap-2'>
              <figure>
                <Image
                  src='/evaluator.png'
                  alt='Profile'
                  height={57}
                  width={57}
                  className='mb-5 rounded-full bottom-0'
                />
              </figure>
              <div>
                <h2 className='text-prussianBlue text-xs font-semibold'>
                  John Smith
                </h2>
                <span className='text-prussianBlue text-[10px] block text-start'>
                  Deal Hunter
                </span>
              </div>
              <ProfileDropDownIcon />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute cursor-pointer z-50 right-0 w-[87px] origin-top-right bg-white custom-shadow rounded-lg'>
                <ul className='text-prussianBlue text-xs'>
                  <Link href='#'>
                    <li className='px-3 py-2'>Sign Out</li>
                  </Link>
                </ul>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
    </div>
  )
}

export default AdminHeader
