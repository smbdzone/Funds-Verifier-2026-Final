"use client";
import React from "react";

export const Banner = ({ title, catagory, subcatagory }: any) => {
  return (
    <div
      style={{ backgroundImage: `url("/assets/images/banner.png")` }}
      className="bg-cover bg-center md:h-[300px] min-h-[140px] sm:min-h-[180px] flex flex-col gap-2 md:py-20 py-8 sm:py-10 items-center justify-center px-4 sm:px-6"
    >
      <h2 className="lg:text-4xl md:text-2xl text-lg sm:text-xl text-white font-bold mb-0 md:mb-4 text-center text-balance max-w-3xl">
        {title}
      </h2>
      {catagory ? (
        <h3 className="lg:text-2xl md:text-xl text-base font-medium text-white">
          <span className="text-reefGold">{catagory}</span> {subcatagory ? `/ ${subcatagory}` : ""}
        </h3>
      ) : null}
    </div>
  );
};
