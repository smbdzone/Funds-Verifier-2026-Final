"use client";
import React, { useState } from "react";
import Image from "next/image";

const DropdownInput = ({
  name,
  placeholder,
  value = "", // Default to an empty string if value is not passed
  options,
  onSelect,
  dropdownOpen,
  onDropdownOpen, // Function to handle opening/closing dropdowns in the parent
  readOnly = true,
  errors,
  required,
}) => {
  const [selectedOption, setSelectedOption] = useState(value);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onSelect(option); // Ensure only the selected value is passed
    onDropdownOpen(""); // Close dropdown after selection
  };

  return (
    <div className="relative w-full">
      <div className="custom-container" onClick={() => onDropdownOpen(name)}>
        <input
          type="text"
          maxLength={50}
          className={`w-full shadow-neon h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity`}
          required
          placeholder={placeholder}
          name={name}
          value={selectedOption ? `${selectedOption} - ${placeholder}` : ""} // Show selected option with name or placeholder
          readOnly={readOnly}
        />
        <div className="absolute inset-y-0 right-0 top-[16px] flex flex-col gap-2 items-center pr-[15px] cursor-pointer dropdown-toggle">
          <Image
            width={12}
            height={12}
            src="/listing/Vector.svg"
            alt="Dropdown"
            className={`toggle-icon`}
          />
          <Image
            width={12}
            height={12}
            src="/listing/Vector.svg"
            alt="Dropdown"
            className={`toggle-icon  rotate-180`}
          />
        </div>
      </div>

      <div
        className={` text-sm absolute right-12 top-[50%] transform -translate-y-3 pointer-events-none transition-all duration-200 ease-in-out
          `}
      >
        {!required && (
          <span className="text-xs text-yellow-600">{" (Optional)"}</span>
        )}
      </div>
      {errors && errors[name] && (
        <span className="text-red-500 lg:text-sm text-xs font-medium absolute top-[50px]">
          **{errors[name]}
        </span>
      )}
      {dropdownOpen === name && (
        <div className="absolute z-10 w-full bg-white rounded-md shadow-md max-h-60 overflow-y-auto mt-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-offwhite hover:text-reefGold cursor-pointer"
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownInput;
