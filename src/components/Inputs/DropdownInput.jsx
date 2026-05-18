"use client";
import React, { useEffect, useRef, useState } from "react";

const DropdownInput = ({
  setToggle,
  selectedValue,
  toggle,
  onChange,
  dropdownOptions = [],
  searchQuery,
  setSearchQuery,
  placeholder = "Select an option",
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOptions(dropdownOptions);
    } else {
      const filtered = dropdownOptions?.filter((item) => {
        const name = typeof item === "object" ? item.country : item;
        return name?.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredOptions(filtered);
    }
  }, [searchQuery, dropdownOptions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderDropdownOptions = () => (
    <div
      ref={dropdownRef}
      className="absolute mt-2 left-0 right-0 max-h-[280px] bg-white h-96 overflow-y-auto rounded-lg shadow-neon z-10 py-2"
    >
      {filteredOptions?.length > 0 &&
        filteredOptions.map((option, index) => (
          <div
            key={index}
            onClick={() => {
              onChange(option);
              setToggle(false);
              setSearchQuery(typeof option === "object" ? option.country : option);
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 px-2 py-2 hover:text-white hover:bg-[#1967d2] text-black"
          >
            {option?.country || option}
          </div>
        ))}
    </div>
  );

  return (
    <div className="relative w-full text-start dropdown-container">
      <input
        ref={inputRef}
        type="text"
        onClick={() => setToggle(true)}
        placeholder={placeholder}
        className="shadow-neons rounded w-full h-[48px] pl-5 text-start bg-white placeholder-black text-black outline-none"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (!toggle) setToggle(true);
        }}
      />
      {toggle && renderDropdownOptions()}
    </div>
  );
};

export default DropdownInput;
