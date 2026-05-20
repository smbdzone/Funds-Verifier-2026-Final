import { montserrat } from "@/lib/fonts";
import React, { ReactNode } from "react";
import "./../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminHeader from "@/components/Layout/AdminHeader";


export const metadata = {
  title: "Funds Verifier",
  description: "Powered by SMB Digital Zone",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <ToastContainer />
        <AdminHeader />
        {children}
      </body>
    </html>
  );
}
