export default function EvaluatorDateField({
  id,
  label,
  value,
  onChange,
  className = '',
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      {label ? (
        <label
          htmlFor={id}
          className='mb-2 block text-sm font-medium text-gray-700 sm:text-base'
        >
          {label}
        </label>
      ) : null}
      <input
        type='date'
        id={id}
        value={value}
        onChange={onChange}
        className='block h-[48px] w-full rounded-md border border-[#8d7c3b] bg-white px-3 text-sm text-gray-800 focus:outline-none sm:text-base'
      />
    </div>
  )
}
