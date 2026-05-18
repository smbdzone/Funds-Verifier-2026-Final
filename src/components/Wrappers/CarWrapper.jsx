"use client"; // Ensures this component runs on the client side
import React, { useState, Suspense } from "react";
import { ListingSidebar } from "@/components/modules/ListingSidebar";
import { AuctionData } from "@/components/modules/AuctionData";
import { Children } from "react";

export default function CarWrapper({ initialData, params, children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between xl:px-20 relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden bg-blue-500 text-black px-4 py-4 shadow-md rounded-tr-full rounded-br-full fixed top-30 left-0 z-50 ${
          isSidebarVisible ? "hidden" : "bg-white"
        }`}
      >
        {isSidebarVisible ? (
          "Close Sidebar"
        ) : (
          <img
            src="/icons/golden-arrow-previous.png"
            className="transform rotate-180"
            alt="next"
          />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 w-auto shadow-xl rounded-lg bg-white h-full z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto lg:static lg:transform-none ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ListingSidebar
          initialData={initialData} 
          params={params}
          isSidebarVisible={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className={`py-6 px-4 w-full flex-1 ${isSidebarVisible ? "" : ""}`}>
        <Suspense fallback={<p className="text-center">Loading...</p>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
