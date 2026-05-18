import Footer from "@/components/Layout/Footer";
import { montserrat } from "@/lib/fonts";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "./../globals.css";
import ListingsProvider from "@/components/ListingContext/ListingsProvider";
import { Suspense } from "react";
import Loadingbar from "@/components/Loadingbar/Loadingbar";
import { UserProvider } from "../../context/UserContext";
import ProfileHeader2 from "../../components/Layout/ProfileHeader2";


export const metadata = {
  title: "Funds Verifier",
  description: "Powered by SMB Digital Zone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <Loadingbar />
        <Suspense fallback={<div>Loading...</div>}>
          <UserProvider>
            <ListingsProvider>
              <ToastContainer />
              <ProfileHeader2 />
              {children}
              <Footer />
            </ListingsProvider>
          </UserProvider>
        </Suspense>
      </body>
      <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" />
    </html>
  );
}
