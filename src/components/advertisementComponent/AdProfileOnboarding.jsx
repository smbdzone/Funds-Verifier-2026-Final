'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import customAxios from '@/utils/apis/apis'
import { EMIRATES, VIEWER_GENDERS } from '@/constants/adTargeting'

/**
 * One-time onboarding shown on the advertiser dashboard when the logged-in user
 * is missing the ad-targeting attributes (city / age-group / gender) that UAE
 * Pass didn't supply. Saves them so targeting works (and the dev account is
 * testable). Calls onSaved() to refresh the profile once stored.
 */
const AdProfileOnboarding = ({ onSaved }) => {
  const [city, setCity] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [saving, setSaving] = useState(false)

  const labelClass = 'block mb-1.5 text-sm font-medium text-[#002D4F]'
  const selectClass =
    'bg-[#002D4F]/10 text-[#002D4F] border border-[#8D7C3B] rounded-md px-4 h-[48px] w-full'

  const submit = async () => {
    if (!city || !dateOfBirth || !gender) {
      toast.error('Please select your city, date of birth and gender.')
      return
    }
    try {
      setSaving(true)
      // Cookie auth (withCredentials) covers this even before the in-memory token warms up.
      await customAxios.put('/user/targeting-profile', {
        city,
        dateOfBirth,
        gender,
      })
      toast.success('Profile saved')
      await onSaved?.()
    } catch {
      toast.error('Could not save your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-[480px] p-6'>
        <h2 className='text-xl font-bold text-[#002D4F] mb-1'>
          Complete your profile
        </h2>
        <p className='text-sm text-gray-500 mb-5'>
          We use these to show relevant advertisements. This is a one-time step.
        </p>

        <div className='flex flex-col gap-4'>
          <div>
            <label className={labelClass}>City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={selectClass}
            >
              <option value=''>Select city</option>
              {EMIRATES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type='date'
              value={dateOfBirth}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={selectClass}
            />
          </div>

          <div>
            <label className={labelClass}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={selectClass}
            >
              <option value=''>Select gender</option>
              {VIEWER_GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type='button'
            onClick={submit}
            disabled={saving}
            className='mt-2 w-full h-11 rounded-md font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)] hover:opacity-90 disabled:opacity-60'
          >
            {saving ? 'Saving…' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdProfileOnboarding
