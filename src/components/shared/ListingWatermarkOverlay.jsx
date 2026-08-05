'use client'

/**
 * Single clean display watermark for detail galleries.
 * Cards use the burned-in upload watermark only (no CSS overlay) to avoid doubles.
 */
export default function ListingWatermarkOverlay({
  title = 'FUNDS VERIFIER',
  className = '',
  size = 'md',
}) {
  const isLg = size === 'lg'
  const isSm = size === 'sm'

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center ${className}`}
      aria-hidden='true'
    >
      <span
        className='select-none text-center font-semibold uppercase tracking-[0.06em] text-white'
        style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: isLg
            ? 'clamp(22px, 4.2vw, 42px)'
            : isSm
              ? 'clamp(9px, 2.8vw, 13px)'
              : 'clamp(11px, 3.6vw, 18px)',
          opacity: isLg ? 0.36 : 0.3,
          textShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      >
        {title}
      </span>
    </div>
  )
}
