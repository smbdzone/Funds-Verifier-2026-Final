"use client";
import SurveyorHeader from "./SurveyorHeader";
import SurveyorSidebar from "./SurveyorSidebar";
import { montserrat } from "@/lib/fonts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "./../globals.css";
import { Suspense, useState } from "react";
import Loadingbar from "@/components/Loadingbar/Loadingbar";
import { UserProvider } from "../../context/UserContext";


export default function RootLayout({ children }) {
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en" className={montserrat.className}>
      <body className="flex flex-col lg:flex-row min-h-screen">
        <Loadingbar />
        <UserProvider>
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            style={{ zIndex: 99999 }}
          />
          <div className="flex flex-col lg:flex-row w-full h-full">
            {/* Sidebar */}
            <div
              className={`fixed inset-0 z-30 bg-transparent transform lg:transform-none lg:static lg:z-auto w-[300px] h-full transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <SurveyorSidebar
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>

            {/* Overlay for Sidebar */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="sticky top-0 z-20 bg-transparent shadow flex items-center justify-between">
                <SurveyorHeader
                  title={selectedTab}
                  setSelectedTab={setSelectedTab}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </div>

              {/* Main Area */}
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    Loading...
                  </div>
                }
              >
                <main className="p-5 overflow-y-auto">{children}</main>
              </Suspense>
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
