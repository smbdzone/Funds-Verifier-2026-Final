import React from 'react'
import Image from 'next/image'
import brand2 from '@/assets/images/partner-logos/ls.jpg'
import brand4 from '@/assets/images/partner-logos/brand4.jpg'
import brand5 from '@/assets/images/partner-logos/brand-8.webp'


export default function Partners() {
  const logos = [ brand2, brand4, brand5]
  return (
    <div className='container mx-auto py-2 pt-5 sm:pt-14'>
      <div className='text-2xl sm:text-3xl text-[#002D4F] font-semibold text-center w-full mb-5 sm:mb-10'>
        Our Partners
      </div>
      <div className='marquee-container overflow-hidden whitespace-nowrap'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='marquee-content inline-block'>
            {logos.map((logo, index) => (
              <div
                key={`${i}+${index}`}
                className='inline-block rounded-md w-[170px] h-[70px] sm:h-[80px] px-6  py-1 border-[1px] border-[#8D7C3B]/50 overflow-hidden mx-2'
              >
                <div className='flex items-center justify-center h-[80px]'>
                  <Image
                    width={170}
                    height={80}
                    className='object-contain'
                    src={logo}
                    alt={`Logo ${index + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
