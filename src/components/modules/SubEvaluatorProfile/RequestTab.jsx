/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { PlusIcon, UploadIcon } from '@/components/Icons'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from '../../documents/modal'
import DocumentSection from '../EvaluatorProfile/requestCompoenets/DocumentSection'
import InputField from '../EvaluatorProfile/requestCompoenets/InputField'
import EvaluatorEditableFields from '../EvaluatorProfile/requestCompoenets/EvaluatorEditableFields'
import EvaluatorPriceInput from '../EvaluatorProfile/requestCompoenets/EvaluatorPriceInput'
import {
  buildEvaluatorUpdatePayload,
  formatNumericInput,
  initFormattedPrice,
} from '../EvaluatorProfile/requestCompoenets/evaluatorPriceHandlers'
import { handleFileUpload } from '@/libs/uploadAsset'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import { formatNumberWithCommas } from '../../../utils/global-functions/global'
import customAxios from '../../../utils/apis/apis'
import EvaluatorListingMedia from '../EvaluatorProfile/requestCompoenets/EvaluatorListingMedia'
import EvaluatorDateField from '../EvaluatorProfile/requestCompoenets/EvaluatorDateField'
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
  const [fileUrl, setFileUrl] = useState('') // For displaying file URL
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()
  const [listingPrice, setListingPrice] = useState('')
  const [formattedListingPrice, setFormattedListingPrice] = useState('')
  const [sizeSQFT, setSizeSQFT] = useState('')
  const [formattedSizeSQFT, setFormattedSizeSQFT] = useState('')
  const [isSavingDetails, setIsSavingDetails] = useState(false)

  const handleFilechange = async (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    // Backend /upload-certificate only accepts application/pdf.
    const isPdf =
      selectedFile.type === 'application/pdf' ||
      /\.pdf$/i.test(selectedFile.name || '')
    if (isPdf) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2MB.')
        return
      }

      setFileName(selectedFile)
    } else {
      setError('Please upload a PDF file only (evaluation certificate).')
    }
  }

  const fetchPropertyData = async () => {
    try {
      const response = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`
      )
      setProperty(response.data)
      fetchPrice(response?.data.propertyType, response?.data?.bedrooms)
      // Initialize ROI state if available
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
        setFileUrl(response.data.evaluationCertificate) // Update URL from API
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
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
    if (property?.status !== 1 && !certificateDate) {
      toast.error('Please select a certificate date.')
      return
    }

    setIsLoading(true)
    try {
      let fileUpload = ''
      let invoiceUpload = ''
      if (property?.status === 1) {
        invoiceUpload = await handleFileUpload(fileName)
      } else {
        fileUpload = await handleFileUpload(fileName)
      }

      if (fileUpload?._id || invoiceUpload?._id) {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
          {
            roi: roi,
            evaluationPrices: evaluationPrice,
            feedback: feedback,
            ...(listingPrice !== '' ? { price: Number(listingPrice) } : {}),
            ...(sizeSQFT !== '' ? { sizeSQFT: Number(sizeSQFT) } : {}),
            evaluationCertificate:
              fileUpload?._id || property?.evaluationCertificate || null,
            ...(property?.status !== 1 && certificateDate
              ? {
                  evaluationCertificateDate: new Date(
                    certificateDate,
                  ).toISOString(),
                }
              : {}),
            invoice: invoiceUpload?._id || property?.invoice || null,
            status: 1,
          }
        )

        setProperty((prevProperty) => ({
          ...prevProperty,
          roi: roi,
          evaluationPrices: evaluationPrice,
          feedback: feedback,
          evaluationCertificate: fileUpload._id,
          status: 1,
        }))
        fetchPropertyData()
        if (invoiceUpload._id) {
          router.replace('/sub-evaluator-profile/property-evaluation')
          toast.success('Invoice Uploaded successfully')
        } else {
          router.replace('/sub-evaluator-profile/property-evaluation')
          toast.success('Asset approved successfully')
        }
      } else {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
          {
            roi: roi,
            evaluationPrices: evaluationPrice,
            feedback: feedback,
            ...(listingPrice !== '' ? { price: Number(listingPrice) } : {}),
            ...(sizeSQFT !== '' ? { sizeSQFT: Number(sizeSQFT) } : {}),
            status: 1,
          }
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

  const [evaluationPrice, setEvaluationPrice] = useState()
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
    try {
      // Temporary alternative without user ID
      const res = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?subCategory=${subCategory}&value=${value}`
      )

      if (res?.data) {
        setData(res?.data[0])
      }
    } catch (error) {
      console.log(error?.message)
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
            <div className='my-6 flex sm:flex-row flex-col items-start justify-between gap-4'>
              <div className='flex flex-col w-full'>
                <label
                  htmlFor='uploadDocument'
                  className='mb-2 text-sm sm:text-base font-medium text-gray-700'
                >
                  Evaluation Certificate
                </label>
                <div className='w-full flex gap-4 items-center'>
                  <div className='w-full relative flex items-center'>
                    {/* Hide the file input */}

                    <input
                      type='file'
                      id='uploadDocument'
                      name='uploadDocument'
                      accept='.pdf'
                      className='hidden'
                      onChange={handleFilechange}
                    />
                    {/* Custom button to trigger the file input */}
                    <label
                      htmlFor='uploadDocument'
                      className='flex justify-between items-center text-sm sm:text-base w-full py-1 px-2 border rounded-md border-[#8d7c3b] bg-white text-gray-800 cursor-pointer'
                    >
                      <span>
                        {fileName?.name ? fileName.name : 'Upload certificate'}
                      </span>
                      <UploadIcon className='h-8 w-6' />
                    </label>
                  </div>
                </div>
                <p className='m-2 text-xs'>
                  *Only pdfs are acceptable. Pdf should be less than 1mb.
                </p>
              </div>

              <EvaluatorDateField
                id='certificateDate'
                label='Certificate Date'
                value={certificateDate}
                onChange={(e) => setCertificateDate(e.target.value)}
                className='w-full sm:w-auto'
              />

              <div>
                <label className='block text-sm sm:text-base font-medium'>
                  Evaluation Price
                </label>
                <EvaluatorPriceInput
                  value={formattedPrice}
                  onChange={handleEvaluationPrice}
                  placeholder='0'
                />
              </div>
              <div>
                <label className='block text-sm sm:text-base font-medium'>
                  ROI
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={roi}
                    onChange={(e) => setRoi(e.target.value.trim())}
                    className='mt-1 block w-full pl-5 py-3 rounded-md bg-white text-sm sm:text-base border border-[#8d7c3b] text-gray-800 focus:outline-none'
                  />
                  <p className='absolute top-2.5 right-3 '>%</p>
                </div>
              </div>
            </div>
            <div className='w-full flex justify-center'>
              <button
                className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md '
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
                      onChange={handleFilechange}
                    />
                    {/* Custom button to trigger the file input */}
                    <label
                      htmlFor='uploadInvoice'
                      className='flex justify-between items-center text-sm sm:text-base w-full py-1 px-2 border rounded-md border-[#8d7c3b] bg-white text-gray-800 cursor-pointer'
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
                className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md '
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
