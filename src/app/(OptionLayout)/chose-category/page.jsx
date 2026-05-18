"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Country, State, City } from "country-state-city";

export default function Home() {
  const data = [
    { text: "Property for Sale", img: "/assets/images/property.jpg" },
    { text: "Property For Lease", img: "/assets/images/property.jpg" },
    { text: "Car for Sale", img: "/assets/images/car.jpg" },
    { text: "Jewellery for Sale", img: "/assets/images/neckless-1.jpg" },
    { text: "Boats for Sale", img: "/assets/images/boat.jpg" },
    { text: "Aircraft for Sale", img: "/assets/images/air-craft.jpg" },
  ];
  
  return (
    <div className="theme-container !py-16">
      <h2 className="text-reefGold fs-40 font-semibold text-center mb-10">
        Choose the Ideal Category for Your Listing
      </h2>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {data.map((ele, i) => (
          <div
            key={i}
            className="rounded custom-shadow border-gray border-2 hover:border-reefGold flex flex-col justify-center items-center p-10"
          >
            <figure className="mb-5">
              <Image
                src={ele.img}
                alt={ele.img}
                height={172}
                width={172}
                className="rounded-full h-[172px] w-[172px] object-cover"
              />
            </figure>
            <h3 className="font-semibold text-2xl text-center">{ele.text}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
