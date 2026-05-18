'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfile } from '../../context/UserContext'


const SMBSidebar = ({ selectedTab, setSelectedTab, setIsSidebarOpen }) => {
  const { logout } = useProfile()
  const tabs = [
    {
      iconActive: '/icons/appointment.png',
      iconInactive: '/icons/appointment.png',
      name: 'Manage Appointment',
      link: '/3d-walkthrough/',
    },
    // {
    //   iconActive: "/icons/appointmentList.svg",
    //   iconInactive: "/icons/appointmentList.svg",
    //   name: "Appointment List",
    //   link: "/3d-walkthrough/",
    // },
    {
      iconActive: '/icons/appointmentList.svg',
      iconInactive: '/icons/appointmentList.svg',
      name: 'Create 3D walkThrough slots',
      link: '/3d-walkthrough/create-slot',
    },
    {
      iconActive: '/icons/appointmentList.svg',
      iconInactive: '/icons/appointmentList.svg',
      name: 'Prices',
      link: '/3d-walkthrough/price',
    },
    // {
    //   iconActive: '/icons/appointmentList.svg',
    //   iconInactive: '/icons/appointmentList.svg',
    //   name: 'Upload a 3D walkthrough',
    //   link: '/3d-walkthrough/upload-walkthrough',
    // },
  ]


  const [selectedTabIdx, setSelectedTabIdx] = useState(
    tabs.findIndex((tab) => tab.name === selectedTab)
  )

  const handleTabClick = (name, index) => {
    setSelectedTab(name)
    setSelectedTabIdx(index)
  }

  return (
    <div className='w-full flex flex-col justify-between bg-prussianBlue h-screen overflow-y-auto hide-scrollbar py-6'>
      <div className=''>
        <div className='flex relative justify-between w-full items-start px-5'>
          <Link
            href='/'
            className='text-white font-bold flex gap-3 w-[70%] items-center text-lg pb-5'
          >
            <Image
              src='/assets/images/smb.png'
              width={150}
              height={50}
              alt='Logo'
            />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='text-base lg:hidden block text-white'
          >
            x
          </button>
        </div>

        <div className=' w-[80%] xl:w-full flex flex-col gap-3 py-5 text-base'>
          <p className='text-white font-semibold px-5'>Menu</p>

          <nav className='flex flex-col gap-2 px-3' aria-label='Tabs'>
            {tabs.map((tab, i) => (
              <Link
                href={tab.link}
                key={tab.name}
                className={`${
                  i === selectedTabIdx
                    ? 'bg-whiteSmoke text-prussianBlue font-medium focus:outline-none'
                    : 'border-transparent text-white'
                } whitespace-nowrap flex gap-2 xl:gap-5 items-center text-xs xl:text-sm py-2 px-3 cursor-pointer rounded-md`}
                onClick={() => handleTabClick(tab.name, i)}
              >
                <Image
                  src={i === selectedTabIdx ? tab.iconInactive : tab.iconActive}
                  height={18}
                  width={18}
                  alt={tab.name}
                />
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className='w-[65%] font-semibold text-prussianBlue border-t border-[#D0D5DD] py-5 m-5 flex flex-col gap-3'>
        <button
          onClick={() => logout()}
          className='text-sm flex gap-2 items-center mt-4 py-2 justify-center px-5 rounded-md bg-white'
        >
          <img src='/icons/LeftIcon.png' alt='Logout Icon' /> Logout
        </button>
      </div>
    </div>
  )
}

export default SMBSidebar
