'use client'

/** Price field with AED prefix — avoids overlap on large values (e.g. 5,000,000). */
export function EvaluatorPriceInput({
  value,
  onChange,
  placeholder = '0',
  isPending = false,
  id,
  className = '',
}) {
  const borderClass = isPending ? 'border-[#969696]' : 'border-[#8d7c3b]'

  return (
    <div
      className={`mt-1 flex w-full overflow-hidden rounded-md border bg-white ${borderClass} ${className}`}
    >
      <span className='flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-600'>
        AED
      </span>
      <input
        id={id}
        type='text'
        inputMode='numeric'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='min-w-0 flex-1 px-3 py-3 text-sm sm:text-base text-gray-800 placeholder:text-gray-400 focus:outline-none'
      />
    </div>
  )
}

export default EvaluatorPriceInput
