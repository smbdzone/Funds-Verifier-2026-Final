'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProfile } from '@/context/UserContext'
import {
  LayoutDashboardIcon,
  PlusCircleIcon,
  ListChecksIcon,
  ChartPieIcon,
  UserIcon,
  LogOutIcon,
  ArrowLeftIcon,
} from 'lucide-react'

const navItems = [
  {
    label: 'Overview',
    href: '/advertiser-dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Create Advertisement',
    href: '/advertiser-dashboard/create',
    icon: PlusCircleIcon,
  },
  {
    label: 'My Advertisements',
    href: '/advertiser-dashboard/my-ads',
    icon: ListChecksIcon,
  },
  {
    label: 'Analytics',
    href: '/advertiser-dashboard/analytics',
    icon: ChartPieIcon,
  },
  {
    label: 'My Account',
    href: '/advertiser-dashboard/account',
    icon: UserIcon,
  },
]

const AdvertiserSidebar = () => {
  const pathname = usePathname()
  const { logout } = useProfile()

  const isActive = (href) =>
    href === '/advertiser-dashboard'
      ? pathname === href
      : pathname?.startsWith(href)

  return (
    <aside className='w-full md:w-[260px] md:h-screen shrink-0 bg-[#002D4F] text-white flex md:flex-col justify-between overflow-hidden'>
      <div className='w-full min-w-0'>
        <div className='px-6 py-6 border-b border-white/10 hidden md:block'>
          <div className='flex items-center gap-2'>
            <img src='/icons/Logo2.png' alt='Funds Verifier' className='h-8' />
            <span className='font-semibold text-lg'>Ad Manager</span>
          </div>
        </div>

        <nav className='flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-visible'>
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-[#A2913E] text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Icon className='size-5 shrink-0' />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className='p-3 md:border-t border-white/10 flex md:flex-col gap-1'>
        <Link
          href='/'
          className='flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors'
        >
          <ArrowLeftIcon className='size-5 shrink-0' />
          <span>Back to site</span>
        </Link>
        <button
          onClick={() => logout?.()}
          className='flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors'
        >
          <LogOutIcon className='size-5 shrink-0' />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdvertiserSidebar
