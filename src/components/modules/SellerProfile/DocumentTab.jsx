import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { handleFileUpload } from '@/libs/uploadAsset'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import { useProfile } from '../../../context/UserContext'
import {
  fetchPendingDocumentRequests,
  fulfillRequestedDocument,
} from '@/utils/requestedDocumentUpload'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const DocumentTab = () => {
  const [pendingRequests, setPendingRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [uploadingRequestKey, setUploadingRequestKey] = useState(null)
  const { user } = useProfile()

  const loadPendingRequests = async () => {
    try {
      const requests = await fetchPendingDocumentRequests()
      setPendingRequests(requests)
    } catch (requestError) {
      console.error('Failed to load evaluator document requests:', requestError)
    } finally {
      setLoadingRequests(false)
    }
  }

  useEffect(() => {
    loadPendingRequests()
  }, [])

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
        await loadPendingRequests()
      } else {
        toast.error('Failed to upload requested document.')
      }
    } catch (uploadError) {
      console.error(uploadError)
      toast.error('Failed to upload requested document.')
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
      <div className='custom-shadow'>
        <h1 className='font-medium sm:text-lg text-base lg:text-xl md:px-10 px-5 py-5 custom-shadow rounded text-prussianBlue'>
          Documents Storage
        </h1>

        <div className='md:px-10 px-5 py-7'>
          <h2 className='font-medium sm:text-lg text-base lg:text-xl text-prussianBlue mb-2'>
            Evaluator Requested Documents
          </h2>
          <p className='text-sm text-gray-600 mb-6'>
            Upload only the documents your evaluator has requested for your
            pending evaluations.
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
                      <p className='text-sm text-gray-500'>
                        {request.listingTitle} ({request.assetType})
                      </p>
                    </div>
                    <label className='custom-shadow flex h-[48px] min-w-[120px] cursor-pointer items-center justify-center rounded px-4 text-sm font-medium'>
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
              No document requests from your evaluator right now.
            </p>
          )}

          <p className='mt-4 text-xs text-gray-400'>
            Maximum file size: 2MB. PDF or Word documents only.
          </p>
        </div>

        <Loader isOpen={uploadingRequestKey !== null} />
      </div>
    </>
  )
}
