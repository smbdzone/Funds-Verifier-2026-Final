import { montserrat } from "@/lib/fonts";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "../../globals.css";


export default function RootLayout({ children }) {

  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <ToastContainer />
        <div className="fixed z-50">
        {children}
        </div>
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" />
      </body>
    </html>
  );
}
