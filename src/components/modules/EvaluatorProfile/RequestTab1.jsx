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
import EvaluatorListingMedia from './requestCompoenets/EvaluatorListingMedia'
import EvaluatorDateField from './requestCompoenets/EvaluatorDateField'
import {
  formatDateForInput,
  getRequestDocumentName,
  normalizeRequestDocuments,
  requestDocumentsMissingDate,
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
      setCertificateDate(
        formatDateForInput(response.data.evaluationCertificateDate),
      )

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
  const [newDocument, setNewDocument] = useState('')
  const [newDocumentDate, setNewDocumentDate] = useState('')
  const [certificateDate, setCertificateDate] = useState('')
  const [showTextArea, setShowTextArea] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [editText, setEditText] = useState('')
  const [data, setData] = useState()
  const handleAddDocument = () => {
    if (newDocument.trim() === '') {
      toast.error('Please enter a document name.')
      return
    }
    if (!newDocumentDate) {
      toast.error('Please select a date for the document request.')
      return
    }

    setRequestDocument([
      ...requestDocument,
      { name: newDocument.trim(), document: null, date: newDocumentDate },
    ])
    setNewDocument('')
    setNewDocumentDate('')
    setShowTextArea(false)
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
    if (requestDocumentsMissingDate(requestDocument)) {
      toast.error('Each requested document must have a date.')
      return
    }

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

      if (property?.status !== 1 && !certificateDate) {
        toast.error('Please select a certificate date.')
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
      if (property?.status !== 1 && certificateDate) {
        approvalPayload.evaluationCertificateDate = new Date(
          certificateDate,
        ).toISOString()
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
        <EvaluatorListingMedia
          property={property}
          emptyImage='/listing/no-image.png'
        />
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
                    <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-end'>
                      <textarea
                        rows={1}
                        className='block w-full rounded-md border border-[#969696] bg-white py-2 pl-5 text-sm text-[#969696] sm:text-base'
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        placeholder='Document name'
                      />
                      <EvaluatorDateField
                        id='newDocumentDate'
                        label='Date'
                        value={newDocumentDate}
                        onChange={(e) => setNewDocumentDate(e.target.value)}
                        className='sm:w-48'
                      />
                      <button
                        onClick={handleAddDocument}
                        className='rounded-md border border-blue-500 primary-gradient px-4 py-2 text-sm text-white sm:text-base'
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
            <div className='my-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div className='min-w-0'>
                <label
                  htmlFor='uploadDocument'
                  className='mb-2 block text-sm font-medium text-gray-700 sm:text-base'
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
                  className='flex h-[48px] w-full cursor-pointer items-center justify-between rounded-md border border-[#8d7c3b] bg-white px-3 text-sm text-gray-800 sm:text-base'
                >
                  <span className='truncate pr-2'>
                    {fileName?.name ? fileName.name : 'Upload certificate'}
                  </span>
                  <UploadIcon className='h-6 w-5 shrink-0' />
                </label>
              </div>

              <EvaluatorDateField
                id='certificateDate'
                label='Certificate Date'
                value={certificateDate}
                onChange={(e) => setCertificateDate(e.target.value)}
              />

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
