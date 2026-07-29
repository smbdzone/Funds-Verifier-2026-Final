export default function ListingFieldLabel({ label, required = false, className = '' }) {
  if (!label) return null

  return (
    <label
      className={`mb-1 block text-[13px] leading-4 font-normal text-dark-grey ${className}`}
    >
      {label}
      {required ? (
        <span className='ml-0.5 text-reefGold font-semibold' aria-hidden='true'>
          *
        </span>
      ) : null}
    </label>
  )
}
