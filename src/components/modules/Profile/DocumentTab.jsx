import React, { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { CloseDisclosure, OpenDisclosure, UploadIcon } from '@/components/Icons'
import { options, profileDocument } from '@/constants/otherConstants'
import { toast } from 'react-toastify'
import { handleVerificationUpload } from '@/libs/uploadAsset'
import axios from 'axios'
import { useProfile } from '../../../context/UserContext'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import Image from 'next/image'
import customAxios from '../../../utils/apis/apis'

export const DocumentTab = () => {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, fetchProfile } = useProfile()

  // Handle file selection and validation
  const handleFileChange = async (e) => {
    const file = e.target.files[0]

    if (!file) toast.error('Please select the file to upload')

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF or Word document.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB.')
      return
    }
    if (fileType) {
      try {
        setIsLoading(true)
        const fileUpload = await handleVerificationUpload(file)
        // console.log(fileUpload.certificate._id)

        if (fileUpload.certificate?._id) {
          const values = {
            type: fileType,
            document: fileUpload.certificate?._id,
          }

          try {
            const res = await customAxios.put(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/update/${user?.uuid}`,
              { documentation: values }
            )
            if (res?.status === 200) {
              fetchProfile()
              setIsLoading(false)
              toast.success('Document Submitted Successfully')
            }
          } catch (error) {
            console.error(error.message)
            toast.error(error?.message)
          }
        } else {
          toast.error('Failed to upload document.')
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error uploading document:', error)
        toast.error('Failed to upload document.')
      }
    } else {
      toast.error('Please select file name.')
    }
  }
  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
  }

  // Check if a document type is visible (can be viewed/downloaded)
  const isDocumentVisible = (docType) => {
    if (!docType) return false
    const visibleTypes = ['Technical Report', 'Evaluator Invoices', 'Evaluator Invoice']
    const normalizedType = docType.trim().toLowerCase()
    return visibleTypes.some((type) =>
      normalizedType.includes(type.toLowerCase())
    )
  }

  // Get document URL for visible documents
  const getDocumentUrl = (doc) => {
    if (!doc || !doc.document) return null
    return doc.document.url || null
  }

  // Handle document view/download
  const handleViewDocument = (doc) => {
    const url = getDocumentUrl(doc)
    if (url) {
      window.open(url, '_blank')
    }
  }

  const addBlueTickForReact = (profileDocument, secondArray) => {
    // Extract document types from documentation array
    // Documentation may only have { type: "..." } for hidden documents
    const documentTypes = secondArray?.map((doc) => doc.type).filter(Boolean)

    return profileDocument.map((category) => ({
      ...category,
      value: category.value.map((item) => {
        const hasDocument = documentTypes?.includes(item)
        // Find the full doc entry if it exists
        const docEntry = secondArray?.find((doc) => doc.type === item)
        const isVisible = docEntry ? isDocumentVisible(item) : false
        const documentUrl = docEntry ? getDocumentUrl(docEntry) : null

        return {
          name: item,
          hasDocument, // Boolean to indicate a match (for tick mark)
          isVisible, // Whether document can be viewed
          documentUrl, // URL for visible documents
          docEntry, // Full document entry for visible docs
        }
      }),
    }))
  }

  const updatedDoc = addBlueTickForReact(profileDocument, user?.documentation)

  const firstHalf = updatedDoc.slice(0, 4)
  const secondHalf = updatedDoc.slice(4, 8)

  return (
    <>
      <span className='sm:text-base text-sm lg:text-lg text-prussianBlue/40 mb-4 block'>
        {user?.role}
      </span>
      <div className='custom-shadow'>
        <h1 className='font-medium sm:text-lg text-base lg:text-xl md:px-10 px-5 py-5 custom-shadow rounded text-prussianBlue'>
          Documents Storage
        </h1>
        <p className='md:px-10 px-5 md:text-base text-sm py-7'>
          Welcome to document storage! We know how important efficiency and ease
          are in financial and legal processes. Uploading your documents here
          protects your sensitive data and simplifies future transactions. Our
          platform securely stores your papers, eliminating the need to scan and
          upload them for multiple transactions. Knowing where your documents
          are can save you time for bank transactions, evaluations, trust
          agreements, and regulatory compliance. The central location makes it
          easy to view your documents anytime you need them. No more hunting
          through piles of paperwork or computer files—everything you need is
          just a few clicks away. Rest assured that we prioritize your privacy
          and security. Only authorized people can access your encrypted
          documents. Use this convenient feature for easy transactions. Upload
          your documents today to simplify financial and legal management on our
          site.
        </p>
        <div className='rounded custom-shadow md:mx-10 mx-5 pb-3'>
          <Disclosure as='div' className={`disclosure`} defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`w-full btn-gradient rounded py-3 md:px-7 px-3 gap-4 justify-between items-center flex ${
                    open && 'mb-3'
                  }`}
                >
                  <span className='whitespace-nowrap  md:text-base text-sm font-medium text-white'>
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
                  <div className='border-b'>
                    <div className='flex justify-center py-3'>
                      <select
                        name=''
                        id=''
                        onChange={(e) => setFileType(e.target.value)}
                        value={fileType}
                        className='shadow-neons rounded w-1/2 h-[48px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input'
                      >
                        {options.map((ele, i) => (
                          <option key={i} value={ele}>
                            {ele}
                          </option>
                        ))}
                      </select>
                    </div>
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
                      <span
                        title='upload document'
                        className='flex flex-col text-black/50 justify-center items-center text-xs rounded py-3 px-7 font-medium mb-3'
                      >
                        <UploadIcon className='mb-2 h-7 w-7' />
                        Upload Documents
                      </span>
                      <span className='text-black/30 text-sm md:text-base'>
                        Maximum file size: 2MB
                      </span>
                    </label>
                    {error && <p className='text-red-600 mb-4'>{error}</p>}
                    {file && (
                      <div className='flex items-center gap-4 px-4 mb-4'>
                        <p className='font-medium text-sm md:text-base'>
                          {file.name}
                        </p>
                        <button
                          onClick={handleRemoveFile}
                          className='  bg-red-600 text-white rounded-full h-[20px] w-[20px] flex items-center justify-center text-xl hover:bg-red-700 transition'
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='grid sm:grid-cols-2 p-5 md:p-8'>
                    <div>
                      {firstHalf.map((obj, i) => (
                        <div key={obj.id + i} className='mt-2'>
                          <p className='md:text-base text-sm'>
                            {i + 1}. {obj.name}
                          </p>
                          {obj.value.map((item, i) => (
                            <li key={item + i} className='flex items-center gap-2'>
                              <span className='list-disc md:text-base text-sm'>
                                {item.name}
                              </span>
                              {item.hasDocument && (
                                <span className='ml-1 flex items-center gap-2'>
                                  <Image
                                    src='/icons/tick.svg'
                                    alt='tick'
                                    height={20}
                                    width={20}
                                  />
                                  {item.isVisible && item.documentUrl && (
                                    <button
                                      onClick={() => handleViewDocument(item.docEntry)}
                                      className='text-blue-600 hover:text-blue-800 underline text-xs md:text-sm'
                                      title='View document'
                                    >
                                      View
                                    </button>
                                  )}
                                </span>
                              )}
                            </li>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className='mt-2 sm:mt-0'>
                      {secondHalf.map((obj, i) => (
                        <div key={obj.id + i}>
                          <p className='md:text-base text-sm'>
                            {obj.id}. {obj.name}
                          </p>
                          <ul className='list-disc pl-5 mb-4'>
                            {obj.value.map((item, i) => (
                              <li key={item + i} className='flex items-center gap-2'>
                                <span className='list-disc md:text-base text-sm'>
                                  {item.name}
                                </span>
                                {item.hasDocument && (
                                  <span className='ml-1 flex items-center gap-2'>
                                    <Image
                                      src='/icons/tick.svg'
                                      alt='tick'
                                      height={20}
                                      width={20}
                                    />
                                    {item.isVisible && item.documentUrl && (
                                      <button
                                        onClick={() => handleViewDocument(item.docEntry)}
                                        className='text-blue-600 hover:text-blue-800 underline text-xs md:text-sm'
                                        title='View document'
                                      >
                                        View
                                      </button>
                                    )}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <p className='md:px-10 px-5 md:text-base text-sm py-8'>
          {
            'Lorem ipsum roughly translated as “pain itself”. Lorem ipsum presents the sample font and orientation of writing on web pages and other software applications where content is not the main concern of the developer.'
          }
        </p>
        <Loader isOpen={isLoading} />
      </div>
    </>
  )
}
