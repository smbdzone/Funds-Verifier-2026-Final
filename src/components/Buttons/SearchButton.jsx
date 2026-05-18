"use client";
import React from "react";
import Image from "next/image";
import vectorSearch from "@/assets/vector6.svg";

const SearchButton = ({ isLoading }) => {
  return (
    <button
      className="cursor-pointer xl:text-lg lg:text-base md:text-sm base text-xs flex flex-row justify-center items-center gap-2 p-3 rounded font-medium text-white bg-gradient-to-r from-[#a2913e] via-[#d7c590] to-[#a2913e] xl:w-[209px] h-10 w-32 lg:h-16 lg:w-40 opacity-80 hover:opacity-100"
      type="button"
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
