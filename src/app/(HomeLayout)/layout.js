import { montserrat } from '@/lib/fonts'
import './../globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import Footer from '@/components/Layout/Footer'
import ServerComponent from '@/components/home/ServerComponent'
import ClientHeader from './ClientHeader'
import Loadingbar from '@/components/Loadingbar/Loadingbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserProvider } from '../../context/UserContext'
import { PublicTokenProvider } from '../../utils/PublicTokenProvider.'

// ✅ CRITICAL: Add these to prevent prerendering of ALL pages in this layout
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export const metadata = {
  title: 'Funds Verifier',
  description: 'Unlocking Secure Asset Transactions with Funds Verifier',
  icons: {
    icon: '/favicon.svg',
  },
}

// ✅ Remove 'async' - not needed and causes issues
export default function RootLayout({ children }) {
  return (
    <html lang='en' className={montserrat.className}>
      <body>
        <div className='w-full'>
          <Loadingbar />
          <UserProvider>
            <PublicTokenProvider>
              <ClientHeader />
              <ToastContainer />
              <ServerComponent>
                <>{children}</>
              </ServerComponent>
              <Footer />
            </PublicTokenProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  )
}
