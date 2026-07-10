'use client'
import { useState, useTransition } from 'react'
import axios from 'axios'
import { useProfile } from '@/context/UserContext'
import { handleThumbnailUpload } from '@/libs/uploadAsset'
import { getTokenFromCookie } from '@/utils/helper'
import { toast } from 'react-toastify'
import { CheckIcon, XCircleIcon } from 'lucide-react'
import AdMediaPicker from './AdMediaPicker'
import {
  AD_COUNTRY,
  EMIRATES,
  AGE_GROUPS,
  AD_GENDERS,
} from '@/constants/adTargeting'

// Only one ad size is offered — the Large Quarter-Page Banner. Stored as
// 'Quarter-Page Banner' to match the backend serving filters (getAllLargeBanners).
const AD_FORMAT = 'Quarter-Page Banner'

/**
 * Advertisement creation form (target URL, media with crop, UAE targeting, budget,
 * Stripe payment). Geography is UAE-only; cities are the 7 emirates (multi-select).
 *
 * @param {() => void} [onCreated] - optional callback fired after a successful create/pay redirect.
 */
const CreateAdvertisementForm = ({ onCreated }) => {
  const [isPending, startTransition] = useTransition(false)
  const [mediaFile, setMediaFile] = useState(null)
  const [selectedCities, setSelectedCities] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [gender, setGender] = useState('')
  const [price, setPrice] = useState(0)
  const [adLink, setAddLink] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const user = useProfile()
  const token = getTokenFromCookie() || user?.accessToken

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    )
  }

  const handleSubmit = async () => {
    if (!mediaFile) return toast.error('Please upload an ad media.')
    if (!token) return toast.error('Please login to continue')
    if (selectedCities.length === 0)
      return toast.error('Please select at least one city.')
    if (!startDate || !endDate)
      return toast.error('Please select start and end dates.')
    if (new Date(startDate) > new Date(endDate))
      return toast.error('Start date cannot be later than end date.')
    return setShowPaymentModal(true)
  }

  const handlePayAdvertise = async () => {
    startTransition(async () => {
      if (!mediaFile) return toast.error('Please upload an advertisement image.')
      if (!token) return toast.error('Please login to continue')
      if (selectedCities.length === 0)
        return toast.error('Please select at least one city.')
      if (!startDate || !endDate)
        return toast.error('Please select start and end dates.')
      if (new Date(startDate) > new Date(endDate))
        return toast.error('Start date cannot be later than end date.')

      const fileId = await handleThumbnailUpload(mediaFile)
      // Store the PERMANENT unsigned CloudFront URL as the creative image
      // (never the time-limited signedUrl). Serving re-signs from this at read
      // time. Fall back across the possible stored shapes, then signedUrl last.
      const uploadedImg =
        fileId?.images?.url ||
        fileId?.images?.[0]?.url ||
        fileId?.signedUrl ||
        ''
      if (!uploadedImg) {
        return toast.error('Image upload failed. Please try again.')
      }
      const data = {
        creatives: [
          {
            img: uploadedImg,
            adLink,
            format: AD_FORMAT,
            formatError: false,
          },
        ],
        targetedAudience: {
          country: [AD_COUNTRY],
          city: selectedCities,
          gender,
          ageGroup,
          startAt: [startDate],
          endAt: [endDate],
        },
        budget: price,
        startDate,
        endDate,
      }
      const AdData = {
        price,
        data: data,
        // Return the user to their dashboard on whatever origin they're on
        // (localhost / staging / prod) — no hardcoded domain.
        origin:
          typeof window !== 'undefined' ? window.location.origin : undefined,
      }

      try {
        const res = await axios.post('/api/stripe-advertisement', AdData, {
          headers: { Token: `${token}` },
        })
        if (typeof onCreated === 'function') onCreated()
        window.location.href = res?.data?.url
        setShowPaymentModal(false)
      } catch (error) {
        toast.error(
          'An error occurred while initiating payment. Please try again.',
        )
      }
    })
  }

  const TextUnderlineIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='96'
      height='4'
      viewBox='0 0 96 4'
      fill='none'
    >
      <rect width='95' height='4' transform='translate(0.5)' fill='white' />
      <rect x='0.5' width='20' height='4' rx='2' fill='#002D4F' />
      <rect x='25.5' width='70' height='4' rx='2' fill='#8D7C3B' />
    </svg>
  )

  const inputClass =
    'shadow-neons border border-[#A2913E] rounded-[8px] w-full h-[48px] px-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
  const labelClass = 'block mb-1.5 text-sm font-medium text-[#002D4F]'
  const selectClass =
    'bg-[#002D4F]/10 text-[#8D7C3B] border border-[#8D7C3B] rounded-md px-4 h-[48px] w-full'

  return (
    <div>
      {showPaymentModal && (
        <div
          className={`fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black bg-opacity-50`}
        >
          <div className='relative bg-white p-6 rounded-[6px] shadow-lg w-full max-w-[500px]'>
            <button
              type='button'
              disabled={isPending}
              onClick={() => setShowPaymentModal(false)}
              className='disabled:cursor-not-allowed cursor-pointer absolute top-3 right-3'
            >
              <XCircleIcon className='size-5 text-[#A2913E]' />
            </button>
            <h1 className='text-center text-[#002D4F] mb-3 text-[25px] font-bold'>
              Budget
            </h1>
            <div className='flex justify-center items-center text-center mb-4'>
              {TextUnderlineIcon}
            </div>
            <div className='mx-auto flex flex-col items-end gap-3'>
              <input
                type='number'
                placeholder='0.00'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
              />
              <div className='flex justify-center items-center w-full max-w-[70%] mx-auto'>
                <button
                  onClick={handlePayAdvertise}
                  disabled={price < 5 || isPending}
                  className='disabled:opacity-50 disabled:cursor-not-allowed justify-center w-full flex items-center rounded-l-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]  h-11 cursor-pointer hover:opacity-90 transition-opacity'
                >
                  {isPending ? 'Submiting...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='lg:w-[60%] mx-auto'>
        <h1 className='text-center my-12 text-[40px] font-bold text-[#002D4F]'>
          Upload Creatives
        </h1>
        <div className='mx-auto flex flex-col gap-5'>
          {/* Target URL */}
          <div>
            <label htmlFor='adLink' className={labelClass}>
              Enter the target URL
            </label>
            <input
              id='adLink'
              type='text'
              placeholder='https://example.com'
              value={adLink}
              onChange={(e) => setAddLink(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Format (fixed) */}
          <div className='flex items-center gap-2'>
            <span className={labelClass + ' !mb-0'}>Format:</span>
            <span className='text-[15px] font-semibold text-[#A2913E]'>
              Quarter Page Banner
            </span>
          </div>

          {/* Ad media with crop */}
          <div>
            <label className={labelClass}>Ad Media</label>
            <AdMediaPicker onChange={setMediaFile} />
          </div>

          <div className=' max-w-2xl mx-auto flex items-center flex-col'>
            <div className='flex w-full  items-center'>
              <div className='flex md:text-4xl justify-center w-full text-xl font-semibold text-[#002D4F] mt-2'>
                Target Audience
              </div>
            </div>
            <div className='flex flex-row gap-2 my-5'>
              <div className='rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]' />
              <div className='rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]' />
            </div>
          </div>

          {/* Country (fixed) */}
          <div>
            <label className={labelClass}>Country</label>
            <div className='bg-[#002D4F]/10 text-[#8D7C3B] border border-[#8D7C3B] rounded-md px-4 h-[48px] w-full flex items-center'>
              {AD_COUNTRY}
            </div>
          </div>

          {/* Cities — 7 emirates, multi-select */}
          <div>
            <label className={labelClass}>
              Cities (select one or more)
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {EMIRATES.map((city) => {
                const active = selectedCities.includes(city)
                return (
                  <button
                    type='button'
                    key={city}
                    onClick={() => toggleCity(city)}
                    className={`flex items-center justify-between gap-2 rounded-md border px-3 h-[44px] text-sm transition-colors ${
                      active
                        ? 'border-[#A2913E] bg-[#A2913E]/10 text-[#002D4F] font-medium'
                        : 'border-[#8D7C3B]/50 text-[#8D7C3B] hover:bg-[#002D4F]/5'
                    }`}
                  >
                    <span className='truncate'>{city}</span>
                    {active && (
                      <CheckIcon className='size-4 text-[#A2913E] shrink-0' />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Row 1: Targeted Age + Targeted Gender */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='targetedAge' className={labelClass}>
                Targeted Age
              </label>
              <select
                id='targetedAge'
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className={selectClass}
              >
                <option value=''>All ages</option>
                {AGE_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor='targetedGender' className={labelClass}>
                Targeted Gender
              </label>
              <select
                id='targetedGender'
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={selectClass}
              >
                <option value=''>Select gender</option>
                {AD_GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Start Date + End Date */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='startDate' className={labelClass}>
                Starting Date
              </label>
              <input
                id='startDate'
                type='date'
                value={startDate}
                title='Start Date'
                onChange={(e) => setStartDate(e.target.value)}
                className='bg-[#002D4F]/10 text-[#8D7C38] border border-[#A2913E] rounded-md w-full h-[48px] px-5 outline-with-opacity'
              />
            </div>
            <div>
              <label htmlFor='endDate' className={labelClass}>
                Ending Date
              </label>
              <input
                id='endDate'
                type='date'
                value={endDate}
                title='End Date'
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='bg-[#002D4F]/10 text-[#8D7C38] border border-[#A2913E] rounded-md w-full h-[48px] px-5 outline-with-opacity'
              />
            </div>
          </div>

          <div className='flex mx-auto justify-center items-center w-full max-w-full sm:max-w-[70%] mt-2'>
            <button
              onClick={handleSubmit}
              className='justify-center w-full flex items-center rounded-l-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]  h-11 cursor-pointer hover:opacity-90 transition-opacity'
            >
              Create Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAdvertisementForm
