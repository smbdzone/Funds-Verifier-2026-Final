import React from 'react'
import { EditIcon, DeleteIcon } from '@/components/Icons'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import {
  formatRequestDocumentDate,
  getRequestDocumentName,
  isRequestDocumentFulfilled,
} from '@/utils/requestDocumentUtils'

const DocumentSection = ({
  title,
  documents,
  handleOpenDoc,
  fetchData,
  setEditText,
  handleEdit,
  handleSaveEdit,
  handleDelete,
  editIndex,
  editText,
  setEditIndex,
}) => {
  return (    <div className='mb-4'>
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
                  <li className='flex-1 sm:text-base text-sm'>
                    {doc.Certificate.name}
                  </li>
                  <div className='flex gap-2 items-center'>
                    <button
                      className='w-8 h-8'
                      title='view'
                      onClick={() => handleOpenDoc(getListingDocumentSrc(doc))}
                    >
                      <img src='/icons/view.png' alt='View' />
                    </button>
                  </div>                </>
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
                            onClick={() => handleSaveEdit(index)}
                            className='primary-gradient text-white p-2 text-sm rounded-md'
                          >
                            Save
                          </button>
                          <button
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
                        </div>
                        <div className='flex gap-2 items-center'>
                          {isRequestDocumentFulfilled(doc) ? (
                            <button
                              className='w-8 h-8'
                              title='view'
                              onClick={() =>
                                handleOpenDoc(getListingDocumentSrc(doc.document))
                              }
                            >
                              <img src='/icons/view.png' alt='View' />
                            </button>
                          ) : (
                            <span className='text-xs text-gray-400'>Pending</span>
                          )}
                          <button
                            onClick={() => handleEdit(index)}
                            className='h-10 w-10'
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className='h-10 w-10'
                          >
                            <DeleteIcon />
                          </button>
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
                            onClick={() => handleSaveEdit(index)}
                            className='primary-gradient text-white p-2 text-sm rounded-md'
                          >
                            Save
                          </button>
                          <button
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
                            onClick={() => handleEdit(index)}
                            className='h-10 w-10'
                          >
                            <EditIcon />
                          </button>

                          <button
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
