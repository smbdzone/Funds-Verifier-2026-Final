'use client'

import { useCallback, useEffect, useState } from 'react'
import customAxios from '@/utils/apis/apis'
import GlobalLoader from '@/utils/GlobalLoader'
import { formatAed } from '@/libs/paymentDiscount'

function statusBadge(status) {
  const value = String(status || 'pending').toLowerCase()
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    succeeded: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    defaulted: 'bg-red-100 text-red-800',
  }
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
        styles[value] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {value}
    </span>
  )
}

const InstallmentPaymentsPanel = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await customAxios.get('/clozer/my-installments')
      setItems(res.data?.data || [])
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not load installment payments.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className='flex justify-center py-16'>
        <GlobalLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-red-700'>
        {error}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className='rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600'>
        <p className='text-lg font-medium text-[#002D4F] mb-2'>
          No installment plans yet
        </p>
        <p className='text-sm'>
          When you pay for evaluation, 3D walkthrough, technical report, or
          purchases using Clozer, your progress will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <div
          key={item.transaction_id}
          className='rounded-lg border border-gray-200 bg-white p-5 shadow-sm'
        >
          <div className='flex flex-wrap items-start justify-between gap-3 mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-[#002D4F]'>
                {item.service_label}
              </h3>
              {item.service_description && (
                <p className='text-sm text-gray-500 mt-1'>
                  {item.service_description}
                </p>
              )}
              <p className='text-xs text-gray-400 mt-1'>
                Ref: {item.transaction_id}
              </p>
            </div>
            {statusBadge(item.clozer_status)}
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4'>
            <div>
              <p className='text-gray-500'>Total</p>
              <p className='font-semibold'>{formatAed(item.total_amount)}</p>
            </div>
            <div>
              <p className='text-gray-500'>Paid so far</p>
              <p className='font-semibold'>{formatAed(item.total_paid)}</p>
            </div>
            <div>
              <p className='text-gray-500'>Monthly installment</p>
              <p className='font-semibold'>
                {formatAed(item.monthly_installment_amount)}
              </p>
            </div>
            <div>
              <p className='text-gray-500'>Installments</p>
              <p className='font-semibold'>
                {item.installments_paid || 0} / {item.number_of_installments}
              </p>
            </div>
          </div>

          <div className='mb-2 flex justify-between text-xs text-gray-500'>
            <span>Payment progress</span>
            <span>{item.progress_percent}%</span>
          </div>
          <div className='h-2 w-full rounded-full bg-gray-200 overflow-hidden'>
            <div
              className='h-full bg-[#8D7C3B] transition-all'
              style={{ width: `${item.progress_percent}%` }}
            />
          </div>

          {item.installment_updates?.length > 0 && (
            <div className='mt-4 border-t pt-3'>
              <p className='text-xs font-semibold text-gray-500 mb-2'>
                Recent updates
              </p>
              <ul className='space-y-1 text-xs text-gray-600'>
                {item.installment_updates.map((u, idx) => (
                  <li key={idx}>
                    {u.status} — {formatAed(u.amount_paid || 0)} paid
                    {u.received_at
                      ? ` · ${new Date(u.received_at).toLocaleDateString()}`
                      : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default InstallmentPaymentsPanel
