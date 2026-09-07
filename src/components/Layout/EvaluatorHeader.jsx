'use client'
import Image from 'next/image'
import React, { Fragment, useEffect, useState } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { ProfileDropDownIcon } from '../Icons'
import Link from 'next/link'
import { useProfile } from '../../context/UserContext'
import Sidebar from '../Sidebar/Sidebar'
import NotificationDropdown from '../Buttons/Notifications'

const EvaluatorHeader = () => {
  const { user, fetchProfile, logout } = useProfile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  useEffect(() => {
    fetchProfile()
  }, [])
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className='border-b bg-white border-gray-600'>
      <header className='!p-2 sm:!p-3 theme-container flex justify-between items-center sm:gap-4'>
        <Link href='/'>
          <figure className='cursor-pointer h-[50px] w-[50px] sm:h-[60px] sm:w-[65px] md:h-[75px] md:w-[78px]'>
            <Image
              src='/assets/images/logo.svg'
              height={30}
              width={30}
              alt='Logo'
              className='h-full w-full object-contain'
            />
          </figure>
        </Link>

        <div className='flex items-center gap-4 sm:gap-8'>
          <NotificationDropdown />
          <Menu as='div' className='relative text-left z-100'>
            <Menu.Button className='btn !min-w-max flex items-center gap-2'>
              <div className='xl:block hidden'>
                <h2 className='text-prussianBlue capitalize text-xs font-semibold break-words text-left max-w-[220px]'>
                  {user?.displayName || user?.name || 'Loading...'}
                </h2>
                <span className='text-prussianBlue text-[10px] block text-start'>
                  {user?.role}
                </span>
              </div>
              <div className='xl:block hidden'>
                <ProfileDropDownIcon />
              </div>
            </Menu.Button>
            <div className='xl:block hidden'>
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
                    <li onClick={() => logout()} className='px-3 py-2'>
                      Sign Out
                    </li>
                  </ul>
                </Menu.Items>
              </Transition>
            </div>
          </Menu>
          <button
            onClick={toggleSidebar}
            className='btn xl:hidden !min-w-max flex items-center gap-2'
          >
            <ProfileDropDownIcon />
          </button>
          {/* SellerProfileSidebar */}
          {isSidebarOpen && (
            <div className='fixed inset-0  bg-opacity-50 z-50'>
              <div className='fixed inset-y-0 left-0 overflow-y-auto bg-white custom-shadow z-60 transform transition-transform'>
                <Sidebar />
                <button
                  onClick={toggleSidebar}
                  className='absolute text-prussianBlue top-4 right-4 text-gray-500'
                >
                  x
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}
export default EvaluatorHeader
