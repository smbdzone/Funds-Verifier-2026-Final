/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Image from 'next/image'
import React, { Fragment, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import ProfileDropDown from '../ProfileDropDown/ProfileDropDown'
import SearchInputModal from '@/components/modal/SearchInputModal'
import { useProfile } from '@/context/UserContext'
import { usePathname } from 'next/navigation'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, logout, loading } = useProfile()
  const [isPending, startTransition] = useTransition()
  const path = usePathname()

  // Close mobile navbar (and filter modal) on route changes/redirects.
  useEffect(() => {
    setIsOpen(false)
    setIsModalOpen(false)
  }, [path])

  // useEffect(() => {
  //   startTransition(() => {
  //     fetchProfile()
  //   })
  // }, [])
  const toggle = () => {
    setIsModalOpen(true)
    setIsOpen(false)
  }

  const navLinkClass = (href) => {
    const active =
      href === '/'
        ? path === '/'
        : path === href || path?.startsWith(`${href}/`)
    return `xl:text-lg cursor-pointer text-prussianBlue${active ? ' border-b border-prussianBlue font-medium' : ''
      }`
  }

  return (
    <header className='bg-white !p-2 sm:!p-3 theme-container flex justify-between items-center sm:gap-4'>
      <Link href='/'>
        <figure className='cursor-pointer h-[50px] w-[50px] sm:h-[60px] sm:w-[65px] md:h-[75px] md:w-[78px]'>
          <Image
            src='/assets/images/logo.svg'
            height={30}
            width={30}
            alt='Logo'
            className='h-full w-full object-contain'
          />
        </figure>
      </Link>
      <nav>
        <ul className='hidden xl:flex gap-6 items-end pb-0.5'>
          <Link href='/'>
            <li className={navLinkClass('/')}>Home</li>
          </Link>
          <Link href='/aboutus'>
            <li className={navLinkClass('/aboutus')}>About</li>
          </Link>
          <Link href='/offplan'>
            <li className={navLinkClass('/offplan')}>Off Plan</li>
          </Link>
          <Link href='/auctions'>
            <li className={`${navLinkClass('/auctions')} flex flex-col items-center`}>
              <span className='mb-0.5 block text-[8px] font-medium uppercase leading-none tracking-[0.12em] text-reefGold'>
                Coming soon
              </span>
              <span className='block leading-none'>Auctions</span>
            </li>
          </Link>
          <Link href='/blog'>
            <li className={navLinkClass('/blog')}>News & trends</li>
          </Link>
          <Link href='/contact'>
            <li className={navLinkClass('/contact')}>Contact</li>
          </Link>
        </ul>
      </nav>

      <div className='flex items-center gap-2 sm:gap-6'>
        {path === '/login' ? null : (
          <div className='xl:block hidden'>
            <ProfileDropDown
              isloading={isPending || loading}
              user={user}
              logout={logout}
            />
          </div>
        )}

        <div>
          <div className='block xl:hidden'>
            <Image
              className='h-[30px] w-[30px] sm:w-[78px]'
              src='/menu.svg'
              height={30}
              width={30}
              alt='menu'
              onClick={() => setIsOpen(true)}
            />
            <Transition show={isOpen} as={Fragment}>
              <Dialog
                unmount={false}
                onClose={() => setIsOpen(false)}
                className='fixed z-50 inset-0'
              >
                <div className='flex border w-full h-screen'>
                  <Transition.Child
                    as={Fragment}
                    enter='transition ease-in-out duration-500 transform'
                    enterFrom='-translate-y-full'
                    enterTo='translate-y-0'
                    leave='transition ease-in-out duration-500 transform'
                    leaveFrom='translate-y-0'
                    leaveTo='-translate-y-full'
                  >
                    <nav
                      className={`z-40 bg-[#0B2E4B] flex flex-col border-t-2 border-gray-200 w-full p-5 text-left align-middle shadow-xl absolute h-full`}
                    >
                      <button
                        className='absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-gray-800 focus:outline-none'
                        onClick={() => setIsOpen(false)}
                      >
                        &times; {/* The "X" icon */}
                      </button>
                      <ul className='gap-3 flex flex-col justify-center items-center mt-10'>
                        <li className='px-10'>
                          <ProfileDropDown
                            isloading={isPending || loading}
                            user={user}
                            logout={logout}
                            color='text-white'
                          />
                        </li>
                        <li
                          onClick={toggle}
                          className='text-lg lg:hidden block text-center border-b border-prussianBlue text-white cursor-pointer font-medium'
                        >
                          Filter
                        </li>
                        <li
                          onClick={() => setIsOpen(false)}
                          className='text-lg text-center border-b border-prussianBlue text-white cursor-pointer font-medium'
                        >
                          Home
                        </li>
                        <li
                          onClick={() => setIsOpen(false)}
                          className='text-lg cursor-pointer text-white'
                        >
                          Categories
                        </li>

                        <Link href='/offplan'>
                          <li
                            onClick={() => setIsOpen(false)}
                            className='cursor-pointer text-center text-lg text-white'
                          >
                            Off Plan
                          </li>
                        </Link>

                        <Link href='/auctions'>
                          <li
                            onClick={() => setIsOpen(false)}
                            className='flex cursor-pointer flex-col items-center text-center text-white'
                          >
                            <span className='mb-0.5 block text-[8px] font-medium uppercase leading-none tracking-[0.12em] text-reefGold'>
                              Coming soon
                            </span>
                            <span className='text-lg leading-none'>Auctions</span>
                          </li>
                        </Link>
                        <Link href='/blog'>
                          <li
                            onClick={() => setIsOpen(false)}
                            className='cursor-pointer text-white'
                          >
                            News & trends
                          </li>
                        </Link>
                      </ul>
                    </nav>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <SearchInputModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      )}
    </header>
  )
}
export default Header
