import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment } from 'react'
import { ProfileDropDownIcon } from '../Icons'
import Link from 'next/link'
import { Loader2Icon } from 'lucide-react'

const ProfileDropDown = ({ user, logout, isloading = false, color }: any) => {
  const handleRedirect = (user: any) => {
    if (user?.role === 'AssetHolder') {
      return '/seller-profile'
    } else if (user?.role === 'Evaluator') {
      return '/evaluator-profile'
    } else if (user?.role === 'DealHunter') {
      return '/profile'
    } else if (user?.role === 'Trustee') {
      return '/trustee'
    } else if (user?.role === '3dWalkthrough') {
      return '/3d-walkthrough'
    } else if (user?.role === 'TechnicalReport') {
      return '/survey-dashboard'
    } else {
      return '/'
    }
  }
  return (
    <>
      {isloading ? (
        <span className='animate-spin inline-block'>
          <Loader2Icon />
        </span>
      ) : (
        <div>
          {user ? (
            <Menu as='div' className='relative text-left z-100'>
              <Menu.Button className='btn !min-w-max flex items-center gap-2'>
                <figure>
                  <Image
                    src={
                      user?.profileImage || '/assets/images/dummy-profile.png'
                    }
                    alt='Profile'
                    height={57}
                    width={57}
                    className='rounded-full'
                  />
                </figure>
                <div>
                  <h2
                    className={` ${
                      color ? color : 'text-prussianBlue'
                    } text-xs font-semibold`}
                  >
                    {user?.name}
                  </h2>
                  <span
                    className={`${
                      color ? color : 'text-prussianBlue'
                    } text-[10px] block text-start`}
                  >
                    {user?.role}
                  </span>
                </div>
                <ProfileDropDownIcon />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute right-0 mt-2 w-[120px] sm:w-[200px] origin-top-right bg-white shadow-md rounded-lg'>
                  <div className='flex flex-col'>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={handleRedirect(user)}
                          className={`w-full text-left cursor-pointer px-4 py-2 text-sm ${
                            active ? 'bg-gray-100' : ''
                          }`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => logout()}
                          className={`w-full text-left cursor-pointer px-4 py-2 text-sm ${
                            active ? 'bg-gray-100' : ''
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <div className='flex space-x-0 py-2 rounded-[4px] border-2 border-[#8D7C3B]'>
              <Link href='/login'>
                <span className='px-4 py-2 xl:text-[#0F3453] text-[#8D7C3B] rounde transition duration-300'>
                  Sign In
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ProfileDropDown
