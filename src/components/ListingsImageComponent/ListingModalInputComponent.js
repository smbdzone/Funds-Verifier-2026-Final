import Image from 'next/image'

import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

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
    <div className={`${disabled ? 'cursor-not-allowed' : ''} relative`}>
      {customPlaceholder ? (
        <ListingFieldLabel
          label={String(customPlaceholder).replace(/\s*\(.*\)$/, '').trim()}
          required={required}
        />
      ) : null}
      <div className='relative'>
        <input
          disabled={disabled}
          type='text'
          maxLength={maxLength}
          placeholder={customPlaceholder || ''}
          className={`shadow-neons ${errors && customPlaceholder
            ? 'input-field-error lg:text-sm text-xs'
            : ''
            } w-full h-[50px] pl-5 pr-12 placeholder:text-dark-grey outline-with-opacity placeholder:text-xs md:placeholder:text-[15px] placeholder:font-normal`}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
        />

        {subPlaceholder && !value ? (
          <span className='pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xs text-yellow-600'>
            {subPlaceholder}
          </span>
        ) : null}

        {errors && (
          <span className='text-red-500 lg:text-sm text-xs font-medium left-0 absolute top-[calc(100%+2px)]'>
            **{errorMessage}
          </span>
        )}
        {customPlaceholder === 'Request Evaluation' ? (
          <div className='absolute right-[15px] top-1/2 -translate-y-1/2'>
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
                    className='absolute z-10 cursor-pointer right-[15px] top-1/2 -translate-y-1/2'
                  />
                ) : (
                  <Image
                    width={23}
                    height={23}
                    src='/icons/calender.png'
                    alt='request'
                    onClick={handleOpenModal}
                    className='absolute right-[15px] top-1/2 -translate-y-1/2'
                  />
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ListingModalInputComponent
