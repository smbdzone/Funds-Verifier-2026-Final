'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { PlusCircleIcon } from 'lucide-react'
import { useProfile } from '@/context/UserContext'
import { getTokenFromCookie } from '@/utils/helper'
import AdvertisementList from '@/components/advertisementComponent/AdvertisementList'

const root = `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement`

const MyAdsPage = () => {
  const user = useProfile()
  const token = getTokenFromCookie() || user?.accessToken
  const [getUserAdvertisement, setGetUserAdvertisement] = useState()
  const [rended, setIsRended] = useState(false)

  useEffect(() => {
    if (!token) return
    let active = true

    const load = async () => {
      try {
        const res = await axios.get(`${root}/getUserAdvertisement`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (active) setGetUserAdvertisement(res?.data?.data)
      } catch (error) {
        console.error('Error fetching advertisements:', error)
        if (active) setGetUserAdvertisement([])
      }
    }

    load()
    return () => {
      active = false
    }
  }, [token, rended])

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#002D4F]'>
            My Advertisements
          </h1>
          <p className='text-gray-500 mt-1'>
            View, edit and remove your advertisements.
          </p>
        </div>
        <Link
          href='/advertiser-dashboard/create'
          className='inline-flex items-center gap-2 rounded-md px-5 h-11 font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] hover:opacity-90 transition-opacity'
        >
          <PlusCircleIcon className='size-5' /> Create Advertisement
        </Link>
      </div>

      <AdvertisementList
        getUserAdvertisement={getUserAdvertisement}
        token={token}
        locations={[]}
        setIsRended={setIsRended}
      />
    </div>
  )
}

export default MyAdsPage
