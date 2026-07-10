import { montserrat } from '@/lib/fonts'
import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './../globals.css'
import Loadingbar from '@/components/Loadingbar/Loadingbar'
import { UserProvider } from '../../context/UserContext'
import AdvertiserShell from '@/components/advertisementComponent/AdvertiserShell'

export const metadata = {
  title: 'Ad Manager | Funds Verifier',
  description: 'Powered by SMB Digital Zone',
}

export default function AdvertiserLayout({ children }) {
  return (
    <html lang='en' className={montserrat.className}>
      <body>
        <Loadingbar />
        <Suspense fallback={<div>Loading...</div>}>
          <UserProvider>
            <ToastContainer />
            <AdvertiserShell>{children}</AdvertiserShell>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  )
}
