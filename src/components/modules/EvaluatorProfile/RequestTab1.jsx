/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { usePathname } from 'next/navigation' // For accessing query parameters
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import { UploadIcon, PlusIcon } from '@/components/Icons'
import Modal from '../../documents/modal'
import DocumentSection from './requestCompoenets/DocumentSection'
import InputField from './requestCompoenets/InputField'
import EvaluatorEditableFields from './requestCompoenets/EvaluatorEditableFields'
import EvaluatorPriceInput from './requestCompoenets/EvaluatorPriceInput'
import {
  buildEvaluatorUpdatePayload,
  formatNumericInput,
  initFormattedPrice,
} from './requestCompoenets/evaluatorPriceHandlers'
import { handleFileUpload } from '@/libs/uploadAsset'
import Loader from './requestCompoenets/Loader'
import { formatNumberWithCommas } from '../../../utils/global-functions/global'
import { IoCheckmarkSharp } from 'react-icons/io5'
import { getCookie } from 'cookies-next'
import customAxios from '../../../utils/apis/apis'
import { useProfile } from '../../../context/UserContext'
import {
  getListingImageSrc,
  getListingVideoSrc,
} from '@/libs/listingCardMedia'
import {
  getRequestDocumentName,
  normalizeRequestDocuments,
  serializeRequestDocuments,
} from '@/utils/requestDocumentUtils'

