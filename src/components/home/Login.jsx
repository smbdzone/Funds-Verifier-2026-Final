'use client'
import SearchInputs from '@/components/Inputs/SearchInputs'
import { useEffect, useRef, useState } from 'react'
import FundsTypeSlider from '@/components/sliders/funds-typeSlider'
import ValuesSec from '@/components/home/valuesSec'
import PropertiesSale from '@/components/home/properties-sale'
import BoatsSale from '@/components/home/boats-sale'
import CarsSale from '@/components/home/cars-sale'
import JewelrySale from '@/components/home/jewelry-sale'
import Testimonials from '@/components/home/testimonials'
import Partners from '@/components/home/partners'
import NewsTrends from '@/components/home/newsTrends'
import InTouch from '@/components/home/inTouch'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { HomePageSkeleton } from '@/components/home/HomeSectionSkeletons'
import customAxios from '../../utils/apis/apis'
import { useProfile } from '@/context/UserContext'
import { setAccessToken } from '../../utils/auth/accessTokenStore'
import { getRoleHomeRoute } from '@/utils/auth/roleHome'
import { POST_LOGIN_BOOTSTRAP_KEY } from '@/utils/auth/uaePass'
import { parseUaePassName } from '@/utils/auth/parseUaePassName'

export default function Login() {
  const { applyUserFromLogin, setIsLoading: setGlobalLoading } = useProfile()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const oauthStarted = useRef(false)

  useEffect(() => {
    if (!code || oauthStarted.current) return
    oauthStarted.current = true
    exchangeUaePassCode(code)
  }, [code])

  const exchangeUaePassCode = async (authCode) => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      const res = await customAxios.post('/user/get-token', { code: authCode })

      if (res?.data?.message === 'User exist' && res?.data?.user) {
        await completeUaePassLogin(res.data.user)
      } else if (res?.data?.email || res?.data?.uuid) {
        await completeUaePassLogin(res.data)
      } else {
        toast.error(res?.data?.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'UAE Pass login failed',
      )
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  const completeUaePassLogin = async (uaeUser) => {
    const { firstName, lastName, fullName } = parseUaePassName(
      uaeUser?.fullnameEN,
      uaeUser?.lastnameEN,
    )

    const payload = {
      name: fullName || firstName || uaeUser?.fullnameEN,
      lastname: lastName || uaeUser?.lastnameEN,
      email: uaeUser?.email,
      role: 'DealHunter',
      uuid: uaeUser?.uuid,
      userType: uaeUser?.userType,
      phone: uaeUser?.mobile,
    }

    if (uaeUser?.userType === 'SOP1') {
      localStorage.setItem(
        'error',
        'You are not eligible to access this service.',
      )
      window.location.href = '/error'
      return
    }

    const res = await customAxios.post('/user/store-user', payload, {
      withCredentials: true,
    })

    const data = res.data

    if (data?.accessToken) {
      setAccessToken(data.accessToken)
      sessionStorage.setItem(POST_LOGIN_BOOTSTRAP_KEY, data.accessToken)
    }

    applyUserFromLogin?.(data)

    toast.success(data?.message || 'Login Successful!')

    const role = data?.role === 'AssetHolder' ? 'AssetHolder' : 'DealHunter'
    window.location.replace(getRoleHomeRoute(role))
  }

  if (isLoading) return <HomePageSkeleton />

  return (
    <main>
      <div className='homeDiv flex w-full flex-col gap-8 pb-16 pt-24 text-white sm:pb-20 sm:pt-28 md:top-[100px] md:pt-32 xl:px-20'>
        <div className='container mx-auto px-4 sm:px-6'>
          <div className='mt-6 sm:mt-10 md:mt-20'>
            <h1 className='font-semibold tracking-tight'>
              <span className='block text-[26px] leading-[31px] sm:text-3xl sm:leading-9 lg:text-5xl lg:leading-[1.15] xl:text-[60px] xl:leading-[68px]'>
                Unlocking Secure Asset
              </span>
              <span className='mt-1 block text-[26px] leading-[31px] sm:mt-1.5 sm:text-3xl sm:leading-9 lg:mt-2 lg:text-5xl lg:leading-[1.15] xl:text-[60px] xl:leading-[68px]'>
                Transactions with Funds Verifier
              </span>
            </h1>
          </div>
          <p className='mt-3 max-w-sm text-sm leading-snug tracking-wide text-white/95 sm:mt-4 sm:max-w-md md:mt-5 md:max-w-none md:text-2xl md:leading-normal'>
            Simplify asset transactions with confidence on our trusted platform
          </p>
          <div className='lg:block hidden mt-5'>
            <SearchInputs />
          </div>
        </div>
      </div>

      <FundsTypeSlider />
      <ValuesSec />
      <PropertiesSale />
      <BoatsSale />
      <CarsSale />
      <JewelrySale />
      <Testimonials />
      <Partners />
      <NewsTrends />
      <InTouch />
    </main>
  )
}
