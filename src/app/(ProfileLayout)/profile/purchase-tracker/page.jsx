'use client'

import { PurchaseTab } from '../../../../components/modules/Profile/PurchaseTab'
import { useProfile } from '@/context/UserContext'

export default function ConfidentialityPurchaseWrapper() {
  const { user, loading } = useProfile()

  if (loading) return <p>Loading tracker...</p>
  if (!user) return <p>No purchase data found.</p>

  return <PurchaseTab userUUID={user.uuid} />
}
