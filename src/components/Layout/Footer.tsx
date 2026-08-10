'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { Disclosure } from '@headlessui/react'
import {
  LocationIcon,
  OpenDisclosure,
  CloseDisclosure,
} from '../Icons'
import { Phone, Mail } from 'lucide-react'
import { Instagram, Twitter } from 'lucide-react'
import { FaTiktok, FaFacebookF, FaLinkedinIn } from 'react-icons/fa'
import { useProfile } from '@/context/UserContext'

const FOOTER_DESCRIPTION =
  'Funds Verifier helps buyers and sellers complete secure asset transactions with evaluator-approved listings and trusted fund verification.'

const socialClass =
  'p-1.5 rounded bg-[linear-gradient(135deg,_rgba(162,145,62,1),_rgba(215,197,144,1),_rgba(162,145,62,1))]'

const DEAL_HUNTER_PATH = '/profile'
const ASSET_HOLDER_PATH = '/seller-profile'
const UAE_PASS_LOGIN = '/login'

const OPPORTUNITIES = [
  { href: '/property', label: 'Properties For Sale' },
  { href: '/offplan', label: 'Off Plan Properties' },
  { href: '/car', label: 'Cars For Sale' },
  { href: '/boat', label: 'Boats For Sale' },
  { href: '/jewelry', label: 'Jewelleries For Sale' },
  { href: '/advertise-with-us', label: 'Advertise with us' },
]

