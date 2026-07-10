/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  return (
    <div>
      <div className='w-full valuesBg flex py-24 md:px-20 flex-col'>
        <div className='container mx-auto text-[#ffffff]'>
          <h1 className='heading text-white md:text-[70px] text-xl fs-60 font-semibold'>
            Advertise with Us
          </h1>
          <p className=' mt-6'>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
      </div>
      <div className='p-6 sm:p-12'>
        <div className='bg-white pt-16 px-2 md:px-20'>
          <div className='text-center mb-12'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12'>
              <div className='border border-[#A2913E] p-6 rounded-md shadow-sm flex flex-col items-center'>
                <Image src='/pricing1.svg' alt='' width={100} height={100} />
                <div className='text-2xl font-semibold mb-2'>
                  Impression Fees
                </div>
                <p className='text-gray-600'>
                  Cost for every 1000 views of your ad.
                </p>
              </div>
              <div className='border border-[#A2913E] p-6 rounded-md shadow-sm flex flex-col items-center'>
                <Image src='/pricing2.svg' alt='' width={100} height={100} />
                <div className='text-2xl font-semibold mb-2'>Click Fees</div>
                <p className='text-gray-600'>
                  The charge incurred each time a user clicks on your ad.
                </p>
              </div>
              <div className='border border-[#A2913E] p-6 rounded-md shadow-sm flex flex-col items-center'>
                <Image src='/pricing3.svg' alt='' width={100} height={100} />
                <div className='text-2xl font-semibold mb-2'>Ad Formats</div>
                <p className='text-gray-600'>
                  Your campaign runs as a Large Quarter-Page Banner.
                </p>
              </div>
            </div>
            <div className=' max-w-2xl mx-auto flex items-center flex-col'>
              <div className='flex w-full  items-center'>
                <div className='flex md:text-4xl justify-center w-full text-xl font-semibold text-[#002D4F] mt-2'>
                  Pricing
                </div>
              </div>
              <div className='flex flex-row gap-2 my-5'>
                <div className='rounded-2xl bg-[#002D4F] w-[31.8px] h-[5.6px]' />
                <div className='rounded-lg bg-[#8D7C3B] w-[84.9px] h-[5.6px]' />
              </div>
            </div>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              We believe in transparency, and our flexible pricing options allow
              you to tailor your advertising campaign to your specific needs.
              Additionally, take note of special considerations:
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
            <div className='border-2 border-[#A2913E] p-6 rounded-lg'>
              <h4 className='text-xl font-bold mb-2'>
                Large Quarter-Page Banner
              </h4>
              <ul className='text-gray-700 list-disc list-inside'>
                <li>Impression Fee: $0.1 (per 1000)</li>
                <li>Image Size: 1080 x 395</li>
              </ul>
            </div>
            <div className='border-2 border-[#A2913E] p-6 rounded-lg'>
              <h4 className='text-xl font-bold mb-2'>Click Fee</h4>
              <ul className='text-gray-700 list-disc list-inside'>
                <li>Click Fee: $0.3 (per click)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='mx-auto flex flex-col items-center justify-center'>
          <Link
            href={'/advertiser-login'}
            className='max-w-[560px] justify-center w-full flex items-center rounded-l-sm font-medium text-white [background:linear-gradient(90deg,_#a2913e,_#d7c590_35.28%,_#a2913e_68.99%,_#d7c58f)]  h-11 cursor-pointer hover:opacity-90 transition-opacity'
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
