"use client";
import Image from "next/image";
import React from "react";

const ListingCustomPlaceholderDropdown = ({
  value,
  name,
  readOnly,
  disabled,
  handleToggleDropdown,
  dropdown,
  dropdownOptions,
  customPlaceholder,
  subPlaceholder,
  dropdownType,
  handleSelectOption,
}) => {
  return (
    <>
      <div className="relative-placeholder w-full">
        <input
          type="text"
          className="input-with-placeholder form-input
            shadow-neons w-full h-[50px] pl-5 pr-14 
            placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal card-number-input                 "
          name={name}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onClick={disabled ? undefined : handleToggleDropdown}
        />
        <div className="absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle">
          <Image
            width={12}
            height={12}
            src="/listing/Vector.svg"
            alt="Dropdown"
            className="toggle-icon"
            onClick={handleToggleDropdown}
          />
          <Image
            width={12}
            height={12}
            src="/listing/vector1.svg"
            alt="Dropdown"
            className="toggle-icon rotate-180"
            onClick={handleToggleDropdown}
          />
        </div>
        {dropdown && !disabled && (
          <div className="absolute z-10 inset-y-0 right-0 w-full h-80 overflow-auto bg-white border border-gray-2 rounded-md shadow-md top-[60px] flex flex-col cursor-pointer dropdown-toggle">
            {dropdownOptions.map((option, index) => (
              <div
                key={index}
                className="hover:bg-offwhite hover:text-reefGold p-3"
                onClick={() => handleSelectOption(dropdownType, option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {value === "" && (
          <div className="custom-placeholder text-sm absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ease-in-out">
            <span className="text-gray-400">{customPlaceholder} </span>
            <span className="optional text-xs text-yellow-600">
              {subPlaceholder}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default ListingCustomPlaceholderDropdown;
