import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Image from "next/image";
import flags from "react-phone-number-input/flags";

const PhoneInputField = ({
  value,
  onChange,
  onCountryChange,
  defaultCountry = "AE",
  country = "",
  maxLength,
  errors = {},
  formData,
  id = false,
}) => {
  const handlePhoneNumberChange = (phone) => {
    onChange(phone);
  };

  const handleCountryChange = (countryCode) => {
    onCountryChange(countryCode);
  };

  return (
    <div className="relative w-full ">
      <PhoneInput
        flags={flags}
        className={`shadow-neons w-full h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal outline-none ${
          errors.phoneNumber ? "border-red-500 border" : ""
        }`}
        value={id ? (formData.phoneNumber || '') : (value || '')}
        onChange={handlePhoneNumberChange}
        onCountryChange={handleCountryChange}
        defaultCountry={defaultCountry}
        country={country}
        limitMaxLength={maxLength}
        international
        countryCallingCodeEditable={false}
      />

      {errors.phoneNumber && !formData.phoneNumber ? (
        <span className="text-red-500 text-sm font-medium absolute top-[50px]">
          **{errors.phoneNumber}
        </span>
      ) : (
        <div className="absolute inset-y-0 right-0 top-[9px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer">
          {errors.phoneNumber ? (
            <span className="text-red-500 text-3xl font-medium z-9999">
              &times;
            </span>
          ) : (
            <div className="required">
              <Image
                className="absolute top-3 right-3"
                width={14}
                height={14}
                src="/listing/tick.svg"
                alt="checkmark"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneInputField;
