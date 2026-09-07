'use client'

import InstallmentPaymentsPanel from '@/components/payments/InstallmentPaymentsPanel'

export default function SellerInstallmentPaymentsPage() {
  return (
    <div>
      <div className='custom-shadow rounded mb-6'>
        <div className='primary-gradient border border-black rounded px-6 sm:px-12 py-4'>
          <h1 className='text-xl sm:text-2xl font-medium text-white'>
            Installment Payments (Clozer)
          </h1>
        </div>
      </div>
      <InstallmentPaymentsPanel />
    </div>
  )
}
