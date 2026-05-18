"use client";
import React from "react";

export const Banner = ({ title, catagory, subcatagory }: any) => {
  return (
    <div
      style={{ backgroundImage: `url("/assets/images/banner.png")` }}
      className="bg-cover md:h-[300px] flex flex-col gap-2 md:py-20 py-10 items-center justify-center"
    >
      <h2 className="lg:text-4xl md:text-2xl text-xl  text-white font-bold mb-2 md:mb-4">
        {title}
      </h2>
      <h3 className="lg:text-2xl md:text-xl text-base font-medium text-white">
        <span className="text-reefGold">{catagory}</span> {subcatagory ? `/ ${subcatagory}` : ""}
      </h3>
    </div>
  );
};
