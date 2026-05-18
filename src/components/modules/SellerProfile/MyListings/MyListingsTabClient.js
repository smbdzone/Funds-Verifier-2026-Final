"use client";
import { useState } from "react";
import { SearchIcon } from "@/components/Icons";
import AllListings from "@/components/modules/SellerProfile/MyListings/AllListings";
import PropertyListing from "@/components/modules/SellerProfile/MyListings/PropertyListing";
import CarListing from "@/components/modules/SellerProfile/MyListings/CarListing";
import BoatListing from "@/components/modules/SellerProfile/MyListings/BoatListing";
import JewellaryListing from "@/components/modules/SellerProfile/MyListings/JewellaryListing";
import Link from "next/link";

const MyListingTabClient = ({ listings, listingsLoading }) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { name: "All Listing", current: true },
    { name: "Properties For Sale", current: false },
    { name: "Cars For Sale", current: false },
    { name: "Jewelleries For Sale", current: false },
    { name: "Boats For Sale", current: false },
  ];

  const handleTabClick = (idx) => {
    setSelectedTabIdx(idx);
    setSearchTerm(""); // Reset search term when switching tabs
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-full items-center justify-between mb-4 gap-4 md:gap-0">
        {/* Header */}
        <span className="lg:text-lg sm:text-base text-sm text-prussianBlue/40">
          My Listing
        </span>

        {/* Search and Add Listing */}
        <div className="flex flex-col md:flex-row items-center md:items-center md:ml-auto gap-4">
          <div className="flex items-center border border-[#D9D9D9] rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 py-2 w-full text-gray-700 focus:outline-none"
            />
            <button className="bg-gray mx-1 my-1 px-3 py-2 rounded">
              <SearchIcon />
            </button>
          </div>
          <Link href="/dashboard/property-listing">
            <button className="px-6 py-3 rounded text-sm sm:text-base primary-gradient text-white">
              Add Listing
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="custom-shadow w-full rounded">
        <div className="primary-gradient w-full rounded px-4 md:px-12 overflow-x-auto">
          <nav
            className="flex flex-col md:flex-row justify-between items-center gap-4 md:w-[500px] xl:w-full"
            aria-label="Tabs"
          >
            {tabs.map((tab, i) => (
              <a
                key={tab.name}
                className={`${i === selectedTabIdx
                    ? "text-white border-b-4 border-white focus:outline-none"
                    : ""
                  } whitespace-nowrap py-4 cursor-pointer text-sm sm:text-lg xl:text-xl`}
                onClick={() => handleTabClick(i)}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 lg:p-10 w-full flex flex-col gap-6">
          {selectedTabIdx === 0 && (
            <AllListings
              listings={listings}
              query={searchTerm}
              isFetchingAll={listingsLoading}
            />
          )}
          {selectedTabIdx === 1 && <PropertyListing query={searchTerm} />}
          {selectedTabIdx === 2 && <CarListing query={searchTerm} />}
          {selectedTabIdx === 3 && <JewellaryListing query={searchTerm} />}
          {selectedTabIdx === 4 && <BoatListing query={searchTerm} />}
        </div>
      </div>
    </>
  );
};

export default MyListingTabClient;
