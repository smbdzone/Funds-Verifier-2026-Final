'use client'
import SearchInputs from '@/components/Inputs/SearchInputs'
import { useEffect, useState } from 'react'
import FundsTypeSlider from '@/components/sliders/funds-typeSlider'
import ValuesSec from '@/components/home/valuesSec'
import PropertiesSale from '@/components/home/properties-sale'
import BoatsSale from '@/components/home/boats-sale'
import CarsSale from '@/components/home/cars-sale'
import Testimonials from '@/components/home/testimonials'
import Partners from '@/components/home/partners'
import NewsTrends from '@/components/home/newsTrends'
import InTouch from '@/components/home/inTouch'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCookie, getCookies } from 'cookies-next'
import { toast } from 'react-toastify'
import Loader from '../../components/modules/EvaluatorProfile/requestCompoenets/Loader'
import customAxios from '../../utils/apis/apis'
import { getTokenFromCookie } from '../../utils/helper'
import { useProfile } from '../../context/UserContext'
import { deleteCookie } from 'cookies-next'
import { setAccessToken } from '../../utils/auth/accessTokenStore'

export default function Login() {
  const { user, setIsLoading: setLoading } = useProfile()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user === undefined) return // wait for context
    // Get role from user context (from /me endpoint)
    const role = user?.role
    // Get token from cookies (primary storage)
    // const token = getTokenFromCookie()
    // Get role from cookie as fallback
    const cookieRole = getCookies('role')
    console.log(!role && !cookieRole, role, cookieRole)

    // If OAuth code exists → fetch token
    if (code) {
      getToken()
    }
  }, [code, user])

  // Fetch access token from backend
  const getToken = async () => {
    setIsLoading(true)
    setLoading(true)
    try {
      const res = await customAxios.post('/user/get-token', { code })

      if (res?.data.message === 'User exist') {
        await handleSubmit(res?.data.user)
      } else if (res?.data) {
        await handleSubmit(res?.data)
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      toast.error(`${error.message}`)
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }

  // Handle login submission
  const handleSubmit = async (user) => {
    // If the user started from the advertiser sign-in, create them as an
    // Advertiser account (hint stashed before the UAE Pass round-trip).
    const signupRole =
      typeof window !== 'undefined'
        ? localStorage.getItem('uaePassSignupRole')
        : null
    if (signupRole) localStorage.removeItem('uaePassSignupRole')

    const payload = {
      name: user?.fullnameEN,
      lastname: user?.lastnameEN,
      email: user?.email,
      role: signupRole || 'DealHunter',
      uuid: user?.uuid,
      userType: user?.userType,
      phone: user?.mobile,
      // Ad-targeting attributes from UAE Pass when the profile provides them.
      gender: user?.gender || undefined,
      city: user?.city || user?.emirate || undefined,
      dateOfBirth: user?.dateofbirth || user?.dob || user?.dateOfBirth || undefined,
    }

    try {
      if (user?.userType === 'SOP1') {
        localStorage.setItem(
          'error',
          'You are not eligible to access this service.',
        )
        window.location.href = '/error'
        return
      }

      const res = await customAxios.post('/user/store-user', payload, {
        withCredentials: true, // ✅ IMPORTANT (refreshToken cookie)
      })

      const data = res.data

      // 🍪 Cookies are set by backend via Set-Cookie headers
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
      }

      toast.success('Login Successful!')
      // const dataRes = await customAxios.get('/user/me', {
      //   withCredentials: true,
      // })
      // console.log(dataRes, 'dataRes')

      // -------------------------------
      // 🚀 REDIRECT (SAME AS login)
      // -------------------------------
      // Honor an intended destination (e.g. "Get Started" from Advertise with Us)
      // captured before sign-in. Survives the UAE Pass external round-trip via localStorage.
      const redirectTo = localStorage.getItem('postLoginRedirect')
      if (redirectTo) {
        localStorage.removeItem('postLoginRedirect')
        // Full navigation so middleware and UserContext see new HttpOnly cookies
        window.location.href = redirectTo
        return
      }

      const targetRoute =
        data?.role === 'AssetHolder' ? '/seller-profile' : '/profile'

      if (data?.role === 'DealHunter' || data?.role === 'AssetHolder') {
        // Full navigation so middleware and UserContext see new HttpOnly cookies
        window.location.href = targetRoute
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      console.error(error)
    }
  }

  // Block UI until redirection
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
      <Testimonials />
      <Partners />
      <NewsTrends />
      <InTouch />
    </main>
  )
}
