import { getPrivateListingPreviewFacts } from '@/libs/privateListing'

const GOLD =
  'linear-gradient(90deg, #A2913E 0%, #D7C590 35.28%, #A2913E 68.99%, #D7C58F 100%)'

export default function PrivateListingPreviewFacts({ listing, className = '' }) {
  const facts = getPrivateListingPreviewFacts(listing)
  const threeCols = facts.length === 3

  return (
    <span
      className={`block w-full overflow-hidden rounded-2xl border border-[#D7C590]/45 bg-[#001c33]/88 shadow-[0_12px_32px_rgba(0,18,36,0.45)] backdrop-blur-md ${className}`}
    >
      <span className='block h-[3px] w-full' style={{ background: GOLD }} />
      <span
        className={`grid w-full gap-px bg-[#D7C590]/25 ${threeCols
            ? 'grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1.1fr)_minmax(0,0.75fr)]'
          }`}
      >
        {facts.map(({ key, label, value }) => (
          <span
            key={key}
            className='min-w-0 bg-[#00253f] px-2.5 py-3 text-left sm:px-3.5 sm:py-3.5'
          >
            <span className='flex items-center gap-1.5'>
              <span
                className='h-1.5 w-1.5 shrink-0 rounded-full'
                style={{ background: GOLD }}
              />
              <span className='text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D7C590]'>
                {label}
              </span>
            </span>
            <span
              className={`mt-1.5 block font-semibold leading-snug text-white ${key === 'area'
                  ? 'line-clamp-2 break-words text-[12px] sm:text-[13px]'
                  : 'truncate text-[13px] sm:text-[14px]'
                } ${key === 'price' || key === 'roi' ? 'text-[#F3E6B8]' : ''}`}
            >
              {value}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
