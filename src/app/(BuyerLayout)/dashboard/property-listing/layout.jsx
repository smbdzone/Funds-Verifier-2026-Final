'use client'

import RequireAuth from '@/components/auth/RequireAuth'

/** Listing forms: Asset Holder & Deal Hunter only. */
export default function PropertyListingLayout({ children }) {
  return (
    <RequireAuth roles={['AssetHolder', 'DealHunter']} loginPath='/login'>
      {children}
    </RequireAuth>
  )
}
