import React, { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { CloseDisclosure, OpenDisclosure, UploadIcon } from '@/components/Icons'
import Image from 'next/image'

export const DocumentTab = () => {
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
  const options = [
    'Passport',
    "Driver's License",
    'National ID Card',
    'Utility bills (e.g., electricity, water, gas)',
    'Bank statements',
    'Rental agreement or mortgage statement',
    'Tax returns',
    'Proof of income',
    'Property deeds',
    'Vehicle registration documents',
    'Stock certificates',
    'Power of Attorney',
    'Trust documents',
    'Will and testament',
    'Business registration/license',
    'Articles of incorporation',
    'Financial statements',
    'Health insurance card',
    'Property insurance policy',
    'Anti-money laundering (AML) compliance documents',
    'Know Your Customer (KYC) information',
  ]
  return (
    <>
      <span className='text-lg text-prussianBlue/40 mb-4 block'>
        Asset Holder
      </span>
      <div className='custom-shadow'>
        <h1 className='font-medium tetx-xl px-10 py-5 custom-shadow rounded text-prussianBlue'>
          Documents Storage
        </h1>
        <p className='px-10 py-7'>
          {
            'Lorem ipsum is derived from the Latin. “Lorem ipsum” roughly translated as “pain itself”. Lorem ipsum presents the sample font and orientation of writing on web pages and other software applications where content is not the main concern of the developer. Lorem ipsum is derived from the Latin. “Lorem ipsum” roughly translated as “pain itself”. Lorem ipsum presents the sample font and orientation of writing on web pages and other software applications where content is not the main concern of the developer.'
          }
        </p>
        <div className='rounded custom-shadow mx-10 pb-3'>
          <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full primary-gradient rounded py-3 px-7 gap-4 justify-between items-center flex ${
                    open && 'mb-3'
                  }`}
                >
                  <span className='whitespace-nowrap sm:text-xl font-medium text-white'>
                    Upload Documents
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
                        name=''
                        id='upload'
                        className='hidden'
                      />
                      <UploadIcon className='mb-2' />
                      <span className='custom-shadow rounded py-3 px-7 font-medium mb-3'>
                        Upload Documents
                      </span>
                      <span className='text-black/30'>
                        Maximum file size: 2MB
                      </span>
                    </label>
                    {error && <p className='text-red-600 mb-4'>{error}</p>}
                    {file && (
                      <div className='flex items-center gap-4 px-4 mb-4'>
                        <p className='font-medium'>{file.name}</p>
                        <button
                          onClick={handleRemoveFile}
                          className='  bg-red-600 text-white rounded-full h-[20px] w-[20px] flex items-center justify-center text-xl hover:bg-red-700 transition'
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
        <p className='px-10 py-8'>
          {
            'Lorem ipsum roughly translated as “pain itself”. Lorem ipsum presents the sample font and orientation of writing on web pages and other software applications where content is not the main concern of the developer.'
          }
        </p>
      </div>
    </>
  )
}
