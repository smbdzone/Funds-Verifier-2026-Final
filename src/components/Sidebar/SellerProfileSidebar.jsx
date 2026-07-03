'use client'
import {
  PrimaryDocument,
  PrimaryElectronic,
  DropIcon,
  PrimaryListing,
  PrimaryLogout,
  PrimaryProfile,
  PrimaryProtocol,
  PrimarySale,
} from '@/components/Icons'
import { FaStreetView } from 'react-icons/fa6'
import ProfileImage from '@/components/Avator/ProfileImage'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProfile } from '../../context/UserContext'

const SellerProfileSidebar = () => {
  const { user, fetchProfile, logout, switchUserRole } = useProfile()
  const [isSwitchingRole, setIsSwitchingRole] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])
  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(2).fill(false))

  const path = usePathname()

  // Toggle dropdown on parent tab click
  const handleDropdownToggle = (index) => {
    setIsDropdownOpen((prevState) =>
      prevState.map((isOpen, idx) => (idx === index ? !isOpen : false))
    )
  }

  // Handle tab change within dropdown
  const handleDropdownTabClick = (dropdownIdx, check) => {
    if (check) {
      setIsDropdownOpen((prevState) =>
        prevState.map((isOpen, idx) => (idx === dropdownIdx ? false : isOpen))
      )
    }
  }

  const tabs = [
    {
      icon: <PrimaryProfile />,
      name: 'My Profile',
      link: '/seller-profile/edit-profile',
    },
    {
      icon: <PrimaryListing />,
      name: 'My Listings',
      dropdown: [
        { name: 'All Listings', link: '/seller-profile/my-listing' },
        {
          name: 'Pending Evaluations',
          link: '/seller-profile/pending-evaluation',
        },
      ],
    },
    {
      icon: <FaStreetView />,
      name: 'Arrange Viewing',
      dropdown: [
        {
          name: 'Create Viewing Slots',
          link: '/seller-profile/create-slot',
        },
        {
          name: 'All Viewing Requests',
          link: '/seller-profile/all-slot',
        },
      ],
    },
    {
      icon: <PrimaryProtocol />,
      name: 'Confidentiality and Protocol',
      link: '/seller-profile/confidentiality-protocol',
    },
    {
      icon: <PrimaryElectronic />,
      name: 'Electronic Consent',
      link: '/seller-profile/electronic-consent',
    },
    {
      icon: <PrimaryDocument />,
      name: 'Document Management',
      link: '/seller-profile/documents-storage',
    },
    {
      icon: <PrimaryDocument />,
      name: 'Invoices',
      link: '/seller-profile/invoices',
    },
    {
      icon: <PrimarySale />,
      name: 'Sale Tracker',
      link: '/seller-profile/sale-tracker',
    },
    {
      icon: <PrimaryDocument />,
      name: 'Installment Payments',
      link: '/seller-profile/installment-payments',
    },
    // { icon: <PrimaryLogout />, name: "Sign Out", link: "/" },
  ]

  return (
    <div className='mt-5 xl:mt-0 !py-8 flex flex-col md:flex-row gap-7'>
      <div className='flex flex-col gap-7'>
        <div className='px-4 xl:px-0'>
          <div className='custom-shadow flex justify-center items-center flex-col py-6 lg:rounded'>
            <figure>
              <ProfileImage
                src={user?.profileImage}
                alt='Profile'
                height={184}
                width={184}
                className='mb-5 rounded-full'
              />
            </figure>
            <h1
              className='text-prussianBlue capitalize font-semibold md:text-xl text-lg lg:text-3xl break-words text-center max-w-full px-2'
            >
              {user?.displayName || user?.name || 'Loading...'}
            </h1>

            <h2 className='lg:text-2xl md:text-lg text-base text-prussianBlue mb-3'>
              {user?.role}
            </h2>
          </div>
        </div>
        <div className='flex flex-col xl:shadow rounded py-5'>
          <div>
            <nav className='flex flex-col' aria-label='Tabs'>
              {tabs.map((tab, i) =>
                tab.dropdown ? (
                  <div key={tab.name + i} className='relative'>
                    <div
                      className={`${tab.link === path
                        ? 'bg-whiteSmoke font-medium focus:outline-none'
                        : 'border-transparent'
                        } whitespace-nowrap flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-base text-sm lg:text-xl`}
                      onClick={() => handleDropdownToggle(i - 1)} // Adjust index for dropdown tracking
                    >
                      {tab.icon}
                      {tab.name}
                      <span className='ml-auto'>
                        <DropIcon />
                      </span>
                    </div>

                    {isDropdownOpen[i - 1] && (
                      <div className='bg-whiteSmoke w-full rounded-md'>
                        {tab.dropdown.map((item, idx) => (
                          <div key={item.name + idx}>
                            <Link href={`${item.link}`}>
                              <div
                                key={idx}
                                className='block py-2 px-14 text-black cursor-pointer'
                                onClick={() =>
                                  handleDropdownTabClick(
                                    i - 1,
                                    item.link === path
                                  )
                                }
                              >
                                {item.name}
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href={`${tab.link}`}>
                      <button
                        type='button'
                        key={tab.name}
                        className={`${tab.link === path
                          ? 'bg-whiteSmoke text-prussianBlue w-full font-medium focus:outline-none'
                          : 'border-transparent'
                          } whitespace-nowrap w-full flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-xl`}
                      >
                        {tab.icon}
                        {tab.name}
                      </button>
                    </Link>
                  </>
                )
              )}
              <div className='xl:hidden'>
                <ul className='text-prussianBlue text-xs'>
                  {user && user.role === 'AssetHolder' ? (
                    <li
                      onClick={async () => {
                        if (isSwitchingRole) return
                        await switchUserRole('DealHunter')
                      }}
                      className={`pl-10 text-lg py-2 flex items-center gap-2 cursor-pointer ${isSwitchingRole ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      <PrimaryProfile />
                      {isSwitchingRole
                        ? 'Switching...'
                        : 'Switch to Deal Hunter'}
                    </li>
                  ) : (
                    user &&
                    user.role === 'DealHunter' && (
                      <li
                        onClick={async () => {
                          if (isSwitchingRole) return
                          await switchUserRole('AssetHolder')
                        }}
                        className={`pl-10 text-lg py-2 flex items-center gap-2 cursor-pointer ${isSwitchingRole ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <PrimaryProfile />
                        {isSwitchingRole
                          ? 'Switching...'
                          : 'Switch to Asset Holder'}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className='whitespace-nowrap flex gap-3 items-center py-2 px-10 cursor-pointer sm:text-base text-sm lg:text-xl'>
                <button
                  onClick={() => logout()}
                  className='flex items-center space-x-2'
                >
                  <span>
                    <PrimaryLogout />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {isSwitchingRole && (
        <div className='fixed inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-[9999]'>
          <div className='animate-spin rounded-full h-10 w-10 border-4 border-reefGold border-t-transparent mb-3'></div>
          <p className='text-reefGold text-sm font-medium'>Switching role...</p>
        </div>
      )}
    </div>
  )
}

export default SellerProfileSidebar
