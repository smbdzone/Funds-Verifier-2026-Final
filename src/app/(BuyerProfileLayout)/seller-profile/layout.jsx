"use client";
import { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import ProfileHeader2 from "../../../components/Layout/ProfileHeader2";
import SellerProfileSidebar from "../../../components/Sidebar/SellerProfileSidebar";
import { UserProvider } from "../../../context/UserContext";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <UserProvider>
      <RequireAuth>
        <div className="">
          {/* Header */}
          <ProfileHeader2 toggleSidebar={toggleSidebar} />

          {/* Sidebar */}
          <div className="flex w-full theme-container">
            <div className={`xl:block hidden`}>
              <SellerProfileSidebar />
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
      </RequireAuth>
    </UserProvider>
  );
};

export default Layout;
