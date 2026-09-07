'use client'

import React, { useEffect, useState } from 'react'
import Modal from '../../documents/modal'
import customAxios from '@/utils/apis/apis'
import { useProfile } from '../../../context/UserContext'
import { getListingDocumentSrc } from '@/libs/listingCardMedia'
import {
  fetchPaidEvaluationListings,
  getEvaluationFeeStatus,
  getListingPropertyTypeLabel,
} from '@/libs/evaluatorListingsQuery'

const statusColors = {
  Evaluated: 'text-green-600 font-medium',
  Approved: 'text-green-600 font-medium',
  'Fee Paid': 'text-blue-600 font-medium',
  Pending: 'text-gray-500 font-medium',
}

function formatDateFiled(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function resolveEvaluatorName(listing, subEvaluators, currentUser) {
  const assignee = listing?.evaluator
  if (assignee && typeof assignee === 'object') {
    return assignee.displayName || assignee.name || 'Evaluator'
  }

  if (typeof assignee === 'string') {
    const found = subEvaluators.find(
      (ev) => ev._id === assignee || ev.uuid === assignee,
    )
    if (found) return found.displayName || found.name
  }

  if (listing?.evaluatorUUID) {
    const found = subEvaluators.find((ev) => ev.uuid === listing.evaluatorUUID)
    if (found) return found.displayName || found.name
  }

  if (currentUser?.displayName || currentUser?.name) {
    return currentUser.displayName || currentUser.name
  }

  return 'Unassigned'
}

const AllInvoices = () => {
  const { user } = useProfile()
  const [invoices, setInvoices] = useState([])
  const [subEvaluators, setSubEvaluators] = useState([])
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

  const fetchSubEvaluators = async () => {
    try {
      const meRes = await customAxios.get('/user/me')
      const me = meRes.data || {}
      const parentIds = Array.from(new Set([me?._id, me?.uuid].filter(Boolean)))

      if (parentIds.length === 0) return

      const responses = await Promise.allSettled(
        parentIds.map((parentId) =>
          customAxios.get(`/evaluator/parent/${parentId}`),
        ),
      )

      const merged = []
      const seen = new Set()

      responses.forEach((result) => {
        if (result.status !== 'fulfilled' || result.value?.status !== 200) return
        const evaluators = Array.isArray(result.value?.data)
          ? result.value.data
          : []

        evaluators.forEach((item) => {
          const key = item?.uuid || item?._id
          if (!key || seen.has(key)) return
          seen.add(key)
          merged.push(item)
        })
      })

      setSubEvaluators(merged)
    } catch (error) {
      console.error('Failed to fetch sub-evaluators:', error)
    }
  }

  const fetchInvoicesData = async () => {
    try {
      setLoading(true)
      const listings = await fetchPaidEvaluationListings()
      setInvoices(listings)
    } catch (error) {
      console.error('Error fetching evaluation invoices:', error)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubEvaluators()
    fetchInvoicesData()
  }, [])

  return (
    <div className='p-2 sm:p-4'>
      <div className='w-full primary-gradient rounded px-5 py-3 sm:px-7 sm:py-4 mb-4'>
        <h1 className='text-base sm:text-lg lg:text-xl font-bold text-white'>
          All Invoices
        </h1>
      </div>

      <div className='overflow-x-auto custom-shadow rounded'>
        <table className='w-full min-w-[900px] text-sm sm:text-base bg-white'>
          <thead>
            <tr className='primary-gradient text-white'>
              <th className='py-3 px-4 text-left font-medium'>Property Type</th>
              <th className='py-3 px-4 text-left font-medium'>Property Name</th>
              <th className='py-3 px-4 text-left font-medium'>Evaluator</th>
              <th className='py-3 px-4 text-left font-medium'>Date Filed</th>
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
                  No paid evaluation fees found yet.
                </td>
              </tr>
            ) : (
              invoices.map((listing) => {
                const status = getEvaluationFeeStatus(listing)
                const invoiceSrc = listing?.invoice
                  ? getListingDocumentSrc(listing.invoice)
                  : ''
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
                    <td className='py-3 px-4 capitalize max-w-[200px] truncate'>
                      {listing.title || '—'}
                    </td>
                    <td className='py-3 px-4 capitalize'>
                      {resolveEvaluatorName(listing, subEvaluators, user)}
                    </td>
                    <td className='py-3 px-4'>
                      {formatDateFiled(listing.createdAt)}
                    </td>
                    <td
                      className={`py-3 px-4 capitalize ${statusColors[status] || ''
                        }`}
                    >
                      {status}
                    </td>
                    <td className='py-3 px-4'>
                      {invoiceSrc ? (
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
                      ) : (
                        <span className='text-amber-600 text-sm' title='Upload invoice PDF when completing the evaluation'>
                          Invoice pending
                        </span>
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

export default AllInvoices
