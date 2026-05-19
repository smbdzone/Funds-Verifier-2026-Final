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
import Loader from '../../components/modules/EvaluatorProfile/requestCompoenets/Loader'
import customAxios from '../../utils/apis/apis'
import { useProfile } from '@/context/UserContext'
import { setAccessToken } from '../../utils/auth/accessTokenStore'
import { getRoleHomeRoute } from '@/utils/auth/roleHome'
import { POST_LOGIN_BOOTSTRAP_KEY } from '@/utils/auth/uaePass'

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
    const payload = {
      name: uaeUser?.fullnameEN,
      lastname: uaeUser?.lastnameEN,
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

  if (isLoading) return <Loader isOpen={true} />

  return (
    <main>
      <div className='flex gap-8 flex-col md:pt-32 sm:pt-10 pb-20 xl:px-20 homeDiv md:top-[100px] w-full text-[60px] text-white'>
        <div className='container mx-auto'>
          <div className='my-5 mt-20'>
            <p className='m-0 xl:text-[60px] lg:text-5xl text-3xl leading-[50px] font-semibold'>
              Unlocking <br className='md:hidden block' /> Secure Asset
            </p>
            <p className='m-0 xl:text-[60px] lg:text-5xl leading-[50px] text-3xl font-semibold'>
              Transactions <br className='md:hidden block' /> with Funds
              <br className='md:hidden block' /> Verifier
            </p>
          </div>
          <p className='md:text-2xl text-sm tracking-wide'>
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
