/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { PlusIcon, UploadIcon } from '@/components/Icons'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
import { useProfile } from '../../../context/UserContext'
import { getCookie } from 'cookies-next'
import customAxios from '../../../utils/apis/apis'
import EvaluatorListingMedia from './requestCompoenets/EvaluatorListingMedia'
import EvaluatorDateField from './requestCompoenets/EvaluatorDateField'
import {
  formatDateForInput,
  getRequestDocumentName,
  normalizeRequestDocuments,
  requestDocumentsMissingDate,
  serializeRequestDocuments,
} from '@/utils/requestDocumentUtils'

export const RequestTab = () => {
  const path = usePathname()
  const propertyId = path.split('/')[3]

  const [property, setProperty] = useState({})
  const [roi, setRoi] = useState('')
  const [feedback, setFeedback] = useState('')
  const [fileName, setFileName] = useState('')
  const [uploadedFileId, setUploadedFileId] = useState(null)
  const [fileUrl, setFileUrl] = useState('') // For displaying file URL
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()
  const [requestLoading, setRequestLoading] = useState(false)
  const [listingPrice, setListingPrice] = useState('')
  const [formattedListingPrice, setFormattedListingPrice] = useState('')
  const [sizeSQFT, setSizeSQFT] = useState('')
  const [formattedSizeSQFT, setFormattedSizeSQFT] = useState('')
  const [isSavingDetails, setIsSavingDetails] = useState(false)

  const handleFilechange = async (e) => {
    const selectedFile = e.target.files[0]
    e.target.value = ''

    if (!selectedFile) return

    // Backend /upload-certificate only accepts application/pdf (multer + encryption pipeline).
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
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
      )
      setProperty(response.data)
      fetchPrice(response?.data.propertyType, response?.data?.bedrooms)
      // Initialize states if available
      setRoi(response?.data.roi != null ? String(response.data.roi) : '')
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
      initFormattedPrice(
        response.data.sizeSQFT,
        setSizeSQFT,
        setFormattedSizeSQFT,
      )
      setFeedback(response.data.feedback || '')
      setCertificateDate(
        formatDateForInput(response.data.evaluationCertificateDate),
      )
      if (response.data.evaluationCertificate) {
        setFileUrl(response.data.evaluationCertificate)
      }
      if (response.data.requestDocument) {
        setRequestDocument(
          normalizeRequestDocuments(response.data.requestDocument),
        )
      }
    } catch (error) {
      console.error('Error fetching property data:', error)
    }
  }

  const router = useRouter()
  const [requestDocument, setRequestDocument] = useState([])
  const [newDocument, setNewDocument] = useState('')
  const [newDocumentDate, setNewDocumentDate] = useState('')
  const [certificateDate, setCertificateDate] = useState('')
  const [showTextArea, setShowTextArea] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [editText, setEditText] = useState('')
  const { user } = useProfile()

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

    setRequestLoading(true)
    try {
      const response = await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
        {
          requestDocument: serializeRequestDocuments(requestDocument),
        },
      )

      if (response.status === 200) {
        toast.success('Requested Successfully')
      } else {
        console.error('Failed to update the product:', response.data)
      }
    } catch (error) {
      console.error('An error occurred while updating the product:', error)
    } finally {
      setRequestLoading(false)
    }
  }

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData()
    }
  }, [propertyId])

  const handleApprove = async () => {
    if (!uploadedFileId && !fileName && property?.status !== 1) {
      toast.error('Please select a file to upload.')
      return
    }

    if (property?.status !== 1 && !certificateDate) {
      toast.error('Please select a certificate date.')
      return
    }

    setIsLoading(true)
    try {
      let uploadedFile = null
      let updateData = {
        roi: roi,
        evaluationPrices: evaluationPrice,
      }
      if (listingPrice !== '') updateData.price = Number(listingPrice)
      if (sizeSQFT !== '') updateData.sizeSQFT = Number(sizeSQFT)

      if (uploadedFileId) {
        uploadedFile = { _id: uploadedFileId }
      } else if (fileName) {
        uploadedFile = await handleFileUpload(fileName)

        if (!uploadedFile || !uploadedFile._id) {
          throw new Error('File upload failed')
        }
      }

      // Determine what type of upload this is based on property status
      if (property?.status === 1) {
        // This is an invoice upload for completed evaluation
        if (uploadedFile) {
          updateData.invoice = uploadedFile._id
        }
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
          updateData,
        )

        toast.success('Invoice uploaded successfully')
        router.replace('/evaluator-profile/property-evaluation')
      } else {
        // This is an evaluation certificate upload
        if (uploadedFile) {
          updateData.evaluationCertificate = uploadedFile._id
        }
        updateData.evaluationCertificateDate = new Date(
          certificateDate,
        ).toISOString()
        updateData.status = 1
        if (
          updateData.status &&
          updateData.evaluationCertificate &&
          updateData.evaluationCertificateDate &&
          updateData.roi &&
          updateData.evaluationPrices
        ) {
          await customAxios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
            updateData,
          )

          toast.success('Asset approved successfully')
          const role = user?.role
          if (role === 'Evaluator') {
            router.replace('/evaluator-profile/property-evaluation')
          } else {
            router.replace('/sub-evaluator-profile/property-evaluation')
          }
        } else {
          toast.error('All fields are required')
        }
      }

      // Update local state
      setProperty((prevProperty) => ({
        ...prevProperty,
        ...updateData,
      }))

      fetchPropertyData()
    } catch (error) {
      console.error('Error approving item:', error)
      toast.error('Failed to process request: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!property) {
    return <div>Loading...</div>
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

  const [evaluationPrice, setEvaluationPrice] = useState('')
  const [formattedPrice, setFormattedPrice] = useState('')

  const handleEvaluationPrice = (e) => {
    formatNumericInput(e, setEvaluationPrice, setFormattedPrice)
  }

  const handleListingPrice = (e) => {
    formatNumericInput(e, setListingPrice, setFormattedListingPrice)
  }

  const handleSqftChange = (e) => {
    formatNumericInput(e, setSizeSQFT, setFormattedSizeSQFT)
  }

  const handleSaveEvaluationDetails = async () => {
    const isPending = property?.status !== 1
    const updateData = buildEvaluatorUpdatePayload({
      listingPrice,
      evaluationPrice: isPending ? '' : evaluationPrice,
      roi: isPending ? '' : roi,
      sizeSQFT: isPending ? sizeSQFT : '',
      includeRoi: !isPending,
    })

    if (Object.keys(updateData).length === 0) {
      toast.error('Enter at least one value to update')
      return
    }

    setIsSavingDetails(true)
    try {
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
        updateData,
      )
      toast.success('Listing updated successfully')
      fetchPropertyData()
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error(
        error?.response?.data?.message || 'Failed to update listing',
      )
    } finally {
      setIsSavingDetails(false)
    }
  }

  const fetchPrice = async (subCategory, value) => {
    const id = user?.uuid
    try {
      const res = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?userUUID=${id}&subCategory=${subCategory}&value=${value}`,
      )

      if (res?.data) {
        setData(res?.data[0])
      }
    } catch (error) {
      console.error('Error fetching price data:', error?.message)
    }
  }

  return (
    <>
      <ToastContainer />
      <span className='lg:text-4xl md:text-2xl text-lg font-bold text-prussianBlue/80 mb-4 block'>
        Assets Information
      </span>

      <div className='gap-2 sm:px-8 px-4 py-4 w-full'>
        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Title' value={property.title} />
          <InputField label='Phone Number' value={property.phoneNumber} />
        </div>
        {property?.status === 1 ? (
          <div className='mb-4 grid sm:grid-cols-2 gap-4'>
            <InputField
              label='Size in square feet'
              value={formatNumberWithCommas(property.sizeSQFT)}
            />
          </div>
        ) : null}

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
            showSqft
            formattedSqft={formattedSizeSQFT}
            onSqftChange={handleSqftChange}
            onSave={handleSaveEvaluationDetails}
            isSaving={isSavingDetails}
          />
        ) : null}

        {property.assetType == 'Property for lease' && (
          <div className='mb-4 grid sm:grid-cols-2 gap-4'>
            <InputField
              label='Lease Number of cheques'
              value={property.lease}
            />
            <InputField label='Bedrooms' value={property.bedrooms} />
          </div>
        )}

        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Bathrooms' value={property.bathrooms} />
          <InputField label='Developer' value={property.developer} />
        </div>

        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField
            label='Is it furnished'
            value={property.isFurnished ? 'Yes' : 'No'}
          />
          <InputField
            label='Occupancy Status'
            value={property.occupancyStatus}
          />
        </div>

        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Listing' value={property.listing} />
          <InputField
            label='3D embedded link'
            value={property?.video3DWalkthrough?.link}
          />
        </div>

        {property?.status === 1 ? (
          <EvaluatorEditableFields
            formattedListingPrice={formattedListingPrice}
            onListingPriceChange={handleListingPrice}
            formattedEvaluationPrice={formattedPrice}
            onEvaluationPriceChange={handleEvaluationPrice}
            roi={roi}
            onRoiChange={setRoi}
            showRoi
            onSave={handleSaveEvaluationDetails}
            isSaving={isSavingDetails}
          />
        ) : null}

        <div className='mb-4'>
          <label className='block text-sm sm:text-base font-medium text-[#969696]'>
            Description
          </label>
          <textarea
            rows={3}
            value={property.description || ''}
            className='focus:outline-none mt-1 block w-full pl-5 py-3 rounded-md bg-white text-[#969696] text-sm sm:text-base border border-[#969696]'
            readOnly
          />
        </div>

        <EvaluatorListingMedia property={property} />

        {property?.status === 1 ? null : (
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
                <div className='flex sm:flex-row flex-col sm:space-y-0 space-y-2 gap-3'>
                  <button
                    onClick={() => setShowTextArea(!showTextArea)}
                    className='border border-blue-500 px-2 py-2 text-sm sm:text-base rounded-md flex gap-2 items-center'
                  >
                    <div className='flex items-center justify-center rounded-full bg-prussianBlue'>
                      <PlusIcon />
                    </div>
                    <span className='text-prussianBlue truncate sm:text-base text-xs '>
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
          fetchData={fetchPropertyData}
        />
        <Modal isOpen={isModalOpen} onClose={closeModal} fileUrl={pdfUrl} />

        {property.status === 1 ? null : (
          <>
            <div className='my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
                  onChange={handleFilechange}
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

              <div className='min-w-0'>
                <label className='mb-2 block text-sm sm:text-base font-medium text-gray-700'>
                  ROI
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={roi}
                    onChange={(e) => setRoi(e.target.value.trim())}
                    className='block h-[48px] w-full rounded-md border border-[#8d7c3b] bg-white pl-3 pr-10 text-sm sm:text-base text-gray-800 focus:outline-none'
                  />
                  <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600'>
                    %
                  </span>
                </div>
              </div>
            </div>
            <p className='-mt-2 mb-4 text-xs text-gray-500'>
              *Only PDFs are acceptable. PDF should be less than 2MB.
            </p>
            <div className='w-full flex justify-center'>
              <button
                className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md '
                onClick={handleApprove}
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
                  Category:
                  <span className='text-black/50'>{data?.category}</span>
                </p>
                <p className='text-base text-black/80'>
                  Subcategory:
                  <span className='text-black/50'>{data?.subCategory}</span>
                </p>
                <p className='text-base text-black/80'>
                  Bedrooms:
                  <span className='text-black/50'>
                    {data?.value} bedrooms {data?.subCategory}
                  </span>
                </p>
                <p className='text-base text-black/80'>
                  Price:
                  <span className='text-black/50'>
                    AED {formatNumberWithCommas(data?.price)}
                  </span>
                </p>
              </div>
            </div>
            <div className='my-6 mx-auto w-full max-w-xl'>
              <label
                htmlFor='uploadInvoice'
                className='mb-2 block text-sm sm:text-base font-medium text-gray-700'
              >
                Invoice
              </label>
              <input
                type='file'
                id='uploadInvoice'
                name='uploadInvoice'
                accept='.pdf'
                className='hidden'
                onChange={handleFilechange}
              />
              <label
                htmlFor='uploadInvoice'
                className='flex h-[48px] w-full cursor-pointer items-center justify-between rounded-md border border-[#8d7c3b] bg-white px-3 text-sm sm:text-base text-gray-800'
              >
                <span className='truncate pr-2'>
                  {fileName?.name ? fileName.name : 'Upload Invoice'}
                </span>
                <UploadIcon className='h-6 w-5 shrink-0' />
              </label>
              <p className='mt-2 text-xs text-center text-gray-500'>
                *Only PDFs are acceptable. PDF should be less than 2MB.
              </p>
            </div>
            <div className='w-full flex justify-center'>
              <button
                className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md '
                onClick={handleApprove}
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
