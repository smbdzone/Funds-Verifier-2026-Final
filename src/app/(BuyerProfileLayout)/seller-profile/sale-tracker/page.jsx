'use client'
import { SaleTab } from '@/components/modules/SellerProfile/SaleTab'
import { useProfile } from '@/context/UserContext'

export default function ConfidentialityProtocol() {
  const { user, loading } = useProfile()

  if (loading) return <p>Loading tracker...</p>
  if (!user) return <p>No sales data found.</p>

  return <SaleTab userUUID={user.uuid} />
}
