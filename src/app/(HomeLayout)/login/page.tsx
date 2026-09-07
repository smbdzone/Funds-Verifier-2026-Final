'use client'
import Image from 'next/image'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { captureRedirectQueryParam } from '@/utils/auth/postLoginRedirect'

export default function Login() {
  const searchParams = useSearchParams()
  useRedirectIfAuthenticated()

  // Persist email deep-link / return URL before UAE PASS leaves this origin.
  useEffect(() => {
    captureRedirectQueryParam(searchParams)
  }, [searchParams])

  // UAE Pass may redirect here with ?code= — home page handles the OAuth exchange.
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      window.location.replace(`/?code=${encodeURIComponent(code)}`)
    }
  }, [searchParams])
  const handleLogin = () => {
    captureRedirectQueryParam(searchParams)
    const authUrl = `https://id.uaepass.ae/idshub/authorize?redirect_uri=${process.env.NEXT_PUBLIC_UAE_PASS_REDIRECT_URI}/&client_id=${process.env.NEXT_PUBLIC_UAE_PASS_CLIENT_ID}&response_type=code&scope=urn:uae:digitalid:profile:general&acr_values=urn:safelayer:tws:policies:authentication:level:low;`
    window.location.href = authUrl
  }

  return (
    <div className='h-full w-full relative z-[40]'>
      {/* Header Section */}
      <div className='w-full valuesBg flex py-5 sm:py-10 md:px-15 flex-col'>
        <div className='container mx-auto'>
          <h1 className='heading text-white lg:text-5xl md:text-4xl text-[25px] font-semibold'>
            Sign In
          </h1>
          <p className='lg:text-2xl md:text-lg text-base text-[#9b9b9b7c] sm:mt-2'>
            <span className=' text-white'>Sign In / </span> Sign Up
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className='flex flex-col-reverse lg:flex-row-reverse w-full h-full'>
        {/* Image Section */}
        <div className='flex pt-10 sm:pt-20 lg:w-1/2 w-full bg-[rgba(245,245,245,1)] lg:bg-none p-12 sm:p-14 justify-center items-center relative order-1 md:order-2'>
          <Image
            src='/icons/SMBSignUp.png'
            alt='Login Illustration'
            width={400}
            height={400}
            quality={90}
            className='h-full w-full sm:w-[350px] sm:h-[350px]'
          />
        </div>

        {/* Login Section */}
        <div className='flex justify-center bg-[rgba(232,240,254,1)] lg:w-1/2 w-full md:py-15 p-4 lg:py-32'>
          <div className='flex w-[450px] justify-center flex-col items-center'>
            <p className='lg:text-2xl text-center sm:text-start md:text-lg mb-1 text-[12px]'>
              UAE Resident Sign In or Register
            </p>

            {/* UAE PASS button */}
            <button
              onClick={handleLogin}
              className='w-full bg-white hover:bg-[#8D7C3B] hover:bg-opacity-[0.2] transition duration-300 ease-in-out border-[1.5px] rounded-md sm:my-3 my-1 border-[rgba(162,145,62,1)] justify-center flex flex-row gap-2 p-2 items-center'
            >
              <Image
                src='/assets/images/buttonUaePass.png'
                alt='Sign in with UAE PASS'
                width={180}
                height={25}
                quality={90}
              />
            </button>

            <p className='text-[7.5px] sm:text-[12px] sm:text-center'>
              A single trusted digital identity for all citizens, residents and
              visitors of UAE
            </p>

            {/* OR Separator */}
            {/* <div className='w-full my-3 sm:my-5 flex justify-center flex-row items-center'>
              <hr className='border-[1px] w-[48%] border-[rgba(126,126,126,1)]' />
              <span className='text-[rgba(141,124,59,1)] w-[4%] mx-2 font-medium'>
                OR
              </span>
              <hr className='border-[1px] w-[48%] ml-3 border-[rgba(126,126,126,1)]' />
            </div> */}

            {/* Local Sign In */}
            {/* <Link
              href={'/user-login'}
              className='text-center btn-gradient px-6 py-2 w-full text-[15px] font-medium rounded shadow-md hover:scale-105 transition transform duration-200'
            >
              Sign in
            </Link> */}
          </div>
        </div>
      </div>
      <div className='absolute w-[50%] right-0 h-[100%] top-0 -z-1'></div>
    </div>
  )
}
