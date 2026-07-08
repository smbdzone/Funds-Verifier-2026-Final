'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useProfile } from '@/context/UserContext'
import { getTokenFromCookie } from '@/utils/helper'
import { UserIcon, MailIcon, MapPinIcon, WalletIcon } from 'lucide-react'

const root = `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement`

const formatDate = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
}

const cap = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '—')

const Field = ({ label, value }) => (
  <div>
    <p className='text-xs uppercase tracking-wide text-gray-400'>{label}</p>
    <p className='text-[15px] font-medium text-[#002D4F] mt-1 break-words'>
      {value || '—'}
    </p>
  </div>
)

const AccountPage = () => {
  const { user } = useProfile()
  const token = getTokenFromCookie() || null
  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    if (!token || !user?._id) return
    let active = true
    axios
      .get(`${root}/user/wallet/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => active && setWallet(res?.data?.wallet || null))
      .catch(() => active && setWallet(null))
    return () => {
      active = false
    }
  }, [token, user?._id])

  if (!user) return null

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-[#002D4F]'>
          My Account
        </h1>
        <p className='text-gray-500 mt-1'>Your advertiser account details.</p>
      </div>

      {/* Header card */}
      <div className='rounded-xl bg-[#002D4F] text-white p-6 mb-6 flex items-center gap-4'>
        <div className='size-14 rounded-full bg-white/10 flex items-center justify-center shrink-0'>
          <UserIcon className='size-7 text-[#A2913E]' />
        </div>
        <div className='min-w-0'>
          <p className='text-xl font-semibold truncate'>
            {[user.name, user.lastname].filter(Boolean).join(' ') || 'Advertiser'}
          </p>
          <p className='text-white/70 text-sm flex items-center gap-1.5 truncate'>
            <MailIcon className='size-4 shrink-0' /> {user.email}
          </p>
        </div>
        <span className='ml-auto shrink-0 rounded-full bg-[#A2913E] text-white text-xs font-semibold px-3 py-1'>
          {user.role}
        </span>
      </div>

      {/* Account details */}
      <div className='rounded-xl bg-white border border-gray-100 shadow-sm p-6 mb-6'>
        <h2 className='text-sm font-semibold text-[#002D4F] flex items-center gap-2 mb-5'>
          <MapPinIcon className='size-4 text-[#A2913E]' /> Profile & Targeting
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          <Field label='Full name' value={[user.name, user.lastname].filter(Boolean).join(' ')} />
          <Field label='Email' value={user.email} />
          <Field label='Phone' value={user.phone} />
          <Field label='City' value={user.city} />
          <Field label='Gender' value={cap(user.gender)} />
          <Field label='Date of Birth' value={formatDate(user.dateOfBirth)} />
          <Field label='Account status' value={cap(user.userState)} />
          <Field label='Account ID' value={user.uuid} />
          <Field label='Member since' value={formatDate(user.createdAt)} />
        </div>
      </div>

      {/* Wallet */}
      <div className='rounded-xl bg-white border border-gray-100 shadow-sm p-6 flex items-center justify-between'>
        <div>
          <p className='text-sm font-semibold text-[#002D4F] flex items-center gap-2'>
            <WalletIcon className='size-4 text-[#A2913E]' /> Ads Wallet
          </p>
          <p className='text-2xl font-bold text-[#002D4F] mt-2'>
            {wallet ? `${Number(wallet.total || 0).toFixed(4)} AED` : '0.0000 AED'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AccountPage
