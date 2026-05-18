import { montserrat } from "@/lib/fonts";
import Image from "next/image";
import Script from "next/script";
import "./../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Funds Verifier",
  description: "Powered by SMB Digital Zone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <ToastContainer />
        <div className="border-b border-light-grey">
          <header className="!p-2 sm:!p-3 theme-container">
            <figure className=" cursor-pointer flex items-center gap-3">
              <Image
                src="/assets/images/logo.svg"
                height={75}
                width={78}
                alt="Logo"
              />
              <h1 className="font-medium text-prussianBlue text-2xl">
                Funds Verifier
              </h1>
            </figure>
          </header>
        </div>
        {children}
      </body>
      <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" />
    </html>
  );
}
