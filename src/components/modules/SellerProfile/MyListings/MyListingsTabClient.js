"use client";
import { useState } from "react";
import { SearchIcon } from "@/components/Icons";
import AllListings from "@/components/modules/SellerProfile/MyListings/AllListings";
import Link from "next/link";

const MyListingTabClient = ({
  listings,
  listingsLoading,
  isLoadingMore = false,
  onListingDeleted,
}) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { name: "All Listing" },
    { name: "Properties For Sale" },
    { name: "Off Plan Properties" },
    { name: "Cars For Sale" },
    { name: "Jewelleries For Sale" },
    { name: "Boats For Sale" },
  ];

  const handleTabClick = (idx) => {
    setSelectedTabIdx(idx);
    setSearchTerm("");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-full items-center justify-between mb-4 gap-4 md:gap-0">
        <span className="lg:text-lg sm:text-base text-sm text-prussianBlue/40">
          My Listing
        </span>

        <div className="flex flex-col md:flex-row items-center md:items-center md:ml-auto gap-4">
          <div className="flex items-center border border-[#D9D9D9] rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 py-2 w-full text-gray-700 focus:outline-none"
            />
            <button type="button" className="bg-gray mx-1 my-1 px-3 py-2 rounded">
              <SearchIcon />
            </button>
          </div>
          <Link href="/dashboard/property-listing">
            <button
              type="button"
              className="px-6 py-3 rounded text-sm sm:text-base primary-gradient text-white"
            >
              Add Listing
            </button>
          </Link>
        </div>
      </div>

      <div className="custom-shadow w-full rounded">
        <div className="primary-gradient w-full rounded px-4 md:px-12 overflow-x-auto">
          <nav
            className="flex flex-col md:flex-row justify-between items-center gap-4 md:w-[700px] xl:w-full"
            aria-label="Tabs"
          >
            {tabs.map((tab, i) => (
              <button
                key={tab.name}
                type="button"
                className={`${i === selectedTabIdx
                  ? "text-white border-b-4 border-white focus:outline-none"
                  : "text-white/80"
                  } whitespace-nowrap py-4 cursor-pointer text-sm sm:text-lg xl:text-xl bg-transparent border-0`}
                onClick={() => handleTabClick(i)}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 lg:p-10 w-full flex flex-col gap-6">
          <AllListings
            listings={listings}
            query={searchTerm}
            isFetchingAll={listingsLoading}
            isLoadingMore={isLoadingMore}
            selectedTabIdx={selectedTabIdx}
            onListingDeleted={onListingDeleted}
          />
        </div>
      </div>
    </>
  );
};

export default MyListingTabClient;