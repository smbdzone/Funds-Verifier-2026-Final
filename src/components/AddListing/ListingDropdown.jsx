import React from "react";
import Image from "next/image";

const ListingDropdown = ({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative border-r py-4 pr-4 w-full flex flex-col items-center justify-center">
      <button
        className="dropdownButton flex items-center text-light-blue"
        type="button"
        onClick={onToggle}
      >
        <div>
          <p className="xl:text-lg lg:text-base md:text-xs xxs:text-sm font-medium text-dark-black">
            {label}
          </p>
          <p className="lg:text-xs md:text-[10px] xxs:text-[12px] font-normal pt-[5px] text-dark-grey">
            {value}
          </p>
        </div>
        <Image
          width={12}
          height={12}
          src="/listing/arrowgold.svg"
          alt="arrowblue"
          className="xl:ml-[30px] lg:ml-[10px] md:ml-[6px] xxs:ml-[10px]"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg max-h-[200px] overflow-y-auto z-10">
          {setSearchQuery && (
            <input
              type="text"
              placeholder={`Search ${label}`}
              className="w-full p-2 bg-[#F5F5F5] outline-none text-[#8D7C3B]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => onSelect(option)}
              className="cursor-pointer p-2 hover:bg-gray-100 px-2 py-2 hover:text-[#8D7C3B] hover:bg-[#F5F5F5] text-gray-400"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingDropdown;
