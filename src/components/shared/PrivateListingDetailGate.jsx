'use client'

import PrivateListingLockedView from '@/components/shared/PrivateListingLockedView'
import { shouldLockPrivateListing } from '@/libs/privateListing'
import { useProfile } from '@/context/UserContext'

export default function PrivateListingDetailGate({ listing, children }) {
  const { user } = useProfile()
  if (shouldLockPrivateListing(listing, user)) {
    return <PrivateListingLockedView listing={listing} />
  }
  return children
}
