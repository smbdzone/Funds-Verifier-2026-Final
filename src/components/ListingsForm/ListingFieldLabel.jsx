export default function ListingFieldLabel({ label, required = false, className = '' }) {
  if (!label) return null

  return (
    <label
      className={`mb-1.5 block text-[13px] font-normal text-dark-grey ${className}`}
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
