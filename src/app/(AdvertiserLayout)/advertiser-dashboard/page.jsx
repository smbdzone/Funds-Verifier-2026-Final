'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useProfile } from '@/context/UserContext'
import { getTokenFromCookie } from '@/utils/helper'
import {
  PlusCircleIcon,
  ListChecksIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  WalletIcon,
} from 'lucide-react'

const root = `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement`

const Overview = () => {
  const user = useProfile()
  const token = getTokenFromCookie() || user?.accessToken
  const [ads, setAds] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${root}/getUserAdvertisement`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const list = res?.data?.data || []
        if (!active) return
        setAds(list)

        // The wallet is keyed by the advertiser's user id, which is stamped on
        // every ad document (userId). Derive it from the ads response so we don't
        // depend on the /me payload shape.
        const ownerId = list?.[0]?.userId
        if (ownerId) {
          try {
            const wRes = await axios.get(`${root}/user/wallet/${ownerId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (active) setWallet(wRes?.data?.wallet || null)
          } catch {
            if (active) setWallet(null)
          }
        }
      } catch (error) {
        console.error('Error loading overview:', error)
        if (active) setAds([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [token])

  const total = ads?.length || 0
  const countBy = (status) =>
    ads?.filter((a) => (a?.Approval || 'Pending') === status).length || 0

  const stats = [
    {
      label: 'Total Advertisements',
      value: total,
      icon: ListChecksIcon,
    },
    { label: 'Pending', value: countBy('Pending'), icon: ClockIcon },
    { label: 'Approved', value: countBy('Approved'), icon: CheckCircle2Icon },
    { label: 'Rejected', value: countBy('Rejected'), icon: XCircleIcon },
  ]

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#002D4F]'>
            Advertiser Dashboard
          </h1>
          <p className='text-gray-500 mt-1'>
            Create and manage your advertisements.
          </p>
        </div>
        <Link
          href='/advertiser-dashboard/create'
          className='inline-flex items-center gap-2 rounded-md px-5 h-11 font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] hover:opacity-90 transition-opacity'
        >
          <PlusCircleIcon className='size-5' /> Create Advertisement
        </Link>
      </div>

      {/* Wallet */}
      <div className='rounded-xl bg-[#002D4F] text-white p-6 mb-6 flex items-center justify-between'>
        <div>
          <p className='text-white/70 text-sm'>Ads Wallet Balance</p>
          <p className='text-3xl font-bold mt-1'>
            {loading
              ? '—'
              : `${Number(wallet?.total || 0).toFixed(4)} AED`}
          </p>
        </div>
        <WalletIcon className='size-10 text-[#A2913E]' />
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className='rounded-xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4'
          >
            <div className='size-11 rounded-lg bg-[#002D4F]/10 flex items-center justify-center'>
              <Icon className='size-5 text-[#A2913E]' />
            </div>
            <div>
              <p className='text-2xl font-bold text-[#002D4F]'>
                {loading ? '—' : value}
              </p>
              <p className='text-sm text-gray-500'>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8'>
        <Link
          href='/advertiser-dashboard/my-ads'
          className='text-[#A2913E] font-medium hover:underline'
        >
          View all advertisements →
        </Link>
      </div>
    </div>
  )
}

export default Overview
