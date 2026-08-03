'use client'

/**
 * Light white centered "FUNDS VERIFIER" overlay for listing cards / galleries.
 * Display-only companion to the burned-in upload watermark.
 */
export default function ListingWatermarkOverlay({
  title = 'FUNDS VERIFIER',
  subtitle = 'VERIFIED LISTING',
  className = '',
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center ${className}`}
      aria-hidden='true'
    >
      <span
        className='select-none text-center font-semibold uppercase tracking-[0.06em] text-white'
        style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: 'clamp(11px, 3.6vw, 18px)',
          opacity: 0.32,
          textShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      >
        {title}
      </span>
      <span
        className='mt-0.5 select-none text-center font-medium uppercase tracking-[0.14em] text-white'
        style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: 'clamp(7px, 1.8vw, 10px)',
          opacity: 0.28,
          textShadow: '0 1px 2px rgba(0,0,0,0.22)',
        }}
      >
        {subtitle}
      </span>
    </div>
  )
}
