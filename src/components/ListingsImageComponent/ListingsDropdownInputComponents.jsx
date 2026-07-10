import Image from 'next/image'
import React from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

const ListingsDropdownInputComponents = ({
  errors,
  errorMessage,
  value,
  placeholder,
  name,
  handleToggleDropdown,
  dropdown,
  dropdownType,
  dropdownOptions,
  handleSelectOption,
  readOnly,
  disabled,
  required = false,
}) => {
  return (
    <div className='custom-container-dev'>
      {placeholder ? (
        <ListingFieldLabel label={placeholder} required={required} />
      ) : null}
      <div className='relative w-full'>
        <input
          type='text'
          className={`w-full shadow-neons h-[50px] pl-5 pr-10 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors ? 'input-field-error ' : ''
            }`}
          placeholder={value ? '' : `Select ${placeholder}`}
          name={name}
          value={value}
          readOnly={readOnly}
          onClick={handleToggleDropdown}
        />

        <button
          type='button'
          aria-label={`Toggle ${placeholder || name} dropdown`}
          className='absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center justify-center gap-0.5 cursor-pointer dropdown-toggle disabled:cursor-not-allowed'
          onClick={handleToggleDropdown}
          disabled={disabled}
        >
          <Image
            width={12}
            height={12}
            src='/listing/Vector.svg'
            alt=''
            className='toggle-icon pointer-events-none'
          />
          <Image
            width={12}
            height={12}
            src='/listing/vector1.svg'
            alt=''
            className='toggle-icon rotate-180 pointer-events-none'
          />
        </button>

        {dropdown && !disabled && (
          <div className='absolute left-0 right-0 top-[calc(100%+4px)] z-10 flex max-h-80 flex-col gap-2 overflow-auto rounded-md border border-gray-200 bg-white shadow-md cursor-pointer dropdown-toggle'>
            {dropdownOptions.map((option, index) => (
              <div
                key={index}
                className='hover:bg-offwhite hover:text-reefGold p-3'
                onClick={() => handleSelectOption(dropdownType, option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {errors && (
        <span className='mt-1 text-xs font-medium text-red-500 lg:text-sm'>
          **{errorMessage}
        </span>
      )}
    </div>
  )
}

export default ListingsDropdownInputComponents
