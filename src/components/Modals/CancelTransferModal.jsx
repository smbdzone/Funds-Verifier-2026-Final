import React from 'react'

const CancelTransferModal = ({
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='cancel-transfer-title'
    >
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
        <h2
          id='cancel-transfer-title'
          className='text-xl font-semibold text-prussianBlue'
        >
          Cancel transfer submission?
        </h2>
        <p className='mt-3 text-sm leading-relaxed text-slate-600'>
          This will remove the submitted transfer document and success fee from
          this booking. You can upload the document and enter the fee again
          afterward.
        </p>
        <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-prussianBlue disabled:cursor-not-allowed disabled:opacity-60'
          >
            Keep submission
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={loading}
            className='rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {loading ? 'Cancelling…' : 'Yes, cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelTransferModal
