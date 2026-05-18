import { montserrat } from '@/lib/fonts'
import './../globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import Script from 'next/script'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loadingbar from '@/components/Loadingbar/Loadingbar'
import { Suspense } from 'react'

export const metadata = {
  title: 'Funds Verifier',
  description: 'Powered by SMB Digital Zone',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={montserrat.className}>
      <body>
        <Loadingbar />
        <ToastContainer />
        {children}
      </body>
      <Script src='https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js' />
    </html>
  )
}
