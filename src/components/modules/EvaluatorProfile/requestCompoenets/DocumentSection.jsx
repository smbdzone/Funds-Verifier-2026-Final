import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import DocumentPreviewModal from '@/components/documents/modal'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import { resolveEvaluatorListingDocument } from '@/utils/requestedDocumentUpload'
import {
  formatRequestDocumentDate,
  getRequestDocumentName,
  getUploadedDocumentDate,
  isRequestDocumentFulfilled,
} from '@/utils/requestDocumentUtils'

const DocumentSection = ({
  title,
  documents,
  handleOpenDoc,
  fetchData,
  listingContext,
  setEditText,
  handleEdit,
  handleSaveEdit,
  handleDelete,
  editIndex,
  editText,
  setEditIndex,
}) => {
  const fetchDataRef = useRef(fetchData)
  fetchDataRef.current = fetchData
  const [openingDocKey, setOpeningDocKey] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewFileName, setPreviewFileName] = useState('document.pdf')

  // Keep request status in sync when asset holder uploads (Pending → Uploaded).
  // Do NOT use window `focus` — clicking price/ROI inputs (and DevTools) fires
  // focus and was re-running a full property reload that wiped form state.
  useEffect(() => {
    if (title !== 'Request documents') return undefined
    if (typeof fetchDataRef.current !== 'function') return undefined

    const refresh = () => {
      try {
        fetchDataRef.current?.()
      } catch (_) {
        /* ignore polling errors */
      }
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }

    document.addEventListener('visibilitychange', onVisible)
    const interval = window.setInterval(refresh, 30000)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.clearInterval(interval)
    }
  }, [title])

  const openDoc = async (doc, displayName, docKey = '') => {
    const name =
      displayName || doc?.Certificate?.name || doc?.name || 'document.pdf'

    setOpeningDocKey(docKey || name)
    try {
      let url = getListingDocumentSrc(doc)

      if (!url && listingContext) {
        const resolved = await resolveEvaluatorListingDocument(
          doc,
          listingContext,
        )
        url = resolved?.url
      }

      if (!url) {
        toast.error('Unable to open this document.')
        return
      }

      setPreviewUrl(url)
      setPreviewFileName(name)
      setPreviewOpen(true)
    } catch (error) {
      console.error('openDoc:', error)
      toast.error('Unable to open this document.')
    } finally {
      setOpeningDocKey(null)
    }
  }

  return (
    <div className='mb-4'>
      <DocumentPreviewModal
        isOpen={previewOpen}
        onClose={() => {
          setPreviewOpen(false)
          setPreviewUrl('')
          setPreviewFileName('document.pdf')
        }}
        fileUrl={previewUrl}
        fileName={previewFileName}
      />
      <div className='w-full primary-gradient rounded px-7 py-2 flex justify-between items-center'>
        <label className='sm:text-lg text-base lg:text-xl font-bold text-white'>
          {title}
        </label>
      </div>
      <div className=' text-black'>
        {documents && documents?.length > 0 ? (
          documents?.map((doc, index) => (
            <div
              key={index}
              className='py-2 flex items-center justify-between w-full mb-0'
            >
              {title === 'Uploaded documents' || title === 'All Invoices' ? (
                <>
                  <div className='flex min-w-0 flex-1 flex-col'>
                    <span className='sm:text-base text-sm'>
                      {doc?.Certificate?.name || 'Document'}
                    </span>
                    {getUploadedDocumentDate(doc) ? (
                      <span className='text-xs text-gray-500'>
                        {getUploadedDocumentDate(doc)}
                      </span>
                    ) : null}
                  </div>
                  <div className='flex gap-2 items-center'>
                    <button
                      type='button'
                      className='w-8 h-8 disabled:opacity-50'
                      title='View / download'
                      disabled={openingDocKey === `uploaded-${index}`}
                      onClick={() =>
                        openDoc(
                          doc,
                          doc?.Certificate?.name || 'document.pdf',
                          `uploaded-${index}`,
                        )
                      }
                    >
                      <img src='/icons/view.png' alt='View' />
                    </button>
                  </div>
                </>
              ) : title === 'Request documents' ? (
                <>
                  <div className='flex items-center w-full justify-between gap-3 mb-2'>
                    {editIndex === index ? (
                      <div className='flex gap-3 items-center w-full justify-between'>
                        <input
                          className='block w-[200px] py-2 rounded-md bg-white text-[#969696] text-sm border border-[#969696]'
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className='flex gap-3'>
                          <button
                            type='button'
                            onClick={() => handleSaveEdit(index)}
                            className='primary-gradient text-white p-2 text-sm rounded-md'
                          >
                            Save
                          </button>
                          <button
                            type='button'
                            onClick={() => setEditIndex(null)}
                            className='border border-blue text-blue p-2 text-sm rounded-md'
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className='flex min-w-0 flex-1 flex-col'>
                          <span className='block py-2 text-sm capitalize'>
                            {getRequestDocumentName(doc)}
                          </span>
                          {doc.date ? (
                            <span className='-mt-1 text-xs text-gray-500'>
                              {formatRequestDocumentDate(doc.date)}
                            </span>
                          ) : null}
                          {isRequestDocumentFulfilled(doc) &&
                            doc.document?.Certificate?.name ? (
                            <span className='text-xs text-gray-500 truncate'>
                              File: {doc.document.Certificate.name}
                            </span>
                          ) : null}
                        </div>
                        <div className='flex gap-2 items-center'>
                          {isRequestDocumentFulfilled(doc) ? (
                            <span className='inline-block rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700'>
                              Uploaded
                            </span>
                          ) : (
                            <>
                              <span className='inline-block rounded px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700'>
                                Pending
                              </span>
                              <button
                                type='button'
                                onClick={() => handleDelete(index)}
                                className='h-10 w-10'
                                title='Delete'
                              >
                                <DeleteIcon />
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div
                    key={index}
                    className='flex items-center w-full justify-between gap-3 mb-2'
                  >
                    {editIndex === index ? (
                      <div className='flex gap-3 items-center w-full justify-between'>
                        <input
                          className='block w-[200px] py-2 rounded-md bg-white text-[#969696] text-sm border border-[#969696]'
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className='flex gap-3'>
                          <button
                            type='button'
                            onClick={() => handleSaveEdit(index)}
                            className='primary-gradient text-white p-2 text-sm rounded-md'
                          >
                            Save
                          </button>
                          <button
                            type='button'
                            onClick={() => setEditIndex(null)}
                            className='border border-blue text-blue p-2 text-sm rounded-md'
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center justify-between w-full'>
                        <span className='block capitalize w-full py-2 text-sm'>
                          {getRequestDocumentName(doc)}
                        </span>
                        <div className='flex gap-3'>
                          <button
                            type='button'
                            onClick={() => handleEdit(index)}
                            className='h-10 w-10'
                          >
                            <EditIcon />
                          </button>

                          <button
                            type='button'
                            onClick={() => handleDelete(index)}
                            className='h-10 w-10'
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className='py-2'>No documents!</p>
        )}
      </div>
    </div>
  )
}

export default DocumentSection
