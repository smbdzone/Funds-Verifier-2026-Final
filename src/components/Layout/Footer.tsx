import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  EmailIcon,
  FaceBookIcon,
  InstaIcon,
  LinkdInIcon,
  LocationIcon,
  PhoneIcon,
  TickTokIcon,
  TwitterIcon,
} from '../Icons'
// import dynamic from 'next/dynamic'
import { Phone, Mail } from 'lucide-react'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { FaTiktok, FaFacebookF, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
  return (
    <>
      <footer
        style={{ backgroundImage: `url('/assets/images/footer-bg.png')` }}
        className='text-white py-4 p-2 bg-cover lg:pb-7 lg:pt-10 lg:py-5'
      >
        <div className='theme-container'>
          {/* Mobile Layout */}
          <div className='flex flex-wrap lg:hidden gap-1 sm:gap-5'>
            {/* Logo & Description */}
            <div className='w-full'>
              <div className='flex items-center gap-2 sm:mb-3'>
                <figure className='mb-3'>
                  <Image
                    src='/assets/images/Group.png'
                    height={78}
                    width={305}
                    alt='Footer Logo'
                    className='sm:h-[50px] sm:w-[70px] h-[40px] w-[50px]'
                  />
                </figure>
                <h1 className='text-sm sm:text-lg font-semibold'>
                  Funds Verifier
                </h1>
              </div>
              <p className='text-white text-[10px] sm:text-[20px] mb-2 sm:mb-5'>
                Lorem presents the sample font and orientation of writing on web
                pages other software applications where content.
              </p>

              <div className='flex gap-2'>
                <Link
                  href='https://facebook.com'
                  target='_blank'
                  className='p-1 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <FaFacebookF className='text-black w-3 h-3' />
                </Link>
                <Link
                  href='https://instagram.com'
                  target='_blank'
                  className='p-1 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <Instagram className='text-black w-3 h-3' />
                </Link>
                <Link
                  href='https://linkedin.com'
                  target='_blank'
                  className='p-1 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <FaLinkedinIn className='text-black w-3 h-3' />
                </Link>
                <Link
                  href='https://twitter.com'
                  target='_blank'
                  className='p-1 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <Twitter className='text-black w-3 h-3' />
                </Link>
                <Link
                  href='https://tiktok.com'
                  target='_blank'
                  className='p-1 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <FaTiktok className='text-black w-3 h-3' />
                </Link>
              </div>
            </div>

            {/* Quick Links + Opportunities */}
            <div className='flex justify-between w-full gap-10'>
              <div>
                <h3 className='text-[14px] sm:text-xl font-medium mb-2 sm:mb-5'>
                  Quick Links
                </h3>
                <ul>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/aboutus'>About Us</Link>
                    About Us
                  </li>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/profile'>Deal Hunter</Link>
                    Deal Hunter
                  </li>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/seller-profile'>Asset Holder</Link>
                    Asset Holder
                  </li>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/blog'>News & Trends</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-[14px] sm:text-xl font-medium mb-2 sm:mb-5'>
                  Opportunities
                </h3>
                <ul>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/property'>Properties For Sale</Link>
                  </li>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/car'>Cars For Sale</Link>
                  </li>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/boat'>Boats For Sale</Link>
                  </li>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/jewelry'>Jewelleries For Sale</Link>
                  </li>
                  <li className='text-[12px] sm:text-base mb-2'>
                    <Link href='/advertise-with-us'>Advertise with us</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className='w-full'>
              <h3 className='text-[16px] sm:text-xl font-medium mb-2 sm:mb-3'>
                Get In Touch
              </h3>
              <ul>
                <li className='text-[12px] sm:text-base mb-2'>
                  <Link href='tel:+971559199661' className='flex gap-4'>
                    <PhoneIcon className='text-reefGold' /> +971 55 91 99 661
                  </Link>
                </li>
                <li className='text-[12px] sm:text-base mb-2'>
                  <Link
                    href='mailto:smbdigitalzone@gmail.com'
                    className='flex gap-4'
                  >
                    <EmailIcon className='text-reefGold' height={10} />{' '}
                    smbdigitalzone@gmail.com
                  </Link>
                </li>
                <li className='text-[12px] sm:text-base mb-2'>
                  <Link
                    href='https://goo.gl/maps/BurjKhalifa'
                    className='flex gap-4'
                  >
                    <LocationIcon className='text-reefGold' />
                    Burj Khalifa district, Dubai,{' '}
                    <br className='md:hidden block' />
                    United Arab Emirates
                  </Link>
                </li>
              </ul>
            </div>

            <div className='border-t border-[rgba(166,149,69,1)] pt-3 '>
              <ul className='flex items-center justify-center gap-10 text-[10px] sm:text-sm'>
                <li className='text-[12px]'>
                  Terms & Conditions Cookie Policy
                </li>
                <li className='text-[12px]'>Privacy Policy Disclaimer</li>
              </ul>
            </div>
          </div>

          {/* Large Screen Layout */}
          <div className='hidden lg:flex gap-11 flex-wrap xl:flex-nowrap'>
            {/* Logo + Text */}
            <div className='w-[412px]'>
              <div className='flex items-center gap-2 mb-3'>
                <figure>
                  <Image
                    src='/assets/images/Group.png'
                    height={78}
                    width={305}
                    alt='Footer Logo'
                    className='h-[50px] w-[70px]'
                  />
                </figure>
                <h1 className='text-lg font-semibold'>Funds Verifier</h1>
              </div>
              <p className='text-white text-base mb-5'>
                Lorem presents the sample font and orientation of writing on web
                pages other software applications where content.
              </p>
              <div className='flex gap-3'>
                <Link
                  href='https://facebook.com'
                  target='_blank'
                  className='p-2 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <FaFacebookF className='text-black w-5 h-5' />
                </Link>
                <Link
                  href='https://instagram.com'
                  target='_blank'
                  className='p-2 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <Instagram className='text-black w-5 h-5' />
                </Link>
                <Link
                  href='https://linkedin.com'
                  target='_blank'
                  className='p-2 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <FaLinkedinIn className='text-black w-5 h-5' />
                </Link>
                <Link
                  href='https://twitter.com'
                  target='_blank'
                  className='p-2 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <Twitter className='text-black w-5 h-5' />
                </Link>
                <Link
                  href='https://tiktok.com'
                  target='_blank'
                  className='p-2 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'
                >
                  <FaTiktok className='text-black w-5 h-5' />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className='flex flex-col'>
              <div className='flex justify-between gap-20 mb-3'>
                <div>
                  <h3 className='text-2xl font-medium mb-3'>Quick Links</h3>
                  <ul className='space-y-2'>
                    <li>
                      <Link href='/aboutus'>About Us</Link>
                    </li>
                    <li>
                      <Link href='/profile'>Deal Hunter</Link>
                    </li>
                    <li>
                      <Link href='/seller-profile'>Asset Holder</Link>
                    </li>
                    <li>
                      <Link href='/blog'>News & Trends</Link>
                    </li>
                  </ul>
                </div>

                {/* Opportunities */}
                <div>
                  <h3 className='text-2xl font-medium mb-3'>Opportunities</h3>
                  <ul className='space-y-2'>
                    <li>
                      <Link href='/property'>Properties For Sale</Link>
                    </li>
                    <li>
                      <Link href='/car'>Cars For Sale</Link>
                    </li>
                    <li>
                      <Link href='/boat'>Boats For Sale</Link>
                    </li>
                    <li>
                      <Link href='/jewelry'>Jewelleries For Sale</Link>
                    </li>
                    <li>
                      <Link href='/advertise-with-us'>Advertise with us</Link>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className='flex-1'>
                  <h3 className='text-2xl font-medium mb-3'>Get In Touch</h3>
                  <ul className='space-y-3'>
                    <li>
                      <Link href='tel:+971559199661' className='flex gap-4'>
                        <Phone className='h-5 w-5 text-[#b7a65f]' /> +971 55 91
                        99 661
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='mailto:smbdigitalzone@gmail.com'
                        className='flex gap-4'
                      >
                        <Mail className='h-5 w-5 text-[#b7a65f]' />{' '}
                        smbdigitalzone@gmail.com
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='https://goo.gl/maps/BurjKhalifa'
                        className='flex gap-4'
                      >
                        <LocationIcon className='text-[#b7a65f]' /> Burj Khalifa
                        district, Dubai, UAE
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='border-t border-[rgba(166,149,69,1)] pt-5 mt-5'>
                <ul className='flex flex-wrap items-center justify-center gap-20 text-sm'>
                  <Link href='/termsandcondition'>Terms & Conditions</Link>
                  <Link href={'/privacy-policy'}>Privacy Policy</Link>
                  <Link href='/cookies'>Cookie Policy</Link>
                  <Link href='/disclaimer'>Disclaimer</Link>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className='bg-white theme-container py-2 flex justify-between sm:flex-wrap text-[7px] sm:text-sm text-prussianBlue gap-1 sm:gap-3'>
        <p>
          Copyright © {new Date().getFullYear()} - All rights reserved Funds
          Verifier
        </p>
        <p>Designed & Developed by SMB Digital Zone</p>
      </div>
    </>
  )
}

// export default dynamic(() => Promise.resolve(Footer), { ssr: false })
export default Footer
