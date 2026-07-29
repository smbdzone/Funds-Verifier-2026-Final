const STORAGE_KEY = 'fv_listing_pending_approval_notice'

/**
 * Mark that a new listing was just submitted so my-listing can show the notice popup.
 * @param {{ assetKind?: string }} [meta]
 */
export function flagListingPendingApprovalNotice(meta = {}) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        at: Date.now(),
        assetKind: meta.assetKind || 'listing',
      }),
    )
  } catch {
    // ignore storage errors
  }
}

/** @returns {{ at: number, assetKind: string } | null} */
export function consumeListingPendingApprovalNotice() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(STORAGE_KEY)
    return JSON.parse(raw)
  } catch {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    return null
  }
}
