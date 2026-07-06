'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Upload2Icon } from '@/components/Icons'
import { usePathname, useRouter } from 'next/navigation'
import { handleFileUpload } from '@/libs/uploadAsset'
import { toast } from 'react-toastify'
import Loader from '../EvaluatorProfile/requestCompoenets/Loader'
import customAxios from '../../../utils/apis/apis'
import {
  formatAssetLabel,
  formatTransactionPhase,
} from '@/libs/transactionPhase'

const formatDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString))
  } catch {
    return '—'
  }
}

const TransactionProgress = () => {
  const [booking, setBooking] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const path = usePathname()
  const router = useRouter()
  const bookingId = path.split('/').pop()

  const loadBooking = useCallback(async () => {
    if (!bookingId) return
    setLoading(true)
    try {
      const response = await customAxios.get(
        `/arrange-view/bookings/${bookingId}`,
      )
      setBooking(response.data)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Could not load transaction details.',
      )
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }, [bookingId])

  useEffect(() => {
    loadBooking()
  }, [loadBooking])

  const productData = booking?.productData || {}
  const transferDocuments = productData.transferDocuments || {}
  const hasDepositReceipt = Boolean(booking?.productData?.hasDepositReceipt)

  const summaryFields = booking
    ? [
      {
        label: 'Asset',
        value: formatAssetLabel({
          title: productData.title,
          neighbourhood: productData.neighbourhood,
        }),
      },
      {
        label: 'Seller',
        value: booking.assetHolder?.name || '—',
      },
      {
        label: 'Buyer',
        value: booking.brokerId?.name || '—',
      },
      {
        label: 'Viewing',
        value:
          booking.date && booking.time
            ? `${formatDate(booking.date)} · ${booking.time}`
            : '—',
      },
      {
        label: 'Transaction status',
        value: formatTransactionPhase(
          productData.dealClosed
            ? 'transferred'
            : transferDocuments.PaymentProof
              ? 'payment_proof_received'
              : transferDocuments.assetTransferDocument
                ? 'awaiting_payment'
                : 'under_process',
        ),
      },
      {
        label: 'Success fee',
        value: transferDocuments.successFee
          ? `AED ${Number(transferDocuments.successFee).toLocaleString()}`
          : transferDocuments.assetTransferDocument
            ? 'Sent to broker'
            : 'Not set',
      },
      {
        label: 'Deposit receipt',
        value: hasDepositReceipt ? 'Received' : 'Pending',
      },
    ]
    : []

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF or Word document.')
      e.target.value = ''
      return
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB.')
      e.target.value = ''
      return
    }

    setUploadFile(selectedFile)
  }

  const handleFileSubmit = async () => {
    if (!uploadFile) {
      toast.error('Please choose a deposit receipt file.')
      return
    }

    setIsSubmitting(true)
    try {
      const fileUpload = await handleFileUpload(uploadFile)
      const certId = fileUpload?.uuid || fileUpload?.certificate?.uuid
      if (!certId) {
        throw new Error('Upload finished but no document id was returned.')
      }

      await customAxios.put(
        `/arrange-view/trustee/transaction/${bookingId}/deposit`,
        {
          transactionDepositDocument: certId,
          trusteeNote: note,
        },
      )

      toast.success('Deposit receipt uploaded.')
      router.replace('/trustee/transaction')
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Could not upload deposit receipt.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <p className='p-4 text-slate-600'>Loading transaction...</p>
  }

  if (!booking) {
    return (
      <div className='p-4'>
        <p className='text-red-600'>Transaction not found.</p>
        <button
          type='button'
          onClick={() => router.replace('/trustee/transaction')}
          className='mt-3 text-sm text-[#002d4f] underline'
        >
          Back to transactions
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        type='button'
        onClick={() => router.replace('/trustee/transaction')}
        className='mb-4 text-sm text-[#002d4f] underline'
      >
        ← Back to transactions
      </button>

      <h1 className='mb-2 text-xl font-bold text-prussianBlue'>
        Deposit receipt
      </h1>
      <p className='mb-6 text-sm text-slate-600'>
        Upload the buyer&apos;s deposit receipt for this deal. Transfer
        documents and success fees are managed from{' '}
        <strong>Manage transfer &amp; fee</strong> on the transaction list.
      </p>

      <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {summaryFields.map((field) => (
          <div key={field.label}>
            <p className='text-sm font-semibold text-prussianBlue'>
              {field.label}
            </p>
            <p className='text-sm text-prussianBlue/60'>{field.value}</p>
          </div>
        ))}
      </div>

      <div className='w-full'>
        <label className='primary-gradient mb-3 block w-full p-2 text-sm font-medium text-white'>
          Transaction deposit receipt
        </label>

        {hasDepositReceipt ? (
          <p className='rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800'>
            Deposit receipt already on file for this transaction.
          </p>
        ) : (
          <>
            <label className='flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#8d7c3b] py-10'>
              <input
                type='file'
                onChange={handleFileChange}
                className='hidden'
                accept='.pdf,.doc,.docx,application/pdf'
              />
              <Upload2Icon className='mb-4' />
              <span className='custom-shadow mb-3 rounded px-7 py-3 text-sm font-medium'>
                Upload receipt
              </span>
              <span className='text-sm text-black/40'>Maximum file size: 2MB</span>
              {uploadFile ? (
                <p className='mt-2 text-sm text-prussianBlue'>{uploadFile.name}</p>
              ) : null}
            </label>

            <div className='mt-4'>
              <label className='mb-1 block text-sm font-medium'>Trustee note</label>
              <input
                type='text'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='mt-1 block w-full rounded-md border border-[#8d7c3b] bg-white py-2.5 pl-2 text-gray-800 focus:outline-none'
                placeholder='Optional note about this deposit'
              />
            </div>

            <div className='mt-4 flex justify-end'>
              <button
                type='button'
                onClick={handleFileSubmit}
                disabled={isSubmitting}
                className='primary-gradient rounded-md px-4 py-2 text-white disabled:opacity-60'
              >
                {isSubmitting ? 'Uploading…' : 'Save deposit receipt'}
              </button>
            </div>
          </>
        )}
      </div>

      <Loader isOpen={isSubmitting} />
    </div>
  )
}

export default TransactionProgress
