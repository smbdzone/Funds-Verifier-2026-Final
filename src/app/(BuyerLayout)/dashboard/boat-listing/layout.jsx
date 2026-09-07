'use client'

import RequireAuth from '@/components/auth/RequireAuth'

/** Listing forms (incl. Technical Report / 3D Walkthrough): Asset Holder & Deal Hunter only. */
export default function BoatListingLayout({ children }) {
  return (
    <RequireAuth roles={['AssetHolder', 'DealHunter']} loginPath='/login'>
      {children}
    </RequireAuth>
  )
}
