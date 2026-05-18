'use client'
import { SaleTab } from '@/components/modules/SellerProfile/SaleTab'
import { useProfile } from '@/context/UserContext'

import { getTokenFromCookie } from '../../../../utils/helper'

export default function ConfidentialityProtocol() {
  const { user } = useProfile()

  const token =
    typeof window !== 'undefined'
      ? getTokenFromCookie('accessToken')
      : null

  if (!user ) return <p>Loading tracker...</p>

  return <SaleTab userUUID={user.uuid} authToken={token} />
}
