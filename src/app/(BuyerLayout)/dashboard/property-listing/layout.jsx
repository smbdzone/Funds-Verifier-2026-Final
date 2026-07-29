'use client'

import RequireAuth from '@/components/auth/RequireAuth'

/** Property listing: Asset Holder & Deal Hunter only (after login). */
export default function PropertyListingLayout({ children }) {
  return (
    <RequireAuth roles={['AssetHolder', 'DealHunter']} loginPath='/login'>
      {children}
    </RequireAuth>
  )
}
