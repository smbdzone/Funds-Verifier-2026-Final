'use client'

import {
  applyFullPayDiscount,
  formatAed,
  getFullPayDiscountPercent,
} from '@/libs/paymentDiscount'

const PaymentChoiceModal = ({
  show,
  onClose,
  onPayFull,
  onPayInstallments,
  title = 'How would you like to pay?',
  amount,
  loading = false,
  installmentLabel = 'Pay by Installments with Clozer',
  installmentDescription,
}) => {
  if (!show) return null

  const discount = applyFullPayDiscount(amount)
  const discountPercent = getFullPayDiscountPercent()

  const fullPayLabel =
    discountPercent > 0
      ? `Pay in Full — ${formatAed(discount.discounted)} (${discountPercent}% off)`
      : 'Pay in Full'

  const fullPayDescription =
    discountPercent > 0
      ? `Save ${formatAed(discount.discountAmount)} vs ${formatAed(discount.original)}. Pay now with card (Stripe).`
      : 'Pay the full amount now with card (Stripe).'

  const installmentText =
    installmentDescription ||
    `Pay the full ${formatAed(discount.original)} in monthly installments via Clozer (no discount).`

  return (
    <>
      <div className='fixed inset-0 modal-bg z-40' onClick={onClose} />
      <div className='fixed inset-0 flex justify-center items-center z-50 px-4'>
        <div className='bg-white rounded-lg w-full max-w-[520px] shadow-xl px-6 py-6'>
          <h2 className='text-[#8D7C3B] text-xl font-semibold mb-2'>{title}</h2>
          {amount != null && (
            <p className='text-gray-600 mb-5'>
              Invoice total:{' '}
              <strong>{formatAed(discount.original)}</strong>
              {discountPercent > 0 && (
                <span className='ml-2 text-green-700 text-sm font-medium'>
                  Full pay today: {formatAed(discount.discounted)}
                </span>
              )}
            </p>
          )}

          <div className='space-y-3'>
            <button
              type='button'
              disabled={loading}
              onClick={onPayFull}
              className='w-full text-left border-2 border-[#8D7C3B] rounded-lg p-4 hover:bg-[#8D7C3B]/5 transition disabled:opacity-50 relative'
            >
              {discountPercent > 0 && (
                <span className='absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded'>
                  SAVE {discountPercent}%
                </span>
              )}
              <span className='block font-semibold text-[#002D4F]'>{fullPayLabel}</span>
              <span className='block text-sm text-gray-600 mt-1'>{fullPayDescription}</span>
            </button>

            <button
              type='button'
              disabled={loading}
              onClick={onPayInstallments}
              className='w-full text-left border-2 border-[#002D4F] rounded-lg p-4 hover:bg-[#002D4F]/5 transition disabled:opacity-50'
            >
              <span className='block font-semibold text-[#002D4F]'>{installmentLabel}</span>
              <span className='block text-sm text-gray-600 mt-1'>{installmentText}</span>
            </button>
          </div>

          <div className='flex justify-end mt-6'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='border border-gray-300 text-gray-700 px-6 py-2 rounded disabled:opacity-50'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentChoiceModal

export { applyFullPayDiscount }
