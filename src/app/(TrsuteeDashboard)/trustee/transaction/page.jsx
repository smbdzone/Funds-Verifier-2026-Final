'use client'

import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import customAxios from '@/utils/apis/apis'
import { TransactionMange } from '@/components/modules/TrusteeProfile/TransactTionManage'

const ViewerDetails = dynamic(
  () => import('@/components/modules/SellerProfile/ViewerDetails'),
  { ssr: false },
)

const ViewerDetailsErrorBoundary = dynamic(
  () =>
    import('@/components/modules/SellerProfile/ViewerDetailsErrorBoundary').then(
      (module) => ({ default: module.ViewerDetailsErrorBoundary }),
    ),
  { ssr: false },
)

const Page = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await customAxios.get('/arrange-view/transactions')
      setTransactions(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Could not load transactions.',
      )
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleViewTransaction = (bookingUuid) => {
    setSelectedBookingId(bookingUuid)
    setOpenDetails(true)
  }

  const handleCloseDetails = () => {
    setOpenDetails(false)
    setSelectedBookingId(null)
    fetchTransactions()
  }

  if (loading) {
    return <div className='p-4 text-slate-600'>Loading transactions...</div>
  }

  return (
    <div className='min-w-0 max-w-full overflow-hidden'>
      <p className='mb-4 text-sm text-slate-600'>
        Deals that are under process or in the transfer / success-fee stage.
        Open a row to manage transfer documents, fees, and payment proof.
      </p>
      <TransactionMange
        transactions={transactions}
        onView={handleViewTransaction}
        onRefresh={fetchTransactions}
      />
      {openDetails && selectedBookingId ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl'>
            <ViewerDetailsErrorBoundary onClose={handleCloseDetails}>
              <ViewerDetails
                bookingId={selectedBookingId}
                handleClose={handleCloseDetails}
              />
            </ViewerDetailsErrorBoundary>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Page
