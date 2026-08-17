import React, { useEffect, useState, useCallback } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { toast } from 'react-toastify'
import ConfirmationPopup from './ConfirmationPopup'
import './styles.css'
import { useProfile } from '../../context/UserContext'
import customAxios from '../../utils/apis/apis'
import { NoSlotsAvailable } from '@/components/global/NoSlotsAvailable'
import { getBookableSlotsForDate } from '@/libs/slotTimeFilters'
import { isOwnListing } from '@/libs/isOwnListing'
import { setPostLoginRedirect } from '@/utils/auth/postLoginRedirect'
import { CONSUMER_ROLES } from '@/utils/auth/roleHome'
import { usePathname, useRouter } from 'next/navigation'

const resolveTrusteeFromListing = (product) => {
  if (!product) return null
  return (
    product.trusteeUUID ||
    product.trusteeId?.uuid ||
    product.trustee?.uuid ||
    product.dealer?.uuid ||
    (typeof product.dealer === 'string' ? product.dealer : null)
  )
}

/** Slim listing payload for /arrange-view/book — full off-plan docs can trip nginx/WAF 403. */
function buildBookingProductPayload(product) {
  if (!product || typeof product !== 'object') return product
  const userUUID =
    product.userUUID ||
    product.assetHolderUUID ||
    (typeof product.userId === 'string' ? product.userId : product.userId?.uuid) ||
    ''
  return {
    uuid: product.uuid || '',
    slug: product.slug || '',
    title: product.title || '',
    assetType: product.assetType || '',
    userUUID,
    trusteeUUID: resolveTrusteeFromListing(product) || '',
    neighbourhood: product.neighbourhood || '',
    city: product.city || '',
    country: product.country || '',
    phoneNumber: product.phoneNumber || '',
    price: product.price ?? product.priceFrom ?? '',
    priceFrom: product.priceFrom ?? '',
    priceTo: product.priceTo ?? '',
    developer: product.developer || '',
    propertyType: product.propertyType || '',
  }
}

