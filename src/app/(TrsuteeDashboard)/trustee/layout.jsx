/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState } from "react";
import TrusteeHeader from "../../../components/Layout/TrusteeHeader";
import TrusteeSidebar from "../../../components/Sidebar/TrusteeSidebar";
import { UserProvider } from "../../../context/UserContext";

const layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div>
      <UserProvider>
        {/* <TrusteeHeader />
        <TrusteeSidebar>{children}</TrusteeSidebar>; */}
        <div className="">
          {/* Header */}
          <TrusteeHeader toggleSidebar={toggleSidebar} />

          {/* Sidebar */}
          <div className="flex w-full theme-container">
            <div className={`xl:block hidden`}>
              <TrusteeSidebar />
            </div>

            {/* Main Content */}
            <main className='min-h-[calc(100vh-4.5rem)] w-full flex-1 bg-slate-50/90 p-4 sm:p-6 lg:p-8'>
              {children}
            </main>
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
    </div>
  );
};

export default layout;
