'use client'

import RequireAuth from '@/components/auth/RequireAuth'

/** Add-asset / listing forms: Asset Holder & Deal Hunter only. */
export default function AddAssetLayout({ children }) {
  return (
    <RequireAuth roles={['AssetHolder', 'DealHunter']} loginPath='/login'>
      {children}
    </RequireAuth>
  )
}
