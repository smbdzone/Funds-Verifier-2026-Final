'use client'

import React, { useEffect, useState } from 'react'
import Modal from '../../documents/modal'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import {
  fetchAssetHolderAllInvoices,
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
      const listings = await fetchAssetHolderAllInvoices()
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
          Evaluation invoices and optional off-plan approval fee payments
        </p>
      </div>

      <div className='overflow-x-auto custom-shadow rounded'>
        <table className='w-full min-w-[900px] text-sm sm:text-base bg-white'>
          <thead>
            <tr className='primary-gradient text-white'>
              <th className='py-3 px-4 text-left font-medium'>Type</th>
              <th className='py-3 px-4 text-left font-medium'>Property Name</th>
              <th className='py-3 px-4 text-left font-medium'>From</th>
              <th className='py-3 px-4 text-left font-medium'>Amount / Date</th>
              <th className='py-3 px-4 text-left font-medium'>Status</th>
              <th className='py-3 px-4 text-left font-medium'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className='py-6 px-4 text-center text-gray-500'>
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className='py-6 px-4 text-center text-gray-500'>
                  No invoices yet. Evaluation invoices and optional off-plan
                  approval fees appear here when requested or paid.
                </td>
              </tr>
            ) : (
              invoices.map((listing) => {
                const isOffPlanFee =
                  listing.invoiceKind === 'off_plan_approval_fee'
                const invoiceSrc = getListingDocumentSrc(listing.invoice)
                const invoiceFileName =
                  listing?.invoice?.Certificate?.name ||
                  `invoice-${listing.title || listing.uuid || 'document'}.pdf`
                const feeStatus = String(
                  listing.offPlanApprovalFeeStatus || 'none',
                )

                return (
                  <tr
                    key={`${listing.invoiceKind}-${listing.assetRoute}-${listing.uuid}`}
                    className='border-t border-gray-200 hover:bg-gray-50'
                  >
                    <td className='py-3 px-4 capitalize'>
                      {isOffPlanFee
                        ? 'Off-plan approval fee'
                        : getListingPropertyTypeLabel(
                          listing,
                          listing.assetRoute,
                        )}
                    </td>
                    <td className='py-3 px-4 capitalize max-w-[220px] truncate'>
                      {listing.title || '—'}
                    </td>
                    <td className='py-3 px-4 capitalize'>
                      {resolveListingEvaluatorName(listing)}
                    </td>
                    <td className='py-3 px-4'>
                      {isOffPlanFee ? (
                        <span>
                          {listing.offPlanApprovalFee != null
                            ? `${Number(listing.offPlanApprovalFee).toLocaleString()} AED`
                            : '—'}
                          <span className='block text-xs text-gray-400 mt-0.5'>
                            {formatInvoiceDate(
                              listing.offPlanApprovalFeePaidAt ||
                              listing.updatedAt ||
                              listing.createdAt,
                            )}
                          </span>
                        </span>
                      ) : (
                        formatInvoiceDate(
                          listing.updatedAt || listing.createdAt,
                        )
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      {isOffPlanFee ? (
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${feeStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                            }`}
                        >
                          {feeStatus === 'paid' ? 'Paid / Invoice' : 'Pay fee'}
                        </span>
                      ) : (
                        <span className='inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800'>
                          Uploaded
                        </span>
                      )}
                    </td>
                    <td className='py-3 px-4'>
                      {isOffPlanFee ? (
                        feeStatus === 'requested' &&
                          listing.offPlanApprovalFeePaymentUrl ? (
                          <a
                            href={listing.offPlanApprovalFeePaymentUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 rounded primary-gradient px-3 py-1.5 text-sm font-medium text-white'
                            onClick={() => {
                              try {
                                localStorage.setItem(
                                  'servicePaymentReturnUrl',
                                  '/seller-profile/invoices',
                                )
                              } catch {
                                /* ignore */
                              }
                            }}
                          >
                            Pay now
                          </a>
                        ) : feeStatus === 'paid' ? (
                          <span className='text-emerald-700 text-sm font-medium'>
                            Fee paid
                          </span>
                        ) : (
                          <span className='text-gray-400 text-sm'>—</span>
                        )
                      ) : (
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
                      )}
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
