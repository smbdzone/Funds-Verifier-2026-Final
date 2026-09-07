'use client'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Layout/Footer'
import { isChromelessAuthRoute } from '@/libs/chromelessAuthRoutes'

export default function ClientFooter() {
  const pathname = usePathname()

  if (isChromelessAuthRoute(pathname)) return null

  return <Footer />
}
