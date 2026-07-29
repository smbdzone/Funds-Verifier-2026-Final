'use client'

import RequireAuth from '@/components/auth/RequireAuth'

/** Legacy property for sale form: Asset Holder & Deal Hunter only. */
export default function PropertyForSaleLayout({ children }) {
  return (
    <RequireAuth roles={['AssetHolder', 'DealHunter']} loginPath='/login'>
      {children}
    </RequireAuth>
  )
}
