'use client'

/**
 * Single clean display watermark for detail galleries.
 * Cards use the burned-in upload watermark only (no CSS overlay) to avoid doubles.
 */
export default function ListingWatermarkOverlay({
  title = 'FUNDS VERIFIER',
  subtitle = 'VERIFIED LISTING',
  className = '',
  size = 'md',
}) {
  const isLg = size === 'lg'
  const isSm = size === 'sm'

  const titleSize = isLg
    ? 'clamp(22px, 4.2vw, 42px)'
    : isSm
      ? 'clamp(9px, 2.8vw, 13px)'
      : 'clamp(11px, 3.6vw, 18px)'
  const subtitleSize = isLg
    ? 'clamp(10px, 1.8vw, 18px)'
    : isSm
      ? 'clamp(6px, 1.2vw, 8px)'
      : 'clamp(7px, 1.5vw, 11px)'

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center ${className}`}
      aria-hidden='true'
    >
      <span
        className='select-none text-center font-semibold uppercase tracking-[0.06em] text-white'
        style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: titleSize,
          opacity: isLg ? 0.6 : 0.55,
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      >
        {title}
      </span>
      {subtitle ? (
        <span
          className='mt-[0.35em] select-none text-center font-medium uppercase tracking-[0.18em] text-white'
          style={{
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: subtitleSize,
            opacity: isLg ? 0.55 : 0.5,
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {subtitle}
        </span>
      ) : null}
    </div>
  )
}
