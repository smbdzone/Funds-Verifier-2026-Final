'use client'

import RequireAuth from '@/components/auth/RequireAuth'

/** Listing forms: Asset Holder only. */
export default function PropertyListingLayout({ children }) {
  return (
    <RequireAuth roles={['AssetHolder']} loginPath='/login'>
      {children}
    </RequireAuth>
  )
}
