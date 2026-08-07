/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { UploadIcon } from '@/components/Icons'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from '../../documents/modal'
import DocumentSection from '../EvaluatorProfile/requestCompoenets/DocumentSection'
import EvaluatorEditableFields from '../EvaluatorProfile/requestCompoenets/EvaluatorEditableFields'
import EvaluatorPropertyEditableDetails from '../EvaluatorProfile/requestCompoenets/EvaluatorPropertyEditableDetails'
import {
  buildEvaluatorUpdatePayload,
  buildPropertyDetailsUpdatePayload,
  buildEvaluatorFinalizeDetailsPayload,
  formatNumericInput,
  getListingPriceForEvaluator,
  initFormattedPrice,
  initPropertyDetailsDraft,
  normalizeListingForEvaluator,
} from '../EvaluatorProfile/requestCompoenets/evaluatorPriceHandlers'
import { handleFileUpload } from '@/libs/uploadAsset'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import { formatListingCardPrice } from '@/libs/listingPriceDisplay'
import customAxios from '../../../utils/apis/apis'
import EvaluatorListingMedia from '../EvaluatorProfile/requestCompoenets/EvaluatorListingMedia'
import EvaluatorDateField from '../EvaluatorProfile/requestCompoenets/EvaluatorDateField'
import EvaluatorPriceInput from '../EvaluatorProfile/requestCompoenets/EvaluatorPriceInput'
import RequestDocumentsActions from '../EvaluatorProfile/requestCompoenets/RequestDocumentsActions'
import { EvaluatorAssetHolderFields } from '../EvaluatorProfile/requestCompoenets/EvaluatorListingContactFields'
import {
  buildEvaluatorUploadedDocuments,
  formatDateForInput,
  getRequestDocumentName,
  normalizeRequestDocuments,
  openListingDocumentInNewTab,
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
  const [evaluationPrice, setEvaluationPrice] = useState('')
  const [formattedPrice, setFormattedPrice] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [pdfFileName, setPdfFileName] = useState('')
  const [detailsDraft, setDetailsDraft] = useState(() => initPropertyDetailsDraft({}))
  const [isSavingDetails, setIsSavingDetails] = useState(false)
  const [isSavingPropertyDetails, setIsSavingPropertyDetails] = useState(false)

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
      const response = await customAxios.get(`/property/${propertyId}`)
      const listing = normalizeListingForEvaluator(response.data)
      setProperty(listing)
      fetchPrice(listing.propertyType, listing?.bedrooms)
      // Initialize ROI state if available
      setRoi(listing?.roi != null ? String(listing.roi) : '')
      initFormattedPrice(
        listing.evaluationPrices,
        setEvaluationPrice,
        setFormattedPrice,
      )
      initFormattedPrice(
        getListingPriceForEvaluator(listing),
        setListingPrice,
        setFormattedListingPrice,
      )
      setDetailsDraft(initPropertyDetailsDraft(listing))
      setFeedback(listing.feedback || '')
      setCertificateDate(
        formatDateForInput(listing.evaluationCertificateDate),
      )
      if (listing.evaluationCertificate) {
        setFileUrl(listing.evaluationCertificate) // Update URL from API
      }
      if (listing.requestDocument) {
        setRequestDocument(
          normalizeRequestDocuments(listing.requestDocument),
        )
      }
    } catch (error) {
      console.error('Error fetching property data:', error)
    }
  }

  /** Poll only request-document status — do not reset price/ROI/media. */
  const refreshRequestDocuments = async () => {
    if (!propertyId) return
    try {
      const response = await customAxios.get(`/property/${propertyId}`)
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
    if (!propertyId) return
    fetchPropertyData()
  }, [propertyId])

  // If property loaded but draft stayed empty, re-seed from property.
  useEffect(() => {
    if (!property?.uuid && !property?._id) return
    if (detailsDraft?.title) return
    if (!property.title) return
    setDetailsDraft(initPropertyDetailsDraft(property))
  }, [property, detailsDraft?.title])

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

      const isOffPlan = String(property?.assetType || '')
        .toLowerCase()
        .includes('off plan')
      const finalizedDetails = buildEvaluatorFinalizeDetailsPayload(
        detailsDraft,
        { isOffPlan },
      )

      if (fileUpload?._id || invoiceUpload?._id) {
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
          {
            ...finalizedDetails,
            roi: roi,
            evaluationPrices: evaluationPrice,
            feedback: feedback,
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
          ...finalizedDetails,
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
            ...finalizedDetails,
            roi: roi,
            evaluationPrices: evaluationPrice,
            feedback: feedback,
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

  if (!property?.uuid && !property?._id) {
    return <div>Loading...</div>
  }

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

  const handleSavePropertyDetails = async () => {
    const isOffPlan = String(property?.assetType || '')
      .toLowerCase()
      .includes('off plan')
    const updateData = buildPropertyDetailsUpdatePayload(detailsDraft, {
      isOffPlan,
    })

    if (Object.keys(updateData).length === 0) {
      toast.error('Enter at least one value to update')
      return
    }

    setIsSavingPropertyDetails(true)
    try {
      await customAxios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/property/${propertyId}`,
        updateData,
      )
      toast.success('Listing details updated successfully')
      fetchPropertyData()
    } catch (error) {
      console.error('Error updating property details:', error)
      toast.error(
        error?.response?.data?.message || 'Failed to update listing details',
      )
    } finally {
      setIsSavingPropertyDetails(false)
    }
  }

  const handleSaveEvaluationDetails = async () => {
    const updateData = buildEvaluatorUpdatePayload({
      listingPrice: '',
      evaluationPrice,
      roi,
      sizeSQFT: '',
      includeRoi: true,
      includeListingPrice: false,
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
        <EvaluatorAssetHolderFields listing={property} />

        <EvaluatorPropertyEditableDetails
          property={property}
          draft={detailsDraft}
          onDraftChange={setDetailsDraft}
          onSave={handleSavePropertyDetails}
          isSaving={isSavingPropertyDetails}
        />

        {property?.status === 1 ? (
          <EvaluatorEditableFields
            formattedListingPrice={formattedListingPrice}
            onListingPriceChange={handleListingPrice}
            formattedEvaluationPrice={formattedPrice}
            onEvaluationPriceChange={handleEvaluationPrice}
            roi={roi}
            onRoiChange={setRoi}
            showListingPrice={false}
            showRoi
            onSave={handleSaveEvaluationDetails}
            isSaving={isSavingDetails}
          />
        ) : null}

        <EvaluatorListingMedia property={property} />
        {property?.status === 1 ? null : (
          <>
            <DocumentSection
              title='Request documents'
              documents={requestDocument}
              handleOpenDoc={handleOpenDoc}
              listingContext={{ listingType: 'Property', listingId: propertyId }}
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
            {
              titleDeed: property.titleDeed,
              agencyAgreement: property.agencyAgreement,
            },
          )}
          handleOpenDoc={handleOpenDoc}
          listingContext={{ listingType: 'Property', listingId: propertyId }}
          fetchData={fetchPropertyData}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          fileUrl={pdfUrl}
          fileName={pdfFileName}
        />
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
