'use client'

import { formatSessionIdleTime, useSessionIdle } from '@/context/SessionIdleContext'

/**
 * Session countdown — fixed at the top-right corner of the viewport.
 */
export default function SessionIdleTimer({ className = '' }) {
  const { remainingMs, isReturning, isActive, idleTimeoutMs } = useSessionIdle()

  if (!isActive) return null

  const ratio = remainingMs / idleTimeoutMs
  const isUrgent = ratio <= 0.2
  const isWarning = ratio <= 0.5 && !isReturning

  return (
    <div
      className={`fixed top-5 right-20 sm:top-6 sm:right-4 z-[200] hidden sm:flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-md backdrop-blur-sm transition-all duration-300 ${className} ${isReturning
        ? 'border-reefGold/60 bg-gradient-to-r from-white/95 via-reefGold/15 to-white/95'
        : isUrgent
          ? 'border-red-400/50 bg-red-50/95'
          : isWarning
            ? 'border-amber-400/50 bg-amber-50/95'
            : 'border-reefGold/40 bg-gradient-to-r from-white/95 via-reefGold/10 to-white/95'
        }`}
      title='Session time — sign in again if you are away for 10 minutes'
      aria-live='polite'
      aria-label={`Session time remaining ${formatSessionIdleTime(remainingMs)}`}
    >
      <span className='relative flex h-2 w-2 shrink-0'>
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isReturning ? 'animate-ping bg-reefGold' : 'bg-reefGold'
            }`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-reefGold'
            }`}
        />
      </span>
      <div className='flex flex-col leading-none'>
        <span className='text-[9px] font-medium uppercase tracking-wider text-prussianBlue/70'>
          Session
        </span>
        <span
          className={`text-sm font-semibold tabular-nums tracking-wide ${isUrgent ? 'text-red-600' : 'text-prussianBlue'
            }`}
        >
          {formatSessionIdleTime(remainingMs)}
        </span>
      </div>
    </div>
  )
}
