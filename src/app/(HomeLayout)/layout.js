import { montserrat } from '@/lib/fonts'
import './../globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import ServerComponent from '@/components/home/ServerComponent'
import ClientHeader from './ClientHeader'
import ClientFooter from './ClientFooter'
import Loadingbar from '@/components/Loadingbar/Loadingbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserProvider } from '../../context/UserContext'
import { PublicTokenProvider } from '../../utils/PublicTokenProvider.'
import { resolveSiteOrigin } from '@/libs/listingSocialShare'

// Cache public pages (ISR). Listing/home data refreshes every 60s.
export const revalidate = 60
export const dynamicParams = true

const siteOrigin = resolveSiteOrigin()

export const metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title: 'Funds Verifier',
  description: 'Unlocking Secure Asset Transactions with Funds Verifier',
  icons: {
    icon: '/favicon.svg',
  },
}

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
              <ClientFooter />
            </PublicTokenProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  )
}
