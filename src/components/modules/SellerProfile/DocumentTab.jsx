import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { handleFileUpload } from '@/libs/uploadAsset'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import Modal from '../../documents/modal'
import { useProfile } from '../../../context/UserContext'
import {
  fetchAllDocumentRequests,
  fetchPendingDocumentRequests,
  formatDocumentAssetType,
  formatRequestDocumentDate,
  fulfillRequestedDocument,
  resolveRequestDocumentFile,
} from '@/utils/requestedDocumentUpload'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const DocumentTab = () => {
  const [pendingRequests, setPendingRequests] = useState([])
  const [documentHistory, setDocumentHistory] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [uploadingRequestKey, setUploadingRequestKey] = useState(null)
  const [openingHistoryKey, setOpeningHistoryKey] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [pdfFileName, setPdfFileName] = useState('')
  const { user } = useProfile()

  const loadPendingRequests = async () => {
    try {
      const requests = await fetchPendingDocumentRequests()
      setPendingRequests(requests)
    } catch (requestError) {
      console.error('Failed to load evaluator document requests:', requestError)
      setPendingRequests([])
    }
  }

  const loadDocumentHistory = async () => {
    try {
      const history = await fetchAllDocumentRequests()
      setDocumentHistory(history)
    } catch (historyError) {
      console.error('Failed to load document history:', historyError)
      setDocumentHistory([])
    }
  }

  const loadDocumentData = async () => {
    setLoadingRequests(true)
    setLoadingHistory(true)
    try {
      await Promise.all([loadPendingRequests(), loadDocumentHistory()])
    } finally {
      setLoadingRequests(false)
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    loadDocumentData()
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
    setPdfUrl('')
    setPdfFileName('')
  }

  const handleViewHistoryDocument = async (entry) => {
    if (entry.status !== 'Uploaded') return

    const historyKey = `${entry.listingId}-${entry.requestIndex}`
    setOpeningHistoryKey(historyKey)
    try {
      const file = await resolveRequestDocumentFile(entry)
      if (!file?.url) {
        toast.error('Unable to open this document.')
        return
      }
      setPdfUrl(file.url)
      setPdfFileName(file.fileName)
      setIsModalOpen(true)
    } catch (error) {
      console.error(error)
      toast.error('Unable to open this document.')
    } finally {
      setOpeningHistoryKey(null)
    }
  }

  const handleEvaluatorRequestUpload = async (request, file) => {
    const requestKey = `${request.listingId}-${request.requestIndex}`
    setUploadingRequestKey(requestKey)
    try {
      const fileUpload = await handleFileUpload(file)
      if (!fileUpload?._id) {
        toast.error('Failed to upload document.')
        return
      }

      const response = await fulfillRequestedDocument({
        assetType: request.listingType,
        listingId: request.listingId,
        requestIndex: request.requestIndex,
        requestName: request.name,
        documentId: fileUpload._id,
      })

      if (response?.status === 200) {
        toast.success('Document uploaded successfully!')
        await loadDocumentData()
      } else {
        toast.error('Failed to upload requested document.')
      }
    } catch (uploadError) {
      console.error(uploadError)
      toast.error(
        uploadError?.response?.data?.message ||
        'Failed to upload requested document.',
      )
    } finally {
      setUploadingRequestKey(null)
    }
  }

  const handleFileSelect = async (request, e) => {
    const selectedFile = e.target.files[0]
    e.target.value = ''
    if (!selectedFile) return

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload a PDF or Word document.')
      return
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB.')
      return
    }

    await handleEvaluatorRequestUpload(request, selectedFile)
  }

  return (
    <>
      <span className='sm:text-base text-sm lg:text-lg text-prussianBlue/40 mb-4 block'>
        {user?.role}
      </span>
      <div className='custom-shadow w-full max-w-full min-w-0'>
        <h1 className='font-medium sm:text-lg text-base lg:text-xl md:px-10 px-5 py-5 custom-shadow rounded text-prussianBlue'>
          Document Management
        </h1>

        <div className='md:px-10 px-5 py-7'>
          <p className='text-sm text-gray-600 mb-6'>
            When an evaluator requests documents for your listing, upload them
            here. All requests and uploads are kept in your history below.
          </p>

          <h2 className='font-medium sm:text-lg text-base lg:text-xl text-prussianBlue mb-2'>
            Pending Document Requests
          </h2>
          <p className='text-sm text-gray-600 mb-4'>
            Documents requested by your evaluator that still need to be uploaded.
          </p>

          {loadingRequests ? (
            <p className='text-sm text-gray-500'>Loading requests...</p>
          ) : pendingRequests.length > 0 ? (
            <div className='flex flex-col gap-3'>
              {pendingRequests.map((request) => {
                const requestKey = `${request.listingId}-${request.requestIndex}`
                return (
                  <div
                    key={requestKey}
                    className='grid grid-cols-1 items-center gap-3 rounded border border-gray-100 p-4 sm:grid-cols-[1fr_auto]'
                  >
                    <div className='min-w-0'>
                      <p className='font-medium capitalize'>{request.name}</p>
                      <p className='text-sm text-gray-500 truncate'>
                        {request.listingTitle} (
                        {formatDocumentAssetType(request.assetType)})
                      </p>
                      {request.date ? (
                        <p className='text-xs text-gray-400 mt-1'>
                          Requested: {formatRequestDocumentDate(request.date)}
                        </p>
                      ) : null}
                    </div>
                    <label className='custom-shadow flex h-[48px] min-w-[120px] cursor-pointer items-center justify-center rounded px-4 text-sm font-medium shrink-0'>
                      <input
                        type='file'
                        accept='.pdf,.doc,.docx'
                        className='hidden'
                        disabled={uploadingRequestKey === requestKey}
                        onChange={(e) => handleFileSelect(request, e)}
                      />
                      {uploadingRequestKey === requestKey
                        ? 'Uploading...'
                        : 'Upload'}
                    </label>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>
              No pending document requests right now.
            </p>
          )}

          <p className='mt-4 text-xs text-gray-400'>
            Maximum file size: 2MB. PDF or Word documents only.
          </p>
        </div>

        <div className='md:px-10 px-5 py-7 border-t border-gray-100'>
          <h2 className='font-medium sm:text-lg text-base lg:text-xl text-prussianBlue mb-2'>
            Document Request History
          </h2>
          <p className='text-sm text-gray-600 mb-6'>
            Full history of evaluator document requests for your listings.
          </p>

          <div className='custom-shadow rounded w-full max-w-full min-w-0 overflow-hidden'>
            <table className='w-full table-fixed text-xs sm:text-sm bg-white'>
              <thead>
                <tr className='primary-gradient text-white'>
                  <th className='py-2 px-2 text-left font-medium w-[14%]'>
                    Asset Type
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[18%]'>
                    Document
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[22%]'>
                    Listing
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[14%]'>
                    Date
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[14%]'>
                    Status
                  </th>
                  <th className='py-2 px-2 text-left font-medium w-[18%]'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingHistory ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-6 px-2 text-center text-gray-500'
                    >
                      Loading history...
                    </td>
                  </tr>
                ) : documentHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-6 px-2 text-center text-gray-500'
                    >
                      No document requests yet.
                    </td>
                  </tr>
                ) : (
                  documentHistory.map((entry) => {
                    const historyKey = `${entry.listingId}-${entry.requestIndex}`
                    const isOpening = openingHistoryKey === historyKey
                    const isUploaded = entry.status === 'Uploaded'

                    return (
                      <tr
                        key={historyKey}
                        className='border-t border-gray-200 hover:bg-gray-50'
                      >
                        <td
                          className='py-2 px-2 capitalize truncate'
                          title={formatDocumentAssetType(entry.assetType)}
                        >
                          {formatDocumentAssetType(entry.assetType)}
                        </td>
                        <td
                          className='py-2 px-2 capitalize truncate'
                          title={entry.name}
                        >
                          {entry.name}
                        </td>
                        <td
                          className='py-2 px-2 truncate'
                          title={entry.listingTitle}
                        >
                          {entry.listingTitle || '—'}
                        </td>
                        <td className='py-2 px-2 whitespace-nowrap'>
                          {entry.date
                            ? formatRequestDocumentDate(entry.date)
                            : '—'}
                        </td>
                        <td className='py-2 px-2'>
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${isUploaded
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                              }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className='py-2 px-2'>
                          {isUploaded ? (
                            <button
                              type='button'
                              disabled={isOpening}
                              onClick={() => handleViewHistoryDocument(entry)}
                              className='inline-flex items-center gap-1 text-prussianBlue hover:underline disabled:opacity-50'
                            >
                              <img
                                src='/icons/view.png'
                                alt='View document'
                                className='w-5 h-5'
                              />
                              <span>{isOpening ? 'Opening...' : 'View'}</span>
                            </button>
                          ) : (
                            <label className='inline-flex cursor-pointer items-center text-prussianBlue hover:underline'>
                              <input
                                type='file'
                                accept='.pdf,.doc,.docx'
                                className='hidden'
                                disabled={uploadingRequestKey === historyKey}
                                onChange={(e) => handleFileSelect(entry, e)}
                              />
                              <span>
                                {uploadingRequestKey === historyKey
                                  ? 'Uploading...'
                                  : 'Upload'}
                              </span>
                            </label>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Loader isOpen={uploadingRequestKey !== null} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        fileUrl={pdfUrl}
        fileName={pdfFileName}
      />
    </>
  )
}
