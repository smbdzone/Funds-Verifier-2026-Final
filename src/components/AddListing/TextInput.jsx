import { formatPriceUS } from "@/utils";
import React from "react";

const TextInput = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  errors,
  required = false,
  className = "",
  unit = "",
  maxLength,
}) => {
  return (
    <div
      className={`${
        name === "additionalDescription" ? "col-span-2" : ""
      } relative w-full dropdown-container`}
    >
      <div className="w-full custom-container-dev">
        {type === "textarea" ? (
          <textarea
            type="textarea"
            className={`relative w-full shadow-neon h-full p-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal
          `}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            rows={3}
            maxLength={maxLength}
          />
        ) : type === "number" ? (
          <input
            type="text"
            className={`relative w-full shadow-neon h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal 
            ${className}
          `}
            placeholder={placeholder}
            name={name}
            value={value ? `${unit} ${formatPriceUS(value)}` : ""}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
          />
        ) : (
          <input
            type="text"
            className={`relative w-full shadow-neon h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal  ${className}
          `}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            maxLength={maxLength}
          />
        )}

        <div
          className={` text-sm absolute right-3 top-[50%] transform -translate-y-3 pointer-events-none transition-all duration-200 ease-in-out
          `}
        >
          {!required && (
            <span className="text-xs text-yellow-600">{" (Optional)"}</span>
          )}
        </div>
      </div>

      {errors && errors[name] && (
        <span className="text-red-500 lg:text-sm text-xs font-medium absolute -bottom-5">
          **{errors[name]}
        </span>
      )}
    </div>
  );
};

export default TextInput;
