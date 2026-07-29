'use client'
import React from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'
import {
  autoCapitalizeTitle,
  withAutoCapitalizeChange,
} from '@/libs/autoCapitalizeText'

const labelFromPlaceholder = (placeholder) =>
  String(placeholder || '')
    .replace(/\(max\.[^)]+\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

const ListingFormInput = ({
  errors,
  value,
  handleChange,
  handleBlur,
  required,
  fieldLabel,
  placeholder,
  errorsMessage,
  name,
  maxLength,
  type,
  disabled,
}) => {
  const isPrice = placeholder === 'Price'
  const isTitle = String(name || '').toLowerCase() === 'title'
  const label = fieldLabel || (required ? labelFromPlaceholder(placeholder) : '')

  const onTextChange = (e) => {
    if (isTitle) {
      const nextValue = autoCapitalizeTitle(e.target.value)
      handleChange({
        ...e,
        target: {
          name,
          value: nextValue,
        },
      })
      return
    }
    withAutoCapitalizeChange(e, handleChange)
  }

  return (
    <div className='relative w-full'>
      {label ? <ListingFieldLabel label={label} required={required} /> : null}
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
          onChange={onTextChange}
          onBlur={handleBlur}
          disabled={disabled}
        />
      )}

      {errors && (
        <span className='absolute left-0 top-[99%] text-xs font-medium text-red-500 lg:text-sm'>
          **{errorsMessage}
        </span>
      )}
    </div>
  )
}

const formatNumber = (value) => {
  const cleaned = value?.toString().replace(/,/g, '')
  const number = parseInt(cleaned, 10)

  if (isNaN(number)) return ''
  return number.toLocaleString('en-US')
}

export default ListingFormInput