export const RequestTab1 = () => {
  const { user } = useProfile()
  const path = usePathname()
  const propertyId = path.split('/')[3]
  const [property, setProperty] = useState({})
  const [fileName, setFileName] = useState('')
  const [uploadedFileId, setUploadedFileId] = useState(null)
  const [fileUrl, setFileUrl] = useState('') // For displaying file URL
  const [noMediaFound, setNoMediaFound] = useState(false)
  const [evaluationPrice, setEvaluationPrice] = useState('')
  const [formattedPrice, setFormattedPrice] = useState('')
  const [listingPrice, setListingPrice] = useState('')
  const [formattedListingPrice, setFormattedListingPrice] = useState('')
  const [roi, setRoi] = useState('')
  const [warranty, setWarranty] = useState('')
  const [isSavingDetails, setIsSavingDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    e.target.value = ''

    if (!selectedFile) return

    // Backend /upload-certificate only accepts application/pdf.
    const isPdf =
      selectedFile.type === 'application/pdf' ||
      /\.pdf$/i.test(selectedFile.name || '')
    if (!isPdf) {
      toast.error('Please upload a PDF file only (evaluation certificate).')
      return
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB.')
      return
    }

    setIsLoading(true)
    try {
      const fileUpload = await handleFileUpload(selectedFile)
      if (!fileUpload?._id) {
        setFileName('')
        setUploadedFileId(null)
        toast.error('Failed to upload document.')
        return
      }

      setFileName(selectedFile)
      setUploadedFileId(fileUpload._id)
      toast.success(
        property?.status === 1
          ? 'Invoice uploaded successfully.'
          : 'Certificate uploaded successfully.',
      )
    } catch (error) {
      setFileName('')
      setUploadedFileId(null)
      toast.error(error?.message || 'Failed to upload document.')
    } finally {
      setIsLoading(false)
    }
  }
  const fetchPropertyData = async () => {
    try {
      const response = await customAxios.get(`/car/${propertyId}`)
      setProperty(response.data)
      if (
        response.data.pictures.images > 0 ||
        response.data.video3DWalkthrough > 0
      ) {
        setNoMediaFound(false)
      }
      fetchPrice(response?.data.carType)

      initFormattedPrice(
        response.data.evaluationPrices,
        setEvaluationPrice,
        setFormattedPrice,
      )
      initFormattedPrice(
        response.data.price,
        setListingPrice,
        setFormattedListingPrice,
      )
      setRoi(response.data.roi != null ? String(response.data.roi) : '')
      setWarranty(response.data.warranty || '')

      if (response.data.evaluationCertificate) {
        setFileUrl(response.data.evaluationCertificate) // Update URL from API
      }
      if (response.data.requestDocument) {
        setRequestDocument(
          normalizeRequestDocuments(response.data.requestDocument),
        )
      }
    } catch (error) {
      console.error('Error fetching car data:', error)
    }
  }
  const [requestDocument, setRequestDocument] = useState([])
  const [newDocument, setNewDocument] = useState('') // State for the new document
  const [showTextArea, setShowTextArea] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [editText, setEditText] = useState('')
  const [data, setData] = useState()
  const handleAddDocument = () => {
    if (newDocument.trim() !== '') {
      setRequestDocument([
        ...requestDocument,
        { name: newDocument.trim(), document: null },
      ])
      setNewDocument('')
      setShowTextArea(false)
    }
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    setEditText(getRequestDocumentName(requestDocument[index]))
  }

  const handleSaveEdit = (index) => {
    const updatedDocuments = [...requestDocument]
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      name: editText.trim(),
    }
    setRequestDocument(updatedDocuments)
    setEditIndex(null)
    setEditText('')
  }

  const handleDelete = (index) => {
    const updatedDocuments = requestDocument.filter((_, i) => i !== index)
    setRequestDocument(updatedDocuments)
  }

  const handleRequest = async () => {
    try {
      const response = await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/car/${propertyId}`,
        {
          requestDocument: serializeRequestDocuments(requestDocument),
        }
      )

      if (response.status === 200) {
        // Redirect to seller profile
        toast.success('Requested Successfully')
      } else {
        console.error('Failed to update the product:', response.data)
      }
    } catch (error) {
      console.error('An error occurred while updating the product:', error)
    }
  }

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData()
    }
  }, [propertyId])

  const handleApprove = async (fileName) => {
    setIsLoading(true)
    try {
      let fileUpload = ''
      let invoiceUpload = ''
      if (property?.status === 1) {
        if (uploadedFileId) {
          invoiceUpload = { _id: uploadedFileId }
        } else if (fileName) {
          invoiceUpload = await handleFileUpload(fileName)
        }
      } else if (uploadedFileId) {
        fileUpload = { _id: uploadedFileId }
      } else if (fileName) {
        fileUpload = await handleFileUpload(fileName)
      }
      const certificateId =
        fileUpload?._id || property?.evaluationCertificate || null

      if (property?.status !== 1 && !certificateId) {
        toast.error(
          'Please upload an evaluation certificate before submitting.',
        )
        setIsLoading(false)
        return
      }

      const approvalPayload = buildEvaluatorUpdatePayload({
        listingPrice,
        evaluationPrice,
        warranty,
        includeRoi: false,
        includeWarranty: true,
      })
      if (certificateId) {
        approvalPayload.evaluationCertificate = certificateId
      }
      approvalPayload.invoice = invoiceUpload?._id || property?.invoice || null
      if (certificateId || property?.status === 1) {
        approvalPayload.status = 1
      }

      if (fileUpload?._id || invoiceUpload?._id) {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/car/${propertyId}`,
          approvalPayload,
        )

        setProperty((prevProperty) => ({
          ...prevProperty,
          evaluationPrices: evaluationPrice,
          evaluationCertificate: fileUpload._id,
          status: 1,
        }))

        if (invoiceUpload._id) {
          const role = user?.role
          if (role === 'Evaluator') {
            router.replace('/evaluator-profile/cars-evaluation')
          }
          if (role === 'Sub-Evaluator') {
            router.replace('/sub-evaluator-profile/car-evaluation')
          }

          toast.success('Invoice Uploaded successfully')
        } else {
          const role = user?.role
          if (role === 'Evaluator') {
            router.replace('/evaluator-profile/cars-evaluation')
          }
          if (role === 'Sub-Evaluator') {
            router.replace('/sub-evaluator-profile/car-evaluation')
          }

          toast.success('Asset approved successfully')
        }
      } else if (certificateId || property?.status === 1) {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/car/${propertyId}`,
          approvalPayload,
        )
        toast.success('Asset approved successfully')
      }
    } catch (error) {
      console.error('Error approving item:', error.message)
      toast.error('Failed to approve item')
    } finally {
      setIsLoading(false)
    }
  }

  if (!property) {
    return <div>Loading...</div> // Show a loading state while fetching data
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')

  const handleOpenDoc = (url) => {
    setPdfUrl(url)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const [selectedMedia, setSelectedMedia] = useState(null)

  const handleOpenMedia = (media) => {
    setSelectedMedia(media)
  }

  const handleCloseModal = () => {
    setSelectedMedia(null)
  }

  // Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (e.target.id === 'modalOverlay') {
      handleCloseModal()
    }
  }

  const handleEvaluationPrice = (e) => {
    formatNumericInput(e, setEvaluationPrice, setFormattedPrice)
  }

  const handleListingPrice = (e) => {
    formatNumericInput(e, setListingPrice, setFormattedListingPrice)
  }

  const handleSaveEvaluationDetails = async () => {
    const updateData = buildEvaluatorUpdatePayload({
      listingPrice,
      evaluationPrice,
      roi,
      warranty,
      includeRoi: true,
      includeWarranty: true,
    })

    if (Object.keys(updateData).length === 0) {
      toast.error('Enter at least one value to update')
      return
    }

    setIsSavingDetails(true)
    try {
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/car/${propertyId}`,
        updateData,
      )
      toast.success('Listing updated successfully')
      fetchPropertyData()
    } catch (error) {
      console.error('Error updating car:', error)
      toast.error(
        error?.response?.data?.message || 'Failed to update listing',
      )
    } finally {
      setIsSavingDetails(false)
    }
  }

  const role = 'evaluator'
  const fetchPrice = async (category) => {
    try {
      const res = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?role=${role}&category=${category}`
      )
      if (res?.data) {
        setData(res?.data[0])
      }
    } catch (error) { }
  }

  return (
    <>
      <ToastContainer />
      <span className='lg:text-4xl md:text-2xl text-lg font-bold text-prussianBlue/80 mb-4 block'>
        Assets Information
      </span>

      <div className='gap-2 md:px-8 px-4 py-4 w-full'>
        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Title' value={property.title} />
          <InputField label='Car type' value={property.carType} />
        </div>
        {property?.status !== 1 ? (
          <EvaluatorEditableFields
            variant='pending'
            listingPriceLabel='Price'
            formattedListingPrice={formattedListingPrice}
            onListingPriceChange={handleListingPrice}
            formattedEvaluationPrice={formattedPrice}
            onEvaluationPriceChange={handleEvaluationPrice}
            showEvaluationPrice={false}
            showRoi={false}
            showWarranty
            warranty={warranty}
            onWarrantyChange={setWarranty}
            onSave={handleSaveEvaluationDetails}
            isSaving={isSavingDetails}
          />
        ) : null}
        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Models' value={property.model} />
          <InputField label='Make' value={property.make} />
        </div>
        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Fueltype' value={property.fuelType} />
          <InputField
            label='3D embedded link'
            value={property?.video3DWalkthrough?.link}
          />
        </div>
        {property?.status === 1 ? (
          <EvaluatorEditableFields
            listingPriceLabel='Price'
            formattedListingPrice={formattedListingPrice}
            onListingPriceChange={handleListingPrice}
            formattedEvaluationPrice={formattedPrice}
            onEvaluationPriceChange={handleEvaluationPrice}
            roi={roi}
            onRoiChange={setRoi}
            showRoi
            showWarranty
            warranty={warranty}
            onWarrantyChange={setWarranty}
            onSave={handleSaveEvaluationDetails}
            isSaving={isSavingDetails}
          />
        ) : null}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-[#969696]'>
            Description
          </label>
          <textarea
            rows={3}
            value={property.description || ''}
            className='focus:outline-none mt-1 block w-full pl-5 py-3 rounded-md bg-white text-[#969696] text-sm border border-[#969696]'
            readOnly
          />
        </div>
        <div className='mb-4 grid grid-cols-4'>
          {property?.facilities?.map((item, columnIndex) => (
            <div key={columnIndex} className='col-span-1'>
              <div className='text-base font-normal'>
                <div className='flex flex-row flex-wrap items-center p-2 space-x-2'>
                  <IoCheckmarkSharp className='mr-4' /> {item}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-[#969696]'>
            Media
          </label>
          <div className='mt-1 flex flex-col w-full px-3 py-3 rounded-md bg-white text-[#969696] text-sm border border-[#969696]'>
            {noMediaFound ? (
              <img
                src='/listing/no-image.png'
                alt='No image'
                className='w-full'
              />
            ) : (
              <div className='w-full h-full flex gap-2'>
                {/* 3D Walkthrough container */}
                {property?.video3DWalkthrough?.link ? (
                  <div className='relative cursor-pointer w-64 min-h-full flex-shrink-0 rounded-sm overflow-hidden'>
                    <iframe
                      src={property?.video3DWalkthrough?.link}
                      className='w-full cursor-pointer h-full object-cover'
                      frameBorder='0'
                      title='3D Walkthrough'
                      style={{ pointerEvents: 'none' }}
                    />
                    <div
                      className='absolute inset-0 bg-transparent'
                      onClick={() =>
                        handleOpenMedia(property?.video3DWalkthrough?.link)
                      }
                    />
                  </div>
                ) : null}

                {/* Remaining media container */}
                <div className='flex flex-wrap gap-2'>
                  {[
                    ...(property.pictures
                      ? property.pictures.images.map((image) => ({
                        type: 'image',
                        src: getListingImageSrc(image),
                      }))
                      : []),
                    ...(property.video
                      ? property.video.videos.map((video) => ({
                        type: 'video',
                        src: getListingVideoSrc(video),
                      }))
                      : []),
                  ].map((media, index) => (
                    <div
                      key={index}
                      className='w-28 h-28 cursor-pointer rounded-sm overflow-hidden'
                      onClick={() => handleOpenMedia(media.src)}
                    >
                      {media.type === 'video' ? (
                        <video
                          src={media.src}
                          className='w-full cursor-pointer h-full object-cover rounded-sm'
                          controls
                        />
                      ) : (
                        <img
                          src={media.src}
                          className='w-full cursor-pointer h-full object-cover rounded-sm'
                          alt='Property'
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {selectedMedia && (
            <div
              id='modalOverlay'
              className='fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center'
              onClick={handleClickOutside}
            >
              <div className='w-[50%] lg:h-[50%] bg-white p-2 rounded-md relative'>
                <button
                  className='absolute top-2 right-2 text-4xl'
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
                {selectedMedia.includes('.mp4') ? (
                  <video
                    src={selectedMedia}
                    controls
                    className='w-full h-full object-contain'
                  />
                ) : selectedMedia.includes('.jpg' || '.png') ? (
                  <img
                    src={selectedMedia}
                    alt='Selected'
                    className='w-full h-full object-contain'
                  />
                ) : (
                  <iframe
                    src={selectedMedia}
                    className='w-full h-full object-contain'
                    frameBorder='0'
                    allowFullScreen
                    title='3D Walkthrough'
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {property.status === 1 ? null : (
          <>
            <DocumentSection
              title='Request documents'
              documents={requestDocument}
              handleOpenDoc={handleOpenDoc}
              fetchData={fetchPropertyData}
              setEditText={setEditText}
              handleEdit={handleEdit}
              handleSaveEdit={handleSaveEdit}
              handleDelete={handleDelete}
              editIndex={editIndex}
              editText={editText}
              setEditIndex={setEditIndex}
            />
            <div className='flex sm:flex-row flex-col justify-between w-full sm:items-center items-start sm:gap-0 gap-3 mb-5'>
              <div className='sm:flex sm:items-center gap-3'>
                <div className='sm:flex sm:space-y-0 space-y-2 gap-3'>
                  <button
                    onClick={() => setShowTextArea(!showTextArea)}
                    className='border border-blue-500 px-2 py-2 text-sm sm:text-base rounded-md flex gap-2 items-center'
                  >
                    <div className='flex items-center justify-center rounded-full bg-prussianBlue'>
                      <PlusIcon />
                    </div>
                    <span className='text-prussianBlue sm:text-base text-xs '>
                      Add More Documents
                    </span>
                  </button>
                  {showTextArea && (
                    <div className='flex w-full items-center gap-3'>
                      <textarea
                        rows={1}
                        className='block w-full pl-5 py-2 rounded-md bg-white text-[#969696] text-sm sm:text-base border border-[#969696]'
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                      />
                      <button
                        onClick={handleAddDocument}
                        className='border border-blue-500 primary-gradient text-white px-4 py-2 text-sm sm:text-base rounded-md'
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex sm:justify-center justify-end'>
                <button
                  className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md '
                  onClick={() => handleRequest()}
                >
                  Request
                </button>
              </div>
            </div>
          </>
        )}
        <DocumentSection
          title='Uploaded documents'
          documents={property.uploadDocument}
          handleOpenDoc={handleOpenDoc}
        />
        <Modal isOpen={isModalOpen} onClose={closeModal} fileUrl={pdfUrl} />
        {property.status === 1 ? null : (
          <>
            <div className='my-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='min-w-0'>
                <label
                  htmlFor='uploadDocument'
                  className='mb-2 block text-sm sm:text-base font-medium text-gray-700'
                >
                  Evaluation Certificate
                </label>
                <input
                  type='file'
                  id='uploadDocument'
                  name='uploadDocument'
                  accept='.pdf'
                  className='hidden'
                  onChange={handleFileChange}
                />
                <label
                  htmlFor='uploadDocument'
                  className='flex h-[48px] w-full cursor-pointer items-center justify-between rounded-md border border-[#8d7c3b] bg-white px-3 text-sm sm:text-base text-gray-800'
                >
                  <span className='truncate pr-2'>
                    {fileName?.name ? fileName.name : 'Upload certificate'}
                  </span>
                  <UploadIcon className='h-6 w-5 shrink-0' />
                </label>
              </div>

              <div className='min-w-0'>
                <label className='mb-2 block text-sm sm:text-base font-medium text-gray-700'>
                  Evaluation Price
                </label>
                <EvaluatorPriceInput
                  value={formattedPrice}
                  onChange={handleEvaluationPrice}
                  placeholder='0'
                  className='mt-0'
                />
              </div>
            </div>
            <p className='-mt-2 mb-4 text-xs text-gray-500'>
              *Only PDFs are acceptable. PDF should be less than 2MB.
            </p>
            <div className='w-full flex justify-center'>
              <button
                className='primary-gradient text-white py-2 px-6 text-sm rounded-md '
                onClick={() => handleApprove(fileName)}
              >
                Submit
              </button>
            </div>
          </>
        )}
        {property.status === 1 ? (
          <>
            <div>
              <h1 className='text-lg font-semibold'>Price For</h1>
              <div className='grid sm:grid-cols-2 gap-3'>
                <p className='text-base text-black/80'>
                  Car Type:
                  <span className='text-black/50'>{data?.category}</span>
                </p>
                <p className='text-base text-black/80'>
                  Price:
                  <span className='text-black/50'>
                    AED {formatNumberWithCommas(data?.price)}
                  </span>
                </p>
              </div>
            </div>
            <div className='my-6 flex items-start justify-center gap-4'>
              <div className='flex flex-col w-1/2'>
                <div className='w-full flex gap-4 items-center'>
                  <div className='w-full relative flex items-center'>
                    {/* Hide the file input */}

                    <input
                      type='file'
                      id='uploadInvoice'
                      name='uploadInvoice'
                      accept='.pdf'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                    {/* Custom button to trigger the file input */}
                    <label
                      htmlFor='uploadInvoice'
                      className='flex justify-between items-center text-sm w-full py-1 px-2 border rounded-md border-[#8d7c3b] bg-white text-gray-800 cursor-pointer'
                    >
                      <span>
                        {fileName?.name ? fileName.name : 'Upload Invoice'}
                      </span>
                      <UploadIcon className='h-8 w-6' />
                    </label>
                  </div>
                </div>
                <p className='text-xs m-2 text-center'>
                  *Only pdfs are acceptable. Pdf should be less than 1mb.
                </p>
              </div>
            </div>
            <div className='w-full flex justify-center'>
              <button
                className='primary-gradient text-white py-2 px-6 text-sm rounded-md '
                onClick={() => handleApprove(fileName)}
              >
                Upload
              </button>
            </div>
          </>
        ) : null}
      </div>
      <Loader isOpen={isLoading} />
    </>
  )
}
