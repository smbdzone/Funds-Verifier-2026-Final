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
  suffix,
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
          className={`w-full shadow-neons h-[50px] pl-5 ${
            suffix ? 'pr-14' : 'pr-5'
          } placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${
            errors ? 'input-field-error ' : ''
          }`}
          name={name}
          value={safeValue}
          onChange={(e) => {
            if (name === 'capacityWeight' || name === 'dldNumber') {
              handleChange(e)
              return
            }
            withAutoCapitalizeChange(e, handleChange)
          }}
          onKeyDown={
            name === 'capacityWeight' || name === 'dldNumber'
              ? (e) => {
                  if (
                    e.key === '-' ||
                    e.key === 'e' ||
                    e.key === 'E' ||
                    e.key === '+'
                  ) {
                    e.preventDefault()
                  }
                }
              : undefined
          }
          inputMode={
            name === 'capacityWeight'
              ? 'decimal'
              : name === 'dldNumber'
                ? 'numeric'
                : undefined
          }
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
        {suffix ? (
          <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-dark-grey'>
            {suffix}
          </span>
        ) : null}
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

