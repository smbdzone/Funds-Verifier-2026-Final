/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState } from "react";
import ProfileHeader from "../../../components/Layout/ProfileHeader";
import ProfileSidebar from "../../../components/Sidebar/ProfileSidebar";
import { UserProvider } from "../../../context/UserContext";

const layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <UserProvider>
     
      <div className="">
        {/* Header */}
        <ProfileHeader toggleSidebar={toggleSidebar} />

        {/* Sidebar */}
        <div className="flex w-full theme-container">
          <div className={`xl:block hidden`}>
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 w-full p-3 sm:p-5">{children}</main>
        </div>

        {/* Overlay for small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </UserProvider>
  );
};

export default layout;
