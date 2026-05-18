'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  DealIcon,
  DocumentsIcon,
  ElectronicIcon,
  ProfileIcon,
  ProtocolIcon,
  PurchaseIcon,
  PrimaryLogout,
} from '@/components/Icons'

import { usePathname } from 'next/navigation'
import { useProfile } from '../../context/UserContext'
import { useEffect, useState } from 'react'

const ProfileSidebar = ({ children }) => {
  const { user, fetchProfile, logout, switchUserRole } = useProfile()
  const [isSwitchingRole, setIsSwitchingRole] = useState(false)
  useEffect(() => {
    fetchProfile()
  }, [])

  const tabs = [
    { icon: <ProfileIcon />, name: 'Profile', link: '/profile' },
    {
      icon: <DealIcon />,
      name: 'Deal Preference',
      link: '/profile/deal-preference',
    },
    {
      icon: <ProtocolIcon />,
      name: 'Confidentiality and Protocol',
      link: '/profile/confidentiality-protocol',
    },
    {
      icon: <ElectronicIcon />,
      name: 'Electronic Consent',
      link: '/profile/electronic-consent',
    },
    {
      icon: <DocumentsIcon />,
      name: 'Documents Storage',
      link: '/profile/documents-storage',
    },
    {
      icon: <PurchaseIcon />,
      name: 'Purchase Tracker',
      link: '/profile/purchase-tracker',
    },
  ]

  const path = usePathname()

  return (
    <div className='mt-5 xl:mt-0 !py-8 flex flex-col md:flex-row gap-7'>
      <div className='flex flex-col gap-7'>
        <div className='px-4 xl:px-0'>
          <div className='custom-shadow flex justify-center items-center flex-col py-6 rounded'>
            <figure>
              <Image
                src={user?.profileImage || '/assets/images/dummy-profile.png'}
                alt='Profile'
                height={184}
                width={184}
                className='mb-5 rounded-full'
              />
            </figure>
            <h1
              className='text-prussianBlue capitalize font-semibold md:text-xl text-lg lg:text-3xl truncate max-w-[300px]'
              title={user?.name} // shows full name on hover
            >
              {user?.name || 'Loading...'}
            </h1>
            <h2 className='text-prussianBlue mb-3 lg:text-2xl md:text-lg text-base'>
              {user?.role}
            </h2>
          </div>
        </div>
        <div className='flex flex-col xl:shadow rounded py-5'>
          <div>
            <nav className='flex flex-col justify-start' aria-label='Tabs'>
              {tabs.map((tab, i) => (
                <Link
                  href={tab.link}
                  key={tab.name}
                  className={`${
                    tab.link === path
                      ? '  bg-whiteSmoke text-reefGold font-medium focus:outline-none '
                      : 'border-transparent'
                  } whitespace-nowrap flex gap-3 items-center py-2 px-8 cursor-pointer sm:text-base text-sm lg:text-xl`}
                >
                  {tab.icon}
                  {tab.name}
                </Link>
              ))}
              <div className='xl:hidden'>
                <ul className='text-prussianBlue text-xs'>
                  {user && user.role === 'AssetHolder' ? (
                    <li
                      onClick={async () => {
                        if (isSwitchingRole) return
                        await switchUserRole('DealHunter')
                      }}
                      className={`pl-10 text-lg py-2 flex items-center gap-2 cursor-pointer ${
                        isSwitchingRole ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ProfileIcon />
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
                        className={`pl-10 text-lg py-2 flex items-center gap-2 cursor-pointer ${
                          isSwitchingRole ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <ProfileIcon />
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

export default ProfileSidebar
