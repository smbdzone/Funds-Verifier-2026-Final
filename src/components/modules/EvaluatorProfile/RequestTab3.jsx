/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { usePathname } from 'next/navigation' // For accessing query parameters
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UploadIcon } from '@/components/Icons'
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
import { formatListingCardPrice } from '@/libs/listingPriceDisplay'
import { getCookie } from 'cookies-next'
import customAxios from '../../../utils/apis/apis'
import EvaluatorListingMedia from './requestCompoenets/EvaluatorListingMedia'
import { useProfile } from '../../../context/UserContext'
import EvaluatorDateField from './requestCompoenets/EvaluatorDateField'
import RequestDocumentsActions from './requestCompoenets/RequestDocumentsActions'
import {
  EvaluatorAmenitiesList,
  EvaluatorAssetHolderFields,
} from './requestCompoenets/EvaluatorListingContactFields'
import {
  buildEvaluatorUploadedDocuments,
  formatDateForInput,
  getRequestDocumentName,
  normalizeRequestDocuments,
  openListingDocumentInNewTab,
  requestDocumentsMissingDate,
  serializeRequestDocuments,
} from '@/utils/requestDocumentUtils'

export const RequestTab3 = () => {
  const { user } = useProfile()
  const path = usePathname()
  const propertyId = path.split('/')[3]
  const [property, setProperty] = useState({})
  const [roi, setRoi] = useState('')
  const [fileName, setFileName] = useState('')
  const [uploadedFileId, setUploadedFileId] = useState(null)
  const [fileUrl, setFileUrl] = useState('') // For displaying file URL
  const [evaluationPrice, setEvaluationPrice] = useState('')
  const [formattedPrice, setFormattedPrice] = useState('')
  const [listingPrice, setListingPrice] = useState('')
  const [formattedListingPrice, setFormattedListingPrice] = useState('')
  const [isSavingDetails, setIsSavingDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      const response = await customAxios.get(`/jewelry/${propertyId}`)
      setProperty(response.data)
      fetchPrice(
        response?.data?.category,
        response?.data?.model,
        response?.data.category
      )
      // Initialize ROI state if available
      setRoi(response.data.roi != null ? String(response.data.roi) : '')
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
      console.error('Error fetching jewelry data:', error)
    }
  }

  /** Poll only request-document status — do not reset price/ROI/media. */
  const refreshRequestDocuments = async () => {
    if (!propertyId) return
    try {
      const response = await customAxios.get(`/jewelry/${propertyId}`)
      setRequestDocument(
        normalizeRequestDocuments(response.data?.requestDocument),
      )
    } catch (error) {
      console.error('Error refreshing request documents:', error)
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry/${propertyId}`,
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

      const approvalPayload = {
        evaluationPrices: evaluationPrice,
        invoice: invoiceUpload?._id || property?.invoice || null,
      }
      if (certificateId) {
        approvalPayload.evaluationCertificate = certificateId
      }
      if (property?.status !== 1 && certificateDate) {
        approvalPayload.evaluationCertificateDate = new Date(
          certificateDate,
        ).toISOString()
      }
      if (certificateId || property?.status === 1) {
        approvalPayload.status = 1
      }

      if (fileUpload?._id || invoiceUpload?._id) {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry/${propertyId}`,
          approvalPayload,
        )

        setProperty((prevProperty) => ({
          ...prevProperty,
          evaluationPrices: evaluationPrice,
          evaluationCertificate: fileUpload._id,
          status: 1,
        }))

        const role = user?.role
        if (invoiceUpload._id) {
          if (role === 'Evaluator') {
            router.replace('/evaluator-profile/jewellery-evaluation')
          }

          toast.success('Invoice Uploaded successfully')
        } else {
          if (role === 'Evaluator') {
            router.replace('/evaluator-profile/jewellery-evaluation')
          }

          toast.success('Asset approved successfully')
        }
      } else if (certificateId || property?.status === 1) {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry/${propertyId}`,
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
  const [pdfFileName, setPdfFileName] = useState('')

  const handleOpenDoc = (url, fileName = 'document.pdf') => {
    openListingDocumentInNewTab(url, fileName)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setPdfUrl('')
    setPdfFileName('')
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
      includeRoi: true,
    })

    if (Object.keys(updateData).length === 0) {
      toast.error('Enter at least one value to update')
      return
    }

    setIsSavingDetails(true)
    try {
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/jewelry/${propertyId}`,
        updateData,
      )
      toast.success('Listing updated successfully')
      fetchPropertyData()
    } catch (error) {
      console.error('Error updating jewelry:', error)
      toast.error(
        error?.response?.data?.message || 'Failed to update listing',
      )
    } finally {
      setIsSavingDetails(false)
    }
  }

  const role = 'evaluator'
  const fetchPrice = async (category, subCategory, value) => {
    try {
      const res = await customAxios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/price/filter-price?role=${role}&category=${category}`
      )
      if (res?.data) {
        setData(res?.data[0])
      }
    } catch (error) {
      console.error('Error fetching price data:', error)
    }
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
          <InputField label='Weight' value={property.weight} />
        </div>
        <EvaluatorAssetHolderFields listing={property} />
        {property?.status !== 1 ? (
          <EvaluatorEditableFields
            variant='pending'
            listingPriceLabel='Price'
            formattedListingPrice={formattedListingPrice}
            onListingPriceChange={handleListingPrice}
            formattedEvaluationPrice={formattedPrice}
            onEvaluationPriceChange={handleEvaluationPrice}
            showEvaluationPrice
            showRoi={false}
            onSave={handleSaveEvaluationDetails}
            isSaving={isSavingDetails}
          />
        ) : null}
        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField
            label='Grams'
            value={formatNumberWithCommas(property.grams)}
          />
        </div>
        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Condition' value={property.condition} />
          <InputField label='Age' value={property.age} />
        </div>
        <div className='mb-4 grid sm:grid-cols-2 gap-4'>
          <InputField label='Usage' value={property.usage} />
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
        <EvaluatorAmenitiesList listing={property} />

        <EvaluatorListingMedia
          property={property}
          emptyImage='/listing/no-image.png'
        />

        {property?.status === 1 ? null : (
          <>
            <DocumentSection
              title='Request documents'
              documents={requestDocument}
              handleOpenDoc={handleOpenDoc}
              listingContext={{ listingType: 'Jewellery', listingId: propertyId }}
              fetchData={refreshRequestDocuments}
              setEditText={setEditText}
              handleEdit={handleEdit}
              handleSaveEdit={handleSaveEdit}
              handleDelete={handleDelete}
              editIndex={editIndex}
              editText={editText}
              setEditIndex={setEditIndex}
            />
            <RequestDocumentsActions
              showTextArea={showTextArea}
              setShowTextArea={setShowTextArea}
              newDocument={newDocument}
              setNewDocument={setNewDocument}
              newDocumentDate={newDocumentDate}
              setNewDocumentDate={setNewDocumentDate}
              onAdd={handleAddDocument}
              onRequest={() => handleRequest()}
            />
          </>
        )}

        <DocumentSection
          title='Uploaded documents'
          documents={buildEvaluatorUploadedDocuments(
            requestDocument,
            property.uploadDocument,
          )}
          handleOpenDoc={handleOpenDoc}
          listingContext={{ listingType: 'Jewellery', listingId: propertyId }}
          fetchData={fetchPropertyData}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          fileUrl={pdfUrl}
          fileName={pdfFileName}
        />

        {property?.status === 1 ? null : (
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
                Upload
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
                  Price:
                  <span className='text-black/50'>
                    AED {formatListingCardPrice(data)}
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
