'use client'

import EvaluatorPriceInput from './EvaluatorPriceInput'

const EvaluatorEditableFields = ({
  formattedListingPrice,
  onListingPriceChange,
  formattedEvaluationPrice,
  onEvaluationPriceChange,
  formattedSqft = '',
  onSqftChange,
  roi = '',
  onRoiChange,
  variant = 'full',
  listingPriceLabel = 'Listing price',
  showEvaluationPrice = true,
  showSqft = false,
  showRoi = true,
  onSave,
  isSaving = false,
}) => {
  const isPending = variant === 'pending'

  const labelClass = isPending
    ? 'block text-sm sm:text-base font-medium text-[#969696]'
    : 'block text-sm sm:text-base font-medium text-gray-700'

  const inputClass = isPending
    ? 'focus:outline-none mt-1 block w-full px-3 py-3 rounded-md bg-white text-gray-800 text-sm sm:text-base border border-[#969696]'
    : 'mt-1 block w-full px-3 py-3 rounded-md bg-white text-sm sm:text-base border border-[#8d7c3b] text-gray-800 focus:outline-none'

  const renderPriceField = (label) => (
    <div>
      <label className={labelClass}>{label}</label>
      <EvaluatorPriceInput
        value={formattedListingPrice}
        onChange={onListingPriceChange}
        placeholder={isPending ? 'Enter price' : '0'}
        isPending={isPending}
      />
    </div>
  )

  const renderEvaluationPriceField = () => (
    <div>
      <label className={labelClass}>Evaluation price</label>
      <EvaluatorPriceInput
        value={formattedEvaluationPrice}
        onChange={onEvaluationPriceChange}
        placeholder='0'
        isPending={isPending}
      />
    </div>
  )

  const renderSqftField = () => (
    <div>
      <label className={labelClass}>Size in square feet</label>
      <input
        type='text'
        inputMode='numeric'
        value={formattedSqft}
        onChange={onSqftChange}
        className={inputClass}
        placeholder={isPending ? 'Enter size' : '0'}
      />
    </div>
  )

  if (isPending) {
    return (
      <div className='mb-4'>
        <div className='grid sm:grid-cols-2 gap-4'>
          {renderPriceField(listingPriceLabel)}
          {showSqft ? renderSqftField() : null}
        </div>
        <div className='mt-4 flex justify-end'>
          <button
            type='button'
            onClick={onSave}
            disabled={isSaving}
            className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md disabled:opacity-60'
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className='mb-6 rounded-lg border border-[#8d7c3b]/40 bg-[#faf8f3] p-4 sm:p-5'>
      <h2 className='text-base sm:text-lg font-semibold text-prussianBlue mb-4'>
        Update listing values
      </h2>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {renderPriceField(listingPriceLabel)}
        {showEvaluationPrice ? renderEvaluationPriceField() : null}
        {showSqft ? renderSqftField() : null}
        {showRoi ? (
          <div>
            <label className={labelClass}>ROI</label>
            <div className='relative mt-1'>
              <input
                type='text'
                inputMode='decimal'
                value={roi}
                onChange={(e) =>
                  onRoiChange?.(e.target.value.replace(/[^\d.]/g, ''))
                }
                className={`${inputClass} mt-0 pr-10`}
                placeholder='0'
              />
              <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600 text-sm'>
                %
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className='mt-5 flex justify-end'>
        <button
          type='button'
          onClick={onSave}
          disabled={isSaving}
          className='primary-gradient text-white py-2 px-6 text-sm sm:text-base rounded-md disabled:opacity-60'
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </section>
  )
}

export default EvaluatorEditableFields
