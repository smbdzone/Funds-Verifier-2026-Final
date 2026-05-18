"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PrimaryProfile,
  PrimaryDocument,
  PrimaryAssetDocument,
  PrimaryLogout,
  DropIcon,
} from "@/components/Icons";
import { FaStreetView } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useProfile } from "../../context/UserContext";

export default function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(8).fill(false)); // Initialize for all tabs
  const path = usePathname();
  const { user, fetchProfile, logout } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  // Toggle dropdown on parent tab click
  const handleDropdownToggle = (index) => {
    setIsDropdownOpen((prevState) =>
      prevState.map((isOpen, idx) => (idx === index ? !isOpen : false))
    );
  };

  const handleDropdownTabClick = () => {
    setIsDropdownOpen(Array(8).fill(false)); // Close all dropdowns on tab click
  };

  const tabs = [
    {
      icon: <PrimaryProfile />,
      name: "Evaluator Profile",
      link: "/evaluator-profile/edit-profile",
    },
    {
      icon: <PrimaryProfile />,
      name: "Sub-Evaluator",
      link: "/evaluator-profile/manage-evaluators",
       dropdown: [
        {
          name: "Manage Sub-Evaluators",
          link: "/evaluator-profile/manage-evaluators",
        },
        {
          name: "Track Progress",
          link: "/evaluator-profile/track-progress",
        },
       ] 
    },
    {
      icon: <PrimaryDocument />,
      name: "All Invoice",
      link: "/evaluator-profile/all-invoices",
    },
    {
      icon: <PrimaryDocument />,
      name: "Transaction Tracker",
      link: "/evaluator-profile/transaction-tracker",
    },
    {
      icon: <PrimaryAssetDocument />,
      name: "Asset Evaluation",
      dropdown: [
        {
          name: "Property Evaluation",
          link: "/evaluator-profile/property-evaluation",
        },
        {
          name: "Cars Evaluation",
          link: "/evaluator-profile/cars-evaluation",
        },
        {
          name: "Boat Evaluation",
          link: "/evaluator-profile/boat-evaluation",
        },
        {
          name: "Jewellery Evaluation",
          link: "/evaluator-profile/jewellery-evaluation",
        },
      ],
    },
    {
      icon: <FaStreetView />,
      name: "Create Evaluation Slots",
      link: "/evaluator-profile/create-slot",
    },
    {
      icon: <PrimaryDocument />,
      name: "Electronic Consent",
      link: "/evaluator-profile/electronic-consent",
    },
    {
      icon: <PrimaryDocument />,
      name: "Documents Storage",
      link: "/evaluator-profile/document-storage",
    },
    {
      icon: <PrimaryDocument />,
      name: "Price List",
      link: "/evaluator-profile/price-list",
    },
   
  ];

  return (
    <div className="mt-5 xl:mt-0 !py-8 flex flex-col md:flex-row gap-7">
      <div className="flex flex-col gap-7">
        <div className="px-4 xl:px-0">
          <div className="custom-shadow flex justify-center items-center flex-col py-6 lg:rounded">
            <h1 className="text-prussianBlue capitalize font-semibold md:text-xl text-lg lg:text-3xl">
              {user?.name || "Loading..."}
            </h1>
            <h2 className="lg:text-2xl md:text-lg text-base text-prussianBlue mb-3">
              {user?.role}
            </h2>
          </div>
        </div>
        <div className="flex flex-col xl:shadow rounded py-5">
          <div>
            <nav className="flex flex-col" aria-label="Tabs">
              {tabs.map((tab, i) =>
                tab.dropdown ? (
                  <div key={tab.name} className="relative">
                    <div
                      className={`${
                        tab.link === path
                          ? "bg-whiteSmoke font-medium focus:outline-none"
                          : "border-transparent"
                      } whitespace-nowrap flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-base text-sm lg:text-xl`}
                      onClick={() => handleDropdownToggle(i - 1)} // Adjust index for dropdown tracking
                    >
                      {tab.icon}
                      {tab.name}
                      <span className="ml-auto">
                        <DropIcon />
                      </span>
                    </div>

                    {isDropdownOpen[i - 1] && (
                      <div className="bg-whiteSmoke w-full rounded-md">
                        {tab.dropdown.map((item, idx) => (
                          <>
                            <Link href={`${item.link}`}>
                              <div
                                key={idx}
                                className="block py-2 px-14 text-black cursor-pointer"
                                onClick={() =>
                                  handleDropdownTabClick(
                                    i - 1,
                                    item.link === path
                                  )
                                }
                              >
                                {item.name}
                              </div>
                            </Link>
                          </>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={tab.name}>
                    <Link href={`${tab.link}`}>
                      <button
                        type="button"
                        key={tab.name}
                        className={`${
                          tab.link === path
                            ? "bg-whiteSmoke text-prussianBlue w-full font-medium focus:outline-none"
                            : "border-transparent"
                        } whitespace-nowrap w-full flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-xl`}
                      >
                        {tab.icon}
                        {tab.name}
                      </button>
                    </Link>
                  </div>
                )
              )}
              <div className="whitespace-nowrap flex gap-3 items-center py-2 px-10 cursor-pointer sm:text-base text-sm lg:text-xl">
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-2"
                >
                  <span>
                    <PrimaryLogout />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    
    </div>
  );
}
