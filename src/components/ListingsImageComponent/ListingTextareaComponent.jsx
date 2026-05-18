import React from "react";

const ListingTextareaComponent = ({
  errors,
  value,
  handleChange,
  handleBlur,
  errorsMessage,
  name,
  placeholder,
  maxLength,
  disabled,
}) => {
  const charCount = value?.length || 0;
  return (
    <div className="custom-container-dev">
      <textarea
        className={`shadow-neons p-2 h-[116px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${errors ? "input-field-error" : ""
          }`}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={maxLength} // Limit character input
        disabled={disabled}
      />
      {/* Character Counter */}
      {name === "description" && (
        <div
          className={`absolute right-5 bottom-0 text-sm ${charCount > maxLength ? "text-red-500" : "text-gray-500"
            }`}
        >
          {charCount}/{maxLength}
        </div>
      )}
      {name === "additionalDescription" && (
        <div
          className={`absolute right-5 bottom-0 text-sm ${charCount > maxLength ? "text-red-500" : "text-gray-500"
            }`}
        >
          {charCount}/{maxLength}
        </div>
      )}
      {errorsMessage ? (
        <span className="text-red-500 text-sm font-medium absolute top-[99%]">
          **{errorsMessage}
        </span>
      ) : null}
    </div>
  );
};

export default ListingTextareaComponent;
