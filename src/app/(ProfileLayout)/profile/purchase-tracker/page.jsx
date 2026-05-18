'use client'

import { PurchaseTab } from '../../../../components/modules/Profile/PurchaseTab'
import { useProfile } from '@/context/UserContext'
import { getTokenFromCookie } from '../../../../utils/helper'

export default function ConfidentialityPurchaseWrapper() {
  const { user } = useProfile()
  const token =
    typeof window !== 'undefined' ? getTokenFromCookie() : null

  if (!user || !token) return <p>Loading tracker...</p>

  return <PurchaseTab userUUID={user.uuid} authToken={token} />
}
