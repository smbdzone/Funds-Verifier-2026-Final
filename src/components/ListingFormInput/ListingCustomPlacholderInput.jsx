import React from 'react'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'
import { withAutoCapitalizeChange } from '@/libs/autoCapitalizeText'

const ListingCustomPlacholderInput = ({
  value,
  name,
  handleChange,
  disabled,
  customPlaceholder,
  subPlaceholder,
  errorMessage,
  required,
  maxLength,
  errors,
}) => {
  const safeValue = value ?? ''
  const label = String(customPlaceholder || '').trim()
  const isOptional = String(subPlaceholder || '')
    .toLowerCase()
    .includes('optional')

  return (
    <div className='custom-container-dev'>
      {label ? (
        <ListingFieldLabel label={label} required={Boolean(required)} />
      ) : null}
      <div className='relative w-full'>
        <input
          type='text'
          className={`w-full shadow-neons h-[50px] pl-5 pr-14 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${
            errors ? 'input-field-error ' : ''
          }`}
          name={name}
          value={safeValue}
          onChange={(e) => withAutoCapitalizeChange(e, handleChange)}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          placeholder={
            isOptional
              ? 'Optional'
              : label
                ? `Enter ${label}`
                : ''
          }
        />
      </div>
      {errors ? (
        <span className='mt-1 text-xs font-medium text-red-500 lg:text-sm'>
          **{errorMessage}
        </span>
      ) : null}
    </div>
  )
}

export default ListingCustomPlacholderInput
