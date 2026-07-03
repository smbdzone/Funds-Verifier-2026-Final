'use client'

import React, { useEffect, useState } from 'react'
import Modal from '../../documents/modal'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import {
  fetchAssetHolderUploadedInvoices,
  formatInvoiceDate,
  getListingPropertyTypeLabel,
  resolveListingEvaluatorName,
} from '@/libs/assetHolderInvoicesQuery'

const AssetHolderInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [pdfFileName, setPdfFileName] = useState('')

  const handleOpenDoc = (url, fileName = '') => {
    if (!url) return
    setPdfUrl(url)
    setPdfFileName(fileName)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setPdfUrl('')
    setPdfFileName('')
  }

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const listings = await fetchAssetHolderUploadedInvoices()
      setInvoices(listings)
    } catch (error) {
      console.error('Error fetching asset holder invoices:', error)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return (
    <div className='p-2 sm:p-4'>
      <div className='w-full primary-gradient rounded px-5 py-3 sm:px-7 sm:py-4 mb-4'>
        <h1 className='text-base sm:text-lg lg:text-xl font-bold text-white'>
          Invoices
        </h1>
        <p className='text-white/90 text-sm mt-1'>
          Evaluation invoices uploaded by your assigned evaluators
        </p>
      </div>

      <div className='overflow-x-auto custom-shadow rounded'>
        <table className='w-full min-w-[800px] text-sm sm:text-base bg-white'>
          <thead>
            <tr className='primary-gradient text-white'>
              <th className='py-3 px-4 text-left font-medium'>Property Type</th>
              <th className='py-3 px-4 text-left font-medium'>Property Name</th>
              <th className='py-3 px-4 text-left font-medium'>Evaluator</th>
              <th className='py-3 px-4 text-left font-medium'>Date Uploaded</th>
              <th className='py-3 px-4 text-left font-medium'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='py-6 px-4 text-center text-gray-500'>
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className='py-6 px-4 text-center text-gray-500'>
                  No uploaded invoices yet. Invoices appear here after your
                  evaluator uploads them for a completed evaluation.
                </td>
              </tr>
            ) : (
              invoices.map((listing) => {
                const invoiceSrc = getListingDocumentSrc(listing.invoice)
                const invoiceFileName =
                  listing?.invoice?.Certificate?.name ||
                  `invoice-${listing.title || listing.uuid || 'document'}.pdf`

                return (
                  <tr
                    key={`${listing.assetRoute}-${listing.uuid}`}
                    className='border-t border-gray-200 hover:bg-gray-50'
                  >
                    <td className='py-3 px-4 capitalize'>
                      {getListingPropertyTypeLabel(listing, listing.assetRoute)}
                    </td>
                    <td className='py-3 px-4 capitalize max-w-[220px] truncate'>
                      {listing.title || '—'}
                    </td>
                    <td className='py-3 px-4 capitalize'>
                      {resolveListingEvaluatorName(listing)}
                    </td>
                    <td className='py-3 px-4'>
                      {formatInvoiceDate(
                        listing.updatedAt || listing.createdAt,
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      <button
                        type='button'
                        className='inline-flex items-center gap-2 text-prussianBlue hover:underline'
                        onClick={() =>
                          handleOpenDoc(invoiceSrc, invoiceFileName)
                        }
                      >
                        <img
                          src='/icons/view.png'
                          alt='View invoice'
                          className='w-6 h-6'
                        />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        fileUrl={pdfUrl}
        fileName={pdfFileName}
      />
    </div>
  )
}

export default AssetHolderInvoices
