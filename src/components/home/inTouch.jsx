'use client'
import Link from 'next/link'
export default function InTouch() {
  return (
    <>
      <div className='w-full inTouchBg md:px-20 px-5 md:py-14 py-2 sm:py-7 md:pt-20 sm:pt-10'>
        <div className='lg:text-4xl md:text-2xl text-xl text-[#002D4F] font-semibold text-center w-full'>
          Have an inquiry ? Get in touch!
        </div>
        <div className='flex justify-center items-center text-white cursor-pointer'>
          <Link href='/contact'>
            <button className='rounded font-semibold lg:text-2xl md:text-xl text-sm lg:my-7 md:my-5 my-3 [background:linear-gradient(90deg,_#a3923f,_#d7c590_24.57%,_#877832_50.22%,_#b7a874_75.23%,_#847531)] lg:w-[260px] lg:h-[60px] md:w-[150px] w-[100px] h-7 md:h-10 opacity-[0.75] text-white flex justify-center items-center'>
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
