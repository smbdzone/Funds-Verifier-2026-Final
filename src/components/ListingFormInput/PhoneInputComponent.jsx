'use client'
import Image from 'next/image'
import React from 'react'
import PhoneInput from 'react-phone-number-input'

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
}) => {
  return (
    <>
      <PhoneInput
        flags={flags}
        className={`shadow-neons w-full h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal outline-none ${
          errors ? 'input-field-error' : ''
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
      ) : (
        <div className='absolute inset-y-0 right-0 top-[9px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer'>
          {errors ? (
            <span className='text-red-500 text-3xl font-medium z-9999'>
              &times;
            </span>
          ) : (
            <div className='required'>
              <Image
                className='absolute top-3 right-3'
                width={14}
                height={14}
                src='/listing/tick.svg'
                alt='cross'
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default PhoneInputComponent
