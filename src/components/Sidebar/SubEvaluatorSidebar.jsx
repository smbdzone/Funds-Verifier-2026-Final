"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PrimaryProfile,
  PrimaryAssetDocument,
  PrimaryLogout,
  DropIcon,
} from "@/components/Icons";
import { FaStreetView } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { useProfile } from "../../context/UserContext";

export default function SuEvaluatorSidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(Array(8).fill(false));
  const path = usePathname();
  const { user, fetchProfile, logout } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDropdownToggle = (index) => {
    setIsDropdownOpen((prevState) =>
      prevState.map((isOpen, idx) => (idx === index ? !isOpen : false))
    );
  };

  const handleDropdownTabClick = () => {
    setIsDropdownOpen(Array(8).fill(false));
  };

  const tabs = [
    {
      icon: <PrimaryProfile />,
      name: "Sub Evaluator Profile",
      link: "/sub-evaluator-profile/edit-profile",
    },
    {
      icon: <PrimaryAssetDocument />,
      name: "Assigned Tasks",
      dropdown: [
        {
          name: "Property Evaluation",
          link: "/sub-evaluator-profile/property-evaluation",
        },
        {
          name: "Cars Evaluation",
          link: "/sub-evaluator-profile/car-evaluation",
        },
        {
          name: "Boat Evaluation",
          link: "/sub-evaluator-profile/boat-evaluation",
        },
        {
          name: "Jewellery Evaluation",
          link: "/sub-evaluator-profile/jewelry-evaluation",
        },
      ],
    },
  ];

  return (
    <div className="mt-5 xl:mt-0 !py-8 flex flex-col md:flex-row gap-7">
      <div className="flex flex-col gap-7">
        <div className="px-4 xl:px-0">
          <div className="custom-shadow flex justify-center items-center flex-col py-6 lg:rounded">
            <h1 className="text-prussianBlue capitalize font-semibold md:text-xl text-lg lg:text-3xl">
              {user?.displayName || user?.name || "Loading..."}
            </h1>
            <h2 className="lg:text-2xl md:text-lg text-base text-prussianBlue mb-3">
              {user && (user.role === "SubEvaluator" || (user.role === "Evaluator" && (user.parentEvaluator || user.parentID))) ? "Sub Evaluator" : user?.role}
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
                      className={`${tab.link === path
                          ? "bg-whiteSmoke font-medium focus:outline-none"
                          : "border-transparent"
                        } whitespace-nowrap flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-base text-sm lg:text-xl`}
                      onClick={() => handleDropdownToggle(i - 1)}
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
                          <Link key={idx} href={`${item.link}`}>
                            <div
                              className="block py-2 px-14 text-black cursor-pointer"
                              onClick={handleDropdownTabClick}
                            >
                              {item.name}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={tab.name} href={`${tab.link}`}>
                    <button
                      type="button"
                      className={`${tab.link === path
                          ? "bg-whiteSmoke text-prussianBlue w-full font-medium focus:outline-none"
                          : "border-transparent"
                        } whitespace-nowrap w-full flex gap-3 hover:bg-whiteSmoke hover:text-prussianBlue items-center py-2 px-8 cursor-pointer sm:text-xl`}
                    >
                      {tab.icon}
                      {tab.name}
                    </button>
                  </Link>
                )
              )}
              <div className="whitespace-nowrap flex gap-3 items-center py-2 px-10 cursor-pointer sm:text-base text-sm lg:text-xl">
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-2"
                >
                  <span><PrimaryLogout /></span>
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
