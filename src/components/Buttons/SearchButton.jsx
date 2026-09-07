"use client";
import React from "react";
import Image from "next/image";
import vectorSearch from "@/assets/vector6.svg";

const SearchButton = ({ isLoading }) => {
  return (
    <button
      className='cursor-pointer text-sm font-semibold tracking-wide flex flex-row justify-center items-center gap-2 px-6 h-[46px] min-w-[132px] rounded-lg text-white bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#a2913e] shadow-[0_8px_24px_rgba(0,0,0,0.14)] border border-white/20 opacity-90 hover:opacity-100 transition-opacity'
      type='button'
    >
      {isLoading ? (
        "Searching..."
      ) : (
        <>
          <Image
            width={20}
            height={20}
            className="max-w-full  overflow-hidden max-h-full object-contain"
            alt="Search icon"
            src={vectorSearch.src}
          />
          Search
        </>
      )}
    </button>
  );
};

export default SearchButton;
