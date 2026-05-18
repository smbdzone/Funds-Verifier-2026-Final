import React from "react";

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
  return (
    <>
      <input
        type="text"
        className="input-with-placeholder form-input
        shadow-neons w-full h-[50px] pl-5 pr-14 
        placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input               "
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
      />
      <br />
      {value === "" && (
        <div className="custom-placeholder text-sm text-gray-400">
          {customPlaceholder}
          <span className="optional text-xs text-yellow-600">
            {subPlaceholder}
          </span>
        </div>
      )}
      {errors && (
        <span className="text-red-500 lg:text-sm text-xs font-medium absolute top-[98%]">
          **{errorMessage}
        </span>
      )}
    </>
  );
};

export default ListingCustomPlacholderInput;
