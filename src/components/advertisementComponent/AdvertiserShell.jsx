'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useProfile } from '@/context/UserContext'
import AdvertiserSidebar from './AdvertiserSidebar'
import AdProfileOnboarding from './AdProfileOnboarding'

/**
 * Client shell for the Advertiser Dashboard. Guards the route (any authenticated
 * user may pass) and renders the scoped sidebar + content. Unauthenticated users
 * are sent to /login with a postLoginRedirect so they return here after signing in.
 */
const AdvertiserShell = ({ children }) => {
  const { user, loading, fetchProfile } = useProfile()
  const router = useRouter()
  const pathname = usePathname()

  // Targeting attributes needed for relevant ad serving; collected once if missing.
  const needsProfile =
    !!user && (!user.city || !user.dateOfBirth || !user.gender)

  useEffect(() => {
    if (loading) return // wait for /me to resolve
    if (!user) {
      try {
        localStorage.setItem('postLoginRedirect', pathname || '/advertiser-dashboard')
      } catch {}
      // Advertiser flow uses its own sign-in (distinct advertiser account),
      // not the normal /login used by regular users.
      router.replace('/advertiser-login')
    }
  }, [loading, user, pathname, router])

  if (loading || !user) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center'>
        <div className='h-10 w-10 border-4 border-[#002D4F] border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  return (
    // Full viewport height, no page-level scroll: the sidebar stays fixed and
    // only the content area scrolls when it overflows.
    <div className='h-screen w-full flex flex-col md:flex-row bg-[#F5F7FB] overflow-hidden'>
      <AdvertiserSidebar />
      <main className='flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8'>
        {children}
      </main>
      {needsProfile && <AdProfileOnboarding onSaved={fetchProfile} />}
    </div>
  )
}

export default AdvertiserShell
