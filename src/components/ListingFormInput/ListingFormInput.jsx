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
  inputMode,
}) => {
  const isPrice = placeholder === 'Price'
  const isTitle = String(name || '').toLowerCase() === 'title'
  const isGrams = String(name || '').toLowerCase() === 'grams'
  const isKilometers = String(name || '').toLowerCase() === 'kilometers'
  const isYear = String(name || '').toLowerCase() === 'year'
  const isVin = String(name || '').toUpperCase() === 'VIN'
  const isDldNumber = String(name || '').toLowerCase() === 'dldnumber'
  const isPositiveNumeric =
    isGrams || isKilometers || isYear || isVin || isDldNumber
  const label = fieldLabel || (required ? labelFromPlaceholder(placeholder) : '')

  const onTextChange = (e) => {
    if (isPositiveNumeric) {
      handleChange(e)
      return
    }
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
            inputMode='numeric'
            maxLength={maxLength}
            disabled={disabled}
            className='h-full w-full border-l-0 pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal'
            required={required}
            placeholder={placeholder}
            name={name}
            value={formatNumber(value)}
            onKeyDown={(e) => {
              if (
                e.key === '-' ||
                e.key === 'e' ||
                e.key === 'E' ||
                e.key === '+'
              ) {
                e.preventDefault()
              }
            }}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '')
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
          inputMode={inputMode}
          className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors ? 'input-field-error' : ''
            }`}
          required={required}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onTextChange}
          onBlur={handleBlur}
          disabled={disabled}
          onKeyDown={
            isPositiveNumeric
              ? (e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                  e.preventDefault()
                }
              }
              : undefined
          }
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
  const cleaned = value?.toString().replace(/[^\d]/g, '')
  if (!cleaned) return ''
  const number = parseInt(cleaned, 10)

  if (isNaN(number) || number < 0) return ''
  return number.toLocaleString('en-US')
}

export default ListingFormInput

