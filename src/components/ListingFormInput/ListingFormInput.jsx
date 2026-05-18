'use client'
import React from 'react'

const formatNumber = (value) => {
  const cleaned = value?.toString().replace(/,/g, '')
  const number = parseInt(cleaned, 10)

  if (isNaN(number)) return ''
  return number.toLocaleString('en-US')
}

const ListingFormInput = ({
  errors,
  value,
  handleChange,
  handleBlur,
  required,
  placeholder,
  errorsMessage,
  name,
  maxLength,
  type,
  disabled,
}) => {
  const isPrice = placeholder === 'Price'

  return (
    <>
      {isPrice ? (
        <div
          className={`w-full flex items-center shadow-neons h-[50px] ${errors ? 'input-field-error' : ''
            }`}
        >
          <span
            className={`${errors ? 'border-r' : 'border'
              } px-2 text-dark-grey flex items-center border-dark-grey h-[52px]`}
          >
            AED
          </span>
          <input
            type='text'
            maxLength={maxLength}
            className='h-full w-full border-l-0 pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal'
            required={required}
            placeholder={placeholder}
            name={name}
            value={formatNumber(value)}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, '')
              handleChange({
                ...e,
                target: {
                  ...e.target,
                  name,
                  value: raw,
                },
              })
            }}
            onBlur={handleBlur}
          />
        </div>
      ) : (
        <input
          type={type}
          maxLength={maxLength}
          className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors ? 'input-field-error' : ''
            }`}
          required={required}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
      )}

      {errors && (
        <span className='text-red-500 lg:text-sm text-xs font-medium left-0 absolute top-[99%]'>
          **{errorsMessage}
        </span>
      )}
    </>
  )
}

export default ListingFormInput
