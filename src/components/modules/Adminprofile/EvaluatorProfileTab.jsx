'use client'
import { useState, useEffect } from 'react'
import { Disclosure } from '@headlessui/react'
import Image from 'next/image'
import {
  CloseDisclosure,
  OpenDisclosure,
  UploadIcon,
  PointIcon,
  WhiteMarkIcon,
  Dustpin2kIcon,
  Upload2Icon,
} from '@/components/Icons'
import customAxios from '@/utils/apis/apis'
export const EvaluatorProfileTab = () => {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile)
      setError(null)
    } else {
      setFile(null)
      setError('Only PDF and Word documents are allowed.')
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
  }
  const fetchListingsData = async () => {
    try {
      const [boatResponse, propertyResponse, carResponse, jewelryResponse] =
        await Promise.all([
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/boat`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/property`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/car`),
          customAxios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/jewelry`),
        ])
    } catch (error) {
      console.error('Error fetching listing data:', error)
    }
  }

  useEffect(() => {
    fetchListingsData()
  }, [])

  return (
    <>
      <span className='text-lg text-prussianBlue/40 mb-4 block'>Profile</span>
      <section className=''>
        <div className='custom-shadow rounded flex flex-col mb-16'>
          <Disclosure as='div' className='disclosure' defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full primary-gradient rounded px-7 py-4 mb-6 justify-between items-center flex ${
                    open && 'mb-3'
                  }`}
                >
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                    Evaluator Profile
                  </span>
                  <span className='flex-shrink-0'>
                    {open ? (
                      <OpenDisclosure className='text-white' />
                    ) : (
                      <CloseDisclosure className='text-white' />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel as='div' className='gap-4 px-10'>
                  <div className='bg-white rounded-md shadow-md pr-5 pl-16 py-7 mb-5'>
                    <div className='flex justify-end'>
                      <div className='flex bg-whiteSmoke items-center gap-1 px-2 py-2 rounded-md'>
                        <span>
                          <PointIcon />
                        </span>
                        <span className='text-light-gold title-xs'>Edit</span>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className='w-[116px] h-[116px]'>
                        <figure className='bg-whiteSmoke rounded-full relative w-full h-full overflow-hidden text-center'>
                          <Image
                            src='/evaluator.png'
                            alt='ellips'
                            className='rounded-full'
                          />
                          <div className='bg-white opacity-80 relative top-[78px] h-[40px] flex items-center text-center px-9 gap-2'>
                            <span className='relative'>
                              <WhiteMarkIcon />
                            </span>
                            <span className='text-white relative'>
                              <Dustpin2kIcon />
                            </span>
                          </div>
                        </figure>
                      </div>
                      <div className='pl-5'>
                        <h2 className='text-3xl text-dark-blue font-bold mb-1'>
                          Tareq Billal
                        </h2>
                        <p className='text-lg text-dark-blue'>Evaluator</p>
                      </div>
                    </div>
                  </div>
                  <div className='bg-white rounded-md shadow-md px-5 py-7 mb-5'>
                    <div className='flex justify-between items-center mb-6'>
                      <p className='text-lg text-black/40'>
                        Personal Information
                      </p>
                      <div className='flex bg-whiteSmoke items-center gap-1 px-2 py-2 rounded-md'>
                        <span>
                          <PointIcon />
                        </span>
                        <span className='text-light-gold title-xs'>Edit</span>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 px-5'>
                      <div className='mb-6'>
                        <h2 className='text-lg text-dark-blue mb-2.5'>
                          First Name
                        </h2>
                        <p className='text-sm text-black/40 pl-2.5'>Taraq</p>
                      </div>
                      <div className='mb-6'>
                        <h2 className='text-lg text-dark-blue mb-2.5'>
                          Last Name
                        </h2>
                        <p className='text-sm text-black/40 pl-2.5'>Billal</p>
                      </div>
                      <div className='mb-6'>
                        <h2 className='text-lg text-dark-blue mb-2.5'>Email</h2>
                        <p className='text-sm text-black/40 pl-2.5'>
                          taraqbillal@gmail.com
                        </p>
                      </div>
                      <div className='mb-6'>
                        <h2 className='text-lg text-dark-blue mb-2.5'>
                          Phone_No
                        </h2>
                        <p className='text-sm text-black/40 pl-2.5'>
                          +819128127178231
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='bg-white rounded-md shadow-md px-5 py-7 mb-5'>
                    <div className='flex justify-between items-center mb-6'>
                      <p className='text-lg text-black/40'>
                        Personal Information
                      </p>
                      <div className='flex bg-whiteSmoke items-center gap-1 px-2 py-2 rounded-md'>
                        <span>
                          <PointIcon />
                        </span>
                        <span className='text-light-gold title-xs'>Edit</span>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 px-5'>
                      <div className='mb-6'>
                        <h2 className='text-lg text-dark-blue mb-2.5'>
                          Country
                        </h2>
                        <p className='text-sm text-black/40 pl-2.5'>
                          United Arab Emirates
                        </p>
                      </div>
                      <div className='mb-6'>
                        <h2 className='text-lg text-dark-blue mb-2.5'>
                          City / State
                        </h2>
                        <p className='text-sm text-black/40 pl-2.5'>Dubai</p>
                      </div>
                      <div className='mb-6'>
                        <h2 className='text-lg text-dark-blue mb-2.5'>
                          Post Code
                        </h2>
                        <p className='text-sm text-black/40 pl-2.5'>#87313</p>
                      </div>
                    </div>
                  </div>
                  <div className='custom-shadow rounded flex flex-col gap-2 mb-14 '>
                    <Disclosure
                      as='div'
                      className='disclosure'
                      defaultOpen={true}
                    >
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={`w-full rounded py-3 px-7 shadow-md gap-4 justify-between items-center flex ${
                              open && 'mb-3'
                            }`}
                          >
                            <span className='whitespace-nowrap sm:text-xl font-medium text-black/40'>
                              Documents Storage
                            </span>
                            <span className='flex-shrink-0'>
                              {open ? (
                                <OpenDisclosure className='text-white' />
                              ) : (
                                <CloseDisclosure className='text-white' />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel as='div' className=''>
                            <div className=''>
                              <label
                                onChange={handleFileChange}
                                className='flex cursor-pointer flex-col py-11 justify-center items-center'
                                htmlFor='upload'
                              >
                                <input
                                  type='file'
                                  name='upload'
                                  id='upload'
                                  className='hidden'
                                />
                                <span className='mb-4'>
                                  <Upload2Icon className='' />
                                </span>

                                <span className='custom-shadow rounded py-3  px-7  font-medium mb-3'>
                                  Upload Documents
                                </span>
                                <span className='text-black/30'>
                                  Maximum file size: 2MB
                                </span>
                              </label>
                              {error && (
                                <p className='text-red-600 mb-4'>{error}</p>
                              )}
                              {file && (
                                <div className='flex items-center gap-4 px-4 mb-4'>
                                  <p className='font-medium'>{file.name}</p>
                                  <button
                                    onClick={handleRemoveFile}
                                    className='bg-red-600 text-white rounded-full h-[20px] w-[20px] flex items-center justify-center text-xl hover:bg-red-700 transition'
                                  >
                                    &times;
                                  </button>
                                </div>
                              )}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div className='justify-center flex gap-4'>
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
