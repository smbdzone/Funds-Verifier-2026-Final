import Image from 'next/image'

const ListingModalInputComponent = ({
  maxLength,
  name,
  value,
  handleChange,
  required,
  errors,
  errorMessage,
  dateTime,
  handleOpenModal,
  customPlaceholder,
  subPlaceholder,
  icon,
  disabled,
}) => {
  return (
    <div className={`${disabled ? 'cursor-not-allowed' : ''}`}>
      <input
        disabled={disabled}
        type='text'
        maxLength={maxLength}
        className={`shadow-neons ${
          errors && customPlaceholder
            ? 'input-field-error lg:text-sm text-xs'
            : ''
        } w-full h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-xs md:placeholder:text-[15px] placeholder:font-normal`}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
      />

      <div
        className={`custom-placeholder lg:text-sm text-xs absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ease-in-out
        ${
          errors && customPlaceholder !== 'Request Evaluation'
            ? 'input-field-error'
            : ''
        }
        `}
      >
        {!value && <span className='text-gray-400'>{customPlaceholder}</span>}

        <span className='optional text-xs text-yellow-600'>
          {subPlaceholder}
        </span>
      </div>

      {errors && (
        <span className='text-red-500 lg:text-sm text-xs font-medium left-0 absolute top-[98%]'>
          **{errorMessage}
        </span>
      )}
      {customPlaceholder === 'Request Evaluation' ? (
        <div className='absolute right-[15px] top-[15px]'>
          <div className='relative group'>
            {!disabled && (
              <Image
                width={23}
                height={23}
                src='/icons/calender.png'
                alt='infoicon'
                onClick={handleOpenModal} // Open modal on calendar icon click
                className='cursor-pointer'
              />
            )}
            <div className='absolute w-[300px] right-0 -top-12 transform -translate-y-1/2 bg-white text-black text-sm p-5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50'>
              An Evaluation Request for the item is required by our partner.
              Upload the document to get started...
            </div>
          </div>
        </div>
      ) : (
        <>
          {disabled ? (
            <></>
          ) : (
            <button type='button'>
              {dateTime ? (
                <Image
                  width={23}
                  height={23}
                  src={icon}
                  alt='request'
                  onClick={handleOpenModal}
                  className='absolute z-10 cursor-pointer right-[15px] top-[15px]'
                />
              ) : (
                <Image
                  width={23}
                  height={23}
                  src='/icons/calender.png'
                  alt='request'
                  onClick={handleOpenModal}
                  className='absolute right-[15px] top-[15px]'
                />
              )}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default ListingModalInputComponent
