"use client";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import { Transition, Menu } from "@headlessui/react";
import { NotificationIcon, ProfileDropDownIcon } from "../Icons";
import Link from "next/link";
import { useProfile } from "../../context/UserContext"; 
import SubEvaluatorSidebar from "../Sidebar/SubEvaluatorSidebar";
import NotificationDropdown from "../Buttons/Notifications";

const SubEvaluatorHeader = () => {
  const { user } = useProfile(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSubEvaluator = !!user?.parentID;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="border-b bg-white border-gray-600">
      <header className="!p-2 sm:!p-3 theme-container flex justify-between items-center sm:gap-4">
        <Link href="/">
          <figure className="cursor-pointer h-[50px] w-[50px] sm:h-[60px] sm:w-[65px] md:h-[75px] md:w-[78px]">
            <Image
              src="/assets/images/logo.svg"
              height={30}
              width={30}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </figure>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">       
                <NotificationDropdown />
          <Menu as="div" className="relative text-left z-100">
            <Menu.Button className="btn !min-w-max flex items-center gap-2">
              <div className="xl:block hidden">
                <h2 className="text-prussianBlue capitalize text-xs font-semibold">
                  {user?.name || "Loading..."}
                </h2>
                <span className="text-prussianBlue text-[10px] block text-start">
                  {user && (user.role === "SubEvaluator" || (user.role === "Evaluator" && (user.parentEvaluator || user.parentID))) ? "Sub Evaluator" : user?.role}
                </span>
              </div>
              <div className="xl:block hidden">
                <ProfileDropDownIcon />
              </div>
            </Menu.Button>
            {/* No logout dropdown for now */}
          </Menu>

          <button
            onClick={toggleSidebar}
            className="btn xl:hidden !min-w-max flex items-center gap-2"
          >
            <ProfileDropDownIcon />
          </button>

          {isSidebarOpen && (
            <div className="fixed inset-0 bg-opacity-50 z-50">
              <div className="fixed inset-y-0 left-0 overflow-y-auto bg-white custom-shadow z-60 transform transition-transform">
                <SubEvaluatorSidebar />
                <button
                  onClick={toggleSidebar}
                  className="absolute text-prussianBlue top-4 right-4 text-gray-500"
                >
                  x
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default SubEvaluatorHeader;