const CalendarPopup = ({ onClose, productData }) => {
  const getTodayStart = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  }
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timeSlots, setTimeSlots] = useState([])
  const [timeSlotId, setTimeSlotId] = useState()
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trusteeUUID, setTrusteeUUID] = useState(null)
  const [trusteeLoading, setTrusteeLoading] = useState(true)
  /** While we ask the API for slots for the selected calendar day */
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [slotsFetchError, setSlotsFetchError] = useState(null)
  /** YYYY-MM-DD dates that still have at least one open viewing time */
  const [availableDates, setAvailableDates] = useState(() => new Set())
  const [availableDatesLoading, setAvailableDatesLoading] = useState(false)
  const { user, isAuthenticated, loading } = useProfile()
  const pathname = usePathname()
  const router = useRouter()
  const ownsListing = isOwnListing(productData, user)

  useEffect(() => {
    if (loading) return
    const isConsumer =
      isAuthenticated && user?.role && CONSUMER_ROLES.has(user.role)
    if (isConsumer) return

    const returnTo =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : pathname

    setPostLoginRedirect(returnTo)
    toast.info('Please sign in with UAE Pass to arrange a viewing.')
    onClose?.()
    router.push(
      `/login?redirect=${encodeURIComponent(returnTo)}&uaepass=1`,
    )
  }, [isAuthenticated, loading, onClose, pathname, router, user])

  useEffect(() => {
    if (!ownsListing) return
    toast.error('You cannot request a viewing for your own listing.')
    onClose?.()
  }, [ownsListing, onClose])

  const formatApiDate = (date) => {
    const correctedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    )
    return correctedDate.toISOString().split('T')[0]
  }

  const parseApiDateLocal = (dateStr) => {
    const [y, m, d] = String(dateStr || '')
      .split('-')
      .map((n) => Number(n))
    if (!y || !m || !d) return null
    return new Date(y, m - 1, d)
  }

  const loadTrustee = useCallback(async () => {
    setTrusteeLoading(true)
    setSlotsFetchError(null)

    const fromListing = resolveTrusteeFromListing(productData)
    if (fromListing) {
      setTrusteeUUID(fromListing)
      setTrusteeLoading(false)
      return
    }

    try {
      const response = await customAxios.get('/user/service-providers/Trustee')
      const providers = Array.isArray(response?.data) ? response.data : []
      if (providers.length > 0) {
        // Backend ranks trustees with upcoming viewing slots first.
        setTrusteeUUID(providers[0].uuid)
      } else {
        setTrusteeUUID(null)
        setSlotsFetchError('no_trustee')
      }
    } catch (error) {
      console.error('Error loading trustee:', error)
      setTrusteeUUID(null)
      setSlotsFetchError('no_trustee')
      toast.error('Could not load trustee availability')
    } finally {
      setTrusteeLoading(false)
    }
  }, [productData])

  useEffect(() => {
    if (loading || !isAuthenticated || !user) return
    loadTrustee()
  }, [isAuthenticated, loadTrustee, loading, user])

  const fetchAppointments = useCallback(async (date, ownerUUID) => {
    if (!ownerUUID) return false

    setFetchingSlots(true)
    setSlotsFetchError(null)
    setTimeSlots([])
    setSelectedTime('')
    setTimeSlotId('')
    setSelectedTimeSlotId('')

    try {
      const formattedDate = formatApiDate(date)

      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slots/available?date=${formattedDate}&userUUID=${ownerUUID}&slotCategory=viewing`
      )

      if (response.status === 200 && response.data.length > 0) {
        const availableSlots = response.data[0].times || []
        const daySlotGroupId = response.data[0].uuid

        setTimeSlots(availableSlots)
        const openSlots = getBookableSlotsForDate(availableSlots, date)
        if (openSlots.length > 0) {
          setSelectedTime(openSlots[0].time)
          setTimeSlotId(openSlots[0].uuid)
          setSelectedTimeSlotId(daySlotGroupId)
          return true
        }
      }
      // Day has no bookable times — drop it from the selectable calendar set.
      setAvailableDates((prev) => {
        if (!prev.has(formattedDate)) return prev
        const next = new Set(prev)
        next.delete(formattedDate)
        return next
      })
      return false
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setSlotsFetchError('network')
      toast.error(
        error?.response?.data?.message ||
        'Could not check this date. Try again.',
      )
      return false
    } finally {
      setFetchingSlots(false)
    }
  }, [])

  const loadAvailableDates = useCallback(async (ownerUUID) => {
    if (!ownerUUID) {
      setAvailableDates(new Set())
      return []
    }
    setAvailableDatesLoading(true)
    try {
      const today = getTodayStart()
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/slots/available-dates?userUUID=${ownerUUID}&fromDate=${formatApiDate(today)}`,
      )
      const dates = Array.isArray(response?.data?.dates)
        ? response.data.dates
        : []
      setAvailableDates(new Set(dates))
      return dates
    } catch (error) {
      console.error('Error loading available viewing dates:', error)
      setAvailableDates(new Set())
      return []
    } finally {
      setAvailableDatesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!trusteeUUID || trusteeLoading) return

    const boot = async () => {
      const dates = await loadAvailableDates(trusteeUUID)
      if (!dates.length) {
        setSelectedDate(getTodayStart())
        setTimeSlots([])
        return
      }

      const firstDate = parseApiDateLocal(dates[0]) || getTodayStart()
      setSelectedDate(firstDate)
      await fetchAppointments(firstDate, trusteeUUID)
    }

    boot()
  }, [trusteeUUID, trusteeLoading, fetchAppointments, loadAvailableDates])

  const isDateSelectable = useCallback(
    (date) => {
      const today = getTodayStart()
      const day = new Date(date)
      day.setHours(0, 0, 0, 0)
      if (day < today) return false
      return availableDates.has(formatApiDate(day))
    },
    [availableDates],
  )

  const formatDay = (date) => {
    const options = { weekday: 'long' }
    return date.toLocaleDateString(undefined, options)
  }

  const formatNumericDate = (date) => {
    const options = { day: 'numeric' }
    return date.toLocaleDateString(undefined, options)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isConsumer =
      isAuthenticated && user?.role && CONSUMER_ROLES.has(user.role)
    if (!isConsumer) {
      const returnTo =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : pathname
      setPostLoginRedirect(returnTo)
      toast.info('Please sign in with UAE Pass to arrange a viewing.')
      onClose?.()
      router.push(
        `/login?redirect=${encodeURIComponent(returnTo)}&uaepass=1`,
      )
      return
    }
    if (ownsListing) {
      toast.error('You cannot request a viewing for your own listing.')
      return
    }
    if (!selectedTimeSlotId) {
      toast.error('Please select a time slot before submitting.')
      return
    }

    setIsSubmitting(true)

    try {
      // Update the time slot
      const newUpdatedSlot = timeSlots.map((slot) => {
        if (slot.time === selectedTime) {
          return { ...slot, isBooked: true }
        }
        return slot
      })

      // Update the slot status
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/timeslot/update/${selectedTimeSlotId}`,
        { timeSlots: newUpdatedSlot }
      )

      // Book the appointment
      const activeTimeSlotId =
        timeSlotId ||
        timeSlots.find((slot) => slot.time === selectedTime)?.uuid

      const bookingProduct = buildBookingProductPayload(productData)
      const response = await customAxios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/arrange-view/book`,
        {
          brokerId: `${user?.uuid}`,
          assetHolderId:
            bookingProduct?.userUUID ||
            productData?.userUUID ||
            productData?.userId ||
            productData?.assetHolderUUID ||
            '',
          timeSlotId: activeTimeSlotId,
          productData: bookingProduct,
        }
      )
      toast.success(response.data.message)
      setShowConfirmation(true)
    } catch (error) {
      console.error('Error during submission:', error)
      toast.error(
        error?.response?.data?.message || 'Failed to send appointment request.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    onClose()
  }

  if (loading || !isAuthenticated || !user || ownsListing) return null

  const bookableTimes = getBookableSlotsForDate(timeSlots, selectedDate)
  const scheduleLoading =
    trusteeLoading || availableDatesLoading || fetchingSlots

  return (
    <>
      <div className='fixed inset-0 flex  items-center justify-center z-50 bg-black bg-opacity-50'>
        <div className='bg-[#8D7C3B] borderTopRadius borderBottomRadius relative rounded-2xl w-auto'>
          <button
            onClick={onClose}
            className='text-red-500 absolute top-3 right-3'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='white'
              width='24'
              height='24'
            >
              <path
                d='M6 6L18 18M6 18L18 6'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <div className='flex gap-5 sm:flex-row flex-col w-full justify-center'>
            <div className='flex flex-col justify-evenly items-center sm:py-0 py-5 w-full sm:w-[257px]'>
              <div className='flex flex-col items-center gap-0'>
                <div className='text-[36px] text-white font-semibold'>
                  {formatDay(selectedDate)}
                </div>
                <div className='text-[55px] text-white font-semibold'>
                  {formatNumericDate(selectedDate)}
                </div>
              </div>
              <div className='flex min-h-[120px] flex-col items-center justify-center gap-2 px-2'>
                {scheduleLoading ? (
                  <div className='flex flex-col items-center gap-2 text-center text-white'>
                    <span
                      className='inline-block h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent'
                      aria-hidden
                    />
                    <p className='text-sm font-medium leading-snug'>
                      {trusteeLoading || availableDatesLoading
                        ? 'Loading trustee schedule…'
                        : 'Checking this date…'}
                    </p>
                    <p className='text-xs text-white/80'>
                      Finding available viewing times
                    </p>
                  </div>
                ) : slotsFetchError === 'no_trustee' ? (
                  <p className='max-w-[220px] text-center text-sm leading-relaxed text-white'>
                    No trustee is available on the platform yet. A trustee must
                    create viewing slots before bookings can be made.
                  </p>
                ) : slotsFetchError === 'network' ? (
                  <p className='max-w-[220px] text-center text-sm text-white'>
                    Could not load this date. Pick another day or try again.
                  </p>
                ) : availableDates.size === 0 ? (
                  <p className='max-w-[220px] text-center text-sm leading-relaxed text-white'>
                    No viewing dates are open yet. Only days with trustee time
                    slots appear on the calendar.
                  </p>
                ) : bookableTimes.length > 0 ? (
                  <>
                    <select
                      value={selectedTime}
                      onChange={(e) => {
                        setSelectedTime(e.target.value)
                        const selectedSlot = timeSlots.find(
                          (slot) => slot.time === e.target.value
                        )
                        if (selectedSlot) {
                          setTimeSlotId(selectedSlot.uuid)
                        }
                      }}
                      className='mt-2 max-w-[220px] cursor-pointer rounded-[4px] bg-[#FFFFFF] px-3 py-2 text-[#8D7C3B]'
                    >
                      {bookableTimes.map((slot) => (
                        <option
                          key={slot.uuid || slot.time}
                          value={slot.time}
                        >
                          {slot.time}
                        </option>
                      ))}
                    </select>
                    <button
                      type='button'
                      onClick={handleSubmit}
                      className='mt-2 cursor-pointer rounded-[4px] border-2 border-[#FFFFFF] px-3 py-1 text-[14px] text-[#fff] disabled:opacity-50'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting…' : 'Submit'}
                    </button>
                  </>
                ) : (
                  <NoSlotsAvailable variant='viewing' theme='dark' />
                )}
              </div>
            </div>
            <div className='flex-grow relative'>
              <Calendar
                onChange={(date) => {
                  if (!isDateSelectable(date)) return
                  setSelectedDate(date)
                  if (trusteeUUID) fetchAppointments(date, trusteeUUID)
                }}
                value={selectedDate}
                minDate={getTodayStart()}
                tileDisabled={({ date, view }) =>
                  view === 'month' ? !isDateSelectable(date) : false
                }
                tileClassName={({ date, view }) => {
                  if (view !== 'month') return null
                  return isDateSelectable(date) ? 'has-viewing-slot' : null
                }}
                className='w-full h-full sm:rounded-tl-[24px] sm:rounded-bl-[24px] rounded-2xl arrange_viewing'
              />
              <button
                onClick={onClose}
                className='text-red-500 sm:block hidden absolute sm:top-3 right-3'
              >
                <img src='/icons/golden-cross.svg' alt='Close' />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationPopup onClose={handleCloseConfirmation} />
      )}
    </>
  )
}

export default CalendarPopup
