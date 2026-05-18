'use client'
import Image from 'next/image'
import axios from 'axios'
import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import { NotificationIcon, ProfileDropDownIcon } from '../Icons'
import Link from 'next/link'
import { SearchIcon, PlusIcon } from '../../components/Icons'
import { usePathname } from 'next/navigation'

const SMBHeader = () => {
  return (
    <div className='border-b border-gray-600 bg-[#D9D9D9]'>
      <header className='p-4 sm:p-3 theme-container flex flex-col sm:flex-row items-center sm:gap-4'>
        <div className='flex-grow flex justify-center'>
          <div className='rounded font-semibold text-2xl text-[#8d7c3b] opacity-[0.75] flex items-center'>
            Manage Appointments
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0'>
          <div className='relative w-full sm:w-auto'>
            <input
              type='text'
              placeholder='Search'
              className='py-1  px-8 rounded-full border border-white bg-[#F5F3FF] w-full'
            />
            <SearchIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          </div>
          <button className='p-2 bg-[#002D4F] text-white text-sm rounded-md flex items-center gap-2 w-full sm:w-auto'>
            <PlusIcon />
            Add Appointment
          </button>
        </div>
      </header>
    </div>
  )
}

export default SMBHeader
