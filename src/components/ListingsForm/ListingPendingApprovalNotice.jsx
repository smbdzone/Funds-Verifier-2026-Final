'use client'

import React, { useEffect, useState } from 'react'
import ListingPendingApprovalModal from '@/components/ListingsForm/ListingPendingApprovalModal'
import { consumeListingPendingApprovalNotice } from '@/libs/listingPendingApprovalNotice'

/**
 * Reads the post-submit session flag and shows the golden approval notice once.
 */
const ListingPendingApprovalNotice = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const notice = consumeListingPendingApprovalNotice()
    if (notice) setOpen(true)
  }, [])

  return (
    <ListingPendingApprovalModal show={open} onClose={() => setOpen(false)} />
  )
}

export default ListingPendingApprovalNotice
