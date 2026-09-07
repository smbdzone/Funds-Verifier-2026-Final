'use client'
import React from 'react'
import PhoneInput from 'react-phone-number-input'
import ListingFieldLabel from '@/components/ListingsForm/ListingFieldLabel'

const PhoneInputComponent = ({
  flags,
  errors,
  value,
  handlePhoneNumberChange,
  handleCountryChange,
  selectedCountryPhone,
  maxLength,
  errorMessage,
  disabled,
  required = true,
}) => {
  return (
    <>
      <ListingFieldLabel label='Phone number' required={required} />
      <PhoneInput
        flags={flags}
        className={`shadow-neons w-full h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal outline-none ${errors ? 'input-field-error' : ''
          }`}
        value={value}
        onChange={handlePhoneNumberChange}
        onCountryChange={handleCountryChange}
        defaultCountry='AE'
        country={selectedCountryPhone}
        limitMaxLength={maxLength}
        international
        countryCallingCodeEditable={false}
        disabled={disabled}
      />

      {errors ? (
        <span className='text-red-500 lg:text-sm text-xs font-medium absolute top-[50px]'>
          **{errorMessage}
        </span>
      ) : null}
    </>
  )
}

export default PhoneInputComponent
