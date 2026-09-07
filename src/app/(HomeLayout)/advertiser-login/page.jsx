'use client'
import Image from 'next/image'
import Link from 'next/link'
import AdvertiserUaePassButton from '@/components/auth/AdvertiserUaePassButton'

/**
 * Advertiser sign-in page. Shown when entering the ad flow ("Advertise with Us"
 * → Get Started) while signed out. This is the login for the *advertiser account*
 * (distinct from normal users, who sign in via /login).
 */
export default function AdvertiserLogin() {
  return (
    <div className='h-full w-full relative z-[40]'>
      {/* Header Section */}
      <div className='w-full valuesBg flex py-5 sm:py-10 md:px-15 flex-col'>
        <div className='container mx-auto'>
          <h1 className='heading text-white lg:text-5xl md:text-4xl text-[25px] font-semibold'>
            Advertiser Sign In
          </h1>
          <p className='lg:text-2xl md:text-lg text-base text-[#9b9b9b7c] sm:mt-2'>
            <span className=' text-white'>Advertise with Us / </span> Manage your
            campaigns
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className='flex flex-col-reverse lg:flex-row-reverse w-full h-full'>
        {/* Image Section */}
        <div className='flex pt-10 sm:pt-20 lg:w-1/2 w-full bg-[rgba(245,245,245,1)] lg:bg-none p-12 sm:p-14 justify-center items-center relative order-1 md:order-2'>
          <Image
            src='/icons/SMBSignUp.png'
            alt='Advertiser Login Illustration'
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
              Sign in to your advertiser account
            </p>
            <p className='text-[7.5px] sm:text-[12px] sm:text-center text-gray-500 mb-3'>
              Create, manage and track your advertisements from a dedicated
              dashboard.
            </p>

            {/* Advertiser UAE Pass sign-in / signup */}
            <div className='w-full'>
              <AdvertiserUaePassButton />
              <p className='text-[7.5px] sm:text-[12px] sm:text-center text-gray-500'>
                A single trusted digital identity for all citizens, residents
                and visitors of UAE
              </p>
            </div>

            {/* Email/password sign-in (the standard path). Advertiser accounts
                that use a password rather than UAE Pass sign in here and are
                redirected back to the advertiser dashboard by role. */}
            <p className='text-[12px] text-center mt-6 text-gray-600'>
              Prefer email &amp; password?{' '}
              <Link
                href='/user-login'
                className='text-[rgba(141,124,59,1)] font-medium hover:underline'
              >
                Sign in with email
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className='absolute w-[50%] right-0 h-[100%] top-0 -z-1'></div>
    </div>
  )
}
