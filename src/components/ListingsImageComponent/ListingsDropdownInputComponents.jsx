import Image from 'next/image'
import React from 'react'

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
}) => {
  return (
    <div className='custom-container-dev'>
      <input
        type='text'
        className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${
          errors ? 'input-field-error ' : ''
        }`}
        placeholder={placeholder}
        name={name}
        value={value}
        readOnly={readOnly}
        onClick={handleToggleDropdown}
      />

      {errors && (
        <span className='text-red-500 lg:text-sm text-xs font-medium absolute top-[50px]'>
          **{errorMessage}
        </span>
      )}

      <div className='absolute inset-y-0 right-0 top-3 flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle'>
        <Image
          width={12}
          height={12}
          src='/listing/Vector.svg'
          alt='Dropdown'
          className='toggle-icon'
          onClick={handleToggleDropdown}
        />
        <Image
          width={12}
          height={12}
          src='/listing/vector1.svg'
          alt='Dropdown'
          className='toggle-icon rotate-180'
          onClick={handleToggleDropdown}
        />
      </div>
      {dropdown && !disabled && (
        <div className='absolute z-10 inset-y-0 right-0 w-full h-80 overflow-auto bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col gap-2 cursor-pointer dropdown-toggle'>
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
  )
}

export default ListingsDropdownInputComponents
