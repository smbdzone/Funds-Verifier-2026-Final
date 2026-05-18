'use client'
import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { Disclosure } from '@headlessui/react'
import { OpenDisclosure, CloseDisclosure } from '@/components/Icons'
import { Checkbox } from '@headlessui/react'
import { DropIcon } from '@/components/Icons/index'

export const AssignRoleTab = () => {
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  return (
    <>
      <span className='text-lg text-prussianBlue/40 mb-4   block'>Profile</span>
      <section className=' '>
        <div className='custom-shadow rounded flex flex-col mb-3 '>
          <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full primary-gradient rounded  px-7  py-4  justify-between items-center flex ${
                    open && 'mb-12'
                  }`}
                >
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                    Assign Role
                  </span>
                  <span className='flex-shrink-0'>
                    {open ? (
                      <OpenDisclosure className='text-white' />
                    ) : (
                      <CloseDisclosure className='text-white' />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as='div' className='gap-4 px-8'>
                  <Disclosure
                    as='div'
                    className={`disclosure`}
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <span className='text-lg text-prussianBlue/40 pl-7 block'>
                          Assign Role
                        </span>
                        <Disclosure.Panel
                          as='div'
                          className='gap-2 px-8 py-4 w-full'
                        >
                          <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 bg-white border-2 border-black/5 rounded-md p-5'>
                            {/* Evaluator Assign */}
                            <div className='relative bg-white lg:col-span-2 shadow-sm border mb-2.5 border-black/5 w-full flex justify-between py-3 pl-5 rounded-md items-center'>
                              <p className='text-black/50'>Evaluator Assign</p>
                              <span
                                className='pr-5 cursor-pointer'
                                onClick={() => toggleDropdown('evaluator')}
                              >
                                <DropIcon />
                              </span>
                              {openDropdown === 'evaluator' && (
                                <div className='absolute right-0 mt-2 top-[30px] bg-white w-[20%] z-20 rounded-md shadow-lg'>
                                  <ul>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 1
                                    </li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 2
                                    </li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 3
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Assign User Name */}
                            <div className='relative bg-white col-span-1 shadow-sm border border-black/5 w-full flex justify-between py-3 pl-5 rounded-md items-center'>
                              <p className='text-black/50'>Assign User Name</p>
                              <span
                                className='pr-5 cursor-pointer'
                                onClick={() => toggleDropdown('username')}
                              >
                                <DropIcon />
                              </span>
                              {openDropdown === 'username' && (
                                <div className='absolute right-0 mt-2 top-[30px] bg-white w-[50%] rounded-md shadow-lg'>
                                  <ul>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 1
                                    </li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 2
                                    </li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 3
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Assign Password */}
                            <div className='relative bg-white col-span-1 shadow-sm border Z-20 border-black/5 w-full flex justify-between py-3 pl-5 rounded-md items-center'>
                              <p className='text-black/50'>Assign Password</p>
                              <span
                                className='pr-5 cursor-pointer'
                                onClick={() => toggleDropdown('password')}
                              >
                                <DropIcon />
                              </span>
                              {openDropdown === 'password' && (
                                <div className='absolute right-0 mt-2 top-[30px] bg-white w-[50%] rounded-md shadow-lg'>
                                  <ul>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 1
                                    </li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 2
                                    </li>
                                    <li className='px-4 py-2 text-center hover:bg-gray cursor-pointer'>
                                      Item 3
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className='text-lg text-prussianBlue/40 pl-7 block mb-2.5'>
                            Security
                          </span>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </Disclosure.Panel>
                <Disclosure.Panel
                  as='div'
                  className='gap-4 px-8 '
                ></Disclosure.Panel>
                <Disclosure.Panel as='div' className='gap-4 px-8 '>
                  <Disclosure
                    as='div'
                    className={`disclosure`}
                    defaultOpen={true}
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`w-full shadow-sm bg-whitesmoke border-2 border-black/5 mb-10  text-sm rounded py-3 px-7 gap-4 justify-between items-center flex ${
                            open && 'mb-10'
                          }`}
                        >
                          <span className='whitespace-nowrap sm:text-xl font-medium text-black/40'>
                            Password
                          </span>
                          <span className='whitespace-nowrap sm:text-xl font-medium text-black/40'>
                            Last changed 22 April 2024
                          </span>
                          <span className='flex-shrink-0'>
                            {open ? (
                              <OpenDisclosure className='text-black/80' />
                            ) : (
                              <CloseDisclosure className='text-black/30' />
                            )}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel
                          as='div'
                          className='lg:gap-16  lg:pl-8  lg:pr-20 flex lg:flex-nowrap flex-wrap '
                        >
                          <div className=''>
                            <h2 className='text-xl  text-black  mb-5 '>
                              Choose a strong password
                            </h2>
                            <input
                              className=' bg-white  py-3 pl-5  border-2 rounded-md w-full  border-black/5  shadow-md mb-4  '
                              placeholder='Old Password*'
                            />
                            <input
                              className=' bg-white  py-3 pl-5  border-2 rounded-md w-full  border-black/5  shadow-md  mb-4  '
                              placeholder='New Password*'
                            />
                            <input
                              className=' bg-white  py-3 pl-5  border-2 rounded-md w-full  border-black/5  shadow-md mb-8 '
                              placeholder='Re-Type New Password*'
                            />
                            <span className='text-lg text-prussianBlue   pl-7 block  text-center font-medium mb-16 '>
                              Cancel
                            </span>
                          </div>
                          <div className='flex-shrink-0 lg:pt-5'>
                            <h2 className='text-xl text-black mb-5'>
                              Choose a strong password
                            </h2>

                            <div className='flex items-center mb-2.5'>
                              <input
                                type='checkbox'
                                className='mr-2 bg-dark-blue'
                              />
                              <p>Minimum 8 Characters</p>
                            </div>
                            <div className='flex items-center mb-2.5'>
                              <input
                                type='checkbox'
                                className='mr-2 bg-dark-blue'
                              />
                              <p>UPPERCASE letter</p>
                            </div>
                            <div className='flex items-center mb-2.5'>
                              <input
                                type='checkbox'
                                className='mr-2 bg-dark-blue'
                              />
                              <p>lowercase letter</p>
                            </div>
                            <div className='flex items-center mb-2.5'>
                              <input
                                type='checkbox'
                                className='mr-2 bg-dark-blue'
                              />
                              <p>Numbers</p>
                            </div>
                            <div className='flex items-center mb-2.5'>
                              <input
                                type='checkbox'
                                className='mr-2 bg-dark-blue'
                              />
                              <p>Special Symbols</p>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        <div className='lg:justify-center flex gap-4 lg:pt-14 '>
          <button className='text-sm py-2.5 px-5 border-2 border-dark-blue rounded-md'>
            Cancel
          </button>
          <button className='text-sm py-2.5 px-5 border-2 rounded-md  text-white primary-gradient  '>
            Save Changes
          </button>
        </div>
      </section>
    </>
  )
}
