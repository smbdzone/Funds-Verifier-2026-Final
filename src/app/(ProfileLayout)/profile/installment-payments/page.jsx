'use client'

import InstallmentPaymentsPanel from '@/components/payments/InstallmentPaymentsPanel'

export default function ProfileInstallmentPaymentsPage() {
  return (
    <div>
      <span className='text-lg text-prussianBlue/40 mb-4 block'>
        Installment Payments
      </span>
      <div className='custom-shadow rounded p-4 sm:p-6 bg-white'>
        <h1 className='text-xl font-semibold text-[#002D4F] mb-4'>
          Clozer installment plans
        </h1>
        <InstallmentPaymentsPanel />
      </div>
    </div>
  )
}
