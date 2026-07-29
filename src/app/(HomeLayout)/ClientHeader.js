'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Layout/Header'
import { isChromelessAuthRoute } from '@/libs/chromelessAuthRoutes'

export default function ClientHeader() {
  const pathname = usePathname()
  const hideHeader = isChromelessAuthRoute(pathname)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (hideHeader) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hideHeader])

  if (hideHeader) return null

  return (
    <div
      className={`w-full bg-white ${
        isScrolled ? 'fixed top-0 z-50' : 'sticky top-0 z-50'
      }`}
    >
      <Header />
    </div>
  )
}
