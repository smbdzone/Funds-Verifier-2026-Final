'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfile } from '../../context/UserContext'

const SurveyorSidebar = ({ selectedTab, setSelectedTab, setIsSidebarOpen }) => {
  const { logout } = useProfile()
  const tabs = [
    {
      iconActive: '/icons/surveySidebar/reportWhite.png',
      iconInactive: '/icons/surveySidebar/reportBlue.png',
      name: 'Requested Reports',
      link: '/survey-dashboard/requested-reports',
    },
    // {
    //   iconActive: "/icons/surveySidebar/reportWhite.png",
    //   iconInactive: "/icons/surveySidebar/reportBlue.png",
    //   name: "Technical Report",
    //   link: "/survey-dashboard/technical-report",
    // },
    // {
    //   iconActive: "/icons/surveySidebar/securityWhite.png",
    //   iconInactive: "/icons/surveySidebar/securityBlue.png",
    //   name: "Security",
    //   link: "/survey-dashboard/security",
    // },
    {
      iconActive: '/icons/surveySidebar/passwordWhite.png',
      iconInactive: '/icons/surveySidebar/passwordBlue.png',
      name: 'Create Technical Report Slots',
      link: '/survey-dashboard/create-slot',
    },
    {
      iconActive: '/icons/surveySidebar/passwordWhite.png',
      iconInactive: '/icons/surveySidebar/passwordBlue.png',
      name: 'Price',
      link: '/survey-dashboard/price',
    },
    // {
    //   iconActive: "/icons/surveySidebar/passwordWhite.png",
    //   iconInactive: "/icons/surveySidebar/passwordBlue.png",
    //   name: "Upload Technical Report",
    //   link: "/survey-dashboard/technical-report",
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
      <div>
        <div className='flex relative justify-between w-full items-start px-5'>
          <Link
            href='/'
            className='w-full text-white font-bold flex gap-3 items-center text-lg pb-10 border-b-2 border-[#D0D5DD]'
          >
            <figure className='cursor-pointer'>
              <Image src='/icons/Logo2.png' height={51} width={51} alt='Logo' />
            </figure>
            Funds Verifier
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='text-base lg:hidden block text-white'
          >
            x
          </button>
        </div>

        <div className='w-full flex flex-col gap-3 py-5 text-base'>
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
                } whitespace-nowrap flex gap-3 xl:gap-5 text-sm xl:text-base rounded-md items-center py-2 px-3 cursor-pointer`}
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

      <div className='font-semibold border-t border-[#D0D5DD] text-prussianBlue py-5 mx-5 flex flex-col gap-3'>
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

export default SurveyorSidebar