const LEGAL_LINKS = [
  { href: '/termsandcondition', label: 'Terms & Conditions' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
]

function buildUaePassLoginHref(redirectPath: string) {
  return `${UAE_PASS_LOGIN}?redirect=${encodeURIComponent(redirectPath)}`
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  const icon = compact ? 'w-3 h-3' : 'w-5 h-5'
  const wrap = compact ? socialClass : `${socialClass} p-2`

  return (
    <div className={`flex ${compact ? 'gap-2' : 'gap-3'}`}>
      <Link
        href='https://www.facebook.com/fundsverifier'
        target='_blank'
        rel='noopener noreferrer'
        className={wrap}
        aria-label='Facebook'
      >
        <FaFacebookF className={`text-black ${icon}`} />
      </Link>
      <Link
        href='https://www.instagram.com/fundsverifier'
        target='_blank'
        rel='noopener noreferrer'
        className={wrap}
        aria-label='Instagram'
      >
        <Instagram className={`text-black ${icon}`} />
      </Link>
      <Link
        href='https://www.linkedin.com/company/fundsverifier'
        target='_blank'
        rel='noopener noreferrer'
        className={wrap}
        aria-label='LinkedIn'
      >
        <FaLinkedinIn className={`text-black ${icon}`} />
      </Link>
      <Link
        href='https://twitter.com/fundsverifier'
        target='_blank'
        rel='noopener noreferrer'
        className={wrap}
        aria-label='X (Twitter)'
      >
        <Twitter className={`text-black ${icon}`} />
      </Link>
      <Link
        href='https://www.tiktok.com/@fundsverifier'
        target='_blank'
        rel='noopener noreferrer'
        className={wrap}
        aria-label='TikTok'
      >
        <FaTiktok className={`text-black ${icon}`} />
      </Link>
    </div>
  )
}

function FooterAccordion({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Disclosure as='div' className='w-full border-b border-white/10'>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full items-center justify-between py-3 text-left'>
            <span className='text-base font-semibold sm:text-xl'>{title}</span>
            <span className='shrink-0'>
              {open ? (
                <OpenDisclosure className='text-[#B7A55E]' />
              ) : (
                <CloseDisclosure className='text-[#B7A55E]' />
              )}
            </span>
          </Disclosure.Button>
          <Disclosure.Panel className='pb-4'>
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

const Footer = () => {
  const { user } = useProfile()

  const quickLinks = useMemo(() => {
    const role = String(user?.role || '')
    const dealHunterHref = user
      ? role === 'DealHunter'
        ? DEAL_HUNTER_PATH
        : buildUaePassLoginHref(DEAL_HUNTER_PATH)
      : buildUaePassLoginHref(DEAL_HUNTER_PATH)
    const assetHolderHref = user
      ? role === 'AssetHolder'
        ? ASSET_HOLDER_PATH
        : buildUaePassLoginHref(ASSET_HOLDER_PATH)
      : buildUaePassLoginHref(ASSET_HOLDER_PATH)

    return [
      { href: '/aboutus', label: 'About Us' },
      { href: dealHunterHref, label: 'Deal Hunter' },
      { href: assetHolderHref, label: 'Asset Holder' },
      { href: '/blog', label: 'News & Trends' },
    ]
  }, [user])

  return (
    <>
      <footer
        style={{ backgroundImage: `url('/assets/images/footer-bg.png')` }}
        className='bg-cover p-2 py-4 text-white min-[1200px]:pb-7 min-[1200px]:pt-10'
      >
        <div className='theme-container'>
          {/* Below 1200px — brand + accordion dropdowns */}
          <div className='flex flex-col gap-4 min-[1200px]:hidden'>
            <div className='w-full'>
              <div className='mb-2 flex items-center gap-2 sm:mb-3'>
                <figure className='mb-1'>
                  <Image
                    src='/assets/images/Group.png'
                    height={78}
                    width={305}
                    alt='Footer Logo'
                    className='h-[40px] w-[50px] sm:h-[50px] sm:w-[70px]'
                  />
                </figure>
                <h2 className='text-sm font-semibold sm:text-lg'>
                  Funds Verifier
                </h2>
              </div>
              <p className='mb-3 text-[12px] leading-relaxed text-white sm:mb-5 sm:text-base'>
                {FOOTER_DESCRIPTION}
              </p>
              <SocialLinks compact />
            </div>

            <FooterAccordion title='Quick Links'>
              <ul className='space-y-2 pl-0.5'>
                {quickLinks.map((item) => (
                  <li key={`${item.label}-${item.href}`} className='text-sm sm:text-base'>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>

            <FooterAccordion title='Opportunities'>
              <ul className='space-y-2 pl-0.5'>
                {OPPORTUNITIES.map((item) => (
                  <li key={item.href} className='text-sm sm:text-base'>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>

            <FooterAccordion title='Get In Touch'>
              <ul className='space-y-3 pl-0.5'>
                <li className='text-sm sm:text-base'>
                  <Link href='tel:+971561290003' className='flex gap-3'>
                    <Phone className='h-5 w-5 shrink-0 text-[#b7a65f]' />
                    +971 56 129 0003
                  </Link>
                </li>
                <li className='text-sm sm:text-base'>
                  <Link
                    href='mailto:outlook@fundsverifier.com'
                    className='flex gap-3'
                  >
                    <Mail className='h-5 w-5 shrink-0 text-[#b7a65f]' />
                    outlook@fundsverifier.com
                  </Link>
                </li>
                <li className='text-sm sm:text-base'>
                  <Link
                    href='https://maps.google.com/?q=Dubai,United+Arab+Emirates'
                    className='flex gap-3'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <LocationIcon className='shrink-0 text-[#b7a65f]' />
                    Dubai, United Arab Emirates
                  </Link>
                </li>
              </ul>
            </FooterAccordion>

            <FooterAccordion title='Rules'>
              <ul className='space-y-2 pl-0.5'>
                {LEGAL_LINKS.map((item) => (
                  <li key={item.href} className='text-sm sm:text-base'>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          {/* 1200px+ — desktop columns */}
          <div className='hidden gap-11 min-[1200px]:flex min-[1200px]:flex-wrap xl:flex-nowrap'>
            <div className='w-[412px]'>
              <div className='mb-3 flex items-center gap-2'>
                <figure>
                  <Image
                    src='/assets/images/Group.png'
                    height={78}
                    width={305}
                    alt='Footer Logo'
                    className='h-[50px] w-[70px]'
                  />
                </figure>
                <h2 className='text-lg font-semibold'>Funds Verifier</h2>
              </div>
              <p className='mb-5 text-base text-white'>{FOOTER_DESCRIPTION}</p>
              <SocialLinks />
            </div>

            <div className='flex flex-1 flex-col'>
              <div className='mb-3 flex justify-between gap-12'>
                <div>
                  <h3 className='mb-3 text-2xl font-medium'>Quick Links</h3>
                  <ul className='space-y-2'>
                    {quickLinks.map((item) => (
                      <li key={`${item.label}-${item.href}`}>
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className='mb-3 text-2xl font-medium'>Opportunities</h3>
                  <ul className='space-y-2'>
                    {OPPORTUNITIES.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='flex-1'>
                  <h3 className='mb-3 text-2xl font-medium'>Get In Touch</h3>
                  <ul className='space-y-3'>
                    <li>
                      <Link href='tel:+971561290003' className='flex gap-4'>
                        <Phone className='h-5 w-5 text-[#b7a65f]' />
                        +971 56 129 0003
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='mailto:outlook@fundsverifier.com'
                        className='flex gap-4'
                      >
                        <Mail className='h-5 w-5 text-[#b7a65f]' />
                        outlook@fundsverifier.com
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='https://maps.google.com/?q=Dubai,United+Arab+Emirates'
                        className='flex gap-4'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <LocationIcon className='text-[#b7a65f]' />
                        Dubai, United Arab Emirates
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='mt-5 border-t border-[rgba(166,149,69,1)] pt-5'>
                <ul className='flex flex-wrap items-center justify-center gap-12 text-sm'>
                  {LEGAL_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className='theme-container flex justify-between gap-1 bg-white py-2 text-[7px] text-prussianBlue sm:flex-wrap sm:gap-3 sm:text-sm'>
        <p>
          Copyright © {new Date().getFullYear()} - All rights reserved Funds
          Verifier
        </p>
        <p>Designed & Developed by SMB Digital Zone</p>
      </div>
    </>
  )
}

export default Footer
