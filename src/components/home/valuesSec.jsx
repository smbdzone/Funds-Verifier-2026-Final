const STATS = [
  { value: '7000+', label: 'Deal Hunters' },
  { value: '2500+', label: 'Available Assets' },
  { value: '3000+', label: 'Bought Items' },
  { value: '1500+', label: 'Sold Items' },
]

function StatBlock({ value, label, className = '', mobile = false }) {
  if (mobile) {
    return (
      <div className={`values-marquee-item ${className}`}>
        <b className='block text-xl'>{value}</b>
        <span className='mt-2 block text-xs font-medium'>{label}</span>
      </div>
    )
  }

  return (
    <div
      className={`flex h-full min-h-[7.5rem] w-full flex-col items-center justify-center px-2 text-center text-white md:min-h-[9rem] lg:min-h-[10rem] ${className}`}
    >
      <b className='block text-xl leading-none md:text-3xl lg:text-4xl xl:text-5xl'>
        {value}
      </b>
      <div className='mt-2 flex min-h-[2.5rem] items-center justify-center text-xs font-medium leading-tight sm:mt-4 sm:min-h-[3rem] md:min-h-[3.5rem] md:text-xl xl:min-h-[4rem] xl:text-3xl'>
        <span className='max-w-[12ch] md:max-w-none'>{label}</span>
      </div>
    </div>
  )
}

export default function ValuesSec() {
  return (
    <div className='valuesBg w-full py-5 pt-10 sm:px-10 sm:py-14 sm:pt-20 lg:px-20'>
      <div className='container mx-auto'>
        <div className='sm:hidden'>
          <div
            className='values-marquee-container'
            aria-label='Platform statistics'
          >
            {Array.from({ length: 2 }).map((_, groupIndex) => (
              <div key={groupIndex} className='values-marquee-content'>
                {STATS.map((stat) => (
                  <StatBlock
                    key={`${groupIndex}-${stat.label}`}
                    value={stat.value}
                    label={stat.label}
                    mobile
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className='hidden grid-cols-4 items-stretch gap-2 sm:grid md:gap-4'>
          {STATS.map((stat) => (
            <StatBlock
              key={stat.label}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
