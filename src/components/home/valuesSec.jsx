const STATS = [
  { value: '7000+', label: 'Deal Unters' },
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
    <div className={`text-center text-white px-4 ${className}`}>
      <b className='text-xl md:text-3xl lg:text-4xl xl:text-5xl'>{value}</b>
      <div className='mt-2 text-xs font-medium sm:mt-5 md:text-xl xl:text-3xl'>
        {label}
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

        <div className='hidden flex-row items-center justify-between sm:flex'>
          {STATS.map((stat) => (
            <StatBlock
              key={stat.label}
              value={stat.value}
              label={stat.label}
              className='md:w-1/4'
            />
          ))}
        </div>
      </div>
    </div>
  )
}
